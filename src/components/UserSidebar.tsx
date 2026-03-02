"use client";
import React, { useState } from "react";
import { 
  LayoutDashboard, Wallet, ArrowDownRight, ArrowUpLeft, 
  Users2, Settings, LogOut, Menu, X, Landmark, ArrowLeft 
} from "lucide-react";

// Mocking Next.js and Next-Auth for preview stability
const Link = ({ href, children, className, onClick }: any) => (
  <a href={href} className={className} onClick={onClick}>{children}</a>
);
const usePathname = () => "/dashboard";
const signOut = ({ callbackUrl }: any) => console.log("Signing out to", callbackUrl);

// Inline BrandLogo component (matching the Toxic theme)
const LogoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="40" fill="#22c55e" fillOpacity="0.1" />
    <path d="M30 20L50 45L70 20M30 80L50 55L70 80" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="50" cy="50" r="8" fill="#22c55e" />
  </svg>
);

const BrandLogo = ({ size = "md", type = "default", className = "" }: any) => {
  const sizes: any = {
    sm: { logo: "w-8 h-8", title: "text-lg", sub: "text-[8px]" },
    md: { logo: "w-9 h-9", title: "text-xl", sub: "text-[9px]" },
  };
  const s = sizes[size] || sizes.md;
  return (
    <div className={`flex items-center gap-3 ${className} group`}>
      <LogoIcon className={`${s.logo} group-hover:rotate-12 transition-transform duration-300`} />
      <div className="flex flex-col leading-none">
        <span className={`${s.title} font-black text-[#22c55e] italic uppercase drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]`}>Global</span>
        <div className="flex items-center gap-2">
           <span className={`${s.sub} font-bold text-[#facc15] uppercase tracking-[0.4em]`}>Trust Cash</span>
           {type === "user" && <span className="text-[7px] bg-[#22c55e] text-black px-1.5 py-0.5 rounded-full font-black uppercase">User</span>}
        </div>
      </div>
    </div>
  );
};

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
      {/* Mobile Top Header (Toxic Styled) */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-[#020617] border-b border-white/5 px-6 py-4 z-[50] flex justify-between items-center shadow-2xl">
        <Link href="/dashboard">
          <BrandLogo size="sm" type="user" />
        </Link>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border-r border-white/10 pr-4">
              <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live</span>
            </div>
           <button 
             onClick={() => setIsOpen(!isOpen)}
             className="flex items-center gap-2 px-3 py-1.5 bg-[#22c55e]/10 text-[#22c55e] rounded-xl border border-[#22c55e]/20 active:scale-95 transition-all"
           >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
              <span className="text-[10px] font-black uppercase tracking-tighter">Terminal</span>
           </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[55] lg:hidden animate-in fade-in duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 left-0 h-full z-[60] w-64 bg-[#020617] border-r border-white/5 transition-transform duration-500 ease-in-out shadow-[20px_0_40px_rgba(0,0,0,0.8)]
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        {/* Decorative Green Aura */}
        <div className="absolute top-0 left-0 w-full h-64 bg-[#22c55e]/5 blur-[100px] pointer-events-none" />

        <div className="p-8 relative z-10">
          <Link href="/dashboard" className="group" onClick={() => setIsOpen(false)}>
            <BrandLogo size="md" type="user" />
          </Link>
        </div>

        <nav className="mt-4 px-4 space-y-2 relative z-10">
          <div className="px-4 mb-4">
             <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Main Terminal</p>
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
                    ? "bg-[#22c55e] text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] after:content-[''] after:absolute after:right-3 after:w-1 after:h-4 after:bg-black after:rounded-full" 
                    : "text-slate-500 hover:bg-white/5 hover:text-[#22c55e]"}
                `}
              >
                <span className={`${isActive ? "text-black" : "text-[#22c55e] group-hover:scale-110 transition-transform"}`}>
                   {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Support Section */}
        <div className="mt-8 px-8 relative z-10">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#22c55e]/10 to-transparent border border-[#22c55e]/10">
               <p className="text-[9px] font-black text-[#22c55e] uppercase tracking-widest mb-1">Encrypted Support</p>
               <p className="text-[8px] text-slate-500 font-medium">Contact technical desk for assistance.</p>
            </div>
        </div>

        <div className="absolute bottom-8 left-0 w-full px-4 text-center z-10">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-2xl text-slate-500 bg-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all font-black text-[11px] uppercase tracking-widest border border-white/5"
          >
            <LogOut size={16} /> Disconnect System
          </button>
        </div>
      </aside>
    </>
  );
}