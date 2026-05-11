import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    const where = tipo ? { tipo } : {};

    const rutinas = await prisma.rutina.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(rutinas);
  } catch (error) {
    console.error('Error fetching rutinas:', error);
    return NextResponse.json({ error: 'Error al obtener rutinas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, descripcion, tipo, socioId, dias } = body;

    if (!nombre) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const token = crypto.randomUUID();

    const rutina = await prisma.rutina.create({
      data: {
        nombre,
        descripcion: descripcion || null,
        tipo: tipo || 'generica',
        socioId: socioId || null,
        token,
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

    return NextResponse.json(rutina, { status: 201 });
  } catch (error) {
    console.error('Error creating rutina:', error);
    return NextResponse.json({ error: 'Error al crear rutina' }, { status: 500 });
  }
}