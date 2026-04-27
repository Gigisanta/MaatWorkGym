import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hoy = searchParams.get("hoy") === "true";

    let fechaInicio;
    if (hoy) {
      const now = new Date();
      fechaInicio = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const fichajes = await prisma.fichaje.findMany({
      where: hoy ? { fechaHora: { gte: fechaInicio } } : undefined,
      include: { socio: { include: { plan: true } } },
      orderBy: { fechaHora: "desc" },
      take: 50,
    });

    return NextResponse.json(fichajes);
  } catch (error) {
    console.error("Error fetching fichajes:", error);
    return NextResponse.json(
      { error: "Error al obtener fichajes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { socioId } = body;

    if (!socioId) {
      return NextResponse.json(
        { error: "ID de socio requerido" },
        { status: 400 }
      );
    }

    const socio = await prisma.socio.findUnique({ where: { id: socioId } });
    if (!socio) {
      return NextResponse.json({ error: "Socio no encontrado" }, { status: 404 });
    }

    const fichaje = await prisma.fichaje.create({
      data: {
        socioId,
        fechaHora: new Date(),
      },
      include: { socio: { include: { plan: true } } },
    });

    return NextResponse.json(fichaje, { status: 201 });
  } catch (error) {
    console.error("Error creating fichaje:", error);
    return NextResponse.json(
      { error: "Error al registrar fichaje" },
      { status: 500 }
    );
  }
}
