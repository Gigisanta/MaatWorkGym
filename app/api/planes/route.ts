import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const planes = await prisma.plan.findMany({
      orderBy: { nombre: "asc" },
      include: {
        _count: {
          select: { socios: true },
        },
      },
    });
    return NextResponse.json(planes);
  } catch (error) {
    console.error("Error fetching planes:", error);
    return NextResponse.json({ error: "Error al obtener planes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, duracionDias, precio } = body;

    if (!nombre || !duracionDias || precio === undefined) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const plan = await prisma.plan.create({
      data: {
        nombre,
        duracionDias: parseInt(duracionDias),
        precio: parseFloat(precio),
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json({ error: "Error al crear plan" }, { status: 500 });
  }
}
