
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:VZBWdeKnYTUBJjoZmtpblUjOSBtkCaed@ballast.proxy.rlwy.net:50834/railway"
    }
  }
});

async function main() {
  try {
    console.log("Connecting to database...");
    const user = await prisma.user.findUnique({
      where: { email: 'Faham@gmail.com' }
    });

    if (user) {
      console.log("User found:", user.email, "Role:", user.role);
    } else {
      console.log("User 'Faham@gmail.com' NOT found.");
    }
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
