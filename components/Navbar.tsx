'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/cart', label: 'Cart' },
  { href: '/admin', label: 'Admin' }
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="border-b border-white/10 bg-black/70 sticky top-0 z-50 backdrop-blur">
      <nav className="container-app flex items-center justify-between py-4">
        <Link href="/" className="text-lg font-semibold tracking-[0.2em]">NOIRA</Link>
        <div className="flex gap-2">
          {links.map((l) => (
            <motion.div key={l.href} whileHover={{ y: -1 }}>
              <Link className={`px-3 py-2 rounded-lg text-sm ${pathname === l.href ? 'bg-white text-black' : 'text-white/80 hover:bg-white/10'}`} href={l.href}>{l.label}</Link>
            </motion.div>
          ))}
        </div>
      </nav>
    </header>
  );
}
