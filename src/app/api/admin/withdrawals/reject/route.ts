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

    const { withdrawalId } = await req.json();
    if (!withdrawalId) {
      return NextResponse.json({ error: "Withdrawal ID required" }, { status: 400 });
    }

    const withdrawal = await db.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!withdrawal) {
      return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
    }

    if (withdrawal.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending withdrawals can be rejected" }, { status: 400 });
    }

    // Refund the amount back to user
    await db.$transaction([
      db.withdrawal.update({ where: { id: withdrawalId }, data: { status: "REJECTED" } }),
      db.user.update({ where: { id: withdrawal.userId }, data: { balance: { increment: withdrawal.amount } } }),
    ]);

    return NextResponse.json({ success: true, message: "Withdrawal rejected and amount refunded" });
  } catch (error) {
    console.error("Reject withdrawal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
