"use client";
import React, { useEffect, useState } from "react";
import { ArrowUpLeft, ShieldCheck, Coins, Loader2, Wallet, CheckCircle2 } from "lucide-react";
import { useTonAddress } from "@tonconnect/ui-react";

export default function WithdrawPage() {
  const tonAddress = useTonAddress();
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/profile"); // I'll create this API
      const data = await res.json();
      setUserData(data);
      if (data.walletAddress && !address) {
        setAddress(data.walletAddress);
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !address) return alert("Please enter amount and address");
    if (parseFloat(amount) > (userData?.balance || 0)) return alert("Insufficient balance");
    
    setExecuting(true);
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), address }),
      });
      if (res.ok) {
        alert("Withdrawal request submitted. Processing...");
        setAmount("");
        fetchUserData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExecuting(false);
    }
  };

  const fillConnectedWallet = () => {
    if (tonAddress) {
      setAddress(tonAddress);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pt-24 lg:pt-10 max-w-6xl mx-auto">
      <div className="mb-10 text-slate-900 lg:hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.3)]" />
          <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-slate-900">
            Withdraw <span className="text-purple-600">Funds</span>
          </h1>
        </div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5">
           Request Earnings Withdrawal • Status: <span className="text-emerald-500 italic uppercase">Active</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px]" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
               <div className="flex items-center gap-4">
                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                     <Coins className="text-emerald-500" size={24} />
                  </div>
                  <div>
                     <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Available Balance</p>
                     <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Rs. {userData?.balance?.toFixed(2) || "0.00"}</h3>
                  </div>
               </div>
               
               {tonAddress && (
                 <button 
                  onClick={fillConnectedWallet}
                  className="bg-purple-50 hover:bg-purple-100 border border-purple-100 px-4 py-2 rounded-xl flex items-center gap-2 transition-all group"
                 >
                    <Wallet size={14} className="text-purple-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 group-hover:text-purple-700">Use TON Wallet</span>
                 </button>
               )}
            </div>

            <div className="space-y-6 text-slate-900 relative z-10">
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-[10px] font-black uppercase text-slate-400">Withdrawal Amount (Rs.)</label>
                   <button onClick={() => setAmount(userData?.balance.toString())} className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline">Max Available</button>
                </div>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min Rs. 10.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 text-xl font-black focus:outline-none focus:border-red-500/50 transition-all placeholder:text-slate-200 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Receiving Destination Hash (BEP20 / TON)</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Paste 0x... or TON address"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-purple-600 transition-all font-mono text-slate-600"
                  />
                  {address === tonAddress && tonAddress && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-purple-600">
                       <CheckCircle2 size={16} />
                       <span className="text-[8px] font-black uppercase">Telegram Link</span>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleWithdraw}
                disabled={executing}
                className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200 disabled:opacity-50 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95 text-[11px] mt-4"
              >
                {executing ? <Loader2 className="animate-spin" size={18} /> : <ArrowUpLeft size={18} />}
                {executing ? "Processing..." : "Withdraw Now"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem]">
            <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="text-red-500" size={24} />
            </div>
            <h4 className="text-4xl font-black uppercase italic mb-6 text-slate-900">Rules</h4>
            <ul className="space-y-5">
              <li className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider italic">Processing time: 02 - 24 hours.</p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider italic">Withdrawal fee: 2.5% system tax.</p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider italic">Ensure destination hash compatibility.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}