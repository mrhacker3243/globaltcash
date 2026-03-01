import UserSidebar from "@/components/UserSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import DashboardHeader from "@/components/DashboardHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Redirect admins to admin dashboard
  if (session && (session.user as any).role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 flex overflow-x-hidden">
      {/* Sidebar fixed position par hai */}
      <UserSidebar />
      
      {/* Content area logic */}
      <div className="flex-1 w-full lg:ml-64 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <DashboardHeader type="user" />
        <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden pb-24 lg:pb-0">
          {/* Is container ke andar saare dashboard pages display honge */}
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}