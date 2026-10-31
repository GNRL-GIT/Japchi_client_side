import { Head, Link, router } from '@inertiajs/react';

export default function CartIndex({ cart }: any) {
    const items = cart?.items ?? [];
    const total = items.reduce((s: number, i: any) => s + i.product.price * i.quantity, 0);
    return (
        <>
            <Head title="Cart" />
            <div className="p-6 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
                {items.length === 0 && <p>Cart is empty.</p>}
                {items.map((i: any) => (
                    <div key={i.id} className="flex justify-between items-center border-b py-3">
                        <div>
                            <p className="font-semibold">{i.product.name}</p>
                            <p className="text-sm">${i.product.price} x {i.quantity}</p>
                        </div>
                        <div className="flex gap-2">
                            <input type="number" min={1} defaultValue={i.quantity} onBlur={e => router.patch(`/cart/${i.id}`, { quantity: Number(e.target.value) })} className="border p-1 w-16 rounded" />
                            <button onClick={() => router.delete(`/cart/${i.id}`)} className="text-red-600">Remove</button>
                        </div>
                    </div>
                ))}
                {items.length > 0 && (
                    <div className="mt-6">
                        <p className="font-bold">Total: ${total.toFixed(2)}</p>
                        <Link href="/checkout" className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded">Checkout</Link>
                    </div>
                )}
            </div>
        </>
    );
}
