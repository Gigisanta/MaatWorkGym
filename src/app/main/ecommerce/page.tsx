'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  DollarSign,
  Package,
  Ticket,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  image: string | null;
  featured: boolean;
  bestSeller: boolean;
  variants: Array<{ price: number; originalPrice?: number }>;
}

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  active: boolean;
  featured: boolean;
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Pendiente' },
  confirmed: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Confirmado' },
  processing: { bg: 'bg-purple-500/10', text: 'text-purple-500', label: 'Procesando' },
  shipped: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', label: 'Enviado' },
  in_transit: { bg: 'bg-orange-500/10', text: 'text-orange-500', label: 'En Tránsito' },
  delivered: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Entregado' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Cancelado' },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ============================================================================
// Stat Card
// ============================================================================

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  index: number;
  trend?: { value: number; positive: boolean } | null;
}

function StatCard({ label, value, icon, iconBgClass, iconColorClass, trend, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBgClass)}>
          <span className={iconColorClass}>{icon}</span>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md",
            trend.positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          )}>
            {trend.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend.value}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

// ============================================================================
// Status Badge
// ============================================================================

function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", colors.bg, colors.text)}>
      {colors.label}
    </span>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function EcommerceDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const [ordersRes, featuredRes, couponsRes] = await Promise.all([
          fetch('/api/ecommerce/orders?limit=5'),
          fetch('/api/ecommerce/featured'),
          fetch('/api/ecommerce/coupons'),
        ]);

        if (!ordersRes.ok || !featuredRes.ok || !couponsRes.ok) {
          throw new Error('Error al cargar datos');
        }

        const ordersData = await ordersRes.json();
        const featuredData = await featuredRes.json();
        const couponsData = await couponsRes.json();

        setOrders(ordersData.data?.orders || []);
        setProducts([
          ...(featuredData.products || []),
          ...(featuredData.bestSellers || []),
        ]);
        setCoupons(couponsData.data?.coupons?.filter((c: Coupon) => c.active) || couponsData.filter((c: Coupon) => c.active) || []);
      } catch (err) {
        console.error('Error fetching ecommerce data:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const activeCoupons = coupons.filter(c => c.active).length;
    const totalProducts = products.length;

    return { totalOrders, revenue, activeCoupons, totalProducts };
  }, [orders, products, coupons]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
        <div className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Cargando datos del ecommerce...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
        <div className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-4 text-destructive">
            <p className="text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-destructive/10 hover:bg-destructive/20 rounded-lg text-sm font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get top 5 products: featured first, then bestsellers
  const topProducts = useMemo(() => {
    const featured = products.filter(p => p.featured).slice(0, 3);
    const bestSellers = products.filter(p => p.bestSeller && !p.featured).slice(0, 5 - featured.length);
    return [...featured, ...bestSellers].slice(0, 5);
  }, [products]);

  // Get recent orders (already sorted by API)
  const recentOrders = orders.slice(0, 5);

  // Active featured coupons
  const activeCoupons = coupons.filter(c => c.active && c.featured).slice(0, 4);

  return (
    <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 relative z-20 shrink-0 border-b border-border/60 bg-background">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ShoppingCart size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Ecommerce</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Panel de gestión de tienda</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://suplementos.sevjo.maat.work"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-orange-500/20"
          >
            <span>🛒</span>
            <span>Ver Tienda</span>
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-heading text-xl sm:text-2xl font-semibold text-foreground">
              Dashboard
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Resumen del rendimiento de tu tienda online
            </p>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Órdenes"
              value={stats.totalOrders}
              icon={<ShoppingCart size={20} />}
              iconBgClass="bg-blue-500/10"
              iconColorClass="text-blue-500"
              index={0}
            />
            <StatCard
              label="Ingresos Totales"
              value={formatCurrency(stats.revenue)}
              icon={<DollarSign size={20} />}
              iconBgClass="bg-green-500/10"
              iconColorClass="text-green-500"
              index={1}
            />
            <StatCard
              label="Productos"
              value={stats.totalProducts}
              icon={<Package size={20} />}
              iconBgClass="bg-purple-500/10"
              iconColorClass="text-purple-500"
              index={2}
            />
            <StatCard
              label="Cupones Activos"
              value={stats.activeCoupons}
              icon={<Ticket size={20} />}
              iconBgClass="bg-amber-500/10"
              iconColorClass="text-amber-500"
              index={3}
            />
          </div>

          {/* Recent Orders & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Órdenes Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No hay órdenes recientes
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between py-3 border-b border-border/40 last:border-0"
                        >
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-sm font-medium text-foreground truncate">
                              {order.orderNumber}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {order.customerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm font-semibold text-foreground">
                              {formatCurrency(order.total)}
                            </span>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Productos Destacados</CardTitle>
                </CardHeader>
                <CardContent>
                  {topProducts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No hay productos destacados
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topProducts.map((product) => {
                        const minPrice = Math.min(...product.variants.map(v => v.price));
                        return (
                          <div
                            key={product.id}
                            className="flex items-center gap-3 py-2"
                          >
                            <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package size={20} className="text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {product.featured && (
                                  <Badge variant="default" className="text-[10px] px-1.5 py-0">Destacado</Badge>
                                )}
                                {product.bestSeller && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Más Vendido</Badge>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-foreground shrink-0">
                              {formatCurrency(minPrice)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Active Coupons */}
          {activeCoupons.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Ofertas y Cupones Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activeCoupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className="bg-gradient-to-br from-primary/10 to-amber-500/10 rounded-lg p-4 border border-primary/20"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-lg font-bold text-foreground font-mono">
                            {coupon.code}
                          </span>
                          <Badge variant="warning" className="text-[10px]">
                            {coupon.discountType === 'percentage'
                              ? `${coupon.discountValue}%`
                              : formatCurrency(coupon.discountValue)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}% de descuento`
                            : `Descuento fijo`}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
