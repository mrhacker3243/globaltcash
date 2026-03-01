"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, Users, ArrowDownCircle, ArrowUpCircle, 
  Settings, LogOut, Menu, X, CreditCard, Database, Wallet, ArrowLeft
} from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "Overview", href: "/admin/dashboard" },
    { icon: <Users size={18} />, label: "Users", href: "/admin/dashboard/investors" },
    { icon: <ArrowDownCircle size={18} />, label: "Deposits", href: "/admin/dashboard/deposits" },
    { icon: <ArrowUpCircle size={18} />, label: "Withdrawals", href: "/admin/dashboard/withdrawals" },
    { icon: <CreditCard size={18} />, label: "Plans", href: "/admin/dashboard/plans" },
    { icon: <Wallet size={18} />, label: "Admin Wallet", href: "/admin/dashboard/wallet" },
    { icon: <Settings size={18} />, label: "Settings", href: "/admin/dashboard/settings" },
  ];

  return (
    <>
      {/* Mobile Top Header (Tactical Dark) */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-slate-950 border-b border-white/5 px-6 py-4 z-[50] flex justify-between items-center shadow-2xl">
        <Link href="/admin/dashboard">
          <BrandLogo size="sm" type="admin" className="brightness-125" />
        </Link>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsOpen(!isOpen)}
             className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/10 text-purple-400 rounded-lg border border-purple-500/20 active:scale-90 transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]"
           >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
              <span className="text-[10px] font-black uppercase tracking-tighter text-purple-200">Menu</span>
           </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel (Industrial Dark) */}
      <aside className={`
        fixed top-0 left-0 h-full z-[60] w-64 bg-slate-950 border-r border-white/5 transition-transform duration-500 ease-in-out shadow-[10px_0_30px_rgba(0,0,0,0.5)]
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        {/* Top Decorative Hub */}
        <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-purple-600/10 to-transparent blur-[80px] pointer-events-none" />

        <div className="p-8 relative z-10">
          <Link href="/admin/dashboard" className="group" onClick={() => setIsOpen(false)}>
            <BrandLogo size="md" type="admin" className="brightness-125" />
          </Link>
        </div>

        <nav className="mt-4 px-4 space-y-2 relative z-10">
          <div className="px-4 mb-4">
             <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Management</p>
          </div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-widest relative overflow-hidden
                  ${isActive 
                    ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] after:content-[''] after:absolute after:right-0 after:w-1 after:h-6 after:bg-white after:rounded-full" 
                    : "text-slate-500 hover:bg-white/5 hover:text-white"}
                `}
              >
                <span className={`${isActive ? "text-white" : "text-purple-500 group-hover:scale-110 transition-transform"}`}>
                   {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Intelligence Status Matrix */}
        <div className="mt-10 px-8 relative z-10">
            <div className="p-5 rounded-2xl bg-[#0f1115] border border-white/5 shadow-inner">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">System Status</span>
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                     <span className="text-[7px] font-bold text-emerald-500 uppercase">Live</span>
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-purple-600 w-[85%] animate-pulse" />
                  </div>
                  <p className="text-[7px] text-slate-600 uppercase font-black tracking-tighter">Database Load: 12%</p>
               </div>
            </div>
        </div>

        <div className="absolute bottom-8 left-0 w-full px-4 text-center z-10">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-2xl text-slate-400 bg-white/5 border border-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all font-black text-[11px] uppercase tracking-widest"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}