"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Wallet, ArrowDownRight, ArrowUpLeft, 
  Users2, Settings, LogOut, Menu, X, Landmark, ArrowLeft
} from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function UserSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/dashboard" },
    { icon: <Landmark size={18} />, label: "Investment Plans", href: "/dashboard/plans" },
    { icon: <ArrowDownRight size={18} />, label: "Deposit", href: "/dashboard/deposit" },
    { icon: <ArrowUpLeft size={18} />, label: "Withdraw", href: "/dashboard/withdraw" },
    { icon: <Users2 size={18} />, label: "Referrals", href: "/dashboard/affiliates" },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-slate-950 border-b border-white/5 px-6 py-4 z-[50] flex justify-between items-center shadow-2xl">
        <Link href="/dashboard">
          <BrandLogo size="sm" type="user" className="brightness-125" />
        </Link>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border-r border-white/10 pr-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_#a855f7]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status: Online</span>
            </div>
           <button 
             onClick={() => setIsOpen(!isOpen)}
             className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/10 text-purple-400 rounded-lg border border-purple-500/20 active:scale-90 transition-all shadow-sm"
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

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 left-0 h-full z-[60] w-64 bg-slate-950 border-r border-white/5 transition-transform duration-500 ease-in-out shadow-[10px_0_30px_rgba(0,0,0,0.5)]
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        {/* Decorative Background Aura */}
        <div className="absolute top-0 left-0 w-full h-64 bg-purple-600/5 blur-[100px] pointer-events-none" />

        <div className="p-8 relative z-10">
          <Link href="/dashboard" className="group" onClick={() => setIsOpen(false)}>
            <BrandLogo size="md" type="user" className="brightness-125" />
          </Link>
        </div>

        <nav className="mt-4 px-4 space-y-2 relative z-10">
          <div className="px-4 mb-4">
             <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Menu</p>
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
                    ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] after:content-[''] after:absolute after:right-0 after:w-1 after:h-6 after:bg-white after:rounded-full" 
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

        {/* Support Section */}
        <div className="mt-8 px-8 relative z-10">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/10">
               <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1">Support</p>
               <p className="text-[8px] text-slate-500 font-medium">Need assistance? Contact our team.</p>
            </div>
        </div>

        <div className="absolute bottom-8 left-0 w-full px-4 text-center z-10">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-2xl text-slate-400 bg-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all font-black text-[11px] uppercase tracking-widest border border-white/5"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}