import { db } from "./db";

export async function checkAndUpdateRank(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      referrerReferrals: {
        include: {
          referee: {
            include: {
              deposits: {
                where: { status: "ACTIVE" }
              }
            }
          }
        }
      }
    }
  });

  if (!user) return;

  // Calculate team volume (sum of active deposits from referred users)
  const teamVolume = user.referrerReferrals.reduce((total, referral) => {
    const refereeDeposits = referral.referee.deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    return total + refereeDeposits;
  }, 0);

  // Calculate active referrals (referred users with active deposits)
  const activeReferrals = user.referrerReferrals.filter(referral =>
    referral.referee.deposits.some(deposit => deposit.status === "ACTIVE")
  ).length;

  let newRank = user.rankLevel;

  // Rank advancement criteria
  if (teamVolume >= 5000 || activeReferrals >= 20) {
    newRank = "Gold";
  } else if (teamVolume >= 1000 || activeReferrals >= 5) {
    newRank = "Silver"; // If you want intermediate ranks
  } else {
    newRank = "Starter";
  }

  if (newRank !== user.rankLevel) {
    await db.user.update({
      where: { id: userId },
      data: { rankLevel: newRank }
    });
    console.log(`🏆 Rank updated for user ${userId}: ${user.rankLevel} -> ${newRank}`);
  }
}