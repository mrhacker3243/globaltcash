/*
  Warnings:

  - The `status` column on the `Deposit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[transactionId]` on the table `Deposit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionHash]` on the table `Deposit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE');

-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "gateway" TEXT,
ADD COLUMN     "lastClaimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nextClaimAt" TIMESTAMP(3),
ADD COLUMN     "slipImage" TEXT,
ADD COLUMN     "transactionHash" TEXT,
ADD COLUMN     "transactionId" TEXT,
ALTER COLUMN "planName" DROP NOT NULL,
ALTER COLUMN "planName" SET DEFAULT 'Manual Deposit',
DROP COLUMN "status",
ADD COLUMN     "status" "DepositStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "referrerId" TEXT,
ADD COLUMN     "totalDeposit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "twoFactorSecret" TEXT,
ADD COLUMN     "walletAddress" TEXT;

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "adminWalletAddress" TEXT DEFAULT '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    "tonWalletAddress" TEXT,
    "jazzCashNumber" TEXT DEFAULT '03001234567',
    "jazzCashName" TEXT DEFAULT 'Faham Khan',
    "easyPaisaNumber" TEXT DEFAULT '03459876543',
    "easyPaisaName" TEXT DEFAULT 'Faham Khan',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfitRecord" (
    "id" TEXT NOT NULL,
    "depositId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfitRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minAmount" DOUBLE PRECISION NOT NULL,
    "maxAmount" DOUBLE PRECISION NOT NULL,
    "roi" DOUBLE PRECISION NOT NULL,
    "duration" TEXT NOT NULL,
    "icon" TEXT DEFAULT 'Zap',
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_transactionId_key" ON "Deposit"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_transactionHash_key" ON "Deposit"("transactionHash");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfitRecord" ADD CONSTRAINT "ProfitRecord_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
