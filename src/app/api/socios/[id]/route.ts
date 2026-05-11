import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const socio = await prisma.socio.findUnique({
      where: { id },
      include: {
        plan: true,
        pagos: { orderBy: { fechaPago: 'desc' } },
        fichajes: { orderBy: { fechaHora: 'desc' } },
      },
    });

    if (!socio) {
      return NextResponse.json({ error: 'Socio no encontrado' }, { status: 404 });
    }

    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

    const ultimoPago = socio.pagos[0];
    const tieneDeuda =
      !ultimoPago || ultimoPago.mes !== mesActual || ultimoPago.anio !== anioActual;

    const visitasMesActual = socio.fichajes.filter((f) => {
      const fMes = f.fechaHora.getMonth() + 1;
      const fAnio = f.fechaHora.getFullYear();
      return fMes === mesActual && fAnio === anioActual;
    }).length;

    return NextResponse.json({
      ...socio,
      tieneDeuda,
      visitasMesActual,
    });
  } catch (error) {
    console.error('Error fetching socio:', error);
    return NextResponse.json({ error: 'Error al obtener socio' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, apellido, planId, fotoUrl, telefono, fechaNacimiento } = body;

    const socio = await prisma.socio.update({
      where: { id },
      data: {
        nombre,
        apellido,
        planId,
        fotoUrl,
        telefono: telefono || null,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
      },
      include: { plan: true },
    });

    return NextResponse.json(socio);
  } catch (error) {
    console.error('Error updating socio:', error);
    return NextResponse.json({ error: 'Error al actualizar socio' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.fichaje.deleteMany({ where: { socioId: id } });
    await prisma.pago.deleteMany({ where: { socioId: id } });
    await prisma.socio.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting socio:', error);
    return NextResponse.json({ error: 'Error al eliminar socio' }, { status: 500 });
  }
}
