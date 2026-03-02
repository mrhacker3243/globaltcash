import { db } from "@/lib/db";
import { Wallet, ArrowDownCircle, ArrowUpCircle, Activity, ShieldCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    include: { 
      deposits: { orderBy: { createdAt: 'desc' } }, 
      withdrawals: { orderBy: { createdAt: 'desc' } } 
    },
  });

  if (!user) return <div className="text-white p-10 font-bold text-center">Identity Not Found</div>;

  // Filter out plan purchases from actual deposits
  const actualDeposits = user.deposits.filter(d => d.gateway !== "Internal Balance");
  const activePlans = user.deposits.filter(d => d.gateway === "Internal Balance" && d.status === "ACTIVE");
  
  const totalDeposits = actualDeposits.reduce((acc, curr) => acc + curr.amount, 0);
  const totalWithdrawals = user.withdrawals.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-4 md:p-8 lg:p-10 pt-24 lg:pt-10 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Header Section - Mobile Only (Integrated with Premium Feel) */}
      <div className="mb-10 lg:hidden flex flex-col gap-6">
        <div className="relative p-8 rounded-[2rem] bg-[#0f172a] border border-[#22c55e]/20 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e]/10 blur-3xl rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#22c55e] h-10 w-1.5 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.6)]" />
              <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">
                Account <span className="text-[#22c55e]">Overview</span>
              </h1>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] ml-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
              {user.email?.split('@')[0]} • Online
            </p>
          </div>
        </div>
      </div>

      {/* 2. Primary Financial Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        
        {/* Main Balance Terminal */}
        <div className="bg-[#0f172a] border border-[#22c55e]/20 p-5 sm:p-8 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-[#22c55e]/5 col-span-1 md:col-span-2">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#22c55e]/10 rounded-full blur-[100px] group-hover:bg-[#22c55e]/15 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22c55e] to-transparent opacity-30" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] italic">Total Balance</p>
              <div className="p-2 md:p-3 bg-[#22c55e]/20 rounded-xl md:rounded-2xl border border-[#22c55e]/30 text-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <Wallet size={20} className="md:size-6" />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">Available Balance</span>
              <h3 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter flex items-center justify-center sm:justify-start gap-2 md:gap-3">
                <span className="text-[#22c55e] italic opacity-80 text-xl sm:text-3xl md:text-4xl">Rs.</span>
                {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            
            <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center sm:justify-start gap-3 md:gap-4">
               <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#22c55e]/10 rounded-full border border-[#22c55e]/20 backdrop-blur-xl shrink-0">
                  <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-[#22c55e] rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                  <span className="text-[#22c55e] text-[8px] md:text-[9px] font-black uppercase tracking-widest">Online</span>
               </div>
               <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#22c55e]/10 rounded-full border border-[#22c55e]/20 backdrop-blur-xl shrink-0">
                  <Activity size={10} className="md:size-[12px] text-[#22c55e]" />
                  <span className="text-[#22c55e] text-[8px] md:text-[9px] font-black uppercase tracking-widest">Compound 100%</span>
               </div>
            </div>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 col-span-1 md:col-span-2">
          {/* Total Inbound */}
          <div className="bg-gradient-to-br from-[#22c55e]/30 to-[#16a34a]/40 p-4 sm:p-6 rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-between group hover:shadow-xl hover:shadow-[#22c55e]/20 transition-all border border-[#22c55e]/20">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/20 rounded-xl text-white group-hover:scale-110 transition-transform">
                <ArrowDownCircle size={18} className="md:size-[22px]" />
              </div>
              <span className="text-white/40 text-[8px] md:text-[9px] font-black italic">DEPOSITS</span>
            </div>
            <div>
              <p className="text-white/60 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Total Deposits</p>
              <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">Rs. {totalDeposits.toLocaleString()}</h3>
            </div>
          </div>

          {/* Total Outbound */}
          <div className="bg-gradient-to-br from-[#facc15]/30 to-[#f59e0b]/40 p-4 sm:p-6 rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-between group hover:shadow-xl hover:shadow-[#facc15]/20 transition-all border border-[#facc15]/20">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/20 rounded-xl text-white group-hover:scale-110 transition-transform">
                <ArrowUpCircle size={18} className="md:size-[22px]" />
              </div>
              <span className="text-white/40 text-[8px] md:text-[9px] font-black italic">WITHDRAWALS</span>
            </div>
            <div>
              <p className="text-white/60 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Total Withdrawals</p>
              <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">Rs. {totalWithdrawals.toLocaleString()}</h3>
            </div>
          </div>

          {/* Active Nodes */}
          <div className="bg-gradient-to-br from-[#22c55e]/30 to-[#10b981]/40 p-4 sm:p-6 rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-between group hover:shadow-xl hover:shadow-[#22c55e]/20 transition-all border border-[#22c55e]/20">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/20 rounded-xl text-white group-hover:animate-pulse">
                <Activity size={18} className="md:size-[22px]" />
              </div>
            </div>
            <div className="mt-2 sm:mt-0">
              <p className="text-white/60 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Active Plans</p>
              <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">{activePlans.length}</h3>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-gradient-to-br from-[#3b82f6]/30 to-[#06b6d4]/40 p-4 sm:p-6 rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-between group shadow-lg border border-[#3b82f6]/20 hover:shadow-xl hover:shadow-[#3b82f6]/20 transition-all">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/20 rounded-xl text-white">
                <ShieldCheck size={18} className="md:size-[22px]" />
              </div>
            </div>
            <div className="mt-2 sm:mt-0">
              <p className="text-white/60 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Security</p>
              <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">Tier 1</h3>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Operational History */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Recent Ledger */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
              Activity <span className="text-[#22c55e]">History</span>
            </h2>
            <Link href="/dashboard/deposit" className="text-[10px] font-black text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-[#22c55e] hover:text-black transition-all italic">View History</Link>
          </div>
          
          <div className="bg-[#0f172a] border border-[#22c55e]/20 rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden shadow-sm">
            {actualDeposits.length === 0 ? (
              <div className="text-center py-24 bg-[#1e293b] rounded-[2rem] border-2 border-dashed border-[#22c55e]/20 flex flex-col items-center gap-4">
                <div className="p-4 bg-[#22c55e]/10 rounded-full text-[#22c55e]">
                   <Activity size={32} />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">No Recent Activity</p>
              </div>
            ) : (
              <div className="space-y-4 relative z-10">
                {actualDeposits.slice(0, 5).map((dep) => (
                  <div key={dep.id} className="flex items-center justify-between p-5 bg-[#1e293b] border border-[#22c55e]/20 rounded-[1.5rem] hover:border-[#22c55e]/40 hover:bg-[#1e293b]/80 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all group">
                    <div className="flex items-center gap-5">
                       <div className="relative">
                          {dep.gateway === 'JazzCash' && (
                            <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shrink-0 border border-slate-100 group-hover:border-[#22c55e]/40 transition-colors shadow-sm">
                              <img src="https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo.png" alt="JazzCash" className="w-full h-full object-contain" />
                            </div>
                          )}
                          {dep.gateway === 'EasyPaisa' && (
                            <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shrink-0 border border-slate-100 group-hover:border-[#22c55e]/40 transition-colors shadow-sm">
                              <img src="https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png" alt="EasyPaisa" className="w-full h-full object-contain" />
                            </div>
                          )}
                          {!['JazzCash', 'EasyPaisa'].includes(dep.gateway || '') && (
                            <div className="w-10 h-10 bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] flex items-center justify-center rounded-xl group-hover:bg-[#22c55e] group-hover:text-black transition-all shadow-sm">
                              <Wallet size={20} />
                            </div>
                          )}
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-tight text-white">{dep.gateway || 'Deposit'}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">ID: {dep.transactionId?.substring(0, 12) || 'N/A'}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-white tracking-tighter">
                          +Rs. {dep.amount.toLocaleString()}
                       </p>
                       <div className="flex flex-col items-end gap-1">
                          <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${
                             dep.status === 'APPROVED' || dep.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 
                             dep.status === 'REJECTED' ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 
                             'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          }`}>{dep.status}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Plans Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
              Active <span className="text-[#22c55e]">Plans</span>
            </h2>
          </div>
          
          <div className="bg-[#0f172a] border border-[#22c55e]/20 rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden shadow-sm">
            {activePlans.length === 0 ? (
              <div className="text-center py-24 bg-[#1e293b] rounded-[2rem] border-2 border-dashed border-[#22c55e]/20 flex flex-col items-center gap-4">
                <div className="p-4 bg-[#22c55e]/10 rounded-full text-[#22c55e]">
                   <Activity size={32} />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">No Active Plans</p>
              </div>
            ) : (
              <div className="space-y-4 relative z-10">
                {activePlans.slice(0, 5).map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-5 bg-[#1e293b] border border-[#22c55e]/20 rounded-[1.5rem] hover:border-[#22c55e]/40 hover:bg-[#1e293b]/80 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all group">
                    <div className="flex items-center gap-5">
                       <div className="w-10 h-10 bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] flex items-center justify-center rounded-xl group-hover:bg-[#22c55e] group-hover:text-black transition-all shadow-sm">
                         <Wallet size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-tight text-white">{plan.planName || 'Plan Purchase'}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">ID: {plan.transactionId?.substring(0, 12) || 'N/A'}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-white tracking-tighter">
                          +Rs. {plan.amount.toLocaleString()}
                       </p>
                       <div className="flex flex-col items-end gap-1">
                          <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${
                             plan.status === 'APPROVED' || plan.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 
                             plan.status === 'REJECTED' ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 
                             'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          }`}>{plan.status}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}