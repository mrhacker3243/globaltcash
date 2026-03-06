import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rewards = await db.reward.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(rewards);
  } catch (error) {
    console.error("Fetch rewards error:", error);
    return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log(`[API] Creating new reward:`, body);

    const reward = await db.reward.create({
      data: {
        title: body.title,
        description: body.description,
        targetSales: parseInt(body.targetSales) || 0,
        prizeAmount: parseFloat(body.prizeAmount) || 0,
        prizeType: body.prizeType || "cash",
        active: body.active !== undefined ? body.active : true,
      }
    });

    return NextResponse.json(reward);
  } catch (error) {
    console.error("Create reward error:", error);
    return NextResponse.json({ error: "Failed to create reward" }, { status: 500 });
  }
}