"use client";
import React from "react";
import Link from "next/link";
import { Mail, Shield, Globe, Github, Twitter, Linkedin, ChevronRight } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer in Dashboard routes for a cleaner admin/user experience
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Investment Plans", href: "#plans" },
        { name: "Global Investors", href: "#features" },
        { name: "Platform Security", href: "#security" },
        { name: "System Status", href: "#status" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Intelligence", href: "/about" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Access", href: "/terms" },
        { name: "Compliance", href: "/compliance" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "API Reference", href: "/api-docs" },
        { name: "Community Hub", href: "/community" },
        { name: "Partnership", href: "/partners" },
      ]
    }
  ];

  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block group">
              <BrandLogo size="lg" />
            </Link>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-medium">
              The world&apos;s most advanced investment platform. Redefining digital earning through secure and stable infrastructure.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm">
                <Github size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Link Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-slate-600 hover:text-purple-600 transition-colors flex items-center group gap-1">
                      <ChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>© {currentYear} Exotic Cash Network</span>
            <span className="hidden md:block w-1 h-1 bg-slate-200 rounded-full" />
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Mainnet Active
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
              <Shield size={12} className="text-purple-600" />
              <span>SSL Secure Connection</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
              <Globe size={12} className="text-purple-600" />
              <span>Global Availability</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
