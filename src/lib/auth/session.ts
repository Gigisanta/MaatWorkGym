import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { logger } from '@/lib/logger';

const SESSION_TOKEN_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? 'gympro-dev-secret-change-in-production',
);
const SESSION_COOKIE_NAME = 'gympro_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface SessionPayload extends JWTPayload {
  adminId: string;
  username: string;
  sessionId: string;
}

export async function createSessionToken(
  adminId: string,
  username: string,
  sessionId: string,
): Promise<string> {
  const token = await new SignJWT({
    adminId,
    username,
    sessionId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SESSION_TOKEN_SECRET);

  return token;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_TOKEN_SECRET);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSessionFromCookie(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) {
      return null;
    }
    return verifySessionToken(sessionCookie.value);
  } catch (error) {
    logger.error('Error reading session from cookie', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export function getSessionCookieConfig(token: string, isProduction: boolean) {
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  };
}

export function getClearSessionCookieConfig() {
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}

export { SESSION_COOKIE_NAME, SESSION_DURATION_MS };
