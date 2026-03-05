import { db } from "@/lib/db";

export async function distributeDailyProfits() {
  // 1. Get only active deposits
  const activeDeposits = await db.deposit.findMany({
    where: { status: "ACTIVE" },
  });

  const now = new Date();
  // Calculate the threshold (24 hours ago)
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  for (const deposit of activeDeposits) {
    if (!deposit.planName) continue;

    /**
     * ✅ LOGIC CHECK: 
     * We check if 'lastClaimedAt' is null (first time) 
     * OR if it's been more than 24 hours since the last claim.
     */
    const isEligible = !deposit.lastClaimedAt || deposit.lastClaimedAt < oneDayAgo;

    if (isEligible) {
      // Find the plan to get the ROI percentage
      const plan = await db.plan.findFirst({ 
        where: { name: deposit.planName } 
      });

      if (!plan) {
        console.error(`❌ Plan not found for deposit: ${deposit.id}`);
        continue;
      }

      // Calculate profit: (Deposit Amount * ROI%) / 100
      const dailyProfit = deposit.amount * (plan.roi / 100);

      try {
        // Use a transaction to ensure both DB operations succeed or fail together
        await db.$transaction([
          // Create the profit record (NO 'scheduledAt' property here)
          db.profitRecord.create({
            data: {
              depositId: deposit.id,
              amount: dailyProfit,
              status: "PENDING",
              // Note: createdAt is handled automatically by Prisma
            },
          }),
          
          // Update the deposit's lastClaimedAt to prevent double distribution
          db.deposit.update({
            where: { id: deposit.id },
            data: { lastClaimedAt: now }
          })
        ]);

        console.log(`✅ Profit Generated: $${dailyProfit.toFixed(2)} for Deposit ${deposit.id}`);
      } catch (error) {
        console.error(`| ❌ Failed to process deposit ${deposit.id}:`, error);
      }
    }
  }
}