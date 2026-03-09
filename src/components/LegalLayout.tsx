import React from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function LegalLayout({ title, subtitle, children }: { title: string, subtitle: string, children: React.ReactNode }) {
  return (
    <div className="bg-[#F9FAFB] min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#E11D48] mb-12 transition-all group">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Terminal
        </Link>
        
        <div className="bg-white p-8 xs:p-16 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <h1 className="text-[12rem] font-black italic leading-none uppercase">{title.charAt(0)}</h1>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl xs:text-6xl font-black uppercase italic tracking-tighter text-gray-900 mb-4 leading-none">
              {title} <span className="text-[#E11D48]">.</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-16 italic border-b border-gray-50 pb-8">
              {subtitle}
            </p>
            
            <div className="prose prose-sm max-w-none">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}