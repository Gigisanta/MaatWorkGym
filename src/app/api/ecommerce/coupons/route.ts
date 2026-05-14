import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(coupons);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discountType, discountValue, active = true } = body;

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: code, discountType, discountValue' },
        { status: 400 }
      );
    }

    if (!['percentage', 'fixed'].includes(discountType)) {
      return NextResponse.json(
        { error: 'discountType must be "percentage" or "fixed"' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        discountType,
        discountValue,
        active,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
