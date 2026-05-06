import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hoy = searchParams.get("hoy") === "true";
    const empleadoId = searchParams.get("empleadoId");
    const fechaDesde = searchParams.get("desde");
    const fechaHasta = searchParams.get("hasta");

    const where: Record<string, unknown> = {};
    
    if (empleadoId) {
      where.empleadoId = empleadoId;
    }

    if (hoy) {
      const now = new Date();
      const inicioDelDia = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      where.fechaHora = { gte: inicioDelDia };
    } else if (fechaDesde || fechaHasta) {
      where.fechaHora = {};
      if (fechaDesde) {
        (where.fechaHora as Record<string, unknown>).gte = new Date(fechaDesde);
      }
      if (fechaHasta) {
        const hasta = new Date(fechaHasta);
        hasta.setHours(23, 59, 59, 999);
        (where.fechaHora as Record<string, unknown>).lte = hasta;
      }
    }

    const fichajes = await prisma.fichaje.findMany({
      where,
      include: { empleado: true },
      orderBy: { fechaHora: "desc" },
      take: 100,
    });

    return NextResponse.json(fichajes);
  } catch (error) {
    console.error("Error fetching fichajes:", error);
    return NextResponse.json({ error: "Error al obtener fichajes" }, { status: 500 });
  }
}

