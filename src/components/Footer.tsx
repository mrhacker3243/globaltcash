"use client";
import React from "react";
import Link from "next/link";
import { Mail, Shield, Globe, Twitter, Linkedin, ChevronRight, Zap, MessageCircle, Heart } from "lucide-react";
import { usePathname } from "next/navigation";

// Logo Component inside Footer to keep it consistent
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

  // Hide Footer in Dashboard routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { name: "Investment Plans", href: "#plans" },
        { name: "Profit Calculator", href: "#calculator" },
        { name: "About Company", href: "#about" },
        { name: "Active Nodes", href: "#status" },
      ]
    },
    {
      title: "Legal & Safety",
      links: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Risk Disclosure", href: "/risk" },
        { name: "Anti-Fraud Policy", href: "/compliance" },
      ]
    },
    {
      title: "Assistance",
      links: [
        { name: "Live Support", href: "#support" },
        { name: "Knowledge Base", href: "/faq" },
        { name: "Contact Mail", href: "mailto:support@globalcapital.com" },
        { name: "Community Telegram", href: "#" },
      ]
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <FooterLogo />
            </Link>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed font-bold uppercase tracking-tight">
              Empowering global investors with state-of-the-art liquidity protocols. 
              Secure, transparent, and built for the future of finance.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E11D48] hover:bg-rose-50 hover:border-rose-100 transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E11D48] hover:bg-rose-50 hover:border-rose-100 transition-all">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E11D48] hover:bg-rose-50 hover:border-rose-100 transition-all">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E11D48] hover:bg-rose-50 hover:border-rose-100 transition-all">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Link Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 border-b border-gray-50 pb-4">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#E11D48] transition-all flex items-center group gap-0 hover:gap-2">
                      <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#E11D48]" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <span>© {currentYear} Global Capital Network</span>
            <div className="flex items-center gap-2 text-[#E11D48] bg-rose-50 px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#E11D48] rounded-full animate-pulse" />
              Mainnet Operations Active
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
              <Shield size={14} className="text-[#E11D48]" />
              <span className="text-[9px] font-black uppercase text-gray-500 tracking-tighter">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
              <Globe size={14} className="text-[#E11D48]" />
              <span className="text-[9px] font-black uppercase text-gray-500 tracking-tighter">Tier-4 Data Center</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-600 flex items-center justify-center gap-2">
            Made with <Heart size={10} className="fill-[#E11D48] text-[#E11D48]" /> for the future of Wealth
          </p>
        </div>
      </div>
    </footer>
  );
}