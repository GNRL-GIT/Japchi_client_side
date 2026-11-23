<?php

namespace App\Http\Controllers;

use App\Services\CustomerCart;
use App\Services\Supabase;
use App\Services\SupabaseException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request, Supabase $supabase)
    {
        $search = $request->string('search')->trim()->toString();
        $orders = collect($supabase->myOrders())
            ->map(fn ($order) => $this->presentOrder($order))
            ->filter(fn ($order) => $search === '' || collect($order['items'])->contains(
                fn ($item) => str_contains(Str::lower($item['product']['name']), Str::lower($search)),
            ))
            ->values();

        return Inertia::render('orders/index', [
            'orders' => $orders,
            'filters' => ['search' => $search !== '' ? $search : null],
            'status' => session('status'),
        ]);
    }

    public function store(Request $request, CustomerCart $cart, Supabase $supabase)
    {
        $data = $request->validate([
            'order_type' => 'required|in:dine_in,takeout,courier_pickup',
            'courier_name' => 'nullable|string|max:80',
            'courier_ref' => 'nullable|string|max:80',
            'notes' => 'nullable|string|max:200',
        ]);
        $lines = array_values($cart->lines());
        if ($lines === []) {
            throw ValidationException::withMessages(['order_type' => 'Your cart is empty.']);
        }

        $items = array_map(fn ($line) => [
            'menu_item_id' => $line['menu_item_id'],
            'qty' => $line['quantity'],
            'modifier_ids' => $line['modifier_ids'],
        ], $lines);
        $orderDetails = [
            'order_type' => $data['order_type'],
            'items' => $items,
            'courier_name' => $data['courier_name'] ?? '',
            'courier_ref' => $data['courier_ref'] ?? '',
            'notes' => $data['notes'] ?? '',
        ];
        $fingerprint = hash('sha256', json_encode($orderDetails, JSON_THROW_ON_ERROR));
        $pending = session('pending_customer_order');
        if (($pending['fingerprint'] ?? null) !== $fingerprint) {
            $pending = ['fingerprint' => $fingerprint, 'id' => (string) Str::uuid()];
            session(['pending_customer_order' => $pending]);
        }

        try {
            $order = $supabase->placeOrder(
                $pending['id'],
                $data['order_type'],
                $items,
                $data['courier_name'] ?? null,
                $data['courier_ref'] ?? null,
                $data['notes'] ?? null,
            );
        } catch (SupabaseException $exception) {
            throw ValidationException::withMessages(['order_type' => $exception->getMessage()]);
        }

        session()->forget(['customer_cart', 'pending_customer_order']);

        return redirect()->route('orders.index')
            ->with('status', 'Order #'.($order['order_no'] ?? '').' placed. Please pay at the counter.');
    }

    public function cancel(string $orderId, Supabase $supabase)
    {
        abort_unless(Str::isUuid($orderId), 404);
        $supabase->cancelOrder($orderId);

        return back()->with('status', 'Your order was cancelled.');
    }

    public function reorder(string $orderId, Supabase $supabase, CustomerCart $cart)
    {
        abort_unless(Str::isUuid($orderId), 404);
        $order = $supabase->myOrder($orderId);
        abort_unless($order, 404);

        foreach ($order['order_items'] ?? [] as $item) {
            $modifierIds = array_column($item['order_item_modifiers'] ?? [], 'modifier_id');
            if (! $cart->add($item['menu_item_id'], (int) $item['qty'], $modifierIds)) {
                throw ValidationException::withMessages(['cart' => 'An item quantity exceeds the maximum allowed.']);
            }
        }

        return redirect()->route('cart.index');
    }

    private function presentOrder(array $order): array
    {
        return [
            'id' => $order['id'],
            'order_no' => $order['order_no'],
            'status' => $order['status'],
            'order_type' => $order['order_type'],
            'total' => (float) $order['total'],
            'notes' => $order['notes'] ?? null,
            'courier_name' => $order['courier_name'] ?? null,
            'courier_ref' => $order['courier_ref'] ?? null,
            'created_at' => $order['created_at'],
            'items' => array_map(fn ($item) => [
                'id' => $item['id'],
                'product_id' => $item['menu_item_id'],
                'product' => ['name' => $item['name_snapshot'], 'image' => null],
                'quantity' => (int) $item['qty'],
                'price' => (float) $item['unit_price'],
                'options' => array_map(fn ($modifier) => [
                    'id' => $modifier['modifier_id'],
                    'name' => $modifier['name_snapshot'],
                ], $item['order_item_modifiers'] ?? []),
            ], $order['order_items'] ?? []),
        ];
    }
}
