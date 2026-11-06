import { Head, Link, usePage } from '@inertiajs/react';
import {
    ShoppingBag,
    ArrowRight,
    Truck,
    Leaf,
    PhilippinePeso,
    Clock,
    MapPin,
    Phone,
    Mail,
    Instagram,
    Facebook,
    Twitter,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Welcome() {
    const { auth } = usePage().props;

    const features = [
        {
            icon: Leaf,
            title: '100% Fresh',
            description: 'Farm-fresh produce delivered straight to your table.',
        },
        {
            icon: Truck,
            title: 'Fast Delivery',
            description: 'Quick and reliable delivery to your doorstep.',
        },
        {
            icon: PhilippinePeso,
            title: 'Best Prices',
            description: 'Competitive prices on all your favorite items.',
        },
        {
            icon: Clock,
            title: 'Open Daily',
            description: 'We are open every day to serve you fresh groceries.',
        },
    ];

    const categories = [
        { name: 'Fruits', slug: 'fruits', count: 12 },
        { name: 'Vegetables', slug: 'vegetables', count: 15 },
        { name: 'Herbs', slug: 'herbs', count: 8 },
        { name: 'Baskets', slug: 'baskets', count: 5 },
    ];

    return (
        <>
            <Head title="Japchi" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold text-xl tracking-tight"
                    >
                        <div className="rounded-lg bg-primary p-2 flex items-center justify-center">
                            <Leaf className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-foreground">JAPCHI</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground">
                        <Link
                            href="/shop"
                            className="hover:text-primary transition-colors"
                        >
                            Shop
                        </Link>
                        {auth.user ? (
                            <>
                                <Link
                                    href="/cart"
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                    Cart
                                </Link>
                                <Link href="/dashboard" className="hover:text-primary transition-colors">
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="hover:text-primary transition-colors">
                                    Log in
                                </Link>
                                <Link href="/register" className="hover:text-primary transition-colors">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="md:hidden">
                        <Button size="sm" className="ml-2">
                            <ShoppingBag className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-12 lg:pt-24 lg:pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-100 mb-6">
                                <Leaf className="h-3 w-3" />
                                <span>Fresh produce delivered daily</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                                Fresh, <br />
                                <span className="text-primary">Farm-to-Table</span> Goodness
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                                Discover the finest selection of seasonal fruits and vegetables,
                                hand-picked from local farms and delivered straight to your door.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="px-8 py-3 text-lg flex items-center gap-2"
                                    asChild
                                >
                                    <Link href="/shop">
                                        Order Now <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                                    Browse Categories
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 aspect-[4/5]">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-yellow-100 dark:from-green-900/20 dark:to-yellow-900/20 opacity-50"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-green-600 dark:text-green-400 opacity-30">
                                    <Leaf className="h-32 w-32" />
                                </div>
                                <div className="absolute -inset-px bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-2xl mask mask-[linear-gradient(transparent,_0,_0),linear-gradient(transparent,_0,_0)_border-box,_linear-gradient(transparent,_0,_0)] -webkit-mask-composite destination-out sm:inset-0"></div>
                                <div className="relative z-10 h-full w-full">
                                    <img
                                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
                                        alt="Fresh fruits and vegetables"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -left-6 flex items-center gap-3 bg-white dark:bg-card p-4 rounded-xl shadow-lg border border-border animate-bounce">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                                    <Leaf className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">₱2.50/kg</p>
                                    <p className="text-xs text-muted-foreground">Organic Apples</p>
                                </div>
                            </div>
                            <div className="absolute -top-6 -right-6 flex items-center gap-3 bg-white dark:bg-card p-4 rounded-xl shadow-lg border border-border">
                                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">Free Delivery</p>
                                    <p className="text-xs text-muted-foreground">Orders over ₱50</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="border-y border-border bg-secondary/50 py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Truck className="h-4 w-4" />
                            Free delivery on orders over ₱50
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Leaf className="h-4 w-4" />
                            100% fresh produce guarantee
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            Open 7 days a week
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Shop by Category</h2>
                            <p className="text-muted-foreground">Browse our fresh produce categories</p>
                        </div>
                        <Link
                            href="/shop"
                            className="text-sm font-medium text-primary hover:underline transition-colors"
                        >
                            View all <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((cat) => (
                            <Card
                                key={cat.slug}
                                className="group cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => {
                                    window.location.href = `/shop?category=${cat.slug}`;
                                }}
                            >
                                <CardContent className="px-0 py-8 text-center">
                                    <div className="mx-auto h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors">
                                        <Leaf className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-base mt-4">{cat.name}</CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                        {cat.count} items
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-muted/50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Featured Products</h2>
                            <p className="text-muted-foreground">Fresh picks just for you</p>
                        </div>
                        <Link
                            href="/shop"
                            className="text-sm font-medium text-primary hover:underline transition-colors"
                        >
                            View all <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[
                            { id: 1, name: 'Organic Apples', price: '₱2.50', unit: 'kg', stock: 100, category: 'Fruits', image: null },
                            { id: 2, name: 'Fresh Bananas', price: '₱0.80', unit: 'kg', stock: 150, category: 'Fruits', image: null },
                            { id: 3, name: 'Carrots', price: '₱1.20', unit: 'kg', stock: 120, category: 'Vegetables', image: null },
                            { id: 4, name: 'Broccoli', price: '₱2.50', unit: 'kg', stock: 50, category: 'Vegetables', image: null },
                        ].map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 p-8 md:p-12 text-white shadow-lg shadow-green-500/25">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to taste the freshness?</h2>
                        <p className="text-green-100 text-lg mb-8 max-w-lg mx-auto">
                            Join hundreds of happy customers enjoying farm-fresh produce delivered daily.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-green-700 font-medium shadow-lg hover:bg-green-50 transition-colors"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-muted/50 py-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="rounded-lg bg-primary p-2 flex items-center justify-center">
                                    <Leaf className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <span className="font-bold text-lg text-foreground">FreshMart</span>
                            </div>
                            <p className="text-muted-foreground text-sm max-w-xs">
                                Your trusted source for fresh, farm-to-table fruits and vegetables.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <Link href="/shop" className="hover:text-primary transition-colors">
                                        All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shop" className="hover:text-primary transition-colors">
                                        Fruits
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shop" className="hover:text-primary transition-colors">
                                        Vegetables
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/cart" className="hover:text-primary transition-colors">
                                        Cart
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <Phone className="mr-2 h-4 w-4" />
                                    +1 (555) 123-4567
                                </li>
                                <li>
                                    <Mail className="mr-2 h-4 w-4" />
                                    hello@freshmart.com
                                </li>
                                <li>
                                    <MapPin className="mr-2 h-4 w-4" />
                                    123 Farm Road, Freshville
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
                            <div className="flex gap-3">
                                <a href="#" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                                    <Instagram className="h-4 w-4" />
                                </a>
                                <a href="#" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                                    <Facebook className="h-4 w-4" />
                                </a>
                                <a href="#" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                                    <Twitter className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} FreshMart. All rights reserved.</p>
                        <div className="flex gap-4">
                            <Link href="/privacy" className="hover:text-foreground transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-foreground transition-colors">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

function ProductCard({ product }: { product: { id: number; name: string; price: string; unit: string; stock: number; category: string; image: string | null } }) {
    return (
        <Card className="group overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-[4/5] overflow-hidden bg-muted relative">
                <Badge variant="outline" className="absolute top-2 left-2 z-10 uppercase text-xs">
                    {product.category}
                </Badge>
                {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <Leaf className="h-8 w-8 opacity-40" />
                    </div>
                )}
            </div>
            <CardContent className="px-4 pb-4">
                <CardTitle className="text-base">{product.name}</CardTitle>
                <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-lg font-bold text-foreground">{product.price}</span>
                    <span className="text-xs text-muted-foreground">/{product.unit}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Stock: {product.stock}</p>
            </CardContent>
            <CardFooter className="px-4 pt-0">
                <Button variant="outline" size="sm" className="w-full">
                    Add to Cart <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
            </CardFooter>
        </Card>
    );
}
