"use client";
import { useState, useEffect } from "react";
import { Copy, CheckCircle2, Wallet, Zap, UploadCloud, ArrowLeft } from "lucide-react";

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [slipImage, setSlipImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // FETCH PROFILE (NO CACHE)
  const fetchProfileData = async () => {
    try {
      const res = await fetch("/api/user/profile", { cache: "no-store" });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then(res => res.json())
      .then(data => setSettings(data));

    fetchProfileData();
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
        await fetchProfileData();
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

  const formatPKR = (val: number) =>
    Number(val || 0).toLocaleString("en-PK");

  // ✅ FIXED TOTAL CALCULATION PROPERLY
  const calculateTotal = () => {
    // If backend sends totalDeposited (even 0)
    if (
      profile &&
      profile.totalDeposited !== undefined &&
      profile.totalDeposited !== null
    ) {
      return Number(profile.totalDeposited);
    }

    // Fallback calculation from deposits array
    if (profile?.deposits && Array.isArray(profile.deposits)) {
      return profile.deposits.reduce((acc: number, curr: any) => {
        return acc + Number(curr.amount || 0);
      }, 0);
    }

    return 0;
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen p-5 md:p-10 pt-24 lg:pt-10 font-sans text-[#1F2937]">
      <div className="max-w-5xl mx-auto space-y-10">

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
                {selectedMethod
                  ? `Step 2: Complete Transfer via ${selectedMethod.name}`
                  : "Step 1: Choose your payment method"}
              </p>
            </div>
          </div>
        </div>

        {!selectedMethod ? (
          <div className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1 italic">
                    Available Balance
                  </p>
                  <h3 className="text-4xl font-black text-[#111827]">
                    Rs. {formatPKR(profile?.balance)}
                  </h3>
                </div>
                <div className="bg-[#FFF1F2] p-5 rounded-3xl text-[#E11D48]">
                  <Wallet size={28} />
                </div>
              </div>

              <div className="bg-[#111827] p-8 rounded-[2.5rem] shadow-xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 italic">
                    Total Deposits
                  </p>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter">
                    Rs. {formatPKR(calculateTotal())}
                  </h3>
                </div>
                <div className="bg-white/10 p-5 rounded-3xl text-[#E11D48]">
                  <Zap size={28} />
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {methods.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMethod(m)}
                  className="bg-white p-10 rounded-[3rem] border-2 border-transparent shadow-sm cursor-pointer hover:border-[#E11D48] transition-all flex flex-col items-center text-center gap-6"
                >
                  <div className="w-20 h-20 rounded-3xl overflow-hidden bg-gray-50 p-3 border border-gray-100">
                    <img src={m.logo} alt={m.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-[#E11D48] bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">
                      {m.type}
                    </span>
                    <h3 className="text-xl font-black text-[#111827]">
                      {m.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
}