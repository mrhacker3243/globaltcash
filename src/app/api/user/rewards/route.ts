import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getCommissionPercentForRank } from "@/lib/rankManager";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({
      where: { email: session.user.email! },
      select: {
        referralCount: true,
        rankLevel: true,
        milestoneProgress: true,
        referrer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const rewards = await db.reward.findMany({
      where: { active: true },
      orderBy: { targetSales: 'asc' }
    });

    const commissionRate = await getCommissionPercentForRank(user.rankLevel);

    return NextResponse.json({
      user: user,
      commissionRate,
      rewards: rewards
    });
  } catch (error) {
    console.error("Fetch user rewards error:", error);
    return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 });
  }
}