import { NextResponse } from "next/server";
import { handleUpdate } from "@/lib/bot/handlers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await handleUpdate(body); // Saari logic yahan se handle hogi
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bot Error:", error);
    return NextResponse.json({ error: "failed" }, { status: 200 });
  }
}