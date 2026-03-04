"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, Users, ArrowDownCircle, ArrowUpCircle, 
  Settings, LogOut, Menu, X, CreditCard, Wallet
} from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/admin/dashboard" },
    { icon: <Users size={18} />, label: "User List", href: "/admin/dashboard/investors" },
    { icon: <ArrowDownCircle size={18} />, label: "Deposits", href: "/admin/dashboard/deposits" },
    { icon: <ArrowUpCircle size={18} />, label: "Withdrawals", href: "/admin/dashboard/withdrawals" },
    { icon: <CreditCard size={18} />, label: "Plan Manager", href: "/admin/dashboard/plans" },
    { icon: <Wallet size={18} />, label: "My Wallet", href: "/admin/dashboard/wallet" },
    { icon: <Settings size={18} />, label: "Site Settings", href: "/admin/dashboard/settings" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-slate-900 border-b border-slate-800 px-6 py-4 z-[50] flex justify-between items-center">
        <Link href="/admin/dashboard">
          <BrandLogo size="sm" type="admin" />
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-slate-800 text-white rounded-lg active:scale-95 transition-all"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-[60] w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        
        <div className="p-8">
          <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
            <BrandLogo size="md" type="admin" />
          </Link>
        </div>

        <nav className="mt-2 px-4 space-y-1">
          <p className="px-4 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Menu</p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-[12px] uppercase tracking-wider
                  ${isActive 
                    ? "bg-[#E11D48] text-white shadow-lg shadow-rose-900/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"}
                `}
              >
                <span className={isActive ? "text-white" : "text-slate-500"}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-8 left-0 w-full px-4">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-black text-[11px] uppercase"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}