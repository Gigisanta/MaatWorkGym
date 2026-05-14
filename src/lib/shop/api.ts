// ============================================================================
// SHOP API CLIENT — Cliente unificado para la API de ecommerce
// ============================================================================

import type {
  ShopProduct,
  Category,
  Coupon,
  OrderPayload,
  Order,
  ApiResponse,
  ProductsResponse,
  CategoriesResponse,
  FeaturedResponse,
  OrdersResponse,
  EcommerceConfig,
} from './types';
import {
  products,
  categories,
  getMockProductsResponse,
  getMockProductBySlug,
  getMockFeaturedResponse,
  getMockCategoriesResponse,
} from './mockData';

const API_BASE = '/api/ecommerce';

// ─── Helper ──────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.error?.message || error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

async function fetchWithMock<T>(
  url: string,
  mockFn: () => T
): Promise<T> {
  try {
    const res = await fetch(url);
    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Invalid JSON response');
    }
    // API returned an error (DB unavailable, etc.)
    if (!res.ok || data?.success === false) {
      throw new Error(data?.error?.message || `HTTP ${res.status}`);
    }
    return (data as ApiResponse<T>).data as T;
  } catch {
    return mockFn();
  }
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(params?: {
  category?: string;
  brand?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<ProductsResponse> {
  const sp = new URLSearchParams();
  if (params?.category) sp.set('category', params.category);
  if (params?.brand) sp.set('brand', params.brand);
  if (params?.search) sp.set('search', params.search);
  if (params?.sort) sp.set('sort', params.sort);
  if (params?.minPrice !== undefined) sp.set('minPrice', String(params.minPrice));
  if (params?.maxPrice !== undefined) sp.set('maxPrice', String(params.maxPrice));
  if (params?.inStock) sp.set('inStock', 'true');
  if (params?.page !== undefined) sp.set('page', String(params.page));
  if (params?.pageSize !== undefined) sp.set('pageSize', String(params.pageSize));

  const qs = sp.toString();
  const url = `${API_BASE}/products${qs ? `?${qs}` : ''}`;
  return fetchWithMock<ProductsResponse>(url, () =>
    getMockProductsResponse(params)
  );
}

export async function getProductBySlug(slug: string): Promise<ShopProduct | null> {
  return fetchWithMock<ShopProduct | null>(
    `${API_BASE}/products`,
    () => getMockProductBySlug(slug)
  );
}

export async function getFeaturedProducts(): Promise<{ featured: ShopProduct[]; bestSellers: ShopProduct[]; newArrivals: ShopProduct[] }> {
  return fetchWithMock<FeaturedResponse>(
    `${API_BASE}/featured`,
    () => getMockFeaturedResponse()
  ) as Promise<{ featured: ShopProduct[]; bestSellers: ShopProduct[]; newArrivals: ShopProduct[] }>;
}

export async function getProductsByCategory(categorySlug: string): Promise<ShopProduct[]> {
  const result = await getProducts({ category: categorySlug });
  return result.products;
}

export async function searchProducts(query: string): Promise<ShopProduct[]> {
  const result = await getProducts({ search: query });
  return result.products;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  return fetchWithMock<Category[]>(
    `${API_BASE}/categories`,
    () => getMockCategoriesResponse().categories
  );
}

// ─── Coupons ─────────────────────────────────────────────────────────────────

export async function getCoupons(): Promise<Coupon[]> {
  const data = await fetch(`${API_BASE}/coupons`).then(r => handleResponse<ApiResponse<{ coupons: Coupon[] }>>(
    { ok: r.ok, json: () => r.json() } as Response
  ));
  return data.data?.coupons ?? [];
}

export async function validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; discount: number; message: string; coupon?: Coupon }> {
  try {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartTotal: subtotal }),
    });
    const data = await res.json();
    if (data.valid) {
      return {
        valid: true,
        discount: data.discount ?? 0,
        message: 'Cupón aplicado',
        coupon: data.coupon,
      };
    }
    return { valid: false, discount: 0, message: data.message || 'Cupón inválido' };
  } catch {
    return { valid: false, discount: 0, message: 'Error al validar cupón' };
  }
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function createOrder(payload: OrderPayload): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error al crear la orden' }));
    throw new Error(error.error?.message || error.message);
  }

  const data = await handleResponse<ApiResponse<{ order: Order }>>(res);
  if (!data.data?.order) throw new Error('No se recibió la orden');
  return data.data.order;
}

export async function getOrders(): Promise<{ orders: Order[]; total: number }> {
  const data = await fetch(`${API_BASE}/orders`).then(r => handleResponse<ApiResponse<OrdersResponse>>(
    { ok: r.ok, json: () => r.json() } as Response
  ));
  const d = data.data;
  return { orders: d?.orders ?? [], total: d?.total ?? 0 };
}

// ─── Config ──────────────────────────────────────────────────────────────────

export async function getEcommerceConfig(): Promise<EcommerceConfig> {
  const data = await fetch(`${API_BASE}/config`).then(r => handleResponse<ApiResponse<{ config: EcommerceConfig }>>(
    { ok: r.ok, json: () => r.json() } as Response
  ));
  return data.data?.config ?? getDefaultConfig();
}

function getDefaultConfig(): EcommerceConfig {
  return {
    storeName: 'Sevjo Supplements',
    storeTagline: 'Suplementos premium para alcanzar tu mejor versión',
    currency: 'ARS',
    freeShippingThreshold: 75000,
    standardShippingCost: 5990,
    expressShippingCost: 12990,
    minimumOrderAmount: 5000,
    contactEmail: 'hola@sevjo.maat.work',
    contactPhone: '+54 9 11 0000 0000',
    address: 'Buenos Aires, Argentina',
    socialLinks: { instagram: 'https://instagram.com/sevjo' },
  };
}
