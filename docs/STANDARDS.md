# MaatWorkGym Development Standards

## Project Overview

MaatWorkGym is a Next.js 16.2.4 gym management application with TypeScript, Prisma/SQLite, and shadcn/ui.

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (main)/            # Protected routes
│   └── api/               # API routes
├── components/             # UI Components
│   ├── ui/                # Base UI components (shadcn)
│   ├── features/          # Feature-specific components
│   └── layouts/           # Layout components
├── config/                # Centralized configuration
├── design-system/         # Design tokens, animations, themes
├── hooks/                 # Custom React hooks
├── lib/                   # Core libraries
│   ├── errors/           # Error handling
│   ├── logger/           # Logging infrastructure
│   ├── security/         # Security utilities
│   ├── db/               # Database utilities
│   └── utils/            # Common utilities
├── middleware/            # Next.js middleware
└── types/                 # Global TypeScript types
```

## Naming Conventions

| Type             | Convention             | Example             |
| ---------------- | ---------------------- | ------------------- |
| Components       | PascalCase             | `ClienteModal.tsx`  |
| Hooks            | camelCase + use prefix | `useSocios.ts`      |
| Utilities        | camelCase              | `formatDate.ts`     |
| Constants        | SCREAMING_SNAKE        | `MAX_RETRY_COUNT`   |
| Types/Interfaces | PascalCase             | `ClientData`        |
| API Routes       | kebab-case             | `cliente-routes.ts` |
| Files            | kebab-case             | `auth-context.tsx`  |

## Code Style Rules

- 2-space indentation
- Single quotes for strings
- Semicolons required
- Max line length: 100
- Explicit return types for functions
- JSDoc for public APIs

## Design Patterns

- **Module Pattern:** Each lib module has `index.ts` barrel export
- **Factory Pattern:** For creating loggers with context
- **Repository Pattern:** For data access in `lib/db/`
- **Error Boundary Pattern:** Consistent error handling across app

## Required File Headers

```typescript
/**
 * [Brief description]
 * @module [ModuleName]
 * @description [Detailed description if needed]
 */
```

## Git Workflow

1. Create feature branch from `main`
2. Make changes with passing lint/tests
3. Submit PR for review
4. Squash merge to main

## Quality Gates

- [ ] ESLint passes
- [ ] Prettier formatting applied
- [ ] TypeScript compilation succeeds
- [ ] Pre-commit hooks pass
