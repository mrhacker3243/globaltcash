"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Loader2, UserCircle, ArrowUpCircle, MessageCircle, Send, X, 
  History, ArrowDownCircle, ShoppingBag, Zap, CreditCard, TrendingUp, ChevronRight, CheckCircle2, Clock
} from "lucide-react";
import Link from 'next/link';

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/user/dashboard', { cache: "no-store" });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setUser(data);
      }
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const referralLink = typeof window !== 'undefined' && user?.id
    ? `${window.location.origin}/register?ref=${user.id}`
    : "";

  const copyReferralLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Unable to copy referral link. Please copy it manually.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-[#E11D48]" size={40} />
    </div>
  );

  // --- LOGIC: COMBINE ALL ACTIVITIES FOR HISTORY ---
  // Hum deposits, withdrawals aur plans ko ek hi list mein dal rahe hain
  const combinedHistory = [
    ...(user?.deposits || []).map((d: any) => ({ ...d, type: 'DEPOSIT', description: 'Account Deposit', date: d.createdAt })),
    ...(user?.withdrawals || []).map((w: any) => ({ ...w, type: 'WITHDRAW', description: 'Fund Withdrawal', date: w.createdAt })),
    ...(user?.activePlans || []).map((p: any) => ({ ...p, type: 'PLAN_PURCHASE', description: p.planName || 'Investment Plan', date: p.createdAt }))
  ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Latest first

  const totalInvested = user?.totalInvested || (user?.deposits || [])
    .filter((d: any) => d.status === "APPROVED")
    .reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  const totalWithdrawn = user?.totalWithdrawn || (user?.withdrawals || [])
    .filter((w: any) => w.status === "APPROVED")
    .reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  const activePlans = user?.activePlans || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans pb-10">
      <div className="max-w-[1400px] mx-auto px-4 pt-20 md:pt-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#E11D48] border border-gray-100">
              <UserCircle size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase text-[#0F172A]">
                HI, <span className="text-[#E11D48]">{user?.name || 'User'}</span>
              </h1>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Account Status: <span className="text-green-500">Verified</span></p>
            </div>
          </div>

          <div className="flex gap-3">
             <Link href="/dashboard/withdraw" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 font-bold text-[10px] uppercase tracking-widest hover:border-[#E11D48] transition-all">
                <ArrowUpCircle size={16} className="text-[#E11D48]" /> Withdraw
             </Link>
             <button onClick={() => setShowSupport(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0F172A] text-white px-6 py-3 rounded-xl shadow-lg font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                <MessageCircle size={16} className="text-[#E11D48]" /> Support
             </button>
          </div>
        </div>

        {/* --- REFERRAL SUMMARY --- */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Referral Dashboard</p>
            <p className="text-sm font-black text-[#0F172A]">You have referred <span className="text-[#E11D48]">{user?.referralCount || 0}</span> user{(user?.referralCount || 0) === 1 ? "" : "s"}.</p>
            <div className="mt-2 text-[10px] text-gray-500 space-y-1">
              <p>Rank: <span className="font-black text-[#0F172A]">{user?.rankLevel || 'Starter'}</span></p>
              {typeof user?.commissionRate === 'number' && (
                <p>Commission: <span className="font-black text-[#E11D48]">{(user.commissionRate * 100).toFixed(2)}%</span></p>
              )}
              {user?.referrer && (
                <p>Sponsored by: <span className="font-black text-[#0F172A]">{user.referrer.name || user.referrer.email}</span></p>
              )}
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Share your link to earn commissions on every successful plan purchase.</p>
            {referralLink && (
              <p className="text-[10px] font-black mt-2 text-gray-600 break-words">{referralLink}</p>
            )}
          </div>
          <button
            onClick={copyReferralLink}
            className="w-full md:w-auto bg-[#0F172A] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="col-span-2 lg:col-span-1 bg-[#0F172A] p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 relative z-10">Total Balance</p>
            <h2 className="text-3xl font-black text-white italic relative z-10">
              <span className="text-[#E11D48] not-italic mr-1 text-sm">Rs.</span>
              {(user?.balance || 0).toLocaleString()}
            </h2>
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#E11D48] opacity-10 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group">
            <Zap className="text-amber-500 mb-4 opacity-40 group-hover:opacity-100 transition-opacity" size={20} />
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Invested</p>
            <h2 className="text-xl font-black text-[#0F172A]">Rs. {totalInvested.toLocaleString()}</h2>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group">
            <CreditCard className="text-[#E11D48] mb-4 opacity-40 group-hover:opacity-100 transition-opacity" size={20} />
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Withdraw</p>
            <h2 className="text-xl font-black text-[#0F172A]">Rs. {totalWithdrawn.toLocaleString()}</h2>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <ShoppingBag className="text-blue-500 opacity-40 group-hover:opacity-100 transition-opacity" size={20} />
              <button 
                onClick={() => setShowPlansModal(true)}
                className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
              >
                View Details <ChevronRight size={10} />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">My Plans</p>
              <h2 className="text-xl font-black text-[#0F172A]">{activePlans.length} Active</h2>
            </div>
          </div>
        </div>

        {/* --- UPDATED HISTORY TABLE --- */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-black text-sm uppercase tracking-widest text-[#0F172A] flex items-center gap-2">
              <History size={16} className="text-[#E11D48]" /> Transaction Timeline
            </h2>
          </div>
          <div className="overflow-x-auto px-4">
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-50">
                {combinedHistory.length > 0 ? combinedHistory.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                            item.type === 'DEPOSIT' ? 'bg-green-50 text-green-600' : 
                            item.type === 'WITHDRAW' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                            {item.type === 'DEPOSIT' ? <ArrowDownCircle size={14}/> : 
                             item.type === 'WITHDRAW' ? <ArrowUpCircle size={14}/> : <Zap size={14}/>}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">{item.description}</p>
                          <p className="text-[8px] text-gray-400 uppercase font-bold tracking-tighter">
                            {new Date(item.date).toLocaleDateString()} • {item.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs font-black text-right md:text-left">
                        <span className={item.type === 'WITHDRAW' ? 'text-red-500' : 'text-[#0F172A]'}>
                            {item.type === 'WITHDRAW' ? '-' : '+'} Rs. {item.amount.toLocaleString()}
                        </span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell text-right">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                        item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        item.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td className="p-10 text-center text-[10px] uppercase font-bold text-gray-300 tracking-[0.2em]">No Transactions Found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODALS (Plans & Support) --- */}
      {showPlansModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0F172A]/90 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black uppercase italic text-[#0F172A]">Active Portfolio</h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Investment Details</p>
              </div>
              <button onClick={() => setShowPlansModal(false)} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-black transition-colors">
                <X size={24}/>
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {activePlans.length > 0 ? activePlans.map((plan: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-[#E11D48]/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#0F172A]">{plan.planName || 'Pro Plan'}</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Started: {new Date(plan.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-[#E11D48]">Rs. {plan.amount}</p>
                    <span className="text-[7px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">Running</span>
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No plans purchased yet</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-gray-50">
                <button onClick={() => setShowPlansModal(false)} className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Close Dashboard</button>
            </div>
          </div>
        </div>
      )}

      {showSupport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0F172A]/90 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative shadow-2xl">
            <button onClick={() => setShowSupport(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X size={20}/></button>
            <h3 className="text-xl font-black text-center uppercase italic mb-6 text-[#0F172A]">Contact Support</h3>
            <div className="space-y-3">
              <a href="https://t.me/GlobalTrustCash" className="flex items-center justify-between bg-gray-50 p-4 rounded-xl font-bold text-xs uppercase hover:bg-blue-500 hover:text-white transition-all"><Send size={16}/> Telegram</a>
              <a href="https://wa.me/923000000000" className="flex items-center justify-between bg-gray-50 p-4 rounded-xl font-bold text-xs uppercase hover:bg-green-500 hover:text-white transition-all"><MessageCircle size={16}/> WhatsApp</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;