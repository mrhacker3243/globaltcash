"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

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

      // Successful login - fetch session to get user role
      const session = await getSession();
      
      router.refresh();
      
      // Redirect based on user role from database
      if (session?.user && (session.user as any).role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] space-y-6">
        
        {/* Logo & Info */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block group">
            <BrandLogo size="lg" className="flex-col !gap-5" />
          </Link>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Accessing Your Secure Account</p>
        </div>

        {/* Error Box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold p-4 rounded-xl flex items-center gap-3 uppercase tracking-widest">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Form Container */}
        <div className="bg-[#0f172a] border border-[#22c55e]/20 p-6 rounded-[2.5rem] shadow-xl shadow-[#22c55e]/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Identity</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#22c55e] transition" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  className="w-full bg-[#1e293b] border border-[#22c55e]/20 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#22c55e]/50 focus:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Security Key</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#22c55e] transition" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full bg-[#1e293b] border border-[#22c55e]/20 rounded-2xl py-4 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-[#22c55e]/50 focus:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all placeholder:text-slate-500"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#22c55e]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-black py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#22c55e]/30 mt-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase text-[12px] tracking-widest"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Authenticating...</>
              ) : (
                <><LogIn size={18} /> Access Account</>
              )}
            </button>
          </form>
        </div>

        <div className="text-center space-y-4">
          <p className="text-slate-400 text-xs">
            New to Global Trust Cash?{" "}
            <Link href="/register" className="text-[#22c55e] font-bold hover:underline italic">Register Now</Link>
          </p>
          <Link href="/" className="inline-block text-slate-400 hover:text-[#22c55e] text-[10px] font-black uppercase tracking-widest transition italic">
            ← Back to Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}
