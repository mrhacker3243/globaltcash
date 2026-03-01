const { PrismaClient } = require("@prisma/client");

async function inspectTable() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://postgres:VZBWdeKnYTUBJjoZmtpblUjOSBtkCaed@ballast.proxy.rlwy.net:50834/railway"
      }
    }
  });

  try {
    console.log("Inspecting Railway Database Schema...");
    
    // Querying information_schema to see actual columns in the database
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User'
    `;
    
    console.log("Actual columns in 'User' table:");
    console.table(columns);

    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Existing tables:");
    console.table(tables);

    await prisma.$disconnect();
  } catch (error) {
    console.error("Inspection Failed:", error);
    await prisma.$disconnect();
  }
}

inspectTable();
