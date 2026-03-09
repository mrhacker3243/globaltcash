"use client";
import React, { useState } from "react";
import { 
  Menu, X, LayoutDashboard, LogOut, Loader2, Zap, 
  Info, HelpCircle, Mail, Scale, LogIn 
} from "lucide-react";

// --- Custom Link Component ---
const Link = ({ href, children, className, onClick }: any) => (
  <a href={href} className={className} onClick={onClick}>{children}</a>
);

// --- Logo Components ---
const LogoIcon = ({ className }: { className?: string }) => (
  <div className={`bg-[#E11D48] rounded-xl flex items-center justify-center ${className}`}>
    <Zap size={20} className="text-white fill-white" />
  </div>
);

const BrandLogo = () => {
  return (
    <div className="flex items-center gap-3 group text-left">
      <LogoIcon className="w-10 h-10 group-hover:rotate-[360deg] transition-transform duration-700 shadow-lg shadow-rose-200" />
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black text-gray-900 italic uppercase tracking-tighter">Global</span>
        <span className="text-[9px] font-black text-[#E11D48] uppercase tracking-[0.3em]">Trust Cash</span>
      </div>
    </div>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const session = null; 
  const isLoading = false;
  const dashboardHref = "/dashboard";

  // 🟢 Smooth Scroll Logic
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <nav className="fixed top-0 z-[100] w-full bg-white/80 backdrop-blur-2xl border-b border-gray-100">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        
        <Link href="/" className="group">
          <BrandLogo />
        </Link>

        {/* Desktop Navigation - Icons added to all pages */}
        <div className="hidden lg:flex items-center space-x-8 text-[10px] font-black uppercase tracking-[0.15em]">
          
          <Link 
            href="#plans" 
            onClick={(e: any) => handleScroll(e, "plans")}
            className="text-gray-500 hover:text-[#E11D48] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Zap size={12} className="text-[#E11D48]" /> Plans
          </Link>
          
          <Link href="/about" className="text-gray-500 hover:text-[#E11D48] transition-colors flex items-center gap-1.5">
            <Info size={12} className="text-[#E11D48]" /> About Us
          </Link>

          <Link href="/faq" className="text-gray-500 hover:text-[#E11D48] transition-colors flex items-center gap-1.5">
            <HelpCircle size={12} className="text-[#E11D48]" /> FAQ
          </Link>

          <Link href="/contact" className="text-gray-500 hover:text-[#E11D48] transition-colors flex items-center gap-1.5">
            <Mail size={12} className="text-[#E11D48]" /> Contact
          </Link>

          <Link href="/terms" className="text-gray-500 hover:text-[#E11D48] transition-colors flex items-center gap-1.5">
            <Scale size={12} className="text-[#E11D48]" /> Terms
          </Link>
          
          <div className="h-4 w-px bg-gray-200" />

          {isLoading ? (
            <Loader2 className="animate-spin text-[#E11D48]" size={18} />
          ) : session ? (
            <div className="flex items-center gap-6">
              <Link href={dashboardHref} className="flex items-center gap-2 text-white bg-[#E11D48] px-6 py-2.5 rounded-2xl shadow-lg shadow-rose-200 hover:scale-105 transition-all">
                <LayoutDashboard size={14} /> Terminal
              </Link>
              <button className="text-gray-400 hover:text-red-600 transition flex items-center gap-2">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            /* 🟢 Red-Rose Theme Login Button */
            <Link href="/login" className="bg-[#E11D48] px-10 py-3 rounded-2xl text-white font-black hover:shadow-xl hover:shadow-rose-400/40 transition-all active:scale-95 flex items-center gap-2 uppercase shadow-lg shadow-rose-200">
              <LogIn size={14} /> Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-3">
          <button className="text-gray-900 p-2.5 bg-gray-50 border border-gray-100 rounded-2xl active:scale-90 transition-all" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - All Pages with Icons */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-8 flex flex-col space-y-6 animate-in slide-in-from-top duration-300 shadow-2xl">
          <Link href="#plans" onClick={(e: any) => handleScroll(e, "plans")} className="text-gray-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <Zap size={16} className="text-[#E11D48]" /> Investment Plans
          </Link>
          <Link href="/about" className="text-gray-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <Info size={16} className="text-[#E11D48]" /> About Our Company
          </Link>
          <Link href="/faq" className="text-gray-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <HelpCircle size={16} className="text-[#E11D48]" /> Help & FAQ
          </Link>
          <Link href="/contact" className="text-gray-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <Mail size={16} className="text-[#E11D48]" /> Contact Support
          </Link>
          <Link href="/terms" className="text-gray-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <Scale size={16} className="text-[#E11D48]" /> Terms & Conditions
          </Link>
          
          <div className="h-px bg-gray-100" />
          
          <Link href="/login" className="bg-[#E11D48] px-10 py-3 rounded-2xl text-white font-black hover:shadow-xl hover:shadow-rose-400/40 transition-all active:scale-95 flex items-center gap-2 uppercase shadow-lg shadow-rose-200">
              <LogIn size={14} /> Login Account
            </Link>
        </div>
      )}
    </nav>
  );
}