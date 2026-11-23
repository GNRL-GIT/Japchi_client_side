<?php

namespace App\Http\Controllers;

use App\Services\Supabase;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request, Supabase $supabase)
    {
        $menu = $supabase->publicMenu();
        $categories = collect($menu['categories'] ?? [])->map(fn ($category) => [
            'id' => $category['id'],
            'name' => $category['name'],
            'slug' => Str::slug($category['name']),
        ]);
        $categoryIds = $categories->keyBy('slug');
        $items = collect($menu['items'] ?? [])
            ->filter(fn ($item) => $request->filled('search')
                ? str_contains(Str::lower($item['name']), Str::lower((string) $request->input('search')))
                : true)
            ->filter(fn ($item) => ! $request->filled('category')
                || ($categoryIds->get($request->input('category'))['id'] ?? null) === $item['category_id'])
            ->map(fn ($item) => $this->presentItem($item, $categories))
            ->values();

        $page = LengthAwarePaginator::resolveCurrentPage();
        $perPage = 12;
        $products = new LengthAwarePaginator(
            $items->forPage($page, $perPage)->values(),
            $items->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()],
        );

        return Inertia::render('shop/index', [
            'products' => $products,
            'categories' => $categories->values(),
            'store' => $menu['store'] ?? ['is_open' => false, 'closed_message' => 'Store unavailable.'],
            'filters' => $request->only('search', 'category'),
        ]);
    }

    public function show(string $product, Supabase $supabase)
    {
        $menu = $supabase->publicMenu();
        $item = collect($menu['items'] ?? [])->firstWhere('id', $product);
        abort_unless($item, 404);

        $categories = collect($menu['categories'] ?? []);

        return Inertia::render('shop/show', [
            'product' => $this->presentItem($item, $categories),
            'store' => $menu['store'] ?? ['is_open' => false, 'closed_message' => 'Store unavailable.'],
        ]);
    }

    private function presentItem(array $item, $categories): array
    {
        $category = $categories->firstWhere('id', $item['category_id'] ?? null);

        return [
            'id' => $item['id'],
            'name' => $item['name'],
            'slug' => Str::slug($item['name']),
            'description' => $item['description'] ?? '',
            'price' => (float) $item['price'],
            'image' => Supabase::photoUrl($item['image_path'] ?? null),
            'available' => (bool) ($item['available'] ?? false),
            'is_active' => true,
            'groups' => array_map(fn ($group) => [
                'id' => $group['id'],
                'name' => $group['name'],
                'min_select' => (int) $group['min_select'],
                'max_select' => (int) $group['max_select'],
                'options' => array_map(fn ($option) => [
                    'id' => $option['id'],
                    'name' => $option['name'],
                    'price_delta' => (float) $option['price_delta'],
                    'available' => (bool) ($option['available'] ?? false),
                ], $group['options'] ?? []),
            ], $item['groups'] ?? []),
            'category' => $category ? [
                'id' => $category['id'],
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
            ] : null,
        ];
    }
}
