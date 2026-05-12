import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { logger } from '@/lib/logger';

export async function POST() {
  try {
    const existingAdmin = await prisma.admin.findFirst();

    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin already exists', exists: true }, { status: 200 });
    }

    const defaultPassword = 'admin';
    const passwordHash = await hashPassword(defaultPassword);

    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        passwordHash,
      },
    });

    logger.info('Initial admin created', { adminId: admin.id });

    return NextResponse.json(
      {
        message: 'Admin created successfully',
        exists: false,
        defaultPassword,
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error('Admin setup error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Error creating admin' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const adminCount = await prisma.admin.count();

    return NextResponse.json({ exists: adminCount > 0 }, { status: 200 });
  } catch (error) {
    logger.error('Admin check error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Error checking admin' }, { status: 500 });
  }
}
