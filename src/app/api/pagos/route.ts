import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const socioId = searchParams.get('socioId');

    const pagos = await prisma.pago.findMany({
      where: socioId ? { socioId } : undefined,
      include: { socio: { include: { plan: true } } },
      orderBy: { fechaPago: 'desc' },
    });

    return NextResponse.json(pagos);
  } catch (error) {
    console.error('Error fetching pagos:', error);
    return NextResponse.json({ error: 'Error al obtener pagos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { socioId, monto, metodo, mes, anio } = body;

    if (!socioId || !monto || !metodo || mes === undefined || anio === undefined) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const socio = await prisma.socio.findUnique({ where: { id: socioId } });
    if (!socio) {
      return NextResponse.json({ error: 'Socio no encontrado' }, { status: 404 });
    }

    const pago = await prisma.pago.create({
      data: {
        socioId,
        monto,
        metodo,
        mes,
        anio,
        fechaPago: new Date(),
      },
      include: { socio: { include: { plan: true } } },
    });

    return NextResponse.json(pago, { status: 201 });
  } catch (error) {
    console.error('Error creating pago:', error);
    return NextResponse.json({ error: 'Error al registrar pago' }, { status: 500 });
  }
}
