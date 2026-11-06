<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->trim()->toString();
        $query = Order::where('user_id', $request->user()->id)->latest();

        if ($search !== '') {
            $query->whereHas('items.product', function ($productQuery) use ($search) {
                $productQuery->where('name', 'like', "%{$search}%");
            })->with(['items' => function ($itemsQuery) use ($search) {
                $itemsQuery->whereHas('product', function ($productQuery) use ($search) {
                    $productQuery->where('name', 'like', "%{$search}%");
                })->with('product');
            }]);
        } else {
            $query->with('items.product');
        }

        return Inertia::render('orders/index', [
            'orders' => $query->get(),
            'filters' => ['search' => $search !== '' ? $search : null],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['shipping_address' => 'required|string']);
        $cart = Cart::where('user_id', $request->user()->id)->with('items.product')->firstOrFail();
        if ($cart->items->isEmpty()) {
            return back()->withErrors(['cart' => 'Cart is empty']);
        }

        $total = $cart->items->sum(fn ($i) => $i->product->price * $i->quantity);

        $order = Order::create([
            'user_id' => $request->user()->id,
            'status' => 'pending',
            'total' => $total,
            'shipping_address' => $request->shipping_address,
        ]);

        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
            ]);
            $item->product->decrement('stock', $item->quantity);
        }

        $cart->items()->delete();
        return redirect()->route('orders.index');
    }
}
