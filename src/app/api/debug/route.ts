import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  let adminAccess;
  try {
    adminAccess = {
      hasAdmin: 'admin' in prisma,
      adminDescriptor: Object.getOwnPropertyDescriptor(prisma, 'admin'),
      adminGetter: typeof Object.getOwnPropertyDescriptor(prisma.constructor.prototype, 'admin'),
      prototypeAdmin: Object.getOwnPropertyDescriptor(prisma.constructor.prototype, 'admin'),
    };
  } catch (e) {
    adminAccess = { error: String(e) };
  }

  return NextResponse.json({
    prismaType: typeof prisma,
    hasAdminInKeys: 'admin' in prisma,
    adminAccess,
    allKeys: Object.keys(prisma),
    symbols: Object.getOwnPropertySymbols(prisma).map((s) => s.toString()),
  });
}
