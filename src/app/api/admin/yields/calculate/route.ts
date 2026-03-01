import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { distributeDailyProfits } from "@/app/lib/investment-engine";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[API] Manual Yield Calculation Triggered by Admin");
    await distributeDailyProfits();

    return NextResponse.json({ success: true, message: "Yields distributed successfully" });

  } catch (error) {
    console.error("Yield calculation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
