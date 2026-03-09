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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Loader2 className="animate-spin text-rose-600" size={48} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
        <X className="mx-auto text-rose-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );

  const combinedHistory = [
    ...(user?.deposits || []).map((d: any) => ({ ...d, type: 'DEPOSIT', description: 'Account Deposit', date: d.createdAt })),
    ...(user?.withdrawals || []).map((w: any) => ({ ...w, type: 'WITHDRAW', description: 'Fund Withdrawal', date: w.createdAt })),
    ...(user?.activePlans || []).map((p: any) => ({ ...p, type: 'PLAN_PURCHASE', description: p.planName || 'Investment Plan', date: p.createdAt }))
  ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalInvested = user?.totalInvested || (user?.deposits || [])
    .filter((d: any) => d.status === "APPROVED")
    .reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  const totalWithdrawn = user?.totalWithdrawn || (user?.withdrawals || [])
    .filter((w: any) => w.status === "APPROVED")
    .reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  const activePlans = user?.activePlans || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800 font-sans pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-12 lg:pt-16">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-rose-600 border border-gray-100/80">
              <UserCircle size={36} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                HI, <span className="text-rose-600">{user?.name || 'User'}</span>
              </h1>
              <p className="text-xs md:text-sm font-semibold text-gray-500 mt-1">
                Account Status: <span className="text-emerald-600 font-bold">Verified</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/withdraw" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white px-6 py-3.5 rounded-2xl shadow-md border border-gray-200 font-bold text-sm uppercase tracking-wide hover:border-rose-500 hover:text-rose-600 transition-all duration-300">
              <ArrowUpCircle size={18} className="text-rose-600" /> Withdraw
            </Link>
            <button onClick={() => setShowSupport(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3.5 rounded-2xl shadow-lg font-bold text-sm uppercase tracking-wide hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <MessageCircle size={18} /> Support
            </button>
          </div>
        </div>

        {/* REFERRAL CARD – GLASSMORPHISM */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-6 md:p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">Referral Dashboard</p>
              <p className="text-lg font-bold text-gray-900">
                You have referred <span className="text-rose-600">{user?.referralCount || 0}</span> user{(user?.referralCount || 0) === 1 ? "" : "s"}.
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <p>Rank: <span className="font-bold text-gray-900">{user?.rankLevel || 'Starter'}</span></p>
                {typeof user?.commissionRate === 'number' && (
                  <p>Commission: <span className="font-bold text-rose-600">{(user.commissionRate * 100).toFixed(2)}%</span></p>
                )}
                {user?.referrer && (
                  <p>Sponsored by: <span className="font-bold">{user.referrer.name || user.referrer.email}</span></p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">Share your link to earn commissions on every successful plan purchase.</p>
              {referralLink && (
                <p className="text-xs font-mono text-gray-600 mt-2 break-all">{referralLink}</p>
              )}
            </div>

            <button
              onClick={copyReferralLink}
              className={`w-full md:w-auto px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:shadow-2xl hover:scale-[1.02]'
              }`}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* STATS GRID – MODERN CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {/* Balance Card – Highlight */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Total Balance</p>
            <h2 className="text-4xl md:text-5xl font-black">
              <span className="text-rose-500 text-2xl md:text-3xl mr-2">Rs.</span>
              {(user?.balance || 0).toLocaleString()}
            </h2>
          </div>

          {/* Invested */}
          <div className="bg-white/80 backdrop-blur-md border border-gray-200/80 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <Zap className="text-amber-500" size={28} />
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Active</span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Invested</p>
            <h2 className="text-3xl font-black text-gray-900">Rs. {totalInvested.toLocaleString()}</h2>
          </div>

          {/* Withdrawn */}
          <div className="bg-white/80 backdrop-blur-md border border-gray-200/80 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="text-rose-600" size={28} />
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">History</span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Withdrawn</p>
            <h2 className="text-3xl font-black text-gray-900">Rs. {totalWithdrawn.toLocaleString()}</h2>
          </div>

          {/* My Plans */}
          <div className="bg-white/80 backdrop-blur-md border border-gray-200/80 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <ShoppingBag className="text-indigo-600" size={28} />
              <button 
                onClick={() => setShowPlansModal(true)}
                className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">My Plans</p>
            <h2 className="text-3xl font-black text-gray-900">{activePlans.length} Active</h2>
          </div>
        </div>

        {/* HISTORY SECTION */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-3xl shadow-xl overflow-hidden">
          <div className="px-6 md:px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
              <History className="text-rose-600" size={22} /> Transaction Timeline
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-gray-50/80">
                <tr className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Activity</th>
                  <th className="px-6 py-4 hidden md:table-cell">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 hidden md:table-cell text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {combinedHistory.length > 0 ? combinedHistory.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                          item.type === 'DEPOSIT' ? 'bg-green-500' : 
                          item.type === 'WITHDRAW' ? 'bg-red-500' : 'bg-indigo-500'
                        }`}>
                          {item.type === 'DEPOSIT' ? <ArrowDownCircle size={18}/> : 
                           item.type === 'WITHDRAW' ? <ArrowUpCircle size={18}/> : <Zap size={18}/>}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.description}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(item.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell text-sm text-gray-600">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right font-bold">
                      <span className={item.type === 'WITHDRAW' ? 'text-red-600' : 'text-emerald-600'}>
                        {item.type === 'WITHDRAW' ? '-' : '+'} Rs. {item.amount?.toLocaleString() || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell text-center">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                        item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        item.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-400 font-medium">
                      No transactions found yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALS – Improved styling */}
      {showPlansModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900">Active Portfolio</h3>
                <p className="text-sm text-gray-500 mt-1">Your current investments</p>
              </div>
              <button onClick={() => setShowPlansModal(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                <X size={28} className="text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-5">
              {activePlans.length > 0 ? activePlans.map((plan: any, idx: number) => (
                <div key={idx} className="p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <CheckCircle2 size={28} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{plan.planName || 'Pro Plan'}</h4>
                        <p className="text-sm text-gray-600 mt-1">Started: {new Date(plan.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-rose-600">Rs. {plan.amount?.toLocaleString()}</p>
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full mt-2 inline-block">Running</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-16 text-center">
                  <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-lg font-bold text-gray-600">No active plans yet</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button onClick={() => setShowPlansModal(false)} className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showSupport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative">
            <button onClick={() => setShowSupport(false)} className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 transition-colors">
              <X size={32} />
            </button>
            <h3 className="text-2xl font-extrabold text-center text-gray-900 mb-8">Contact Support</h3>
            <div className="space-y-4">
              <a href="https://t.me/GlobalTrustCash" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-2xl font-bold text-lg hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <Send size={28} className="text-blue-600" />
                  <span>Telegram</span>
                </div>
                <ChevronRight size={24} />
              </a>
              <a href="https://wa.me/923345687574" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-2xl font-bold text-lg hover:from-green-100 hover:to-green-200 transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <MessageCircle size={28} className="text-green-600" />
                  <span>WhatsApp</span>
                </div>
                <ChevronRight size={24} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;