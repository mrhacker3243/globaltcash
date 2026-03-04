import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        deposits: {
          orderBy: { createdAt: "desc" }
        },
        withdrawals: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const activePlans = user.deposits.filter(
      (d) =>
        d.status === "ACTIVE" &&
        d.planName &&
        d.planName !== "Manual Deposit"
    );

    return NextResponse.json({
      name: user.name,
      email: user.email,
      balance: user.balance || 0,
      deposits: user.deposits || [],
      withdrawals: user.withdrawals || [],
      activePlans
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}