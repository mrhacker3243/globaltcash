"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Loader2, UserCircle, ArrowUpCircle, MessageCircle, Send, X 
} from "lucide-react";
import Link from 'next/link';

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/user/dashboard', { cache: "no-store" });
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
    <div className="text-center p-10 text-[#E11D48] font-bold bg-[#F3F4F6] min-h-screen flex items-center justify-center">
      {error || 'User not found'}
    </div>
  );

  const rawName = user?.name || (user?.email ? user.email.split('@')[0] : "User");
  const userDisplayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  // Stats Logic
  const depositsArray = user?.deposits || [];
  const withdrawalsArray = user?.withdrawals || [];
  const activePlans = user?.activePlans || [];

  const actualDeposits = depositsArray.filter(
    (d: any) => d.status === "ACTIVE" && d.planName !== "Manual Deposit"
  );

  const totalDepositsValue = actualDeposits.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
  const totalWithdrawalsValue = withdrawalsArray.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#1F2937] font-sans pb-20">
      <div className="p-4 md:p-8 lg:p-10 pt-24 lg:pt-10 max-w-[1400px] mx-auto w-full">
        
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#E11D48] shadow-lg">
              <UserCircle size={40} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[#E11D48] text-[10px] font-black uppercase tracking-[0.4em] mb-1">Verified Account</p>
              <h1 className="text-3xl md:text-5xl font-black uppercase italic text-[#111827]">
                Welcome, <span className="text-[#E11D48]">{userDisplayName}</span>
              </h1>
            </div>
          </div>
        </div>

        {/* UPDATED: QUICK ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           {/* REDIRECT UPDATED HERE */}
           <Link href="/dashboard/withdraw" className="flex items-center justify-center gap-2 bg-white p-5 rounded-[2rem] shadow-sm border border-gray-200 active:scale-95 transition-all cursor-pointer">
              <ArrowUpCircle className="text-[#E11D48]" size={20} />
              <span className="font-black text-xs uppercase tracking-widest">Withdraw</span>
           </Link>
           
           <button 
             onClick={() => setShowSupport(true)}
             className="flex items-center justify-center gap-2 bg-[#111827] text-white p-5 rounded-[2rem] shadow-lg active:scale-95 transition-all"
           >
              <MessageCircle className="text-[#E11D48]" size={20} />
              <span className="font-black text-xs uppercase tracking-widest">Support</span>
           </button>
        </div>

        {/* MAIN CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* BALANCE CARD */}
          <div className="lg:col-span-2 bg-[#111827] p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="px-4 py-2 bg-[#E11D48] rounded-xl text-white text-[10px] font-black uppercase">
                Available Balance
              </div>
              <Wallet className="text-white/20" size={40} />
            </div>
            <h3 className="text-5xl md:text-8xl font-black text-white italic">
              <span className="text-[#E11D48] text-xl md:text-4xl mr-4 not-italic font-bold">Rs.</span>
              {(user?.balance || 0).toLocaleString()}
            </h3>
          </div>

          {/* SIDE STATS CARDS */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-8 rounded-[3rem] border border-[#E5E7EB] shadow-sm">
              <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-widest mb-2">Total Invested</p>
              <h4 className="text-4xl font-black text-[#111827]">Rs. {totalDepositsValue.toLocaleString()}</h4>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-[#E5E7EB] shadow-sm">
              <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-widest mb-2">Total Withdrawn</p>
              <h4 className="text-4xl font-black text-[#111827]">Rs. {totalWithdrawalsValue.toLocaleString()}</h4>
            </div>
          </div>
        </div>

        {/* ACTIVE PLAN CARD */}
        <div className="bg-[#111827] p-10 rounded-[3rem] text-white text-center">
          <h3 className="text-2xl font-black uppercase italic tracking-tight mb-6">
            My <span className="text-[#E11D48]">Plans</span>
          </h3>
          <h4 className="text-6xl font-black">{activePlans.length}</h4>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2">Active Plans</p>
        </div>

      </div>

      {/* SUPPORT MODAL */}
      {showSupport && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3.5rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowSupport(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} className="text-gray-400" />
            </button>
            
            <div className="text-center mb-10">
               <div className="w-20 h-20 bg-rose-50 text-[#E11D48] rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <MessageCircle size={40} />
               </div>
               <h3 className="text-3xl font-black text-[#111827] uppercase italic leading-none">Support</h3>
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">Choose a platform</p>
            </div>

            <div className="space-y-4">
              <a href="https://t.me/GlobalTrustCash" target="_blank" className="flex items-center justify-between bg-[#F3F4F6] p-6 rounded-3xl hover:bg-[#0088cc] hover:text-white transition-all group">
                <div className="flex items-center gap-4 font-black uppercase text-xs tracking-widest">
                  <Send className="text-[#0088cc] group-hover:text-white" size={20} />
                  Telegram
                </div>
                <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
              </a>
              
              <a href="https://wa.me/923000000000" target="_blank" className="flex items-center justify-between bg-[#F3F4F6] p-6 rounded-3xl hover:bg-[#25D366] hover:text-white transition-all group">
                <div className="flex items-center gap-4 font-black uppercase text-xs tracking-widest">
                  <MessageCircle className="text-[#25D366] group-hover:text-white" size={20} />
                  WhatsApp
                </div>
                <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;