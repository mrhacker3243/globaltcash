"use client";

import { usePathname } from "next/navigation";
import { Activity, ShieldCheck, Cpu, Bell, Search } from "lucide-react";
import CyberTicker from "./CyberTicker";

export default function DashboardHeader({ type = "user" }: { type?: "user" | "admin" }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes("/plans")) return "Investment Plans";
    if (pathname.includes("/deposit")) return "Add Deposits";
    if (pathname.includes("/withdraw")) return "Withdraw Funds";
    if (pathname.includes("/affiliates") || pathname.includes("/investors")) return "My Referrals";
    if (pathname.includes("/settings")) return "Profile Settings";
    if (pathname.includes("/wallet") || pathname.includes("/railway")) return "System Status";
    return type === "admin" ? "Admin Panel" : "User Dashboard";
  };

  const getPageSubtitle = () => {
     if (pathname.includes("/plans")) return "Choose your investment plan";
     if (pathname.includes("/deposit")) return "Add money to your account";
     if (pathname.includes("/withdraw")) return "Withdraw money to your wallet";
     if (pathname.includes("/affiliates")) return "View your referral network";
     if (pathname.includes("/settings")) return "Manage your account";
     return "Platform Online • Status: Active";
    };

  return (
    <header className="hidden lg:flex flex-col border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
      {/* Main Header Row */}
      <div className="flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-6 w-1 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.3)] bg-purple-600" />
              <h1 className="text-xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">
                {getPageTitle()}
              </h1>
            </div>
            <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.3em] ml-4 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full animate-pulse bg-purple-600" />
              {getPageSubtitle()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
             <button className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all">
                <Bell size={16} />
             </button>
             <button className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all">
                <Search size={16} />
             </button>
          </div>
      </div>
    </header>
  );
}
