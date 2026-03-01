import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await db.systemSetting.findUnique({
      where: { id: "global" },
    });

    if (!settings) {
      const defaultSettings = await db.systemSetting.create({
        data: { id: "global" },
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      adminWalletAddress, 
      tonWalletAddress, 
      maintenanceMode,
      jazzCashNumber,
      jazzCashName,
      easyPaisaNumber,
      easyPaisaName 
    } = body;

    const updatedSettings = await db.systemSetting.upsert({
      where: { id: "global" },
      update: {
        adminWalletAddress,
        tonWalletAddress,
        maintenanceMode,
        jazzCashNumber,
        jazzCashName,
        easyPaisaNumber,
        easyPaisaName
      },
      create: {
        id: "global",
        adminWalletAddress,
        tonWalletAddress,
        maintenanceMode: maintenanceMode || false,
        jazzCashNumber,
        jazzCashName,
        easyPaisaNumber,
        easyPaisaName
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Admin settings update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
