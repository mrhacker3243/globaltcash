"use client";
import React from "react";
import Link from "next/link";
import { Mail, ChevronRight, Zap, Twitter, Linkedin } from "lucide-react";
import { usePathname } from "next/navigation";

const FooterLogo = () => (
  <div className="flex items-center gap-3">
    <div className="bg-[#E11D48] p-2 rounded-xl shadow-lg shadow-rose-200">
      <Zap size={20} className="text-white fill-white" />
    </div>
    <div className="flex flex-col leading-none">
      <span className="text-xl font-black text-gray-900 italic uppercase tracking-tighter">Global</span>
      <span className="text-[9px] font-black text-[#E11D48] uppercase tracking-[0.3em]">Trust Cash</span>
    </div>
  </div>
);

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12 overflow-hidden">
      {/* 🟢 Added px-8 to the container to prevent sticking to edges */}
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-12 mb-24">
          
          {/* Brand Info - Spans full width on mobile */}
          <div className="col-span-2 lg:col-span-2 space-y-8">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <FooterLogo />
            </Link>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed font-bold uppercase tracking-tight">
              Empowering global investors with state-of-the-art liquidity protocols. 
              Secure, transparent, and built for the future of finance.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E11D48] hover:bg-rose-50 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E11D48] hover:bg-rose-50 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="mailto:support@globalcapital.com" className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E11D48] hover:bg-rose-50 transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Company Section - Left Aligned */}
          <div className="space-y-6 mt-8 lg:mt-0">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 border-b border-gray-50 pb-4">
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#E11D48] transition-all flex items-center group gap-0 hover:gap-2">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#E11D48]" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#E11D48] transition-all flex items-center group gap-0 hover:gap-2">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#E11D48]" />
                  Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#E11D48] transition-all flex items-center group gap-0 hover:gap-2">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#E11D48]" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance Section - Right Aligned on mobile */}
          <div className="space-y-6 mt-8 lg:mt-0 text-right lg:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 border-b border-gray-50 pb-4">
              Compliance
            </h4>
            <ul className="space-y-4 inline-block lg:block">
              <li>
                <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#E11D48] transition-all flex items-center lg:justify-start justify-end group gap-0 hover:gap-2">
                  Terms
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-[#E11D48]" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#E11D48] transition-all flex items-center lg:justify-start justify-end group gap-0 hover:gap-2">
                  Privacy
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-[#E11D48]" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <span>© {currentYear} Global Capital Network</span>
          </div>
          <div className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400 italic">
            Financial Sovereignty
          </div>
        </div>
      </div>
    </footer>
  );
}