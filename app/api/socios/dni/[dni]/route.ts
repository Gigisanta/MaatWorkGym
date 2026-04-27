import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dni: string }> }
) {
  try {
    const { dni } = await params;

    const socio = await prisma.socio.findUnique({
      where: { dni },
      include: {
        plan: true,
        pagos: { orderBy: { fechaPago: "desc" }, take: 1 },
        fichajes: { orderBy: { fechaHora: "desc" }, take: 10 },
      },
    });

    if (!socio) {
      return NextResponse.json({ error: "Socio no encontrado" }, { status: 404 });
    }

    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

    const ultimoPago = socio.pagos[0];
    const tieneDeuda =
      !ultimoPago ||
      ultimoPago.mes !== mesActual ||
      ultimoPago.anio !== anioActual;

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
    console.error("Error fetching socio by DNI:", error);
    return NextResponse.json(
      { error: "Error al obtener socio" },
      { status: 500 }
    );
  }
}
