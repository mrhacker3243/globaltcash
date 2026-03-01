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

    // 1. Find Withdrawal
    const withdrawal = await db.withdrawal.findUnique({ where: { id: withdrawalId } });
    
    if (!withdrawal) {
       return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
    }

    if (withdrawal.status !== "PENDING") {
      return NextResponse.json({ error: "Withdrawal already processed" }, { status: 400 });
    }

    // 2. Update Status to COMPLETED
    await db.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: "COMPLETED" }
    });

    return NextResponse.json({ success: true, message: "Withdrawal marked as paid" });

  } catch (error) {
    console.error("Withdrawal approval error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
