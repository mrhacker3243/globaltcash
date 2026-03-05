"use client";

import { Zap, Trophy, Crown, X, Loader2, Clock, AlertCircle, Coins } from "lucide-react";
import { useState, useEffect } from "react";

const iconMap: Record<string, any> = {
  Zap: <Zap className="text-[#E11D48]" size={22} />,
  Trophy: <Trophy className="text-[#E11D48]" size={22} />,
  Crown: <Crown className="text-[#E11D48]" size={22} />,
};

function CountdownTimer({ nextClaimTime, onZero }: { nextClaimTime: number; onZero?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = nextClaimTime - now;
      const newTimeLeft = Math.max(0, diff);
      setTimeLeft(newTimeLeft);
      if (newTimeLeft <= 0 && onZero) {
        onZero();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextClaimTime, onZero]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  if (timeLeft <= 0) {
    return <div className="text-[10px] font-bold text-green-600 uppercase">Claim Available!</div>;
  }

  return (
    <div className="text-[10px] font-bold text-gray-400 uppercase">
      Next claim in: {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default function PlansPage() {
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
      if (data.activePlans) {
        setUserPlans(data.activePlans);
        // compute overall totals
        let claimedSum = 0;
        let pendingSum = 0;
        data.activePlans.forEach((p: any) => {
          claimedSum += p.claimedAmount || 0;
          pendingSum += p.pendingAmount || 0;
        });
        setTotalClaimed(claimedSum);
        setTotalPending(pendingSum);
      }
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

  const handlePurchase = async () => {
    if (!amount || !selectedPlan) return;
    
    const numAmount = parseFloat(amount);
    if (numAmount < selectedPlan.minAmount || numAmount > selectedPlan.maxAmount) {
      alert(`Amount must be between Rs ${selectedPlan.minAmount} and Rs ${selectedPlan.maxAmount}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/plans/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName: selectedPlan.name, amount: numAmount })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Plan purchased successfully!");
        setSelectedPlan(null);
        setAmount("");
        fetchUserDashboardData();
      } else {
        alert(data.error || "Purchase failed");
      }
    } catch (err) {
      alert("Error purchasing plan");
    } finally {
      setLoading(false);
    }
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
            <div className="mb-4 text-[12px] font-bold">
              Total Claimed: Rs. {totalClaimed.toFixed(0)} | Total Pending: Rs. {totalPending.toFixed(0)}
            </div>
            {userPlans.map((up, idx) => {
              const lastClaim = up.lastClaimedAt ? new Date(up.lastClaimedAt) : new Date(up.createdAt);
              const pendingDays = up.pendingDays ?? Math.floor((new Date().getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24));
              const claimedAmt = up.claimedAmount || 0;
              const pendingAmt = up.pendingAmount || 0;
              const totalAvailable = claimedAmt + pendingAmt;
              const percentClaimed = totalAvailable > 0 ? (claimedAmt / totalAvailable) * 100 : 0;
              return (
                <div key={idx} className="bg-gray-50 p-6 rounded-3xl mb-4 border border-gray-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-[#E11D48]">{up.planName}</span>
                    {pendingDays >= 1 && <span className="text-[9px] font-black bg-red-500 text-white px-2 py-1 rounded-full">{pendingDays} Days Pending</span>}
                  </div>
                  <h4 className="text-lg font-black italic">Rs. {up.amount}</h4>
                  <div className="text-[10px] mt-2">
                    <div>Claimed: Rs. {claimedAmt.toFixed(0)}</div>
                    <div>Pending: Rs. {pendingAmt.toFixed(0)}</div>
                    {totalAvailable > 0 && (
                      <div>Progress: {percentClaimed.toFixed(1)}%</div>
                    )}
                  </div>
                  <div className="mt-4">
                    {pendingDays >= 1 ? (
                      <button onClick={() => handleClaim(up.id)} disabled={claimingId === up.id} className="w-full py-3 bg-[#0F172A] text-white rounded-xl font-black text-[10px] uppercase">
                        {claimingId === up.id ? "Claiming..." : `Claim Rs. ${pendingAmt.toFixed(0)}`}
                      </button>
                    ) : (
                      <CountdownTimer nextClaimTime={lastClaim.getTime() + 24 * 60 * 60 * 1000} onZero={fetchUserDashboardData} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedPlan(null)} />
          <div className="relative bg-white p-8 rounded-[2rem] shadow-2xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase">Invest in <span className="text-[#E11D48]">{selectedPlan.name}</span></h2>
              <X className="cursor-pointer" onClick={() => setSelectedPlan(null)} />
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                {iconMap[selectedPlan.icon] || <Zap className="text-[#E11D48]" size={24} />}
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-black">{selectedPlan.roi}%</span>
                <span className="text-sm font-bold text-[#E11D48] uppercase">/ Day</span>
              </div>
              <p className="text-sm font-bold text-gray-400">MIN: Rs {selectedPlan.minAmount} | MAX: Rs {selectedPlan.maxAmount}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Investment Amount (Rs)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount between ${selectedPlan.minAmount} - ${selectedPlan.maxAmount}`}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E11D48] focus:border-transparent"
                min={selectedPlan.minAmount}
                max={selectedPlan.maxAmount}
              />
            </div>

            <button
              onClick={handlePurchase}
              disabled={loading || !amount}
              className="w-full py-4 bg-[#0F172A] text-white rounded-xl font-black text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Invest Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}