'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/shop/formatters';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-gray-900 border-l border-gray-700 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-orange-400" />
            <h2 className="text-white font-bold text-lg">Mi Carrito</h2>
            {items.length > 0 && (
              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-5">
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                <ShoppingBag size={32} className="text-gray-600" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">Tu carrito está vacío</p>
                <p className="text-gray-400 text-sm mt-1">Agregá productos para empezar</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold rounded-xl hover:from-orange-400 hover:to-red-500 transition-all shadow-lg shadow-orange-500/20"
              >
                <span>Explorar Tienda</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {items.map(item => (
                <div key={item.variantId} className="flex gap-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg bg-gray-800 overflow-hidden shrink-0">
                    <Image
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {item.flavor} {item.size && `/ ${item.size}`}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-white text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-orange-400 text-sm font-bold">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-800 p-5 space-y-4 bg-gray-900">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Subtotal</span>
              <span className="text-white font-bold text-lg">{formatCurrency(subtotal)}</span>
            </div>

            {subtotal < 75000 && (
              <p className="text-xs text-center text-gray-500">
                Agregá {formatCurrency(75000 - subtotal)} más para obtener ENVÍO GRATIS
              </p>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href="/shop/checkout"
                onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-sm rounded-xl hover:from-orange-400 hover:to-red-500 transition-all shadow-lg shadow-orange-500/20"
              >
                <span>Finalizar Compra</span>
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={closeCart}
                className="w-full py-2.5 text-gray-400 text-sm hover:text-white transition-colors"
              >
                Seguir Comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
