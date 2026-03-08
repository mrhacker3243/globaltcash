"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; 
import { 
  LayoutDashboard, Wallet, ArrowDownRight, ArrowUpLeft, 
  Users2, Settings, LogOut, Menu, X, Landmark, ShieldCheck,
  Gift // 👈 Naya icon rewards ke liye
} from "lucide-react";

// Updated BrandLogo (Rose Red Theme)
const LogoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="45" fill="#E11D48" fillOpacity="0.1" />
    <path d="M30 25L50 50L70 25M30 75L50 50L70 75" stroke="#E11D48" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="50" cy="50" r="10" fill="#E11D48" className="animate-pulse" />
  </svg>
);

const BrandLogo = ({ size = "md", type = "default", className = "" }: any) => {
  const sizes: any = {
    sm: { logo: "w-8 h-8", title: "text-lg", sub: "text-[8px]" },
    md: { logo: "w-10 h-10", title: "text-2xl", sub: "text-[10px]" },
  };
  const s = sizes[size] || sizes.md;
  return (
    <div className={`flex items-center gap-3 ${className} group`}>
      <LogoIcon className={`${s.logo} group-hover:scale-110 transition-transform duration-500`} />
      <div className="flex flex-col leading-none">
        <span className={`${s.title} font-black text-[#111827] italic uppercase tracking-tighter`}>Global</span>
        <div className="flex items-center gap-2">
           <span className={`${s.sub} font-bold text-[#E11D48] uppercase tracking-[0.4em]`}>Trust Cash</span>
           {type === "user" && <span className="text-[7px] bg-[#111827] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Pro</span>}
        </div>
      </div>
    </div>
  );
};

export default function UserSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [rewardsCount, setRewardsCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    fetchRewardsCount();
  }, []);

  const fetchRewardsCount = async () => {
    try {
      const res = await fetch("/api/user/rewards");
      const data = await res.json();
      if (data.rewards) {
        setRewardsCount(data.rewards.length);
      }
    } catch (err) {
      console.error("Failed to fetch rewards count");
    }
  };

  // ✅ Rewards section add kar diya yahan
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/dashboard" },
    { icon: <Landmark size={20} />, label: "Invest Plans", href: "/dashboard/plans" },
    { 
      icon: <Gift size={20} />, 
      label: "My Rewards", 
      href: "/dashboard/rewards",
      badge: rewardsCount > 0 ? rewardsCount : null
    }, // 🎁 Naya Link with badge
    { icon: <ArrowDownRight size={20} />, label: "Deposit", href: "/dashboard/deposit" },
    { icon: <ArrowUpLeft size={20} />, label: "Withdraw", href: "/dashboard/withdraw" },
    { icon: <Users2 size={20} />, label: "Referrals", href: "/dashboard/affiliates" },
    { icon: <Settings size={20} />, label: "Settings", href: "/dashboard/settings" },
  ];

  const handleTerminate = async () => {
    await signOut({ redirect: false });
    window.location.replace("/login");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-100 px-6 py-4 z-[50] flex justify-between items-center shadow-sm">
        <Link href="/dashboard"><BrandLogo size="sm" type="user" /></Link>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2.5 bg-gray-50 text-[#111827] rounded-2xl border border-gray-100 active:scale-95 transition-all">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-[#111827]/40 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-[60] w-72 bg-white border-r border-gray-100 transition-transform duration-500 ease-in-out shadow-2xl lg:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-10"><Link href="/dashboard" onClick={() => setIsOpen(false)}><BrandLogo size="md" type="user" /></Link></div>
        
        <nav className="mt-2 px-6 space-y-1.5 h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-6"><p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] leading-none">Security Terminal</p></div>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label} 
                href={item.href} 
                onClick={() => setIsOpen(false)} 
                className={`group flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all font-black text-[11px] uppercase tracking-widest relative ${isActive ? "bg-[#111827] text-white shadow-xl shadow-black/10" : "text-gray-500 hover:bg-gray-50 hover:text-[#E11D48]"}`}
              >
                <span className={`${isActive ? "text-[#E11D48]" : "text-gray-400 group-hover:text-[#E11D48] transition-colors"}`}>
                  {item.icon}
                </span>
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-rose-500 text-white text-[8px] font-black px-2 py-1 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Progress Bar Security */}
        <div className="px-10 mt-4">
           <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck size={12} className="text-emerald-600" />
                 <span className="text-[8px] font-black text-emerald-700 uppercase">System Secure</span>
              </div>
              <div className="w-full h-1 bg-emerald-200 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-600 w-full animate-pulse" />
              </div>
           </div>
        </div>

        {/* Logout Section */}
        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-white border-t border-gray-50">
          <button 
            onClick={handleTerminate} 
            className="flex items-center justify-center gap-3 w-full px-5 py-5 rounded-[1.5rem] text-gray-400 bg-gray-50 hover:bg-rose-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-gray-100 shadow-sm group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Terminate Session
          </button>
        </div>
      </aside>
    </>
  );
}