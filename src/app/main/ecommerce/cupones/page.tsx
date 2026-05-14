'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Ticket,
  Plus,
  Loader2,
  Pencil,
  Trash2,
  X,
  Check,
  Star,
  Calendar,
  DollarSign,
  Percent,
  Infinity,
  Tag,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Coupon {
  id: string;
  code: string;
  title?: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount?: number;
  validFrom?: string;
  validUntil?: string;
  applicableCategories?: string[];
  featured?: boolean;
  active: boolean;
  createdAt: string;
}

interface CouponFormData {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
  minPurchase: string;
  maxDiscount: string;
  usageLimit: string;
  validFrom: string;
  validUntil: string;
  applicableCategories: string;
  featured: boolean;
  active: boolean;
}

const defaultFormData: CouponFormData = {
  code: '',
  title: '',
  description: '',
  discountType: 'percentage',
  discountValue: '',
  minPurchase: '',
  maxDiscount: '',
  usageLimit: '',
  validFrom: '',
  validUntil: '',
  applicableCategories: '',
  featured: false,
  active: true,
};

// Confirm Modal Component
function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm">
        <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-destructive/10">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{message}</p>
          </div>
          <div className="px-6 py-4 border-t border-border bg-secondary/50 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-border hover:bg-card transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 bg-destructive hover:bg-destructive text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Coupon Modal Component
function CouponModal({
  coupon,
  onClose,
  onSave,
  isLoading,
}: {
  coupon: Coupon | null;
  onClose: () => void;
  onSave: (data: CouponFormData) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<CouponFormData>(
    coupon
      ? {
          code: coupon.code,
          title: coupon.title || '',
          description: coupon.description || '',
          discountType: coupon.discountType,
          discountValue: coupon.discountValue.toString(),
          minPurchase: coupon.minPurchase?.toString() || '',
          maxDiscount: coupon.maxDiscount?.toString() || '',
          usageLimit: coupon.usageLimit?.toString() || '',
          validFrom: coupon.validFrom ? coupon.validFrom.split('T')[0] : '',
          validUntil: coupon.validUntil ? coupon.validUntil.split('T')[0] : '',
          applicableCategories: coupon.applicableCategories?.join(', ') || '',
          featured: coupon.featured || false,
          active: coupon.active,
        }
      : defaultFormData
  );

  const handleChange = (field: keyof CouponFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-2xl"
      >
        <div className="sticky top-0 bg-card border-b border-border/60 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {coupon ? 'Editar Cupón' : 'Crear Cupón'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Código <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              placeholder="EJEMPLO20"
              required
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="20% de descuento en tu primera compra"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Válido para nuevos clientes..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Tipo de Descuento <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => handleChange('discountType', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto Fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Valor <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => handleChange('discountValue', e.target.value)}
                placeholder={formData.discountType === 'percentage' ? '20' : '5000'}
                min="0"
                required
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Min Purchase & Max Discount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Compra Mínima</label>
              <input
                type="number"
                value={formData.minPurchase}
                onChange={(e) => handleChange('minPurchase', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Descuento Máximo</label>
              <input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => handleChange('maxDiscount', e.target.value)}
                placeholder="Sin límite"
                min="0"
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Usage Limit */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Límite de Usos</label>
            <input
              type="number"
              value={formData.usageLimit}
              onChange={(e) => handleChange('usageLimit', e.target.value)}
              placeholder="Ilimitado"
              min="0"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Validity Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Válido Desde</label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleChange('validFrom', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Válido Hasta</label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => handleChange('validUntil', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Applicable Categories */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Categorías Aplicables</label>
            <input
              type="text"
              value={formData.applicableCategories}
              onChange={(e) => handleChange('applicableCategories', e.target.value)}
              placeholder="Proteínas, Creatina (separadas por coma)"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Featured & Active Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                type="button"
                onClick={() => handleChange('featured', !formData.featured)}
                className={cn(
                  'w-10 h-6 rounded-full transition-colors relative',
                  formData.featured ? 'bg-primary' : 'bg-muted'
                )}
              >
                <div
                  className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
                    formData.featured ? 'translate-x-5' : 'translate-x-1'
                  )}
                />
              </button>
              <span className="text-sm font-medium">Destacado</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <button
                type="button"
                onClick={() => handleChange('active', !formData.active)}
                className={cn(
                  'w-10 h-6 rounded-full transition-colors relative',
                  formData.active ? 'bg-green-500' : 'bg-muted'
                )}
              >
                <div
                  className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
                    formData.active ? 'translate-x-5' : 'translate-x-1'
                  )}
                />
              </button>
              <span className="text-sm font-medium">Activo</span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check size={16} />
                  {coupon ? 'Actualizar Cupón' : 'Crear Cupón'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Discount Badge Component
function DiscountBadge({ type, value }: { type: 'percentage' | 'fixed'; value: number }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold',
        type === 'percentage'
          ? 'bg-primary/10 text-primary'
          : 'bg-green-500/10 text-green-600'
      )}
    >
      {type === 'percentage' ? <Percent size={12} /> : <DollarSign size={12} />}
      {type === 'percentage' ? `${value}%` : value.toLocaleString('es-AR')}
    </span>
  );
}

// Status Badge Component
function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
        active ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
      )}
    >
      <div className={cn('w-1.5 h-1.5 rounded-full', active ? 'bg-green-500' : 'bg-muted-foreground')} />
      {active ? 'Activo' : 'Inactivo'}
    </span>
  );
}

// Featured Badge Component
function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-600">
      <Star size={12} />
      Destacado
    </span>
  );
}

// Usage Display Component
function UsageDisplay({ usedCount, usageLimit }: { usedCount?: number; usageLimit?: number | null }) {
  if (usageLimit === null || usageLimit === undefined) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Infinity size={12} />
        Ilimitado
      </span>
    );
  }
  return (
    <span className="text-xs text-muted-foreground">
      {usedCount || 0} / {usageLimit}
    </span>
  );
}

// Main Page
export default function CuponesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<'create' | 'edit' | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ id: string; code: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/ecommerce/coupons');
      if (!res.ok) throw new Error('Error al cargar cupones');
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : data.data?.coupons || []);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar cupones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Create coupon
  const handleCreate = async (formData: CouponFormData) => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/ecommerce/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code,
          title: formData.title || null,
          description: formData.description || null,
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : null,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          validFrom: formData.validFrom || null,
          validUntil: formData.validUntil || null,
          applicableCategories: formData.applicableCategories
            ? formData.applicableCategories.split(',').map((c) => c.trim()).filter(Boolean)
            : null,
          featured: formData.featured,
          active: formData.active,
        }),
      });
      if (!res.ok) throw new Error('Error al crear cupón');
      await fetchCoupons();
      setShowModal(null);
    } catch (err) {
      console.error('Error creating coupon:', err);
      alert(err instanceof Error ? err.message : 'Error al crear cupón');
    } finally {
      setIsSaving(false);
    }
  };

  // Update coupon
  const handleUpdate = async (formData: CouponFormData) => {
    if (!selectedCoupon) return;
    try {
      setIsSaving(true);
      const res = await fetch(`/api/ecommerce/coupons/${selectedCoupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code,
          title: formData.title || null,
          description: formData.description || null,
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : null,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          validFrom: formData.validFrom || null,
          validUntil: formData.validUntil || null,
          applicableCategories: formData.applicableCategories
            ? formData.applicableCategories.split(',').map((c) => c.trim()).filter(Boolean)
            : null,
          featured: formData.featured,
          active: formData.active,
        }),
      });
      if (!res.ok) throw new Error('Error al actualizar cupón');
      await fetchCoupons();
      setShowModal(null);
      setSelectedCoupon(null);
    } catch (err) {
      console.error('Error updating coupon:', err);
      alert(err instanceof Error ? err.message : 'Error al actualizar cupón');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle active
  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/ecommerce/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !coupon.active }),
      });
      if (!res.ok) throw new Error('Error al actualizar estado');
      await fetchCoupons();
    } catch (err) {
      console.error('Error toggling coupon:', err);
    }
  };

  // Delete coupon
  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/ecommerce/coupons/${showDeleteConfirm.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar cupón');
      await fetchCoupons();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting coupon:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter coupons
  const filteredCoupons = useMemo(() => {
    if (!searchQuery) return coupons;
    const query = searchQuery.toLowerCase();
    return coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        c.title?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
    );
  }, [coupons, searchQuery]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Stats
  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.active).length;
    const featured = coupons.filter((c) => c.featured).length;
    return { total, active, featured };
  }, [coupons]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
        <div className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Cargando cupones...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
        <div className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-destructive font-medium">{error}</p>
            <button
              onClick={fetchCoupons}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 relative z-20 shrink-0 border-b border-border/60 bg-background">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Ticket size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Cupones</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {stats.total} cupones ({stats.active} activos)
            </p>
          </div>
        </div>

        <div className="w-full lg:w-auto overflow-x-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cupón..."
            className="w-full lg:w-64 min-h-10 pl-4 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button
            onClick={() => {
              setSelectedCoupon(null);
              setShowModal('create');
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 min-h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
          >
            <Plus size={16} />
            <span>Crear Cupón</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card size="sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Ticket size={16} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                    <Check size={16} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stats.active}</p>
                    <p className="text-xs text-muted-foreground">Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Star size={16} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stats.featured}</p>
                    <p className="text-xs text-muted-foreground">Destacados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coupon List */}
          {filteredCoupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Ticket size={24} />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">
                  {searchQuery ? 'No se encontraron cupones' : 'No hay cupones'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery
                    ? 'Intenta con otra búsqueda'
                    : 'Crea tu primer cupón para comenzar'}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={() => {
                    setSelectedCoupon(null);
                    setShowModal('create');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                >
                  <Plus size={16} />
                  Crear Cupón
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCoupons.map((coupon) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border/60 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Left: Code & Title */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-lg font-bold font-mono text-foreground bg-muted/50 px-2 py-0.5 rounded">
                          {coupon.code}
                        </code>
                        <DiscountBadge type={coupon.discountType} value={coupon.discountValue} />
                        {coupon.featured && <FeaturedBadge />}
                        <StatusBadge active={coupon.active} />
                      </div>
                      {coupon.title && (
                        <p className="text-sm font-medium text-foreground truncate">
                          {coupon.title}
                        </p>
                      )}
                      {coupon.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {coupon.description}
                        </p>
                      )}
                    </div>

                    {/* Middle: Details */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {coupon.minPurchase && (
                        <span className="inline-flex items-center gap-1">
                          <Tag size={12} />
                          Mín: {formatCurrency(coupon.minPurchase)}
                        </span>
                      )}
                      {coupon.maxDiscount && (
                        <span className="inline-flex items-center gap-1">
                          <DollarSign size={12} />
                          Máx: {formatCurrency(coupon.maxDiscount)}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(coupon.validFrom) || 'Sin fecha'} - {formatDate(coupon.validUntil) || 'Sin fecha'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Check size={12} />
                        Usos: <UsageDisplay usedCount={coupon.usedCount} usageLimit={coupon.usageLimit} />
                      </span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                          coupon.active
                            ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                        title={coupon.active ? 'Desactivar' : 'Activar'}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setShowModal('edit');
                        }}
                        className="w-9 h-9 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm({ id: coupon.id, code: coupon.code })}
                        className="w-9 h-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center justify-center transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <CouponModal
            coupon={showModal === 'edit' ? selectedCoupon : null}
            onClose={() => {
              setShowModal(null);
              setSelectedCoupon(null);
            }}
            onSave={showModal === 'create' ? handleCreate : handleUpdate}
            isLoading={isSaving}
          />
        )}
      </AnimatePresence>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Eliminar Cupón"
          message={`¿Estás seguro de que deseas eliminar el cupón "${showDeleteConfirm.code}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
