import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [featured, bestSellers, newArrivals, offers] = await Promise.all([
      // Featured products
      prisma.product.findMany({
        where: { featured: true },
        include: {
          category: true,
          variants: true,
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),

      // Best sellers (products with most order items)
      prisma.product.findMany({
        where: { bestSeller: true },
        include: {
          category: true,
          variants: true,
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),

      // New arrivals
      prisma.product.findMany({
        where: { isNew: true },
        include: {
          category: true,
          variants: true,
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),

      // Active offers (coupons that are currently active and featured)
      prisma.coupon.findMany({
        where: {
          active: true,
          featured: true,
          OR: [
            { validUntil: null },
            { validUntil: { gte: new Date() } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      products: featured,
      bestSellers,
      newArrivals,
      offers,
    });
  } catch (error) {
    console.error('Error fetching featured data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured data' },
      { status: 500 }
    );
  }
}
