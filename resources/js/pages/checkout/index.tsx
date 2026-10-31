import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, MapPin, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Checkout() {
    const [address, setAddress] = useState('');

    return (
        <>
            <Head title="Checkout - FreshMart" />

            <div className="max-w-3xl mx-auto p-6 space-y-8">
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
                                <CardTitle className="text-sm font-semibold tracking-tighter uppercase">Shipping Details</CardTitle>
                                <CardDescription>
                                    Enter your delivery address so we can bring your order to your doorstep.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="py-0">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="shipping_address">Shipping Address</Label>
                                        <Input
                                            id="shipping_address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="e.g. 123 Farm Road, Freshville"
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <div className="flex items-center gap-2 text-xs text-green-600 mt-1">
                                            <MapPin className="h-3 w-3" />
                                            <span>We deliver to your local area</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={() => router.post('/orders', { shipping_address: address })}
                                    disabled={!address.trim()}
                                    className="w-full bg-green-600 py-3 text-lg font-medium shadow-lg shadow-green-500/25 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Truck className="mr-2 h-4 w-4" />
                                    Place Order
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold tracking-tighter uppercase">Order Summary</CardTitle>
                                <CardDescription>
                                    Review your order before placing it.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="py-0">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium text-foreground">Calculated at checkout</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Delivery</span>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>
                                    <div className="border-t border-border pt-4 flex items-center justify-between text-lg font-bold">
                                        <span className="text-foreground">Total</span>
                                        <span className="text-green-700">See cart</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold tracking-tighter uppercase">What to Expect</CardTitle>
                            </CardHeader>
                            <CardContent className="py-0">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-green-100 p-2 text-green-600">
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Fast Delivery</p>
                                            <p className="text-xs text-muted-foreground">Your order arrives within 1-2 business days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-green-100 p-2 text-green-600">
                                            <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center text-[10px] text-white">✓</div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Fresh Guarantee</p>
                                            <p className="text-xs text-muted-foreground">100% farm-fresh produce, hand-picked daily</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-green-100 p-2 text-green-600">
                                            <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center text-[10px] text-white">✓</div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Secure Payment</p>
                                            <p className="text-xs text-muted-foreground">Your payment is processed securely</p>
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
