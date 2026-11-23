import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ShoppingBag,
    ArrowLeft,
    Plus,
    Minus,
    CheckCircle2,
    Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { show as shopShow } from '@/routes/shop';
import { store as cartStore } from '@/routes/cart';

type Product = {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    image: string | null;
    is_active: boolean;
    available: boolean;
    groups: {
        id: string;
        name: string;
        min_select: number;
        max_select: number;
        options: {
            id: string;
            name: string;
            price_delta: number;
            available: boolean;
        }[];
    }[];
    category: { id: string; name: string; slug: string } | null;
};

type PageProps = {
    product: Product;
    store: { is_open: boolean; closed_message: string };
};

export default function ShopShow({ product, store }: PageProps) {
    const [qty, setQty] = useState(1);
    const [selected, setSelected] = useState<string[]>([]);
    const isOutOfStock = !product.available;
    const maxQty = 20;
    const selectedOptions = product.groups.flatMap((group) =>
        group.options.filter((option) => selected.includes(option.id)),
    );
    const total =
        (Number(product.price) +
            selectedOptions.reduce(
                (sum, option) => sum + Number(option.price_delta),
                0,
            )) *
        qty;
    const ready = product.groups.every((group) => {
        const count = group.options.filter((option) =>
            selected.includes(option.id),
        ).length;
        return count >= group.min_select && count <= group.max_select;
    });

    function toggleOption(
        groupId: string,
        optionId: string,
        maxSelect: number,
    ) {
        const group = product.groups.find((entry) => entry.id === groupId);
        const groupOptionIds = new Set(
            group?.options.map((option) => option.id) ?? [],
        );
        setSelected((current) => {
            const selectedInGroup = current.filter((id) =>
                groupOptionIds.has(id),
            );
            const others = current.filter((id) => !groupOptionIds.has(id));
            if (selectedInGroup.includes(optionId)) {
                return [
                    ...others,
                    ...selectedInGroup.filter((id) => id !== optionId),
                ];
            }
            if (maxSelect === 1) return [...others, optionId];
            if (selectedInGroup.length >= maxSelect) return current;
            return [...current, optionId];
        });
    }

    return (
        <>
            <Head title={`${product.name} - Japchi`} />

            <div className="mx-auto max-w-6xl space-y-10 p-6">
                {!store.is_open && (
                    <div
                        role="status"
                        className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900"
                    >
                        {store.closed_message}
                    </div>
                )}
                <div className="flex items-center gap-3">
                    <Link
                        href="/shop"
                        className="rounded-lg border border-input px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to shop
                    </Link>
                </div>

                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Image */}
                    <Card className="flex flex-col">
                        <CardHeader className="px-0 py-0">
                            <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-muted">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Package className="h-16 w-16 text-muted-foreground opacity-40" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="px-0 py-0">
                            <p className="px-4 py-3 text-center text-xs text-muted-foreground">
                                {product.image
                                    ? 'Product image'
                                    : 'No image available'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Details */}
                    <div className="space-y-6">
                        <div>
                            <Badge
                                variant="outline"
                                className="border-green-100 bg-green-50 text-green-700"
                            >
                                {product.category?.name ?? 'General'}
                            </Badge>
                            <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">
                                {product.name}
                            </h1>
                            <p className="text-muted-foreground">
                                {product.available
                                    ? 'Available to order'
                                    : 'Currently unavailable'}
                            </p>
                        </div>

                        <div className="rounded-xl border border-green-100 bg-green-50 p-6">
                            <div className="text-4xl font-bold text-green-700">
                                ₱{Number(product.price).toFixed(2)}
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">
                                {isOutOfStock
                                    ? 'Currently unavailable'
                                    : 'In stock and ready to order'}
                            </p>
                        </div>

                        <Card>
                            <CardHeader className="px-0 py-0">
                                <CardTitle className="text-sm font-semibold tracking-tighter">
                                    Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-0 py-0">
                                <p className="line-clamp-3 text-sm text-muted-foreground">
                                    {product.description}
                                </p>
                            </CardContent>
                        </Card>

                        {!isOutOfStock && (
                            <div className="space-y-4">
                                {product.groups.map((group) => (
                                    <fieldset
                                        key={group.id}
                                        className="space-y-2"
                                    >
                                        <legend className="text-sm font-semibold">
                                            {group.name}{' '}
                                            {group.min_select > 0
                                                ? '(required)'
                                                : '(optional)'}
                                        </legend>
                                        <div className="flex flex-wrap gap-2">
                                            {group.options.map((option) => {
                                                const active =
                                                    selected.includes(
                                                        option.id,
                                                    );
                                                return (
                                                    <button
                                                        key={option.id}
                                                        type="button"
                                                        aria-pressed={active}
                                                        disabled={
                                                            !option.available
                                                        }
                                                        onClick={() =>
                                                            toggleOption(
                                                                group.id,
                                                                option.id,
                                                                group.max_select,
                                                            )
                                                        }
                                                        className={`rounded-lg border px-3 py-2 text-sm disabled:opacity-50 ${active ? 'border-green-700 bg-green-50 text-green-800' : 'border-input bg-background'}`}
                                                    >
                                                        {option.name}
                                                        {Number(
                                                            option.price_delta,
                                                        ) > 0
                                                            ? ` (+₱${Number(option.price_delta).toFixed(2)})`
                                                            : ''}
                                                        {!option.available &&
                                                            ' (unavailable)'}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </fieldset>
                                ))}
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="quantity"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Quantity
                                    </Label>
                                    <div className="flex items-center gap-1 rounded-xl border bg-background px-3 py-2.5">
                                        <button
                                            onClick={() =>
                                                setQty((q) =>
                                                    Math.max(1, q - 1),
                                                )
                                            }
                                            disabled={qty <= 1}
                                            className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <input
                                            id="quantity"
                                            type="number"
                                            min={1}
                                            max={maxQty}
                                            value={qty}
                                            onChange={(e) => {
                                                const v = Math.max(
                                                    1,
                                                    Math.min(
                                                        maxQty,
                                                        Number(
                                                            e.target.value,
                                                        ) || 1,
                                                    ),
                                                );
                                                setQty(v);
                                            }}
                                            className="w-12 rounded-md border bg-background px-1 text-center text-sm"
                                        />
                                        <button
                                            onClick={() =>
                                                setQty((q) =>
                                                    Math.min(maxQty, q + 1),
                                                )
                                            }
                                            disabled={qty >= maxQty}
                                            className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    onClick={() =>
                                        router.post(cartStore(), {
                                            product_id: product.id,
                                            quantity: qty,
                                            modifier_ids: selected,
                                        })
                                    }
                                    disabled={
                                        isOutOfStock || !ready || !store.is_open
                                    }
                                    className="w-full bg-green-600 py-3 text-lg font-medium text-white shadow-lg shadow-green-500/25 transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Add to Cart · ₱{total.toFixed(2)}
                                </Button>
                                <p className="flex items-center gap-1 text-xs text-green-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Added to your cart for checkout
                                </p>
                            </div>
                        )}

                        {isOutOfStock && (
                            <Button
                                variant="outline"
                                className="w-full"
                                disabled
                            >
                                <Package className="mr-2 h-4 w-4" />
                                Out of Stock
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
