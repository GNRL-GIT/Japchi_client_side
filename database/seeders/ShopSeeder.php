<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        $fruits = Category::create(['name' => 'Fruits', 'slug' => 'fruits', 'description' => 'Fresh fruits']);
        $veg = Category::create(['name' => 'Vegetables', 'slug' => 'vegetables', 'description' => 'Fresh vegetables']);

        $items = [
            ['Apple', $fruits, 1.50, 100, 'kg'],
            ['Banana', $fruits, 0.80, 150, 'kg'],
            ['Orange', $fruits, 2.00, 80, 'kg'],
            ['Mango', $fruits, 3.50, 60, 'kg'],
            ['Carrot', $veg, 1.20, 120, 'kg'],
            ['Broccoli', $veg, 2.50, 50, 'kg'],
            ['Tomato', $veg, 1.80, 90, 'kg'],
            ['Spinach', $veg, 1.00, 70, 'bunch'],
        ];

        foreach ($items as [$name, $cat, $price, $stock, $unit]) {
            Product::create([
                'category_id' => $cat->id,
                'name' => $name,
                'slug' => strtolower($name),
                'description' => "Fresh {$name}",
                'price' => $price,
                'stock' => $stock,
                'unit' => $unit,
                'is_active' => true,
            ]);
        }
    }
}
