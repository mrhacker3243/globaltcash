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
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        isFrozen: true,
        balance: true,
        createdAt: true,
        referralCount: true,
        rankLevel: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, action } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    if (!["freeze", "unfreeze", "makeAdmin", "revokeAdmin"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent revoking admin from yourself by mistake (optional)
    const currentAdminId = (session?.user as any)?.id;
    if (currentAdminId && user.id === currentAdminId && action === "revokeAdmin") {
      return NextResponse.json({ error: "Cannot revoke your own admin role" }, { status: 400 });
    }

    const updates: any = {};
    if (action === "freeze") updates.isFrozen = true;
    if (action === "unfreeze") updates.isFrozen = false;
    if (action === "makeAdmin") updates.role = "ADMIN";
    if (action === "revokeAdmin") updates.role = "USER";

    await db.user.update({ where: { id: userId }, data: updates });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User action error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
