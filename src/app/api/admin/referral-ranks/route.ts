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
    const ranks = await db.referralRank.findMany({ orderBy: { minTeamVolume: 'desc' } });
    return NextResponse.json(ranks);
  } catch (error) {
    console.error("Fetch referral ranks error:", error);
    return NextResponse.json({ error: "Failed to fetch referral ranks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, commissionPercent, minTeamVolume, minActiveReferrals, active } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const data = {
      name,
      commissionPercent: parseFloat(commissionPercent) || 0.05,
      minTeamVolume: parseFloat(minTeamVolume) || 0,
      minActiveReferrals: parseInt(minActiveReferrals) || 0,
      active: active !== undefined ? Boolean(active) : true,
    };

    const rank = id
      ? await db.referralRank.update({ where: { id }, data })
      : await db.referralRank.create({ data });

    return NextResponse.json(rank);
  } catch (error) {
    console.error("Create/update referral rank error:", error);
    return NextResponse.json({ error: "Failed to save referral rank" }, { status: 500 });
  }
}
