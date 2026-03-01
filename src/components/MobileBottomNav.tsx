"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, ArrowDownRight, ArrowUpLeft, 
  Users2, Settings, Landmark
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: <Landmark size={20} />, label: "Plans", href: "/dashboard/plans" },
    { icon: <ArrowDownRight size={20} />, label: "Deposit", href: "/dashboard/deposit" },
    { icon: <LayoutDashboard size={20} />, label: "Home", href: "/dashboard" },
    { icon: <ArrowUpLeft size={20} />, label: "Withdraw", href: "/dashboard/withdraw" },
    { icon: <Users2 size={20} />, label: "Referrals", href: "/dashboard/affiliates" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-200 px-2 py-3 z-40 flex justify-around items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1.5 transition-all
              ${isActive ? "text-purple-600 scale-110" : "text-slate-400"}
            `}
          >
            <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-purple-600/10 shadow-sm" : ""}`}>
              {item.icon}
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-60"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
