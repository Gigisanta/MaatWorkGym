import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const asignacionRutina = await prisma.asignacionRutina.findUnique({
      where: { token },
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

    if (asignacionRutina) {
      return NextResponse.json({
        tipo: 'rutina',
        asignacion: {
          ...asignacionRutina,
          parametros: asignacionRutina.parametros ? JSON.parse(asignacionRutina.parametros) : null,
        },
      });
    }

    const asignacionDieta = await prisma.asignacionDieta.findFirst({
      where: {
        dieta: { token },
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

    if (asignacionDieta) {
      return NextResponse.json({
        tipo: 'dieta',
        asignacion: asignacionDieta,
      });
    }

    const rutinaGenerica = await prisma.rutina.findFirst({
      where: { token },
      include: {
        dias: {
          include: { ejercicios: true },
        },
      },
    });

    if (rutinaGenerica) {
      return NextResponse.json({
        tipo: 'rutina-generica',
        rutina: rutinaGenerica,
      });
    }

    const dietaGenerica = await prisma.dieta.findFirst({
      where: { token },
      include: {
        comidas: {
          include: { items: true },
        },
      },
    });

    if (dietaGenerica) {
      return NextResponse.json({
        tipo: 'dieta-generica',
        dieta: dietaGenerica,
      });
    }

    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching public:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}