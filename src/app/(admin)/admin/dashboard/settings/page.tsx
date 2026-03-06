"use client";
import { ShieldAlert, Wallet, Save, Loader2, CheckCircle2, Zap, Smartphone, Globe } from "lucide-react";
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

  const [referralRanks, setReferralRanks] = useState<any[]>([]);
  const [newRank, setNewRank] = useState({
    name: "",
    commissionPercent: 0.05,
    minTeamVolume: 0,
    minActiveReferrals: 0,
    active: true,
  });

  useEffect(() => {
    fetchSettings();
    fetchReferralRanks();
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

  const fetchReferralRanks = async () => {
    try {
      const res = await fetch("/api/admin/referral-ranks");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReferralRanks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load referral ranks", err);
    }
  };

  const saveReferralRank = async (rank: any) => {
    try {
      const res = await fetch("/api/admin/referral-ranks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rank),
      });
      if (!res.ok) throw new Error("Failed to save referral rank");
      await fetchReferralRanks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNewRank = async () => {
    if (!newRank.name) return;
    await saveReferralRank(newRank);
    setNewRank({
      name: "",
      commissionPercent: 0.05,
      minTeamVolume: 0,
      minActiveReferrals: 0,
      active: true,
    });
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
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="animate-spin text-[#E11D48]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans selection:bg-[#E11D48]/10 overflow-x-hidden p-6 md:p-12 pt-28">
      
      {/* --- HEADER --- */}
      <div className="max-w-5xl mx-auto mb-16 relative">
        <div className="absolute -top-10 left-0 w-32 h-32 bg-[#E11D48]/5 blur-[60px] -z-10 rounded-full" />
        <div className="flex items-center gap-3 mb-4">
           <div className="bg-gray-900 p-2 rounded-lg text-white"><Zap size={18} fill="white" /></div>
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Central Command</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none text-gray-900">
          Core <br />
          <span className="text-[#E11D48]">Parameters.</span>
        </h1>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Global Trust Cash • Infrastructure Node 2026
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* WALLET SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BEP20 Wallet */}
          <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#F9FAFB] border border-gray-100 p-3">
                  <img src="https://cdn.worldvectorlogo.com/logos/tether.svg" alt="USDT" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest italic text-gray-900">USDT Master Gateway</h2>
              </div>
              <Globe className="text-gray-100 group-hover:text-[#E11D48]/20 transition-colors" size={32} />
            </div>
            <input 
              type="text" 
              value={settings.adminWalletAddress}
              onChange={(e) => setSettings({...settings, adminWalletAddress: e.target.value})}
              className="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl py-6 px-6 text-xs font-mono text-[#E11D48] focus:outline-none focus:ring-4 focus:ring-[#E11D48]/5 focus:border-[#E11D48] transition-all"
              placeholder="0x..."
            />
          </div>

          {/* TON Wallet */}
          <div className="bg-white border-l-8 border-[#E11D48] p-10 rounded-[3rem] shadow-sm group">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-rose-50 p-4 rounded-2xl text-[#E11D48]">
                 <Wallet size={28} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-widest italic text-gray-900">TON Network Node</h2>
            </div>
            <input 
              type="text" 
              value={settings.tonWalletAddress}
              onChange={(e) => setSettings({...settings, tonWalletAddress: e.target.value})}
              className="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl py-6 px-6 text-xs font-mono text-gray-700 focus:outline-none focus:border-[#E11D48] transition-all"
              placeholder="UQ..."
            />
          </div>
        </div>

        {/* LOCAL GATEWAYS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* JazzCash */}
          <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <img src="https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo.png" alt="Jazz" className="h-10 object-contain" />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">JazzCash API Terminal</h2>
            </div>
            <div className="space-y-4">
              <input 
                type="text" placeholder="MOBILE NUMBER" value={settings.jazzCashNumber}
                onChange={(e) => setSettings({...settings, jazzCashNumber: e.target.value})}
                className="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl py-5 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#E11D48]"
              />
              <input 
                type="text" placeholder="ACCOUNT HOLDER NAME" value={settings.jazzCashName}
                onChange={(e) => setSettings({...settings, jazzCashName: e.target.value})}
                className="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl py-5 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#E11D48]"
              />
            </div>
          </div>

          {/* EasyPaisa */}
          <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <img src="https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png" alt="Easy" className="h-10 object-contain" />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">EasyPaisa API Terminal</h2>
            </div>
            <div className="space-y-4">
              <input 
                type="text" placeholder="MOBILE NUMBER" value={settings.easyPaisaNumber}
                onChange={(e) => setSettings({...settings, easyPaisaNumber: e.target.value})}
                className="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl py-5 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#E11D48]"
              />
              <input 
                type="text" placeholder="ACCOUNT HOLDER NAME" value={settings.easyPaisaName}
                onChange={(e) => setSettings({...settings, easyPaisaName: e.target.value})}
                className="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl py-5 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#E11D48]"
              />
            </div>
          </div>
        </div>

        {/* REFERRAL RANKS */}
        <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-[#111827]">Referral Rank Settings</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Configure commission rates and thresholds for referral tiers.</p>
            </div>
            <button
              onClick={handleCreateNewRank}
              className="px-6 py-3 bg-[#E11D48] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#BE123C] transition-all"
            >
              Add New Rank
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            <input
              value={newRank.name}
              onChange={(e) => setNewRank({ ...newRank, name: e.target.value })}
              placeholder="Rank name"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={newRank.commissionPercent}
              step={0.01}
              onChange={(e) => setNewRank({ ...newRank, commissionPercent: parseFloat(e.target.value) })}
              placeholder="Commission %"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={newRank.minTeamVolume}
              onChange={(e) => setNewRank({ ...newRank, minTeamVolume: parseFloat(e.target.value) })}
              placeholder="Min Team Volume"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={newRank.minActiveReferrals}
              onChange={(e) => setNewRank({ ...newRank, minActiveReferrals: parseInt(e.target.value) })}
              placeholder="Min Referrals"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm"
            />
            <button
              onClick={handleCreateNewRank}
              className="px-6 py-3 bg-[#0F172A] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E11D48] transition-all"
            >
              Create
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Commission</th>
                  <th className="px-4 py-3">Min Volume</th>
                  <th className="px-4 py-3">Min Referrals</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {referralRanks.map((rank, idx) => (
                  <tr key={rank.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <input
                        value={rank.name}
                        onChange={(e) => {
                          const updated = [...referralRanks];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setReferralRanks(updated);
                        }}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={rank.commissionPercent}
                        step={0.01}
                        onChange={(e) => {
                          const updated = [...referralRanks];
                          updated[idx] = { ...updated[idx], commissionPercent: parseFloat(e.target.value) };
                          setReferralRanks(updated);
                        }}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={rank.minTeamVolume}
                        onChange={(e) => {
                          const updated = [...referralRanks];
                          updated[idx] = { ...updated[idx], minTeamVolume: parseFloat(e.target.value) };
                          setReferralRanks(updated);
                        }}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={rank.minActiveReferrals}
                        onChange={(e) => {
                          const updated = [...referralRanks];
                          updated[idx] = { ...updated[idx], minActiveReferrals: parseInt(e.target.value) };
                          setReferralRanks(updated);
                        }}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rank.active}
                          onChange={(e) => {
                            const updated = [...referralRanks];
                            updated[idx] = { ...updated[idx], active: e.target.checked };
                            setReferralRanks(updated);
                          }}
                          className="h-4 w-4"
                        />
                        <span className="text-[10px] font-black text-gray-500">Active</span>
                      </label>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => saveReferralRank(rank)}
                        className="px-4 py-2 bg-[#0F172A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E11D48] transition-all"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SYSTEM CONTROL */}
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-8 rounded-[2rem] font-black uppercase tracking-[0.6em] text-[10px] transition-all flex items-center justify-center gap-4 active:scale-[0.98] ${success ? 'bg-emerald-500' : 'bg-[#E11D48] hover:bg-rose-700 shadow-2xl shadow-rose-200'} text-white disabled:opacity-50`}
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : success ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {saving ? "Encrypting Data..." : success ? "System Updated Successfully" : "Deploy Network Updates"}
        </button>

        <div className="pt-10 text-center">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] italic">Secure Encrypted Environment • V 3.0.1</p>
        </div>
      </div>
    </div>
  );
}