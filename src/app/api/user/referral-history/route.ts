import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const referrals = await db.referral.findMany({
      where: { referrerId: (session.user as any).id },
      include: {
        referee: {
          select: {
            name: true,
            email: true,
            createdAt: true,
            deposits: {
              where: { status: "ACTIVE" },
              select: {
                amount: true,
                planName: true,
                createdAt: true
              },
              orderBy: { createdAt: "desc" },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const history = referrals.map(referral => ({
      date: referral.createdAt,
      refereeName: referral.referee.name || referral.referee.email,
      refereeJoined: referral.referee.createdAt,
      planBought: referral.referee.deposits[0]?.planName || "N/A",
      planAmount: referral.referee.deposits[0]?.amount || 0,
      commissionEarned: referral.commissionAmount,
      status: referral.status
    }));

    return NextResponse.json(history);
  } catch (error) {
    console.error("Fetch referral history error:", error);
    return NextResponse.json({ error: "Failed to fetch referral history" }, { status: 500 });
  }
}