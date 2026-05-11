const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'dev.db');
console.log('DB path:', dbPath);

const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
console.log('Adapter:', adapter);
console.log('Adapter type:', typeof adapter);
console.log('Is factory:', adapter.constructor.name);

const prisma = new PrismaClient({ adapter });
console.log('Prisma:', prisma);
console.log('Has admin:', 'admin' in prisma);
console.log('Has plan:', 'plan' in prisma);

async function test() {
  try {
    const admin = await prisma.admin.findFirst();
    console.log('Admin found:', admin);
  } catch (e) {
    console.error('Error:', e.message);
    console.error('Full error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
