import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookie } from '@/lib/auth/session';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const sessionPayload = await getSessionFromCookie();

    if (!sessionPayload) {
      logger.warn('Session validation failed: no session payload', {
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      });
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionPayload.sessionId },
      include: { admin: { select: { id: true, username: true, lastLoginAt: true } } },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      logger.warn('Session validation failed: session expired or not found', {
        sessionId: sessionPayload.sessionId,
      });
      return NextResponse.json(
        { authenticated: false, user: null, reason: 'session_expired' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.admin.id,
        username: session.admin.username,
        lastLoginAt: session.admin.lastLoginAt,
      },
    });
  } catch (error) {
    logger.error('Session check error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { authenticated: false, user: null, error: 'Error checking session' },
      { status: 500 },
    );
  }
}
