import { db } from "@/lib/db";

export async function distributeDailyProfits() {
  // 1. Sab active deposits dhundo taake unka profit calculate ho sake
  const activeDeposits = await db.deposit.findMany({
    where: { status: "ACTIVE" },
  });

  // Fetch all plans once to avoid repeated queries in the loop
  const plans = await db.plan.findMany();
  const planMap = new Map(plans.map(p => [(p as any).name, p]));

  for (const deposit of activeDeposits) {
    const plan: any = planMap.get(deposit.planName || "");
    
    // Default rate if plan not found (fallback)
    let rate = 0.01; 
    
    if (plan) {
      rate = plan.roi / 100; // Database stores as percentage (e.g., 2.5)
    }

    const profit = deposit.amount * rate;

    // 2. User ka balance update karein atomically
    await db.user.update({
      where: { id: deposit.userId },
      data: {
        balance: { increment: profit }
      }
    });

    console.log(`[ENGINE] Profit of ${profit} (${(rate*100).toFixed(1)}%) added to user ${deposit.userId} for plan ${deposit.planName}`);
  }
}