'use client';

import { useState, useEffect } from 'react';
import { Package, Loader2, ChevronLeft, ChevronRight, X, MapPin, Mail, Phone, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  brand: string | null;
  flavor: string;
  size: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  trackingNumber: string | null;
  carrier: string | null;
  items: OrderItem[];
  createdAt: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-600', bgColor: 'bg-yellow-500/10 border-yellow-500/30' },
  confirmed: { label: 'Confirmado', color: 'text-blue-600', bgColor: 'bg-blue-500/10 border-blue-500/30' },
  processing: { label: 'Procesando', color: 'text-purple-600', bgColor: 'bg-purple-500/10 border-purple-500/30' },
  shipped: { label: 'Enviado', color: 'text-cyan-600', bgColor: 'bg-cyan-500/10 border-cyan-500/30' },
  in_transit: { label: 'En Tránsito', color: 'text-orange-600', bgColor: 'bg-orange-500/10 border-orange-500/30' },
  delivered: { label: 'Entregado', color: 'text-green-600', bgColor: 'bg-green-500/10 border-green-500/30' },
  cancelled: { label: 'Cancelado', color: 'text-red-600', bgColor: 'bg-red-500/10 border-red-500/30' },
};

const STATUS_TABS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'processing', label: 'Procesando' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'in_transit', label: 'En Tránsito' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

const VALID_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'in_transit', 'delivered', 'cancelled'];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
}

export default function OrdenesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Tracking form state
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  useEffect(() => {
    if (selectedOrder) {
      setTrackingNumber(selectedOrder.trackingNumber || '');
      setCarrier(selectedOrder.carrier || '');
      setSelectedStatus(selectedOrder.status);
    }
  }, [selectedOrder]);

  async function fetchOrders() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }
      const res = await fetch(`/api/ecommerce/orders?${params}`);
      const data: OrdersResponse = await res.json();

      if (data.success) {
        setOrders(data.data.orders);
        setTotalPages(data.data.pagination.totalPages);
        setTotalCount(data.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchPendingCount() {
    try {
      const res = await fetch('/api/ecommerce/orders?status=pending&limit=1');
      const data = await res.json();
      if (data.success) {
        setPendingCount(data.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  }

  async function fetchOrderDetail(orderId: string) {
    setIsDetailLoading(true);
    try {
      const res = await fetch(`/api/ecommerce/orders/${orderId}`);
      const order = await res.json();
      setSelectedOrder(order);
    } catch (error) {
      console.error('Error fetching order detail:', error);
    } finally {
      setIsDetailLoading(false);
    }
  }

  async function updateOrderStatus() {
    if (!selectedOrder || !selectedStatus) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/ecommerce/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          tracking: trackingNumber ? JSON.stringify({ trackingNumber, carrier }) : undefined,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedOrder(updated);
        await fetchOrders();
        await fetchPendingCount();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setIsUpdating(false);
    }
  }

  function handleOrderClick(order: Order) {
    fetchOrderDetail(order.id);
  }

  function closeDetail() {
    setSelectedOrder(null);
    setTrackingNumber('');
    setCarrier('');
    setSelectedStatus('');
  }

  // Initial load
  useEffect(() => {
    fetchOrders();
    fetchPendingCount();
  }, []);

  return (
    <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 relative z-20 shrink-0 border-b border-border/60 bg-background">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Package size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Órdenes</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {totalCount} órdenes en total, {pendingCount} pendientes
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg mb-6 overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 whitespace-nowrap',
                  statusFilter === tab.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card size="sm" className="p-4">
              <div className="text-2xl font-bold">{totalCount}</div>
              <div className="text-xs text-muted-foreground">Total Órdenes</div>
            </Card>
            <Card size="sm" className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-xs text-muted-foreground">Pendientes</div>
            </Card>
            <Card size="sm" className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.status === 'confirmed' || o.status === 'processing').length}
              </div>
              <div className="text-xs text-muted-foreground">En Proceso</div>
            </Card>
            <Card size="sm" className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === 'delivered').length}
              </div>
              <div className="text-xs text-muted-foreground">Entregadas</div>
            </Card>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">Cargando órdenes...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Package className="w-12 h-12 text-muted-foreground/50" />
              <p className="text-muted-foreground text-sm">No hay órdenes para mostrar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleOrderClick(order)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-mono">{order.orderNumber}</CardTitle>
                      <Badge
                        variant="outline"
                        className={cn(
                          'font-medium',
                          STATUS_CONFIG[order.status as OrderStatus]?.bgColor,
                          STATUS_CONFIG[order.status as OrderStatus]?.color
                        )}
                      >
                        {STATUS_CONFIG[order.status as OrderStatus]?.label || order.status}
                      </Badge>
                    </div>
                    <CardDescription>{formatDate(order.createdAt)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Cliente</div>
                        <div className="text-sm font-medium">{order.customerName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Email</div>
                        <div className="text-sm truncate">{order.customerEmail}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Items</div>
                        <div className="text-sm font-medium">{order.items?.length || 0} productos</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Total</div>
                        <div className="text-sm font-bold text-primary">{formatPrice(order.total)}</div>
                      </div>
                    </div>
                  </CardContent>
                  {order.trackingNumber && (
                    <CardFooter className="pt-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Truck size={12} />
                        <span>{order.carrier || 'Transportista'}: {order.trackingNumber}</span>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDetail}
          />

          {/* Detail Panel */}
          <div className="relative w-full sm:max-w-2xl max-h-[90vh] bg-background rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Package size={20} />
                </div>
                <div>
                  <h2 className="font-semibold font-mono">{selectedOrder.orderNumber}</h2>
                  <p className="text-xs text-muted-foreground">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={closeDetail}>
                <X size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {isDetailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Customer Info */}
                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Información del Cliente</h3>
                    <Card size="sm" className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {selectedOrder.customerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{selectedOrder.customerName}</div>
                            <div className="text-xs text-muted-foreground">Cliente</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-muted-foreground" />
                          <a href={`mailto:${selectedOrder.customerEmail}`} className="text-primary hover:underline">
                            {selectedOrder.customerEmail}
                          </a>
                        </div>
                        {selectedOrder.customerPhone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone size={14} className="text-muted-foreground" />
                            <a href={`tel:${selectedOrder.customerPhone}`} className="text-foreground">
                              {selectedOrder.customerPhone}
                            </a>
                          </div>
                        )}
                      </div>
                    </Card>
                  </section>

                  {/* Shipping Address */}
                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Dirección de Envío</h3>
                    <Card size="sm" className="p-4">
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-muted-foreground mt-0.5" />
                        <div className="text-sm">
                          {typeof selectedOrder.shippingAddress === 'string'
                            ? JSON.parse(selectedOrder.shippingAddress)
                            : selectedOrder.shippingAddress}
                        </div>
                      </div>
                    </Card>
                  </section>

                  {/* Order Items */}
                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Productos</h3>
                    <Card size="sm" className="p-0 overflow-hidden">
                      <div className="divide-y divide-border/60">
                        {selectedOrder.items?.map((item) => (
                          <div key={item.id} className="p-4 flex items-center gap-4">
                            {item.image ? (
                              <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Package size={18} className="text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.brand && `${item.brand} • `}
                                {item.flavor} • {item.size}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-medium text-sm">{formatPrice(item.price)}</div>
                              <div className="text-xs text-muted-foreground">x{item.quantity}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </section>

                  {/* Order Totals */}
                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Resumen</h3>
                    <Card size="sm" className="p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>{formatPrice(selectedOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Envío</span>
                          <span>{formatPrice(selectedOrder.shipping)}</span>
                        </div>
                        {selectedOrder.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Descuento</span>
                            <span>-{formatPrice(selectedOrder.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Impuesto</span>
                          <span>{formatPrice(selectedOrder.tax)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border/60 font-bold">
                          <span>Total</span>
                          <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </Card>
                  </section>

                  {/* Status Change */}
                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Estado del Pedido</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {VALID_STATUSES.map((status) => (
                        <button
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                          className={cn(
                            'px-3 py-1.5 rounded-md text-xs font-medium border transition-all',
                            selectedStatus === status
                              ? STATUS_CONFIG[status].bgColor
                              : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
                          )}
                        >
                          {STATUS_CONFIG[status].label}
                        </button>
                      ))}
                    </div>
                    {selectedStatus !== selectedOrder.status && (
                      <Button
                        className="w-full"
                        onClick={updateOrderStatus}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Actualizando...
                          </>
                        ) : (
                          'Guardar Cambios'
                        )}
                      </Button>
                    )}
                  </section>

                  {/* Tracking Info */}
                  <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Información de Seguimiento</h3>
                    <Card size="sm" className="p-4 space-y-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Número de Tracking
                        </label>
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Ingresa el número de tracking"
                          className="w-full min-h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Transportista / Courier
                        </label>
                        <input
                          type="text"
                          value={carrier}
                          onChange={(e) => setCarrier(e.target.value)}
                          placeholder="Ej: Andreani, OCA, Correo Argentino"
                          className="w-full min-h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={updateOrderStatus}
                        disabled={isUpdating || (trackingNumber === selectedOrder.trackingNumber && carrier === selectedOrder.carrier)}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Truck size={16} />
                            Actualizar Tracking
                          </>
                        )}
                      </Button>
                    </Card>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
