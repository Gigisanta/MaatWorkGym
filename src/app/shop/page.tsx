'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Package,
  Zap,
  Flame,
  Pill,
  Heart,
  Sparkles,
  Dumbbell,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ChevronRight,
} from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import type { ShopProduct, Category } from '@/lib/shop/types';
import { getFeaturedProducts, getCategories } from '@/lib/shop/api';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  proteinas: <Package size={28} />,
  creatina: <Zap size={28} />,
  'pre-entrenos': <Flame size={28} />,
  aminoacidos: <Pill size={28} />,
  vitaminas: <Heart size={28} />,
  quemadores: <Flame size={28} />,
  colageno: <Sparkles size={28} />,
  accesorios: <Dumbbell size={28} />,
};

export default function ShopHomePage() {
  const [featured, setFeatured] = useState<ShopProduct[]>([]);
  const [bestSellers, setBestSellers] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [featuredData, categoriesData] = await Promise.all([
          getFeaturedProducts(),
          getCategories(),
        ]);
        setFeatured(featuredData.featured);
        setBestSellers(featuredData.bestSellers);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading shop data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#030712]">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
            alt="Fitness supplements"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-top duration-500">
            <Sparkles size={14} />
            Calidad Premium • Entrega Rápida
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom duration-500 delay-100">
            Potencia tu{' '}
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Rendimiento
            </span>
          </h1>

          <p className="text-gray-300 text-lg lg:text-xl max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom duration-500 delay-200">
            Suplementos de la más alta calidad para atletas y健身爱好者. 
            Laboratorio-tested, entrega en 24-48hs en todo Argentina.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom duration-500 delay-300">
            <Link
              href="/shop/tienda"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-sm rounded-2xl hover:from-orange-400 hover:to-red-500 transition-all shadow-2xl shadow-orange-500/30 hover:scale-105"
            >
              <span>Ver Tienda</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/shop/ofertas"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-sm rounded-2xl hover:bg-white/20 transition-all hover:scale-105"
            >
              <span>🔥 Ofertas</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 mt-12 text-gray-400 text-xs animate-in fade-in duration-500 delay-500">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-orange-400" />
              Envío Gratis +$75.000
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-orange-400" />
              Garantía 30 Días
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={16} className="text-orange-400" />
              Devolución Fácil
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent" />
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section className="bg-[#030712] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">
                Explora
              </p>
              <h2 className="text-white text-3xl lg:text-4xl font-black">
                Nuestras Categorías
              </h2>
            </div>
            <Link
              href="/shop/tienda"
              className="hidden sm:flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors"
            >
              Ver Todo <ChevronRight size={16} />
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-gray-800/50 rounded-2xl animate-pulse"
                  />
                ))
              : categories.map((cat, i) => (
                  <Link
                    key={cat.id}
                    href={`/shop/tienda?category=${cat.slug}`}
                    className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 overflow-hidden"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 flex items-center justify-center text-orange-400 mb-4 group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all">
                      {CATEGORY_ICONS[cat.slug] ?? <Package size={28} />}
                    </div>

                    {/* Name */}
                    <h3 className="text-white font-bold text-base mb-1">{cat.name}</h3>
                    <p className="text-gray-500 text-xs">
                      {cat.productCount ?? 0} productos
                    </p>

                    {/* Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={16} className="text-orange-400" />
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────── */}
      <section className="bg-[#030712] py-20 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">
                Los Mejores
              </p>
              <h2 className="text-white text-3xl lg:text-4xl font-black">
                Productos Destacados
              </h2>
            </div>
            <Link
              href="/shop/tienda"
              className="hidden sm:flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors"
            >
              Ver Todo <ChevronRight size={16} />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-2xl aspect-square animate-pulse" />
                ))
              : featured.slice(0, 8).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link
              href="/shop/tienda"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold text-sm rounded-xl transition-all hover:border-orange-500/50"
            >
              <span>Ver Todos los Productos</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ────────────────────────────────── */}
      <section className="bg-[#030712] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl p-8 lg:p-12">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                }}
              />
            </div>

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-3">
                  Oferta Especial
                </p>
                <h2 className="text-white text-3xl lg:text-4xl font-black mb-3">
                  10% OFF en tu Primera Compra
                </h2>
                <p className="text-white/70 text-sm max-w-lg">
                  Usá el código <span className="font-black text-white">WELCOME10</span> al checkout 
                  y recibí un 10% de descuento en tu primer pedido.
                </p>
              </div>
              <div className="flex flex-col items-center lg:items-end gap-4">
                <div className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                  <p className="text-white/60 text-xs mb-1">Código de descuento</p>
                  <p className="text-white font-black text-2xl tracking-widest">WELCOME10</p>
                </div>
                <Link
                  href="/shop/tienda"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold text-sm rounded-xl hover:bg-gray-100 transition-all"
                >
                  <span>Comprar Ahora</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ────────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="bg-[#030712] py-20 border-t border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">
                  Más Vendidos
                </p>
                <h2 className="text-white text-3xl lg:text-4xl font-black">
                  Los Favoritos
                </h2>
              </div>
              <Link
                href="/shop/tienda"
                className="hidden sm:flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors"
              >
                Ver Todo <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {bestSellers.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES ────────────────────────────────────── */}
      <section className="bg-gray-900 border-t border-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Truck size={28} />,
                title: 'Envío Gratis',
                desc: 'En pedidos superiores a $75.000. Entrega en 24-48hs.',
              },
              {
                icon: <Shield size={28} />,
                title: 'Calidad Garantizada',
                desc: 'Productos testeados en laboratorio. 100% originales.',
              },
              {
                icon: <RotateCcw size={28} />,
                title: '30 Días de Garantía',
                desc: 'Si no estás conforme, te devolvemos tu dinero.',
              },
              {
                icon: <Star size={28} />,
                title: '+5000 Clientes',
                desc: 'La confianza de miles de atletas nos avala.',
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
