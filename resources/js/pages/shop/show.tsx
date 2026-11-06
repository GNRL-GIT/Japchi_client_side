import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ShoppingBag, ArrowLeft, Plus, Minus, CheckCircle2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { show as shopShow } from '@/routes/shop';
import { store as cartStore } from '@/routes/cart';

type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    unit: string;
    image: string | null;
    is_active: boolean;
    category: { id: number; name: string; slug: string } | null;
};

type PageProps = {
    product: Product;
};

export default function ShopShow({ product }: PageProps) {
    const [qty, setQty] = useState(1);
    const maxQty = Math.min(product.stock, 10);

    const isOutOfStock = product.stock === 0;

    return (
        <>
            <Head title={`${product.name} - Japchi`} />

            <div className="max-w-6xl mx-auto p-6 space-y-10">
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
                            <div className="aspect-[4/5] overflow-hidden rounded-xl bg-muted flex items-center justify-center border border-border/50">
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
                            <p className="text-xs text-muted-foreground text-center px-4 py-3">
                                {product.image ? 'Product image' : 'No image available'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Details */}
                    <div className="space-y-6">
                        <div>
                            <Badge variant="outline" className="bg-green-50 border-green-100 text-green-700">
                                {product.category?.name ?? 'General'}
                            </Badge>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">{product.name}</h1>
                            <p className="text-muted-foreground">
                                {product.unit} · {product.stock} in stock
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-green-50 border border-green-100">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-green-700">₱{Number(product.price).toFixed(2)}</span>
                                <span className="text-sm text-muted-foreground">/{product.unit}</span>
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">
                                {isOutOfStock ? 'Currently unavailable' : 'In stock and ready to order'}
                            </p>
                        </div>

                        <Card>
                            <CardHeader className="px-0 py-0">
                                <CardTitle className="text-sm font-semibold tracking-tighter">Description</CardTitle>
                            </CardHeader>
                            <CardContent className="px-0 py-0">
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {product.description}
                                </p>
                            </CardContent>
                        </Card>

                        {!isOutOfStock && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="quantity" className="text-sm font-medium text-foreground">
                                        Quantity
                                    </Label>
                                    <div className="flex items-center gap-1 border rounded-xl px-3 py-2.5 bg-background">
                                        <button
                                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                                            disabled={qty <= 1}
                                            className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min={1}
                                            max={maxQty}
                                            value={qty}
                                            onChange={(e) => {
                                                const v = Math.max(1, Math.min(maxQty, Number(e.target.value) || 1));
                                                setQty(v);
                                            }}
                                            className="w-12 text-center text-sm"
                                        />
                                        <button
                                            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                                            disabled={qty >= maxQty}
                                            className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => router.post(cartStore(), { product_id: product.id, quantity: qty })}
                                    disabled={isOutOfStock}
                                    className="w-full bg-green-600 text-white py-3 text-lg font-medium shadow-lg shadow-green-500/25 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Add to Cart
                                </Button>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Added to your cart for checkout
                                </p>
                            </div>
                        )}

                        {isOutOfStock && (
                            <Button variant="outline" className="w-full" disabled>
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
