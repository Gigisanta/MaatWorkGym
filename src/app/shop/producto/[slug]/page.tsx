'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Minus,
  Plus,
  Star,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Zap,
  Package,
  CheckCircle2,
} from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import type { ShopProduct, ProductVariant } from '@/lib/shop/types';
import { getProductBySlug, getProductsByCategory, getFeaturedProducts } from '@/lib/shop/api';
import { formatCurrency, getDiscountPercent } from '@/lib/shop/formatters';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [related, setRelated] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'directions'>('description');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  useEffect(() => {
    async function load() {
      try {
        const [p, featuredData] = await Promise.all([
          getProductBySlug(slug),
          getFeaturedProducts(),
        ]);
        setProduct(p);
        if (p) {
          setSelectedVariant(p.variants[0]);
          // Load related products
          try {
            const relatedProds = await getProductsByCategory(p.category.slug);
            setRelated(relatedProds.filter(r => r.id !== p.id).slice(0, 4));
          } catch (relErr) {
            console.error('Failed to load related products:', relErr);
          }
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
          <p className="text-gray-400 text-sm">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
          <Package size={32} className="text-gray-600" />
        </div>
        <p className="text-white font-semibold text-lg">Producto no encontrado</p>
        <Link href="/shop/tienda" className="text-orange-400 text-sm hover:text-orange-300">
          Volver a la tienda →
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discount = selectedVariant?.originalPrice
    ? getDiscountPercent(selectedVariant.originalPrice, selectedVariant.price)
    : 0;

  const handleAddToCart = () => {
    if (!selectedVariant || isAdding) return;
    setIsAdding(true);
    addItem(product, selectedVariant, quantity);
    setTimeout(() => setIsAdding(false), 800);
  };

  const allImages = [product.image, ...product.gallery].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#030712]">

      {/* Breadcrumbs */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/shop" className="hover:text-orange-400 transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/shop/tienda" className="hover:text-orange-400 transition-colors">Tienda</Link>
            <ChevronRight size={12} />
            <Link href={`/shop/tienda?category=${product.category.slug}`} className="hover:text-orange-400 transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight size={12} />
            <span className="text-gray-400 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── GALLERY ────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              <Image
                src={allImages[activeImage] || product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold uppercase rounded-lg">Nuevo</span>
                )}
                {product.bestSeller && !product.isNew && (
                  <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1">
                    <Zap size={10} /> Bestseller
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase rounded-lg">-{discount}%</span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === i ? 'border-orange-500' : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Brand & Name */}
            <div>
              <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">
                {product.brand}
              </p>
              <h1 className="text-white text-2xl lg:text-3xl font-black leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={16}
                      className={s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">({product.reviewCount} reseñas)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4">
              <span className="text-orange-400 text-3xl font-black">
                {formatCurrency(selectedVariant?.price ?? 0)}
              </span>
              {selectedVariant?.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                <>
                  <span className="text-gray-500 text-xl line-through">
                    {formatCurrency(selectedVariant.originalPrice)}
                  </span>
                  <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-300 text-sm leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Benefits */}
            {product.benefits.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.benefits.slice(0, 4).map((benefit, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-lg text-gray-300 text-xs">
                    <CheckCircle2 size={12} className="text-green-400 shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            )}

            {/* Variant Selectors */}
            {product.variants.length > 0 && (
              <div className="space-y-4">

                {/* Flavor */}
                {[...new Set(product.variants.map(v => v.flavor).filter(Boolean))].length > 1 && (
                  <div>
                    <p className="text-white text-sm font-semibold mb-2">Sabor</p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(product.variants.map(v => v.flavor).filter(Boolean))].map(flavor => {
                        const variant = product.variants.find(v => v.flavor === flavor);
                        return (
                          <button
                            key={flavor}
                            onClick={() => variant && setSelectedVariant(variant)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                              selectedVariant?.flavor === flavor
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

                {/* Size */}
                {[...new Set(product.variants.map(v => v.size).filter(Boolean))].length > 1 && (
                  <div>
                    <p className="text-white text-sm font-semibold mb-2">Tamaño</p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(product.variants.map(v => v.size).filter(Boolean))].map(size => {
                        const variant = product.variants.find(v => v.size === size);
                        return (
                          <button
                            key={size}
                            onClick={() => variant && setSelectedVariant(variant)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                              selectedVariant?.size === size
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
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 bg-gray-800 rounded-2xl p-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-white font-bold text-lg w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(selectedVariant?.stock ?? 99, q + 1))}
                  className="w-10 h-10 rounded-xl bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding || (selectedVariant?.stock ?? 0) === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all ${
                  isAdding
                    ? 'bg-green-500 text-white'
                    : (selectedVariant?.stock ?? 0) === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-400 hover:to-red-500 shadow-xl shadow-orange-500/30'
                }`}
              >
                {isAdding ? (
                  <>¡Agregado al Carrito!</>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    {(selectedVariant?.stock ?? 0) === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                  </>
                )}
              </button>

              <button
                onClick={() => toggleItem(product, product.variants)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                  inWishlist
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-500/30'
                }`}
              >
                <Heart size={20} className={inWishlist ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Stock & Trust */}
            <div className="flex flex-wrap gap-4 text-xs">
              <span className={`flex items-center gap-1.5 ${(selectedVariant?.stock ?? 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                <Truck size={13} />
                {(selectedVariant?.stock ?? 0) > 0 ? `En stock (${selectedVariant?.stock} unidades)` : 'Sin stock'}
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <Shield size={13} />
                Garantía 30 días
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <RotateCcw size={13} />
                Devolución gratuita
              </span>
            </div>

            {/* SKU */}
            {selectedVariant?.sku && (
              <p className="text-gray-600 text-xs">SKU: {selectedVariant.sku}</p>
            )}
          </div>
        </div>

        {/* ── TABS ────────────────────────────────────── */}
        <div className="mt-16">
          <div className="flex border-b border-gray-800 gap-6 mb-8">
            {(['description', 'ingredients', 'directions'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab === 'description' ? 'Descripción' : tab === 'ingredients' ? 'Ingredientes' : 'Modo de Uso'}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === 'description' && (
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {product.ingredients || 'Información no disponible.'}
                </p>
              </div>
            )}
            {activeTab === 'directions' && (
              <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {product.directions || 'Consulta con tu médico o nutricionista.'}
                </p>
                {product.servingsPerContainer && (
                  <p className="text-gray-500 text-xs mt-4">
                    Contenedor: {product.servingsPerContainer} porciones ({product.servingSize ?? '30g'} por porción)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── RELATED PRODUCTS ──────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-white text-2xl font-black mb-8">Productos Relacionados</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
