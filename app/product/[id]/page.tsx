'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('Black');

  useEffect(() => { axios.get('/api/products').then((r) => setProduct(r.data.find((x: any) => x._id === params.id))); }, [params.id]);

  const addToCart = () => {
    const current = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = { productId: product._id, name: product.name, price: product.price, qty: 1, size, color, image: product.images?.[0] };
    localStorage.setItem('cart', JSON.stringify([...current, item]));
    toast.success('Produk ditambahkan ke cart');
  };

  if (!product) return <div className="card h-72 animate-pulse" />;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="relative aspect-[4/5] card overflow-hidden">
        <Image src={product.images?.[0] || 'https://placehold.co/600x800'} alt={product.name} fill className="object-cover" />
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="text-white/70">{product.description}</p>
        <p className="text-2xl font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
        <p className="text-sm">Stock: {product.stock > 0 ? 'Tersedia' : 'Habis'}</p>
        <select className="input" value={size} onChange={(e) => setSize(e.target.value)}>{(product.size || ['M']).map((s: string) => <option key={s}>{s}</option>)}</select>
        <select className="input" value={color} onChange={(e) => setColor(e.target.value)}>{(product.colors || ['Black']).map((c: string) => <option key={c}>{c}</option>)}</select>
        <button className="btn-primary" onClick={addToCart}>Tambah ke Keranjang</button>
        <div className="card p-4">
          <p className="font-medium mb-2">Review</p>
          <p className="text-sm text-white/70">"Bahan jatuh, cutting elegan, cocok untuk daily dan acara formal."</p>
        </div>
      </div>
    </div>
  );
}
