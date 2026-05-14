'use client';

import { useState, useEffect } from 'react';
import { X, Heart, Minus, Plus, Star, ShoppingCart, Zap, Truck, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ShopProduct, ProductVariant } from '@/lib/shop/types';
import { formatCurrency, getDiscountPercent } from '@/lib/shop/formatters';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUI } from '@/context/UIContext';

interface QuickViewProps {
  product: ShopProduct;
}

export default function QuickView({ product }: QuickViewProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { closeQuickView } = useUI();

  const defaultVariant = product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    defaultVariant ?? { id: '', price: 0, stock: 0, sku: '' }
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const discount = selectedVariant.originalPrice
    ? getDiscountPercent(selectedVariant.originalPrice, selectedVariant.price)
    : 0;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeQuickView();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [closeQuickView]);

  // Sync selected variant when product changes
  useEffect(() => {
    if (product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
    setQuantity(1);
  }, [product.id]);

  const handleAddToCart = () => {
    if (isAdding || !selectedVariant?.id) return;
    setIsAdding(true);
    addItem(product, selectedVariant, quantity);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleToggleWishlist = () => {
    toggleItem(product, product.variants);
  };

  const total = selectedVariant.price * quantity;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeQuickView}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl pointer-events-auto flex flex-col animate-in zoom-in-95 fade-in duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-all"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col md:flex-row overflow-y-auto">

            {/* Image */}
            <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-gray-800">
              <Image
                src={product.image || 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800'}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.isNew && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-blue-500 text-white text-[10px] font-bold uppercase rounded-lg">
                  Nuevo
                </span>
              )}
              {product.bestSeller && !product.isNew && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase rounded-lg flex items-center gap-1">
                  <Zap size={10} /> Bestseller
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-3 right-3 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded-lg">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Info */}
            <div className="w-full md:w-1/2 p-6 flex flex-col gap-4 overflow-y-auto">

              {/* Brand & Name */}
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                  {product.brand}
                </p>
                <h2 className="text-white text-xl font-bold leading-tight">{product.name}</h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-xs">({product.reviewCount} reseñas)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-orange-400 text-2xl font-bold">{formatCurrency(selectedVariant.price)}</span>
                {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                  <>
                    <span className="text-gray-500 text-base line-through">{formatCurrency(selectedVariant.originalPrice)}</span>
                    <span className="text-red-400 text-sm font-semibold">-{discount}%</span>
                  </>
                )}
              </div>

              {/* Short Description */}
              <p className="text-gray-400 text-sm leading-relaxed">{product.shortDescription}</p>

              {/* Variant Selectors */}
              {product.variants.length > 0 && (
                <div className="space-y-3">
                  {/* Flavors */}
                  {[...new Set(product.variants.map(v => v.flavor).filter(Boolean))].length > 1 && (
                    <div>
                      <p className="text-gray-300 text-xs font-semibold mb-2">Sabor</p>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set(product.variants.map(v => v.flavor).filter(Boolean))].map(flavor => {
                          const variant = product.variants.find(v => v.flavor === flavor);
                          const isSelected = selectedVariant.flavor === flavor;
                          return (
                            <button
                              key={flavor}
                              onClick={() => variant && setSelectedVariant(variant)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                isSelected
                                  ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                                  : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                              }`}
                            >
                              {flavor}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  {[...new Set(product.variants.map(v => v.size).filter(Boolean))].length > 1 && (
                    <div>
                      <p className="text-gray-300 text-xs font-semibold mb-2">Tamaño</p>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set(product.variants.map(v => v.size).filter(Boolean))].map(size => {
                          const variant = product.variants.find(v => v.size === size);
                          const isSelected = selectedVariant.size === size;
                          return (
                            <button
                              key={size}
                              onClick={() => variant && setSelectedVariant(variant)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                isSelected
                                  ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                                  : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3 mt-auto pt-2">
                <div className="flex items-center gap-2 bg-gray-800 rounded-xl p-1.5">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-white font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(selectedVariant.stock, q + 1))}
                    className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || selectedVariant.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    isAdding
                      ? 'bg-green-500 text-white'
                      : selectedVariant.stock === 0
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-400 hover:to-red-500 shadow-lg shadow-orange-500/20'
                  }`}
                >
                  {isAdding ? (
                    <>¡Agregado!</>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      {selectedVariant.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                    </>
                  )}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                    inWishlist
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-500/30'
                  }`}
                >
                  <Heart size={18} className={inWishlist ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Stock info */}
              <div className="flex items-center gap-2 text-xs">
                {selectedVariant.stock > 0 ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <Truck size={12} />
                    Envío en 24-48h
                  </span>
                ) : (
                  <span className="text-red-400">Sin stock</span>
                )}
                <span className="text-gray-600 flex items-center gap-1">
                  <Shield size={12} />
                  Garantía 30 días
                </span>
              </div>

              {/* View Full Details */}
              <Link
                href={`/shop/producto/${product.slug}`}
                onClick={closeQuickView}
                className="text-center text-orange-400 text-xs hover:text-orange-300 transition-colors py-1"
              >
                Ver detalles completos →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
