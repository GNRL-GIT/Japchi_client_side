<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        $ramen = Category::create(['name' => 'Ramen', 'slug' => 'ramen', 'description' => 'Signature ramen bowls']);
        $dimsum = Category::create(['name' => 'Dimsum', 'slug' => 'dimsum', 'description' => 'Steamed and fried dimsum']);
        $drinks = Category::create(['name' => 'Drinks', 'slug' => 'drinks', 'description' => 'Refreshing drinks']);

        $items = [
            ['Tonkotsu Ramen', $ramen, 249.00, 40, 'bowl', 'Rich pork-bone broth with chashu, egg, and noodles'],
            ['Shoyu Ramen', $ramen, 229.00, 45, 'bowl', 'Soy-based broth with tender pork and bamboo shoots'],
            ['Spicy Miso Ramen', $ramen, 259.00, 35, 'bowl', 'Bold miso broth with chili oil and ground pork'],
            ['Pork Siomai', $dimsum, 89.00, 80, 'order', 'Steamed pork dumplings served with chili garlic sauce'],
            ['Hakaw', $dimsum, 99.00, 60, 'order', 'Delicate shrimp dumplings in translucent wrappers'],
            ['Gyoza', $dimsum, 119.00, 70, 'order', 'Pan-fried dumplings with savory pork filling'],
            ['Iced Milk Tea', $drinks, 79.00, 100, 'cup', 'Creamy milk tea served over ice'],
            ['Calamansi Juice', $drinks, 59.00, 100, 'glass', 'Fresh calamansi juice, sweet and tangy'],
            ['Japanese Soda', $drinks, 69.00, 90, 'bottle', 'Classic ramune-style soda'],
        ];

        foreach ($items as [$name, $cat, $price, $stock, $unit, $description]) {
            Product::create([
                'category_id' => $cat->id,
                'name' => $name,
                'slug' => strtolower(str_replace(' ', '-', $name)),
                'description' => $description,
                'price' => $price,
                'stock' => $stock,
                'unit' => $unit,
                'is_active' => true,
            ]);
        }
    }
}
