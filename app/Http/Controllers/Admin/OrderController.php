<?php

namespace App\Http\Controllers\Admin;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends \App\Http\Controllers\Controller
{
    public function index()
    {
        return Inertia::render('admin/orders', ['orders' => Order::with('items.product', 'user')->latest()->get()]);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|string']);
        $order->update(['status' => $request->status]);
        return back();
    }
}
