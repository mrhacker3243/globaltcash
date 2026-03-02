"use client";
import React, { useState } from "react";
import { Menu, X, LayoutDashboard, LogOut, Loader2 } from "lucide-react";

// Mocking Next.js and Next-Auth components/hooks for preview environment
// Real app mein ye original imports hi rahenge
const Link = ({ href, children, className, onClick }: any) => (
  <a href={href} className={className} onClick={onClick}>{children}</a>
);

const usePathname = () => "/"; // Mock pathname
const useSession = () => ({ data: null, status: "unauthenticated" }); // Mock session
const signOut = () => console.log("Signing out...");

// Inline BrandLogo and LogoIcon to prevent resolution errors
const LogoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="40" fill="#22c55e" fillOpacity="0.1" />
    <path d="M30 20L50 45L70 20M30 80L50 55L70 80" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="50" cy="50" r="8" fill="#22c55e" />
  </svg>
);

const BrandLogo = ({ size = "md" }: { size?: string }) => {
  const sizes: any = {
    sm: { logo: "w-8 h-8", title: "text-lg", sub: "text-[8px]" },
    md: { logo: "w-9 h-9", title: "text-xl", sub: "text-[9px]" },
    lg: { logo: "w-11 h-11", title: "text-2xl", sub: "text-[11px]" }
  };
  const s = sizes[size] || sizes.md;
  return (
    <div className="flex items-center gap-3 group">
      <LogoIcon className={`${s.logo} group-hover:rotate-12 transition-transform duration-300`} />
      <div className="flex flex-col leading-none">
        <span className={`${s.title} font-black text-[#22c55e] italic uppercase drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]`}>Global</span>
        <span className={`${s.sub} font-bold text-[#facc15] uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]`}>Trust Cash</span>
      </div>
    </div>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  // Hide Navbar in Dashboard routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  const dashboardHref = (session?.user as any)?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-4 md:px-8 max-w-7xl mx-auto">
        <Link href="/" className="group">
          <BrandLogo size="md" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-[11px] font-black uppercase tracking-[0.2em]">
          <Link href="#plans" className="text-slate-400 hover:text-[#22c55e] transition-colors">Plans</Link>
          <Link href="#features" className="text-slate-400 hover:text-[#22c55e] transition-colors">Features</Link>
          
          {isLoading ? (
            <Loader2 className="animate-spin text-[#22c55e]" size={18} />
          ) : session ? (
            <div className="flex items-center gap-6">
              <Link 
                href={dashboardHref} 
                className="flex items-center gap-2 text-[#22c55e] hover:brightness-125 transition bg-[#22c55e]/10 px-4 py-2 rounded-xl border border-[#22c55e]/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
              >
                <LayoutDashboard size={16} />
                Terminal
              </Link>
              <button 
                onClick={() => signOut()}
                className="text-slate-500 hover:text-red-500 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                Exit
              </button>
            </div>
          ) : (
            <>
              <Link 
                href="/login" 
                className="bg-[#22c55e] px-8 py-2.5 rounded-xl text-black font-black hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all active:scale-95"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          {status === "authenticated" && (
            <Link 
              href={dashboardHref} 
              className="px-4 py-2 bg-[#22c55e] text-black rounded-xl text-[10px] font-black uppercase tracking-tighter active:scale-95 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            >
              Portal
            </Link>
          )}
          <button 
            className="text-white p-2 bg-white/5 border border-white/10 rounded-xl active:scale-90 transition-all" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0f172a] border-b border-white/10 p-6 flex flex-col space-y-4 animate-in slide-in-from-top duration-300 shadow-2xl">
          <Link href="#plans" onClick={() => setIsOpen(false)} className="text-slate-300 text-sm font-bold uppercase tracking-widest">Investment Plans</Link>
          <Link href="#features" onClick={() => setIsOpen(false)} className="text-slate-300 text-sm font-bold uppercase tracking-widest">Platform Features</Link>
          <div className="h-px bg-white/5" />
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin text-[#22c55e]" size={24} />
            </div>
          ) : session ? (
            <div className="flex flex-col gap-3">
              <Link 
                href={dashboardHref} 
                onClick={() => setIsOpen(false)}
                className="bg-[#22c55e]/10 text-[#22c55e] text-center py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 border border-[#22c55e]/20"
              >
                <LayoutDashboard size={18} /> Access Terminal
              </Link>
              <button 
                onClick={() => { signOut(); setIsOpen(false); }}
                className="bg-red-500/5 text-red-500 text-center py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 border border-red-500/10"
              >
                <LogOut size={18} /> Disconnect
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)} 
              className="bg-[#22c55e] text-center py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-black shadow-[0_0_20px_rgba(34,197,94,0.2)]"
            >
              Authorized Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}