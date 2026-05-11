import { auditLogger, LogLevel } from './index';

export interface AuthAuditEvent {
  event:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILURE'
    | 'LOGOUT'
    | 'SESSION_EXPIRED'
    | 'ACCOUNT_LOCKED'
    | 'PASSWORD_CHANGE';
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export function logAuthEvent(event: AuthAuditEvent): void {
  const level =
    event.event === 'LOGIN_SUCCESS' || event.event === 'LOGOUT' ? LogLevel.INFO : LogLevel.WARN;

  auditLogger.log(level, `Auth event: ${event.event}`, {
    username: event.username,
    ipAddress: event.ipAddress,
    userAgent: event.userAgent,
    reason: event.reason,
    ...event.metadata,
  });
}

export function logLoginSuccess(username: string, ipAddress?: string, userAgent?: string): void {
  logAuthEvent({
    event: 'LOGIN_SUCCESS',
    username,
    ipAddress,
    userAgent,
  });
}

export function logLoginFailure(
  username: string,
  reason: string,
  ipAddress?: string,
  userAgent?: string,
): void {
  logAuthEvent({
    event: 'LOGIN_FAILURE',
    username,
    reason,
    ipAddress,
    userAgent,
  });
}

export function logLogout(username: string, ipAddress?: string, userAgent?: string): void {
  logAuthEvent({
    event: 'LOGOUT',
    username,
    ipAddress,
    userAgent,
  });
}

export function logAccountLocked(username: string, ipAddress?: string, userAgent?: string): void {
  logAuthEvent({
    event: 'ACCOUNT_LOCKED',
    username,
    reason: 'Too many failed login attempts',
    ipAddress,
    userAgent,
  });
}

export function logSessionExpired(username: string, ipAddress?: string, userAgent?: string): void {
  logAuthEvent({
    event: 'SESSION_EXPIRED',
    username,
    ipAddress,
    userAgent,
  });
}
