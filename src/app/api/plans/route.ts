import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const plans = await db.plan.findMany({
      where: { active: true },
      orderBy: { minAmount: 'asc' }
    });
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}
