'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import type { ShopProduct } from '@/lib/shop/types';
import { getProducts } from '@/lib/shop/api';

export default function OfertasPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts({ pageSize: 50 });
        // Filter only products on sale
        const onSale = data.products.filter(p =>
          p.variants.some(v => v.originalPrice && v.originalPrice > v.price)
        );
        setProducts(onSale);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#030712]">

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-red-600 via-orange-600 to-red-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-4">
            <Flame size={14} className="text-yellow-300" />
            Ofertas por Tiempo Limitado
          </div>
          <h1 className="text-white text-4xl lg:text-5xl font-black mb-3">
            ¡Hasta 40% OFF!
          </h1>
          <p className="text-white/80 text-base max-w-xl mx-auto">
            Aprovechá las ofertas en los productos más populares. 
            Stock limitado, no te quedes sin el tuyo.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-white text-2xl font-black">
              {isLoading ? 'Cargando...' : `${products.length} productos en oferta`}
            </h2>
          </div>
          <Link
            href="/shop/tienda"
            className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors"
          >
            Ver Toda la Tienda <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-2xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Flame size={48} className="text-gray-700 mx-auto mb-4" />
            <p className="text-white font-semibold">No hay ofertas activas</p>
            <p className="text-gray-400 text-sm mt-1">Volve pronto para nuevas ofertas</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
