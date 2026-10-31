import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminProducts({ products }: any) {
    const empty = { category_id: '', name: '', slug: '', description: '', price: '', stock: '', unit: '', is_active: true };
    const [form, setForm] = useState<any>(empty);
    const [editing, setEditing] = useState<number | null>(null);

    const submit = (e: any) => {
        e.preventDefault();
        if (editing) {
            router.put(`/admin/products/${editing}`, form, { onSuccess: () => { setEditing(null); setForm(empty); } });
        } else {
            router.post('/admin/products', form, { onSuccess: () => setForm(empty) });
        }
    };

    const edit = (p: any) => { setEditing(p.id); setForm({ category_id: p.category_id, name: p.name, slug: p.slug, description: p.description ?? '', price: p.price, stock: p.stock, unit: p.unit, is_active: p.is_active }); };

    const destroy = (id: number) => {
        if (confirm('Delete product?')) router.delete(`/admin/products/${id}`);
    };

    return (
        <>
            <Head title="Manage Products" />
            <div className="p-6 space-y-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-card border rounded-xl p-5 shadow-sm">
                    <input className="border rounded-lg p-2.5 bg-background" placeholder="category_id" value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})} />
                    <input className="border rounded-lg p-2.5 bg-background" placeholder="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                    <input className="border rounded-lg p-2.5 bg-background" placeholder="slug" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} />
                    <input className="border rounded-lg p-2.5 bg-background" placeholder="price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
                    <input className="border rounded-lg p-2.5 bg-background" placeholder="stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} />
                    <input className="border rounded-lg p-2.5 bg-background" placeholder="unit" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} />
                    <input className="border rounded-lg p-2.5 bg-background sm:col-span-2" placeholder="description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
                    <button className="sm:col-span-2 rounded-lg bg-primary text-primary-foreground py-2.5 font-medium hover:opacity-90 transition">{editing ? 'Update Product' : 'Add Product'}</button>
                    {editing && <button type="button" onClick={()=>{setEditing(null);setForm(empty);}} className="sm:col-span-2 border rounded-lg py-2.5">Cancel</button>}
                </form>
                <div className="overflow-x-auto rounded-xl border shadow-sm">
                    <table className="w-full min-w-[600px]">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3 text-left text-sm font-medium">Name</th>
                                <th className="p-3 text-left text-sm font-medium">Price</th>
                                <th className="p-3 text-left text-sm font-medium">Stock</th>
                                <th className="p-3 text-left text-sm font-medium">Active</th>
                                <th className="p-3 text-left text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p: any) => (
                                <tr key={p.id} className="border-t hover:bg-muted/30 transition">
                                    <td className="p-3 text-sm">{p.name}</td>
                                    <td className="p-3 text-sm">${p.price}</td>
                                    <td className="p-3 text-sm">{p.stock}</td>
                                    <td className="p-3 text-sm">{p.is_active ? 'Yes' : 'No'}</td>
                                    <td className="p-3 text-sm flex gap-3">
                                        <button onClick={()=>edit(p)} className="text-blue-600 hover:underline">Edit</button>
                                        <button onClick={()=>destroy(p.id)} className="text-destructive hover:underline">Delete</button>
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
