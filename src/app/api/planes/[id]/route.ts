import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const plan = await prisma.plan.findUnique({
      where: { id },
      include: {
        _count: {
          select: { socios: true },
        },
        socios: {
          take: 5,
          orderBy: { apellido: 'asc' },
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json({ error: 'Error al obtener plan' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, duracionDias, precio } = body;

    const plan = await prisma.plan.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(duracionDias !== undefined && { duracionDias: parseInt(duracionDias) }),
        ...(precio !== undefined && { precio: parseFloat(precio) }),
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error updating plan:', error);
    return NextResponse.json({ error: 'Error al actualizar plan' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const planWithSocios = await prisma.plan.findUnique({
      where: { id },
      include: { _count: { select: { socios: true } } },
    });

    if (planWithSocios?._count?.socios && planWithSocios._count.socios > 0) {
      return NextResponse.json(
        {
          error: `No se puede eliminar el plan porque tiene ${planWithSocios._count.socios} socios asociados`,
        },
        { status: 400 },
      );
    }

    await prisma.plan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return NextResponse.json({ error: 'Error al eliminar plan' }, { status: 500 });
  }
}
