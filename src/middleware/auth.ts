import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { addSecurityHeaders } from './security-headers';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/setup', '/api/auth/session'];
const PUBLIC_PREFIXES = ['/_next/', '/favicon', '/fonts/', '/images/'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Add security headers to all responses
  const response = addSecurityHeaders(req);

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
  const isPublicPrefix = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  if (isPublicPath || isPublicPrefix) {
    return response;
  }

  if (
    pathname === '/' ||
    pathname === '/fichaje' ||
    pathname === '/estadisticas' ||
    pathname === '/clientes'
  ) {
    return response;
  }

  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);
  const sessionPayload = sessionCookie?.value
    ? await verifySessionToken(sessionCookie.value)
    : null;

  if (!sessionPayload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'No autenticado', code: 'UNAUTHORIZED' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|fonts|images).*)'],
};
