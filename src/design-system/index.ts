/**
 * Design System — Main Exports
 * @module design-system
 */

// Tokens
export { tokens, type DesignTokens } from './tokens';

// Animations
export { animations, type Animations } from './animations';

// Spacing
export { spacing, type Spacing } from './spacing';

// Shadows
export { shadows, type Shadows } from './shadows';

// Themes
export { themes, type Theme, type ThemeConfig } from './themes';

// Breakpoints
export { breakpoints, type Breakpoint } from './breakpoints';

// Re-export utilities from existing design-system
export { getAvatarColor, getInitials } from '@/lib/design-system';
export { formatCurrencyARS, formatMonth } from '@/lib/design-system';
export { cardStyle, cardHoverStyle, textStyle, badgeStyle } from '@/lib/design-system';
