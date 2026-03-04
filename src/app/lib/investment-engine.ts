// src/lib/investment-engine.ts
import { db } from "@/lib/db";

export async function distributeDailyProfits() {
  const activeDeposits = await db.deposit.findMany({
    where: { status: "ACTIVE" },
  });

  for (const deposit of activeDeposits) {
    // Aakhri profit check karein
    const lastProfit = await db.profitRecord.findFirst({
      where: { depositId: deposit.id },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // ✅ FIX 1: TypeScript error handle karein (Check if planName exists)
    if (!deposit.planName) {
      console.log(`⚠️ Skip: Deposit ${deposit.id} has no planName`);
      continue;
    }

    if (!lastProfit || lastProfit.createdAt < oneDayAgo) {
      // ✅ FIX 2: Type safe query
      const plan = await db.plan.findFirst({ 
        where: { name: deposit.planName as string } 
      });

      if (!plan) continue;

      const dailyProfit = deposit.amount * (plan.roi / 100);

      // Agla claim kab hoga? (Next 24 hours)
      const nextClaimableAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      await db.profitRecord.create({
        data: {
          depositId: deposit.id,
          amount: dailyProfit,
          status: "PENDING",
          // ✅ FIX 3: scheduledAt lazmi dalein timer chalane ke liye
          // Agar schema mein ye field nahi hai, toh add karein ya front-end par createdAt + 24h use karein
          scheduledAt: nextClaimableAt, 
        },
      });
      
      console.log(`✅ Profit distributed for ${deposit.id}`);
    }
  }
}