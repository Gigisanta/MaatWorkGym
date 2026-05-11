import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth/password';
import {
  createSessionToken,
  getSessionCookieConfig,
  SESSION_DURATION_MS,
} from '@/lib/auth/session';
import { getClientInfo } from '@/middleware/logger';
import prisma from '@/lib/prisma';
import { loginRateLimiter, getClientIdentifier } from '@/lib/security/rate-limit';
import {
  validateUsername,
  validatePassword,
  sanitizeString,
} from '@/lib/security/input-validation';
import { logger } from '@/lib/logger';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const { ipAddress, userAgent } = getClientInfo(req);

    // Rate limiting check
    const clientId = getClientIdentifier(req);
    const rateLimitResult = loginRateLimiter.check(clientId);

    if (!rateLimitResult.allowed) {
      logger.warn('Login rate limited', {
        clientId,
        retryAfter: rateLimitResult.retryAfter,
      });

      return NextResponse.json(
        {
          error: 'Demasiados intentos. Intenta mas tarde.',
          code: 'RATE_LIMITED',
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 },
      );
    }

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña son requeridos' }, { status: 400 });
    }

    // Validate and sanitize inputs
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return NextResponse.json(
        { error: usernameValidation.errors[0], code: 'VALIDATION_ERROR' },
        { status: 400 },
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0], code: 'VALIDATION_ERROR' },
        { status: 400 },
      );
    }

    // Sanitize username (defensive)
    const sanitizedUsername = sanitizeString(username);

    const admin = await prisma.admin.findUnique({
      where: { username: sanitizedUsername },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      return NextResponse.json(
        { error: 'Cuenta bloqueada. Intenta en 15 minutos.' },
        { status: 423 },
      );
    }

    const isValidPassword = await verifyPassword(password, admin.passwordHash);

    if (!isValidPassword) {
      const newAttempts = admin.loginAttempts + 1;
      const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;
      const updates: Record<string, unknown> = {
        loginAttempts: newAttempts,
      };

      if (shouldLock) {
        updates.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
        updates.loginAttempts = 0;
      }

      await prisma.admin.update({
        where: { id: admin.id },
        data: updates,
      });

      // On password failure, the rate limiter already tracks this
      // Just add a warn log
      logger.warn('Failed login attempt', {
        username: sanitizedUsername,
        clientId,
        remainingAttempts: rateLimitResult.remaining,
      });

      return NextResponse.json(
        {
          error: shouldLock
            ? 'Demasiados intentos. Cuenta bloqueada por 15 minutos.'
            : 'Credenciales inválidas',
        },
        { status: 401 },
      );
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    const session = await prisma.session.create({
      data: {
        adminId: admin.id,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
        ipAddress,
        userAgent,
      },
    });

    const sessionToken = await createSessionToken(admin.id, admin.username, session.id);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieConfig = getSessionCookieConfig(sessionToken, isProduction);

    const response = NextResponse.json(
      {
        user: {
          id: admin.id,
          username: admin.username,
          lastLoginAt: admin.lastLoginAt,
        },
      },
      { status: 200 },
    );

    response.cookies.set(cookieConfig);

    // Reset rate limit on successful login
    loginRateLimiter.reset(clientId);

    return response;
  } catch (error) {
    logger.error('Login error', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Error interno del servidor', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
