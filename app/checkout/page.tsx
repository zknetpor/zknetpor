'use client';

import { useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('midtrans');
  const [address, setAddress] = useState({ receiver: '', phone: '', street: '', city: '', province: '', postalCode: '' });

  const items = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : [];
  const total = useMemo(() => items.reduce((s: number, i: any) => s + i.price * i.qty, 0), [items]);

  const submitOrder = async () => {
    try {
      setLoading(true);
      const orderRes = await axios.post('/api/orders', { items, total, address, paymentMethod: method });
      if (method === 'midtrans') {
        const pay = await axios.post('/api/payment/midtrans', { orderId: orderRes.data._id });
        window.location.href = pay.data.redirect_url;
      } else {
        toast.success('Order COD berhasil dibuat');
        localStorage.removeItem('cart');
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Checkout gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card p-5 space-y-3">
        <h1 className="text-2xl font-semibold">Alamat Pengiriman</h1>
        {Object.keys(address).map((key) => (
          <input key={key} className="input" placeholder={key} value={(address as any)[key]} onChange={(e) => setAddress({ ...address, [key]: e.target.value })} />
        ))}
        <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="midtrans">Midtrans (Snap)</option>
          <option value="cod">COD</option>
        </select>
      </div>
      <div className="card p-5 h-fit">
        <p className="text-white/70">Total pembayaran</p>
        <p className="text-2xl font-bold">Rp {total.toLocaleString('id-ID')}</p>
        <button className="btn-primary mt-4 w-full" onClick={submitOrder} disabled={loading}>{loading ? 'Memproses...' : 'Buat Pesanan'}</button>
      </div>
    </div>
  );
}
