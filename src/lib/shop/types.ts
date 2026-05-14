// ============================================================================
// SHOP TYPES — Tipos compartidos para toda la sección shop
// ============================================================================

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  categoryId: string;
  subcategory?: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  benefits: string[];
  ingredients: string;
  directions: string;
  warnings?: string;
  servingsPerContainer?: number;
  servingSize?: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  flavor?: string;
  size?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  productCount?: number;
  sortOrder?: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  brand: string;
  flavor: string;
  size: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  slug: string;
}

export interface WishlistItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  slug: string;
  variants: ProductVariant[];
  /** Full product object for rendering */
  product?: ShopProduct;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  active: boolean;
  featured: boolean;
  minPurchase?: number;
  validFrom?: string;
  validUntil?: string;
}

export interface OrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    instructions?: string;
  };
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'cash' | 'transfer' | 'mercadopago';
  couponCode?: string;
  items: {
    productId: string;
    variantId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  status: OrderStatus;
  shippingMethod: string;
  paymentMethod: string;
  couponCode?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    instructions?: string;
  };
  items: {
    id: string;
    productId: string;
    variantId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  createdAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface EcommerceConfig {
  storeName: string;
  storeTagline: string;
  currency: string;
  freeShippingThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
  minimumOrderAmount: number;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface ProductsResponse {
  products: ShopProduct[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface FeaturedResponse {
  featured: ShopProduct[];
  bestSellers: ShopProduct[];
  newArrivals: ShopProduct[];
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
}
