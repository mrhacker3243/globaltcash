"use client";

import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Activity, ShieldCheck, Zap, TrendingUp, Clock, Loader2 } from "lucide-react";

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/user/dashboard');
        const data = await res.json();
        if (data.error) setError(data.error);
        else setUser(data);
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3F4F6]">
      <Loader2 className="animate-spin text-[#E11D48]" size={40} />
    </div>
  );

  if (error || !user) return (
    <div className="text-center p-10 text-[#E11D48] font-bold bg-[#F3F4F6] min-h-screen flex items-center justify-center italic uppercase tracking-widest">
      {error || 'User not found'}
    </div>
  );

  // ✅ --- ULTIMATE LOGIC FIX ---
  const depositsArray = user?.deposits || [];
  const withdrawalsArray = user?.withdrawals || [];

  // 1. Inbound Equity (Asli Deposit): Sirf wo jin mein planName NAHI HAI (null hai)
  const actualDeposits = depositsArray.filter((d: any) => !d.planName && d.status === "APPROVED");

  // 2. Active Plans: Sirf wo jin mein planName HAI aur status ACTIVE hai
  const activePlans = depositsArray.filter((d: any) => d.planName && (d.status === "ACTIVE" || d.status === "APPROVED"));
  
  // 3. Stats Calculation
  const totalDeposits = actualDeposits.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
  const totalWithdrawals = withdrawalsArray.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#1F2937] font-sans selection:bg-[#E11D48]/10">
      <div className="p-4 md:p-8 lg:p-10 pt-24 lg:pt-10 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-[#111827]">
              Command <span className="text-[#E11D48]">Center</span>
            </h1>
            <p className="text-[#6B7280] text-[10px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              {user?.email?.split('@')[0]} • System Operational
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#E5E7EB]">
             <ShieldCheck size={18} className="text-[#E11D48]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-[#4B5563]">Verified Account</span>
          </div>
        </div>

        {/* Balance Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-[#111827] p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E11D48]/10 blur-[100px] -mr-20 -mt-20 group-hover:bg-[#E11D48]/15 transition-all duration-700" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="px-4 py-1.5 bg-[#E11D48] rounded-full">
                    <p className="text-white text-[9px] font-black uppercase tracking-[0.2em]">Live Assets</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[#E11D48]">
                    <Wallet size={28} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em] ml-1">Total Trading Balance</p>
                  <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter flex items-baseline gap-4">
                    <span className="text-[#E11D48] italic opacity-90 text-2xl md:text-4xl">Rs.</span>
                    {(user?.balance || 0).toLocaleString()}
                  </h3>
                </div>
              </div>
              <div className="mt-12 flex flex-wrap gap-4 pt-8 border-t border-white/5">
                 <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl">
                    <TrendingUp size={16} className="text-[#E11D48]" />
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Optimized Returns</span>
                 </div>
                 <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl">
                    <Zap size={16} className="text-[#E11D48] fill-[#E11D48]" />
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Instant Liquidity</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-[#E5E7EB] shadow-xl">
                <div className="flex items-center gap-5 mb-6">
                   <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100"><ArrowDownCircle size={24} /></div>
                   <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-widest">Inbound Equity</p>
                </div>
                <h4 className="text-3xl font-black text-[#111827]">Rs. {totalDeposits.toLocaleString()}</h4>
             </div>

             <div className="bg-white p-8 rounded-[2.5rem] border border-[#E5E7EB] shadow-xl">
                <div className="flex items-center gap-5 mb-6">
                   <div className="p-4 bg-rose-50 rounded-2xl text-[#E11D48] border border-rose-100"><ArrowUpCircle size={24} /></div>
                   <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-widest">Total Payouts</p>
                </div>
                <h4 className="text-3xl font-black text-[#111827]">Rs. {totalWithdrawals.toLocaleString()}</h4>
             </div>
          </div>
        </div>

        {/* Active Nodes Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-[#111827] p-8 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
             <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-[#E11D48] rounded-2xl"><Activity size={24} strokeWidth={3} /></div>
                <div>
                   <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Protocol Stats</p>
                   <h3 className="text-xl font-black uppercase italic tracking-tighter">Active <span className="text-[#E11D48]">Plans</span></h3>
                </div>
             </div>
             <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                   <h4 className="text-4xl font-black text-white italic">{activePlans.length} <span className="text-xs font-bold not-italic text-white/40 uppercase tracking-widest ml-2">Active Plans</span></h4>
                </div>
                <div className="flex items-center gap-3 px-2">
                   <Clock size={14} className="text-[#E11D48]" />
                   <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Profit cycle running 24/7</p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-[3rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
             <h2 className="text-xl font-black uppercase italic tracking-tighter text-[#111827] mb-10">Transaction <span className="text-[#E11D48]">Ledger</span></h2>
             {actualDeposits.length === 0 ? (
                <div className="text-center py-20 bg-[#F9FAFB] rounded-[2.5rem] border-2 border-dashed border-[#E5E7EB] flex flex-col items-center gap-4">
                  <Activity size={32} className="text-[#D1D5DB]" />
                  <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.4em]">Zero Operations Logged</p>
                </div>
             ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {actualDeposits.map((dep: any) => (
                    <div key={dep.id} className="flex items-center justify-between p-5 bg-[#F9FAFB] border border-[#F3F4F6] rounded-[1.5rem] hover:border-[#E11D48]/30 transition-all group">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-[#E5E7EB] group-hover:text-[#E11D48] shadow-sm"><ArrowDownCircle size={20} /></div>
                        <div>
                          <p className="text-sm font-black uppercase text-[#111827] tracking-tight">{dep.gateway || 'Deposit'}</p>
                          <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest italic">{new Date(dep.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-[#111827] italic">+Rs. {(dep.amount || 0).toLocaleString()}</p>
                        <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${dep.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#FFF1F2] text-[#E11D48]'}`}>{dep.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;