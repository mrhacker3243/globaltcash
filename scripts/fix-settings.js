const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSettings() {
  try {
    console.log("Checking System Settings...");
    const settings = await prisma.systemSetting.findUnique({
      where: { id: 'global' }
    });

    if (settings) {
      console.log("✅ System Settings already exist:", settings);
    } else {
      console.log("⚠️ Settings missing. Creating default settings...");
      await prisma.systemSetting.create({
        data: {
          id: 'global',
          adminWalletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          maintenanceMode: false,
        }
      });
      console.log("✅ Created default System Settings.");
    }

  } catch (e) {
    console.error("❌ Error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixSettings();
