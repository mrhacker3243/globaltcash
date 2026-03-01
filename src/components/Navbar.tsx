"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, LogOut, Loader2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  // Hide Navbar in Dashboard routes to prevent "Double Header" confusion
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  const dashboardHref = (session?.user as any)?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center justify-between px-4 py-4 md:px-8 max-w-7xl mx-auto">
        <Link href="/" className="group">
          <BrandLogo size="md" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-wider">
          <Link href="#plans" className="text-slate-400 hover:text-slate-900 transition">Plans</Link>
          <Link href="#features" className="text-slate-400 hover:text-slate-900 transition">Features</Link>
          
          {isLoading ? (
            <Loader2 className="animate-spin text-zinc-500" size={18} />
          ) : session ? (
            <div className="flex items-center gap-6">
              <Link href={dashboardHref} className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition bg-purple-600/5 px-4 py-2 rounded-xl border border-purple-600/10">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button 
                onClick={() => signOut()}
                className="text-slate-400 hover:text-red-500 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                Exit
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="bg-purple-600 px-6 py-2.5 rounded-lg text-white hover:bg-purple-700 transition">
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle & Quick Actions */}
        <div className="flex md:hidden items-center gap-3">
          {/* Unauthenticated Quick Action Removed */}
          {status === "authenticated" && (
            <Link 
              href={dashboardHref} 
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-[10px] font-black uppercase tracking-tighter active:scale-95 transition-all shadow-lg shadow-purple-600/20"
            >
              Portal
            </Link>
          )}
          <button className="text-slate-900 p-2 bg-slate-50 border border-slate-200 rounded-lg active:scale-90 transition-all shadow-sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-5 flex flex-col space-y-4 animate-in slide-in-from-top duration-200 shadow-xl">
          <Link href="#plans" onClick={() => setIsOpen(false)} className="text-slate-600 text-base font-medium">Investment Plans</Link>
          <Link href="#features" onClick={() => setIsOpen(false)} className="text-slate-600 text-base font-medium">Platform Features</Link>
          <div className="h-px bg-zinc-900" />
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin text-purple-600" size={24} />
            </div>
          ) : session ? (
            <div className="flex flex-col gap-3">
              <Link 
                href={dashboardHref} 
                onClick={() => setIsOpen(false)}
                className="bg-purple-600/10 text-purple-600 text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={18} /> Dashboard Terminal
              </Link>
              <button 
                onClick={() => { signOut(); setIsOpen(false); }}
                className="bg-red-50 text-red-600 text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-red-100"
              >
                <LogOut size={18} /> Exit System
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)} className="bg-purple-600 text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs text-white">
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
