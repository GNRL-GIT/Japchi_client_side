import { Head, Link, router } from '@inertiajs/react';
import {
    Clock,
    Package,
    ShoppingBag,
    XCircle,
    CheckCircle2,
    RefreshCw,
    Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { index as ordersIndex } from '@/routes/orders';

type OrderItem = {
    id: number;
    product_id: number;
    product: { name: string; image?: string | null } | null;
    quantity: number;
    price: number;
};

type Order = {
    id: number;
    status: string;
    total: number;
    shipping_address: string;
    created_at: string;
    items: OrderItem[];
};

type PageProps = {
    orders: Order[];
};

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
    pending: { label: 'Pending', variant: 'outline', icon: Clock },
    processing: { label: 'Processing', variant: 'secondary', icon: Truck },
    completed: { label: 'Completed', variant: 'default', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircle },
};

export default function OrdersIndex({ orders }: PageProps) {
    const totalSpent = orders
        .filter((o) => o.status === 'completed')
        .reduce((sum, o) => sum + Number(o.total), 0);

    const reorder = (id: number) => {
        const order = orders.find((o) => o.id === id);
        return router.post('/orders', { shipping_address: order?.shipping_address ?? '' });
    };

    return (
        <>
            <Head title="My Orders" />

            <div className="space-y-8 max-w-7xl mx-auto p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
                        <p className="text-muted-foreground">
                            Track your purchases and view your order history.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={ordersIndex()}
                            className="rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            Refresh
                        </Link>
                        <Link
                            href="/shop"
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white font-medium shadow-lg shadow-green-500/25 hover:bg-green-700 transition-colors"
                        >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard
                        title="Total Orders"
                        value={orders.length}
                        icon={ShoppingBag}
                        description="All time"
                    />
                    <StatCard
                        title="Total Spent"
                        value={`₱${totalSpent.toFixed(2)}`}
                        icon={CreditCardIcon}
                        description="Completed orders"
                    />
                    <StatCard
                        title="Pending"
                        value={orders.filter((o) => o.status === 'pending').length}
                        icon={Clock}
                        description="Awaiting processing"
                    />
                    <StatCard
                        title="Completed"
                        value={orders.filter((o) => o.status === 'completed').length}
                        icon={CheckCircle2}
                        description="Delivered orders"
                    />
                </div>

                {/* Orders */}
                {orders.length === 0 ? (
                    <EmptyOrders />
                ) : (
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} reorder={reorder} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function StatCard({ title, value, description, icon: Icon }: { title: string; value: React.ReactNode; description: string; icon: React.ElementType }) {
    return (
        <Card className="flex flex-col gap-2 p-4 border border-border/50 hover:border-green-200/50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="rounded-lg p-2 bg-green-50 text-green-600">
                    <Icon className="h-4 w-4" />
                </div>
                <p className="text-muted-foreground text-sm">{title}</p>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{value}</span>
            </div>
            <p className="text-muted-foreground text-xs">{description}</p>
        </Card>
    );
}

function EmptyOrders() {
    return (
        <Card className="text-center py-16 border border-dashed border-border/50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 mb-6">
                <ShoppingBag className="h-8 w-8 opacity-60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No orders yet</h3>
            <p className="text-muted-foreground text-sm mt-1">
                You haven't placed any orders. Start shopping to see your order history here.
            </p>
            <Link
                href="/shop"
                className="mt-6 inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm text-white font-medium shadow-lg shadow-green-500/25 hover:bg-green-700 transition-colors"
            >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Products
            </Link>
        </Card>
    );
}

function OrderCard({ order, reorder }: { order: Order; reorder: (id: number) => void }) {
    const config = statusConfig[order.status] ?? statusConfig.pending;
    const Icon = config.icon;

    return (
        <Card className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-border/50 group">
            <CardHeader className="flex flex-row items-center justify-between gap-2 px-6 pb-3">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                        <Icon className="h-4 w-4" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-semibold">{order.id}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
                <Badge variant={config.variant} className="whitespace-nowrap text-xs">
                    {config.label}
                </Badge>
            </CardHeader>

            <CardContent className="px-6">
                <div className="grid gap-3">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 border-b border-border/60 pb-3 last:border-b-0"
                        >
                            <div className="h-12 w-12 rounded-lg border border-border/50 bg-muted flex items-center justify-center overflow-hidden">
                                {item.product?.image ? (
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {item.product?.name ?? 'Product'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    x {item.quantity}
                                </p>
                            </div>
                            <span className="text-sm font-medium text-right">
                                ₱{(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 rounded-lg bg-muted p-3 text-sm">
                    <div className="flex flex-col gap-1">
                        <p className="text-muted-foreground">Shipping address</p>
                        <p className="font-medium truncate max-w-xs">{order.shipping_address}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-bold">₱{Number(order.total).toFixed(2)}</p>
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reorder(order.id)}
                        disabled={order.status === 'cancelled'}
                        className="border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50"
                    >
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Reorder
                    </Button>
                    {order.status !== 'cancelled' && (
                        <span className="ml-auto text-xs text-muted-foreground">
                            Reuse this order&apos;s address
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function CreditCardIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="10" x="2" y="7" rx="2" ry="2" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <line x1="12" x2="12" y1="7" y2="17" />
        </svg>
    );
}
