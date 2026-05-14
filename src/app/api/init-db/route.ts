import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function safeDropTable(table: string): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table}" CASCADE`);
  } catch {
    // Ignore errors from non-existent tables
  }
}

async function createTable(sql: string): Promise<void> {
  await prisma.$executeRawUnsafe(sql);
}

export async function POST() {
  try {
    // Order matters: drop tables with dependencies first
    await safeDropTable('AsignacionDieta');
    await safeDropTable('ItemComida');
    await safeDropTable('Comida');
    await safeDropTable('Dieta');
    await safeDropTable('AsignacionRutina');
    await safeDropTable('EjercicioRutina');
    await safeDropTable('DiaRutina');
    await safeDropTable('Rutina');
    await safeDropTable('Empleado');
    await safeDropTable('Session');
    await safeDropTable('Admin');
    await safeDropTable('Fichaje');
    await safeDropTable('Pago');
    await safeDropTable('Socio');
    await safeDropTable('Plan');
    // Ecommerce tables (drop in reverse dependency order)
    await safeDropTable('OrderItem');
    await safeDropTable('Order');
    await safeDropTable('ProductVariant');
    await safeDropTable('Product');
    await safeDropTable('EcommerceCategory');
    await safeDropTable('Coupon');
    await safeDropTable('EcommerceConfig');

    // Create tables in dependency order (tables without FK first)
    await createTable(`CREATE TABLE "Plan" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "nombre" TEXT NOT NULL,
      "duracionDias" INTEGER NOT NULL,
      "precio" DOUBLE PRECISION NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL
    )`);

    await createTable(`CREATE TABLE "Admin" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "username" TEXT NOT NULL UNIQUE,
      "passwordHash" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      "lastLoginAt" TIMESTAMP(3),
      "loginAttempts" INTEGER NOT NULL DEFAULT 0,
      "lockedUntil" TIMESTAMP(3)
    )`);

    await createTable(`CREATE TABLE "Empleado" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "dni" TEXT NOT NULL UNIQUE,
      "nombre" TEXT NOT NULL,
      "apellido" TEXT NOT NULL,
      "telefono" TEXT,
      "cargo" TEXT,
      "fechaInicio" TIMESTAMP(3) NOT NULL,
      "horarioEntrada" TEXT NOT NULL DEFAULT '09:00',
      "horarioSalida" TEXT NOT NULL DEFAULT '18:00',
      "activo" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL
    )`);

    await createTable(`CREATE TABLE "Socio" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "dni" TEXT NOT NULL UNIQUE,
      "nombre" TEXT NOT NULL,
      "apellido" TEXT NOT NULL,
      "telefono" TEXT,
      "fechaNacimiento" TIMESTAMP(3),
      "fotoUrl" TEXT,
      "planId" TEXT NOT NULL,
      "fechaInicio" TIMESTAMP(3) NOT NULL,
      "horarioEntrenamiento" TEXT NOT NULL DEFAULT 'matutino',
      "grupoMuscular" TEXT,
      "objetivoCliente" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Socio_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`);

    await createTable(`CREATE TABLE "Session" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "adminId" TEXT NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "expiresAt" TIMESTAMP(3) NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "ipAddress" TEXT,
      "userAgent" TEXT,
      CONSTRAINT "Session_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    await createTable(`CREATE TABLE "Pago" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "socioId" TEXT NOT NULL,
      "monto" DOUBLE PRECISION NOT NULL,
      "metodo" TEXT NOT NULL,
      "fechaPago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "mes" INTEGER NOT NULL,
      "anio" INTEGER NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Pago_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    await createTable(`CREATE TABLE "Fichaje" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "socioId" TEXT,
      "empleadoId" TEXT,
      "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "tipo" TEXT NOT NULL DEFAULT 'entrada',
      "notas" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Fichaje_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT "Fichaje_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE SET NULL ON UPDATE CASCADE
    )`);

    await createTable(`CREATE TABLE "Rutina" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "nombre" TEXT NOT NULL,
      "descripcion" TEXT,
      "tipo" TEXT NOT NULL DEFAULT 'generica',
      "socioId" TEXT,
      "token" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Rutina_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE
    )`);

    await createTable(`CREATE TABLE "DiaRutina" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "rutinaId" TEXT NOT NULL,
      "diaSemana" INTEGER NOT NULL,
      "nombre" TEXT,
      "orden" INTEGER NOT NULL,
      CONSTRAINT "DiaRutina_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "Rutina"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    await createTable(`CREATE TABLE "EjercicioRutina" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "diaRutinaId" TEXT NOT NULL,
      "nombre" TEXT NOT NULL,
      "series" INTEGER NOT NULL,
      "repeticiones" TEXT NOT NULL,
      "descanso" TEXT NOT NULL,
      "grupoMuscular" TEXT,
      "nota" TEXT,
      "orden" INTEGER NOT NULL,
      CONSTRAINT "EjercicioRutina_diaRutinaId_fkey" FOREIGN KEY ("diaRutinaId") REFERENCES "DiaRutina"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    await createTable(`CREATE TABLE "AsignacionRutina" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "rutinaId" TEXT NOT NULL,
      "socioId" TEXT NOT NULL,
      "parametros" TEXT,
      "token" TEXT NOT NULL UNIQUE,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "AsignacionRutina_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "Rutina"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "AsignacionRutina_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    await createTable(`CREATE TABLE "Dieta" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "nombre" TEXT NOT NULL,
      "descripcion" TEXT,
      "tipo" TEXT NOT NULL DEFAULT 'generica',
      "socioId" TEXT,
      "token" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Dieta_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE
    )`);

    await createTable(`CREATE TABLE "Comida" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "dietaId" TEXT NOT NULL,
      "nombre" TEXT NOT NULL,
      "hora" TEXT NOT NULL,
      "orden" INTEGER NOT NULL,
      CONSTRAINT "Comida_dietaId_fkey" FOREIGN KEY ("dietaId") REFERENCES "Dieta"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    await createTable(`CREATE TABLE "ItemComida" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "comidaId" TEXT NOT NULL,
      "alimento" TEXT NOT NULL,
      "cantidad" TEXT NOT NULL,
      "proteinas" DOUBLE PRECISION,
      "carbohidratos" DOUBLE PRECISION,
      "grasas" DOUBLE PRECISION,
      "orden" INTEGER NOT NULL,
      CONSTRAINT "ItemComida_comidaId_fkey" FOREIGN KEY ("comidaId") REFERENCES "Comida"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    await createTable(`CREATE TABLE "AsignacionDieta" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "dietaId" TEXT NOT NULL,
      "socioId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "AsignacionDieta_dietaId_fkey" FOREIGN KEY ("dietaId") REFERENCES "Dieta"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "AsignacionDieta_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`);

    // ============================================
    // ECOMMERCE TABLES (in dependency order)
    // ============================================
    // EcommerceCategory (no FK)
    await createTable(`CREATE TABLE "EcommerceCategory" (
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
    )`);

    // Product (depends on EcommerceCategory)
    await createTable(`CREATE TABLE "Product" (
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
    )`);

    // ProductVariant (depends on Product)
    await createTable(`CREATE TABLE "ProductVariant" (
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
    )`);

    // Order (no FK dependencies)
    await createTable(`CREATE TABLE "Order" (
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
      "notes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL
    )`);

    // OrderItem (depends on Order and ProductVariant)
    await createTable(`CREATE TABLE "OrderItem" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "orderId" TEXT NOT NULL,
      "productId" TEXT NOT NULL,
      "variantId" TEXT NOT NULL,
      "productName" TEXT NOT NULL,
      "variantName" TEXT NOT NULL,
      "quantity" INTEGER NOT NULL,
      "unitPrice" DOUBLE PRECISION NOT NULL,
      "totalPrice" DOUBLE PRECISION NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`);

    // Coupon (no FK)
    await createTable(`CREATE TABLE "Coupon" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "code" TEXT NOT NULL UNIQUE,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "discountType" TEXT NOT NULL,
      "discountValue" DOUBLE PRECISION NOT NULL,
      "minPurchase" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "maxDiscount" DOUBLE PRECISION,
      "usageLimit" INTEGER,
      "usedCount" INTEGER NOT NULL DEFAULT 0,
      "startDate" TIMESTAMP(3),
      "endDate" TIMESTAMP(3),
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL
    )`);

    // EcommerceConfig (no FK)
    await createTable(`CREATE TABLE "EcommerceConfig" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "key" TEXT NOT NULL UNIQUE,
      "value" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL
    )`);

    return NextResponse.json({ success: true, message: 'Database initialized with gym + ecommerce tables' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await prisma.$queryRawUnsafe<{ tablename: string }[]>(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'",
    );
    return NextResponse.json({ success: true, tables: result.map((r) => r.tablename) });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
