"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Activity } from "lucide-react";

export default function DashboardHeader({ type = "user" }: { type?: "user" | "admin" }) {
  const pathname = usePathname();

  // Bilkul simple titles
  const getPageTitle = () => {
    if (pathname.includes("/plans")) return "Investment Plans";
    if (pathname.includes("/deposit")) return "Deposit Money";
    if (pathname.includes("/withdraw")) return "Withdraw Money";
    if (pathname.includes("/affiliates") || pathname.includes("/investors")) return "My Team";
    if (pathname.includes("/settings")) return "Settings";
    if (pathname.includes("/wallet")) return "Wallet Status";
    return type === "admin" ? "Admin Panel" : "Dashboard";
  };

  // Simple and clear subtitles
  const getPageSubtitle = () => {
     if (pathname.includes("/plans")) return "Select a plan to start earning";
     if (pathname.includes("/deposit")) return "Add funds to your account";
     if (pathname.includes("/withdraw")) return "Send money to your bank/wallet";
     if (pathname.includes("/affiliates")) return "Check your referral earnings";
     if (pathname.includes("/settings")) return "Manage your profile details";
     return "Welcome back • Account is active";
  };

  return (
    <header className="hidden lg:flex flex-col border-b border-rose-100 bg-[#FFFDF5]/90 backdrop-blur-xl sticky top-0 z-40 transition-all">
      <div className="flex items-center justify-between px-10 py-5">
        
        {/* Left Side: Title & Subtitle */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-6 w-1.5 rounded-full bg-[#E11D48]" />
              <h1 className="text-2xl font-black uppercase tracking-tighter italic text-[#111827] leading-none">
                {getPageTitle()}
              </h1>
            </div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider ml-5 flex items-center gap-2">
              {getPageSubtitle()}
            </p>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-3 bg-white border border-rose-50 rounded-2xl text-gray-400 hover:text-[#E11D48] transition-all shadow-sm">
              <Search size={18} />
            </button>
            <button className="p-3 bg-white border border-rose-50 rounded-2xl text-gray-400 hover:text-[#E11D48] transition-all relative shadow-sm">
              <Bell size={18} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-[#E11D48] rounded-full border-2 border-[#FFFDF5]" />
            </button>
          </div>

          <div className="h-8 w-[1px] bg-rose-100 mx-2" />
          
          <div className="bg-[#E11D48] px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-md shadow-rose-200">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}