"use client";
import { useState, useEffect } from "react";
import { Copy, CheckCircle2, Wallet, Zap } from "lucide-react";

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [slipImage, setSlipImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data));
    
    fetch("/api/user/profile")
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  const methods = settings ? [
    { 
      id: 'jazzcash', 
      name: 'JazzCash', 
      holder: settings.jazzCashName, 
      account: settings.jazzCashNumber, 
      type: 'local',
      logo: (
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1">
          <img src="https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo.png" alt="JazzCash" className="w-full h-full object-contain" />
        </div>
      )
    },
    { 
      id: 'easypaisa', 
      name: 'EasyPaisa', 
      holder: settings.easyPaisaName, 
      account: settings.easyPaisaNumber, 
      type: 'local',
      logo: (
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1">
          <img src="https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png" alt="EasyPaisa" className="w-full h-full object-contain" />
        </div>
      )
    },
    { 
      id: 'usdt', 
      name: 'USDT (TRC20)', 
      address: settings.adminWalletAddress, 
      type: 'crypto',
      logo: (
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1">
          <img src="https://cdn.worldvectorlogo.com/logos/tether.svg" alt="USDT" className="w-full h-full object-contain" />
        </div>
      )
    }
  ] : [];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please select an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress and set state
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setSlipImage(compressedBase64);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipImage) {
      alert("Please upload a payment slip image as proof of your deposit.");
      setLoading(false);
      return;
    }

    // API call yahan aye gi jo Deposit request create karegi
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: parseFloat(amount), 
          gateway: selectedMethod.name, 
          slipImage: slipImage 
        }),
      });
      if(res.ok) {
        alert("Request Sent! Wait for Admin Approval.");
        setAmount("");
        setSlipImage("");
        setSelectedMethod(null);
      } else {
        const error = await res.json();
        alert(error.error || "Something went wrong");
      }
    } catch (err) {
      alert("Failed to submit deposit request");
    } finally {
      setLoading(false);
    }
  };

  // Safe Currency Formatter
  const formatPKR = (val: number) => {
    return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-4xl mx-auto space-y-8 text-slate-900">
      <div className="lg:hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.3)]" />
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">
            Deposit <span className="text-purple-600">Funds</span>
          </h1>
        </div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5">
          Secure Deposit Panel • Gateway: <span className="text-purple-600 italic">Verified</span>
        </p>
      </div>

      {/* 0. User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Deposited Amount</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">
                Rs. {profile ? formatPKR(profile.totalDeposited) : "0.00"}
              </h3>
           </div>
           <div className="bg-purple-600/10 p-3 rounded-2xl border border-purple-600/10">
              <Zap className="text-purple-600" size={24} />
           </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
              <h3 className="text-3xl font-black text-purple-600 tracking-tighter italic">
                Rs. {profile ? formatPKR(profile.balance) : "0.00"}
              </h3>
           </div>
           <div className="bg-purple-600/10 p-3 rounded-2xl border border-purple-600/10">
              <Wallet className="text-purple-600" size={24} />
           </div>
        </div>
      </div>

      {/* 1. Select Method */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {!settings ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-pulse" />
          ))
        ) : (
          methods.map((m) => (
            <div 
              key={m.id} 
              onClick={() => setSelectedMethod(m)}
              className={`p-6 rounded-[2rem] border cursor-pointer transition-all flex flex-col items-center text-center gap-4 ${selectedMethod?.id === m.id ? 'border-purple-600 bg-purple-600/10 scale-105 shadow-xl shadow-purple-600/10' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              {m.logo}
              <div>
                <p className="font-bold uppercase text-[8px] tracking-[0.3em] text-zinc-500 mb-1">{m.type}</p>
                <h3 className="text-sm font-black italic tracking-tighter">{m.name}</h3>
              </div>

              {/* Mobile-only Deployment Console - Appears immediately below the selected method on small screens */}
              {selectedMethod?.id === m.id && (
                <div className="col-span-full space-y-8 mt-4 lg:hidden w-full">
                  <div className="bg-white border border-purple-600/30 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 opacity-[0.03] scale-150 rotate-12 pointer-events-none">
                      <selectedMethod.logo.type {...selectedMethod.logo.props} className="w-64 h-64" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                      {/* Account Intel */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4 italic">Payment Details</h4>
                          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex justify-between items-center group/addr">
                            <div>
                              <p className="text-xl font-mono text-purple-600 break-all leading-tight">{selectedMethod.account || selectedMethod.address}</p>
                              {selectedMethod.holder && <p className="text-[10px] font-black uppercase text-slate-500 mt-2">Account Name: {selectedMethod.holder}</p>}
                            </div>
                            <button 
                              onClick={() => handleCopy(selectedMethod.account || selectedMethod.address)}
                              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-purple-600 hover:text-white transition-all active:scale-90 shadow-sm"
                            >
                              <Copy size={18} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-purple-600/5 border border-purple-600/10 rounded-2xl">
                          <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest leading-relaxed">
                            Transfer the exact amount to the account shown above, then upload your receipt below to verify your deposit.
                          </p>
                        </div>
                      </div>

                      {/* Deployment Form */}
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Amount to Deposit (Rs.)</label>
                          <input 
                            type="number" 
                            placeholder="0.00" 
                            className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-purple-600 text-3xl font-black text-slate-900 transition-all placeholder:text-slate-200"
                            onChange={(e) => setAmount(e.target.value)} 
                            value={amount}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Digital Receipt / Cash Slip</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="slip-upload"
                            required
                          />
                          <label 
                            htmlFor="slip-upload"
                            className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-purple-600/50 transition-all group"
                          >
                            {slipImage ? (
                              <div className="flex items-center gap-3">
                                <CheckCircle2 size={20} className="text-emerald-500" />
                                <span className="text-[10px] font-black uppercase text-slate-600">Proof Attached</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <Zap size={20} className="text-slate-300 group-hover:text-purple-600 transition-colors" />
                                <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-slate-600">Browse Slip</span>
                              </div>
                            )}
                          
                            {slipImage && (
                              <img src={slipImage} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-zinc-800 shadow-xl" />
                            )}
                          </label>
                        </div>

                        <button 
                          disabled={loading}
                          className="w-full bg-purple-600 py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 text-white hover:bg-purple-700 transition shadow-2xl shadow-purple-600/40 active:scale-[0.98] text-[11px]"
                        >
                          {loading ? "Processing..." : <><Zap size={18} /> Deposit Now</>}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Laptop-only Deployment Console - Appears at the bottom for large screens */}
      {selectedMethod && (
        <div className="hidden lg:block space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white border border-purple-600/30 p-8 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-[0.03] scale-150 rotate-12 pointer-events-none">
              <selectedMethod.logo.type {...selectedMethod.logo.props} className="w-64 h-64" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
              {/* Account Intel */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4 italic">Payment Details</h4>
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex justify-between items-center group/addr">
                    <div>
                      <p className="text-xl font-mono text-purple-600 break-all leading-tight">{selectedMethod.account || selectedMethod.address}</p>
                      {selectedMethod.holder && <p className="text-[10px] font-black uppercase text-slate-500 mt-2">Account Name: {selectedMethod.holder}</p>}
                    </div>
                    <button 
                      onClick={() => handleCopy(selectedMethod.account || selectedMethod.address)}
                      className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-purple-600 hover:text-white transition-all active:scale-90 shadow-sm"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-600/5 border border-purple-600/10 rounded-2xl">
                  <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest leading-relaxed">
                    Transfer the exact amount to the account shown above, then upload your receipt below to verify your deposit.
                  </p>
                </div>
              </div>

              {/* Deployment Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Amount to Deposit (Rs.)</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-purple-600 text-3xl font-black text-slate-900 transition-all placeholder:text-slate-200"
                    onChange={(e) => setAmount(e.target.value)} 
                    value={amount}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Digital Receipt / Cash Slip</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="slip-upload"
                    required
                  />
                  <label 
                    htmlFor="slip-upload"
                    className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-purple-600/50 transition-all group"
                  >
                    {slipImage ? (
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-slate-600">Proof Attached</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Zap size={20} className="text-slate-300 group-hover:text-purple-600 transition-colors" />
                        <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-slate-600">Browse Slip</span>
                      </div>
                    )}
                  
                    {slipImage && (
                      <img src={slipImage} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-zinc-800 shadow-xl" />
                    )}
                  </label>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-purple-600 py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 text-white hover:bg-purple-700 transition shadow-2xl shadow-purple-600/40 active:scale-[0.98] text-[11px]"
                >
                  {loading ? "Processing..." : <><Zap size={18} /> Deposit Now</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
