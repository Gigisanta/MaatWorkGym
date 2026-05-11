# GymPro Design System

A centralized design system for the GymPro application providing accessibility features, design tokens, and consistent styling utilities.

## Modules

### accessibility.ts

WCAG 2.1 AA compliance utilities including:

- **Focus Management**: `focusRing` styles for keyboard navigation
- **Touch Targets**: Minimum 44px touch target sizes (WCAG requirement)
- **Screen Reader Support**: `srOnly` styles for visually hidden content
- **ARIA Helpers**: Utility functions for generating ARIA attributes

### tokens.ts

Centralized design tokens including:

- **Colors**: Background, semantic, text, and border colors
- **Typography**: Font families and size scale
- **Spacing**: Consistent spacing values (4px base unit)
- **Border Radius**: Component border radius scale
- **Z-Index**: Layered UI z-index scale
- **Layout**: Standard layout measurements

## Usage

```typescript
import { focusRing, touchTargets, srOnly } from '@/lib/design-system';
import { tokens } from '@/lib/design-system';
```

## Accessibility

All interactive elements maintain:

- 44px minimum touch target size
- Visible focus indicators
- Screen reader compatible markup
