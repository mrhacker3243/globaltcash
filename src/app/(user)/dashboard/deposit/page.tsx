"use client";
import { useState, useEffect } from "react";
import { Copy, CheckCircle2, UploadCloud, ArrowLeft } from "lucide-react";

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [slipImage, setSlipImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then(res => res.json())
      .then(data => setSettings(data));
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
    alert("Copied!");
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
        body: JSON.stringify({
          amount: parseFloat(amount),
          gateway: selectedMethod.name,
          slipImage
        })
      });

      if (res.ok) {
        alert("Deposit request submitted!");
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

  return (
    <div className="bg-[#F3F4F6] min-h-screen p-5 md:p-10 pt-24 lg:pt-10 font-sans text-[#1F2937]">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {selectedMethod && (
              <button onClick={() => setSelectedMethod(null)} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-200 active:scale-90">
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
        </div>

        {!selectedMethod ? (
          /* STEP 1: ONLY PAYMENT METHODS - CARDS REMOVED */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {methods.map((m) => (
              <div key={m.id} onClick={() => setSelectedMethod(m)} className="bg-white p-10 rounded-[3rem] border-2 border-transparent shadow-sm cursor-pointer hover:border-[#E11D48] transition-all flex flex-col items-center text-center gap-6 group">
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
        ) : (
          /* STEP 2: FORM VIEW */
          <div className="animate-in zoom-in-95 fade-in duration-500">
            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-white overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                
                {/* Credentials */}
                <div className="p-10 lg:p-14 bg-[#F9FAFB] border-r border-gray-100 space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <img src={selectedMethod.logo} className="w-10 h-10 object-contain" />
                       <h3 className="text-2xl font-black text-[#111827] italic uppercase">Transfer Details</h3>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Send exact amount and upload screenshot.</p>
                  </div>

                  <div className="space-y-5">
                    <div className="bg-white p-7 rounded-[2rem] border border-gray-200 shadow-sm relative">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Account / Address</p>
                      <p className="text-2xl font-mono font-black text-[#111827] break-all">{selectedMethod.account || selectedMethod.address}</p>
                      <button onClick={() => handleCopy(selectedMethod.account || selectedMethod.address)} className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#111827] text-white p-4 rounded-2xl hover:bg-[#E11D48] shadow-lg transition-all active:scale-90">
                        <Copy size={20} />
                      </button>
                    </div>

                    {selectedMethod.holder && (
                      <div className="bg-white p-7 rounded-[2rem] border border-gray-200">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Holder Name</p>
                        <p className="text-xl font-black text-[#111827] uppercase">{selectedMethod.holder}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form */}
                <div className="p-10 lg:p-14 space-y-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Amount (Rs.)</label>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#E11D48] focus:bg-white rounded-[1.5rem] py-7 px-8 text-[#111827] outline-none font-black text-3xl shadow-inner transition-all"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Upload Slip</label>
                      <input type="file" id="slip" className="hidden" onChange={handleFileChange} required />
                      <label htmlFor="slip" className="w-full bg-gray-50 border-2 border-dashed border-gray-200 py-10 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#E11D48]">
                        {slipImage ? <CheckCircle2 size={32} className="text-emerald-500 animate-bounce" /> : <UploadCloud size={32} className="text-gray-300" />}
                        <span className="text-[10px] font-black uppercase text-gray-400 mt-2">{slipImage ? "Screenshot Attached" : "Click to Upload Screenshot"}</span>
                      </label>
                    </div>

                    <button disabled={loading} className="w-full bg-[#111827] py-7 rounded-[1.5rem] font-black text-white uppercase tracking-widest text-[11px] hover:bg-black transition-all shadow-2xl disabled:opacity-50">
                      {loading ? "Processing..." : "Confirm & Send"}
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