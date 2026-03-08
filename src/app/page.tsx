"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"; 
import { 
  ShieldCheck, Zap, MessageSquare, Bell, Lock, 
  ShieldAlert, ChevronDown, Smartphone, LogIn, UserPlus, TrendingUp, X, Coins
} from "lucide-react";

// --- Data Structures ---

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

  // Profit Calculation Logic (Fixed)
  const dailyReturn = (calcAmount * selectedPlan.profit) / 100;
  const monthlyReturn = dailyReturn * 30;
  const contractMonths = parseInt(selectedPlan.contract);
  const totalProfitOnly = monthlyReturn * contractMonths;
  const totalWithPrincipal = totalProfitOnly + calcAmount;

  return (
    <div className="bg-[#F9FAFB] text-gray-800 min-h-screen selection:bg-[#E11D48]/10 font-sans overflow-x-hidden">
      
      {/* 🟢 NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 xs:px-6 h-16 xs:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#E11D48] p-1.5 xs:p-2 rounded-lg text-white"><Zap size={18} fill="white" /></div>
            <span className="font-black uppercase tracking-tighter text-lg xs:text-xl italic text-gray-900 leading-none">
              Global <span className="text-[#E11D48]">Capital</span>
            </span>
          </div>
          <div className="flex items-center gap-2 xs:gap-4">
            <Link href="/login" className="hidden xs:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#E11D48] transition-colors">
              <LogIn size={14} /> Login
            </Link>
            <Link href="/register" className="bg-[#0F172A] text-white px-4 xs:px-6 py-2.5 xs:py-3 rounded-xl font-black uppercase tracking-widest text-[9px] xs:text-[10px] shadow-lg flex items-center gap-2 transition-transform active:scale-95">
              <UserPlus size={14} /> Register
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <header className="pt-32 xs:pt-40 pb-16 px-4 text-center max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] xs:h-[500px] bg-[#E11D48]/5 blur-[80px] xs:blur-[100px] -z-10 rounded-full" />
        <div className="inline-flex items-center gap-2 bg-white border border-gray-100 px-3 xs:px-4 py-2 rounded-full shadow-sm mb-6 xs:mb-8">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#E11D48] animate-pulse" />
          <span className="text-[8px] xs:text-[9px] font-black tracking-[0.15em] xs:tracking-[0.2em] uppercase text-gray-500 italic">Official Global Trust Node</span>
        </div>

        <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black mb-6 leading-[0.9] tracking-tight text-gray-900 uppercase italic">
          Welcome. <br /> 
          <span className="text-[#E11D48]">Grow Wealth</span>
        </h1>

        <p className="text-gray-500 text-xs xs:text-sm sm:text-lg mb-10 xs:mb-12 max-w-2xl mx-auto font-bold uppercase italic px-4 flex items-center justify-center gap-2">
          <TrendingUp size={18} className="text-[#E11D48]" />
          Powered by <span className="text-gray-900 border-b-2 border-[#E11D48]">Global Trust Cash</span>
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 px-6">
          <Link href="/register" className="bg-[#E11D48] text-white px-8 xs:px-10 py-4 xs:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] xs:text-xs shadow-xl shadow-rose-100 transition-transform active:scale-95">Start Investing</Link>
          <Link href="#calculator" className="bg-white border border-gray-200 px-8 xs:px-10 py-4 xs:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] xs:text-xs hover:bg-gray-50 transition-all">Calculate Profit</Link>
        </div>
      </header>

      {/* 2. LIVE FEED */}
      <section className="py-8 xs:py-12 bg-white border-y border-gray-100 overflow-hidden relative">
        <div className="flex whitespace-nowrap gap-6 xs:gap-10 animate-marquee">
          {[...LIVE_ACTIVITY, ...LIVE_ACTIVITY, ...LIVE_ACTIVITY].map((item, i) => (
            <div key={i} className="inline-flex items-center gap-3 xs:gap-4 bg-[#F9FAFB] border border-gray-100 px-4 xs:px-6 py-3 xs:py-4 rounded-xl xs:rounded-2xl shadow-sm">
              <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-rose-100 flex items-center justify-center text-[#E11D48] font-black text-[10px] uppercase">
                {item.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-[9px] xs:text-[10px] font-black uppercase tracking-tighter text-gray-900">{item.name}</p>
                <p className="text-[8px] xs:text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  {item.action} <span className={item.action === "Injected" ? "text-emerald-500" : "text-[#E11D48]"}>{item.amount}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CALCULATOR SECTION */}
      <section id="calculator" className="py-16 xs:py-20 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xs:gap-10 items-start">
          <div className="space-y-6">
            <h2 className="text-3xl xs:text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">Calculate <span className="text-[#E11D48]">Profit</span></h2>
            <div className="p-5 xs:p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
              <label className="text-[9px] font-black uppercase text-gray-400 mb-4 block tracking-widest">1. Select Investment Plan</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CONSTANT_PLANS.map((p) => (
                  <button key={p.name} onClick={() => {setSelectedPlan(p); setCalcAmount(p.min);}}
                    className={`py-3 px-2 rounded-xl text-[8px] xs:text-[9px] font-black transition-all uppercase border ${selectedPlan.name === p.name ? 'bg-[#E11D48] text-white border-[#E11D48]' : 'bg-[#F9FAFB] border-gray-100 hover:border-rose-200'}`}>
                    {p.name}
                  </button>
                ))}
              </div>
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                   <label className="text-[9px] font-black uppercase text-gray-400 italic tracking-widest">2. Slide Amount</label>
                   <span className="text-[10px] font-black text-[#E11D48] bg-rose-50 px-2 py-1 rounded-md">Limit: {selectedPlan.range}</span>
                </div>
                <input type="range" min={selectedPlan.min} max={selectedPlan.max} step={500}
                  value={calcAmount} onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#E11D48]" />
                <div className="mt-4 text-3xl xs:text-4xl font-black text-gray-900 italic text-center sm:text-left border-t pt-4 border-dashed border-gray-100">
                  Rs. {calcAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-[#0F172A] p-6 xs:p-10 rounded-[2.5rem] xs:rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingUp size={150} /></div>
            <div className="space-y-6 xs:space-y-8 relative z-10 text-left">
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Daily ({selectedPlan.profit}%)</span>
                <span className="text-xl font-black italic">Rs. {dailyReturn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Monthly Income</span>
                <span className="text-xl font-black italic text-[#E11D48]">Rs. {monthlyReturn.toLocaleString()}</span>
              </div>
              <div className="pt-4">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Total Net Profit</span>
                    <span className="text-sm font-bold text-emerald-400 italic">+ Rs. {totalProfitOnly.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-500 uppercase mb-1 tracking-widest">Grand Total (Inc. Principal)</span>
                  <span className="text-4xl xs:text-5xl font-black italic text-white">Rs. {totalWithPrincipal.toLocaleString()}</span>
                </div>
                <p className="text-[8px] text-gray-500 mt-4 uppercase font-bold">* Calculation based on {selectedPlan.contract} contract period.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INVESTMENT PLANS GRID */}
      <section className="py-16 xs:py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8">
          {CONSTANT_PLANS.map((plan, i) => (
            <div key={i} className="p-6 xs:p-8 rounded-[2.5rem] xs:rounded-[3rem] bg-white border border-gray-100 hover:border-rose-200 transition-all shadow-sm relative overflow-hidden group text-left">
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#E11D48] text-white px-5 xs:px-6 py-2 rounded-bl-2xl text-[8px] font-black uppercase italic tracking-widest">
                  Active Now
                </div>
              )}
              <h4 className="text-lg xs:text-xl font-black uppercase italic mt-4">{plan.name}</h4>
              <div className="text-4xl xs:text-5xl font-black text-[#E11D48] my-5 xs:my-6 italic tracking-tighter">
                {plan.profit}% <span className="text-[10px] text-gray-400">/ Day</span>
              </div>
              <div className="space-y-3 text-[9px] xs:text-[10px] font-bold text-gray-400 uppercase tracking-widest border-y border-gray-50 py-6 mb-8">
                <div className="flex justify-between"><span>Investment</span><span className="text-gray-900">{plan.range}</span></div>
                <div className="flex justify-between"><span>Duration</span><span className="text-gray-900">{plan.contract}</span></div>
              </div>
              <Link href="/register" className="block w-full py-4 bg-[#0F172A] text-white rounded-2xl font-black uppercase text-[10px] text-center tracking-widest transition-all hover:bg-[#E11D48] active:scale-95">Start This Plan</Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-16 xs:py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl xs:text-4xl font-black uppercase italic text-center mb-10 xs:mb-12 tracking-tighter">Common <span className="text-[#E11D48]">Queries.</span></h2>
        <div className="space-y-4">
          {[
            { q: "How do I withdraw my earnings?", a: "Withdrawals are processed instantly to your JazzCash or Easypaisa account upon request." },
            { q: "Is my investment secure?", a: "We employ multi-layer encryption and cold-wallet storage to ensure your capital is safe 24/7." },
            { q: "Can I upgrade my plan later?", a: "Yes, you can have multiple active plans simultaneously to maximize your daily yield." }
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-5 xs:p-6 flex justify-between items-center font-black uppercase text-[9px] xs:text-[10px] tracking-widest text-left">
                {faq.q} <ChevronDown className={`transition-transform shrink-0 ml-2 ${openFaq === i ? 'rotate-180' : ''}`} size={16} />
              </button>
              {openFaq === i && <div className="p-6 pt-0 text-[10px] font-bold text-gray-400 uppercase leading-relaxed">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* 6. FOOTER SECTION */}
      <footer className="py-20 xs:py-24 text-center px-4 bg-white border-t border-gray-100">
        <h3 className="text-5xl sm:text-7xl md:text-9xl font-black mb-8 xs:mb-10 italic uppercase tracking-tighter leading-[0.85] text-gray-900">
          Join the <br/> <span className="text-[#E11D48]">Circle.</span>
        </h3>
        <p className="text-gray-400 font-bold uppercase text-[9px] xs:text-[10px] tracking-[0.3em] xs:tracking-[0.5em] mb-10 xs:mb-12 italic">Established in 2026 • Secure Network Node</p>
        <Link href="/register" className="bg-[#E11D48] text-white px-12 xs:px-20 py-6 xs:py-8 rounded-[2rem] font-black uppercase tracking-widest text-xs xs:text-sm shadow-2xl shadow-rose-200 inline-block transition-transform active:scale-95">
          Access Terminal
        </Link>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #E11D48;
          border-radius: 50%;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 0 10px rgba(225, 29, 72, 0.2);
        }
      `}} />
    </div>
  );
}