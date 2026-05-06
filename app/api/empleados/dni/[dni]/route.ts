import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dni: string }> }
) {
  try {
    const { dni } = await params;
    
    const empleado = await prisma.empleado.findUnique({
      where: { dni },
      include: {
        fichajes: {
          orderBy: { fechaHora: "desc" },
          take: 20,
        },
      },
    });

    if (!empleado) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
    }

    return NextResponse.json(empleado);
  } catch (error) {
    console.error("Error fetching empleado by DNI:", error);
    return NextResponse.json({ error: "Error al obtener empleado" }, { status: 500 });
  }
}

