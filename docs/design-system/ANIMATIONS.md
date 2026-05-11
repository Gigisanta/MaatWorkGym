# Design System — Animations

## Animation Durations

| Token     | Value | Usage                       |
| --------- | ----- | --------------------------- |
| `fast`    | 100ms | Micro-interactions          |
| `normal`  | 200ms | Default transitions         |
| `slow`    | 300ms | Larger transitions          |
| `slower`  | 450ms | Page transitions            |
| `stagger` | 80ms  | Stagger delay between items |

## Easing Functions

| Token     | Value                                    | Usage              |
| --------- | ---------------------------------------- | ------------------ |
| `default` | `cubic-bezier(0.4, 0, 0.2, 1)`           | General use        |
| `bounce`  | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful animations |
| `smooth`  | `cubic-bezier(0.25, 0.1, 0.25, 1)`       | Smooth transitions |
| `easeOut` | `cubic-bezier(0.16, 1, 0.3, 1)`          | Exit animations    |

## Keyframes

### fadeIn

Fade in from transparent.

### fadeInUp

Fade in while moving up 8px.

### slideInRight

Slide in from left.

### scaleIn

Scale up from 95%.

### pulse

Opacity pulse for loading states.

## Usage

```tsx
import { animations } from '@/design-system';

<div className="animate-fade-in-up" style={{ animationDelay: animations.staggerDelay(2) }}>
  Content
</div>;
```

## Stagger Pattern

```tsx
const staggerDelay = (index: number) => `${index * 80}ms`;

// In component
items.map((item, i) => (
  <div key={item.id} style={{ animationDelay: staggerDelay(i) }}>
    {item.content}
  </div>
));
```
