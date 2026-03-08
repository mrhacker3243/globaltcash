import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { depositId } = await req.json();
    const userId = (session.user as any).id;

    // Fetch deposit and ensure it belongs to the user
    const deposit = await db.deposit.findUnique({
      where: { id: depositId },
    }) as any;

    if (!deposit || deposit.userId !== userId || deposit.status !== "ACTIVE") {
      return NextResponse.json({ error: "Active deposit not found" }, { status: 400 });
    }

    // Fetch the plan to get ROI
    const plan = await db.plan.findUnique({
      where: { name: deposit.planName }
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 400 });
    }

    const now = new Date();
    const lastClaim = deposit.lastClaimedAt || deposit.createdAt;
    const diffInMs = now.getTime() - lastClaim.getTime();
    const pendingDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (pendingDays < 1) {
      return NextResponse.json({ error: "No profit available yet" }, { status: 400 });
    }

    // Using ROI from plan
    const roiValue = plan.roi;
    const dailyProfit = deposit.amount * (roiValue / 100);
    const totalClaimAmount = dailyProfit * pendingDays;

    await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { balance: { increment: totalClaimAmount } }
      }),
      db.deposit.update({
        where: { id: depositId },
        data: { 
          lastClaimedAt: new Date(lastClaim.getTime() + pendingDays * 24 * 60 * 60 * 1000),
          nextClaimAt: new Date(lastClaim.getTime() + (pendingDays + 1) * 24 * 60 * 60 * 1000)
        }
      }),
      db.profitRecord.create({
        data: {
          depositId: deposit.id,
          amount: totalClaimAmount,
          status: "COMPLETED",
        }
      })
    ]);

    return NextResponse.json({ success: true, amount: totalClaimAmount, claimedDays: pendingDays });
  } catch (error) {
    console.error("Claim Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}