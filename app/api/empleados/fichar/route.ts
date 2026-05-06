import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { empleadoId, tipo, notas } = body;

    if (!empleadoId) {
      return NextResponse.json({ error: "ID de empleado requerido" }, { status: 400 });
    }

    const validTipos = ["entrada", "salida", "pausa_inicio", "pausa_fin"];
    const fichajeTipo = tipo && validTipos.includes(tipo) ? tipo : "entrada";

    const empleado = await prisma.empleado.findUnique({ where: { id: empleadoId } });
    if (!empleado) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
    }

    const fichaje = await prisma.fichaje.create({
      data: {
        empleadoId,
        tipo: fichajeTipo,
        notas: notas || null,
        fechaHora: new Date(),
      },
      include: { empleado: true },
    });

    return NextResponse.json(fichaje, { status: 201 });
  } catch (error) {
    console.error("Error creating fichaje:", error);
    return NextResponse.json({ error: "Error al registrar fichaje" }, { status: 500 });
  }
}

