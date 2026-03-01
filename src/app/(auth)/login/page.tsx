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
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
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
          <div className="bg-red-50 border border-red-100 text-red-500 text-[10px] font-bold p-4 rounded-xl flex items-center gap-3 uppercase tracking-widest">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Identity</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:border-purple-600 transition-all placeholder:text-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Security Key</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm text-slate-900 focus:outline-none focus:border-purple-600 transition-all placeholder:text-slate-200"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase text-[12px] tracking-widest"
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
            New to Exotic Cash?{" "}
            <Link href="/register" className="text-purple-600 font-bold hover:underline italic">Register Now</Link>
          </p>
          <Link href="/" className="inline-block text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest transition italic">
            ← Back to Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}
