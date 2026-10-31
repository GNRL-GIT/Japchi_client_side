import { Head } from '@inertiajs/react';

export default function AdminDashboard({ stats }: any) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Profit Dashboard</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border rounded p-4"><p className="text-gray-500">Revenue</p><p className="text-2xl font-bold">${Number(stats.revenue).toFixed(2)}</p></div>
                    <div className="border rounded p-4"><p className="text-gray-500">Orders</p><p className="text-2xl font-bold">{stats.orders}</p></div>
                    <div className="border rounded p-4"><p className="text-gray-500">Products</p><p className="text-2xl font-bold">{stats.products}</p></div>
                    <div className="border rounded p-4"><p className="text-gray-500">Low Stock</p><p className="text-2xl font-bold">{stats.lowStock}</p></div>
                </div>
            </div>
        </>
    );
}
