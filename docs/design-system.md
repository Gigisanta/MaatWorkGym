# GymPro Design System

## Overview

El Design System de GymPro es la **única fuente de verdad** para todos los valores de diseño en la aplicación. Todos los valores hardcodeados deben ser reemplazados por referencias a constantes definidas aquí.

**Archivo principal:** `src/lib/design-system.ts`

---

## Tokens Centrales

### Paleta de Colores

```typescript
import { colors } from '@/lib/design-system';

// Superficies base
colors.bgBase; // "#0D0D0F"
colors.bgSurface; // "#141416"
colors.bgElevated; // "#1C1C1F"

// Semánticos
colors.accent; // "#7C6FCD"
colors.success; // "#2ECC8F"
colors.danger; // "#E8514A"
colors.amber; // "#F59E0B"
colors.blue; // "#3B82F6"

// Texto
colors.textPrimary; // "#F0EFF4"
colors.textSecondary; // "#6E6D7A"

// Bordes
colors.border; // "rgba(255,255,255,0.06)"
colors.borderAccent; // "rgba(124,111,205,0.4)"
```

### Tipografía

```typescript
import { fonts, fontFamily, fontSize, fontWeight } from '@/lib/design-system';

// Familia de fuentes
fonts.heading; // "'Syne', var(--font-syne), sans-serif"
fonts.body; // "'DM Sans', var(--font-dm-sans), sans-serif"
fonts.mono; // "'JetBrains Mono', var(--font-jetbrains), monospace"

// Tamaños
fontSize.xs; // 11
fontSize.sm; // 12
fontSize.md; // 13
fontSize.base; // 14
fontSize.lg; // 16
fontSize.xl; // 20
fontSize['2xl']; // 22
fontSize['3xl']; // 28

// Pesos
fontWeight.regular; // 400
fontWeight.medium; // 500
fontWeight.semibold; // 600
fontWeight.bold; // 700
fontWeight.extrabold; // 800
```

### Spacing & Layout

```typescript
import { spacing, borderRadius, layout } from '@/lib/design-system';

spacing[1]; // 4
spacing[2]; // 8
spacing[3]; // 12
spacing[4]; // 16
spacing[5]; // 20
spacing[6]; // 24
spacing[7]; // 28

borderRadius.sm; // 6
borderRadius.md; // 8
borderRadius.lg; // 12
borderRadius.xl; // 14
borderRadius['2xl']; // 16
borderRadius.full; // 9999

layout.sidebarWidth; // 200
layout.sidebarCollapsed; // 64
layout.headerHeight; // 64
layout.maxContentWidth; // 1400
```

### Z-Index Scale

```typescript
import { zIndex } from '@/lib/design-system';

zIndex.dropdown; // 50
zIndex.sticky; // 100
zIndex.overlay; // 150
zIndex.modal; // 200
zIndex.popover; // 250
zIndex.tooltip; // 300
zIndex.toast; // 400
```

### Breakpoints

```typescript
import { breakpoints } from '@/lib/design-system';

breakpoints.sm; // 640
breakpoints.md; // 768
breakpoints.lg; // 1024
breakpoints.xl; // 1280
breakpoints['2xl']; // 1536
```

### Sombras

```typescript
import { shadows } from '@/lib/design-system';

shadows.sm; // "0 2px 8px rgba(0,0,0,0.15)"
shadows.md; // "0 4px 16px rgba(0,0,0,0.2)"
shadows.lg; // "0 8px 32px rgba(0,0,0,0.3)"
shadows.xl; // "0 12px 40px rgba(0,0,0,0.5)"
shadows.glow; // "0 4px 16px rgba(124,111,205,0.3)"
shadows.glowLg; // "0 8px 32px rgba(124,111,205,0.4)"
```

---

## Utilidades de Estilo

### `cx()` - Combinar clases

```typescript
import { cx } from '@/lib/design-system';

cx('text-primary', isActive && 'bg-accent', className);
```

### `cardStyle()` - Estilo de tarjeta

```typescript
import { cardStyle, cardHoverStyle } from "@/lib/design-system";

// Tarjeta básica
<div style={cardStyle()}>

// Tarjeta con hover
<div style={cardStyle(true)} onMouseEnter={...} onMouseLeave={...}>
```

### `textStyle()` - Estilos de texto predefinidos

```typescript
import { textStyle } from "@/lib/design-system";

<span style={textStyle("heading")}>
<span style={textStyle("subheading")}>
<span style={textStyle("body")}>
<span style={textStyle("label")}>
<span style={textStyle("caption")}>
<span style={textStyle("kpi")}>
```

### `badgeStyle()` - Estilos de badge

```typescript
import { badgeStyle } from "@/lib/design-system";

<span style={{ ...badgeStyle("success"), padding: "4px 12px" }}>
<span style={{ ...badgeStyle("danger"), padding: "4px 12px" }}>
```

---

## Formatters

```typescript
import { formatCurrencyARS, formatMonth } from '@/lib/design-system';

formatCurrencyARS(5000); // "$5.000"
formatMonth(new Date()); // "mayo"
```

---

## Registro de Componentes

Todos los componentes UI se exportan desde `src/lib/components-registry.ts`:

```typescript
import {
  Button,
  Badge,
  Card,
  Input,
  Label,
  Modal,
  // ...
} from '@/lib/components-registry';
```

### Variantes de Botón

```typescript
// Variantes
'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';

// Tamaños
'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';
```

### Variantes de Badge

```typescript
// Variantes
'success' | 'danger' | 'warning' | 'neutral' | 'info';

// Tamaños
'sm' | 'default' | 'lg';
```

---

## CSS Variables

El archivo `src/app/globals.css` define variables CSS que corresponden a los tokens del design system:

```css
--gym-bg-base      /* bgBase */
--gym-accent       /* accent */
--gym-success      /* success */
--gym-danger       /* danger */
--gym-text-primary /* textPrimary */
/* etc. */
```

---

## Reglas de Uso

1. **Nunca hardcodear valores** - Usar siempre tokens del design system
2. **Acceso runtime** - Los tokens se exportan como objetos JavaScript para acceso en tiempo de ejecución
3. **CSS** - Usar variables CSS (`--gym-*`) para estilos en `globals.css`
4. **Componentes** - Importar desde `@/lib/design-system` para valores en componentes React
