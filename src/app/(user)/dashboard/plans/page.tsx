"use client";

import { Zap, ShieldCheck, Trophy, Crown, ArrowRight, X, Loader2, CheckCircle2, Cpu } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { usePlanSync } from "@/hooks/usePlanSync";

const iconMap: Record<string, any> = {
  Zap: <Zap className="text-purple-600" />,
  Trophy: <Trophy className="text-yellow-600" />,
  Crown: <Crown className="text-indigo-600" />,
};

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTerminals, setActiveTerminals] = useState<any[]>([]);
  const [fetchingActive, setFetchingActive] = useState(true);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [syncStatus, setSyncStatus] = useState<string>("Initializing...");

  useEffect(() => {
    fetchPlans();
    fetchActivePlans();
  }, []);

  // Handle real-time plan updates
  const handlePlanChange = useCallback((event: any) => {
    if (event.type === 'CONNECTED') {
      setSyncStatus("Live");
      console.log("✅ Connected to real-time plan updates");
      return;
    }

    if (event.type === 'UPDATE' || event.type === 'CREATE') {
      console.log("🔄 Plan update detected:", event);
      setSyncStatus("Syncing...");
      fetchPlans();
      setTimeout(() => setSyncStatus("Live"), 1000);
    } else if (event.type === 'DELETE') {
      console.log("🗑️ Plan deleted:", event.planId);
      setSyncStatus("Syncing...");
      fetchPlans();
      setTimeout(() => setSyncStatus("Live"), 1000);
    }
  }, []);

  // Use plan sync hook
  usePlanSync(handlePlanChange, true);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPlans(data);
      }
    } catch (err) {
      console.error("Failed to fetch plans");
    } finally {
      setFetchingPlans(false);
    }
  };

  const fetchActivePlans = async () => {
    try {
      const res = await fetch("/api/user/active-plans");
      const data = await res.json();
      if (Array.isArray(data)) {
        setActiveTerminals(data);
      }
    } catch (err) {
      console.error("Failed to fetch active plans");
    } finally {
      setFetchingActive(false);
    }
  };

  const handlePurchase = async () => {
    if (!amount || parseFloat(amount) < selectedPlan.minAmount || parseFloat(amount) > selectedPlan.maxAmount) {
      alert(`Please enter an amount between Rs. ${selectedPlan.minAmount} and Rs. ${selectedPlan.maxAmount}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/plans/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: selectedPlan.name,
          amount: parseFloat(amount)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        fetchActivePlans(); // Refresh the list
        setTimeout(() => {
          setSuccess(false);
          setSelectedPlan(null);
          setAmount("");
        }, 3000);
      } else {
        alert(data.error || "Purchase failed");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 pt-24 lg:pt-10 max-w-7xl mx-auto min-h-screen space-y-12">
      {/* Page Header - Hidden on Desktop */}
      <div className="mb-10 text-slate-900 lg:hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.3)]" />
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">
            Investment <span className="text-purple-600">Plans</span>
          </h1>
        </div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5">
           Active Investment Plans • Status: <span className={`italic uppercase ${syncStatus === 'Live' ? 'text-emerald-600' : 'text-yellow-600'}`}>{syncStatus}</span>
        </p>
      </div>

      {/* 2. Active Deployments Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
           <Cpu size={16} className={`${syncStatus === 'Live' ? 'text-emerald-600' : 'text-yellow-600'} animate-pulse`} />
           <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">My Active Plans</h2>
        </div>

        {fetchingActive ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-50 border border-slate-100 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : activeTerminals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeTerminals.map((node: any) => (
              <div key={node.id} className="bg-white border border-purple-600/20 p-6 rounded-[2rem] relative overflow-hidden group shadow-sm">
                 <div className="absolute top-0 right-0 p-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                 </div>
                 <div className="flex flex-col gap-1 mb-4">
                    <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest">{node.planName}</p>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tighter italic">Rs. {node.amount.toFixed(2)}</h3>
                 </div>
                 <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-slate-400 uppercase">Started on</span>
                       <span className="text-[10px] font-bold text-slate-600">{new Date(node.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                       <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Active...</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 p-10 rounded-[2.5rem] text-center">
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">No active plans found. Start a plan below to earn profit.</p>
          </div>
        )}
      </div>

      {/* 3. Available Plans Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
           <Zap size={16} className="text-yellow-500" />
           <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 italic">Choose a Plan</h2>
        </div>
        {fetchingPlans ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-50 border border-slate-100 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`relative bg-white border ${plan.popular ? 'border-purple-600/30 shadow-lg shadow-purple-600/5' : 'border-slate-200'} p-8 rounded-[2.5rem] flex flex-col group hover:scale-[1.02] transition-transform`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-[9px] font-black px-4 py-1 rounded-full uppercase italic text-white">Top Performer</span>}
                
                <div className="bg-slate-50 p-4 w-fit rounded-2xl border border-slate-100 mb-6 group-hover:border-purple-500/30 transition-colors">
                  {iconMap[plan.icon] || <Zap className="text-purple-600" />}
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 text-slate-900">{plan.name}</h3>
                
                <div className="mb-8">
                  <span className="text-5xl font-black text-slate-900">{plan.roi}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase ml-2">Daily Yield</span>
                </div>

                <div className="space-y-4 mb-8 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Min/Max:</span> 
                    <span>Rs. {plan.minAmount} - Rs. {plan.maxAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span> 
                    <span>{plan.duration}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 text-white ${plan.popular ? 'bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-600/20' : 'bg-slate-800 hover:bg-slate-900'}`}
                >
                  Start Investment <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px]" />
            
            <button 
              onClick={() => setSelectedPlan(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition"
            >
              <X size={20} />
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-600/10 p-3 rounded-2xl text-purple-600">
                  {iconMap[selectedPlan.icon] || <Zap size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">{selectedPlan.name}</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Investment Confirmation</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Investment Amount (Rs.)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Min Rs. ${selectedPlan.minAmount}`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 mt-2 text-slate-900 focus:outline-none focus:border-purple-600 transition-all font-bold"
                  />
                  <p className="text-[9px] text-slate-400 mt-2 uppercase font-bold italic">Enter amount between Rs. ${selectedPlan.minAmount} and Rs. ${selectedPlan.maxAmount}</p>
                </div>

                <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-tight text-slate-500 mb-1">
                      <span>Daily Profit</span>
                      <span className="text-emerald-600">+{selectedPlan.roi}%</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-tight text-slate-500">
                      <span>Term Duration</span>
                      <span className="text-slate-900">{selectedPlan.duration}</span>
                   </div>
                </div>

                <button 
                  onClick={handlePurchase}
                  disabled={loading || success}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 ${success ? 'bg-emerald-600' : 'bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-600/20'} disabled:opacity-50 text-white`}
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : success ? <CheckCircle2 size={18} /> : <Zap size={18} />}
                  {loading ? "Processing..." : success ? "Plan Active" : "Confirm Investment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
