import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rutinaId, socioId, parametros } = body;

    if (!rutinaId || !socioId) {
      return NextResponse.json({ error: 'rutinaId y socioId son requeridos' }, { status: 400 });
    }

    const token = crypto.randomUUID();

    const asignacion = await prisma.asignacionRutina.create({
      data: {
        rutinaId,
        socioId,
        parametros: parametros ? JSON.stringify(parametros) : null,
        token,
      },
      include: {
        rutina: {
          include: {
            dias: {
              include: { ejercicios: true },
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

    const asignaciones = await prisma.asignacionRutina.findMany({
      where,
      include: {
        rutina: {
          include: {
            dias: {
              include: { ejercicios: true },
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