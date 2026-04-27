import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const socios = await prisma.socio.findMany({
      where: search
        ? {
            OR: [
              { nombre: { contains: search } },
              { apellido: { contains: search } },
              { dni: { contains: search } },
            ],
          }
        : undefined,
      include: {
        plan: true,
        pagos: {
          orderBy: { fechaPago: "desc" },
          take: 1,
        },
        fichajes: {
          orderBy: { fechaHora: "desc" },
          take: 10,
        },
      },
      orderBy: { apellido: "asc" },
    });

    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

    const sociosConEstado = socios.map((socio) => {
      const ultimoPago = socio.pagos[0];
      const tieneDeuda =
        !ultimoPago ||
        ultimoPago.mes !== mesActual ||
        ultimoPago.anio !== anioActual;

      const fechaVencimiento = socio.fechaInicio;
      const venceEn =
        Math.ceil(
          (fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
        ) + 30;

      return {
        ...socio,
        tieneDeuda,
        venceEn,
      };
    });

    return NextResponse.json(sociosConEstado);
  } catch (error) {
    console.error("Error fetching socios:", error);
    return NextResponse.json(
      { error: "Error al obtener socios" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dni, nombre, apellido, planId, fechaInicio, fotoUrl } = body;

    if (!dni || !nombre || !apellido || !planId || !fechaInicio) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const existente = await prisma.socio.findUnique({ where: { dni } });
    if (existente) {
      return NextResponse.json(
        { error: "Ya existe un socio con este DNI" },
        { status: 400 }
      );
    }

    const socio = await prisma.socio.create({
      data: {
        dni,
        nombre,
        apellido,
        planId,
        fechaInicio: new Date(fechaInicio),
        fotoUrl: fotoUrl || null,
      },
      include: { plan: true },
    });

    return NextResponse.json(socio, { status: 201 });
  } catch (error) {
    console.error("Error creating socio:", error);
    return NextResponse.json(
      { error: "Error al crear socio" },
      { status: 500 }
    );
  }
}
