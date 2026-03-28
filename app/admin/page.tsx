'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const defaultForm = { name: '', price: 0, description: '', category: 'Premium', size: ['M'], colors: ['Black'], stock: 0, images: [], isPopular: false };

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState<any>(defaultForm);

  const load = async () => {
    const [p, o] = await Promise.all([axios.get('/api/products'), axios.get('/api/orders')]);
    setProducts(p.data);
    setOrders(o.data);
  };
  useEffect(() => { load().catch(() => toast.error('Login sebagai admin dulu')); }, []);

  const uploadImage = async (file?: File) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await axios.post('/api/upload', fd);
    setForm({ ...form, images: [...form.images, res.data.url] });
  };

  const createProduct = async () => {
    await axios.post('/api/products', form);
    toast.success('Produk dibuat');
    setForm(defaultForm);
    load();
  };

  const removeProduct = async (id: string) => {
    await axios.delete(`/api/products/${id}`);
    toast.success('Produk dihapus');
    load();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await axios.patch(`/api/orders/${id}`, { status });
    toast.success('Status order diupdate');
    load();
  };

  const revenue = orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Admin Panel</h1>
      <section className="grid md:grid-cols-3 gap-3">
        <div className="card p-4"><p>Total Produk</p><p className="text-2xl font-bold">{products.length}</p></div>
        <div className="card p-4"><p>Total Order</p><p className="text-2xl font-bold">{orders.length}</p></div>
        <div className="card p-4"><p>Penjualan</p><p className="text-2xl font-bold">Rp {revenue.toLocaleString('id-ID')}</p></div>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="text-xl font-semibold">Tambah Produk</h2>
        <input className="input" placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Harga" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <textarea className="input" placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="input" placeholder="Kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="input" placeholder="Ukuran (pisahkan koma)" value={form.size.join(',')} onChange={(e) => setForm({ ...form, size: e.target.value.split(',').map((x) => x.trim()) })} />
        <input className="input" placeholder="Warna (pisahkan koma)" value={form.colors.join(',')} onChange={(e) => setForm({ ...form, colors: e.target.value.split(',').map((x) => x.trim()) })} />
        <input className="input" placeholder="Stok" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
        <input className="input" type="file" onChange={(e) => uploadImage(e.target.files?.[0])} />
        <button className="btn-primary" onClick={createProduct}>Simpan Produk</button>
      </section>

      <section className="card p-4">
        <h2 className="text-xl font-semibold mb-3">Daftar Produk</h2>
        <div className="space-y-2">{products.map((p) => (
          <div key={p._id} className="flex items-center justify-between border-b border-white/10 py-2">
            <p>{p.name} - Rp {p.price.toLocaleString('id-ID')}</p>
            <button className="btn-outline" onClick={() => removeProduct(p._id)}>Hapus</button>
          </div>
        ))}</div>
      </section>

      <section className="card p-4">
        <h2 className="text-xl font-semibold mb-3">Kelola Pesanan</h2>
        <div className="space-y-2">{orders.map((o) => (
          <div key={o._id} className="flex items-center justify-between border-b border-white/10 py-2">
            <p>{o._id.slice(-6)} - Rp {o.total.toLocaleString('id-ID')} - {o.status}</p>
            <select className="input max-w-40" value={o.status} onChange={(e) => updateOrderStatus(o._id, e.target.value)}>
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="shipped">shipped</option>
            </select>
          </div>
        ))}</div>
      </section>
    </div>
  );
}
