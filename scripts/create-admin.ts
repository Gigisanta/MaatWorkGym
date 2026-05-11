import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

async function main() {
  const dbPath = path.join(process.cwd(), "dev.db");
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  const prisma = new PrismaClient({ adapter });

  const existing = await prisma.admin.findFirst();
  if (existing) {
    console.log("Admin already exists");
    await prisma.$disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash("admin1234", 12);
  const admin = await prisma.admin.create({
    data: { username: "admin", passwordHash },
  });

  console.log("Admin created: admin / admin1234");
  await prisma.$disconnect();
}

main().catch(console.error);
