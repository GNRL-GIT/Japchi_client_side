<?php

namespace App\Http\Controllers;

use App\Services\CustomerCart;
use App\Services\Supabase;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index(Request $request, CustomerCart $cart, Supabase $supabase)
    {
        $search = $request->string('search')->trim()->toString();
        $presented = $cart->present($supabase, $search);

        return Inertia::render('cart/index', [
            'cart' => $presented,
            'filters' => ['search' => $search !== '' ? $search : null],
        ]);
    }

    public function store(Request $request, CustomerCart $cart, Supabase $supabase)
    {
        $data = $request->validate([
            'product_id' => 'required|uuid',
            'quantity' => 'nullable|integer|min:1|max:20',
            'modifier_ids' => 'sometimes|array|max:30',
            'modifier_ids.*' => 'uuid',
        ]);
        $item = collect($supabase->publicMenu()['items'] ?? [])->firstWhere('id', $data['product_id']);
        if (! $item || ! ($item['available'] ?? false)) {
            throw ValidationException::withMessages(['cart' => 'This item is no longer available.']);
        }

        $modifierIds = $data['modifier_ids'] ?? [];
        if (count($modifierIds) !== count(array_unique($modifierIds))) {
            throw ValidationException::withMessages(['cart' => 'An option was selected more than once.']);
        }
        $selectedCount = 0;
        foreach ($item['groups'] ?? [] as $group) {
            $groupOptions = collect($group['options'] ?? []);
            $selected = $groupOptions->whereIn('id', $modifierIds);
            $count = $selected->count();
            if ($count < (int) $group['min_select'] || $count > (int) $group['max_select'] || $selected->contains('available', false)) {
                throw ValidationException::withMessages(['cart' => 'Choose available options for '.$item['name'].'.']);
            }
            $selectedCount += $count;
        }
        if ($selectedCount !== count($modifierIds)) {
            throw ValidationException::withMessages(['cart' => 'One or more selected options are invalid for this item.']);
        }

        if (! $cart->add($item['id'], (int) ($data['quantity'] ?? 1), $modifierIds)) {
            throw ValidationException::withMessages(['cart' => 'Choose a quantity between 1 and 20 for each item.']);
        }

        return back();
    }

    public function update(Request $request, string $cartItem, CustomerCart $cart)
    {
        $data = $request->validate(['quantity' => 'required|integer|min:1|max:20']);
        abort_unless($cart->setQuantity($cartItem, (int) $data['quantity']), 404);

        return back();
    }

    public function destroy(string $cartItem, CustomerCart $cart)
    {
        abort_unless($cart->remove($cartItem), 404);

        return back();
    }

    public function checkout(CustomerCart $cart, Supabase $supabase)
    {
        $presented = $cart->present($supabase);
        if ($presented['items'] === []) {
            return redirect()->route('cart.index');
        }

        return Inertia::render('checkout/index', [
            'cart' => $presented,
            'store' => $supabase->publicMenu()['store'] ?? ['is_open' => false, 'closed_message' => 'Store unavailable.'],
        ]);
    }
}
