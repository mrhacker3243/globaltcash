import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plans = [
    {
      name: "Basic Starter",
      minAmount: 10,
      maxAmount: 99,
      roi: 1.5,
      duration: "24 Hours",
      icon: "Zap",
      popular: false,
    },
    {
      name: "Basic",
      minAmount: 100,
      maxAmount: 499,
      roi: 2.5,
      duration: "48 Hours",
      icon: "Trophy",
      popular: true,
    },
    {
      name: "Standard",
      minAmount: 500,
      maxAmount: 1000,
      roi: 5.0,
      duration: "72 Hours",
      icon: "Crown",
      popular: false,
    },
  ];

  console.log("Seeding plans...");

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
