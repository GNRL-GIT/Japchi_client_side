<?php

namespace App\Http\Controllers\Admin;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends \App\Http\Controllers\Controller
{
    public function index()
    {
        $revenue = Order::sum('total');
        $orders = Order::count();
        $products = Product::count();
        $lowStock = Product::where('stock', '<', 10)->count();

        return Inertia::render('admin/dashboard', [
            'stats' => compact('revenue', 'orders', 'products', 'lowStock'),
        ]);
    }
}
