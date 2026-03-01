import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, planName, transactionHash } = await req.json();

    if (!amount || !transactionHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const deposit = await db.deposit.create({
      data: {
        amount: parseFloat(amount),
        planName: planName || "Manual Deposit",
        transactionHash,
        status: "PENDING",
        userId: (session.user as any).id,
      },
    });

    return NextResponse.json(deposit);
  } catch (error) {
    console.error("Deposit API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
