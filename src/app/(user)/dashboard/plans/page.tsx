"use client";

import { Zap, Trophy, Crown, ArrowRight, X, Loader2, CheckCircle2, History, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const iconMap: Record<string, any> = {
  Zap: <Zap className="text-[#E11D48]" size={22} />,
  Trophy: <Trophy className="text-[#E11D48]" size={22} />,
  Crown: <Crown className="text-[#E11D48]" size={22} />,
};

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [userPlans, setUserPlans] = useState<any[]>([]); 
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null); // For claim loader
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
    fetchUserDashboardData();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      if (Array.isArray(data)) setPlans(data);
    } catch (err) { console.error(err); }
  };

  const fetchUserDashboardData = async () => {
    try {
      const res = await fetch('/api/user/dashboard', { cache: "no-store" });
      const data = await res.json();
      if (!data.error && data.activePlans) {
        setUserPlans(data.activePlans);
      }
    } catch (err) { console.error("Sync Error:", err); }
  };

  // ✅ NEW: Handle Profit Claiming
  const handleClaim = async (depositId: string) => {
    setClaimingId(depositId);
    try {
      const res = await fetch("/api/invest/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositId })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(`Success! Rs. ${data.amount} added to balance.`);
        fetchUserDashboardData(); // Refresh data to reset timer
      } else {
        alert(data.error || "Claim failed");
      }
    } catch (err) {
      alert("Connection Error");
    } finally {
      setClaimingId(null);
    }
  };

  const handlePurchase = async () => {
    if (!amount || !selectedPlan) return;
    const investAmount = parseFloat(amount);
    
    if (investAmount < selectedPlan.minAmount || investAmount > selectedPlan.maxAmount) {
      setError(`Limit: Rs. ${selectedPlan.minAmount} - ${selectedPlan.maxAmount}`);
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
        fetchUserDashboardData();
        setTimeout(() => { 
          setSuccess(false); 
          setSelectedPlan(null); 
          setAmount(""); 
        }, 2000);
      } else {
        setError(data.error || "Transaction Failed");
      }
    } catch (err) { setError("Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-10 pt-24 font-sans text-[#1E293B]">
      
      <div className="max-w-6xl mx-auto">
        {/* TOP BAR */}
        <div className="mb-12 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-[#0F172A] uppercase italic leading-none">
              Investment <span className="text-[#E11D48]">Plans</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Select a package to start earning daily profit</p>
          </div>

          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-4 bg-gray-50 hover:bg-white hover:shadow-xl hover:border-red-100 border border-transparent transition-all px-6 py-4 rounded-[1.8rem] group relative active:scale-95"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-tighter">My Active Plans</span>
              <span className="text-[9px] font-bold text-red-500 uppercase">View Portfolio</span>
            </div>
            <div className="h-12 w-12 bg-[#0F172A] group-hover:bg-[#E11D48] text-white rounded-2xl flex items-center justify-center text-lg font-black transition-colors shadow-lg shadow-gray-200">
              {userPlans.length}
            </div>
          </button>
        </div>

        {/* MAIN PLANS GRID */}
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
              <div className="space-y-4 mb-8 text-[11px] font-bold text-gray-400 uppercase border-t border-gray-50 pt-6">
                <div className="flex justify-between"><span>Min Deposit</span><span className="text-[#0F172A]">Rs. {plan.minAmount?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Max Deposit</span><span className="text-[#0F172A]">Rs. {plan.maxAmount?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Duration</span><span className="text-[#E11D48] bg-rose-50 px-3 py-1 rounded-full text-[10px] font-black">{plan.duration}</span></div>
              </div>
              <button onClick={() => setSelectedPlan(plan)} className="w-full py-4 bg-[#F8FAFC] text-[#0F172A] border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E11D48] hover:text-white transition-all flex items-center justify-center gap-2">
                Invest Now <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MY PLANS SIDE DRAWER */}
      <div className={`fixed inset-0 z-[400] transition-opacity duration-300 ${isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-[#0F172A] uppercase italic">My <span className="text-[#E11D48]">Portfolio</span></h2>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total {userPlans.length} Active Investments</p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-3 bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-red-500 transition-all">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {userPlans.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10">
                        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-4 text-gray-200">
                            <History size={32} />
                        </div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No Active Plans Found</p>
                    </div>
                ) : (
                    userPlans.map((up, idx) => {
                      // 🕒 TIMER LOGIC: Check if 24 hours passed since lastClaimedAt or createdAt
                      const lastClaim = up.lastClaimedAt ? new Date(up.lastClaimedAt) : new Date(up.createdAt);
                      const nextClaimDate = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
                      const isEligible = new Date() >= nextClaimDate;

                      return (
                        <div key={idx} className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 group hover:border-[#E11D48]/20 transition-all shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 font-black text-[#E11D48] text-xs">
                                    {up.roi || 0}% <span className="text-[8px] text-gray-400 uppercase">ROI</span>
                                </div>
                                <span className="text-[9px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                    <CheckCircle2 size={10} /> Active
                                </span>
                            </div>
                            <h4 className="text-lg font-black text-[#0F172A] uppercase mb-1">{up.planName || "Investment"}</h4>
                            
                            {/* Claim Button / Timer Logic */}
                            <div className="mt-2 mb-4">
                              {isEligible ? (
                                <button 
                                  disabled={claimingId === up.id}
                                  onClick={() => handleClaim(up.id)}
                                  className="w-full py-3 bg-[#0F172A] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E11D48] transition-all flex items-center justify-center gap-2"
                                >
                                  {claimingId === up.id ? <Loader2 className="animate-spin" size={12}/> : <Zap size={12} fill="currentColor"/>}
                                  {claimingId === up.id ? "Processing..." : "Claim Daily Profit"}
                                </button>
                              ) : (
                                <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl">
                                  <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                    <Clock size={12} className="text-[#E11D48]"/> Next Claim:
                                  </span>
                                  <span className="text-[10px] font-black text-[#0F172A]">
                                    {nextClaimDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white">
                                <div>
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1 tracking-widest">Invested</p>
                                    <p className="text-sm font-black text-[#0F172A]">Rs. {up.amount?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1 tracking-widest">Daily Return</p>
                                    <p className="text-sm font-black text-[#E11D48]">Rs. {(up.amount * (up.roi || 0) / 100).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                      )
                    })
                )}
            </div>
          </div>
      </div>

      {/* PURCHASE MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-[#0F172A]/80 backdrop-blur-md">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative animate-in zoom-in-95 shadow-2xl">
              <button onClick={() => {setSelectedPlan(null); setError(null); setAmount("");}} className="absolute top-6 right-6 text-gray-300 hover:text-red-500">
                <X size={20} />
              </button>
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-3">
                    {iconMap[selectedPlan.icon] || <Zap className="text-[#E11D48]" size={24} />}
                </div>
                <h3 className="text-xl font-black text-[#0F172A] uppercase italic leading-none">{selectedPlan.name}</h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Investment Activation</p>
              </div>
              
              {error && <div className="bg-rose-50 text-rose-600 text-[10px] font-black p-3 rounded-xl mb-4 border border-rose-100 text-center uppercase">{error}</div>}
              
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 space-y-2 text-[10px] font-black uppercase">
                <div className="flex justify-between items-center"><span className="text-gray-400">Profit Rate</span><span className="text-[#E11D48]">{selectedPlan.roi}% Daily</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400">Investment Range</span><span className="text-[#0F172A]">Rs.{selectedPlan.minAmount} - {selectedPlan.maxAmount}</span></div>
              </div>
              
              <div className="space-y-4">
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#E11D48] rounded-xl py-4 px-5 text-lg font-black outline-none transition-all placeholder:text-gray-200" placeholder="0.00" />
                <button onClick={handlePurchase} disabled={loading || success} className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${success ? "bg-green-500" : "bg-[#0F172A] hover:bg-black"} text-white shadow-xl active:scale-95 flex items-center justify-center gap-2`}>
                    {loading ? <Loader2 className="animate-spin" size={16} /> : success ? <CheckCircle2 size={16} /> : null}
                    {loading ? "Processing..." : success ? "Activated!" : "Confirm Investment"}
                </button>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}