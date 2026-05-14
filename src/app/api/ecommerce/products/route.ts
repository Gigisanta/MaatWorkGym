import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock') === 'true';
    const onSale = searchParams.get('onSale') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice) {
      where.variants = { some: { price: { gte: parseFloat(minPrice) } } };
    }

    if (maxPrice) {
      where.variants = { some: { ...where.variants, price: { lte: parseFloat(maxPrice) } } };
    }

    if (inStock) {
      where.variants = { some: { stock: { gt: 0 } } };
    }

    if (onSale) {
      where.variants = { some: { originalPrice: { gt: 0 } } };
    }

    if (featured) {
      where.featured = true;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: {
            orderBy: { price: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate discount percentage for each product
    const productsWithDiscount = products.map((p) => {
      const minPrice = Math.min(...p.variants.map((v) => v.price));
      const minOriginal = Math.min(...p.variants.map((v) => v.originalPrice || v.price));
      const discount = minOriginal > minPrice ? Math.round(((minOriginal - minPrice) / minOriginal) * 100) : 0;
      return {
        ...p,
        discount,
        minPrice,
        minOriginalPrice: minOriginal,
      };
    });

    return NextResponse.json({
      success: true,
      data: productsWithDiscount,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('GET /api/ecommerce/products error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error al obtener productos' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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

    // Generate slug from name if not provided
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        brand,
        categoryId,
        subcategory,
        shortDescription,
        description,
        image,
        gallery: gallery || [],
        tags: tags || [],
        featured: featured || false,
        bestSeller: bestSeller || false,
        isNew: isNew || false,
        benefits: benefits || [],
        ingredients,
        directions,
        warnings,
        servingsPerContainer,
        servingSize,
        nutritionFacts,
        variants: {
          create: variants?.map((v: any) => ({
            flavor: v.flavor,
            size: v.size,
            price: v.price,
            originalPrice: v.originalPrice,
            stock: v.stock || 0,
            sku: v.sku,
          })) || [],
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    // Update category product count
    const count = await prisma.product.count({ where: { categoryId } });
    await prisma.ecommerceCategory.update({
      where: { id: categoryId },
      data: { productCount: count },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('POST /api/ecommerce/products error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Error al crear producto' } },
      { status: 500 }
    );
  }
}
