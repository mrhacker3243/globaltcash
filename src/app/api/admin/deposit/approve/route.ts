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

    if (!depositId) {
      return NextResponse.json({ error: "Deposit ID required" }, { status: 400 });
    }

    // 1. Find Deposit
    const deposit = await db.deposit.findUnique({ where: { id: depositId } });
    
    if (!deposit) {
       return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    }

    if (deposit.status !== "PENDING") {
      return NextResponse.json({ error: "Deposit already processed" }, { status: 400 });
    }

    // 2. Start Transaction (Update Balance + Approve Deposit)
    await db.$transaction([
      db.user.update({
        where: { id: deposit.userId },
        data: { balance: { increment: deposit.amount } }
      }),
      db.deposit.update({
        where: { id: depositId },
        data: { status: "ACTIVE" }
      })
    ]);

    return NextResponse.json({ success: true, message: "Deposit Approved" });

  } catch (error) {
    console.error("Deposit approval error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
