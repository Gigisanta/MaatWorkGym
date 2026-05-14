import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, cartTotal } = body;

    if (!code || typeof cartTotal !== 'number') {
      return NextResponse.json(
        { valid: false, discount: 0, message: 'Invalid request: code and cartTotal are required' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, discount: 0, message: 'Coupon code not found' },
        { status: 404 }
      );
    }

    // Check if coupon is active
    if (!coupon.active) {
      return NextResponse.json(
        { valid: false, discount: 0, message: 'This coupon is no longer active', coupon },
        { status: 400 }
      );
    }

    // Check expiration date
    const now = new Date();
    if (coupon.validUntil && coupon.validUntil < now) {
      return NextResponse.json(
        { valid: false, discount: 0, message: 'This coupon has expired', coupon },
        { status: 400 }
      );
    }

    // Check validFrom date
    if (coupon.validFrom && coupon.validFrom > now) {
      return NextResponse.json(
        { valid: false, discount: 0, message: 'This coupon is not yet valid', coupon },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { valid: false, discount: 0, message: 'This coupon has reached its usage limit', coupon },
        { status: 400 }
      );
    }

    // Check minimum purchase
    if (cartTotal < coupon.minPurchase) {
      return NextResponse.json(
        {
          valid: false,
          discount: 0,
          message: `Minimum purchase of $${coupon.minPurchase} required for this coupon`,
          coupon,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      // fixed amount
      discount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed cart total
    discount = Math.min(discount, cartTotal);

    return NextResponse.json({
      valid: true,
      discount,
      message: 'Coupon applied successfully',
      coupon,
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { valid: false, discount: 0, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
