/**
 * Error Handling — Centralized Error Class Hierarchy
 * @module lib/errors
 */

export interface AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
}

export class ValidationError extends Error implements AppError {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  isOperational = true;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error implements AppError {
  statusCode = 404;
  code = 'NOT_FOUND';
  isOperational = true;
  constructor(message: string = 'Recurso no encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error implements AppError {
  statusCode = 401;
  code = 'UNAUTHORIZED';
  isOperational = true;
  constructor(message: string = 'No autenticado') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error implements AppError {
  statusCode = 403;
  code = 'FORBIDDEN';
  isOperational = true;
  constructor(message: string = 'Acceso denegado') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends Error implements AppError {
  statusCode = 409;
  code = 'CONFLICT';
  isOperational = true;
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class InternalError extends Error implements AppError {
  statusCode = 500;
  code = 'INTERNAL_ERROR';
  isOperational = false;
  constructor(message: string = 'Error interno del servidor') {
    super(message);
    this.name = 'InternalError';
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof Error && 'statusCode' in error && 'code' in error;
}

export function getErrorStatusCode(error: unknown): number {
  if (isAppError(error)) return error.statusCode;
  if (error instanceof Error) return 500;
  return 500;
}

export function getErrorCode(error: unknown): string {
  if (isAppError(error)) return error.code;
  if (error instanceof Error) return 'INTERNAL_ERROR';
  return 'UNKNOWN_ERROR';
}
