'use client';

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { WishlistItem, ShopProduct, ProductVariant } from '@/lib/shop/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: { product: ShopProduct; variants: ProductVariant[] } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'TOGGLE_ITEM'; payload: { product: ShopProduct; variants: ProductVariant[] } }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variants } = action.payload;
      if (state.items.find(i => i.productId === product.id)) return state;

      const newItem: WishlistItem = {
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.variants[0]?.price ?? 0,
        image: product.image,
        slug: product.slug,
        variants,
        product,
      };

      return { ...state, items: [...state.items, newItem] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.productId !== action.payload.productId),
      };

    case 'TOGGLE_ITEM': {
      const { product, variants } = action.payload;
      const exists = state.items.find(i => i.productId === product.id);
      if (exists) {
        return {
          ...state,
          items: state.items.filter(i => i.productId !== product.id),
        };
      }
      return {
        ...state,
        items: [...state.items, {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.variants[0]?.price ?? 0,
          image: product.image,
          slug: product.slug,
          variants,
          product,
        }],
      };
    }

    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };

    case 'LOAD_WISHLIST':
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface WishlistContextValue {
  items: WishlistItem[];
  itemCount: number;
  isInWishlist: (productId: string) => boolean;
  addItem: (product: ShopProduct, variants: ProductVariant[]) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: ShopProduct, variants: ProductVariant[]) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

const WISHLIST_STORAGE_KEY = 'sevjo-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as WishlistItem[];
        dispatch({ type: 'LOAD_WISHLIST', payload: items });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore
    }
  }, [state.items]);

  const value: WishlistContextValue = {
    items: state.items,
    itemCount: state.items.length,
    isInWishlist: (productId) => state.items.some(i => i.productId === productId),
    addItem: (product, variants) =>
      dispatch({ type: 'ADD_ITEM', payload: { product, variants } }),
    removeItem: (productId) =>
      dispatch({ type: 'REMOVE_ITEM', payload: { productId } }),
    toggleItem: (product, variants) =>
      dispatch({ type: 'TOGGLE_ITEM', payload: { product, variants } }),
    clearWishlist: () => dispatch({ type: 'CLEAR_WISHLIST' }),
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
