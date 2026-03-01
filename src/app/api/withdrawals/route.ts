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

    const { amount, address } = await req.json();

    if (!amount || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: (session.user as any).id },
    });

    if (!user || user.balance < parseFloat(amount)) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    try {
      const [_, withdrawal] = await db.$transaction([
        db.user.update({
          where: { id: user.id, balance: { gte: parseFloat(amount) } },
          data: { balance: { decrement: parseFloat(amount) } },
        }),
        db.withdrawal.create({
          data: {
            amount: parseFloat(amount),
            address,
            status: "PENDING",
            userId: user.id,
          },
        }),
      ]);
      return NextResponse.json(withdrawal);
    } catch (error) {
       return NextResponse.json({ error: "Withdrawal failed. Possible balance mismatch." }, { status: 400 });
    }
  } catch (error) {
    console.error("Withdrawal API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
