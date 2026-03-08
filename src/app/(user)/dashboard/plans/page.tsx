"use client";

import { Zap, Trophy, Crown, X, Loader2, Clock, AlertCircle, Coins, ArrowRight, LayoutDashboard, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Icon mapping to prevent hydration errors with dynamic components
const iconMap: Record<string, any> = {
  Zap: Zap,
  Trophy: Trophy,
  Crown: Crown,
};

function CountdownTimer({ nextClaimTime, onZero }: { nextClaimTime: number; onZero?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = nextClaimTime - now;
      const newTimeLeft = Math.max(0, diff);
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft > 0) {
        timeoutId = setTimeout(updateTimer, 1000);
      } else if (onZero) { 
        onZero(); 
      }
    };
    updateTimer();
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [nextClaimTime, onZero]);

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  if (timeLeft <= 0) return <div className="text-[9px] font-black text-emerald-500 uppercase italic">Claim Ready!</div>;

  return (
    <div className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5">
      <Clock size={10} className="text-[#E11D48]" />
      {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default function PlansPage() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<any[]>([]);
  const [userPlans, setUserPlans] = useState<any[]>([]);
  const [totalClaimed, setTotalClaimed] = useState<number>(0);
  const [totalPending, setTotalPending] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
    if (session) fetchUserDashboardData();
  }, [session]);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      if (Array.isArray(data)) setPlans(data);
    } catch (err) { console.error(err); }
  };

  const fetchUserDashboardData = async () => {
    try {
      const res = await fetch('/api/user/dashboard');
      const data = await res.json();
      if (data.activePlans) {
        setUserPlans(data.activePlans);
        let cSum = 0, pSum = 0;
        data.activePlans.forEach((p: any) => {
          cSum += p.claimedAmount || 0;
          pSum += p.pendingAmount || 0;
        });
        setTotalClaimed(cSum); 
        setTotalPending(pSum);
      }
    } catch (err) { console.error(err); }
  };

  const handleClaim = async (depositId: string) => {
    setClaimingId(depositId);
    try {
      const res = await fetch("/api/user/claim-profit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositId })
      });
      if (res.ok) fetchUserDashboardData();
    } catch (err) { console.error(err); }
    finally { setClaimingId(null); }
  };

  const handlePurchase = async () => {
    if (!session) { alert("Please login to invest"); return; }
    if (!amount || !selectedPlan) return;
    setLoading(true);
    try {
      const res = await fetch("/api/plans/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName: selectedPlan.name, amount: parseFloat(amount) })
      });
      if (res.ok) {
        setSelectedPlan(null); 
        setAmount(""); 
        fetchUserDashboardData();
      } else {
        const d = await res.json(); 
        alert(d.error);
      }
    } catch (err) { alert("Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-3 md:p-10 pt-20 md:pt-28 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* RESPONSIVE HEADER */}
        <div className="mb-6 md:mb-10 bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div>
            <h1 className="text-xl md:text-3xl font-black italic uppercase text-[#0F172A]">
              Investment <span className="text-[#E11D48]">Plans</span>
            </h1>
            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Earn Daily Profits</p>
          </div>

          <div className="w-full sm:w-auto">
            {session ? (
              <button 
                onClick={() => setIsDrawerOpen(true)} 
                className="w-full bg-[#0F172A] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
              >
                <LayoutDashboard size={14} className="text-[#E11D48]"/> My Plans ({userPlans.length})
              </button>
            ) : (
              <Link 
                href="/login" 
                className="w-full inline-flex bg-[#E11D48] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest items-center justify-center gap-2 shadow-lg"
              >
                <LogIn size={14} /> Get Started
              </Link>
            )}
          </div>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {plans.map((plan, i) => {
            const IconComp = iconMap[plan.icon] || Zap;
            return (
              <div key={i} className="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-50 shadow-sm group hover:border-[#E11D48] transition-all relative overflow-hidden">
                <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0F172A] transition-colors">
                  <IconComp className="text-[#E11D48]" size={22} />
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase text-[#0F172A] italic">{plan.name}</h3>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl md:text-5xl font-black tracking-tighter">{plan.roi}%</span>
                  <span className="text-[10px] font-black text-[#E11D48] uppercase italic">Daily</span>
                </div>
                <div className="space-y-1 mb-6">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Min: <span className="text-slate-900">Rs {plan.minAmount}</span></p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Max: <span className="text-slate-900">Rs {plan.maxAmount}</span></p>
                </div>
                <button 
                  onClick={() => setSelectedPlan(plan)} 
                  className="w-full py-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-[#E11D48] group-hover:text-white transition-all shadow-sm"
                >
                  Invest Now
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* DRAWER FOR MY PLANS */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-[320px] md:max-w-md bg-white h-full p-6 md:p-10 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-black uppercase italic">Active <span className="text-[#E11D48]">Plans</span></h2>
              <button onClick={() => setIsDrawerOpen(false)}><X size={20} className="text-slate-300" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8 text-center">
               <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Claimed</p>
                  <p className="text-xs font-black text-slate-900">Rs {totalClaimed.toFixed(0)}</p>
               </div>
               <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100">
                  <p className="text-[8px] font-black text-[#E11D48] uppercase tracking-widest mb-1">Pending</p>
                  <p className="text-xs font-black text-[#E11D48]">Rs {totalPending.toFixed(0)}</p>
               </div>
            </div>

            <div className="space-y-4">
              {userPlans.map((up, idx) => (
                <div key={idx} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm">
                  <div className="flex justify-between text-[9px] font-black uppercase mb-2">
                    <span className="text-slate-400">{up.planName}</span>
                    <span className="text-[#E11D48]">{up.pendingDays}d pending</span>
                  </div>
                  <h4 className="text-lg font-black italic text-slate-900">Rs {up.amount.toLocaleString()}</h4>
                  <div className="mt-4">
                    {up.pendingDays >= 1 ? (
                      <button 
                        onClick={() => handleClaim(up.id)} 
                        disabled={claimingId === up.id} 
                        className="w-full py-3 bg-[#E11D48] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-rose-100"
                      >
                        {claimingId === up.id ? "Syncing..." : `Claim Rs ${up.pendingAmount?.toFixed(0)}`}
                      </button>
                    ) : (
                      <div className="bg-slate-50 py-2 px-4 rounded-xl border border-slate-100 flex justify-center">
                        <CountdownTimer nextClaimTime={up.nextClaimTime} onZero={fetchUserDashboardData} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PURCHASE MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedPlan(null)} />
          <div className="relative bg-white p-6 md:p-10 rounded-[2rem] shadow-2xl max-w-sm w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black uppercase italic">Confirm <span className="text-[#E11D48]">Invest</span></h2>
              <X className="cursor-pointer text-slate-300" onClick={() => setSelectedPlan(null)} />
            </div>
            
            <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase">{selectedPlan.name}</p>
              <p className="text-xl font-black text-[#0F172A] italic">{selectedPlan.roi}% Daily Profit</p>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 italic">Enter Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Range: ${selectedPlan.minAmount} - ${selectedPlan.maxAmount}`}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E11D48] text-sm font-black"
              />
            </div>

            <button
              onClick={handlePurchase}
              disabled={loading || !amount}
              className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#E11D48] transition-all disabled:opacity-30"
            >
              {loading ? "Allocating..." : "Confirm Investment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
