'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Package, Heart, Settings, LogOut, ChevronRight, ShoppingBag } from 'lucide-react';

export default function CuentaPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-white text-3xl font-black flex items-center gap-3">
            <User size={28} className="text-orange-400" />
            Mi Cuenta
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 sticky top-24 space-y-1">
              {[
                { id: 'orders', label: 'Mis Pedidos', icon: Package },
                { id: 'profile', label: 'Mi Perfil', icon: User },
                { id: 'wishlist', label: 'Wishlist', icon: Heart },
                { id: 'settings', label: 'Configuración', icon: Settings },
              ].map(item => (
                <Link
                  key={item.id}
                  href={item.id === 'orders' ? '#orders' : item.id === 'wishlist' ? '/shop/wishlist' : '#'}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-gray-800"
                >
                  <item.icon size={16} className="text-gray-500" />
                  <span className="text-gray-400">{item.label}</span>
                  <ChevronRight size={14} className="ml-auto text-gray-600" />
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-800">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-white text-xl font-bold mb-6">Mis Pedidos</h2>

                {/* Orders list */}
                <div className="space-y-4">
                  {[
                    { id: 'SEVJO-2847', date: 'Mayo 10, 2025', total: '$89.990', status: 'Entregado', items: 3 },
                    { id: 'SEVJO-2701', date: 'Abril 22, 2025', total: '$45.500', status: 'Enviado', items: 1 },
                  ].map(order => (
                    <div key={order.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-white font-bold text-sm">{order.id}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{order.date} • {order.items} productos</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            order.status === 'Entregado'
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-orange-400 font-bold text-sm">{order.total}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-800 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                          Ver Detalle
                        </button>
                        <button className="px-4 py-2 bg-orange-500/10 text-orange-400 text-xs font-semibold rounded-lg hover:bg-orange-500/20 transition-colors">
                          Volver a Comprar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {false && (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                      <ShoppingBag size={32} className="text-gray-600" />
                    </div>
                    <p className="text-white font-semibold">No tenés pedidos aún</p>
                    <Link href="/shop/tienda" className="text-orange-400 text-sm hover:text-orange-300">
                      Empezar a comprar →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
