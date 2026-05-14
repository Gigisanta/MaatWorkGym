import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { flavor, size, price, originalPrice, stock, sku } = body;

    // Check if variant exists
    const existing = await prisma.productVariant.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Variante no encontrada' } },
        { status: 404 }
      );
    }

    const variant = await prisma.productVariant.update({
      where: { id },
      data: {
        ...(flavor !== undefined && { flavor }),
        ...(size !== undefined && { size }),
        ...(price !== undefined && { price }),
        ...(originalPrice !== undefined && { originalPrice }),
        ...(stock !== undefined && { stock }),
        ...(sku !== undefined && { sku }),
      },
    });

    return NextResponse.json({ success: true, data: variant });
  } catch (error) {
    console.error('PUT /api/ecommerce/variants/[id] error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error al actualizar variante' } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check if variant exists
    const variant = await prisma.productVariant.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!variant) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Variante no encontrada' } },
        { status: 404 }
      );
    }

    await prisma.productVariant.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/ecommerce/variants/[id] error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error al eliminar variante' } },
      { status: 500 }
    );
  }
}
