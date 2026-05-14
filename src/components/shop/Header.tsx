'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Package,
  Zap,
  Flame,
  Pill,
  Heart as HeartIcon,
  Sparkles as SparklesIcon,
  Dumbbell,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import type { Category } from '@/lib/shop/types';

const ICON_MAP: Record<string, ReactNode> = {
  Protein: <Package size={20} />,
  Zap: <Zap size={20} />,
  Flame: <Flame size={20} />,
  Pill: <Pill size={20} />,
  Heart: <HeartIcon size={20} />,
  Fire: <Flame size={20} />,
  Sparkles: <SparklesIcon size={20} />,
  Dumbbell: <Dumbbell size={20} />,
};

interface HeaderProps {
  categories?: Category[];
}

export default function ShopHeader({ categories = [] }: HeaderProps) {
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setShowCategories(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop/tienda?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const defaultCategories: Category[] = categories.length > 0 ? categories : [
    { id: '1', name: 'Proteínas', slug: 'proteinas', icon: 'Protein' },
    { id: '2', name: 'Creatina', slug: 'creatina', icon: 'Zap' },
    { id: '3', name: 'Pre-entrenos', slug: 'pre-entrenos', icon: 'Flame' },
    { id: '4', name: 'Aminoácidos', slug: 'aminoacidos', icon: 'Pill' },
    { id: '5', name: 'Vitaminas', slug: 'vitaminas', icon: 'Heart' },
    { id: '6', name: 'Quemadores', slug: 'quemadores', icon: 'Fire' },
    { id: '7', name: 'Colágeno', slug: 'colageno', icon: 'Sparkles' },
    { id: '8', name: 'Accesorios', slug: 'accesorios', icon: 'Dumbbell' },
  ];

  return (
    <>
      {/* Promo Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white text-center py-2 text-xs sm:text-sm font-medium relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center gap-2">
          <Sparkles size={14} className="animate-pulse" />
          <span>
            ENVÍO GRATIS en pedidos +$75.000 | Código:{' '}
            <span className="font-black underline decoration-2 underline-offset-2">WELCOME10</span>{' '}
            para 10% OFF
          </span>
          <Sparkles size={14} className="animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gray-950/95 backdrop-blur-md shadow-2xl shadow-black/50 border-b border-gray-800'
            : 'bg-gray-950 border-b border-gray-800/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link href="/shop" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-shadow">
                S
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-bold text-lg tracking-tight">Sevjo</span>
                <span className="text-orange-400 font-bold text-lg tracking-tight"> Supplements</span>
              </div>
              <div className="sm:hidden">
                <span className="text-white font-bold text-base">Sevjo</span>
                <span className="text-orange-400 font-bold text-base">S</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/shop"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/shop'
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Inicio
              </Link>

              {/* Categories Dropdown */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setShowCategories(v => !v)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith('/shop/tienda')
                      ? 'text-orange-400 bg-orange-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Tienda
                  <ChevronDown size={14} className={`transition-transform ${showCategories ? 'rotate-180' : ''}`} />
                </button>

                {showCategories && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                      <Link
                        href="/shop/tienda"
                        onClick={() => setShowCategories(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                          <Sparkles size={16} className="text-orange-400" />
                        </span>
                        <span className="font-medium">Ver Todo</span>
                      </Link>
                      <div className="my-1 border-t border-gray-800" />
                      {defaultCategories.map(cat => (
                        <Link
                          key={cat.id}
                          href={`/shop/tienda?category=${cat.slug}`}
                          onClick={() => setShowCategories(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors group"
                        >
                          <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                            {ICON_MAP[cat.icon ?? ''] ?? <Package size={16} className="text-orange-400" />}
                          </span>
                          <span className="font-medium">{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/shop/ofertas"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/shop/ofertas'
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Ofertas
              </Link>

              <Link
                href="/shop/faq"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/shop/faq'
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                FAQ
              </Link>

              <Link
                href="/shop/contacto"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/shop/contacto'
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Contacto
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Search */}
              <div className="relative">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Buscar productos..."
                      className="w-40 sm:w-56 px-3 py-2 bg-gray-800 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                    aria-label="Buscar"
                  >
                    <Search size={18} />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/shop/wishlist"
                className="p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all relative"
                aria-label="Lista de deseos"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href="/shop/cuenta"
                className="p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                aria-label="Mi cuenta"
              >
                <User size={18} />
              </Link>

              {/* Cart */}
              <Link
                href="/shop/checkout"
                className="p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all relative"
                aria-label="Carrito"
              >
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Admin Link */}
              <Link
                href="/main/ecommerce"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 rounded-xl transition-all border border-orange-500/20"
              >
                <span>⚙️</span>
                <span>Panel</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(v => !v)}
                className="lg:hidden p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                aria-label="Menú"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-900 border-t border-gray-800 animate-in slide-in-from-top duration-200">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <Link
                href="/shop"
                className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === '/shop' ? 'text-orange-400 bg-orange-500/10' : 'text-gray-300'
                }`}
              >
                Inicio
              </Link>
              <Link
                href="/shop/tienda"
                className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === '/shop/tienda' ? 'text-orange-400 bg-orange-500/10' : 'text-gray-300'
                }`}
              >
                Tienda
              </Link>
              <div className="px-4 py-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Categorías</p>
                <div className="grid grid-cols-2 gap-1">
                  {defaultCategories.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/shop/tienda?category=${cat.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {ICON_MAP[cat.icon ?? ''] ?? <Package size={14} />}
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/shop/ofertas"
                className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === '/shop/ofertas' ? 'text-orange-400 bg-orange-500/10' : 'text-gray-300'
                }`}
              >
                Ofertas
              </Link>
              <Link
                href="/shop/faq"
                className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === '/shop/faq' ? 'text-orange-400 bg-orange-500/10' : 'text-gray-300'
                }`}
              >
                FAQ
              </Link>
              <Link
                href="/shop/contacto"
                className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === '/shop/contacto' ? 'text-orange-400 bg-orange-500/10' : 'text-gray-300'
                }`}
              >
                Contacto
              </Link>
              <div className="border-t border-gray-800 pt-3 mt-3">
                <Link
                  href="/main/ecommerce"
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20"
                >
                  <span>⚙️</span>
                  Panel de Administración
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
