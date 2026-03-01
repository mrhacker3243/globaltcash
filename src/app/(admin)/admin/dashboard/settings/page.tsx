"use client";
import { ShieldAlert, Wallet, Save, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    adminWalletAddress: "",
    tonWalletAddress: "",
    jazzCashNumber: "",
    jazzCashName: "",
    easyPaisaNumber: "",
    easyPaisaName: "",
    maintenanceMode: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSettings({
        adminWalletAddress: data.adminWalletAddress || "",
        tonWalletAddress: data.tonWalletAddress || "",
        jazzCashNumber: data.jazzCashNumber || "",
        jazzCashName: data.jazzCashName || "",
        easyPaisaNumber: data.easyPaisaNumber || "",
        easyPaisaName: data.easyPaisaName || "",
        maintenanceMode: data.maintenanceMode || false,
      });
    } catch (err) {
      console.error("Failed to load settings", err);
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
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1000px] mx-auto text-white">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">
            Core <span className="text-blue-600">Parameters</span>
          </h1>
        </div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5">
          Global System Security and Wallet Configuration • Authorization: <span className="text-blue-500 italic">Root Level</span>
        </p>
      </div>

      <div className="space-y-8">
        {/* BEP20 Wallet */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[3rem]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1">
                <img src="https://cdn.worldvectorlogo.com/logos/tether.svg" alt="USDT" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest italic">Master USDT Wallet (BEP20)</h2>
            </div>
            <Wallet className="text-zinc-700" size={20} />
          </div>
          <input 
            type="text" 
            value={settings.adminWalletAddress}
            onChange={(e) => setSettings({...settings, adminWalletAddress: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 px-6 text-sm font-mono text-zinc-400 focus:outline-none focus:border-blue-600 transition-all shadow-inner"
            placeholder="0x..."
          />
          <p className="text-[9px] text-zinc-600 mt-4 uppercase font-bold italic tracking-tighter text-blue-500/80">Traditional BEP20 address for standard USDT/BNB deposits.</p>
        </div>

        {/* TON Wallet */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[3rem] border-l-4 border-l-blue-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-600/20 p-2 rounded-lg">
               <Wallet className="text-blue-400" size={24} />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest italic text-blue-400">Telegram/TON Gateway Wallet</h2>
          </div>
          <input 
            type="text" 
            value={settings.tonWalletAddress}
            onChange={(e) => setSettings({...settings, tonWalletAddress: e.target.value})}
            className="w-full bg-zinc-950 border border-blue-900/30 rounded-2xl py-5 px-6 text-sm font-mono text-blue-100 focus:outline-none focus:border-blue-600 transition-all shadow-inner"
            placeholder="UQ..."
          />
          <p className="text-[9px] text-zinc-400 mt-4 uppercase font-bold italic tracking-tighter">Enter your TON wallet address for Telegram Mini App integrations.</p>
        </div>

        {/* Local Gateway Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* JazzCash */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[3rem]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-lg shadow-red-600/10">
                <img src="https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo.png" alt="JazzCash" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 italic">JazzCash Configuration</h2>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Account Number"
                value={settings.jazzCashNumber}
                onChange={(e) => setSettings({...settings, jazzCashNumber: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-5 text-xs text-white outline-none focus:border-amber-500 transition-all"
              />
              <input 
                type="text" 
                placeholder="Account Holder Name"
                value={settings.jazzCashName}
                onChange={(e) => setSettings({...settings, jazzCashName: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-5 text-xs text-white outline-none focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* EasyPaisa */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[3rem]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-lg shadow-emerald-600/10">
                <img src="https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png" alt="EasyPaisa" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 italic">EasyPaisa Configuration</h2>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Account Number"
                value={settings.easyPaisaNumber}
                onChange={(e) => setSettings({...settings, easyPaisaNumber: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-5 text-xs text-white outline-none focus:border-emerald-500 transition-all"
              />
              <input 
                type="text" 
                placeholder="Account Holder Name"
                value={settings.easyPaisaName}
                onChange={(e) => setSettings({...settings, easyPaisaName: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-5 text-xs text-white outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-red-600/5 border border-red-600/10 p-8 rounded-[3rem]">
          <div className="flex items-center gap-4 mb-8">
            <ShieldAlert className="text-red-500" size={24} />
            <h2 className="text-sm font-black uppercase tracking-widest italic text-red-500">System lockdown</h2>
          </div>
          <div 
            onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
            className="flex items-center justify-between bg-zinc-950 p-6 rounded-2xl border border-zinc-900 group hover:border-red-500/50 transition-all cursor-pointer"
          >
             <div>
                <p className="text-xs font-black uppercase text-white">Maintenance Mode</p>
                <p className="text-[9px] text-zinc-600 uppercase font-bold mt-1 tracking-widest">Disable all user transactions instantly</p>
             </div>
             <div className={`w-12 h-6 rounded-full relative transition-all border ${settings.maintenanceMode ? 'bg-red-600 border-red-500' : 'bg-zinc-800 border-zinc-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
             </div>
          </div>
        </div>


        <button 
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] ${success ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'} disabled:opacity-50`}
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : success ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {saving ? "Deploying..." : success ? "System Updated" : "Deploy Changes"}
        </button>
      </div>
    </div>
  );
}
