"use client";

import { Users, CheckCircle, Clock, Trophy, History, Zap } from "lucide-react";
import { useState, useEffect } from "react";

interface Reward {
  id: string;
  title: string;
  description: string;
  targetSales: number;
  prizeAmount: number;
  prizeType: string;
}

interface UserRewards {
  referralCount: number;
  rankLevel: string;
  milestoneProgress: number;
  referrer?: {
    id: string;
    name?: string | null;
    email: string;
  };
}

interface ReferralHistory {
  date: string;
  refereeName: string;
  refereeJoined: string;
  planBought: string;
  planAmount: number;
  commissionEarned: number;
  status: string;
}

export default function RewardsPage() {
  const [userRewards, setUserRewards] = useState<UserRewards | null>(null);
  const [commissionRate, setCommissionRate] = useState<number | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [referralHistory, setReferralHistory] = useState<ReferralHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');

  useEffect(() => {
    fetchRewardsData();
    fetchReferralHistory();
  }, []);

  const fetchRewardsData = async () => {
    try {
      const res = await fetch("/api/user/rewards");
      const data = await res.json();
      if (data.user) setUserRewards(data.user);
      if (typeof data.commissionRate === 'number') setCommissionRate(data.commissionRate);
      if (data.rewards) setRewards(data.rewards);
    } catch (err) {
      console.error("Rewards Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralHistory = async () => {
    try {
      const res = await fetch("/api/user/referral-history");
      const data = await res.json();
      if (Array.isArray(data)) setReferralHistory(data);
    } catch (err) {
      console.error("History Fetch Error:", err);
    }
  };

  const handleClaim = async (rewardId: string) => {
    if (claiming) return;
    setClaiming(rewardId);
    try {
      const res = await fetch("/api/user/claim-reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId })
      });
      if (res.ok) {
        alert("Reward claim submitted!");
        fetchRewardsData();
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F4F6]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E11D48]"></div>
      </div>
    );
  }

  const current = userRewards?.milestoneProgress ?? 0;

  const formatNum = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
  };

  return (
    <div className="p-3 sm:p-6 md:p-10 pt-24 min-h-screen bg-[#F3F4F6] font-sans text-[#1F2937]">
      
      {/* 1. Header & Navigation */}
      <div className="max-w-6xl mx-auto mb-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#111827] uppercase italic tracking-tighter leading-none">
              RANK<span className="text-[#E11D48]">REWARDS</span>
            </h1>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2 italic">Official Milestone Tracking</p>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'rewards' ? 'bg-[#E11D48] text-white shadow-lg' : 'text-gray-400'
              }`}
            >
              Milestones
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'history' ? 'bg-[#111827] text-white shadow-lg' : 'text-gray-400'
              }`}
            >
              Log
            </button>
          </div>
        </div>

        {/* 2. Stats Summary Card (UPGRADED) */}
        {activeTab === 'rewards' && (
          <div className="bg-[#111827] p-6 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E11D48]/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <div className="bg-rose-500/10 p-1.5 rounded-lg border border-rose-500/20">
                    <Zap size={14} className="text-rose-500 fill-rose-500" />
                  </div>
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Active Performance</p>
                </div>
                
                <div className="flex flex-col">
                  <h2 className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter leading-tight">
                    Rs. {current.toLocaleString()}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <span className="h-[2px] w-4 bg-[#E11D48] rounded-full" />
                    <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.3em] italic">Total Revenue Sales</span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

              <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-[2rem] text-center sm:text-right min-w-[140px]">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Commission</p>
                <p className="text-2xl font-black text-[#E11D48] italic tracking-tight">{(commissionRate || 0) * 100}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'rewards' ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700 pb-10">
          {(() => {
            const defaultRankCards = [
              { id: "1", rank: "Rank 01", title: "Bronze Plan", target: 50000, reward: "Tecno Spark 20", image: "https://fdn2.gsmarena.com/vv/pics/tecno/tecno-spark-20-pro-1.jpg" },
              { id: "2", rank: "Rank 02", title: "Silver Plan", target: 110000, reward: "Core i5 Laptop", image: "https://laptoplelo.com/wp-content/uploads/2020/02/8f3e4d6b3a9a705042a1eda3cff6d405.jpg" },
              { id: "3", rank: "Rank 03", title: "Gold Plan", target: 500000, reward: "Honda CD 70", image: "https://getemi.pk/wp-content/uploads/2019/03/Honda-cd-70-10.png" },
              { id: "4", rank: "Rank 04", title: "Platinum Plan", target: 800000, reward: "Honda CG 125", image: "https://cache4.pakwheels.com/system/bike_model_pictures/3822/original/_000000_-_Red.jpg?1761657733" },
              { id: "5", rank: "Rank 05", title: "Diamond Plan", target: 3000000, reward: "Suzuki Mehran", image: "https://suzukiislamabad.pk/media/colors/mehran/car/gray.png" },
              { id: "6", rank: "Rank 06", title: "Legendary Plan", target: 10000000, reward: "Honda Civic", image: "https://www.cnet.com/a/img/resize/4f704850f47fbf8cdec101401c05aa4fd2c813c5/hub/2021/04/22/7b1b5388-899a-4d4e-9f39-22d5460d32f5/2022-honda-civic-sedan-ogi1.jpg?auto=webp&fit=crop&height=675&width=1200" },
            ];

            const rankCards = rewards.length ? rewards.map((r, i) => ({
              id: r.id, rank: `Rank 0${i+1}`, title: r.title, target: r.targetSales, reward: r.prizeType || r.title, image: defaultRankCards[i]?.image || defaultRankCards[0].image
            })) : defaultRankCards;

            const nextIdx = rankCards.findIndex(c => current < c.target);
            const activeIdx = nextIdx === -1 ? rankCards.length - 1 : nextIdx;

            return rankCards.map((card, index) => {
              const isCompleted = current >= card.target;
              const isActive = index === activeIdx && !isCompleted;
              const isLocked = index > activeIdx;
              const progress = isCompleted ? 100 : Math.min(100, (current / card.target) * 100);

              return (
                <div key={card.id} className={`group bg-white rounded-[2.5rem] border border-gray-200 p-5 sm:p-7 shadow-sm transition-all duration-500 flex flex-col ${isActive ? 'ring-2 ring-[#E11D48] bg-gradient-to-b from-white to-rose-50/20 shadow-xl' : ''} ${isLocked ? 'opacity-60' : ''}`}>
                  
                  <div className="relative w-full aspect-square bg-[#F9FAFB] rounded-3xl mb-6 overflow-hidden border border-gray-100 flex items-center justify-center p-6">
                    <img src={card.image} alt={card.title} className={`max-h-full object-contain transition-transform duration-700 group-hover:scale-105 ${isLocked ? 'grayscale opacity-20' : ''}`} />
                    {isCompleted && (
                       <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                         <CheckCircle size={14} />
                       </div>
                    )}
                  </div>

                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-[#E11D48] uppercase tracking-tighter">{card.rank}</span>
                      <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isCompleted ? 'bg-emerald-100 text-emerald-600' : isActive ? 'bg-rose-100 text-[#E11D48]' : 'bg-gray-100 text-gray-400'}`}>
                        {isCompleted ? 'Unlocked' : isActive ? 'Active' : 'Locked'}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#111827] italic uppercase tracking-tighter leading-tight">{card.title}</h3>

                    <div className="space-y-2 mt-auto">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Progress</p>
                            <p className="text-sm font-black text-[#111827] italic">
                              Rs. {formatNum(isCompleted ? card.target : current)} <span className="text-gray-300 mx-1">/</span> {formatNum(card.target)}
                            </p>
                         </div>
                         {isActive && <span className="text-[10px] font-black text-[#E11D48]">{Math.floor(progress)}%</span>}
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                        <div 
                          className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-[#E11D48]'}`} 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>

                    <div className={`mt-4 p-4 rounded-2xl border ${isActive ? 'bg-[#111827] border-[#111827]' : 'bg-gray-50 border-gray-100'}`}>
                      <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Prize Reward</p>
                      <p className={`text-xs font-black italic ${isActive ? 'text-white' : 'text-[#111827]'}`}>{card.reward}</p>
                      {isCompleted && (
                        <button 
                          onClick={() => handleClaim(card.id)} 
                          className="w-full mt-3 py-3 bg-[#E11D48] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#BE123C] transition-all"
                        >
                          {claiming === card.id ? 'Processing...' : 'Claim Now'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4 animate-in slide-in-from-bottom-4 duration-500 pb-10">
           {referralHistory.map((item, idx) => (
             <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#E11D48] border border-gray-100">
                  <Users size={20} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                   <h4 className="font-black text-[#111827] text-sm uppercase italic">{item.refereeName}</h4>
                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Joined: {new Date(item.refereeJoined).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-6 border-t sm:border-none pt-3 sm:pt-0 w-full sm:w-auto justify-between">
                   <div className="text-right">
                      <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Commission</p>
                      <p className="text-sm font-black text-emerald-600">Rs. {item.commissionEarned}</p>
                   </div>
                   <div className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${item.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {item.status}
                   </div>
                </div>
             </div>
           ))}
           {referralHistory.length === 0 && (
             <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
               <History size={40} className="mx-auto text-gray-200 mb-4" />
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No activity log found</p>
             </div>
           )}
        </div>
      )}

      <footer className="mt-16 text-center pb-10">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em] italic">Official Rewards Registry &bull; 2026</p>
      </footer>
    </div>
  );
}