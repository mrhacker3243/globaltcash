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

    const { depositId } = await req.json(); // Frontend se depositId aa rahi hai
    const userId = (session.user as any).id;

    // 1. Is deposit ke liye latest PENDING record dhoondain
    const record = await db.profitRecord.findFirst({
      where: { 
        depositId: depositId,
        status: "PENDING",
        deposit: {
          userId: userId // Security: Ensure deposit user ka hi hai
        }
      },
      include: { 
        deposit: true 
      }
    });

    if (!record) {
      return NextResponse.json({ 
        error: "No pending profit found or already claimed." 
      }, { status: 400 });
    }

    // 2. 24-Hour Buffer Check (Optional but safe)
    // Agar aap chahte hain ke user exact 24h baad hi click kar sakay
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastClaim = record.deposit.lastClaimedAt || record.deposit.createdAt;

    if (lastClaim > oneDayAgo) {
        return NextResponse.json({ error: "Too early to claim. Please wait." }, { status: 400 });
    }

    // 3. Transaction: Atomic update (Balance + Status + LastClaimedAt)
    await db.$transaction([
      // A. User ka balance barhain
      db.user.update({
        where: { id: userId },
        data: { 
          balance: { increment: record.amount } 
        }
      }),
      // B. Profit record ko COMPLETED mark karein (CLAIMED ki jagah standard status)
      db.profitRecord.update({
        where: { id: record.id },
        data: { 
          status: "COMPLETED" 
        }
      }),
      // C. Deposit table mein claim ka time update karein taake timer reset ho jaye
      db.deposit.update({
        where: { id: depositId },
        data: {
          lastClaimedAt: now
        }
      })
    ]);

    console.log(`💰 Profit Claimed: Rs. ${record.amount} for User: ${userId}`);

    return NextResponse.json({ 
      success: true, 
      message: "Profit added to your wallet!",
      amount: record.amount 
    });

  } catch (error) {
    console.error("Claim Route Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}