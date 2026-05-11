import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rutina = await prisma.rutina.findUnique({
      where: { id },
      include: {
        socio: { select: { id: true, nombre: true, apellido: true } },
        dias: {
          orderBy: { orden: 'asc' },
          include: {
            ejercicios: {
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

    if (!rutina) {
      return NextResponse.json({ error: 'Rutina no encontrada' }, { status: 404 });
    }

    return NextResponse.json(rutina);
  } catch (error) {
    console.error('Error fetching rutina:', error);
    return NextResponse.json({ error: 'Error al obtener rutina' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, descripcion, tipo, socioId, dias } = body;

    const existing = await prisma.rutina.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Rutina no encontrada' }, { status: 404 });
    }

    await prisma.diaRutina.deleteMany({ where: { rutinaId: id } });

    const rutina = await prisma.rutina.update({
      where: { id },
      data: {
        nombre: nombre ?? existing.nombre,
        descripcion: descripcion !== undefined ? descripcion : existing.descripcion,
        tipo: tipo ?? existing.tipo,
        socioId: socioId !== undefined ? socioId : existing.socioId,
        dias: dias
          ? {
              create: dias.map((dia: { diaSemana: number; nombre?: string; ejercicios?: any[]; orden: number }, index: number) => ({
                diaSemana: dia.diaSemana,
                nombre: dia.nombre || null,
                orden: dia.orden ?? index,
                ejercicios: dia.ejercicios
                  ? {
                      create: dia.ejercicios.map((ej: { nombre: string; series: number; repeticiones: string; descanso: string; grupoMuscular?: string; nota?: string; orden: number }, ejIndex: number) => ({
                        nombre: ej.nombre,
                        series: ej.series,
                        repeticiones: ej.repeticiones,
                        descanso: ej.descanso,
                        grupoMuscular: ej.grupoMuscular || null,
                        nota: ej.nota || null,
                        orden: ej.orden ?? ejIndex,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        dias: {
          include: { ejercicios: true },
        },
      },
    });

    return NextResponse.json(rutina);
  } catch (error) {
    console.error('Error updating rutina:', error);
    return NextResponse.json({ error: 'Error al actualizar rutina' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.rutina.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Rutina no encontrada' }, { status: 404 });
    }

    await prisma.rutina.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rutina:', error);
    return NextResponse.json({ error: 'Error al eliminar rutina' }, { status: 500 });
  }
}