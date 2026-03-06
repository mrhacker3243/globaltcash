"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  UserPlus, Mail, Lock, User, Eye, EyeOff, 
  Loader2, Zap, AlertCircle, Share2, ShieldCheck 
} from "lucide-react";

// --- Logo Component ---
const BrandLogo = () => (
  <div className="flex flex-col items-center gap-3 group">
    <div className="bg-[#E11D48] p-4 rounded-2xl shadow-xl shadow-rose-200 group-hover:scale-110 transition-transform duration-500">
      <Zap size={32} className="text-white fill-white" />
    </div>
    <div className="text-center">
      <span className="block text-2xl font-black text-gray-900 italic uppercase tracking-tighter">Global Trust cash</span>
      <span className="text-[10px] font-black text-[#E11D48] uppercase tracking-[0.4em]">register Your Registration</span>
    </div>
  </div>
);

// --- Main Registration Form Component ---
function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "" 
  });

  // Auto-fill Referral Code from URL (?ref=code)
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 

    if (formData.password !== formData.confirmPassword) {
      setError("Security Keys do not match!");
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          referrerId: formData.referralCode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Protocol rejection: Registration failed");
      }

      router.push("/login?registered=true");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-full h-[600px] bg-rose-100/30 blur-[130px] -z-10 rounded-full" />
      
      <div className="w-full max-w-[440px] space-y-8 py-10">
        <div className="space-y-2 text-center">
          <Link href="/" className="flex justify-center mb-6">
            <BrandLogo />
          </Link>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Initialize New Investor Profile</p>
        </div>

        {error && (
          <div className="bg-white border-l-4 border-[#E11D48] text-gray-900 text-[10px] font-black p-5 rounded-2xl flex items-center gap-4 uppercase tracking-widest shadow-sm animate-pulse">
            <AlertCircle size={20} className="text-[#E11D48]" />
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-[3.5rem] shadow-2xl shadow-rose-100/60">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">Full Legal Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E11D48] transition-colors" size={18} />
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your name"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-5 text-sm font-bold text-gray-900 focus:outline-none focus:border-rose-200 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E11D48] transition-colors" size={18} />
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@gmail.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-5 text-sm font-bold text-gray-900 focus:outline-none focus:border-rose-200 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Referral Code (Locked Logic) */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">
                Referral code {searchParams.get("ref") && "(LOCKED)"}
              </label>
              <div className="relative group">
                <Share2 className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${searchParams.get("ref") ? 'text-[#E11D48]' : 'text-gray-300'}`} size={18} />
                <input 
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => !searchParams.get("ref") && setFormData({...formData, referralCode: e.target.value})}
                  readOnly={!!searchParams.get("ref")}
                  placeholder="OPTIONAL-CODE"
                  className={`w-full border rounded-2xl py-4 pl-14 pr-12 text-[11px] font-black uppercase tracking-widest transition-all outline-none
                    ${searchParams.get("ref") 
                      ? 'bg-rose-50/50 border-rose-100 text-rose-600 cursor-not-allowed' 
                      : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-rose-200 focus:bg-white'
                    }`}
                />
                {searchParams.get("ref") && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <ShieldCheck size={18} className="text-[#E11D48]" />
                  </div>
                )}
              </div>
            </div>

           {/* Passwords Section */}
<div className="space-y-4">
  {/* Set Password Field */}
  <div className="space-y-1.5">
    <label className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">Set Your Password</label>
    <div className="relative group">
      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E11D48] transition-colors" size={18} />
      <input 
        type={showPassword ? "text" : "password"} // Follows toggle
        required
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="••••••••"
        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-12 text-sm font-bold text-gray-900 focus:outline-none focus:border-rose-200 transition-all"
      />
      {/* Yeh button ab dono ko control karega */}
      <button 
        type="button" 
        onClick={() => setShowPassword(!showPassword)} 
        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#E11D48] transition-colors p-1"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>

  {/* Confirm Password Field */}
  <div className="space-y-1.5">
    <label className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">Confirm Your Password</label>
    <div className="relative group">
      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E11D48] transition-colors" size={18} />
      <input 
        type={showPassword ? "text" : "password"} // Yeh bhi wahi state use kar raha hai
        required
        value={formData.confirmPassword}
        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        placeholder="••••••••"
        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-5 text-sm font-bold text-gray-900 focus:outline-none focus:border-rose-200 transition-all"
      />
    </div>
  </div>
</div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-black py-5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-rose-200 mt-4 disabled:opacity-70 uppercase text-[11px] tracking-[0.2em]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Initialize Account"}
            </button>
          </form>
        </div>

        <div className="text-center space-y-6">
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-tighter">
            Already registered Click on?{" "}
            <Link href="/login" className="text-[#E11D48] hover:underline underline-offset-4 decoration-2">login</Link>
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 text-[10px] font-black uppercase tracking-widest transition-all italic">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- Root Component with Suspense ---
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#E11D48]" size={40} />
          <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">Loading Terminal...</span>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}