# Design System — Accessibility

## Focus Management

### Focus Ring

Always visible focus indicators for keyboard navigation.

```css
/* Applied via Tailwind */
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
```

### Focus Trap

For modals and dialogs, trap focus within the component.

## Touch Targets

Minimum 44px touch target size (WCAG 2.1 requirement).

```tsx
<button className="min-h-[44px] min-w-[44px]">Touch Target</button>
```

## Screen Reader Support

### Visually Hidden Content

For labels and additional context.

```tsx
<span className="sr-only">Additional context for screen readers</span>
```

### ARIA Labels

Required on icon-only buttons.

```tsx
<button aria-label="Close dialog">
  <XIcon />
</button>
```

## Color Contrast

- Normal text: minimum 4.5:1 contrast ratio
- Large text (18px+ or 14px bold): minimum 3:1 contrast ratio
- Never rely on color alone for information

## Keyboard Navigation

- All interactive elements are keyboard accessible
- Logical tab order (follows visual order)
- Visible focus indicators
- Escape closes modals/dropdowns
- Arrow keys navigate within components
