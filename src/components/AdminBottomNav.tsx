"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, ArrowDownCircle, ArrowUpCircle, Settings
} from "lucide-react";

export default function AdminBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: <LayoutDashboard size={22} />, label: "Home", href: "/admin/dashboard" },
    { icon: <Users size={22} />, label: "Users", href: "/admin/dashboard/investors" },
    { icon: <ArrowDownCircle size={22} />, label: "Deposits", href: "/admin/dashboard/deposits" },
    { icon: <ArrowUpCircle size={22} />, label: "Withdrawals", href: "/admin/dashboard/withdrawals" },
    { icon: <Settings size={22} />, label: "Settings", href: "/admin/dashboard/settings" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#FFFDF5] border-t border-rose-100 px-2 py-4 z-40 flex justify-around items-center shadow-[0_-10px_30px_rgba(225,29,72,0.05)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 transition-all relative"
          >
            {/* Icon Color: Rose Red on Buttery White */}
            <div className={`p-2 rounded-2xl transition-all ${isActive ? "bg-[#E11D48] text-white shadow-lg shadow-rose-200" : "text-slate-400"}`}>
              {item.icon}
            </div>
            
            {/* Text Label */}
            <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isActive ? "text-[#E11D48]" : "text-slate-400"}`}>
              {item.label}
            </span>

            {/* Simple Dot for Active State */}
            {isActive && (
              <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[#E11D48] rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}