-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "roi" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Referral" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "depositId" TEXT;

-- AlterTable
ALTER TABLE "ReferralRank" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SystemSetting" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "referralEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
