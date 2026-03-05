"use client";

import { Zap, Trophy, Crown, X, Loader2, Clock, AlertCircle, Coins } from "lucide-react";
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
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
    fetchUserDashboardData();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      if (Array.isArray(data)) setPlans(data);
    } catch (err) { console.error("Fetch Plans Error:", err); }
  };

  const fetchUserDashboardData = async () => {
    try {
      const res = await fetch('/api/user/dashboard');
      const data = await res.json();
      if (data.activePlans) setUserPlans(data.activePlans);
    } catch (err) { console.error("Sync Error:", err); }
  };

  const handleClaim = async (depositId: string) => {
    setClaimingId(depositId);
    try {
      const res = await fetch("/api/user/claim-profit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositId })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Rs. ${data.amount} claimed for ${data.claimedDays} day(s)!`);
        fetchUserDashboardData();
      } else {
        alert(data.error || "Claim failed");
      }
    } catch (err) { alert("Error"); }
    finally { setClaimingId(null); }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header with Claim Button */}
        <div className="mb-10 bg-white p-6 rounded-[2rem] shadow-sm flex justify-between items-center">
          <h1 className="text-2xl font-black italic uppercase">Investment <span className="text-[#E11D48]">Plans</span></h1>
          <button onClick={() => setIsDrawerOpen(true)} className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
            <Coins size={18}/> My Portfolio ({userPlans.length})
          </button>
        </div>

        {/* Plans Display Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col group transition-all hover:shadow-lg">
              <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                {iconMap[plan.icon] || <Zap className="text-[#E11D48]" />}
              </div>
              <h3 className="text-xl font-black uppercase text-[#0F172A]">{plan.name}</h3>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-black">{plan.roi}%</span>
                <span className="text-xs font-bold text-[#E11D48] uppercase">/ Day</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 mb-6 tracking-widest">MIN: RS {plan.minAmount} | MAX: RS {plan.maxAmount}</p>
              <button onClick={() => setSelectedPlan(plan)} className="w-full py-4 bg-[#F8FAFC] rounded-xl font-black text-[10px] uppercase hover:bg-[#E11D48] hover:text-white transition-all">
                Invest Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Drawer for Claims */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full p-8 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase">My <span className="text-[#E11D48]">Portfolio</span></h2>
              <X className="cursor-pointer" onClick={() => setIsDrawerOpen(false)} />
            </div>
            {userPlans.map((up, idx) => {
              const lastClaim = up.lastClaimedAt ? new Date(up.lastClaimedAt) : new Date(up.createdAt);
              const pendingDays = Math.floor((new Date().getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={idx} className="bg-gray-50 p-6 rounded-3xl mb-4 border border-gray-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-[#E11D48]">{up.planName}</span>
                    {pendingDays >= 1 && <span className="text-[9px] font-black bg-red-500 text-white px-2 py-1 rounded-full">{pendingDays} Days Pending</span>}
                  </div>
                  <h4 className="text-lg font-black italic">Rs. {up.amount}</h4>
                  <div className="mt-4">
                    {pendingDays >= 1 ? (
                      <button onClick={() => handleClaim(up.id)} disabled={claimingId === up.id} className="w-full py-3 bg-[#0F172A] text-white rounded-xl font-black text-[10px] uppercase">
                        {claimingId === up.id ? "Claiming..." : `Claim Rs. ${(up.amount * up.roi/100 * pendingDays).toFixed(0)}`}
                      </button>
                    ) : (
                      <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase"><Clock size={12}/> Next profit in less than 24h</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}