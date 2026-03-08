"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ListOrdered, 
  Wallet,      
  Gift,        
  Users2,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Home", href: "/dashboard" },
    { icon: <ListOrdered size={20} />, label: "Plans", href: "/dashboard/plans" },
    // Wallet is handled separately now
    { icon: <Gift size={20} />, label: "Rewards", href: "/dashboard/rewards" },
    { icon: <Users2 size={20} />, label: "Team", href: "/dashboard/affiliates" },
  ];

  const isWalletActive = pathname.includes("/deposit") || pathname.includes("/withdraw");

  return (
    <>
      {/* --- Wallet Quick Menu (Pop-up) --- */}
      {isWalletOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setIsWalletOpen(false)}>
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-4 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in slide-in-from-bottom-5 duration-200">
            <Link 
              href="/dashboard/deposit" 
              className="flex flex-col items-center gap-1 group"
              onClick={() => setIsWalletOpen(false)}
            >
              <div className="p-3 bg-green-50 rounded-xl text-green-600 group-active:scale-95 transition-transform">
                <ArrowDownCircle size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-600">DEPOSIT</span>
            </Link>
            
            <div className="w-[1px] bg-gray-100 my-2" />

            <Link 
              href="/dashboard/withdraw" 
              className="flex flex-col items-center gap-1 group"
              onClick={() => setIsWalletOpen(false)}
            >
              <div className="p-3 bg-red-50 rounded-xl text-[#E11D48] group-active:scale-95 transition-transform">
                <ArrowUpCircle size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-600">WITHDRAW</span>
            </Link>
          </div>
        </div>
      )}

      {/* --- Main Navigation Bar --- */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-50 h-16 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-full relative">
          
          {/* First 2 Items */}
          {navItems.slice(0, 2).map((item) => (
            <NavItem key={item.label} item={item} isActive={pathname === item.href} />
          ))}

          {/* Center Wallet Button */}
          <button 
            onClick={() => setIsWalletOpen(!isWalletOpen)}
            className="flex flex-col items-center justify-center w-full h-full relative"
          >
            <div className={`mb-1 transition-all ${isWalletActive || isWalletOpen ? "text-[#E11D48] scale-110" : "text-gray-400"}`}>
              <Wallet size={22} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-tighter ${isWalletActive || isWalletOpen ? "text-[#E11D48]" : "text-gray-400"}`}>
              Wallet
            </span>
            {(isWalletActive || isWalletOpen) && <div className="absolute bottom-1 w-1 h-1 bg-[#E11D48] rounded-full" />}
          </button>

          {/* Last 2 Items */}
          {navItems.slice(2).map((item) => (
            <NavItem key={item.label} item={item} isActive={pathname === item.href} />
          ))}

        </div>
      </div>
    </>
  );
}

// Sub-component for cleaner code
function NavItem({ item, isActive }: { item: any, isActive: boolean }) {
  return (
    <Link 
      href={item.href}
      className="flex flex-col items-center justify-center w-full h-full transition-all group relative"
    >
      <div className={`mb-1 transition-transform group-active:scale-90 ${isActive ? "text-[#E11D48]" : "text-gray-400"}`}>
        {item.icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? "text-[#E11D48]" : "text-gray-400"}`}>
        {item.label}
      </span>
      {isActive && <div className="absolute bottom-1 w-1 h-1 bg-[#E11D48] rounded-full" />}
    </Link>
  );
}