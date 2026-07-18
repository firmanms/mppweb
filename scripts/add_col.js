const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function main() {
  await prisma.$executeRawUnsafe('ALTER TABLE Layanan ADD COLUMN jamOperasional VARCHAR(191) NULL;');
  console.log('Done');
}

main().catch(console.error).finally(() => prisma.$disconnect());
