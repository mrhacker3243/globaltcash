import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { notifyPlanChange } from "@/lib/planSync";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// List all plans for admin
export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const plans = await db.plan.findMany({
      orderBy: { minAmount: 'asc' }
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Fetch plans error:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

// Create new plan
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log(`[API] Creating new plan:`, body);

    const plan = await db.plan.create({
      data: {
        name: body.name,
        minAmount: parseFloat(body.minAmount) || 0,
        maxAmount: parseFloat(body.maxAmount) || 0,
        roi: parseFloat(body.roi) || 0,
        duration: body.duration,
        icon: body.icon || "Zap",
        popular: body.popular === true,
        active: body.active !== undefined ? body.active : true,
      }
    });

    console.log(`✅ Plan ${plan.id} created successfully`);
    
    // Broadcast plan creation to all subscribers
    notifyPlanChange({
      type: 'CREATE',
      planId: plan.id,
      planData: plan,
      timestamp: Date.now(),
      adminEmail: user?.email
    });

    return NextResponse.json(plan);
  } catch (error: any) {
    console.error("❌ Create plan error:", error);
    return NextResponse.json({ 
      error: "Failed to create plan",
      details: error.message 
    }, { status: 500 });
  }
}
