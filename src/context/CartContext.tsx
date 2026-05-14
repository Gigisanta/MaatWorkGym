'use client';

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { CartItem, ProductVariant, ShopProduct } from '@/lib/shop/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: ShopProduct; variant: ProductVariant; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { variantId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { variantId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload;
      const existing = state.items.find(i => i.variantId === variant.id);

      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.variantId === variant.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }

      const newItem: CartItem = {
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        brand: product.brand,
        flavor: variant.flavor ?? '',
        size: variant.size ?? '',
        price: variant.price,
        originalPrice: variant.originalPrice,
        quantity,
        image: product.image,
        slug: product.slug,
      };

      return { ...state, items: [...state.items, newItem] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.variantId !== action.payload.variantId),
      };

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(i => i.variantId !== action.payload.variantId),
        };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.variantId === action.payload.variantId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'LOAD_CART':
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (product: ShopProduct, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

const CART_STORAGE_KEY = 'sevjo-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        dispatch({ type: 'LOAD_CART', payload: items });
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore
    }
  }, [state.items]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    itemCount,
    subtotal,
    addItem: (product, variant, quantity = 1) =>
      dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } }),
    removeItem: (variantId) =>
      dispatch({ type: 'REMOVE_ITEM', payload: { variantId } }),
    updateQuantity: (variantId, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { variantId, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
