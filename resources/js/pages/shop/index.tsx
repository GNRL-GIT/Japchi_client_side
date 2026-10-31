import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Filter, ShoppingBag, Plus, ArrowRight, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index as shopIndex, show as shopShow } from '@/routes/shop';
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
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    categories: { id: number; name: string; slug: string }[];
    filters: { search?: string; category?: string };
};

export default function ShopIndex({ products, categories, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [activeCategory, setActiveCategory] = useState(filters.category ?? '');

    const query = {
        search,
        category: activeCategory || undefined,
        page: 1,
    };

    return (
        <>
            <Head title="Shop" />

            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Fresh Produce</h1>
                        <p className="text-muted-foreground">
                            Browse our selection of farm-fresh fruits and vegetables.
                        </p>
                    </div>
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground font-medium shadow-sm hover:bg-primary/90 transition-colors"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        View Cart
                    </Link>
                </div>

                {/* Search & filters */}
                <Card className="p-4">
                    <CardHeader className="px-0 py-0 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                            <Label htmlFor="search" className="sr-only">
                                Search products
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && router.get(shopIndex(), query, { preserveScroll: true })}
                                    placeholder="Search fruits & vegetables..."
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={() => router.get(shopIndex(), { ...query, page: 1 }, { preserveScroll: true })}
                            className="w-auto"
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Apply Filters
                        </Button>
                    </CardHeader>

                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                        <button
                            onClick={() => {
                                setActiveCategory('');
                                router.get(shopIndex(), { ...query, category: undefined, page: 1 }, { preserveScroll: true });
                            }}
                            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                !activeCategory
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'border border-input bg-background hover:bg-accent'
                            }`}
                        >
                            All
                        </button>
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => {
                                    setActiveCategory(c.slug);
                                    router.get(shopIndex(), { ...query, category: c.slug, page: 1 }, { preserveScroll: true });
                                }}
                                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    activeCategory === c.slug
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'border border-input bg-background hover:bg-accent'
                                }`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Results info */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>
                        Showing <span className="font-medium">{products.from}</span> to{' '}
                        <span className="font-medium">{products.to}</span> of{' '}
                        <span className="font-medium">{products.total}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        {products.current_page > 1 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.get(shopIndex(), { ...query, page: products.current_page - 1 }, { preserveScroll: true })}
                            >
                                <ChevronLeft className="h-4 w-4" /> Prev
                            </Button>
                        )}
                        <span className="px-2">
                            Page {products.current_page} of {products.last_page}
                        </span>
                        {products.current_page < products.last_page && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.get(shopIndex(), { ...query, page: products.current_page + 1 }, { preserveScroll: true })}
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Product grid */}
                {products.data.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function ProductCard({ product }: { product: Product }) {
    const isLowStock = product.stock <= 5;
    const isOutOfStock = product.stock === 0;

    return (
        <Card className="flex flex-col overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <Package className="h-10 w-10 opacity-50" />
                    </div>
                )}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Badge variant="destructive" className="uppercase text-xs font-bold">
                            Out of Stock
                        </Badge>
                    </div>
                )}
                {isLowStock && !isOutOfStock && (
                    <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="uppercase text-xs">
                            Low Stock ({product.stock})
                        </Badge>
                    </div>
                )}
            </div>

            <CardContent className="px-4 pb-3">
                <Badge variant="outline" className="mr-2">
                    {product.category?.name ?? 'General'}
                </Badge>
                <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {product.description}
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold">${Number(product.price).toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">/{product.unit}</span>
                </div>
            </CardContent>

            <CardFooter className="px-4 pt-0">
                {isOutOfStock ? (
                    <Button variant="outline" className="w-full" disabled>
                        Out of Stock
                    </Button>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href={shopShow({ product: product.id })}
                            className="flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                        >
                            View <ArrowRight className="h-3 w-3" />
                        </Link>
                        <button
                            onClick={() => router.post(cartStore(), { product_id: product.id, quantity: 1 })}
                            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground font-medium shadow-sm hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-3 w-3" /> Add
                        </button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}

function EmptyState() {
    return (
        <Card className="text-center py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                <Search className="h-8 w-8 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold">No products found</h3>
            <p className="text-muted-foreground text-sm mt-1">
                Try adjusting your search or filters.
            </p>
        </Card>
    );
}
