import { Head, router } from '@inertiajs/react';

export default function AdminOrders({ orders }: any) {
    const update = (id: number, status: string) => router.patch(`/admin/orders/${id}`, { status });

    return (
        <>
            <Head title="Manage Orders" />
            <div className="p-6 space-y-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground text-sm">Manage customer orders</p>
                </div>
                <div className="overflow-x-auto rounded-xl border shadow-sm">
                    <table className="w-full min-w-[600px]">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3 text-left text-sm font-medium">ID</th>
                                <th className="p-3 text-left text-sm font-medium">User</th>
                                <th className="p-3 text-left text-sm font-medium">Total</th>
                                <th className="p-3 text-left text-sm font-medium">Status</th>
                                <th className="p-3 text-left text-sm font-medium">Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o: any) => (
                                <tr key={o.id} className="border-t hover:bg-muted/30 transition">
                                    <td className="p-3 text-sm">{o.id}</td>
                                    <td className="p-3 text-sm">{o.user?.email}</td>
                                    <td className="p-3 text-sm">${o.total}</td>
                                    <td className="p-3 text-sm capitalize">{o.status}</td>
                                    <td className="p-3 text-sm">
                                        <select defaultValue={o.status} onChange={e=>update(o.id,e.target.value)} className="border rounded-lg p-1.5 bg-background">
                                            <option value="pending">pending</option>
                                            <option value="processing">processing</option>
                                            <option value="completed">completed</option>
                                            <option value="cancelled">cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
