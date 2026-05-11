# Design System — Responsive Breakpoints

## Breakpoints

| Name  | Size   | Usage                            |
| ----- | ------ | -------------------------------- |
| `sm`  | 640px  | Mobile landscape                 |
| `md`  | 768px  | Tablet portrait                  |
| `lg`  | 1024px | Tablet landscape / Small desktop |
| `xl`  | 1280px | Desktop                          |
| `2xl` | 1536px | Large desktop                    |

## Tailwind Usage

```tsx
// Mobile-first approach
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// Showing/hiding content
<div className="hidden md:block">Visible on tablet+</div>
<div className="md:hidden">Hidden on tablet+</div>
```

## Layout Grid

- Sidebar collapses on mobile
- Main content uses full width on mobile
- Cards stack vertically on mobile, grid on desktop
- Tables become scrollable or card-based on mobile
