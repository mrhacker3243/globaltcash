import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rewardId } = await req.json();

    if (!rewardId) {
      return NextResponse.json({ error: "Reward ID is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, milestoneProgress: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const reward = await db.reward.findUnique({
      where: { id: rewardId, active: true }
    });

    if (!reward) return NextResponse.json({ error: "Reward not found" }, { status: 404 });

    // Check if user has already claimed this reward
    const existingClaim = await db.claimedReward.findFirst({
      where: {
        userId: user.id,
        rewardId: rewardId,
        status: { in: ["PENDING", "APPROVED"] }
      }
    });

    if (existingClaim) {
      return NextResponse.json({ error: "Reward already claimed" }, { status: 400 });
    }

    // Check if user meets the criteria
    if (user.milestoneProgress < reward.targetSales) {
      return NextResponse.json({ error: "Milestone not reached" }, { status: 400 });
    }

    // Create claim request
    const claim = await db.claimedReward.create({
      data: {
        userId: user.id,
        rewardId: rewardId,
        status: "PENDING"
      }
    });

    return NextResponse.json({
      message: "Reward claim submitted for review",
      claimId: claim.id
    });
  } catch (error) {
    console.error("Claim reward error:", error);
    return NextResponse.json({ error: "Failed to claim reward" }, { status: 500 });
  }
}