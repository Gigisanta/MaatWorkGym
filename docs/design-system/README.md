# Design System — Overview

## Quick Start

Import design tokens and utilities from the central design system:

```tsx
import { tokens, animations } from '@/design-system';
import { formatCurrencyARS } from '@/lib/design-system';
```

## Module Structure

```
src/design-system/
├── index.ts          # Main exports
├── tokens.ts         # Design tokens (single source of truth)
├── animations.ts      # Animation keyframes & durations
├── spacing.ts        # Spacing scale
├── shadows.ts        # Shadow elevation system
├── themes.ts         # Theme definitions
└── breakpoints.ts    # Responsive breakpoints
```

## CSS Variable Generation

Design tokens in `tokens.ts` are the single source of truth. CSS variables are derived from these values.

## Usage with Tailwind

```tsx
<div className="bg-surface text-primary rounded-lg shadow-md">Content</div>
```

## Component Registry

All UI components are exported from `@/components/ui` and documented in `src/lib/components-registry.ts`.

## Animation Usage

```tsx
<div className="animate-fade-in-up" style={{ animationDelay: '160ms' }}>
  Animated content
</div>
```
