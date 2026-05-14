'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/shop/ProductCard';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddAllToCart = () => {
    items.forEach(item => {
      if (!item.product) return;
      const product = item.product;
      if (product.variants?.length) {
        addItem(product, product.variants[0], 1);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-3xl font-black flex items-center gap-3">
                <Heart size={28} className="text-red-400 fill-current" />
                Mi Wishlist
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {items.length === 0 ? 'No hay productos guardados' : `${items.length} productos guardados`}
              </p>
            </div>
            {items.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={handleAddAllToCart}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-400 transition-colors"
                >
                  <ShoppingCart size={15} />
                  Agregar Todo al Carrito
                </button>
                <button
                  onClick={clearWishlist}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 text-sm font-medium rounded-xl hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Trash2 size={15} />
                  Vaciar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center">
              <Heart size={40} className="text-gray-700" />
            </div>
            <div className="text-center">
              <h2 className="text-white text-xl font-bold mb-2">Tu wishlist está vacía</h2>
              <p className="text-gray-400 text-sm">
                Guardá tus productos favoritos para después
              </p>
            </div>
            <Link
              href="/shop/tienda"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-sm rounded-xl hover:from-orange-400 hover:to-red-500 transition-all"
            >
              <span>Explorar Tienda</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.filter(item => item.product).map(item => (
              <ProductCard key={item.productId} product={item.product!} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
