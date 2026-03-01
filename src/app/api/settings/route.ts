import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await db.systemSetting.findUnique({
      where: { id: "global" },
      select: {
        adminWalletAddress: true,
        tonWalletAddress: true,
        jazzCashNumber: true,
        jazzCashName: true,
        easyPaisaNumber: true,
        easyPaisaName: true,
        maintenanceMode: true,
      }
    });

    return NextResponse.json(settings || {
      adminWalletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      tonWalletAddress: null,
      maintenanceMode: false
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
