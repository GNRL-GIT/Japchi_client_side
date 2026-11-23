<?php

namespace App\Services;

use Illuminate\Support\Str;

class CustomerCart
{
    private const SESSION_KEY = 'customer_cart';

    public function lines(): array
    {
        return session(self::SESSION_KEY, []);
    }

    public function add(string $menuItemId, int $quantity, array $modifierIds): bool
    {
        sort($modifierIds);
        $key = hash('sha256', $menuItemId.':'.implode(',', $modifierIds));
        $lines = $this->lines();
        $existing = $lines[$key] ?? null;
        $newQuantity = ($existing['quantity'] ?? 0) + $quantity;
        if ($newQuantity > 20) {
            return false;
        }

        $lines[$key] = [
            'id' => $existing['id'] ?? (string) Str::uuid(),
            'menu_item_id' => $menuItemId,
            'quantity' => $newQuantity,
            'modifier_ids' => $modifierIds,
        ];
        session([self::SESSION_KEY => $lines]);

        return true;
    }

    public function setQuantity(string $lineId, int $quantity): bool
    {
        $lines = $this->lines();
        foreach ($lines as $key => $line) {
            if ($line['id'] === $lineId) {
                $lines[$key]['quantity'] = $quantity;
                session([self::SESSION_KEY => $lines]);

                return true;
            }
        }

        return false;
    }

    public function remove(string $lineId): bool
    {
        $lines = $this->lines();
        foreach ($lines as $key => $line) {
            if ($line['id'] === $lineId) {
                unset($lines[$key]);
                session([self::SESSION_KEY => $lines]);

                return true;
            }
        }

        return false;
    }

    public function present(Supabase $supabase, string $search = ''): array
    {
        $menu = $supabase->publicMenu();
        $items = collect($menu['items'] ?? [])->keyBy('id');
        $presented = [];
        $subtotal = 0.0;

        foreach ($this->lines() as $line) {
            $item = $items->get($line['menu_item_id']);
            if (! $item) {
                $item = [
                    'id' => $line['menu_item_id'],
                    'name' => 'Unavailable menu item',
                    'description' => null,
                    'price' => 0,
                    'image_path' => null,
                    'available' => false,
                    'groups' => [],
                ];
            }

            $optionsById = collect($item['groups'] ?? [])
                ->flatMap(fn ($group) => $group['options'] ?? [])
                ->keyBy('id');
            $options = collect($line['modifier_ids'])
                ->map(fn ($id) => $optionsById->get($id))
                ->filter()
                ->values()
                ->map(fn ($option) => [
                    'id' => $option['id'],
                    'name' => $option['name'],
                    'price_delta' => (float) $option['price_delta'],
                ])->all();

            $category = collect($menu['categories'] ?? [])
                ->firstWhere('id', $item['category_id'] ?? null);
            $product = [
                'id' => $item['id'],
                'name' => $item['name'],
                'slug' => Str::slug($item['name']),
                'description' => $item['description'] ?? '',
                'price' => (float) $item['price'],
                'image' => Supabase::photoUrl($item['image_path'] ?? null),
                'is_active' => (bool) ($item['available'] ?? false),
                'available' => (bool) ($item['available'] ?? false),
                'category' => $category ? [
                    'id' => $category['id'],
                    'name' => $category['name'],
                    'slug' => Str::slug($category['name']),
                ] : null,
            ];
            $name = Str::lower($product['name']);
            if ($search !== '' && ! str_contains($name, Str::lower($search))) {
                continue;
            }

            $unitPrice = $product['price'] + array_sum(array_column($options, 'price_delta'));
            $subtotal += $unitPrice * $line['quantity'];
            $presented[] = [
                'id' => $line['id'],
                'product_id' => $line['menu_item_id'],
                'quantity' => $line['quantity'],
                'product' => $product,
                'options' => $options,
                'unit_price' => $unitPrice,
            ];
        }

        return ['items' => $presented, 'subtotal' => $subtotal];
    }
}
