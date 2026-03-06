import { db } from "./db";

/**
 * Returns the commission percentage for a given rank level.
 * Falls back to 0.05 (5%) when no rank exists.
 */
export async function getCommissionPercentForRank(rankLevel: string) {
  const rank = await db.referralRank.findUnique({ where: { name: rankLevel } });
  return rank?.commissionPercent ?? 0.05;
}

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

  // Determine rank based on configured referral ranks in the database.
  const ranks = await db.referralRank.findMany({
    where: { active: true },
    orderBy: [
      { minTeamVolume: 'desc' },
      { minActiveReferrals: 'desc' },
    ]
  });

  let newRank = user.rankLevel || "Starter";

  for (const rank of ranks) {
    const qualifiesByVolume = teamVolume >= (rank.minTeamVolume ?? 0);
    const qualifiesByReferrals = activeReferrals >= (rank.minActiveReferrals ?? 0);
    if (qualifiesByVolume || qualifiesByReferrals) {
      newRank = rank.name;
      break;
    }
  }

  if (newRank !== user.rankLevel) {
    await db.user.update({
      where: { id: userId },
      data: { rankLevel: newRank }
    });
    console.log(`🏆 Rank updated for user ${userId}: ${user.rankLevel} -> ${newRank}`);
  }
}