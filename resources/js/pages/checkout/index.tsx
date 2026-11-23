import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type Cart = {
    items: {
        id: string;
        quantity: number;
        unit_price: number;
        product: { name: string };
        options: { name: string }[];
    }[];
    subtotal: number;
};

type Props = {
    cart: Cart;
    store: { is_open: boolean; closed_message: string };
};

export default function Checkout({ cart, store }: Props) {
    const form = useForm({
        order_type: 'takeout' as 'dine_in' | 'takeout' | 'courier_pickup',
        courier_name: '',
        courier_ref: '',
        notes: '',
    });

    return (
        <>
            <Head title="Checkout - Japchi" />

            <div className="mx-auto max-w-3xl space-y-8 p-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/cart"
                        className="rounded-lg border border-input px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to cart
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 lg:gap-10">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold tracking-tighter uppercase">
                                    Order details
                                </CardTitle>
                                <CardDescription>
                                    Your order will be prepared at JapChi.
                                    Please pay at the counter.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="py-0">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="order_type">
                                            Order type
                                        </Label>
                                        <select
                                            id="order_type"
                                            value={form.data.order_type}
                                            onChange={(event) =>
                                                form.setData(
                                                    'order_type',
                                                    event.target
                                                        .value as typeof form.data.order_type,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                                        >
                                            <option value="dine_in">
                                                Dine-in
                                            </option>
                                            <option value="takeout">
                                                Take-out
                                            </option>
                                            <option value="courier_pickup">
                                                Courier pickup
                                            </option>
                                        </select>
                                    </div>
                                    {form.data.order_type ===
                                        'courier_pickup' && (
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div>
                                                <Label htmlFor="courier_name">
                                                    Courier name
                                                </Label>
                                                <input
                                                    id="courier_name"
                                                    maxLength={80}
                                                    value={
                                                        form.data.courier_name
                                                    }
                                                    onChange={(event) =>
                                                        form.setData(
                                                            'courier_name',
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                                                />
                                                {form.errors.courier_name && (
                                                    <p className="mt-1 text-sm text-destructive">
                                                        {
                                                            form.errors
                                                                .courier_name
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="courier_ref">
                                                    Booking reference
                                                </Label>
                                                <input
                                                    id="courier_ref"
                                                    maxLength={80}
                                                    value={
                                                        form.data.courier_ref
                                                    }
                                                    onChange={(event) =>
                                                        form.setData(
                                                            'courier_ref',
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                                                />
                                                {form.errors.courier_ref && (
                                                    <p className="mt-1 text-sm text-destructive">
                                                        {
                                                            form.errors
                                                                .courier_ref
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <Label htmlFor="notes">
                                            Order note (optional)
                                        </Label>
                                        <input
                                            id="notes"
                                            maxLength={200}
                                            value={form.data.notes}
                                            onChange={(event) =>
                                                form.setData(
                                                    'notes',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                                        />
                                        {form.errors.notes && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {form.errors.notes}
                                            </p>
                                        )}
                                    </div>
                                    {form.errors.order_type && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.order_type}
                                        </p>
                                    )}
                                    {!store.is_open && (
                                        <p
                                            role="alert"
                                            className="text-sm text-destructive"
                                        >
                                            {store.closed_message}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={() => form.post('/orders')}
                                    disabled={form.processing || !store.is_open}
                                    className="w-full bg-green-600 py-3 text-lg font-medium shadow-lg shadow-green-500/25 transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Truck className="mr-2 h-4 w-4" />
                                    {form.processing
                                        ? 'Placing order…'
                                        : 'Place order'}
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold tracking-tighter uppercase">
                                    Order Summary
                                </CardTitle>
                                <CardDescription>
                                    Review your order before placing it.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="py-0">
                                <div className="space-y-3">
                                    {cart.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between gap-3 text-sm"
                                        >
                                            <span>
                                                {item.quantity} ×{' '}
                                                {item.product.name}
                                                {item.options.length > 0 && (
                                                    <span className="block text-xs text-muted-foreground">
                                                        {item.options
                                                            .map(
                                                                (option) =>
                                                                    option.name,
                                                            )
                                                            .join(', ')}
                                                    </span>
                                                )}
                                            </span>
                                            <span>
                                                ₱
                                                {(
                                                    item.unit_price *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Subtotal
                                        </span>
                                        <span className="font-medium text-foreground">
                                            ₱{cart.subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-border pt-4 text-lg font-bold">
                                        <span className="text-foreground">
                                            Total
                                        </span>
                                        <span className="text-green-700">
                                            ₱{cart.subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold tracking-tighter uppercase">
                                    What to Expect
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-0">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-green-100 p-2 text-green-600">
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">
                                                Fast Delivery
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Your order arrives within 1-2
                                                business days
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-green-100 p-2 text-green-600">
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] text-white">
                                                ✓
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">
                                                Freshly Prepared
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Your ramen, dimsum, and drinks
                                                are prepared fresh for every
                                                order
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-green-100 p-2 text-green-600">
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] text-white">
                                                ✓
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">
                                                Secure Payment
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Your payment is processed
                                                securely
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
