<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    private function cart(Request $request): Cart
    {
        return Cart::firstOrCreate(['user_id' => $request->user()->id]);
    }

    public function index(Request $request)
    {
        $cart = $this->cart($request);
        $search = $request->string('search')->trim()->toString();
        $query = $cart->items()->with('product');

        if ($search !== '') {
            $query->whereHas('product', function ($productQuery) use ($search) {
                $productQuery->where('name', 'like', "%{$search}%");
            });
        }

        $cart->setRelation('items', $query->get());

        return Inertia::render('cart/index', [
            'cart' => $cart,
            'filters' => ['search' => $search !== '' ? $search : null],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id', 'quantity' => 'integer|min:1']);
        $cart = $this->cart($request);
        $item = CartItem::firstOrNew(['cart_id' => $cart->id, 'product_id' => $request->product_id]);
        $item->quantity = ($item->exists ? $item->quantity : 0) + ($request->quantity ?? 1);
        $item->save();
        return back();
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);
        $cartItem->update(['quantity' => $request->quantity]);
        return back();
    }

    public function destroy(CartItem $cartItem)
    {
        $cartItem->delete();
        return back();
    }
}
