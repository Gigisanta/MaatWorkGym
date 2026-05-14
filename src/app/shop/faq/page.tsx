'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Package, Truck, RotateCcw, CreditCard, Shield, ShoppingBag } from 'lucide-react';

const FAQS = [
  {
    q: '¿Cómo realizo un pedido?',
    a: 'Navegá por nuestra tienda, agregá los productos al carrito y seguí los pasos del checkout. Completá tus datos y método de envío, y confirmá el pedido. Te contactaremos para coordinar el pago y envío.',
    icon: <ShoppingBag size={20} />,
  },
  {
    q: '¿Cuáles son los métodos de pago?',
    a: 'Aceptamos transferencia bancaria, MercadoPago y pago contra reembolso (en efectivo al recibir tu pedido). Todos los métodos son 100% seguros.',
    icon: <CreditCard size={20} />,
  },
  {
    q: '¿Cuánto tarda el envío?',
    a: 'El envío estándar tarda entre 3 y 5 días hábiles. El envío express tarda 24-48 horas. Envío gratis en pedidos superiores a $75.000.',
    icon: <Truck size={20} />,
  },
  {
    q: '¿Puedo devolver un producto?',
    a: 'Sí, tenés 30 días de garantía. Si el producto no te convence o llega en mal estado, te devolvemos el dinero o lo cambiamos sin costo.',
    icon: <RotateCcw size={20} />,
  },
  {
    q: '¿Los productos son originales?',
    a: 'Sí, todos nuestros suplementos son 100% originales y están testeados en laboratorio. Trabajamos directamente con distribuidores oficiales.',
    icon: <Shield size={20} />,
  },
  {
    q: '¿Cuál es el costo de envío?',
    a: 'Envío estándar: $5.990. Envío express: $12.990. Envío GRATIS en pedidos superiores a $75.000.',
    icon: <Package size={20} />,
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <HelpCircle size={40} className="text-orange-400 mx-auto mb-4" />
          <h1 className="text-white text-4xl font-black mb-3">Preguntas Frecuentes</h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Todo lo que necesitás saber sobre compras, envíos, pagos y devoluciones.
          </p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all ${
                openIndex === i ? 'border-orange-500/30' : 'border-gray-800'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className={`shrink-0 ${openIndex === i ? 'text-orange-400' : 'text-gray-500'}`}>
                  {faq.icon}
                </div>
                <span className="text-white font-semibold text-sm flex-1">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>

              {openIndex === i && (
                <div className="px-5 pb-5 pl-[calc(1.25rem+20px)]">
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 p-6 bg-gray-900 rounded-2xl border border-gray-800 text-center">
          <p className="text-white font-semibold mb-2">¿No encontraste tu respuesta?</p>
          <p className="text-gray-400 text-sm mb-4">
            Escribinos y te respondemos en menos de 24 horas.
          </p>
          <a
            href="/shop/contacto"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-400 transition-colors"
          >
            Contactar
          </a>
        </div>
      </div>
    </div>
  );
}
