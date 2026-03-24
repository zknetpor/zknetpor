'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export type ProductShape = {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
};

export default function ProductCard({ product }: { product: ProductShape }) {
  return (
    <motion.div className="card overflow-hidden" whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
      <Link href={`/product/${product._id}`}>
        <div className="relative aspect-[4/5] w-full">
          <Image src={product.images?.[0] || 'https://placehold.co/600x800/111/fff?text=Noira'} alt={product.name} fill className="object-cover" loading="lazy" />
        </div>
        <div className="p-4">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-white/70 text-sm">{product.category}</p>
          <p className="mt-2 font-semibold">Rp {product.price.toLocaleString('id-ID')}</p>
        </div>
      </Link>
    </motion.div>
  );
}
