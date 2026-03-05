import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        deposits: {
          orderBy: { createdAt: "desc" }
        },
        withdrawals: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const activePlans = user.deposits.filter(
      (d) =>
        d.status === "ACTIVE" &&
        d.planName &&
        d.planName !== "Manual Deposit"
    );

    // Fetch all plans to enrich activePlans
    const plans = await db.plan.findMany();

    // Enrich activePlans with plan details
    const enrichedActivePlans = activePlans.map(dep => {
      const plan = plans.find(p => p.name === dep.planName);
      return { ...dep, plan, roi: plan?.roi };
    });

    // Calculate total pending claims
    let totalPendingClaims = 0;
    let totalPendingCount = 0;
    enrichedActivePlans.forEach((dep: any) => {
      const lastClaim = dep.lastClaimedAt ? new Date(dep.lastClaimedAt) : new Date(dep.createdAt);
      const pendingDays = Math.floor((new Date().getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24));
      if (pendingDays >= 1 && dep.roi) {
        const dailyProfit = dep.amount * (dep.roi / 100);
        totalPendingClaims += dailyProfit * pendingDays;
        totalPendingCount += 1;
      }
    });

    return NextResponse.json({
      name: user.name,
      email: user.email,
      balance: user.balance || 0,
      deposits: user.deposits || [],
      withdrawals: user.withdrawals || [],
      activePlans: enrichedActivePlans,
      totalPendingClaims,
      totalPendingCount
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}