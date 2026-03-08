import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const claims = await db.claimedReward.findMany({
      include: {
        user: {
          select: { name: true, email: true, referralCount: true, rankLevel: true }
        },
        reward: {
          select: { title: true, prizeAmount: true, prizeType: true }
        }
      },
      orderBy: { claimedAt: 'desc' }
    });
    return NextResponse.json(claims);
  } catch (error) {
    console.error("Fetch claimed rewards error:", error);
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { claimId, action } = await req.json(); // action: "approve" or "reject"

    if (!claimId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const claim = await db.claimedReward.findUnique({
      where: { id: claimId },
      include: { user: true, reward: true }
    });

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    if (claim.status !== "PENDING") {
      return NextResponse.json({ error: "Claim already processed" }, { status: 400 });
    }

    if (action === "approve") {
      // Credit the reward to user's balance
      await db.user.update({
        where: { id: claim.userId },
        data: { balance: { increment: claim.reward.prizeAmount } }
      });

      await db.claimedReward.update({
        where: { id: claimId },
        data: {
          status: "APPROVED",
          approvedAt: new Date()
        }
      });
    } else {
      await db.claimedReward.update({
        where: { id: claimId },
        data: { status: "REJECTED" }
      });
    }

    return NextResponse.json({ message: `Claim ${action}d successfully` });
  } catch (error) {
    console.error("Process claim error:", error);
    return NextResponse.json({ error: "Failed to process claim" }, { status: 500 });
  }
}