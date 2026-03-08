-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isFrozen" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ReferralRank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commissionPercent" DOUBLE PRECISION NOT NULL DEFAULT 0.05,
    "minTeamVolume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minActiveReferrals" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralRank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralRank_name_key" ON "ReferralRank"("name");
