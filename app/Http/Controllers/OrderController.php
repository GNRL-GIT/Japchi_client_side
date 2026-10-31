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
        $orders = Order::with('items.product')->where('user_id', $request->user()->id)->latest()->get();
        return Inertia::render('orders/index', ['orders' => $orders]);
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
