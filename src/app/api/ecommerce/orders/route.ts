import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/ecommerce/orders - List orders with pagination and status filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, slug: true, image: true },
              },
              variant: {
                select: { id: true, flavor: true, size: true, sku: true },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('GET /api/ecommerce/orders error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error al listar ordenes' } },
      { status: 500 }
    );
  }
}

// POST /api/ecommerce/orders - Create order with items
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      items,
      notes,
      couponId,
      couponCode,
      shipping = 0,
      discount = 0,
      tax = 0,
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Faltan campos requeridos' } },
        { status: 400 }
      );
    }

    // Generate order number BM-XXXX
    const lastOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { orderNumber: true },
    });

    let nextNum = 1;
    if (lastOrder?.orderNumber) {
      const match = lastOrder.orderNumber.match(/^BM-(\d+)$/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const orderNumber = `BM-${String(nextNum).padStart(4, '0').toUpperCase()}`;

    // Fetch variants to calculate totals and validate stock
    const variantIds = items.map((item: { variantId: string }) => item.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { id: true, name: true, brand: true, image: true } } },
    });

    type VariantWithProduct = typeof variants[number];

    const variantMap = new Map<string, VariantWithProduct>(variants.map((v) => [v.id, v]));

    // Calculate subtotal and validate stock
    let subtotal = 0;
    const orderItemsData: Array<{
      productId: string;
      variantId: string;
      variantSku: string;
      name: string;
      brand: string | null;
      flavor: string;
      size: string;
      price: number;
      quantity: number;
      image: string | null;
    }> = [];

    for (const item of items as Array<{ variantId: string; quantity: number }>) {
      const variant = variantMap.get(item.variantId);
      if (!variant) {
        return NextResponse.json(
          { success: false, error: { code: 'VARIANT_NOT_FOUND', message: `Variant ${item.variantId} no encontrado` } },
          { status: 400 }
        );
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INSUFFICIENT_STOCK',
              message: `Stock insuficiente para ${variant.product.name} (${variant.flavor} - ${variant.size}). Disponible: ${variant.stock}`,
            },
          },
          { status: 400 }
        );
      }

      const itemTotal = variant.price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: variant.productId,
        variantId: variant.id,
        variantSku: variant.sku,
        name: variant.product.name,
        brand: variant.product.brand || null,
        flavor: variant.flavor,
        size: variant.size,
        price: variant.price,
        quantity: item.quantity,
        image: variant.product.image || null,
      });
    }

    const total = subtotal + shipping + tax - discount;

    // Create order with items in a transaction, deducting stock
    const order = await prisma.$transaction(async (tx) => {
      // Deduct stock from variants
      for (const item of items as Array<{ variantId: string; quantity: number }>) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create the order with items
      return tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail,
          customerPhone: customerPhone || null,
          shippingAddress,
          shippingMethod: shippingMethod || null,
          paymentMethod: paymentMethod || null,
          subtotal,
          shipping,
          discount,
          tax,
          total,
          couponId: couponId || null,
          couponCode: couponCode || null,
          notes: notes || null,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, slug: true, image: true },
              },
              variant: {
                select: { id: true, flavor: true, size: true, sku: true },
              },
            },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('POST /api/ecommerce/orders error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error al crear orden' } },
      { status: 500 }
    );
  }
}
