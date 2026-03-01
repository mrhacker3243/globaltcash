import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Password ko hash karna zaroori hai
  const hashedPassword = await bcrypt.hash('admin', 10) // Hashing the plain text password

  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      password: hashedPassword
    },
    create: {
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'ADMIN',
      balance: 1000000,
    },
  })

  // Initialize System Settings
  await prisma.systemSetting.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      adminWalletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      maintenanceMode: false,
    },
  })

  // Initialize Default Investment Plans
  const plans = [
    { name: "Basic", roi: 1.5, duration: "1 Month", minAmount: 5000, maxAmount: 10000, popular: false, icon: "Zap" },
    { name: "Basic Pro", roi: 2.5, duration: "2 Months", minAmount: 11000, maxAmount: 20000, popular: false, icon: "Zap" },
    { name: "Supreme Basic", roi: 3.5, duration: "4 Months", minAmount: 25000, maxAmount: 50000, popular: false, icon: "Trophy" },
    { name: "Supreme Edge", roi: 5.0, duration: "6 Months", minAmount: 55000, maxAmount: 100000, popular: true, icon: "Trophy" },
    { name: "Supreme Pro", roi: 7.5, duration: "12 Months", minAmount: 110000, maxAmount: 500000, popular: false, icon: "Crown" },
    { name: "Supreme", roi: 10.0, duration: "15 Months", minAmount: 550000, maxAmount: 2000000, popular: false, icon: "Crown" }
  ]

  // Clear existing plans first to avoid name conflicts with old unique names
  await prisma.plan.deleteMany({});

  for (const plane of plans) {
    await prisma.plan.create({
      data: { ...plane, active: true }
    })
  }

  console.log('✅ Admin, System Settings, and Investment Plans Seeded Successfully')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
