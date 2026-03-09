import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { depositId } = await req.json();

    // Fetch deposit + referrer info in one go
    const deposit = await db.deposit.findUnique({
      where: { id: depositId },
      include: {
        user: {
          select: {
            id: true,
            referrerId: true,
          }
        }
      }
    });

    if (!deposit) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    }

    if (deposit.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending deposits can be approved" }, { status: 400 });
    }

    const COMMISSION_RATE = 0.05; // 5% — can later come from ReferralRank or SystemSetting

    const approvalResult = await db.$transaction(async (tx) => {
      // 1. Approve deposit
      const updatedDeposit = await tx.deposit.update({
        where: { id: depositId },
        data: {
          status: "APPROVED",
          // approvedAt: new Date(),   // add if you want to track approval time
        }
      });

      // 2. Credit depositor's balance & totalDeposit
      await tx.user.update({
        where: { id: deposit.userId },
        data: {
          balance: { increment: deposit.amount },
          totalDeposit: { increment: deposit.amount }
        }
      });

      // 3. Handle referral commission (only if referrer exists)
      let referralRecord = null;

      if (deposit.user.referrerId) {
        const commissionAmount = deposit.amount * COMMISSION_RATE;

        // Credit referrer balance
        await tx.user.update({
          where: { id: deposit.user.referrerId },
          data: {
            balance: { increment: commissionAmount },
            // Optional: if you add a field like referralEarnings Float @default(0)
            // referralEarnings: { increment: commissionAmount }
          }
        });

        // Create / record the commission in Referral table
        referralRecord = await tx.referral.create({
          data: {
            referrerId: deposit.user.referrerId,
            refereeId: deposit.userId,
            commissionAmount,
            status: "COMPLETED",           // or "APPROVED" — choose what fits your flow
            // ipAddress & deviceFingerprint if you want to carry them over
          }
        });

        console.log(`Referral commission ${commissionAmount} credited to referrer ${deposit.user.referrerId}`);
      }

      return {
        deposit: updatedDeposit,
        referral: referralRecord
      };
    });

    return NextResponse.json({
      success: true,
      message: "Deposit approved",
      commissionProcessed: !!approvalResult.referral
    });

  } catch (error) {
    console.error("Approve deposit error:", error);
    return NextResponse.json(
      { error: "Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}