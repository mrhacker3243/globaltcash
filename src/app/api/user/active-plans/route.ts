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

    // Get active plans from Deposit model
    const activePlans = await db.deposit.findMany({
      where: {
        userId,
        status: "ACTIVE",
        planName: {
            not: "Manual Deposit"
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(activePlans);
  } catch (error) {
    console.error("Fetch active plans error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
