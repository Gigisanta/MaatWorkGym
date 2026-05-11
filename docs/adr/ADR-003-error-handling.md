# ADR-003: Error Handling Pattern

## Status

Accepted

## Context

Error handling was inconsistent across the application, making debugging difficult.

## Decision

Create centralized error class hierarchy in `src/lib/errors/index.ts` with specific error types extending a base `AppError` class.

## Error Types

- `ValidationError` (400)
- `NotFoundError` (404)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `ConflictError` (409)
- `InternalError` (500)

## Consequences

- Consistent error handling across API routes
- Machine-readable error codes
- Type-safe error handling
- Easier debugging
