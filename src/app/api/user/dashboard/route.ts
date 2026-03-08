import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getCommissionPercentForRank } from "@/lib/rankManager";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch user basic info (no large includes).
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        referralCount: true,
        rankLevel: true,
        referrer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch recent transaction history (limit to keep response size bounded)
    const [deposits, withdrawals] = await Promise.all([
      db.deposit.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          amount: true,
          status: true,
          planName: true,
          createdAt: true,
        }
      }),
      db.withdrawal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
        }
      })
    ]);

    // Fetch active deposits (plans) with only the claim records we need
    const activeDeposits = await db.deposit.findMany({
      where: {
        userId,
        status: "ACTIVE",
        planName: { not: "Manual Deposit" }
      },
      orderBy: { createdAt: "desc" },
      include: {
        profitRecords: {
          where: { status: "COMPLETED" },
          select: { amount: true }
        }
      }
    });

    const planNames = [...new Set(activeDeposits.map((d) => d.planName).filter(Boolean) as string[])];
    const plans = planNames.length
      ? await db.plan.findMany({ where: { name: { in: planNames } } })
      : [];

    const enrichedActivePlans = activeDeposits.map((dep) => {
      const plan = plans.find((p) => p.name === dep.planName);
      const roi = plan?.roi;

      const claimedAmount = dep.profitRecords.reduce((sum, pr) => sum + pr.amount, 0);

      const lastClaim = dep.lastClaimedAt ? new Date(dep.lastClaimedAt) : new Date(dep.createdAt);
      const pendingDays = Math.floor((new Date().getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24));
      const pendingAmount = roi && pendingDays >= 1 ? dep.amount * (roi / 100) * pendingDays : 0;

      const nextClaimTime = dep.nextClaimAt
        ? dep.nextClaimAt.getTime()
        : lastClaim.getTime() + 24 * 60 * 60 * 1000;

      return {
        ...dep,
        plan,
        roi,
        claimedAmount,
        pendingAmount,
        pendingDays,
        nextClaimTime
      };
    });

    const [totalInvestedResult, totalWithdrawnResult] = await Promise.all([
      db.deposit.aggregate({
        where: { userId, status: "APPROVED" },
        _sum: { amount: true }
      }),
      db.withdrawal.aggregate({
        where: { userId, status: "COMPLETED" },
        _sum: { amount: true }
      })
    ]);

    const totalInvested = totalInvestedResult._sum.amount ?? 0;
    const totalWithdrawn = totalWithdrawnResult._sum.amount ?? 0;

    // Calculate total pending claims
    const totalPendingClaims = enrichedActivePlans.reduce((sum, dep) => sum + (dep.pendingAmount || 0), 0);
    const totalPendingCount = enrichedActivePlans.filter((dep) => dep.pendingDays >= 1 && dep.roi).length;

    const commissionRate = await getCommissionPercentForRank(user.rankLevel || "Starter");

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance || 0,
      referralCount: user.referralCount || 0,
      rankLevel: user.rankLevel || "Starter",
      referrer: user.referrer || null,
      commissionRate,
      deposits,
      withdrawals,
      activePlans: enrichedActivePlans,
      totalInvested,
      totalWithdrawn,
      totalPendingClaims,
      totalPendingCount
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}