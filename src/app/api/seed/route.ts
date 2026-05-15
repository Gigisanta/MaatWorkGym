import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

async function seed() {
  const planBasico = await prisma.plan.create({
    data: { id: 'plan-001', nombre: 'Básico', duracionDias: 30, precio: 49.90 },
  });
  const planPremium = await prisma.plan.create({
    data: { id: 'plan-002', nombre: 'Premium', duracionDias: 30, precio: 79.90 },
  });

  const emp1 = await prisma.empleado.create({
    data: { id: 'emp-001', dni: '12345678A', nombre: 'Carlos', apellido: 'García', telefono: '+34912345601', cargo: 'Entrenador', fechaInicio: new Date('2023-01-15'), horarioEntrada: '08:00', horarioSalida: '17:00', activo: true },
  });
  const emp2 = await prisma.empleado.create({
    data: { id: 'emp-002', dni: '87654321B', nombre: 'María', apellido: 'López', telefono: '+34912345602', cargo: 'Recepcionista', fechaInicio: new Date('2023-03-01'), horarioEntrada: '09:00', horarioSalida: '18:00', activo: true },
  });
  const emp3 = await prisma.empleado.create({
    data: { id: 'emp-003', dni: '45678901C', nombre: 'Pedro', apellido: 'Martínez', telefono: '+34912345603', cargo: 'Entrenador', fechaInicio: new Date('2023-06-01'), horarioEntrada: '10:00', horarioSalida: '19:00', activo: true },
  });

  const soc1 = await prisma.socio.create({
    data: { id: 'soc-001', dni: '11122233D', nombre: 'Juan', apellido: 'Pérez', telefono: '+34611111111', fechaNacimiento: new Date('1990-05-15'), planId: planBasico.id, fechaInicio: new Date('2024-01-10'), horarioEntrenamiento: 'matutino', grupoMuscular: 'pierna', objetivoCliente: 'ganar masa muscular' },
  });
  const soc2 = await prisma.socio.create({
    data: { id: 'soc-002', dni: '44455566E', nombre: 'Ana', apellido: 'Rodríguez', telefono: '+34622222222', fechaNacimiento: new Date('1985-08-22'), planId: planPremium.id, fechaInicio: new Date('2024-02-01'), horarioEntrenamiento: 'vespertino', grupoMuscular: 'gluteos', objetivoCliente: 'perder peso' },
  });
  const soc3 = await prisma.socio.create({
    data: { id: 'soc-003', dni: '77788899F', nombre: 'Miguel', apellido: 'Fernández', telefono: '+34633333333', fechaNacimiento: new Date('1995-12-01'), planId: planBasico.id, fechaInicio: new Date('2024-03-15'), horarioEntrenamiento: 'matutino', grupoMuscular: 'pecho', objetivoCliente: 'tonificar' },
  });
  const soc4 = await prisma.socio.create({
    data: { id: 'soc-004', dni: '99900011G', nombre: 'Laura', apellido: 'Sánchez', telefono: '+34644444444', fechaNacimiento: new Date('1988-03-30'), planId: planPremium.id, fechaInicio: new Date('2024-01-05'), horarioEntrenamiento: 'vespertino', grupoMuscular: 'espalda', objetivoCliente: 'ganar masa muscular' },
  });

  await Promise.all([
    prisma.pago.create({ data: { socioId: soc1.id, monto: 49.90, metodo: 'tarjeta', mes: 5, anio: 2026 } }),
    prisma.pago.create({ data: { socioId: soc2.id, monto: 79.90, metodo: 'efectivo', mes: 5, anio: 2026 } }),
    prisma.pago.create({ data: { socioId: soc3.id, monto: 49.90, metodo: 'tarjeta', mes: 5, anio: 2026 } }),
    prisma.pago.create({ data: { socioId: soc4.id, monto: 79.90, metodo: 'transferencia', mes: 5, anio: 2026 } }),
  ]);

  const rut1 = await prisma.rutina.create({
    data: { id: 'rut-001', nombre: 'Rutina Fuerza Upper Body', descripcion: 'Enfocada en tren superior', tipo: 'generica' },
  });
  await prisma.diaRutina.create({
    data: { id: 'dia-001', rutinaId: rut1.id, diaSemana: 1, nombre: 'Pecho y Tríceps', orden: 1 },
  });
  await prisma.ejercicioRutina.create({ data: { diaRutinaId: 'dia-001', nombre: 'Press de Banca', series: 4, repeticiones: '8-10', descanso: '90s', grupoMuscular: 'pecho', orden: 1 } });
  await prisma.ejercicioRutina.create({ data: { diaRutinaId: 'dia-001', nombre: 'Press Inclinado', series: 3, repeticiones: '10-12', descanso: '60s', grupoMuscular: 'pecho', orden: 2 } });
  await prisma.ejercicioRutina.create({ data: { diaRutinaId: 'dia-001', nombre: 'Fondos en Paralelas', series: 3, repeticiones: '12-15', descanso: '60s', grupoMuscular: 'triceps', orden: 3 } });

  const rut2 = await prisma.rutina.create({
    data: { id: 'rut-002', nombre: 'Rutina Pierna y Glúteos', descripcion: 'Lower body completo', tipo: 'generica' },
  });
  await prisma.diaRutina.create({
    data: { id: 'dia-002', rutinaId: rut2.id, diaSemana: 3, nombre: 'Cuádriceps y Glúteos', orden: 1 },
  });
  await prisma.ejercicioRutina.create({ data: { diaRutinaId: 'dia-002', nombre: 'Sentadilla', series: 4, repeticiones: '8-10', descanso: '120s', grupoMuscular: 'cuadriceps', orden: 1 } });
  await prisma.ejercicioRutina.create({ data: { diaRutinaId: 'dia-002', nombre: 'Prensa', series: 4, repeticiones: '10-12', descanso: '90s', grupoMuscular: 'gluteos', orden: 2 } });
  await prisma.ejercicioRutina.create({ data: { diaRutinaId: 'dia-002', nombre: 'Zancadas', series: 3, repeticiones: '12 c/pierna', descanso: '60s', grupoMuscular: 'gluteos', orden: 3 } });

  const die1 = await prisma.dieta.create({
    data: { id: 'die-001', nombre: 'Dieta Hipertrofia', descripcion: 'Para ganar masa muscular', tipo: 'generica' },
  });
  await prisma.comida.create({ data: { id: 'com-001', dietaId: die1.id, nombre: 'Desayuno', hora: '08:00', orden: 1 } });
  await prisma.itemComida.create({ data: { comidaId: 'com-001', alimento: 'Avena con plátano', cantidad: '100g', proteinas: 15, carbohidratos: 60, grasas: 8, orden: 1 } });
  await prisma.itemComida.create({ data: { comidaId: 'com-001', alimento: 'Huevos revueltos', cantidad: '3 unidades', proteinas: 18, carbohidratos: 2, grasas: 15, orden: 2 } });
  await prisma.comida.create({ data: { id: 'com-002', dietaId: die1.id, nombre: 'Almuerzo', hora: '13:00', orden: 2 } });
  await prisma.itemComida.create({ data: { comidaId: 'com-002', alimento: 'Arroz con pechuga de pollo', cantidad: '200g arroz + 200g pollo', proteinas: 50, carbohidratos: 70, grasas: 10, orden: 1 } });
  await prisma.comida.create({ data: { id: 'com-003', dietaId: die1.id, nombre: 'Merienda', hora: '17:00', orden: 3 } });
  await prisma.itemComida.create({ data: { comidaId: 'com-003', alimento: 'Yogur griego', cantidad: '200g', proteinas: 20, carbohidratos: 15, grasas: 5, orden: 1 } });
  await prisma.comida.create({ data: { id: 'com-004', dietaId: die1.id, nombre: 'Cena', hora: '21:00', orden: 4 } });
  await prisma.itemComida.create({ data: { comidaId: 'com-004', alimento: 'Salmón a la plancha', cantidad: '200g', proteinas: 40, carbohidratos: 5, grasas: 15, orden: 1 } });

  const die2 = await prisma.dieta.create({
    data: { id: 'die-002', nombre: 'Dieta Pérdida de Grasa', descripcion: 'Para perder peso', tipo: 'generica' },
  });
  await prisma.comida.create({ data: { id: 'com-005', dietaId: die2.id, nombre: 'Desayuno', hora: '08:00', orden: 1 } });
  await prisma.itemComida.create({ data: { comidaId: 'com-005', alimento: 'Claras de huevo', cantidad: '4 unidades', proteinas: 16, carbohidratos: 2, grasas: 2, orden: 1 } });
  await prisma.comida.create({ data: { id: 'com-006', dietaId: die2.id, nombre: 'Comida', hora: '14:00', orden: 2 } });
  await prisma.itemComida.create({ data: { comidaId: 'com-006', alimento: 'Pechuga de pollo', cantidad: '200g', proteinas: 45, carbohidratos: 5, grasas: 5, orden: 1 } });
  await prisma.itemComida.create({ data: { comidaId: 'com-006', alimento: 'Brócoli vapor', cantidad: '200g', proteinas: 5, carbohidratos: 10, grasas: 1, orden: 2 } });
  await prisma.comida.create({ data: { id: 'com-007', dietaId: die2.id, nombre: 'Cena', hora: '20:30', orden: 3 } });
  await prisma.itemComida.create({ data: { comidaId: 'com-007', alimento: 'Merluza', cantidad: '200g', proteinas: 35, carbohidratos: 0, grasas: 3, orden: 1 } });

  await prisma.fichaje.create({ data: { socioId: soc1.id, tipo: 'entrada' } });
  await prisma.fichaje.create({ data: { socioId: soc2.id, tipo: 'entrada' } });
  await prisma.fichaje.create({ data: { empleadoId: emp1.id, tipo: 'entrada' } });

  return { planBasico, planPremium, emp1, emp2, emp3, soc1, soc2, soc3, soc4, rut1, rut2, die1, die2 };
}

export async function POST() {
  try {
    const existing = await prisma.socio.count();
    if (existing > 0) {
      return NextResponse.json({ message: 'Ya hay datos', count: existing });
    }

    await seed();
    logger.info('Seed completado');

    return NextResponse.json({
      success: true,
      message: 'Datos de prueba creados',
      stats: {
        planes: 2,
        empleados: 3,
        socios: 4,
        rutinas: 2,
        dietas: 2,
        fichajes: 3,
      },
    });
  } catch (error) {
    logger.error('Seed error', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: 'Error en seed' }, { status: 500 });
  }
}
