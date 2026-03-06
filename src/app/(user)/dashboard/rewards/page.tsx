"use client";

import { Gift, Trophy, Users, TrendingUp, Target, History, CheckCircle, Clock, ChevronRight, Zap } from "lucide-react";
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
      const data = await res.json();
      if (res.ok) {
        alert("Reward claim submitted! Admin will review it shortly.");
        fetchRewardsData();
      } else {
        alert(data.error || "Failed to claim reward");
      }
    } catch (err) {
      alert("Network error while claiming reward");
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D48]"></div>
      </div>
    );
  }

  const currentProgress = userRewards?.milestoneProgress || 0;
  const nextReward = rewards.find(r => r.targetSales > currentProgress);
  const progressPercentage = nextReward ? (currentProgress / nextReward.targetSales) * 100 : 100;

  return (
    <div className="p-4 md:p-10 pt-24 max-w-6xl mx-auto bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0F172A] uppercase italic leading-none flex items-center gap-3">
            System <span className="text-[#E11D48]">Rewards</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-3 italic">Unlock milestones & Earn Prizes</p>
        </div>

        {/* Tab Navigation - Redesigned */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-full md:w-fit">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'rewards' ? 'bg-[#0F172A] text-white shadow-lg' : 'text-gray-400 hover:text-[#0F172A]'
            }`}
          >
            Milestones
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'history' ? 'bg-[#0F172A] text-white shadow-lg' : 'text-gray-400 hover:text-[#0F172A]'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === 'rewards' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#E11D48] transition-all">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Referrals</p>
                <h2 className="text-3xl font-black text-[#0F172A]">{userRewards?.referralCount || 0}</h2>
              </div>
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-[#E11D48] group-hover:bg-[#E11D48] group-hover:text-white transition-all">
                <Users size={24} />
              </div>
            </div>

            <div className="bg-[#0F172A] p-6 rounded-[2.5rem] shadow-xl flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Current Rank</p>
                <h2 className="text-3xl font-black text-white italic uppercase">{userRewards?.rankLevel || 'Starter'}</h2>
              </div>
              <Trophy className="h-10 w-10 text-[#E11D48] relative z-10" />
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#E11D48] opacity-10 rounded-full blur-2xl"></div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#E11D48] transition-all">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Progress Nodes</p>
                <h2 className="text-3xl font-black text-[#0F172A]">{currentProgress}</h2>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Target size={24} />
              </div>
            </div>
          </div>

          {/* Sponsor & Commission */}
          {(userRewards?.referrer || commissionRate !== null) && (
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your Sponsor</p>
                {userRewards?.referrer ? (
                  <p className="text-lg font-black text-[#0F172A]">{userRewards.referrer.name || userRewards.referrer.email}</p>
                ) : (
                  <p className="text-sm font-black text-gray-500">You don't have a sponsor yet. Share your referral link to invite someone.</p>
                )}
              </div>

              {commissionRate !== null && (
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your Commission Rate</p>
                  <p className="text-3xl font-black text-[#E11D48]">{(commissionRate * 100).toFixed(2)}%</p>
                </div>
              )}
            </div>
          )}

          {/* NEXT MILESTONE - FOCUS CARD */}
          {nextReward && (
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                <div className="flex-1">
                  <span className="bg-[#E11D48] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Next Objective</span>
                  <h2 className="text-3xl font-black text-[#0F172A] mt-4 uppercase italic">{nextReward.title}</h2>
                  <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-tight leading-relaxed max-w-md">{nextReward.description}</p>
                </div>
                
                <div className="w-full md:w-72 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 mb-3">
                    <span>Progress</span>
                    <span className="text-[#E11D48]">{currentProgress} / {nextReward.targetSales}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#E11D48] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_#E11D48]"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-center text-[10px] font-black text-[#0F172A] uppercase mt-4 tracking-widest">
                    Win: <span className="text-[#E11D48] text-sm">Rs. {nextReward.prizeAmount.toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ALL REWARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.map((reward) => (
              <div key={reward.id} className={`bg-white p-8 rounded-[2.5rem] border ${currentProgress >= reward.targetSales ? 'border-[#E11D48]' : 'border-gray-50'} shadow-sm group hover:shadow-xl transition-all`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-[#0F172A] transition-colors">
                    <Zap size={22} className="text-[#E11D48]" />
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Target: {reward.targetSales}</span>
                </div>
                
                <h3 className="text-xl font-black text-[#0F172A] uppercase italic mb-2">{reward.title}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed mb-6 h-8 line-clamp-2">{reward.description}</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <span className="text-2xl font-black text-[#0F172A] italic"><span className="text-[10px] not-italic mr-1 text-gray-300">Rs.</span>{reward.prizeAmount.toLocaleString()}</span>
                  
                  {currentProgress >= reward.targetSales ? (
                    <button
                      onClick={() => handleClaim(reward.id)}
                      disabled={claiming === reward.id}
                      className="bg-[#E11D48] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-black transition-all shadow-lg shadow-rose-100 flex items-center gap-2"
                    >
                      {claiming === reward.id ? <Clock size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      {claiming === reward.id ? "Processing" : "Claim Now"}
                    </button>
                  ) : (
                    <span className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest">
                      Locked: {reward.targetSales - currentProgress} to go
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-gray-50">
             <h2 className="text-xl font-black text-[#0F172A] uppercase italic flex items-center gap-3">
               <div className="w-1.5 h-6 bg-[#E11D48] rounded-full"></div>
               Referral Log
             </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                  <th className="py-6 px-8 text-left">Investor</th>
                  <th className="py-6 px-8 text-left">Package</th>
                  <th className="py-6 px-8 text-left">Commission</th>
                  <th className="py-6 px-8 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {referralHistory.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-6 px-8">
                      <div className="font-black text-[#0F172A] text-sm">{item.refereeName}</div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase italic">Joined: {new Date(item.refereeJoined).toLocaleDateString()}</div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="text-[10px] font-black text-[#0F172A] uppercase bg-gray-100 px-3 py-1 rounded-lg">{item.planBought}</span>
                    </td>
                    <td className="py-6 px-8">
                      <p className="text-sm font-black text-emerald-600">Rs. {item.commissionEarned}</p>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                        item.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {referralHistory.length === 0 && (
              <div className="text-center py-24">
                <Users size={48} className="mx-auto text-gray-100 mb-4" />
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">No Referral activity yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}