// GymPro Error Handler
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function handleApiError(
  error: unknown,
  request: NextRequest,
  context?: string,
): NextResponse {
  const reqId = crypto.randomUUID();
  logger.error('Unhandled error in ' + (context || 'API'), {
    path: request.nextUrl.pathname,
    method: request.method,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
  let statusCode = 500;
  let message = 'Error interno del servidor';
  if (error instanceof Error) {
    if ('statusCode' in error) {
      statusCode = (error as AppError).statusCode || 500;
    }
    if (process.env.NODE_ENV !== 'production') {
      message = error.message;
    }
  }
  return NextResponse.json(
    { error: message, code: 'INTERNAL_ERROR', requestId: reqId },
    { status: statusCode },
  );
}

export function createApiError(message: string, statusCode: number, code?: string): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

export class ValidationApiError extends Error implements AppError {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  constructor(public errors: string[]) {
    super(errors.join(', '));
    this.name = 'ValidationApiError';
  }
}

export class UnauthorizedApiError extends Error implements AppError {
  statusCode = 401;
  code = 'UNAUTHORIZED';
  constructor(message = 'No autenticado') {
    super(message);
    this.name = 'UnauthorizedApiError';
  }
}

export class ForbiddenApiError extends Error implements AppError {
  statusCode = 403;
  code = 'FORBIDDEN';
  constructor(message = 'Acceso denegado') {
    super(message);
    this.name = 'ForbiddenApiError';
  }
}

export class NotFoundApiError extends Error implements AppError {
  statusCode = 404;
  code = 'NOT_FOUND';
  constructor(message = 'Recurso no encontrado') {
    super(message);
    this.name = 'NotFoundApiError';
  }
}
