const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'ADMIN',
      balance: 1000000,
    },
  });

  await prisma.systemSetting.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      adminWalletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      maintenanceMode: false,
    },
  });

  const plans = [
    { name: "Starter Pulse", roi: 1.5, duration: "30 Days", minAmount: 10, maxAmount: 1000, popular: false },
    { name: "Elite Stream", roi: 2.5, duration: "60 Days", minAmount: 1001, maxAmount: 5000, popular: true },
    { name: "Global Master", roi: 4.0, duration: "90 Days", minAmount: 5001, maxAmount: 50000, popular: false }
  ];

  for (const plane of plans) {
    await prisma.plan.upsert({
      where: { name: plane.name },
      update: plane,
      create: { ...plane, active: true }
    });
  }

  console.log('✅ Success: Admin, Settings, and Plans created.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
