'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, ShoppingCart, Star, Zap } from 'lucide-react';
import type { ShopProduct } from '@/lib/shop/types';
import { formatCurrency, getDiscountPercent } from '@/lib/shop/formatters';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUI } from '@/context/UIContext';

interface ProductCardProps {
  product: ShopProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { openQuickView } = useUI();
  const [isAdding, setIsAdding] = useState(false);

  const defaultVariant = product.variants[0];
  const inWishlist = isInWishlist(product.id);
  const discount = defaultVariant?.originalPrice
    ? getDiscountPercent(defaultVariant.originalPrice, defaultVariant.price)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!defaultVariant || isAdding) return;

    setIsAdding(true);
    addItem(product, defaultVariant, 1);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product, product.variants);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product.id, product.slug);
  };

  return (
    <Link
      href={`/shop/producto/${product.slug}`}
      className="group relative flex flex-col bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-orange-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1"
    >

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="px-2.5 py-1 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wide rounded-lg shadow-lg">
            Nuevo
          </span>
        )}
        {product.bestSeller && !product.isNew && (
          <span className="px-2.5 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wide rounded-lg shadow-lg flex items-center gap-1">
            <Zap size={10} /> Bestseller
          </span>
        )}
        {discount > 0 && (
          <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wide rounded-lg shadow-lg">
            -{discount}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          inWishlist
            ? 'bg-red-500 text-white'
            : 'bg-gray-900/80 text-gray-400 hover:text-red-400 hover:bg-gray-900'
        }`}
        aria-label={inWishlist ? 'Quitar de wishlist' : 'Agregar a wishlist'}
      >
        <Heart size={14} className={inWishlist ? 'fill-current' : ''} />
      </button>

      {/* Image */}
      <div className="relative aspect-square bg-gray-800 overflow-hidden">
        <Image
          src={product.image || 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action Buttons on Hover */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickView}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/95 hover:bg-white text-gray-900 text-xs font-bold rounded-lg transition-colors backdrop-blur-sm"
          >
            <Eye size={13} />
            Vista Rápida
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !defaultVariant}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
              isAdding
                ? 'bg-green-500 text-white'
                : 'bg-orange-500 hover:bg-orange-400 text-white'
            }`}
            aria-label="Agregar al carrito"
          >
            <ShoppingCart size={14} />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {defaultVariant?.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-white font-bold text-sm uppercase tracking-wide">Sin Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Brand */}
        <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wider">
          {product.brand}
        </p>

        {/* Name */}
        <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={11}
                className={star <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}
              />
            ))}
          </div>
          <span className="text-gray-500 text-[11px]">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mt-auto pt-1">
          <span className="text-orange-400 text-lg font-bold">
            {formatCurrency(defaultVariant?.price ?? 0)}
          </span>
          {defaultVariant?.originalPrice && defaultVariant.originalPrice > defaultVariant.price && (
            <span className="text-gray-500 text-sm line-through">
              {formatCurrency(defaultVariant.originalPrice)}
            </span>
          )}
        </div>

        {/* Variants count indicator */}
        {product.variants.length > 1 && (
          <p className="text-gray-600 text-[10px]">
            {product.variants.length} opciones
          </p>
        )}
      </div>
    </Link>
  );
}
