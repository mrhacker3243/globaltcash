"use client";
import { useState, useEffect } from "react";
import { Copy, CheckCircle2, Wallet, Zap, UploadCloud, ArrowLeft, ShieldCheck } from "lucide-react";

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [slipImage, setSlipImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => setSettings(data));
    fetch("/api/user/profile").then(res => res.json()).then(data => setProfile(data));
  }, []);

  const methods = settings ? [
    { 
      id: 'jazzcash', 
      name: 'JazzCash', 
      holder: settings.jazzCashName, 
      account: settings.jazzCashNumber, 
      type: 'Local Gateway',
      logo: "https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo.png"
    },
    { 
      id: 'easypaisa', 
      name: 'EasyPaisa', 
      holder: settings.easyPaisaName, 
      account: settings.easyPaisaNumber, 
      type: 'Local Gateway',
      logo: "https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png"
    },
    { 
      id: 'usdt', 
      name: 'USDT (TRC20)', 
      address: settings.adminWalletAddress, 
      type: 'Crypto Node',
      logo: "https://cdn.worldvectorlogo.com/logos/tether.svg"
    }
  ] : [];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipImage) return alert("Please upload slip");
    setLoading(true);
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), gateway: selectedMethod.name, slipImage })
      });
      if(res.ok) {
        alert("Deposit request submitted! Please wait for approval.");
        setSelectedMethod(null);
        setAmount("");
        setSlipImage("");
      }
    } catch (err) { 
      alert("Something went wrong!");
    } finally { 
      setLoading(false); 
    }
  };

  const formatPKR = (val: number) => (val || 0).toLocaleString('en-PK');

  return (
    <div className="bg-[#F3F4F6] min-h-screen p-5 md:p-10 pt-24 lg:pt-10 font-sans text-[#1F2937]">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {selectedMethod && (
              <button 
                onClick={() => setSelectedMethod(null)}
                className="p-3 bg-white rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all active:scale-90"
              >
                <ArrowLeft size={20} className="text-[#E11D48]" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[#111827]">
                Deposit <span className="text-[#E11D48]">Funds</span>
              </h1>
              <p className="text-[#6B7280] text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">
                {selectedMethod ? `Step 2: Complete Transfer via ${selectedMethod.name}` : "Step 1: Choose your payment method"}
              </p>
            </div>
          </div>
          <div className="hidden md:flex bg-white px-5 py-2 rounded-2xl shadow-sm border border-[#E5E7EB] items-center gap-3">
             <ShieldCheck size={18} className="text-emerald-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">End-to-End Encryption</span>
          </div>
        </div>

        {/* --- STEP 1: GATEWAY SELECTION (Visible only if no method is selected) --- */}
        {!selectedMethod ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* User Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex justify-between items-center group hover:shadow-xl transition-all">
                <div>
                  <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1 italic">Available Balance</p>
                  <h3 className="text-4xl font-black text-[#111827]">Rs. {profile ? formatPKR(profile.balance) : "0.00"}</h3>
                </div>
                <div className="bg-[#FFF1F2] p-5 rounded-3xl text-[#E11D48] group-hover:scale-110 transition-transform">
                  <Wallet size={28} />
                </div>
              </div>
              <div className="bg-[#111827] p-8 rounded-[2.5rem] shadow-xl flex justify-between items-center group">
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 italic">Total Deposits</p>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter">Rs. {profile ? formatPKR(profile.totalDeposited) : "0.00"}</h3>
                </div>
                <div className="bg-white/10 p-5 rounded-3xl text-[#E11D48] group-hover:rotate-12 transition-transform">
                  <Zap size={28} />
                </div>
              </div>
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {methods.map((m) => (
                <div 
                  key={m.id} 
                  onClick={() => setSelectedMethod(m)}
                  className="bg-white p-10 rounded-[3rem] border-2 border-transparent shadow-sm cursor-pointer hover:border-[#E11D48] hover:shadow-2xl transition-all group flex flex-col items-center text-center gap-6"
                >
                  <div className="w-20 h-20 rounded-3xl overflow-hidden bg-gray-50 p-3 border border-gray-100 group-hover:scale-110 transition-transform">
                    <img src={m.logo} alt={m.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-[#E11D48] bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">{m.type}</span>
                    <h3 className="text-xl font-black text-[#111827]">{m.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* --- STEP 2: CREDENTIALS & FORM (Visible only when a method is selected) --- */
          <div className="animate-in zoom-in-95 fade-in duration-500">
            <div className="bg-white rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-white overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                
                {/* Credentials Side */}
                <div className="p-10 lg:p-14 bg-[#F9FAFB] border-r border-gray-100 space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <img src={selectedMethod.logo} className="w-10 h-10 object-contain" />
                       <h3 className="text-2xl font-black text-[#111827] italic uppercase tracking-tighter">Transfer Details</h3>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Please send the exact amount to the account below and upload the receipt screenshot.</p>
                  </div>

                  <div className="space-y-5">
                    <div className="bg-white p-7 rounded-[2rem] border border-gray-200 shadow-sm relative group overflow-hidden">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Account Number / Address</p>
                      <p className="text-2xl font-mono font-black text-[#111827] break-all select-all">{selectedMethod.account || selectedMethod.address}</p>
                      <button 
                        onClick={() => handleCopy(selectedMethod.account || selectedMethod.address)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#111827] text-white p-4 rounded-2xl hover:bg-[#E11D48] transition-all active:scale-90 shadow-lg"
                      >
                        <Copy size={20} />
                      </button>
                    </div>

                    {selectedMethod.holder && (
                      <div className="bg-white p-7 rounded-[2rem] border border-gray-200 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Holder Name</p>
                        <p className="text-xl font-black text-[#111827] uppercase italic tracking-tight">{selectedMethod.holder}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex gap-4">
                    <div className="bg-white h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                      <ShieldCheck size={20} />
                    </div>
                    <p className="text-xs font-bold text-emerald-800/80 leading-relaxed">
                      This is a secure gateway. Your funds are protected. Verification usually takes 5-15 minutes.
                    </p>
                  </div>
                </div>

                {/* Submission Form Side */}
                <div className="p-10 lg:p-14 space-y-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Amount to Deposit</label>
                      <div className="relative group">
                        <span className="absolute left-7 top-1/2 -translate-y-1/2 font-black text-[#111827] text-lg">Rs.</span>
                        <input 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-[#E11D48] focus:bg-white rounded-[1.5rem] py-7 pl-16 pr-6 text-[#111827] outline-none font-black text-3xl transition-all shadow-inner"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Upload Transaction Proof</label>
                      <input type="file" id="slip" className="hidden" onChange={handleFileChange} required />
                      <label 
                        htmlFor="slip"
                        className="w-full bg-gray-50 border-2 border-dashed border-gray-200 hover:border-[#E11D48] py-10 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
                      >
                        {slipImage ? (
                          <div className="flex flex-col items-center gap-2">
                             <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 animate-bounce">
                               <CheckCircle2 size={32} />
                             </div>
                             <span className="text-[10px] font-black uppercase text-[#111827]">Slip Attached Successfully</span>
                          </div>
                        ) : (
                          <>
                            <div className="bg-white p-5 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                              <UploadCloud size={32} className="text-gray-300 group-hover:text-[#E11D48]" />
                            </div>
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Upload Screenshot</span>
                          </>
                        )}
                      </label>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#111827] py-7 rounded-[1.5rem] font-black text-white uppercase tracking-[0.3em] text-[11px] hover:bg-black transition-all shadow-2xl hover:shadow-rose-200 flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95"
                    >
                      {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Confirm & Send"}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}