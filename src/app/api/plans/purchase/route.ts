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

    const { planName, amount: rawAmount } = await req.json();
    const amount = parseFloat(rawAmount);

    // 1. Fetch Plan from DB for validation
    const plan = await db.plan.findUnique({
      where: { name: planName, active: true }
    });

    if (!plan || amount < plan.minAmount || amount > plan.maxAmount) {
      return NextResponse.json({ error: "Invalid plan or amount out of range" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Atomic Update with condition (though Prisma decrement does this internally, we wrap in transaction)
    try {
      if (user.balance < amount) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }

      const transactionId = `PLAN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      await db.$transaction([
        db.user.update({
          where: { id: user.id, balance: { gte: amount } }, // Extra check for safety
          data: { balance: { decrement: amount } }
        }),
        db.deposit.create({
          data: {
            userId: user.id,
            amount: amount,
            planName: planName,
            gateway: "Internal Balance",
            status: "ACTIVE",
            transactionId
          }
        })
      ]);

      console.log(`✅ Plan ${plan.id} (${planName}) purchased by user ${user.id}`);
      return NextResponse.json({ 
        success: true, 
        message: "Plan activated successfully"
      });
    } catch (error) {
       return NextResponse.json({ error: "Transaction failed. Possible balance mismatch." }, { status: 400 });
    }

  } catch (error) {
    console.error("Plan purchase error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
