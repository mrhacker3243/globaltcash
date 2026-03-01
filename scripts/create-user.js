
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:VZBWdeKnYTUBJjoZmtpblUjOSBtkCaed@ballast.proxy.rlwy.net:50834/railway"
    }
  }
});

async function main() {
  try {
    const email = 'Faham@gmail.com';
    const password = 'Faham@112';

    console.log(`Checking if user ${email} exists...`);
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log("User already exists.");
      return;
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating user...");
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: "Faham Admin",
        role: "ADMIN" // Making them admin since they are testing
      }
    });

    console.log("User created successfully:", newUser.email);

  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
