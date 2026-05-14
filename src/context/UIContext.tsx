'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIContextValue {
  // Cart drawer
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Quick view modal
  quickViewProduct: { id: string; slug: string } | null;
  openQuickView: (id: string, slug: string) => void;
  closeQuickView: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const UIContext = createContext<UIContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<{ id: string; slug: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const openQuickView = useCallback((id: string, slug: string) => {
    setQuickViewProduct({ id, slug });
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value: UIContextValue = {
    cartOpen,
    setCartOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    quickViewProduct,
    openQuickView,
    closeQuickView,
    toasts,
    addToast,
    removeToast,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
