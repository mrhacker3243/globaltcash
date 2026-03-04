"use client";

import { Zap, Trophy, Crown, ArrowRight, X, Loader2, CheckCircle2, Cpu, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

const iconMap: Record<string, any> = {
  Zap: <Zap className="text-[#E11D48]" size={22} />,
  Trophy: <Trophy className="text-[#E11D48]" size={22} />,
  Crown: <Crown className="text-[#E11D48]" size={22} />,
};

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTerminals, setActiveTerminals] = useState<any[]>([]);
  const [fetchingActive, setFetchingActive] = useState(true);
  const [syncStatus] = useState<string>("Online");

  useEffect(() => {
    fetchPlans();
    fetchActivePlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      if (Array.isArray(data)) setPlans(data);
    } catch (err) { console.error(err); }
  };

  const fetchActivePlans = async () => {
    try {
      const res = await fetch("/api/user/active-plans");
      const data = await res.json();
      if (Array.isArray(data)) setActiveTerminals(data);
    } catch (err) { console.error(err); }
    finally { setFetchingActive(false); }
  };

  const handlePurchase = async () => {
    if (!amount) return;
    
    const investAmount = parseFloat(amount);

    // --- NEW STRICT VALIDATION ---
    if (investAmount < selectedPlan.minAmount) {
      setError(`Min limit is Rs. ${selectedPlan.minAmount}`);
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (investAmount > selectedPlan.maxAmount) {
      setError(`Max limit is Rs. ${selectedPlan.maxAmount}`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/plans/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName: selectedPlan.name, amount: investAmount })
      });
      
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        fetchActivePlans();
        setTimeout(() => { setSuccess(false); setSelectedPlan(null); setAmount(""); }, 2000);
      } else {
        // Backend balance check error
        setError(data.error || "Insufficient Balance");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) { 
        setError("Connection Error");
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen p-5 md:p-10 pt-24 lg:pt-10 font-sans text-[#1F2937]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#111827]">
              Current <span className="text-[#E11D48]">Plans</span>
            </h1>
            <p className="text-[#6B7280] text-sm font-medium mt-1 italic">Live plans monitoring active.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-[#E5E7EB]">
             <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-[#4B5563]">{syncStatus}</span>
          </div>
        </div>

        {/* Active Terminals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fetchingActive ? (
            [1, 2].map(i => <div key={i} className="h-44 bg-white rounded-[2rem] shadow-sm animate-pulse" />)
          ) : activeTerminals.length > 0 ? (
            activeTerminals.map((node: any) => (
              <div key={node.id} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-white relative overflow-hidden transition-all hover:shadow-md">
                 <div className="flex justify-between items-start mb-6">
                    <div className="bg-[#FFF1F2] p-3.5 rounded-2xl text-[#E11D48] border border-[#FFE4E6]">
                       <Cpu size={24} />
                    </div>
                    <div className="bg-[#ECFDF5] text-[#059669] text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider">Active</div>
                 </div>
                 <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] mb-1">{node.planName}</p>
                 <h3 className="text-2xl font-black text-[#111827]">Rs. {node.amount.toLocaleString()}</h3>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center bg-white rounded-[2rem] border border-[#E5E7EB] shadow-sm">
               <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest">No active plans found.</p>
            </div>
          )}
        </div>

        {/* Available Plans List */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <h2 className="text-2xl font-black text-[#111827]">Investment Plans</h2>
             <div className="h-[2px] flex-1 bg-[#E5E7EB]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div key={i} className={`bg-white p-9 rounded-[3rem] shadow-sm border-2 ${plan.popular ? 'border-rose-100' : 'border-white'} flex flex-col hover:scale-[1.01] transition-all`}>
                <div className="flex justify-between items-center mb-10">
                   <div className="bg-[#F9FAFB] p-4 rounded-2xl border border-[#F3F4F6]">
                      {iconMap[plan.icon] || <Zap className="text-[#E11D48]" />}
                   </div>
                   {plan.popular && <span className="bg-[#E11D48] text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-rose-100 uppercase tracking-tighter">Most Active</span>}
                </div>

                <h3 className="text-xl font-black text-[#111827] mb-2">{plan.name}</h3>
                <div className="mb-10">
                   <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-[#111827]">{plan.roi}%</span>
                      <span className="text-xs font-black text-[#E11D48] uppercase italic">/ Daily</span>
                   </div>
                </div>

                {/* Plan Stats */}
                <div className="space-y-4 mb-10 text-[11px] font-bold text-[#6B7280]">
                  <div className="flex justify-between items-center pb-3 border-b border-[#F9FAFB]">
                    <span className="uppercase tracking-widest opacity-60">Entry Range</span> 
                    <span className="text-[#111827]">Rs. {plan.minAmount} - {plan.maxAmount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="uppercase tracking-widest opacity-60">Contract</span> 
                    <span className="text-[#111827]">{plan.duration}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-[#E11D48] text-white hover:bg-[#BE123C]' : 'bg-[#111827] text-white hover:bg-black'}`}
                >
                  Start Plan <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#111827]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 relative shadow-2xl scale-in-center">
            <button onClick={() => {setSelectedPlan(null); setError(null);}} className="absolute top-8 right-8 text-[#D1D5DB] hover:text-[#111827]"><X size={24} /></button>
            
            <div className="flex flex-col items-center text-center mb-10">
              <div className="bg-[#FFF1F2] p-5 rounded-3xl text-[#E11D48] border border-[#FFE4E6] mb-4">
                 {iconMap[selectedPlan.icon] || <Zap size={30} />}
              </div>
              <h3 className="text-2xl font-black text-[#111827]">{selectedPlan.name}</h3>
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mt-1 italic">Limits: Rs. {selectedPlan.minAmount} - {selectedPlan.maxAmount}</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] ml-1">Investment Amount</label>
                  {error && <span className="text-[#E11D48] text-[10px] font-black uppercase animate-pulse flex items-center gap-1"><AlertTriangle size={12}/> {error}</span>}
                </div>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full bg-[#F9FAFB] border-2 ${error ? 'border-[#E11D48]' : 'border-[#F3F4F6]'} focus:border-[#E11D48] focus:bg-white rounded-2xl py-5 px-8 text-[#111827] outline-none font-black text-xl transition-all`}
                  placeholder="0.00"
                />
              </div>

              <button 
                onClick={handlePurchase}
                disabled={loading || success}
                className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${success ? 'bg-[#10B981]' : 'bg-[#E11D48] hover:bg-[#BE123C] shadow-xl shadow-rose-100'} text-white disabled:opacity-50`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : success ? <><CheckCircle2 size={20} /> Activated</> : "Finalize Activation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}