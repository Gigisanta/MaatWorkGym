import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Fix column types: gallery, tags, benefits are TEXT but should be TEXT[]
    // Also applicableCategories in Coupon should be TEXT[]
    const fixes = [
      // Product table - array columns
      `ALTER TABLE "Product" ALTER COLUMN "gallery" TYPE TEXT[] USING "gallery"::TEXT[]`,
      `ALTER TABLE "Product" ALTER COLUMN "tags" TYPE TEXT[] USING "tags"::TEXT[]`,
      `ALTER TABLE "Product" ALTER COLUMN "benefits" TYPE TEXT[] USING "benefits"::TEXT[]`,
      // Coupon table - applicableCategories
      `ALTER TABLE "Coupon" ALTER COLUMN "applicableCategories" TYPE TEXT[] USING "applicableCategories"::TEXT[]`,
    ];

    for (const sql of fixes) {
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch (e: any) {
        // Ignore if already correct type
      }
    }

    return NextResponse.json({ success: true, message: 'Column types fixed' });
  } catch (e: any) {
    console.error('fix-collections error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: 'Use POST to fix column types' });
}
