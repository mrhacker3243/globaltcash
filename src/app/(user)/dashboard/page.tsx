"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Loader2, UserCircle, ArrowUpCircle, MessageCircle, Send, X, 
  History, ArrowDownCircle, ShoppingBag, Zap, CreditCard, TrendingUp
} from "lucide-react";
import Link from 'next/link';

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSupport, setShowSupport] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/user/dashboard', { cache: "no-store" });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        // Yahan data console kar ke check kar liya kar ke backend kya bhej raha hai
        console.log("Dashboard Data:", data); 
        setUser(data);
      }
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-[#E11D48]" size={40} />
    </div>
  );

  // LOGIC FIX: Agar API mein 'totalInvested' ya 'totalWithdrawn' alag se aa raha hai toh wo use karo
  // Warna ye filter method toh hai hi:
  const totalInvested = user?.totalInvested || (user?.deposits || [])
    .filter((d: any) => d.status === "APPROVED")
    .reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  const totalWithdrawn = user?.totalWithdrawn || (user?.withdrawals || [])
    .filter((w: any) => w.status === "APPROVED")
    .reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  const activePlansCount = user?.activePlans?.length || user?.activePlansCount || 0;

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

        {/* --- STYLISH GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          
          {/* BALANCE */}
          <div className="col-span-2 lg:col-span-1 bg-[#0F172A] p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 relative z-10">Total Balance</p>
            <h2 className="text-3xl font-black text-white italic relative z-10">
              <span className="text-[#E11D48] not-italic mr-1 text-sm">Rs.</span>
              {(user?.balance || 0).toLocaleString()}
            </h2>
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#E11D48] opacity-10 rounded-full blur-2xl"></div>
          </div>

          {/* INVESTED */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group">
            <Zap className="text-amber-500 mb-4 opacity-40 group-hover:opacity-100 transition-opacity" size={20} />
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Invested</p>
            <h2 className="text-xl font-black text-[#0F172A]">Rs. {totalInvested.toLocaleString()}</h2>
          </div>

          {/* WITHDRAWN */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group">
            <CreditCard className="text-[#E11D48] mb-4 opacity-40 group-hover:opacity-100 transition-opacity" size={20} />
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Withdrawn</p>
            <h2 className="text-xl font-black text-[#0F172A]">Rs. {totalWithdrawn.toLocaleString()}</h2>
          </div>

          {/* ACTIVE PLANS */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group">
            <ShoppingBag className="text-blue-500 mb-4 opacity-40 group-hover:opacity-100 transition-opacity" size={20} />
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active</p>
            <h2 className="text-xl font-black text-[#0F172A]">{activePlansCount} Plans</h2>
          </div>
        </div>

        {/* ACTIVITY TABLE */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-black text-sm uppercase tracking-widest text-[#0F172A] flex items-center gap-2">
              <History size={16} className="text-[#E11D48]" /> Recent History
            </h2>
          </div>
          <div className="overflow-x-auto px-4">
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-50">
                {user?.history?.length > 0 ? user.history.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="text-xs font-bold text-[#0F172A]">{item.description}</p>
                      <p className="text-[8px] text-gray-400 uppercase font-bold tracking-tighter">{item.type}</p>
                    </td>
                    <td className="px-4 py-4 text-xs font-black">Rs. {item.amount}</td>
                    <td className="px-4 py-4">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td className="p-10 text-center text-[10px] uppercase font-bold text-gray-300 tracking-[0.2em]">No Data Found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* SUPPORT MODAL (Keeping it simple for stability) */}
      {showSupport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0F172A]/90 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative">
            <button onClick={() => setShowSupport(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X size={20}/></button>
            <h3 className="text-xl font-black text-center uppercase italic mb-6">Contact Support</h3>
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