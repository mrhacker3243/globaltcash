"use client";
import { Database, ExternalLink, ShieldCheck, Server, Activity, Globe, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function RailwayAdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    databaseUrl?: string;
    isConnected: boolean;
    provider: string;
    nodeVersion: string;
    platform: string;
  } | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/admin/railway-status");
        if (!res.ok) throw new Error("Failed to fetch status");
        const statusData = await res.json();
        setData(statusData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#E11D48]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1000px] mx-auto text-slate-900 font-sans">
      
      {/* --- HEADER --- */}
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">
          Cloud <span className="text-[#E11D48] text-5xl">Database</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">
          Database and Server Status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Connection Status */}
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center gap-6 shadow-sm">
          <div className={`p-4 rounded-2xl ${data?.isConnected ? 'bg-emerald-50' : 'bg-rose-50'}`}>
            <Database className={data?.isConnected ? 'text-emerald-500' : 'text-[#E11D48]'} size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Connection Status</p>
            <p className={`text-xl font-black uppercase italic tracking-tighter ${data?.isConnected ? 'text-emerald-600' : 'text-[#E11D48]'}`}>
              {data?.isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>

        {/* Database Provider */}
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center gap-6 shadow-sm">
          <div className="bg-rose-50 p-4 rounded-2xl">
            <Server className="text-[#E11D48]" size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Provider</p>
            <p className="text-xl font-black uppercase italic tracking-tighter text-slate-900">
              Railway.app
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Credentials Section - LIGHT THEME */}
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-[3rem] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-[#E11D48]" size={24} />
              <h2 className="text-sm font-black uppercase tracking-widest italic text-[#E11D48]">Database Connection</h2>
            </div>
            <a 
              href="https://railway.app" 
              target="_blank" 
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#E11D48] transition-colors"
            >
              Open Dashboard <ExternalLink size={12} />
            </a>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black mb-2 tracking-widest">PostgreSQL URL</p>
              <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-[11px] text-[#E11D48] break-all select-all shadow-inner">
                {data?.databaseUrl || "****************************************************************"}
              </div>
            </div>
          </div>
          
          <p className="text-[9px] text-[#E11D48]/60 mt-6 uppercase font-bold italic tracking-tighter">
            * This URL connects your application to the Railway cloud database instance.
          </p>
        </div>

        {/* System Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-bold">
           {[
             { label: "System Version", val: data?.nodeVersion || "v20.x", icon: Globe },
             { label: "Environment", val: data?.platform || "Production", icon: Activity },
             { label: "Database Type", val: "PostgreSQL", icon: Server }
           ].map((item, i) => (
             <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center shadow-sm">
                <item.icon className="text-slate-300 mb-2" size={20} />
                <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">{item.label}</p>
                <p className="text-xs text-slate-900 uppercase italic mt-1">{item.val}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}