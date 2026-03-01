import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const datasourceOption = process.env.DATABASE_URL
    ? { datasources: { db: { url: process.env.DATABASE_URL } } }
    : {};

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...datasourceOption,
  });
};


type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const db = globalForPrisma.prisma ?? prismaClientSingleton();

export { db };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;