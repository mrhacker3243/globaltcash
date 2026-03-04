"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ListOrdered, 
  Wallet,      // Deposit + Withdraw combine
  Gift,        // Rewards icon
  Users2 
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Home", href: "/dashboard" },
    { icon: <ListOrdered size={20} />, label: "Plans", href: "/dashboard/plans" },
    // Deposit aur Withdraw ko ek Wallet button mein rakha hai (App-style)
    { icon: <Wallet size={20} />, label: "Wallet", href: "/dashboard/deposit" }, 
    { icon: <Gift size={20} />, label: "Rewards", href: "/dashboard/rewards" },
    { icon: <Users2 size={20} />, label: "Team", href: "/dashboard/affiliates" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          // Logic to handle active state for wallet (both deposit/withdraw)
          const isActive = item.label === "Wallet" 
            ? (pathname.includes("/deposit") || pathname.includes("/withdraw"))
            : pathname === item.href;
          
          return (
            <Link 
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full transition-all group"
            >
              <div className={`mb-1 transition-transform group-active:scale-90 ${isActive ? "text-[#E11D48]" : "text-gray-400"}`}>
                {item.icon}
              </div>
              
              <span className={`text-[9px] font-black uppercase tracking-tighter
                ${isActive ? "text-[#E11D48]" : "text-gray-400"}
              `}>
                {item.label}
              </span>

              {/* Active Indicator dot */}
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-[#E11D48] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}