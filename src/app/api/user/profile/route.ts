import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, balance: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ✅ FIXED CALCULATION: Sum only real deposits, exclude Plan Purchases
    const totalDepositsAgg = await db.deposit.aggregate({
      where: {
        userId: userId,
        status: "APPROVED" as any,
        NOT: {
          gateway: "PLAN_PURCHASE" // Is line se 5k + 5k wala masla hal ho jayega
        }
      },
      _sum: { amount: true }
    });

    return NextResponse.json({
      ...user,
      totalDeposited: totalDepositsAgg._sum.amount || 0,
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}