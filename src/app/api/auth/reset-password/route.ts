import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { logger } from '@/lib/logger';

export async function POST() {
  try {
    const passwordHash = await hashPassword('admin');

    const admin = await prisma.admin.update({
      where: { username: 'admin' },
      data: { passwordHash },
    });

    logger.info('Admin password reset to admin', { adminId: admin.id });

    return NextResponse.json({ success: true, message: 'Password updated to admin' });
  } catch (error) {
    logger.error('Password reset error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Error resetting password' }, { status: 500 });
  }
}
