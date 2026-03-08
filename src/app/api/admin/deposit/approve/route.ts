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

    const deposit = await db.deposit.findUnique({
      where: { id: depositId }
    });

    if (!deposit) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    }

    if (deposit.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending deposits can be approved" }, { status: 400 });
    }

    await db.$transaction([
      db.deposit.update({
        where: { id: depositId },
        data: { status: "APPROVED" }
      }),

      db.user.update({
        where: { id: deposit.userId },
        data: {
          balance: { increment: deposit.amount },
          totalDeposit: { increment: deposit.amount }
        }
      })
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}