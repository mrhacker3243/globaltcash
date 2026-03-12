import { db } from "@/lib/db";
import { sendTelegram } from "../utils";

export async function handleDailyClaim(chatId: string | number, user: any) {
  if (!user.deposits || user.deposits.length === 0) {
    // Fixed: Added Number() conversion
    return await sendTelegram(Number(chatId), "❌ Aapki koi active investment nahi mili. Reward claim karne ke liye pehle invest karein.");
  }

  let totalEarned = 0;
  let earliestNextClaim: Date | null = null;
  const now = new Date();

  for (const deposit of user.deposits) {
    const lastClaim = new Date(deposit.lastClaimedAt || deposit.createdAt);
    const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);

    if (now >= nextClaim) {
      const profit = (deposit.amount * (deposit.roi || 0)) / 100;
      totalEarned += profit;
      
      // Database update
      await db.deposit.update({ 
        where: { id: deposit.id }, 
        data: { lastClaimedAt: now } 
      });
    } else {
      if (!earliestNextClaim || nextClaim < earliestNextClaim) {
        earliestNextClaim = nextClaim;
      }
    }
  }

  if (totalEarned > 0) {
    await db.user.update({ 
      where: { id: user.id }, 
      data: { balance: { increment: totalEarned } } 
    });
    
    return await sendTelegram(
      Number(chatId), 
      `✅ *Success!*\n\nRs. ${totalEarned.toFixed(2)} aapke balance mein add kar diye gaye hain.`
    );
  } else if (earliestNextClaim) {
    const diff = earliestNextClaim.getTime() - now.getTime();
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return await sendTelegram(
      Number(chatId), 
      `⏳ *Wait Please!*\n\nAgla reward claim karne mein abhi *${hrs}h ${mins}m* baaki hain.`
    );
  }
}