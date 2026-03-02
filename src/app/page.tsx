"use client";
import React from "react";
import { 
  ArrowRight, ShieldCheck, Zap, Coins, BarChart3, Users, 
  ChevronRight, Globe, Lock, Cpu, DollarSign, Wallet2, 
  CheckCircle2, HelpCircle, MessageSquare, TrendingUp
} from "lucide-react";

// Mocking Next.js for preview stability
const Link = ({ href, children, className }: any) => (
  <a href={href} className={className}>{children}</a>
);

// --- Helper Components ---

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#0f172a]/50 border border-[#22c55e]/10 backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] group hover:border-[#22c55e]/30 transition-all">
      <div className="mb-3 p-3 bg-[#22c55e]/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-2xl md:text-3xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{value}</p>
      <p className="text-[10px] md:text-xs text-[#22c55e] uppercase font-black tracking-[0.2em] italic">{label}</p>
    </div>
  );
}

function StepCard({ number, title, desc, icon }: any) {
  return (
    <div className="relative p-10 rounded-[3rem] bg-[#0f172a]/40 border border-white/5 group hover:border-[#22c55e]/30 transition-all shadow-2xl overflow-hidden">
      <div className="absolute top-6 right-8 text-6xl font-black text-white/5 italic select-none group-hover:text-[#22c55e]/10 transition-colors">{number}</div>
      <div className="mb-6 p-4 bg-[#22c55e]/10 rounded-2xl w-fit group-hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all">{icon}</div>
      <h4 className="text-xl font-bold mb-3 text-white uppercase tracking-tighter italic">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
      {/* Toxic Glow Line */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#22c55e] group-hover:w-full transition-all duration-500 shadow-[0_0_15px_#22c55e]" />
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="p-6 md:p-8 rounded-[2.5rem] bg-[#0f172a]/60 border border-white/5 hover:border-[#22c55e]/20 transition-all group">
      <h4 className="text-base md:text-lg font-bold mb-3 flex items-start gap-4 text-white uppercase tracking-tight">
        <HelpCircle size={22} className="text-[#22c55e] shrink-0 mt-0.5" />
        {question}
      </h4>
      <p className="text-slate-400 text-sm md:text-base leading-relaxed ml-10 font-medium">{answer}</p>
    </div>
  );
}

// --- Main Page ---

export default function HomePage() {
  // In preview mode, we use mock plans since db/InvestmentPlansSection are server-side/external
  const mockPlans = [
    { id: 1, name: "Starter Pulse", minAmount: 100, dailyProfit: 2.5, duration: 30 },
    { id: 2, name: "Neural Growth", minAmount: 5000, dailyProfit: 4.0, duration: 45 },
    { id: 3, name: "Infinite Yield", minAmount: 25000, dailyProfit: 6.5, duration: 60 }
  ];

  return (
    <div className="bg-[#020617] text-slate-300 min-h-screen selection:bg-[#22c55e]/30 font-sans overflow-x-hidden">
      
      {/* Hero Section */}
      <header className="pt-20 pb-16 px-4 md:pt-32 md:pb-40 text-center max-w-6xl mx-auto relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#22c55e]/5 blur-[120px] -z-10 rounded-full opacity-60" />
        <div className="absolute top-20 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10" />
        
        <div className="inline-flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] px-5 py-2 rounded-full text-[10px] font-black mb-8 tracking-[0.4em] uppercase animate-pulse">
          <div className="w-2 h-2 bg-[#22c55e] rounded-full shadow-[0_0_8px_#22c55e]" />
          ESTABLISHED 2026 • GLOBAL ASSET NETWORK
        </div>

        <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black mb-8 leading-[0.85] tracking-tighter text-white uppercase italic">
          Earning <br className="hidden md:block" />
          <span className="text-[#22c55e] drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]">Redefined.</span>
        </h1>
        
        <p className="text-slate-400 text-base md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed px-4 font-bold uppercase tracking-wide italic">
          Deploy your assets into the world&apos;s most advanced <span className="text-white underline decoration-[#22c55e] decoration-4">high-yield intelligence network</span>. Secure, Instant, and Infinite.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link href="/login" className="w-full sm:w-auto bg-[#22c55e] px-16 py-6 rounded-2xl font-black text-xl uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-3 text-black group">
            Open Terminal <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="#plans" className="w-full sm:w-auto px-12 py-6 rounded-2xl font-black text-lg uppercase tracking-[0.2em] border border-white/10 hover:bg-white/5 transition-all text-white">
            View Plans
          </Link>
        </div>
      </header>

      {/* Stats Section */}
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <StatItem icon={<Users className="text-[#22c55e]" size={24} />} label="Global Investors" value="12k+" />
          <StatItem icon={<Coins className="text-[#22c55e]" size={24} />} label="Total Deposits" value="Rs. 4.2M" />
          <StatItem icon={<Zap className="text-[#22c55e]" size={24} />} label="Total Payouts" value="Rs. 1.8M" />
          <StatItem icon={<BarChart3 className="text-[#22c55e]" size={24} />} label="System Status" value="Online" />
        </div>
      </section>

      {/* How It Works */}
      <section id="process" className="px-4 py-32 max-w-7xl mx-auto relative">
        <div className="text-center mb-24">
          <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic mb-4 text-white">
              System <span className="text-[#22c55e]">Protocol</span>
          </h3>
          <p className="text-[#22c55e] max-w-md mx-auto text-xs font-black uppercase tracking-[0.4em] opacity-80">Start earning in minutes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <StepCard 
            number="01" 
            title="Access ID" 
            desc="Sign up on our secure encrypted platform. Registration is fast, verified, and completely free." 
            icon={<Globe size={36} className="text-[#22c55e]" />} 
          />
          <StepCard 
            number="02" 
            title="Data Deployment" 
            desc="Select an investment protocol that fits your financial goals and trigger your first deposit." 
            icon={<Wallet2 size={36} className="text-[#22c55e]" />} 
          />
          <StepCard 
            number="03" 
            title="Capital Extraction" 
            desc="Watch your daily profits compound in real-time. Extract your yield to your wallet instantly." 
            icon={<TrendingUp size={36} className="text-[#22c55e]" />} 
          />
        </div>
      </section>

      {/* Intelligence Tech Section */}
      <section className="px-4 py-32 bg-[#0f172a]/30 border-y border-white/5 relative">
        <div className="absolute top-0 right-0 w-[500px] h-full bg-[#22c55e]/5 blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
             <div className="bg-[#22c55e]/10 p-5 rounded-3xl w-fit mb-8 border border-[#22c55e]/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <Cpu size={56} className="text-[#22c55e]" />
             </div>
             <h3 className="text-5xl md:text-7xl font-black mb-8 leading-none tracking-tighter uppercase italic text-white">
                Advanced <br /> <span className="text-[#22c55e]">Neural</span> Yields
             </h3>
             <ul className="space-y-6">
                {[
                  "Proprietary AI-driven yield optimization",
                  "Deep-Liquidity investment methods",
                  "Cross-Chain asset synchronization",
                  "Automated security layer auditing"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-5 text-slate-400 font-black uppercase tracking-[0.2em] text-[11px]">
                    <CheckCircle2 size={20} className="text-[#22c55e]" /> {item}
                  </li>
                ))}
             </ul>
          </div>
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-10 bg-[#020617] border border-white/5 rounded-[3rem] mt-12 shadow-2xl group hover:border-[#22c55e]/20 transition-all">
                 <Lock size={40} className="text-[#22c55e] mb-6 group-hover:rotate-12 transition-transform" />
                 <h5 className="font-black mb-3 text-white uppercase tracking-tighter text-xl">Cold Vaults</h5>
                 <p className="text-slate-500 text-xs leading-relaxed font-bold">98% of assets are locked in multi-signature decentralized cold storage.</p>
              </div>
              <div className="p-10 bg-[#020617] border border-white/5 rounded-[3rem] shadow-2xl group hover:border-[#22c55e]/20 transition-all">
                 <DollarSign size={40} className="text-[#22c55e] mb-6 group-hover:rotate-12 transition-transform" />
                 <h5 className="font-black mb-3 text-white uppercase tracking-tighter text-xl">Instant FX</h5>
                 <p className="text-slate-500 text-xs leading-relaxed font-bold">Seamless real-time conversion between native assets and stablecoins.</p>
              </div>
          </div>
        </div>
      </section>

      {/* Investment Plans (Mock for Preview) */}
      <section id="plans" className="px-4 py-32 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic text-white">
            Yield <span className="text-[#22c55e]">Protocols</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockPlans.map((plan) => (
            <div key={plan.id} className="p-10 rounded-[3rem] bg-[#0f172a]/60 border border-white/10 flex flex-col items-center text-center group hover:border-[#22c55e]/40 hover:-translate-y-2 transition-all relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-[#22c55e]/20 group-hover:bg-[#22c55e] transition-colors shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
               <h4 className="text-2xl font-black text-white uppercase italic mb-2 tracking-tighter">{plan.name}</h4>
               <div className="text-5xl font-black text-[#22c55e] my-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                 {plan.dailyProfit}% <span className="text-xs text-slate-500 block uppercase tracking-widest mt-1">Daily Profit</span>
               </div>
               <div className="space-y-4 w-full text-sm font-bold text-slate-400 mb-8 border-y border-white/5 py-6">
                 <p>MIN DEPOSIT: <span className="text-white">Rs. {plan.minAmount}</span></p>
                 <p>DURATION: <span className="text-white">{plan.duration} Days</span></p>
                 <p>TOTAL RETURN: <span className="text-[#22c55e]">{(plan.dailyProfit * plan.duration).toFixed(1)}%</span></p>
               </div>
               <Link href="/login" className="w-full py-4 bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] rounded-2xl font-black uppercase tracking-widest hover:bg-[#22c55e] hover:text-black transition-all">
                 Activate
               </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 py-32 max-w-4xl mx-auto">
         <div className="text-center mb-16">
            <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic mb-4 text-white">Common <span className="text-[#22c55e]">Queries</span></h3>
            <p className="text-[#22c55e] font-black uppercase tracking-[0.4em] text-[10px] opacity-80 underline decoration-white/20">Everything you need to know before deployment</p>
         </div>
         <div className="space-y-6">
            <FAQItem 
              question="What is the minimum deposit?" 
              answer="You can start your investment journey with as little as Rs. 100 on our Starter Pulse protocol. There are no hidden fees for deployment." 
            />
            <FAQItem 
              question="How often are profits credited?" 
              answer="Profits are calculated and credited to your terminal balance every 24 hours from the moment your investment protocol becomes active." 
            />
            <FAQItem 
              question="Can I withdraw my capital at any time?" 
              answer="Yes. After your selected plan period concludes, your principal capital is released and available for instant extraction along with your profits." 
            />
            <FAQItem 
              question="Is my account secure?" 
              answer="We use military-grade encryption and multi-signature authorization for all transactions. Your data and assets are our highest priority." 
            />
         </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-40 text-center relative overflow-hidden border-t border-white/5 bg-[#0f172a]/20">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-[#22c55e]/5 blur-[150px] -z-10 rounded-full" />
         <h3 className="text-5xl md:text-[8rem] font-black mb-12 tracking-tighter italic uppercase text-white leading-[0.85]">Ready to <br /> <span className="text-[#22c55e]">Infiltrate?</span></h3>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/login" className="bg-[#22c55e] px-16 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-black">
                Terminal Access <ArrowRight size={20} />
            </Link>
            <Link href="/support" className="bg-white/5 border border-white/10 px-16 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-white">
               <MessageSquare size={20} className="text-[#22c55e]" /> Support Desk
            </Link>
         </div>
      </section>

    </div>
  );
}