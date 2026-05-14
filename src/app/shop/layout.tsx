import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Oswald } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { UIProvider } from '@/context/UIContext';
import ShopHeader from '@/components/shop/Header';
import ShopFooter from '@/components/shop/Footer';
import CartDrawer from '@/components/shop/CartDrawer';
import ToastContainer from '@/components/shop/ToastContainer';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Sevjo Supplements — Suplementos Premium',
    template: '%s | Sevjo Supplements',
  },
  description: 'Suplementos premium para atletas y健身爱好者. Calidad laboratory-tested, entrega rápida en todo Argentina.',
  keywords: ['suplementos', 'proteínas', 'creatina', 'pre-entreno', 'fitness', 'Argentina'],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Sevjo Supplements',
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} ${oswald.variable}`}>
      <body className="shop-dark">
        <UIProvider>
          <CartProvider>
            <WishlistProvider>
              <ShopHeader />
              <main className="min-h-screen">
                {children}
              </main>
              <ShopFooter />
              <CartDrawer />
              <ToastContainer />
            </WishlistProvider>
          </CartProvider>
        </UIProvider>
      </body>
    </html>
  );
}
