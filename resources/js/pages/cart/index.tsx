import { Head, Link, router } from '@inertiajs/react';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { update as cartUpdate } from '@/routes/cart';
import { destroy as cartDestroy } from '@/routes/cart';

type CartItem = {
    id: number;
    product_id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        image: string | null;
    };
};

type PageProps = {
    cart: { items: CartItem[] } | null;
};

export default function CartIndex({ cart }: PageProps) {
    const items = cart?.items ?? [];
    const total = items.reduce((s: number, i: any) => s + Number(i.product.price) * i.quantity, 0);

    return (
        <>
            <Head title="Cart - FreshMart" />

            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div className="flex items-center gap-3">
                    <Link
                        href="/shop"
                        className="rounded-lg border border-input px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to shop
                    </Link>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Cart</h1>

                {items.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <>
                        <Card className="overflow-hidden">
                            <CardHeader className="px-6 py-4">
                                <CardTitle className="text-sm font-semibold tracking-tighter uppercase">Items</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border">
                                    {items.map((item) => (
                                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4">
                                            <div className="col-span-2 relative h-20 w-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                                {item.product.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                                        <ShoppingBag className="h-6 w-6 opacity-40" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-4">
                                                <p className="font-medium text-foreground">{item.product.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    ${Number(item.product.price).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="col-span-3 flex items-center gap-2">
                                                <button
                                                    onClick={() => router.patch(cartUpdate({ cartItem: item.id }), { quantity: Math.max(1, item.quantity - 1) })}
                                                    disabled={item.quantity <= 1}
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
                                                        const v = Math.max(1, Number(e.target.value) || 1);
                                                        if (v !== item.quantity) {
                                                            router.patch(cartUpdate({ cartItem: item.id }), { quantity: v });
                                                        }
                                                    }}
                                                    className="w-12 text-center text-sm border rounded-lg px-2"
                                                />
                                                <button
                                                    onClick={() => router.patch(cartUpdate({ cartItem: item.id }), { quantity: item.quantity + 1 })}
                                                    className="p-1.5 text-muted-foreground hover:text-foreground"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="col-span-2 text-right">
                                                <p className="font-medium text-foreground">
                                                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() => router.delete(cartDestroy({ cartItem: item.id }))}
                                                    className="mt-1 text-xs text-destructive hover:text-destructive/90 transition-colors"
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

                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-t border-border pt-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Order Total</p>
                                <p className="text-3xl font-bold text-foreground">${total.toFixed(2)}</p>
                            </div>
                            <Link
                                href="/checkout"
                                className="rounded-lg bg-green-600 px-8 py-3 text-lg text-white font-medium shadow-lg shadow-green-500/25 hover:bg-green-700 transition-colors"
                            >
                                Proceed to Checkout <ShoppingBag className="ml-2 h-4 w-4" />
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
        <Card className="text-center py-20 border border-dashed">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 mb-6">
                <ShoppingBag className="h-8 w-8 opacity-60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm mt-2">
                Add some fresh produce to get started.
            </p>
            <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm text-white font-medium shadow-sm hover:bg-green-700 transition-colors"
            >
                <ArrowLeft className="h-3 w-3" />
                Browse Products
            </Link>
        </Card>
    );
}
