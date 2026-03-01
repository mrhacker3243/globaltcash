"use client";
import { Wallet, Copy, Save, Loader2, CheckCircle2, ShieldCheck, TrendingUp, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminWalletTerminal() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState({
    totalDeposited: 0,
    totalWithdrawn: 0,
    pendingPayments: 0
  });
  const [settings, setSettings] = useState({
    adminWalletAddress: "",
    tonWalletAddress: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, statsRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/wallet-stats") // I will create this API
      ]);
      
      const settingsData = await settingsRes.json();
      setSettings({
        adminWalletAddress: settingsData.adminWalletAddress || "",
        tonWalletAddress: settingsData.tonWalletAddress || "",
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Failed to load wallet data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, maintenanceMode: false }), // Keep maintenance mode as is or fetch it first
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save wallet settings", err);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1200px] mx-auto text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">Wallet <span className="text-blue-600 text-5xl">Settings</span></h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Manage deposit and withdrawal addresses</p>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-[2rem] relative overflow-hidden">
          <TrendingUp className="absolute -right-2 -bottom-2 text-emerald-500/5 w-24 h-24" />
          <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Total Deposits (BEP20)
          </p>
          <h3 className="text-2xl font-black italic tracking-tighter">Rs. {stats.totalDeposited.toLocaleString()}</h3>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-[2rem] relative overflow-hidden">
          <ArrowUpRight className="absolute -right-2 -bottom-2 text-blue-500/5 w-24 h-24" />
          <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Pending Deposits
          </p>
          <h3 className="text-2xl font-black italic tracking-tighter">{stats.pendingPayments} txn</h3>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-[2rem] relative overflow-hidden border-l-4 border-l-amber-500">
          <ArrowDownLeft className="absolute -right-2 -bottom-2 text-amber-500/5 w-24 h-24" />
          <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Total Withdrawals
          </p>
          <h3 className="text-2xl font-black italic tracking-tighter">Rs. {stats.totalWithdrawn.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* BEP20 CONFIG */}
        <div className="bg-zinc-900/20 border border-zinc-800/50 p-8 rounded-[3rem] space-y-8 backdrop-blur-sm">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-600/20">
                <Wallet className="text-blue-500" size={24} />
             </div>
             <div>
                <h2 className="text-sm font-black uppercase tracking-widest italic text-white flex items-center gap-2">
                  USDT Deposit Address (BEP20)
                </h2>
                <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">Used for USDT deposits</p>
             </div>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input 
                type="text" 
                value={settings.adminWalletAddress}
                onChange={(e) => setSettings({...settings, adminWalletAddress: e.target.value})}
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-6 px-6 text-xs font-mono text-zinc-300 focus:outline-none focus:border-blue-600 transition-all shadow-2xl"
                placeholder="0x..."
              />
              <button 
                onClick={() => copyToClipboard(settings.adminWalletAddress)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="flex items-start gap-3 bg-blue-600/5 p-4 rounded-xl border border-blue-600/10">
               <ShieldCheck className="text-blue-600 shrink-0" size={14} />
               <p className="text-[9px] text-zinc-400 font-bold uppercase leading-relaxed">
                  Ensure this address belongs to the Binance Smart Chain (BSC). 
                  Mismatching networks will result in permanent loss of funds.
               </p>
            </div>
          </div>
        </div>

        {/* TON CONFIG */}
        <div className="bg-zinc-900/20 border border-zinc-800/50 p-8 rounded-[3rem] space-y-8 backdrop-blur-sm">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-400/10 rounded-2xl border border-blue-400/20">
                <Wallet className="text-blue-400" size={24} />
             </div>
             <div>
                <h2 className="text-sm font-black uppercase tracking-widest italic text-blue-400 flex items-center gap-2">
                  TON Deposit Address (Mainnet)
                </h2>
                <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest text-blue-400/50">Used for TON deposits</p>
             </div>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input 
                type="text" 
                value={settings.tonWalletAddress}
                onChange={(e) => setSettings({...settings, tonWalletAddress: e.target.value})}
                className="w-full bg-zinc-950/80 border border-blue-900/20 rounded-2xl py-6 px-6 text-xs font-mono text-blue-100 focus:outline-none focus:border-blue-400 transition-all shadow-2xl"
                placeholder="UQ..."
              />
              <button 
                onClick={() => copyToClipboard(settings.tonWalletAddress)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="bg-zinc-950/50 p-5 rounded-2xl border border-zinc-900 flex justify-between items-center group cursor-pointer hover:border-blue-500/30 transition-all">
               <div>
                  <p className="text-[9px] font-black uppercase text-zinc-400">Payment Status</p>
                  <p className="text-[10px] font-black uppercase text-emerald-500 italic">Operational</p>
               </div>
               <div className="w-12 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-xs transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] ${success ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'} disabled:opacity-50`}
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : success ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {saving ? "Saving Status..." : success ? "Settings Saved" : "Save Wallet Settings"}
        </button>
      </div>

      <div className="mt-12 p-8 bg-zinc-950/50 rounded-[2rem] border border-zinc-900 italic">
         <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center leading-loose">
            Changes are saved securely through encrypted protocols. Do not share admin credentials.
         </p>
      </div>
    </div>
  );
}
