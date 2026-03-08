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

    const deposit = await db.deposit.findUnique({ where: { id: depositId } });
    if (!deposit) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    }

    if (deposit.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending deposits can be rejected" }, { status: 400 });
    }

    await db.deposit.update({ where: { id: depositId }, data: { status: "REJECTED" } });

    return NextResponse.json({ success: true, message: "Deposit rejected" });
  } catch (error) {
    console.error("Reject deposit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
