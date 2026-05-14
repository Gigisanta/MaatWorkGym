import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: { orderBy: { price: 'asc' } },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Producto no encontrado' } },
        { status: 404 }
      );
    }

    const minPrice = Math.min(...product.variants.map((v) => v.price));
    const minOriginal = Math.min(...product.variants.map((v) => v.originalPrice || v.price));
    const discount = minOriginal > minPrice ? Math.round(((minOriginal - minPrice) / minOriginal) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        discount,
        minPrice,
        minOriginalPrice: minOriginal,
      },
    });
  } catch (error) {
    console.error('GET /api/ecommerce/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error al obtener producto' } },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      name,
      slug,
      brand,
      categoryId,
      subcategory,
      shortDescription,
      description,
      image,
      gallery,
      tags,
      featured,
      bestSeller,
      isNew,
      benefits,
      ingredients,
      directions,
      warnings,
      servingsPerContainer,
      servingSize,
      nutritionFacts,
      variants,
    } = body;

    // Check if product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Producto no encontrado' } },
        { status: 404 }
      );
    }

    // Generate slug from name if not provided
    const finalSlug = slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined);

    // Update product with variants: delete existing variants and create new ones
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug: finalSlug }),
        ...(brand !== undefined && { brand }),
        ...(categoryId !== undefined && { categoryId }),
        ...(subcategory !== undefined && { subcategory }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(gallery !== undefined && { gallery }),
        ...(tags !== undefined && { tags }),
        ...(featured !== undefined && { featured }),
        ...(bestSeller !== undefined && { bestSeller }),
        ...(isNew !== undefined && { isNew }),
        ...(benefits !== undefined && { benefits }),
        ...(ingredients !== undefined && { ingredients }),
        ...(directions !== undefined && { directions }),
        ...(warnings !== undefined && { warnings }),
        ...(servingsPerContainer !== undefined && { servingsPerContainer }),
        ...(servingSize !== undefined && { servingSize }),
        ...(nutritionFacts !== undefined && { nutritionFacts }),
        variants: variants
          ? {
              deleteMany: {},
              create: variants.map((v: any) => ({
                flavor: v.flavor,
                size: v.size,
                price: v.price,
                originalPrice: v.originalPrice,
                stock: v.stock || 0,
                sku: v.sku,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        variants: { orderBy: { price: 'asc' } },
      },
    });

    // Update category product count if category changed
    if (categoryId && categoryId !== existing.categoryId) {
      const [oldCount, newCount] = await Promise.all([
        prisma.product.count({ where: { categoryId: existing.categoryId } }),
        prisma.product.count({ where: { categoryId } }),
      ]);
      await Promise.all([
        prisma.ecommerceCategory.update({
          where: { id: existing.categoryId },
          data: { productCount: oldCount },
        }),
        prisma.ecommerceCategory.update({
          where: { id: categoryId },
          data: { productCount: newCount },
        }),
      ]);
    }

    const minPrice = Math.min(...product.variants.map((v) => v.price));
    const minOriginal = Math.min(...product.variants.map((v) => v.originalPrice || v.price));
    const discount = minOriginal > minPrice ? Math.round(((minOriginal - minPrice) / minOriginal) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        discount,
        minPrice,
        minOriginalPrice: minOriginal,
      },
    });
  } catch (error) {
    console.error('PUT /api/ecommerce/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error al actualizar producto' } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Producto no encontrado' } },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id } });

    // Update category product count
    if (product.categoryId) {
      const count = await prisma.product.count({ where: { categoryId: product.categoryId } });
      await prisma.ecommerceCategory.update({
        where: { id: product.categoryId },
        data: { productCount: count },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/ecommerce/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error al eliminar producto' } },
      { status: 500 }
    );
  }
}
