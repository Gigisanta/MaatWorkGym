import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dietaId, socioId } = body;

    if (!dietaId || !socioId) {
      return NextResponse.json({ error: 'dietaId y socioId son requeridos' }, { status: 400 });
    }

    const asignacion = await prisma.asignacionDieta.create({
      data: {
        dietaId,
        socioId,
      },
      include: {
        dieta: {
          include: {
            comidas: {
              include: { items: true },
            },
          },
        },
        socio: { select: { id: true, nombre: true, apellido: true } },
      },
    });

    return NextResponse.json(asignacion, { status: 201 });
  } catch (error) {
    console.error('Error creating asignacion:', error);
    return NextResponse.json({ error: 'Error al crear asignacion' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const socioId = searchParams.get('socioId');

    const where = socioId ? { socioId } : {};

    const asignaciones = await prisma.asignacionDieta.findMany({
      where,
      include: {
        dieta: {
          include: {
            comidas: {
              include: { items: true },
            },
          },
        },
        socio: { select: { id: true, nombre: true, apellido: true } },
      },
    });

    return NextResponse.json(asignaciones);
  } catch (error) {
    console.error('Error fetching asignaciones:', error);
    return NextResponse.json({ error: 'Error al obtener asignaciones' }, { status: 500 });
  }
}