# Design System — Tokens

## Overview

Design tokens are the single source of truth for all visual design values in MaatWorkGym.

## Color Palette

### Background Scale

| Token        | Value     | Usage                   |
| ------------ | --------- | ----------------------- |
| `bgBase`     | `#121214` | Main background         |
| `bgSurface`  | `#1A1A1D` | Card/surface background |
| `bgElevated` | `#242428` | Elevated elements       |

### Semantic Colors

| Token     | Value     | Usage               |
| --------- | --------- | ------------------- |
| `accent`  | `#8B5CF6` | Primary accent (violet-600) |
| `success` | `#2ECC8F` | Success states      |
| `danger`  | `#E8514A` | Error/danger states |
| `warning` | `#F59E0B` | Warning states      |
| `info`    | `#3B82F6` | Information         |

### Text Colors

| Token           | Value     |
| --------------- | --------- |
| `textPrimary`   | `#F5F5F5` |
| `textSecondary` | `#9090A0` |

### Border Colors

| Token          | Value                    |
| -------------- | ------------------------ |
| `border`       | `rgba(255,255,255,0.12)` |
| `borderAccent` | `rgba(139,92,246,0.5)`   |

### Glow Effects

| Token  | Value                                          |
| ------ | ---------------------------------------------- |
| `glow` | `0 0 30px rgba(139,92,246,0.5), 0 0 60px rgba(139,92,246,0.25)` |

## Typography

### Font Families

- **Heading:** `'Syne', sans-serif`
- **Body:** `'DM Sans', sans-serif`
- **Mono:** `'JetBrains Mono', monospace`

### Font Sizes

| Token  | Value |
| ------ | ----- |
| `xs`   | 11px  |
| `sm`   | 12px  |
| `md`   | 13px  |
| `base` | 14px  |
| `lg`   | 16px  |
| `xl`   | 20px  |
| `2xl`  | 22px  |
| `3xl`  | 28px  |

## Spacing

Based on 4px grid system.

| Token | Value |
| ----- | ----- |
| `1`   | 4px   |
| `2`   | 8px   |
| `3`   | 12px  |
| `4`   | 16px  |
| `5`   | 20px  |
| `6`   | 24px  |
| `8`   | 32px  |
| `10`  | 40px  |

## Border Radius

| Token  | Value  |
| ------ | ------ |
| `sm`   | 6px    |
| `md`   | 8px    |
| `lg`   | 12px   |
| `xl`   | 14px   |
| `2xl`  | 16px   |
| `full` | 9999px |

## Z-Index Scale

| Token      | Value | Usage               |
| ---------- | ----- | ------------------- |
| `dropdown` | 50    | Dropdown menus      |
| `sticky`   | 100   | Sticky headers      |
| `overlay`  | 150   | Overlays            |
| `modal`    | 200   | Modals              |
| `popover`  | 250   | Popovers            |
| `tooltip`  | 300   | Tooltips            |
| `toast`    | 400   | Toast notifications |

## Shadows

| Token  | Value                            |
| ------ | -------------------------------- |
| `sm`   | `0 1px 2px rgba(0,0,0,0.4)`      |
| `md`   | `0 4px 12px rgba(0,0,0,0.5)`     |
| `lg`   | `0 8px 30px rgba(0,0,0,0.5)`     |
| `glow` | `0 0 30px rgba(139,92,246,0.5), 0 0 60px rgba(139,92,246,0.25)` |
