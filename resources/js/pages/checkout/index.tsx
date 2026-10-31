import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Checkout() {
    const [address, setAddress] = useState('');
    return (
        <>
            <Head title="Checkout" />
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Checkout</h1>
                <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Shipping address" className="border p-2 w-full rounded h-24" />
                <button onClick={() => router.post('/orders', { shipping_address: address })} className="mt-4 bg-green-600 text-white px-6 py-2 rounded">Place Order</button>
            </div>
        </>
    );
}
