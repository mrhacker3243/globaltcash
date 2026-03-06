import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { checkAndUpdateRank, getCommissionPercentForRank } from "@/lib/rankManager";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { planName, amount: rawAmount } = await req.json();
    const amount = parseFloat(rawAmount);

    const plan = await db.plan.findUnique({ where: { name: planName, active: true } });
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 400 });

    const user = await db.user.findUnique({ where: { email: session.user.email! } });
    if (!user || user.balance < amount) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

    const transactionId = `PLAN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const nextClaimAtTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    console.log(`🛒 Plan purchase: ${planName} for user ${user.id}, nextClaimAt: ${nextClaimAtTime.toISOString()}`);

    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { balance: { decrement: amount } }
      }),
      db.deposit.create({
        data: {
          userId: user.id,
          amount: amount,
          planName: planName,
          gateway: "Internal", // Isko simple rakhein
          status: "ACTIVE" as any, // Plans dikhane ke liye aksar status "ACTIVE" chahiye hota hai
          transactionId,
          nextClaimAt: nextClaimAtTime
        }
      })
    ]);

    // Handle referral bonus and milestone progress
    if (user.referrerId) {
      const referrer = await db.user.findUnique({ where: { id: user.referrerId } });
      if (referrer) {
        const percentage = await getCommissionPercentForRank(referrer.rankLevel);
        const bonus = amount * percentage;

        // Get IP address from request headers
        const ipAddress = req.headers.get('x-forwarded-for') ||
                         req.headers.get('x-real-ip') ||
                         'unknown';

        // Basic device fingerprint (can be enhanced)
        const userAgent = req.headers.get('user-agent') || '';

        // Check for fraud: same IP or similar user agent
        const isFraud = referrer.ipAddress === ipAddress ||
                       (referrer.deviceFingerprint && referrer.deviceFingerprint === userAgent);

        if (!isFraud) {
          await db.referral.create({
            data: {
              referrerId: referrer.id,
              refereeId: user.id,
              commissionAmount: bonus,
              status: "PAID", // Auto-paid for now, can change to PENDING for manual approval
              ipAddress,
              deviceFingerprint: userAgent,
            }
          });

          await db.user.update({
            where: { id: referrer.id },
            data: {
              balance: { increment: bonus },
              referralCount: { increment: 1 },
              // Track total referred deposit volume so rewards can be based on sales amount
              milestoneProgress: { increment: Math.round(amount) }
            }
          });

          console.log(`💰 Referral bonus: ${bonus} added to referrer ${referrer.id}`);
          
          // Check for rank advancement
          await checkAndUpdateRank(referrer.id);
        } else {
          console.log(`🚫 Fraud detected: Referral bonus blocked for referrer ${referrer.id}`);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}