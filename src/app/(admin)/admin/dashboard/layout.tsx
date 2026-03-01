import AdminSidebar from "@/components/AdminSidebar";
import AdminBottomNav from "@/components/AdminBottomNav";
import DashboardHeader from "@/components/DashboardHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Security Check: Only ADMIN role allowed
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="bg-zinc-950 min-h-screen text-white flex overflow-x-hidden">
      {/* Sidebar fixed position */}
      <AdminSidebar />
      
      {/* Content Area */}
      <div className="flex-1 w-full lg:ml-64 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <DashboardHeader type="admin" />
        <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden pb-24 lg:pb-0">
          {children}
        </main>
      </div>

      <AdminBottomNav />
    </div>
  );
}
