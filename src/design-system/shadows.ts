/**
 * Shadow System — Elevation levels
 * @module design-system/shadows
 */
export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.3)',
  md: '0 4px 12px rgba(0,0,0,0.4)',
  lg: '0 8px 30px rgba(0,0,0,0.4)',
  xl: '0 12px 40px rgba(0,0,0,0.5)',
  glow: '0 0 20px rgba(124,111,205,0.3)',
  glowLg: '0 0 32px rgba(124,111,205,0.4)',
  inner: 'inset 0 2px 4px rgba(0,0,0,0.3)',
} as const;

export type Shadows = typeof shadows;
