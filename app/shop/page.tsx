'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { useDebounce } from '@/hooks/useDebounce';

const fetcher = (url: string) => axios.get(url).then((r) => r.data);

export default function ShopPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [sort, setSort] = useState('latest');
  const debounced = useDebounce(search, 400);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (category) p.set('category', category);
    if (size) p.set('size', size);
    if (sort === 'price_asc') p.set('sort', 'price_asc');
    if (sort === 'price_desc') p.set('sort', 'price_desc');
    return p.toString();
  }, [category, size, sort]);

  const { data = [], isLoading } = useSWR(`/api/products?${query}`, fetcher);
  const { data: searched = [] } = useSWR(debounced ? `/api/search?q=${encodeURIComponent(debounced)}` : null, fetcher);
  const items = debounced ? searched : data;

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">Shop</h1>
      <div className="grid md:grid-cols-4 gap-3">
        <input className="input" placeholder="Cari gamis..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Semua kategori</option><option>Casual</option><option>Premium</option><option>Syari</option></select>
        <select className="input" value={size} onChange={(e) => setSize(e.target.value)}><option value="">Semua size</option><option>S</option><option>M</option><option>L</option><option>XL</option></select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}><option value="latest">Terbaru</option><option value="price_asc">Harga terendah</option><option value="price_desc">Harga tertinggi</option></select>
      </div>
      {isLoading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="card h-72 animate-pulse" />)}</div> :
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{items.map((p: any) => <ProductCard key={p._id} product={p} />)}</div>}
    </div>
  );
}
