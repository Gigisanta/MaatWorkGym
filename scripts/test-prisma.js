const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');
const dbPath = path.join(process.cwd(), 'dev.db');
console.log('db path:', dbPath);

const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
console.log('adapter type:', typeof adapter);
console.log('adapter:', adapter);

const prisma = new PrismaClient({ adapter });
console.log('prisma:', typeof prisma);
console.log('prisma client:', prisma);

async function test() {
  const admin = await prisma.admin.findFirst();
  console.log('admin:', admin);
  await prisma.$disconnect();
}

test().catch(e => console.error('error:', e));
