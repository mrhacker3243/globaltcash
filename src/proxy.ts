import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export default withAuth(
  async function middleware(req) {
    const role = req.nextauth.token?.role;
    const userId = req.nextauth.token?.id as string | undefined;
    const path = req.nextUrl.pathname;

    // Block access to admin pages for non-admin users
    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Prevent frozen accounts from accessing dashboard routes
    if ((path.startsWith("/dashboard") || path.startsWith("/admin")) && userId) {
      try {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (user?.isFrozen) {
          return NextResponse.redirect(new URL("/login", req.url));
        }
      } catch (error) {
        console.error("Middleware user check failed:", error);
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/admin/:path*", "/dashboard/:path*"] };