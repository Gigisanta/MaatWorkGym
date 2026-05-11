import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookie, getClearSessionCookieConfig } from '@/lib/auth/session';
import { logLogout } from '@/lib/logger/auth-logger';
import { logger } from '@/lib/logger';
import { getClientInfo } from '@/middleware/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookie();
    const { ipAddress, userAgent } = getClientInfo(req);

    if (session?.sessionId) {
      await prisma.session.deleteMany({
        where: { id: session.sessionId },
      });

      logLogout(session.username, ipAddress, userAgent);
    }

    logger.info('Successful logout', {
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json(
      { message: 'Sesión cerrada correctamente' },
      { status: 200 },
    );

    const clearConfig = getClearSessionCookieConfig();
    response.cookies.set(clearConfig);

    return response;
  } catch (error) {
    logger.error('Logout error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
