# ADR-002: Design Token System

## Status

Accepted

## Context

Design values (colors, spacing, typography) were duplicated in both CSS variables and TypeScript constants, leading to synchronization issues.

## Decision

TypeScript tokens in `src/design-system/tokens.ts` are the single source of truth. CSS variables in `globals.css` are derived from these tokens.

## Consequences

- Single source of truth for all design values
- Type safety for design tokens
- Easier to maintain consistency
- CSS variables automatically match TypeScript values
