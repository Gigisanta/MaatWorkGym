import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  await prisma.fichaje.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.socio.deleteMany();
  await prisma.plan.deleteMany();

  const planMensual = await prisma.plan.create({
    data: {
      nombre: "Plan Mensual",
      duracionDias: 30,
      precio: 5000,
    },
  });

  const planTrimestral = await prisma.plan.create({
    data: {
      nombre: "Plan Trimestral",
      duracionDias: 90,
      precio: 13500,
    },
  });

  const planAnual = await prisma.plan.create({
    data: {
      nombre: "Plan Anual",
      duracionDias: 365,
      precio: 48000,
    },
  });

  const hoy = new Date();
  const thisMonth = hoy.getMonth() + 1;
  const thisYear = hoy.getFullYear();

  const socios = [
    {
      dni: "12345678",
      nombre: "María",
      apellido: "García",
      telefono: "5491112345678",
      fechaNacimiento: new Date(1995, 3, 15),
      planId: planMensual.id,
      fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth() - 2, 15),
    },
    {
      dni: "23456789",
      nombre: "Juan",
      apellido: "Martínez",
      telefono: "5491187654321",
      fechaNacimiento: new Date(1988, 7, 22),
      planId: planTrimestral.id,
      fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1),
    },
    {
      dni: "34567890",
      nombre: "Ana",
      apellido: "López",
      telefono: "5491123456789",
      fechaNacimiento: new Date(1992, 11, 8),
      planId: planAnual.id,
      fechaInicio: new Date(hoy.getFullYear() - 1, 0, 10),
    },
    {
      dni: "45678901",
      nombre: "Carlos",
      apellido: "Rodríguez",
      telefono: "5491133456789",
      fechaNacimiento: new Date(1990, 5, 30),
      planId: planMensual.id,
      fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth(), 5),
    },
    {
      dni: "56789012",
      nombre: "Laura",
      apellido: "Fernández",
      telefono: "5491167890123",
      fechaNacimiento: new Date(1998, 1, 14),
      planId: planTrimestral.id,
      fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth() - 1, 20),
    },
  ];

  for (const socioData of socios) {
    const socio = await prisma.socio.create({
      data: socioData,
    });

    for (let i = 3; i >= 0; i--) {
      let mes = thisMonth - i;
      let anio = thisYear;
      if (mes <= 0) {
        mes += 12;
        anio -= 1;
      }

      if (i === 0 && socioData.dni === "45678901") {
        continue;
      }

      await prisma.pago.create({
        data: {
          socioId: socio.id,
          monto: 5000,
          metodo: i % 2 === 0 ? "efectivo" : "transferencia",
          mes,
          anio,
          fechaPago: new Date(anio, mes - 1, 10 + (3 - i) * 5),
        },
      });
    }

    const daysAgo = [2, 5, 8, 12, 15, 20];
    for (const days of daysAgo) {
      const fechaFichaje = new Date(hoy);
      fechaFichaje.setDate(fechaFichaje.getDate() - days);
      if (fechaFichaje.getMonth() + 1 === thisMonth || days <= 5) {
        fechaFichaje.setHours(8 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 60));
        await prisma.fichaje.create({
          data: {
            socioId: socio.id,
            fechaHora: fechaFichaje,
          },
        });
      }
    }
  }

  const socioPrueba = await prisma.socio.create({
    data: {
      dni: "11111111",
      nombre: "Test",
      apellido: "Usuario",
      telefono: "5491100112233",
      fechaNacimiento: new Date(1995, 0, 1),
      planId: planMensual.id,
      fechaInicio: new Date(),
    },
  });

  await prisma.pago.create({
    data: {
      socioId: socioPrueba.id,
      monto: 5000,
      metodo: "efectivo",
      mes: thisMonth,
      anio: thisYear,
      fechaPago: new Date(),
    },
  });

  console.log("Seed completed!");
  console.log(`   Created ${await prisma.plan.count()} plans`);
  console.log(`   Created ${await prisma.socio.count()} socios`);
  console.log(`   Created ${await prisma.pago.count()} pagos`);
  console.log(`   Created ${await prisma.fichaje.count()} fichajes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
