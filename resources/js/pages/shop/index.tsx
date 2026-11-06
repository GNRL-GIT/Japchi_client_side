import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Plus,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { index as shopIndex } from '@/routes/shop';
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

export default function ShopIndex({
    products,
    categories,
    filters,
}: PageProps) {
    const [activeCategory, setActiveCategory] = useState(
        filters.category ?? '',
    );

    const query = {
        search: filters.search || undefined,
        category: activeCategory || undefined,
        page: 1,
    };

    return (
        <>
            <Head title="Shop - Japchi" />

            <div className="mx-auto max-w-7xl space-y-10 p-6">
                <div>
                    <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
                        Fresh Produce
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Farm-fresh fruits and vegetables, hand-picked and
                        delivered to your door.
                    </p>
                </div>

                {/* Category filters */}
                <Card className="p-6">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => {
                                setActiveCategory('');
                                router.get(
                                    shopIndex(),
                                    {
                                        search: filters.search || undefined,
                                        category: undefined,
                                        page: 1,
                                    },
                                    { preserveScroll: true },
                                );
                            }}
                            className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                                !activeCategory
                                    ? 'border border-green-100 bg-green-50 text-green-700 shadow-sm'
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
                                    router.get(
                                        shopIndex(),
                                        {
                                            search: filters.search || undefined,
                                            category: c.slug,
                                            page: 1,
                                        },
                                        { preserveScroll: true },
                                    );
                                }}
                                className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeCategory === c.slug
                                        ? 'border border-green-100 bg-green-50 text-green-700 shadow-sm'
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
                        Showing{' '}
                        <span className="font-medium text-foreground">
                            {products.from}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium text-foreground">
                            {products.to}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium text-foreground">
                            {products.total}
                        </span>{' '}
                        results
                    </p>
                    <div className="flex items-center gap-3">
                        {products.current_page > 1 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get(
                                        shopIndex(),
                                        {
                                            ...query,
                                            page: products.current_page - 1,
                                        },
                                        { preserveScroll: true },
                                    )
                                }
                            >
                                <ChevronLeft className="h-4 w-4" /> Prev
                            </Button>
                        )}
                        <span className="px-3">
                            Page {products.current_page} of {products.last_page}
                        </span>
                        {products.current_page < products.last_page && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    router.get(
                                        shopIndex(),
                                        {
                                            ...query,
                                            page: products.current_page + 1,
                                        },
                                        { preserveScroll: true },
                                    )
                                }
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
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <Card className="group flex flex-col overflow-hidden border border-border/50 transition-shadow duration-300 hover:shadow-xl">
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Package className="h-10 w-10 opacity-50" />
                    </div>
                )}
                {isOutOfStock && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                        <Badge
                            variant="destructive"
                            className="text-xs font-bold uppercase"
                        >
                            Out of Stock
                        </Badge>
                    </div>
                )}
                {isLowStock && !isOutOfStock && (
                    <div className="absolute top-3 right-3 z-20">
                        <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 text-xs text-green-700 uppercase"
                        >
                            Low Stock ({product.stock})
                        </Badge>
                    </div>
                )}
                <Badge
                    variant="outline"
                    className="absolute top-3 left-3 z-20 border-white/50 bg-white/90 backdrop-blur"
                >
                    {product.category?.name ?? 'General'}
                </Badge>
            </div>

            <CardContent className="px-5 pb-4">
                <CardTitle className="line-clamp-1 text-base font-semibold">
                    {product.name}
                </CardTitle>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-foreground">
                        ${Number(product.price).toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        /{product.unit}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="px-5 pt-0">
                {isOutOfStock ? (
                    <Button variant="outline" className="w-full" disabled>
                        Out of Stock
                    </Button>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href={`/shop/${product.id}`}
                            className="flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-primary"
                        >
                            View <ArrowRight className="h-3 w-3" />
                        </Link>
                        <button
                            onClick={() =>
                                router.post(cartStore(), {
                                    product_id: product.id,
                                    quantity: 1,
                                })
                            }
                            className="rounded-lg bg-green-600 px-3 py-2.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-50"
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
        <Card className="border border-dashed py-20 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                <Search className="h-8 w-8 opacity-60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
                No products found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filters.
            </p>
        </Card>
    );
}
