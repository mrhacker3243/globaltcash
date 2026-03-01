"use client";
import { Database, ExternalLink, ShieldCheck, Server, Activity, Globe } from "lucide-react";
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Activity className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1000px] mx-auto text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">Cloud <span className="text-blue-600 text-5xl">Database</span></h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Database and Server Status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Connection Status */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-[2rem] flex items-center gap-6">
          <div className={`p-4 rounded-2xl ${data?.isConnected ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
            <Database className={data?.isConnected ? 'text-emerald-500' : 'text-red-500'} size={32} />
          </div>
          <div>
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">Connection Status</p>
            <p className="text-xl font-black uppercase italic tracking-tighter">
              {data?.isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>

        {/* Database Provider */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-[2rem] flex items-center gap-6">
          <div className="bg-blue-500/10 p-4 rounded-2xl">
            <Server className="text-blue-500" size={32} />
          </div>
          <div>
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">Provider</p>
            <p className="text-xl font-black uppercase italic tracking-tighter">
              Railway.app
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Credentials Section */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[3rem]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-blue-600" size={24} />
              <h2 className="text-sm font-black uppercase tracking-widest italic text-blue-400">Database Connection</h2>
            </div>
            <a 
              href="https://railway.app" 
              target="_blank" 
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              Open Dashboard <ExternalLink size={12} />
            </a>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-zinc-600 uppercase font-black mb-2 tracking-widest">PostgreSQL URL</p>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-[11px] text-blue-300 break-all select-all">
                {data?.databaseUrl || "****************************************************************"}
              </div>
            </div>
          </div>
          
          <p className="text-[9px] text-zinc-600 mt-6 uppercase font-bold italic tracking-tighter text-blue-500/60">
            * This URL connects your application to the Railway cloud database instance.
          </p>
        </div>

        {/* System Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-bold">
           <div className="bg-zinc-900/40 border border-zinc-800/50 p-5 rounded-2xl flex flex-col items-center">
              <Globe className="text-zinc-700 mb-2" size={20} />
              <p className="text-zinc-500 text-[8px] uppercase">System Version</p>
              <p className="text-xs">{data?.nodeVersion || 'v20.x'}</p>
           </div>
           <div className="bg-zinc-900/40 border border-zinc-800/50 p-5 rounded-2xl flex flex-col items-center">
              <Activity className="text-zinc-700 mb-2" size={20} />
              <p className="text-zinc-500 text-[8px] uppercase">Environment</p>
              <p className="text-xs uppercase">{data?.platform || 'Production'}</p>
           </div>
           <div className="bg-zinc-900/40 border border-zinc-800/50 p-5 rounded-2xl flex flex-col items-center">
              <Server className="text-zinc-700 mb-2" size={20} />
              <p className="text-zinc-500 text-[8px] uppercase">Database Type</p>
              <p className="text-xs uppercase">PostgreSQL</p>
           </div>
        </div>
      </div>
    </div>
  );
}
