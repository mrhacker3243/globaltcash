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

    const { amount, gateway, transactionId, slipImage } = await req.json();

    if (!amount || !gateway || (!transactionId && !slipImage)) {
      return NextResponse.json({ error: "Amount and Proof (TID or Slip) required" }, { status: 400 });
    }

    // Check uniqueness if TID is provided
    if (transactionId) {
      const existing = await db.deposit.findUnique({
        where: { transactionId }
      });

      if (existing) {
        return NextResponse.json({ error: "Transaction ID already used" }, { status: 400 });
      }
    }

    const deposit = await (db.deposit as any).create({
      data: {
        userId: (session.user as any).id,
        amount: parseFloat(amount),
        gateway,
        transactionId,
        slipImage,
        status: "PENDING",
      }
    });

    console.log(`✅ Deposit created for user ${(session.user as any).id}:`, deposit.id);
    return NextResponse.json({ success: true, deposit });
  } catch (error: any) {
    console.error("❌ Deposit error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}
