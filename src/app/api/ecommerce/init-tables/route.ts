import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Type-safe raw query helper using prisma.$executeRaw
async function createTable(sql: string): Promise<void> {
  await prisma.$executeRawUnsafe(sql);
}

async function safeDropTable(table: string): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table}" CASCADE`);
  } catch { /* ignore */ }
}

export async function POST() {
  try {
    // Drop ecommerce tables in reverse dependency order
    await safeDropTable('OrderItem');
    await safeDropTable('Order');
    await safeDropTable('ProductVariant');
    await safeDropTable('Product');
    await safeDropTable('EcommerceCategory');
    await safeDropTable('Coupon');
    await safeDropTable('EcommerceConfig');

    // Create EcommerceConfig first (no dependencies)
    await createTable(`
      CREATE TABLE "EcommerceConfig" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "value" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      )
    `);

    // Create EcommerceCategory
    await createTable(`
      CREATE TABLE "EcommerceCategory" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "icon" TEXT,
        "description" TEXT,
        "image" TEXT,
        "productCount" INTEGER NOT NULL DEFAULT 0,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      )
    `);

    // Create Product
    await createTable(`
      CREATE TABLE "Product" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "brand" TEXT,
        "categoryId" TEXT NOT NULL,
        "subcategory" TEXT,
        "shortDescription" TEXT,
        "description" TEXT,
        "image" TEXT,
        "gallery" TEXT[] DEFAULT '{}',
        "tags" TEXT[] DEFAULT '{}',
        "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "reviewCount" INTEGER NOT NULL DEFAULT 0,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "bestSeller" BOOLEAN NOT NULL DEFAULT false,
        "isNew" BOOLEAN NOT NULL DEFAULT false,
        "benefits" TEXT[] DEFAULT '{}',
        "ingredients" TEXT,
        "directions" TEXT,
        "warnings" TEXT,
        "servingsPerContainer" INTEGER,
        "servingSize" TEXT,
        "nutritionFacts" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EcommerceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `);

    // Create ProductVariant
    await createTable(`
      CREATE TABLE "ProductVariant" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "productId" TEXT NOT NULL,
        "flavor" TEXT NOT NULL,
        "size" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "originalPrice" DOUBLE PRECISION,
        "stock" INTEGER NOT NULL DEFAULT 0,
        "sku" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    // Create Order — matches Prisma schema exactly
    await createTable(`
      CREATE TABLE "Order" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "orderNumber" TEXT NOT NULL UNIQUE,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "customerName" TEXT NOT NULL,
        "customerEmail" TEXT NOT NULL,
        "customerPhone" TEXT,
        "subtotal" DOUBLE PRECISION NOT NULL,
        "shipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "total" DOUBLE PRECISION NOT NULL,
        "shippingAddress" JSONB NOT NULL,
        "shippingMethod" TEXT,
        "paymentMethod" TEXT,
        "trackingNumber" TEXT,
        "carrier" TEXT,
        "estimatedDelivery" TEXT,
        "couponId" TEXT,
        "couponCode" TEXT,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      )
    `);

    // Create OrderItem — matches Prisma schema exactly
    await createTable(`
      CREATE TABLE "OrderItem" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "orderId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "variantId" TEXT NOT NULL,
        "variantSku" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "brand" TEXT,
        "flavor" TEXT NOT NULL,
        "size" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "quantity" INTEGER NOT NULL,
        "image" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `);

    // Create Coupon
    await createTable(`
      CREATE TABLE "Coupon" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "code" TEXT NOT NULL UNIQUE,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "discountType" TEXT NOT NULL DEFAULT 'percentage',
        "discountValue" DOUBLE PRECISION NOT NULL,
        "minPurchase" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "maxDiscount" DOUBLE PRECISION,
        "usageLimit" INTEGER,
        "usedCount" INTEGER NOT NULL DEFAULT 0,
        "validFrom" TIMESTAMP(3),
        "validUntil" TIMESTAMP(3),
        "applicableCategories" TEXT[] DEFAULT '{}',
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      )
    `);

    return NextResponse.json({ success: true, message: 'Ecommerce tables created' });
  } catch (e: any) {
    console.error('init-tables error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await prisma.$queryRawUnsafe<{ tablename: string }[]>(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('EcommerceCategory','Product','ProductVariant','Order','OrderItem','Coupon','EcommerceConfig')"
    );
    return NextResponse.json({ success: true, tables: result.map(r => r.tablename) });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
