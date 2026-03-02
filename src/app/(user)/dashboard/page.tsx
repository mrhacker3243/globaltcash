"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Activity, 
  ShieldCheck, 
  ExternalLink 
} from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setUser(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load dashboard');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center p-10 text-red-500">
        {error || 'User not found'}
      </div>
    );
  }

  const actualDeposits = user.deposits.filter((d: any) => d.gateway !== "Internal Balance");
  const activePlans = user.deposits.filter(
    (d: any) => d.gateway === "Internal Balance" && d.status === "ACTIVE"
  );
  const totalDeposits = actualDeposits.reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const totalWithdrawals = user.withdrawals.reduce((acc: number, curr: any) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* CUSTOM STYLES INJECTED VIA STYLE TAG */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .neon-border {
          border: 1px solid rgba(34, 197, 94, 0.3);
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.05);
        }
        .neon-text {
          text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }
        .neon-button {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.5);
          color: #22c55e;
          transition: all 0.3s ease;
        }
        .neon-button:hover {
          background: #22c55e;
          color: black;
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 10px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.7s ease-out forwards;
        }
      `}</style>

      {/* Main Dashboard Container */}
      <div className="p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto w-full animate-fade-in custom-scrollbar">
        
        {/* 1. Header Section */}
        <div className="mb-10 flex flex-col gap-6">
          <div className="relative p-8 rounded-[2rem] glass-card neon-border overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-emerald-500 h-10 w-1.5 rounded-full shadow-[0_0_15px_#10b981]" />
                <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">
                  Account <span className="text-emerald-500 neon-text">Overview</span>
                </h1>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] ml-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                {user.email.split('@')[0]} • Online
              </p>
            </div>
          </div>
        </div>

        {/* 2. Primary Financial Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          
          {/* Main Balance Terminal */}
          <div className="glass-card neon-border p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden group col-span-1 md:col-span-2 min-h-[220px]">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] group-hover:bg-emerald-500/10 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] italic">Total Balance</p>
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                    <Wallet size={24} />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Balance</span>
                  <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tighter flex items-baseline gap-3">
                    <span className="text-emerald-500 italic opacity-80 text-xl md:text-3xl">Rs.</span>
                    {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10 backdrop-blur-xl">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                    <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">System Live</span>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/5 rounded-full border border-orange-500/10 backdrop-blur-xl">
                    <Activity size={12} className="text-orange-500" />
                    <span className="text-orange-500 text-[9px] font-black uppercase tracking-widest">Profit Optimized</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Global Statistics Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 col-span-1 md:col-span-2">
            {/* Total Inbound */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-5 rounded-[2rem] flex flex-col justify-between group hover:border-emerald-500/40 transition-all border border-white/5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform">
                  <ArrowDownCircle size={22} />
                </div>
                <span className="text-emerald-500/40 text-[9px] font-black italic">IN</span>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Deposits</p>
                <h3 className="text-2xl font-black text-white">Rs. {totalDeposits.toLocaleString()}</h3>
              </div>
            </div>

            {/* Total Outbound */}
            <div className="bg-gradient-to-br from-orange-500/10 to-transparent p-5 rounded-[2rem] flex flex-col justify-between group hover:border-orange-500/40 transition-all border border-white/5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-orange-500/20 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
                ... (truncated for brevity)
}
