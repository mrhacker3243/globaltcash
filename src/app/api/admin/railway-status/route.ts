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

    // Check DB connection
    let isConnected = false;
    try {
      await db.$queryRaw`SELECT 1`;
      isConnected = true;
    } catch (e) {
      console.error("DB Connection test failed:", e);
    }

    // Mask database URL for safety
    const rawUrl = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL || "";
    let maskedUrl = "";
    if (rawUrl) {
      try {
        const url = new URL(rawUrl);
        url.password = "****";
        maskedUrl = url.toString();
      } catch (e) {
        maskedUrl = rawUrl.replace(/:([^@]+)@/, ":****@");
      }
    }

    return NextResponse.json({
      isConnected,
      databaseUrl: maskedUrl,
      provider: "railway",
      nodeVersion: process.version,
      platform: process.env.NODE_ENV === "production" ? "Production" : "Development",
    });
  } catch (error) {
    console.error("Railway status error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
