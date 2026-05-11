# ADR-001: Centralized Configuration

## Status

Accepted

## Context

The application had magic numbers and strings scattered throughout the codebase, making it difficult to maintain consistency and update values.

## Decision

Create a central configuration module at `src/config/index.ts` that exports a single `config` object containing all application-wide constants.

## Consequences

- All magic values now referenced from single location
- Easier to update values across the application
- Type-safe configuration access
