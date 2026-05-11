/**
 * Theme Definitions — Light/Dark mode tokens
 * @module design-system/themes
 */
import { tokens } from './tokens';

export const themes = {
  dark: {
    ...tokens,
    colors: {
      ...tokens.colors,
      background: tokens.colors.bgBase,
      foreground: tokens.colors.textPrimary,
    },
  },
  light: {
    ...tokens,
    colors: {
      ...tokens.colors,
      background: '#FFFFFF',
      foreground: '#1a1a1a',
    },
  },
} as const;

export type Theme = keyof typeof themes;
export type ThemeConfig = typeof themes.dark;
