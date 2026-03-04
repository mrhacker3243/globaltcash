"use client";

import { Zap, Trophy, Crown, ArrowRight, X, Loader2, CheckCircle2, Cpu, AlertTriangle, LayoutGrid, Activity, Eye } from "lucide-react";
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
  const [showMyPlans, setShowMyPlans] = useState(false); // New State for Button

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
    if (investAmount < selectedPlan.minAmount || investAmount > selectedPlan.maxAmount) {
      setError(`Limit: Rs. ${selectedPlan.minAmount} - ${selectedPlan.maxAmount}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/plans/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName: selectedPlan.name, amount: investAmount })
      });
      if (res.ok) {
        setSuccess(true);
        fetchActivePlans();
        setTimeout(() => { setSuccess(false); setSelectedPlan(null); setAmount(""); }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Low Balance");
      }
    } catch (err) { setError("Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-10 pt-24 font-sans text-[#1E293B]">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP BAR: Header + VIEW BUTTON */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] uppercase italic leading-none">
              Investment <span className="text-[#E11D48]">Plans</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Select a package to start</p>
          </div>
          
          {/* THE MAGIC BUTTON */}
          <button 
            onClick={() => setShowMyPlans(true)}
            className="flex items-center gap-3 bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95"
          >
            <Eye size={18} className="text-[#E11D48]" /> View My Plans ({activeTerminals.length})
          </button>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-50 flex flex-col group hover:shadow-xl transition-all">
              <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-110 transition-transform">
                {iconMap[plan.icon] || <Zap className="text-[#E11D48]" />}
              </div>
              <h3 className="text-xl font-black text-[#0F172A] uppercase mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-[#0F172A]">{plan.roi}%</span>
                <span className="text-[10px] font-bold text-[#E11D48] uppercase tracking-widest">/ Daily</span>
              </div>
              <div className="space-y-3 mb-8 text-[11px] font-bold text-gray-400 uppercase border-t border-gray-50 pt-6">
                <div className="flex justify-between"><span>Limit</span> <span className="text-[#0F172A]">Rs. {plan.minAmount}+</span></div>
                <div className="flex justify-between"><span>Days</span> <span className="text-[#0F172A]">{plan.duration}</span></div>
              </div>
              <button onClick={() => setSelectedPlan(plan)} className="w-full py-4 bg-[#F8FAFC] text-[#0F172A] border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E11D48] hover:text-white transition-all flex items-center justify-center gap-2">
                Invest Now <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- SIDE DRAWER FOR "MY PLANS" --- */}
      {showMyPlans && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm" onClick={() => setShowMyPlans(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
               <h2 className="text-2xl font-black text-[#0F172A] uppercase italic">My Portfolios</h2>
               <button onClick={() => setShowMyPlans(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"><X size={20}/></button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
              {activeTerminals.length > 0 ? activeTerminals.map((node: any) => (
                <div key={node.id} className="bg-[#0F172A] p-6 rounded-[2rem] relative overflow-hidden group">
                  <div className="relative z-10 flex justify-between items-center mb-4">
                    <div className="w-10 h-10 bg-[#E11D48] rounded-xl flex items-center justify-center text-white"><Cpu size={20}/></div>
                    <span className="text-[8px] font-black text-green-400 bg-green-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Running</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{node.planName}</p>
                    <h4 className="text-2xl font-black text-white italic">Rs. {node.amount.toLocaleString()}</h4>
                  </div>
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-[#E11D48] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                </div>
              )) : (
                <div className="text-center py-20">
                  <LayoutGrid size={48} className="mx-auto text-gray-100 mb-4" />
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">No Active Plans</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PURCHASE MODAL (Same as before) */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-[#0F172A]/80 backdrop-blur-md">
           <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 relative animate-in zoom-in-95">
             <button onClick={() => {setSelectedPlan(null); setError(null);}} className="absolute top-8 right-8 text-gray-300"><X size={24} /></button>
             <h3 className="text-2xl font-black text-center uppercase italic mb-8">{selectedPlan.name}</h3>
             <div className="space-y-6">
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#E11D48] rounded-[1.5rem] py-5 px-6 text-xl font-black outline-none transition-all" placeholder="Enter Amount" />
                {error && <p className="text-[#E11D48] text-[9px] font-black uppercase text-center">{error}</p>}
                <button onClick={handlePurchase} disabled={loading} className="w-full py-5 bg-[#E11D48] text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-rose-100 active:scale-95">
                   {loading ? "Processing..." : success ? "Activated!" : "Confirm Investment"}
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}