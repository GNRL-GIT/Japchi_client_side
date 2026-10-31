<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('category')->where('is_active', true)
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($request->category, fn ($q, $c) => $q->whereHas('category', fn ($q) => $q->where('slug', $c)))
            ->paginate(12);

        return Inertia::render('shop/index', [
            'products' => $products,
            'categories' => \App\Models\Category::all(),
            'filters' => $request->only('search', 'category'),
        ]);
    }

    public function show(Product $product)
    {
        return Inertia::render('shop/show', ['product' => $product->load('category')]);
    }
}
