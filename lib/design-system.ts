// ============================================================================
// GymPro Design System — Single Source of Truth
// All hardcoded values must reference constants defined here.
// ============================================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ---------------------------------------------------------------------------
// Color Palette
// ---------------------------------------------------------------------------

export const colors = {
  // Base surfaces
  bgBase: "#0D0D0F",
  bgSurface: "#141416",
  bgElevated: "#1C1C1F",

  // Semantic
  accent: "#7C6FCD",
  success: "#2ECC8F",
  danger: "#E8514A",
  amber: "#F59E0B",
  blue: "#3B82F6",

  // Text
  textPrimary: "#F0EFF4",
  textSecondary: "#6E6D7A",

  // Borders
  border: "rgba(255,255,255,0.06)",
  borderAccent: "rgba(124,111,205,0.4)",
  borderSubtle: "rgba(255,255,255,0.04)",

  // Chip backgrounds (semantic × 15% opacity)
  accentBg: "rgba(124,111,205,0.15)",
  successBg: "rgba(46,204,143,0.15)",
  dangerBg: "rgba(232,81,74,0.15)",
  amberBg: "rgba(245,158,11,0.15)",
  blueBg: "rgba(59,130,246,0.15)",
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const fontFamily = {
  syne: "'Syne', var(--font-syne), sans-serif",
  dmSans: "'DM Sans', var(--font-dm-sans), sans-serif",
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 16,
  xl: 20,
  "2xl": 22,
  "3xl": 28,
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

// ---------------------------------------------------------------------------
// Spacing & Layout
// ---------------------------------------------------------------------------

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
} as const;

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 14,
  "2xl": 16,
  full: 9999,
} as const;

export const grid = {
  gap: 12,
  kpiColumns: "repeat(4, 1fr)",
  chartColumns: "1.4fr 1fr",
  listColumns: "1fr 1fr",
} as const;

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

export const animation = {
  fast: "0.15s",
  normal: "0.2s",
  slow: "0.3s",
  slower: "0.45s",
  cardLift: "translateY(-2px)",
  easing: [0.16, 1, 0.3, 1] as [number, number, number, number],
  staggerKpi: 0.07,
  staggerList: 0.05,
  staggerChart: 0.08,
} as const;

// ---------------------------------------------------------------------------
// Chart Config
// ---------------------------------------------------------------------------

export const chartConfig = {
  gradientId: "incomeGradient",
  gradientFrom: "rgba(124,111,205,0.35)",
  gradientTo: "rgba(124,111,205,0)",
  lineColor: "#7C6FCD",
  lineWidth: 2,
  cartesianGridStroke: "rgba(255,255,255,0.04)",
  tooltipBg: colors.bgElevated,
  tooltipBorder: "rgba(255,255,255,0.1)",
  tooltipRadius: 8,
} as const;

// ---------------------------------------------------------------------------
// Avatar Color System — deterministic from name
// ---------------------------------------------------------------------------

const AVATAR_PALETTE = [
  { bg: "rgba(124,111,205,0.25)", accent: "#7C6FCD" },
  { bg: "rgba(46,204,143,0.25)", accent: "#2ECC8F" },
  { bg: "rgba(232,81,74,0.25)", accent: "#E8514A" },
  { bg: "rgba(245,158,11,0.25)", accent: "#F59E0B" },
  { bg: "rgba(59,130,246,0.25)", accent: "#3B82F6" },
] as const;

export function getAvatarColor(name: string): { bg: string; accent: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

export function getInitials(name: string, maxChars = 2): string {
  return name.slice(0, maxChars).toUpperCase();
}

// ---------------------------------------------------------------------------
// Plan Color System
// ---------------------------------------------------------------------------

export const planColors: Record<string, string> = {
  Mensual: colors.accent,
  Trimestral: colors.success,
  Anual: colors.amber,
} as const;

// ---------------------------------------------------------------------------
// Medal Colors
// ---------------------------------------------------------------------------

export const medalColors = ["#F59E0B", "#94A3B8", "#CD7F32"] as const;

// ---------------------------------------------------------------------------
// Reusable Inline Styles — Card
// ---------------------------------------------------------------------------

export function cardStyle(isHoverable = false): React.CSSProperties {
  return {
    background: colors.bgSurface,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.xl,
    transition: isHoverable ? `all ${animation.normal} ease` : undefined,
  };
}

export function cardHoverStyle(): React.CSSProperties {
  return {
    borderColor: colors.borderAccent,
    transform: animation.cardLift,
    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
  };
}

// ---------------------------------------------------------------------------
// Reusable Inline Styles — Text
// ---------------------------------------------------------------------------

export function textStyle(
  variant: "heading" | "subheading" | "body" | "label" | "caption" | "kpi"
): React.CSSProperties {
  switch (variant) {
    case "heading":
      return {
        fontFamily: fontFamily.syne,
        fontSize: fontSize["3xl"],
        fontWeight: fontWeight.extrabold,
        color: colors.textPrimary,
        letterSpacing: "-0.03em",
        lineHeight: 1.2,
      };
    case "subheading":
      return {
        fontFamily: fontFamily.dmSans,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
      };
    case "body":
      return {
        fontFamily: fontFamily.dmSans,
        fontSize: fontSize.base,
        fontWeight: fontWeight.medium,
        color: colors.textPrimary,
      };
    case "label":
      return {
        fontFamily: fontFamily.dmSans,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
      };
    case "caption":
      return {
        fontFamily: fontFamily.dmSans,
        fontSize: fontSize.xs,
        color: colors.textSecondary,
      };
    case "kpi":
      return {
        fontFamily: fontFamily.syne,
        fontSize: 32,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        letterSpacing: "-0.03em",
        lineHeight: 1,
      };
  }
}

// ---------------------------------------------------------------------------
// Reusable Inline Styles — Badges & Tags
// ---------------------------------------------------------------------------

export function badgeStyle(type: "success" | "danger" | "warning" | "neutral") {
  const map = {
    success: { bg: colors.successBg, color: colors.success },
    danger: { bg: colors.dangerBg, color: colors.danger },
    warning: { bg: colors.amberBg, color: colors.amber },
    neutral: { bg: "rgba(255,255,255,0.06)", color: colors.textSecondary },
  };
  return {
    background: map[type].bg,
    color: map[type].color,
  };
}

export const tagStyle = {
  pendiente: {
    background: "rgba(232,81,74,0.12)",
    color: colors.danger,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.dmSans,
    fontWeight: fontWeight.semibold,
    padding: "3px 10px",
    borderRadius: borderRadius.full,
  },
  success: {
    background: "rgba(46,204,143,0.06)",
    color: colors.success,
    fontSize: fontSize.md,
    fontFamily: fontFamily.dmSans,
    fontWeight: fontWeight.semibold,
  },
} as const;

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

export function formatCurrencyARS(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMonth(date: Date): string {
  return date.toLocaleString("es-ES", { month: "long" });
}

// ---------------------------------------------------------------------------
// cn utility re-export (for convenience)
// ---------------------------------------------------------------------------

export function cx(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
