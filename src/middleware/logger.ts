import { NextRequest, NextResponse } from 'next/server';
import { logger, LogLevel } from '@/lib/logger';

export interface RequestLogData {
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}

export async function logRequest(
  req: NextRequest,
  res: NextResponse,
  startTime: number,
  userId?: string,
): Promise<void> {
  const durationMs = Date.now() - startTime;
  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const userAgent = req.headers.get('user-agent') ?? 'unknown';

  const level =
    res.status >= 500 ? LogLevel.ERROR : res.status >= 400 ? LogLevel.WARN : LogLevel.INFO;

  const logData: RequestLogData = {
    method: req.method,
    path: req.nextUrl.pathname,
    statusCode: res.status,
    durationMs,
    ipAddress,
    userAgent,
    userId,
  };

  const message = `${req.method} ${req.nextUrl.pathname} ${res.status} ${durationMs}ms`;

  await logger.log(level, message, logData as unknown as Record<string, unknown>);
}

export function getClientInfo(req: NextRequest): {
  ipAddress: string;
  userAgent: string;
} {
  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const userAgent = req.headers.get('user-agent') ?? 'unknown';
  return { ipAddress, userAgent };
}
