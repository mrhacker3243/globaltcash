import { db } from "@/lib/db";

export async function distributeDailyProfits() {
  const activeDeposits = await db.deposit.findMany({
    where: { status: "ACTIVE" },
  });

  for (const deposit of activeDeposits) {
    const lastProfit = await db.profitRecord.findFirst({
      where: { depositId: deposit.id },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (!deposit.planName) continue;

    if (!lastProfit || lastProfit.createdAt < oneDayAgo) {
      const plan = await db.plan.findFirst({ 
        where: { name: deposit.planName } 
      });

      if (!plan) continue;

      const dailyProfit = deposit.amount * (plan.roi / 100);

      await db.profitRecord.create({
        data: {
          depositId: deposit.id,
          amount: dailyProfit,
          status: "PENDING",
        },
      });

      await db.deposit.update({
        where: { id: deposit.id },
        data: { lastClaimedAt: now }
      });
      
      console.log(`✅ Profit Generated for ${deposit.id}`);
    }
  }
}