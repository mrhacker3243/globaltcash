import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, name, referrerId, referralCode } = await req.json();
  const resolvedReferrerId = referrerId || referralCode;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Get IP and device info
    const ipAddress = req.headers.get('x-forwarded-for') ||
                     req.headers.get('x-real-ip') ||
                     'unknown';
    const deviceFingerprint = req.headers.get('user-agent') || '';

    // 4. Validate referrer if provided
    if (resolvedReferrerId) {
      const referrer = await db.user.findUnique({ where: { id: resolvedReferrerId } });
      if (!referrer) {
        return NextResponse.json({ error: "Invalid referrer" }, { status: 400 });
      }
    }

    // 5. Create user; if referred, increment the referrer's referral count
    const createdUser = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: "USER", // Default role for signup
          balance: 0,
          referrerId: resolvedReferrerId,
          ipAddress,
          deviceFingerprint,
        }
      });

      if (resolvedReferrerId) {
        await tx.user.update({
          where: { id: resolvedReferrerId },
          data: { referralCount: { increment: 1 } }
        });
      }

      return newUser;
    });

    return NextResponse.json({ message: "User created successfully", userId: createdUser.id }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}