"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, Zap, AlertCircle } from "lucide-react";

// Local Logo Component to match the landing page style
const BrandLogo = () => (
  <div className="flex flex-col items-center gap-3 group">
    <div className="bg-[#E11D48] p-4 rounded-2xl shadow-xl shadow-rose-200 group-hover:rotate-[360deg] transition-transform duration-700">
      <Zap size={32} className="text-white fill-white" />
    </div>
    <div className="text-center">
      <span className="block text-2xl font-black text-gray-900 italic uppercase tracking-tighter">Global Trust Cash</span>
      <span className="text-[10px] font-black text-[#E11D48] uppercase tracking-[0.4em]">Evolution of wealth</span>
    </div>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      const session = await getSession();
      router.refresh();
      
      if (session?.user && (session.user as any).role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("Security protocols failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-rose-100/40 blur-[120px] -z-10 rounded-full" />
      
      <div className="w-full max-w-[420px] space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <Link href="/" className="flex justify-center mb-8">
            <BrandLogo />
          </Link>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] text-center">Secured Authentication Protocol</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-white border-l-4 border-[#E11D48] text-gray-900 text-[10px] font-black p-5 rounded-2xl flex items-center gap-4 uppercase tracking-widest shadow-sm animate-in slide-in-from-top duration-300">
            <AlertCircle size={20} className="text-[#E11D48]" />
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white border border-gray-100 p-8 rounded-[3rem] shadow-2xl shadow-rose-100/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Enter Your (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E11D48] transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@gmail.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-5 text-sm font-bold text-gray-900 focus:outline-none focus:border-rose-200 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Enter your password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E11D48] transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-14 text-sm font-bold text-gray-900 focus:outline-none focus:border-rose-200 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all placeholder:text-gray-300"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#E11D48] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-black py-5 rounded-[1.5rem] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-rose-200 mt-4 disabled:opacity-70 disabled:cursor-not-allowed uppercase text-[11px] tracking-[0.2em]"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Verifying...</>
              ) : (
                <><LogIn size={20} /> Login Account</>
              )}
            </button>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="text-center space-y-6">
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-tighter">
            New User?{" "}
            <Link href="/register" className="text-[#E11D48] hover:underline underline-offset-4 decoration-2">Create Account</Link>
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 text-[10px] font-black uppercase tracking-widest transition-all italic">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}