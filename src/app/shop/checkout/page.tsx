'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Tag,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowRight,
  Lock,
  X,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/shop/formatters';
import { validateCoupon, getEcommerceConfig } from '@/lib/shop/api';
import type { EcommerceConfig, Coupon } from '@/lib/shop/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  const [config, setConfig] = useState<EcommerceConfig | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'mercadopago'>('cash');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  useEffect(() => {
    getEcommerceConfig().then(setConfig).catch((err) => {
      console.error('Failed to load ecommerce config:', err);
    });
  }, []);

  const shippingCost = shippingMethod === 'express'
    ? (config?.expressShippingCost ?? 12990)
    : subtotal >= (config?.freeShippingThreshold ?? 75000)
      ? 0
      : (config?.standardShippingCost ?? 5990);

  const discount = couponDiscount;
  const total = subtotal - discount + shippingCost;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const result = await validateCoupon(couponCode, subtotal);
      if (result.valid) {
        setCouponDiscount(result.discount);
        setCoupon(result.coupon ?? null);
      } else {
        setCouponError(result.message);
        setCouponDiscount(0);
        setCoupon(null);
      }
    } catch {
      setCouponError('Error al validar cupón');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponDiscount(0);
    setCoupon(null);
    setCouponCode('');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nombre requerido';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Email requerido';
    if (!form.phone.trim()) errs.phone = 'Teléfono requerido';
    if (!form.street.trim()) errs.street = 'Dirección requerida';
    if (!form.city.trim()) errs.city = 'Ciudad requerida';
    if (!form.state.trim()) errs.state = 'Provincia requerida';
    if (!form.zipCode.trim()) errs.zipCode = 'CP requerido';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/ecommerce/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: {
            street: form.street,
            city: form.city,
            state: form.state,
            zipCode: form.zipCode,
            instructions: form.instructions,
          },
          shippingMethod,
          paymentMethod,
          couponCode: coupon?.code,
          items: items.map(i => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          subtotal,
          shippingCost,
          discount,
          total,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Error al crear orden');

      clearCart();
      setOrderSuccess(data.data?.order?.orderNumber ?? 'OK');
    } catch (err: any) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center">
          <ShoppingCart size={40} className="text-gray-600" />
        </div>
        <div className="text-center">
          <h1 className="text-white text-2xl font-black mb-2">Tu carrito está vacío</h1>
          <p className="text-gray-400 text-sm">Agregá productos para proceder al checkout</p>
        </div>
        <Link
          href="/shop/tienda"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-sm rounded-xl hover:from-orange-400 hover:to-red-500 transition-all"
        >
          <span>Ir a la Tienda</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center animate-in zoom-in duration-500">
          <CheckCircle2 size={48} className="text-green-400" />
        </div>
        <div className="text-center">
          <h1 className="text-white text-2xl font-black mb-2">¡Pedido Confirmado!</h1>
          <p className="text-gray-400 text-sm">
            Tu pedido <span className="font-bold text-white">#{orderSuccess}</span> fue creado exitosamente.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Te contactaremos pronto para coordinar el envío.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/shop" className="px-6 py-3 bg-gray-800 text-white font-bold text-sm rounded-xl hover:bg-gray-700 transition-colors">
            Volver al Inicio
          </Link>
          <Link href="/shop/tienda" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-sm rounded-xl hover:from-orange-400 hover:to-red-500 transition-all">
            Seguir Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-white text-2xl font-black">Finalizar Compra</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── FORM ──────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Contact */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-white font-bold text-lg mb-4">Datos de Contacto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1 block">Nombre completo *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Juan Pérez"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm focus:outline-none focus:ring-1 ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1 block">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="juan@email.com"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm focus:outline-none focus:ring-1 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-gray-400 text-xs font-medium mb-1 block">Teléfono *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+54 9 11 0000 0000"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm focus:outline-none focus:ring-1 ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Truck size={18} className="text-orange-400" />
                Datos de Envío
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-gray-400 text-xs font-medium mb-1 block">Dirección *</label>
                  <input
                    type="text"
                    value={form.street}
                    onChange={e => setForm(f => ({ ...f, street: e.target.value }))}
                    placeholder="Av. Corrientes 1234, Piso 2, Depto A"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm focus:outline-none focus:ring-1 ${
                      errors.street ? 'border-red-500' : 'border-gray-700 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  />
                  {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street}</p>}
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1 block">Ciudad *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="Buenos Aires"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm focus:outline-none focus:ring-1 ${
                      errors.city ? 'border-red-500' : 'border-gray-700 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1 block">Provincia *</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                    placeholder="CABA"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm focus:outline-none focus:ring-1 ${
                      errors.state ? 'border-red-500' : 'border-gray-700 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  />
                  {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1 block">Código Postal *</label>
                  <input
                    type="text"
                    value={form.zipCode}
                    onChange={e => setForm(f => ({ ...f, zipCode: e.target.value }))}
                    placeholder="C1001"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white text-sm focus:outline-none focus:ring-1 ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-700 focus:border-orange-500 focus:ring-orange-500'
                    }`}
                  />
                  {errors.zipCode && <p className="text-red-400 text-xs mt-1">{errors.zipCode}</p>}
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1 block">Instrucciones (opcional)</label>
                  <input
                    type="text"
                    value={form.instructions}
                    onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
                    placeholder="Timbre, referencia, etc."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-white font-bold text-lg mb-4">Método de Envío</h2>
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-orange-500 bg-orange-500/5'
                    : 'border-gray-700 hover:border-gray-600'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-orange-500"
                    />
                    <div>
                      <p className="text-white text-sm font-semibold">Envío Estándar</p>
                      <p className="text-gray-500 text-xs">Entrega en 3-5 días hábiles</p>
                    </div>
                  </div>
                  <span className="text-orange-400 font-bold text-sm">
                    {subtotal >= (config?.freeShippingThreshold ?? 75000)
                      ? 'GRATIS'
                      : formatCurrency(config?.standardShippingCost ?? 5990)}
                  </span>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'border-orange-500 bg-orange-500/5'
                    : 'border-gray-700 hover:border-gray-600'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-orange-500"
                    />
                    <div>
                      <p className="text-white text-sm font-semibold">Envío Express</p>
                      <p className="text-gray-500 text-xs">Entrega en 24-48hs</p>
                    </div>
                  </div>
                  <span className="text-orange-400 font-bold text-sm">
                    {formatCurrency(config?.expressShippingCost ?? 12990)}
                  </span>
                </label>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-orange-400" />
                Método de Pago
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'cash' as const, label: 'Contra Reembolso', desc: 'Pagás cuando recibís', icon: Banknote },
                  { value: 'transfer' as const, label: 'Transferencia Bancaria', desc: 'Datos para transferir', icon: Banknote },
                  { value: 'mercadopago' as const, label: 'MercadoPago', desc: 'Pago online seguro', icon: CreditCard },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === opt.value
                        ? 'border-orange-500 bg-orange-500/5'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="accent-orange-500"
                    />
                    <opt.icon size={18} className={paymentMethod === opt.value ? 'text-orange-400' : 'text-gray-500'} />
                    <div>
                      <p className="text-white text-sm font-semibold">{opt.label}</p>
                      <p className="text-gray-500 text-xs">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── ORDER SUMMARY ────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 sticky top-24 space-y-6">

              <h2 className="text-white font-bold text-lg">Resumen del Pedido</h2>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.variantId} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg bg-gray-800 overflow-hidden shrink-0 relative">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium line-clamp-1">{item.name}</p>
                      <p className="text-gray-500 text-[10px]">{item.flavor} / {item.size}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-5 h-5 rounded bg-gray-700 flex items-center justify-center text-white"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-white text-xs w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-5 h-5 rounded bg-gray-700 flex items-center justify-center text-white"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <span className="text-orange-400 text-xs font-bold">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="p-1 text-gray-600 hover:text-red-400 self-start"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="pt-4 border-t border-gray-800 space-y-2">
                <h3 className="text-white text-xs font-semibold flex items-center gap-1">
                  <Tag size={13} className="text-orange-400" /> Cupón de Descuento
                </h3>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div>
                      <span className="text-green-400 font-bold text-sm">{coupon.code}</span>
                      <span className="text-gray-400 text-xs ml-2">
                        -{formatCurrency(couponDiscount)}
                      </span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-gray-500 hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Código"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="px-3 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-400 disabled:opacity-50 transition-colors"
                    >
                      {couponLoading ? '...' : 'Aplicar'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-red-400 text-xs">{couponError}</p>}
              </div>

              {/* Totals */}
              <div className="pt-4 border-t border-gray-800 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {shippingCost === 0 && subtotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Envío</span>
                    <span className="text-green-400 font-medium">GRATIS</span>
                  </div>
                )}
                {shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Envío</span>
                    <span className="text-white font-medium">{formatCurrency(shippingCost)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Descuento</span>
                    <span className="text-green-400 font-medium">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-800">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-orange-400 font-black text-xl">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || items.length === 0}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all ${
                  isSubmitting
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-400 hover:to-red-500 shadow-xl shadow-orange-500/30'
                }`}
              >
                {isSubmitting ? (
                  <>Procesando...</>
                ) : (
                  <>
                    <Lock size={16} />
                    Confirmar Pedido
                  </>
                )}
              </button>

              {errors.submit && (
                <p className="text-red-400 text-xs text-center">{errors.submit}</p>
              )}

              <p className="text-gray-600 text-[10px] text-center">
                Tus datos están protegidos y nunca serán compartidos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
