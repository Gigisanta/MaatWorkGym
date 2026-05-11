/**
 * Design Tokens — Single Source of Truth
 * @module design-system/tokens
 * All CSS variables and TypeScript constants are generated from this file
 */

export const tokens = {
  colors: {
    bgBase: '#0D0D0F',
    bgSurface: '#141416',
    bgElevated: '#1C1C1F',
    accent: '#7C6FCD',
    accentLight: '#8B5CF6',
    accentDark: '#6D28D9',
    success: '#2ECC8F',
    danger: '#E8514A',
    warning: '#F59E0B',
    info: '#3B82F6',
    textPrimary: '#F0EFF4',
    textSecondary: '#6E6D7A',
    border: 'rgba(255,255,255,0.06)',
    borderAccent: 'rgba(124,111,205,0.4)',
    borderSubtle: 'rgba(255,255,255,0.04)',
    accentBg: 'rgba(124,111,205,0.15)',
    successBg: 'rgba(46,204,143,0.15)',
    dangerBg: 'rgba(232,81,74,0.15)',
    amberBg: 'rgba(245,158,11,0.15)',
    blueBg: 'rgba(59,130,246,0.15)',
  },
  typography: {
    fontHeading: "'Syne', sans-serif",
    fontBody: "'DM Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    sizes: {
      xs: 11,
      sm: 12,
      md: 13,
      base: 14,
      lg: 16,
      xl: 20,
      '2xl': 22,
      '3xl': 28,
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    10: 40,
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 14,
    '2xl': 16,
    full: 9999,
  },
  zIndex: {
    dropdown: 50,
    sticky: 100,
    overlay: 150,
    modal: 200,
    popover: 250,
    tooltip: 300,
    toast: 400,
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 12px rgba(0,0,0,0.4)',
    lg: '0 8px 30px rgba(0,0,0,0.4)',
    glow: '0 0 20px rgba(124,111,205,0.3)',
  },
} as const;

export type DesignTokens = typeof tokens;
