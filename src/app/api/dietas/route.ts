import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    const where = tipo ? { tipo } : {};

    const dietas = await prisma.dieta.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(dietas);
  } catch (error) {
    console.error('Error fetching dietas:', error);
    return NextResponse.json({ error: 'Error al obtener dietas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, descripcion, tipo, socioId, comidas } = body;

    if (!nombre) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const token = crypto.randomUUID();

    const dieta = await prisma.dieta.create({
      data: {
        nombre,
        descripcion: descripcion || null,
        tipo: tipo || 'generica',
        socioId: socioId || null,
        token,
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

    return NextResponse.json(dieta, { status: 201 });
  } catch (error) {
    console.error('Error creating dieta:', error);
    return NextResponse.json({ error: 'Error al crear dieta' }, { status: 500 });
  }
}