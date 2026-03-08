-- AlterTable
ALTER TABLE "User" ADD COLUMN     "milestoneProgress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rankLevel" TEXT NOT NULL DEFAULT 'Starter',
ADD COLUMN     "referralCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetSales" INTEGER NOT NULL,
    "prizeAmount" DOUBLE PRECISION NOT NULL,
    "prizeType" TEXT NOT NULL DEFAULT 'cash',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);
