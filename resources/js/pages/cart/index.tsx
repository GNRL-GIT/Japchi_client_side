import { Head, Link, router } from '@inertiajs/react';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { update as cartUpdate } from '@/routes/cart';
import { destroy as cartDestroy } from '@/routes/cart';

type CartItem = {
    id: string;
    product_id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        image: string | null;
    };
    options: { id: string; name: string; price_delta: number }[];
    unit_price: number;
};

type PageProps = {
    cart: { items: CartItem[]; subtotal: number } | null;
    filters?: { search?: string | null };
};

export default function CartIndex({ cart, filters }: PageProps) {
    const items = cart?.items ?? [];
    const search = filters?.search?.trim() ?? '';
    const total = cart?.subtotal ?? 0;

    return (
        <>
            <Head title="Cart - Japchi" />

            <div className="mx-auto max-w-4xl space-y-8 p-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/shop"
                        className="rounded-lg border border-input px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to shop
                    </Link>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Your Cart
                </h1>

                {items.length === 0 ? (
                    search ? (
                        <Card className="border border-dashed py-20 text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                                <ShoppingBag className="h-8 w-8 opacity-60" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                No matching cart items
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                No products in your cart match &ldquo;{search}
                                &rdquo;.
                            </p>
                            <Link
                                href="/cart"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                            >
                                Clear search
                            </Link>
                        </Card>
                    ) : (
                        <EmptyCart />
                    )
                ) : (
                    <>
                        <Card className="overflow-hidden">
                            <CardHeader className="px-6 py-4">
                                <CardTitle className="text-sm font-semibold tracking-tighter uppercase">
                                    Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="divide-y divide-border">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="grid grid-cols-12 items-center gap-4 px-6 py-4"
                                        >
                                            <div className="relative col-span-2 h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                                                {item.product.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                        <ShoppingBag className="h-6 w-6 opacity-40" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-4">
                                                <p className="font-medium text-foreground">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    ₱
                                                    {Number(
                                                        item.unit_price,
                                                    ).toFixed(2)}
                                                </p>
                                                {item.options.length > 0 && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.options
                                                            .map(
                                                                (option) =>
                                                                    option.name,
                                                            )
                                                            .join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-3 flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        router.patch(
                                                            cartUpdate({
                                                                cartItem:
                                                                    item.id,
                                                            }),
                                                            {
                                                                quantity:
                                                                    Math.max(
                                                                        1,
                                                                        item.quantity -
                                                                            1,
                                                                    ),
                                                            },
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                    className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={item.quantity}
                                                    onBlur={(e) => {
                                                        const v = Math.max(
                                                            1,
                                                            Number(
                                                                e.target.value,
                                                            ) || 1,
                                                        );
                                                        if (
                                                            v !== item.quantity
                                                        ) {
                                                            router.patch(
                                                                cartUpdate({
                                                                    cartItem:
                                                                        item.id,
                                                                }),
                                                                { quantity: v },
                                                            );
                                                        }
                                                    }}
                                                    className="w-12 rounded-lg border px-2 text-center text-sm"
                                                />
                                                <button
                                                    onClick={() =>
                                                        router.patch(
                                                            cartUpdate({
                                                                cartItem:
                                                                    item.id,
                                                            }),
                                                            {
                                                                quantity:
                                                                    item.quantity +
                                                                    1,
                                                            },
                                                        )
                                                    }
                                                    className="p-1.5 text-muted-foreground hover:text-foreground"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="col-span-2 text-right">
                                                <p className="font-medium text-foreground">
                                                    ₱
                                                    {(
                                                        item.unit_price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        router.delete(
                                                            cartDestroy({
                                                                cartItem:
                                                                    item.id,
                                                            }),
                                                        )
                                                    }
                                                    className="mt-1 text-xs text-destructive transition-colors hover:text-destructive/90"
                                                >
                                                    <Trash2 className="mr-1 h-3 w-3" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col justify-between gap-6 border-t border-border pt-6 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Order Total
                                </p>
                                <p className="text-3xl font-bold text-foreground">
                                    ₱{total.toFixed(2)}
                                </p>
                            </div>
                            <Link
                                href="/checkout"
                                className="rounded-lg bg-green-600 px-8 py-3 text-lg font-medium text-white shadow-lg shadow-green-500/25 transition-colors hover:bg-green-700"
                            >
                                Proceed to Checkout{' '}
                                <ShoppingBag className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

function EmptyCart() {
    return (
        <Card className="border border-dashed py-20 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                <ShoppingBag className="h-8 w-8 opacity-60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
                Your cart is empty
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Add some ramen, dimsum, or drinks to get started.
            </p>
            <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
            >
                <ArrowLeft className="h-3 w-3" />
                Browse Products
            </Link>
        </Card>
    );
}
