import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getCommissionPercentForRank } from "@/lib/rankManager";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        referralCount: true,
        rankLevel: true,
        milestoneProgress: true,
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ── Calculate total sales from direct referrals ──
    const salesStats = await db.user.aggregate({
      where: { referrerId: userId },
      _sum: { totalDeposit: true },
    });

    const totalSales = salesStats._sum.totalDeposit || 0;

    const rewards = await db.reward.findMany({
      where: { active: true },
      orderBy: { targetSales: "asc" },
    });

    const commissionRate = await getCommissionPercentForRank(user.rankLevel);

    return NextResponse.json({
      user,
      commissionRate,
      rewards,
      totalRevenueSales: totalSales,    // ← this must be sent
    });
  } catch (error) {
    console.error("Rewards API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}