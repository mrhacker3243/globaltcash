const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
    console.log('Tables are connected and accessible!');
  } catch (e) {
    console.error('Error accessing tables:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
