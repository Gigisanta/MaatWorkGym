import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const configs = await prisma.ecommerceConfig.findMany();
  
  const result: Record<string, unknown> = {};
  for (const config of configs) {
    result[config.key] = config.value;
  }
  
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return NextResponse.json(
      { error: 'key and value are required' },
      { status: 400 }
    );
  }

  const config = await prisma.ecommerceConfig.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  return NextResponse.json({ key: config.key, value: config.value });
}
