import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Noira Gamis',
  description: 'E-commerce gamis wanita modern premium'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main className="container-app py-8">{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
