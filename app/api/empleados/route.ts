import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const empleados = await prisma.empleado.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(empleados);
  } catch (error) {
    console.error("Error fetching empleados:", error);
    return NextResponse.json({ error: "Error al obtener empleados" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dni, nombre, apellido, telefono, cargo, fechaInicio, horarioEntrada, horarioSalida } = body;

    if (!dni || !nombre || !apellido) {
      return NextResponse.json({ error: "DNI, nombre y apellido son requeridos" }, { status: 400 });
    }

    const existingEmpleado = await prisma.empleado.findUnique({ where: { dni } });
    if (existingEmpleado) {
      return NextResponse.json({ error: "Ya existe un empleado con este DNI" }, { status: 409 });
    }

    const empleado = await prisma.empleado.create({
      data: {
        dni,
        nombre,
        apellido,
        telefono,
        cargo,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : new Date(),
        horarioEntrada: horarioEntrada || "09:00",
        horarioSalida: horarioSalida || "18:00",
      },
    });

    return NextResponse.json(empleado, { status: 201 });
  } catch (error) {
    console.error("Error creating empleado:", error);
    return NextResponse.json({ error: "Error al crear empleado" }, { status: 500 });
  }
}

