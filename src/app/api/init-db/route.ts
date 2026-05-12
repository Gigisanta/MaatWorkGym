import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TABLES = [
  'DROP TABLE IF EXISTS "AsignacionDieta" CASCADE',
  'DROP TABLE IF EXISTS "ItemComida" CASCADE',
  'DROP TABLE IF EXISTS "Comida" CASCADE',
  'DROP TABLE IF EXISTS "Dieta" CASCADE',
  'DROP TABLE IF EXISTS "AsignacionRutina" CASCADE',
  'DROP TABLE IF EXISTS "EjercicioRutina" CASCADE',
  'DROP TABLE IF EXISTS "DiaRutina" CASCADE',
  'DROP TABLE IF EXISTS "Rutina" CASCADE',
  'DROP TABLE IF EXISTS "Empleado" CASCADE',
  'DROP TABLE IF EXISTS "Session" CASCADE',
  'DROP TABLE IF EXISTS "Admin" CASCADE',
  'DROP TABLE IF EXISTS "Fichaje" CASCADE',
  'DROP TABLE IF EXISTS "Pago" CASCADE',
  'DROP TABLE IF EXISTS "Socio" CASCADE',
  'DROP TABLE IF EXISTS "Plan" CASCADE',
];

const CREATE_TABLES = `
CREATE TABLE "Plan" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "nombre" TEXT NOT NULL,
  "duracionDias" INTEGER NOT NULL,
  "precio" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Socio" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "dni" TEXT NOT NULL UNIQUE,
  "nombre" TEXT NOT NULL,
  "apellido" TEXT NOT NULL,
  "telefono" TEXT,
  "fechaNacimiento" TIMESTAMP(3),
  "fotoUrl" TEXT,
  "planId" TEXT NOT NULL,
  "fechaInicio" TIMESTAMP(3) NOT NULL,
  "horarioEntrenamiento" TEXT NOT NULL DEFAULT 'matutino',
  "grupoMuscular" TEXT,
  "objetivoCliente" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Socio_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Pago" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "socioId" TEXT NOT NULL,
  "monto" DOUBLE PRECISION NOT NULL,
  "metodo" TEXT NOT NULL,
  "fechaPago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "mes" INTEGER NOT NULL,
  "anio" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Pago_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Fichaje" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "socioId" TEXT,
  "empleadoId" TEXT,
  "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "tipo" TEXT NOT NULL DEFAULT 'entrada',
  "notas" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Fichaje_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "Fichaje_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Admin" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "lastLoginAt" TIMESTAMP(3),
  "loginAttempts" INTEGER NOT NULL DEFAULT 0,
  "lockedUntil" TIMESTAMP(3)
);

CREATE TABLE "Session" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "adminId" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  CONSTRAINT "Session_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Empleado" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "dni" TEXT NOT NULL UNIQUE,
  "nombre" TEXT NOT NULL,
  "apellido" TEXT NOT NULL,
  "telefono" TEXT,
  "cargo" TEXT,
  "fechaInicio" TIMESTAMP(3) NOT NULL,
  "horarioEntrada" TEXT NOT NULL DEFAULT '09:00',
  "horarioSalida" TEXT NOT NULL DEFAULT '18:00',
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Rutina" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "nombre" TEXT NOT NULL,
  "descripcion" TEXT,
  "tipo" TEXT NOT NULL DEFAULT 'generica',
  "socioId" TEXT,
  "token" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Rutina_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "DiaRutina" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "rutinaId" TEXT NOT NULL,
  "diaSemana" INTEGER NOT NULL,
  "nombre" TEXT,
  "orden" INTEGER NOT NULL,
  CONSTRAINT "DiaRutina_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "Rutina"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "EjercicioRutina" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "diaRutinaId" TEXT NOT NULL,
  "nombre" TEXT NOT NULL,
  "series" INTEGER NOT NULL,
  "repeticiones" TEXT NOT NULL,
  "descanso" TEXT NOT NULL,
  "grupoMuscular" TEXT,
  "nota" TEXT,
  "orden" INTEGER NOT NULL,
  CONSTRAINT "EjercicioRutina_diaRutinaId_fkey" FOREIGN KEY ("diaRutinaId") REFERENCES "DiaRutina"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AsignacionRutina" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "rutinaId" TEXT NOT NULL,
  "socioId" TEXT NOT NULL,
  "parametros" TEXT,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AsignacionRutina_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "Rutina"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AsignacionRutina_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Dieta" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "nombre" TEXT NOT NULL,
  "descripcion" TEXT,
  "tipo" TEXT NOT NULL DEFAULT 'generica',
  "socioId" TEXT,
  "token" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Dieta_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Comida" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "dietaId" TEXT NOT NULL,
  "nombre" TEXT NOT NULL,
  "hora" TEXT NOT NULL,
  "orden" INTEGER NOT NULL,
  CONSTRAINT "Comida_dietaId_fkey" FOREIGN KEY ("dietaId") REFERENCES "Dieta"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ItemComida" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "comidaId" TEXT NOT NULL,
  "alimento" TEXT NOT NULL,
  "cantidad" TEXT NOT NULL,
  "proteinas" DOUBLE PRECISION,
  "carbohidratos" DOUBLE PRECISION,
  "grasas" DOUBLE PRECISION,
  "orden" INTEGER NOT NULL,
  CONSTRAINT "ItemComida_comidaId_fkey" FOREIGN KEY ("comidaId") REFERENCES "Comida"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AsignacionDieta" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "dietaId" TEXT NOT NULL,
  "socioId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AsignacionDieta_dietaId_fkey" FOREIGN KEY ("dietaId") REFERENCES "Dieta"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AsignacionDieta_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
`;

export async function POST() {
  try {
    for (const dropSQL of TABLES) {
      await prisma.$executeRawUnsafe(dropSQL);
    }

    const statements = CREATE_TABLES.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      if (stmt.trim()) {
        await prisma.$executeRawUnsafe(stmt);
      }
    }

    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await prisma.$queryRawUnsafe<{ tablename: string }[]>(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    );
    return NextResponse.json({ success: true, tables: result.map(r => r.tablename) });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
