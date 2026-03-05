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

    // 1. Fetch Deposit (Casting to 'any' to avoid Prisma Type mismatch errors during build)
    const deposit = await db.deposit.findUnique({
      where: { id: depositId },
    }) as any;

    // Check if deposit exists and belongs to user
    if (!deposit || deposit.userId !== userId || deposit.status !== "ACTIVE") {
      return NextResponse.json({ error: "Active deposit not found" }, { status: 400 });
    }

    // 2. Logic: Calculate Pending Days
    const now = new Date();
    const lastClaim = deposit.lastClaimedAt || deposit.createdAt;
    const diffInMs = now.getTime() - lastClaim.getTime();
    const pendingDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (pendingDays < 1) {
      return NextResponse.json({ error: "No profit available to claim yet" }, { status: 400 });
    }

    // 3. Calculate Total Profit 
    // Yahan hum 'roi' direct deposit se le rahe hain (as any casting ensures build passes)
    const roiValue = deposit.roi || 0; 
    const dailyProfit = deposit.amount * (roiValue / 100);
    const totalClaimAmount = dailyProfit * pendingDays;

    // 4. Atomic Transaction
    await db.$transaction([
      // Update User Balance
      db.user.update({
        where: { id: userId },
        data: { balance: { increment: totalClaimAmount } }
      }),
      // Update Deposit Timestamp
      db.deposit.update({
        where: { id: depositId },
        data: { 
          lastClaimedAt: new Date(lastClaim.getTime() + pendingDays * 24 * 60 * 60 * 1000) 
        }
      }),
      // Create History Record (Make sure 'profitRecord' model exists in your schema)
      db.profitRecord.create({
        data: {
          depositId: deposit.id,
          amount: totalClaimAmount,
          status: "COMPLETED",
          description: `Claimed ${pendingDays} day(s) profit`
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      amount: totalClaimAmount, 
      claimedDays: pendingDays 
    });

  } catch (error) {
    console.error("Claim Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}import { db } from "@/lib/db";
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

    // 1. Fetch Deposit (Casting to 'any' to avoid Prisma Type mismatch errors during build)
    const deposit = await db.deposit.findUnique({
      where: { id: depositId },
    }) as any;

    // Check if deposit exists and belongs to user
    if (!deposit || deposit.userId !== userId || deposit.status !== "ACTIVE") {
      return NextResponse.json({ error: "Active deposit not found" }, { status: 400 });
    }

    // 2. Logic: Calculate Pending Days
    const now = new Date();
    const lastClaim = deposit.lastClaimedAt || deposit.createdAt;
    const diffInMs = now.getTime() - lastClaim.getTime();
    const pendingDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (pendingDays < 1) {
      return NextResponse.json({ error: "No profit available to claim yet" }, { status: 400 });
    }

    // 3. Calculate Total Profit 
    // Yahan hum 'roi' direct deposit se le rahe hain (as any casting ensures build passes)
    const roiValue = deposit.roi || 0; 
    const dailyProfit = deposit.amount * (roiValue / 100);
    const totalClaimAmount = dailyProfit * pendingDays;

    // 4. Atomic Transaction
    await db.$transaction([
      // Update User Balance
      db.user.update({
        where: { id: userId },
        data: { balance: { increment: totalClaimAmount } }
      }),
      // Update Deposit Timestamp
      db.deposit.update({
        where: { id: depositId },
        data: { 
          lastClaimedAt: new Date(lastClaim.getTime() + pendingDays * 24 * 60 * 60 * 1000) 
        }
      }),
      // Create History Record (Make sure 'profitRecord' model exists in your schema)
      db.profitRecord.create({
        data: {
          depositId: deposit.id,
          amount: totalClaimAmount,
          status: "COMPLETED",
          description: `Claimed ${pendingDays} day(s) profit`
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      amount: totalClaimAmount, 
      claimedDays: pendingDays 
    });

  } catch (error) {
    console.error("Claim Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}