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

    const activePlans = await db.deposit.findMany({
      where: {
        userId: userId,
        status: "ACTIVE",
        planName: {
          not: "Manual Deposit"
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(activePlans);

  } catch (error) {
    console.error("Active plans error:", error);
    return NextResponse.json({ error: "Error fetching plans" }, { status: 500 });
  }
}