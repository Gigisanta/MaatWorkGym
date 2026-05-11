import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const dieta = await prisma.dieta.findUnique({
      where: { id },
      include: {
        socio: { select: { id: true, nombre: true, apellido: true } },
        comidas: {
          orderBy: { orden: 'asc' },
          include: {
            items: {
              orderBy: { orden: 'asc' },
            },
          },
        },
        asignaciones: {
          include: {
            socio: { select: { id: true, nombre: true, apellido: true } },
          },
        },
      },
    });

    if (!dieta) {
      return NextResponse.json({ error: 'Dieta no encontrada' }, { status: 404 });
    }

    return NextResponse.json(dieta);
  } catch (error) {
    console.error('Error fetching dieta:', error);
    return NextResponse.json({ error: 'Error al obtener dieta' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, descripcion, tipo, socioId, comidas } = body;

    const existing = await prisma.dieta.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Dieta no encontrada' }, { status: 404 });
    }

    await prisma.comida.deleteMany({ where: { dietaId: id } });

    const dieta = await prisma.dieta.update({
      where: { id },
      data: {
        nombre: nombre ?? existing.nombre,
        descripcion: descripcion !== undefined ? descripcion : existing.descripcion,
        tipo: tipo ?? existing.tipo,
        socioId: socioId !== undefined ? socioId : existing.socioId,
        comidas: comidas
          ? {
              create: comidas.map((comida: { nombre: string; hora: string; items?: any[]; orden: number }, index: number) => ({
                nombre: comida.nombre,
                hora: comida.hora,
                orden: comida.orden ?? index,
                items: comida.items
                  ? {
                      create: comida.items.map((item: { alimento: string; cantidad: string; proteinas?: number; carbohidratos?: number; grasas?: number; orden: number }, itemIndex: number) => ({
                        alimento: item.alimento,
                        cantidad: item.cantidad,
                        proteinas: item.proteinas ?? null,
                        carbohidratos: item.carbohidratos ?? null,
                        grasas: item.grasas ?? null,
                        orden: item.orden ?? itemIndex,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        comidas: {
          include: { items: true },
        },
      },
    });

    return NextResponse.json(dieta);
  } catch (error) {
    console.error('Error updating dieta:', error);
    return NextResponse.json({ error: 'Error al actualizar dieta' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.dieta.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Dieta no encontrada' }, { status: 404 });
    }

    await prisma.dieta.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dieta:', error);
    return NextResponse.json({ error: 'Error al eliminar dieta' }, { status: 500 });
  }
}