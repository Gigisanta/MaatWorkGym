import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  let dbTest: {
    status: string;
    adminCount?: number;
    message?: string;
    code?: string;
    name?: string;
  } = { status: 'not_run' };
  try {
    const count = await prisma.admin.count();
    dbTest = { status: 'ok', adminCount: count };
  } catch (e: any) {
    dbTest = { status: 'error', message: e?.message, code: e?.code, name: e?.name };
  }

  let adminAccess;
  try {
    adminAccess = {
      hasAdmin: 'admin' in prisma,
      adminDescriptor: Object.getOwnPropertyDescriptor(prisma, 'admin'),
    };
  } catch (e) {
    adminAccess = { error: String(e) };
  }

  return NextResponse.json({
    dbTest,
    prismaType: typeof prisma,
    hasAdminInKeys: 'admin' in prisma,
    adminAccess,
    allKeys: Object.keys(prisma),
  });
}
