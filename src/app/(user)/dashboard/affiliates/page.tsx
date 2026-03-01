import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, TrendingUp, Activity, Copy, ShieldCheck } from "lucide-react";
import CopyButton from "@/components/CopyButton";

export default async function ReferralsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    include: {
      referredUsers: true,
    },
  });

  if (!user) return <div className="text-white p-10 font-bold text-center">Identity Not Found</div>;

  const referralLink = `${process.env.NEXTAUTH_URL || 'https://exotic-cash.com'}/register?ref=${user.id}`;

  return (
    <div className="p-4 md:p-8 lg:p-10 pt-24 lg:pt-10 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Header Section */}
      <div className="mb-10 text-slate-900">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)]" />
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">
            Referral <span className="text-purple-600">Program</span>
          </h1>
        </div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5">
           Expand your network • Earn 10% instant commission
        </p>
      </div>

      {/* 2. Referral System Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Main Referral Terminal */}
        <div className="lg:col-span-2 p-[1px] bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-[2.5rem] shadow-[0_0_30px_rgba(147,51,234,0.3)] group overflow-hidden">
          <div className="bg-slate-900 rounded-[2.4rem] p-6 md:p-8 relative h-full overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] -z-10 group-hover:bg-purple-600/20 transition-all duration-700" />
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
               <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-purple-600 blur-xl opacity-40 animate-pulse" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-2xl">
                    <Users size={32} className="group-hover:scale-110 transition-transform" />
                  </div>
               </div>
               <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                    <span className="px-2 py-0.5 bg-purple-600 text-white text-[9px] font-black uppercase tracking-tighter rounded-md">Tier 1</span>
                    <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Your Referral Link</h2>
                  </div>
                  <p className="text-slate-400 text-[10px] md:text-xs font-medium uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
                    <Activity size={12} className="text-purple-500" />
                    Share your unique link to scale your earnings
                  </p>
               </div>
            </div>

            <div className="w-full">
               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-sm group-hover:border-purple-500/30 transition-all">
                  <div className="flex-1 px-4 py-3 sm:py-0 overflow-hidden">
                     <p className="text-slate-500 text-[9px] uppercase font-black mb-1 tracking-widest">Your Referral Link</p>
                     <p className="text-white text-xs md:text-sm font-bold truncate opacity-80">{referralLink}</p>
                  </div>
                  <CopyButton text={referralLink} className="py-4 px-8" />
               </div>
            </div>
          </div>
        </div>

        {/* Network Stats Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-between shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/20 blur-[60px] opacity-30 group-hover:opacity-60 transition-opacity" />
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-4 bg-purple-600/10 rounded-2xl border border-purple-600/30 text-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.2)]">
                    <TrendingUp size={28} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white leading-tight">Referral<br/><span className="text-purple-500">Stats</span></h3>
                 </div>
              </div>
              
              <div className="space-y-6">
                <div>
                   <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Total Referrals</p>
                   <h4 className="text-3xl font-black text-white italic">{user.referredUsers?.length || 0} Users</h4>
                </div>
                
                <div className="p-5 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">System Level</span>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[8px] font-black rounded-lg border border-emerald-500/30">+10.00%</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 w-[15%] shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Operational Partners Table */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black uppercase tracking-tighter italic text-slate-900">
            Referral <span className="text-purple-600">History</span>
          </h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/10 rounded-full border border-purple-600/20">
            <ShieldCheck size={12} className="text-purple-600" />
            <span className="text-purple-600 text-[8px] font-black uppercase tracking-widest">Active Users</span>
          </div>
        </div>
        
        <div className="p-2 sm:p-8">
          {user.referredUsers?.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
              <Users size={40} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">No referrals detected yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-100">
                    <th className="pb-4 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">User Email</th>
                    <th className="pb-4 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Join Date</th>
                    <th className="pb-4 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user.referredUsers.map((ref: any) => (
                    <tr key={ref.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-600/10 rounded-full flex items-center justify-center text-purple-600">
                             <Users size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-900">{ref.email?.split('@')[0]}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[10px] font-medium text-slate-500">
                         {new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                         <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-[8px] font-black uppercase tracking-widest">
                           Active
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}