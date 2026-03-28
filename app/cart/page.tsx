'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CartItem from '@/components/CartItem';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const localItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(localItems);
  }, []);

  const persist = async (next: any[]) => {
    setItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
    try {
      await axios.post('/api/cart', { items: next });
    } catch {
      toast.error('Gagal sinkron ke server (belum login?)');
    }
  };

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">Keranjang</h1>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <CartItem
            key={`${item.productId}-${idx}`}
            item={item}
            onUpdate={(qty) => {
              const next = [...items];
              next[idx].qty = qty;
              persist(next);
            }}
            onDelete={() => persist(items.filter((_, i) => i !== idx))}
          />
        ))}
      </div>
      <div className="card p-4 flex items-center justify-between">
        <p>Total: <span className="font-semibold">Rp {total.toLocaleString('id-ID')}</span></p>
        <Link href="/checkout" className="btn-primary">Checkout</Link>
      </div>
    </div>
  );
}
