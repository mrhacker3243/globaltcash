import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Zap, Coins, BarChart3, Users, 
  ChevronRight, Globe, Lock, Cpu, DollarSign, Wallet2, 
  CheckCircle2, HelpCircle, MessageSquare, TrendingUp
} from "lucide-react";
import { db } from "@/lib/db";
import { InvestmentPlansSection } from "@/components/InvestmentPlansSection";

// --- Helper Components ---

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="mb-2">{icon}</div>
      <p className="text-xl md:text-2xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] md:text-xs text-slate-400 uppercase font-bold tracking-tighter">{label}</p>
    </div>
  );
}

function StepCard({ number, title, desc, icon }: any) {
  return (
    <div className="relative p-10 rounded-[3rem] bg-white border border-slate-100 group hover:border-purple-600/30 transition-all shadow-sm hover:shadow-xl">
      <div className="absolute top-6 right-8 text-5xl font-black text-slate-100 italic select-none">{number}</div>
      <div className="mb-6 p-4 bg-purple-600/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="text-xl font-bold mb-3 text-slate-900">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-100 hover:bg-slate-50 transition-colors shadow-sm">
      <h4 className="text-base md:text-lg font-bold mb-3 flex items-start gap-3 text-slate-900">
        <HelpCircle size={20} className="text-purple-600 shrink-0 mt-0.5" />
        {question}
      </h4>
      <p className="text-slate-500 text-sm md:text-base leading-relaxed ml-8">{answer}</p>
    </div>
  );
}

// --- Main Page ---

export default async function HomePage() {
  let plans: any[] = [];
  try {
    plans = await db.plan.findMany({
      where: { active: true },
      orderBy: { minAmount: 'asc' }
    });
  } catch (error) {
    console.error("⚠️ HomePage DB Error (Pool Limit?):", error);
  }
  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen selection:bg-purple-600/30">
      {/* Hero */}
      <header className="pt-12 pb-16 px-4 md:pt-24 md:pb-32 text-center max-w-5xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-purple-600/5 blur-[120px] -z-10 rounded-full opacity-50" />
        <div className="inline-block bg-purple-600/10 border border-purple-600/20 text-purple-600 px-4 py-1.5 rounded-full text-[10px] font-bold mb-6 tracking-[0.3em] uppercase">
          ESTABLISHED 2026 • GLOBAL ASSET NETWORK
        </div>
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black mb-6 leading-[0.95] tracking-tighter text-slate-900">
          Earning <br className="hidden md:block" />
          <span className="text-purple-600 italic">Redefined.</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed px-2 font-medium">
          Deploy your assets into the world&apos;s most advanced high-yield intelligence network. Secure, Instant, and Infinite.
        </p>
        <div className="flex justify-center">
          <Link href="/login" className="bg-purple-600 px-16 py-6 rounded-2xl font-black text-lg uppercase tracking-[0.2em] shadow-xl shadow-purple-600/20 hover:bg-purple-700 transition-all flex items-center justify-center gap-3 group text-white">
            Login <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Stats */}
      <section className="px-4 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <StatItem icon={<Users className="text-purple-600" size={20} />} label="Global Investors" value="12k+" />
          <StatItem icon={<Coins className="text-purple-600" size={20} />} label="Total Deposits" value="Rs. 4.2M" />
          <StatItem icon={<Zap className="text-purple-600" size={20} />} label="Total Payouts" value="Rs. 1.8M" />
          <StatItem icon={<BarChart3 className="text-purple-600" size={20} />} label="System Status" value="Online" />
        </div>
      </section>

      {/* How It Works */}
      <section id="process" className="px-4 py-24 max-w-7xl mx-auto relative overflow-hidden">
        <div className="text-center mb-20">
          <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic mb-4 text-slate-900">
             Simple <span className="text-purple-600">Steps</span>
          </h3>
          <p className="text-slate-400 max-w-md mx-auto text-sm font-bold uppercase tracking-widest underline decoration-purple-500/30">Start earning in minutes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard 
            number="01" 
            title="Create Account" 
            desc="Sign up on our secure platform. Registration is fast, easy, and completely free." 
            icon={<Globe size={32} className="text-purple-600" />} 
          />
          <StepCard 
            number="02" 
            title="Choose a Plan" 
            desc="Select an investment plan that fits your goals and make your first deposit." 
            icon={<Wallet2 size={32} className="text-purple-600" />} 
          />
          <StepCard 
            number="03" 
            title="Withdraw Earnings" 
            desc="Watch your daily profits grow and withdraw them to your wallet at any time." 
            icon={<TrendingUp size={32} className="text-purple-600" />} 
          />
        </div>
      </section>

      {/* Intelligence Tech Section */}
      <section className="px-4 py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
             <div className="bg-purple-600/10 p-4 rounded-3xl w-fit mb-8 border border-purple-600/20">
                <Cpu size={48} className="text-purple-600" />
             </div>
             <h3 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter uppercase italic text-slate-900">
                Advanced <br /> <span className="text-purple-600">Investment</span> System
             </h3>
             <ul className="space-y-6">
                {[
                  "Proprietary AI-driven yield optimization",
                  "Deep-Liquidity investment methods",
                  "Cross-Chain asset synchronization",
                  "Automated security layer auditing"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-600 font-bold uppercase tracking-widest text-sm">
                    <CheckCircle2 size={18} className="text-purple-600" /> {item}
                  </li>
                ))}
             </ul>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] mt-12 shadow-sm">
                 <Lock size={32} className="text-purple-600 mb-4" />
                 <h5 className="font-bold mb-2 text-slate-900">Cold Storage</h5>
                 <p className="text-slate-500 text-xs leading-relaxed">98% of assets are stored in multi-signature cold wallets.</p>
              </div>
              <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
                 <DollarSign size={32} className="text-purple-600 mb-4" />
                 <h5 className="font-bold mb-2 text-slate-900">Instant FX</h5>
                 <p className="text-slate-500 text-xs leading-relaxed">Seamless conversion between native tokens and stablecoins.</p>
              </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-24 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic text-slate-900">
              Platform <span className="text-purple-600">Excellence</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-10 rounded-[3rem] border border-slate-200 bg-white hover:border-purple-600/50 transition-all group relative overflow-hidden shadow-sm">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors" />
              <ShieldCheck className="text-purple-600 mb-8 group-hover:scale-110 transition-transform" size={48} />
              <h4 className="text-2xl font-bold mb-4 italic text-slate-900">Ironclad Security</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Multi-layer encryption and real-time monitoring to ensure your capital remains untouchable and growing.</p>
            </div>
            <div className="p-10 rounded-[3rem] border border-slate-200 bg-white hover:border-purple-600/50 transition-all group relative overflow-hidden shadow-sm">
               <div className="absolute -right-4 -top-4 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors" />
              <Zap className="text-purple-600 mb-8 group-hover:scale-110 transition-transform" size={48} />
              <h4 className="text-2xl font-bold mb-4 italic text-slate-900">Hyper-Fast Exit</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Automated systems process your withdrawals in seconds, not hours. Access your assets anytime.</p>
            </div>
            <div className="p-10 rounded-[3rem] border border-slate-200 bg-white hover:border-purple-600/50 transition-all group relative overflow-hidden shadow-sm">
               <div className="absolute -right-4 -top-4 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors" />
              <BarChart3 className="text-purple-600 mb-8 group-hover:scale-110 transition-transform" size={48} />
              <h4 className="text-2xl font-bold mb-4 italic text-slate-900">Yield Mastery</h4>
              <p className="text-slate-500 text-sm leading-relaxed">AI algorithms find the highest-performing pools across global markets to deliver consistent, daily returns.</p>
            </div>
          </div>
      </section>

      {/* Investment Plans */}
      <InvestmentPlansSection initialPlans={plans} />

      {/* FAQ */}
      <section id="faq" className="px-4 py-24 max-w-4xl mx-auto">
         <div className="text-center mb-16">
            <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic mb-4 text-slate-900">Common <span className="text-purple-600">Queries</span></h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Everything you need to know before deployment</p>
         </div>
         <div className="space-y-4">
            <FAQItem 
              question="What is the minimum deposit?" 
              answer="You can start your investment journey with as little as Rs. 10 on our Starter Pulse plan. There are no hidden fees for deployment." 
            />
            <FAQItem 
              question="How often are profits credited?" 
              answer="Profits are calculated and credited to your terminal balance every 24 hours from the moment your investment plan becomes active." 
            />
            <FAQItem 
              question="Can I withdraw my capital at any time?" 
              answer="Yes. After your selected plan period concludes, your principal capital is released and available for instant withdrawal along with your profits." 
            />
            <FAQItem 
              question="Is my account secure?" 
              answer="We use military-grade encryption and multi-signature authorization for all transactions. Your data and assets are our highest priority." 
            />
         </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-32 text-center relative overflow-hidden border-t border-slate-200">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-purple-600/5 blur-[120px] -z-10 rounded-full" />
         <h3 className="text-4xl md:text-8xl font-black mb-10 tracking-tighter italic uppercase text-slate-900">Ready to <br /> <span className="text-purple-600">Get Started?</span></h3>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/login" className="bg-purple-600 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-purple-700 transition-all flex items-center justify-center gap-3 text-white">
               Login <ArrowRight size={20} />
            </Link>
            <Link href="/support" className="bg-white border border-slate-200 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-slate-900 shadow-sm">
               <MessageSquare size={20} className="text-purple-600" /> Live Support
            </Link>
         </div>
      </section>

    </div>
  );
}
