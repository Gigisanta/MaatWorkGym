import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const coupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Cupón no encontrado' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    console.error('GET /api/ecommerce/coupons/[id] error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error al obtener cupón' } },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { code, discountType, discountValue, active } = body;

    // Check if coupon exists
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Cupón no encontrado' } },
        { status: 404 }
      );
    }

    // Validate discountType if provided
    if (discountType && !['percentage', 'fixed'].includes(discountType)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_DISCOUNT_TYPE', message: 'discountType debe ser "percentage" o "fixed"' } },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(code !== undefined && { code }),
        ...(discountType !== undefined && { discountType }),
        ...(discountValue !== undefined && { discountValue }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    console.error('PUT /api/ecommerce/coupons/[id] error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error al actualizar cupón' } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check if coupon exists
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Cupón no encontrado' } },
        { status: 404 }
      );
    }

    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/ecommerce/coupons/[id] error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error al eliminar cupón' } },
      { status: 500 }
    );
  }
}
