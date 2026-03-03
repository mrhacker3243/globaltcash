"use client";
import React, { useState, useEffect } from "react";
import { 
  ArrowRight, ShieldCheck, Zap, Coins, BarChart3, Users, 
  ChevronRight, Globe, CheckCircle2, MessageSquare, TrendingUp, 
  Star, Calculator, Lock, ArrowUpRight, Cpu, ShieldAlert, 
  ChevronDown, Activity, Layers, Bell, Smartphone
} from "lucide-react";

// --- Components & Data ---

const Link = ({ href, children, className }: any) => (
  <a href={href} className={className}>{children}</a>
);

const CONSTANT_PLANS = [
  { name: "Basic", profit: 1.5, range: "Rs. 5000 - 10000", min: 5000, max: 10000, contract: "1 Month", popular: false },
  { name: "Basic Pro", profit: 2.5, range: "Rs. 11000 - 20000", min: 11000, max: 20000, contract: "2 Months", popular: false },
  { name: "Supreme Basic", profit: 3.5, range: "Rs. 25000 - 50000", min: 25000, max: 50000, contract: "4 Months", popular: false },
  { name: "Supreme Edge", profit: 5.0, range: "Rs. 55000 - 100000", min: 55000, max: 100000, contract: "6 Months", popular: true },
  { name: "Supreme Pro", profit: 7.5, range: "Rs. 110000 - 500000", min: 110000, max: 500000, contract: "12 Months", popular: false },
  { name: "Supreme", profit: 10.0, range: "Rs. 550000 - 2000000", min: 550000, max: 2000000, contract: "15 Months", popular: false },
];

const LIVE_ACTIVITY = [
  { name: "Zeeshan Akram", action: "Injected", amount: "Rs. 55,000", time: "2 mins ago" },
  { name: "Hamza Malik", action: "Withdrew", amount: "Rs. 12,400", time: "5 mins ago" },
  { name: "Mian Sahab", action: "Injected", amount: "Rs. 150,000", time: "Just now" },
  { name: "Chaudhary Ali", action: "Injected", amount: "Rs. 10,000", time: "12 mins ago" },
  { name: "Sajid Khan", action: "Withdrew", amount: "Rs. 45,000", time: "18 mins ago" },
];

// --- Main Page Component ---

export default function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState(CONSTANT_PLANS[0]);
  const [calcAmount, setCalcAmount] = useState(5000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculator Logic
  const dailyReturn = (calcAmount * selectedPlan.profit) / 100;
  const monthlyReturn = dailyReturn * 30;
  const totalReturn = dailyReturn * (parseInt(selectedPlan.contract) * 30);

  return (
    <div className="bg-[#F9FAFB] text-gray-800 min-h-screen selection:bg-[#E11D48]/10 font-sans overflow-x-hidden">
      
      {/* 🟢 FLOATING SUPPORT */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-[#E11D48] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group">
          <MessageSquare size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black text-[10px] uppercase tracking-widest px-0 group-hover:px-2">Live Support</span>
        </button>
      </div>

      {/* 1. HERO SECTION */}
      <header className="pt-24 pb-16 px-4 text-center max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#E11D48]/5 blur-[100px] -z-10 rounded-full" />
        <div className="inline-flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm mb-8">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#E11D48] animate-pulse" />
          <span className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-500 italic">Official Pakistan Node 🇵🇰</span>
        </div>
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black mb-6 leading-[0.85] tracking-tighter text-gray-900 uppercase italic">
          Capital <br /> <span className="text-[#E11D48]">Evolution.</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-lg mb-12 max-w-xl mx-auto font-bold uppercase italic px-4">
          Pakistan's most trusted <span className="text-gray-900 border-b-2 border-[#E11D48]">liquidity terminal</span>. 
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 px-6">
          <Link href="/login" className="bg-[#E11D48] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-100">Start Investing</Link>
          <Link href="#calculator" className="bg-white border border-gray-200 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all">Calculate Profit</Link>
        </div>
      </header>

      {/* 2. LIVE PAKISTANI ACTIVITY FEED */}
      <section className="py-12 bg-white border-y border-gray-100 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-10">
          {[...LIVE_ACTIVITY, ...LIVE_ACTIVITY].map((item, i) => (
            <div key={i} className="inline-flex items-center gap-4 bg-[#F9FAFB] border border-gray-100 px-6 py-4 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-[#E11D48] font-black text-xs uppercase">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-tighter text-gray-900">{item.name}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  {item.action} <span className={item.action === "Injected" ? "text-emerald-500" : "text-[#E11D48]"}>{item.amount}</span> • {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CALCULATOR ENGINE */}
      <section id="calculator" className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">Profit <span className="text-[#E11D48]">Engine.</span></h2>
            <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
              <label className="text-[9px] font-black uppercase text-gray-400 mb-4 block">Select Protocol</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CONSTANT_PLANS.map((p) => (
                  <button key={p.name} onClick={() => {setSelectedPlan(p); setCalcAmount(p.min);}}
                    className={`py-3 px-2 rounded-xl text-[9px] font-black transition-all uppercase border ${selectedPlan.name === p.name ? 'bg-[#E11D48] text-white border-[#E11D48]' : 'bg-[#F9FAFB] border-gray-100 hover:border-rose-200'}`}>
                    {p.name}
                  </button>
                ))}
              </div>
              <div className="mt-8">
                <label className="text-[9px] font-black uppercase text-gray-400 mb-4 block italic flex justify-between">Injection Amount <span>{selectedPlan.range}</span></label>
                <input type="range" min={selectedPlan.min} max={selectedPlan.max} step={100}
                  value={calcAmount} onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#E11D48]" />
                <div className="mt-4 text-3xl font-black text-gray-900 italic">Rs. {calcAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="bg-[#111] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Bell size={100} /></div>
            <div className="space-y-8 relative z-10">
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Daily Profit</span>
                <span className="text-xl font-black italic">Rs. {dailyReturn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Monthly Income</span>
                <span className="text-xl font-black italic text-[#E11D48]">Rs. {monthlyReturn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-gray-500 uppercase mb-2 tracking-widest">Total Contract Yield</span>
                <span className="text-5xl font-black italic">Rs. {totalReturn.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLAN GRID */}
      <section id="plans" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CONSTANT_PLANS.map((plan, i) => (
            <div key={i} className="p-8 rounded-[3rem] bg-white border border-gray-100 hover:border-rose-200 transition-all shadow-sm relative overflow-hidden group">
              {plan.popular && <div className="absolute top-0 right-0 bg-[#E11D48] text-white px-6 py-2 rounded-bl-2xl text-[8px] font-black uppercase italic tracking-widest animate-pulse">Most Active</div>}
              <div className="absolute top-0 left-0 w-full h-2 bg-gray-50 group-hover:bg-[#E11D48] transition-colors" />
              <h4 className="text-xl font-black uppercase italic mt-4">{plan.name}</h4>
              <div className="text-5xl font-black text-[#E11D48] my-6 italic tracking-tighter">{plan.profit}%</div>
              <div className="space-y-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-y border-gray-50 py-6 mb-8">
                <div className="flex justify-between"><span>Entry Range</span><span className="text-gray-900">{plan.range}</span></div>
                <div className="flex justify-between"><span>Contract</span><span className="text-gray-900">{plan.contract}</span></div>
              </div>
              <Link href="/login" className="block w-full py-4 bg-[#E11D48] text-white rounded-2xl font-black uppercase text-[10px] text-center tracking-widest shadow-lg shadow-rose-100 hover:scale-105 transition-all">Start Plan</Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INSTITUTIONAL SECURITY SECTION */}
      <section className="py-24 px-4 bg-[#0A0A0A] text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-10">
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                Bank-Grade <br /> <span className="text-[#E11D48]">Protection.</span>
              </h2>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] max-w-md mx-auto lg:mx-0">
                Your assets are shielded by multi-sig cold storage and real-time fraud monitoring.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <ShieldCheck className="text-emerald-500" size={28} />, t: "FBR COMPLIANT", d: "Regulated operations." },
                { icon: <Smartphone className="text-blue-500" size={28} />, t: "PWA ENABLED", d: "Install app on iOS/Android." },
                { icon: <Zap className="text-yellow-500" size={28} />, t: "2HR WITHDRAWAL", d: "JazzCash & Easypaisa." },
                { icon: <Lock className="text-rose-500" size={28} />, t: "COLD STORAGE", d: "Offline vault security." }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-rose-500/30 transition-all">
                  <div className="mb-4">{item.icon}</div>
                  <h5 className="font-black uppercase text-[11px] tracking-widest text-white mb-1">{item.t}</h5>
                  <p className="text-[9px] text-gray-500 uppercase font-bold leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 w-full relative">
            <div className="bg-[#111] rounded-[3.8rem] p-8 border border-white/10 relative overflow-hidden">
              <div className="flex items-end gap-2 h-40 mb-8 px-2">
                {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t-lg transition-all ${i === 5 ? 'bg-[#E11D48] shadow-[0_0_20px_#E11D48]' : 'bg-white/10'}`} />
                ))}
              </div>
              <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10">
                <div>
                  <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Vault Status</p>
                  <p className="text-emerald-500 font-black text-xs uppercase flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Encrypted & Active
                  </p>
                </div>
                <ShieldAlert size={30} className="text-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl font-black uppercase italic text-center mb-12 tracking-tighter">Common <span className="text-[#E11D48]">Queries.</span></h2>
        <div className="space-y-4">
          {[
            { q: "How do I withdraw?", a: "Withdrawals are processed instantly through your dashboard once the contract cycle finishes." },
            { q: "Is my capital secure?", a: "Yes, we use cold-wallet storage protocols to ensure your funds never touch the public internet." },
            { q: "Can I run multiple plans?", a: "Absolutely. You can inject capital into multiple nodes simultaneously for maximum yield." }
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-6 flex justify-between items-center font-black uppercase text-[10px] tracking-widest text-left">
                {faq.q} <ChevronDown className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} size={16} />
              </button>
              {openFaq === i && <div className="p-6 pt-0 text-[10px] font-bold text-gray-400 uppercase leading-relaxed">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-24 text-center px-4">
        <h3 className="text-6xl md:text-9xl font-black mb-10 italic uppercase tracking-tighter leading-none text-gray-900">Join the <br/> <span className="text-[#E11D48]">Circle.</span></h3>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.5em] mb-12 italic">Established in 2026 • Secure Network</p>
        <Link href="/login" className="bg-[#E11D48] text-white px-20 py-8 rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-rose-200 inline-block">Access Terminal</Link>
      </footer>

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}