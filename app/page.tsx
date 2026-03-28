'use client';

import useSWR from 'swr';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';

const fetcher = (url: string) => axios.get(url).then((r) => r.data);

export default function HomePage() {
  const { data, isLoading } = useSWR('/api/products', fetcher);
  const latest = data?.slice(0, 4) || [];
  const popular = data?.filter((p: any) => p.isPopular).slice(0, 4) || [];

  return (
    <div className="space-y-12">
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-8 md:p-12 text-center">
        <p className="text-white/60 uppercase tracking-[0.2em] text-xs">Modern Modest Wear</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold">Gamis Wanita Premium</h1>
        <p className="text-white/70 mt-4">Elegan, nyaman, dan siap menemani momen spesial Anda.</p>
      </motion.section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Produk Terbaru</h2>
        {isLoading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-72 animate-pulse" />)}</div> :
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{latest.map((p: any) => <ProductCard key={p._id} product={p} />)}</div>}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Produk Populer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{popular.map((p: any) => <ProductCard key={p._id} product={p} />)}</div>
      </section>
    </div>
  );
}
