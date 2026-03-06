import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, TrendingUp, Activity, Copy, ShieldCheck, Share2, Zap } from "lucide-react";
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

  const rank = await db.referralRank.findUnique({
    where: { name: user?.rankLevel || "Starter" },
  });
  const commissionRate = rank?.commissionPercent ?? 0.05;

  if (!user) return <div className="text-white p-10 font-bold text-center">Identity Not Found</div>;

  const referralLink = `${process.env.NEXTAUTH_URL || 'https://globaltrust.cash'}/register?ref=${user.id}`;

  return (
    <div className="bg-[#F3F4F6] min-h-screen p-4 md:p-8 lg:p-10 pt-24 lg:pt-10 font-sans text-[#1F2937]">
      <div className="max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
        
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-[#111827] uppercase italic">
            Referral<span className="text-[#E11D48]">Network</span>
            </h1>
            <p className="text-[#6B7280] text-[10px] font-black uppercase tracking-[0.4em] mt-2">
              Scale your team • Earn {(commissionRate * 100).toFixed(2)}% instant commission
            </p>
          </div>
          <div className="bg-white px-5 py-2 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center gap-2 w-fit">
            <Zap size={14} className="text-[#E11D48] fill-[#E11D48]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4B5563]">Rewards: Active</span>
          </div>
        </div>

        {/* 2. Referral System Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Referral Terminal */}
          <div className="lg:col-span-2 relative group">
            <div className="absolute inset-0 bg-[#E11D48] blur-[100px] opacity-[0.03] pointer-events-none" />
            <div className="bg-[#111827] rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between border border-white/5">
              
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#E11D48]/10 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-8 mb-12">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-[#E11D48] blur-2xl opacity-20 animate-pulse" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-[#E11D48] to-[#9F1239] rounded-[2rem] flex items-center justify-center text-white border border-white/10 shadow-2xl">
                      <Share2 size={36} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="text-center sm:text-left space-y-2">
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <span className="px-3 py-1 bg-[#E11D48] text-white text-[9px] font-black uppercase tracking-widest rounded-full">Elite Tier</span>
                      <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter">Referral Link</h2>
                    </div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center sm:justify-start gap-2">
                      <Activity size={14} className="text-[#E11D48]" />
                      Invite members to unlock passive income
                    </p>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em] ml-2">Personal Referral URL</p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/[0.03] border border-white/10 p-3 rounded-[2rem] backdrop-blur-md group-hover:border-[#E11D48]/30 transition-all shadow-inner">
                    <div className="flex-1 px-5 py-3 sm:py-0 overflow-hidden">
                      <p className="text-white/80 text-sm font-mono truncate tracking-tight">{referralLink}</p>
                    </div>
                    <CopyButton text={referralLink} className="!bg-[#E11D48] !text-white !rounded-2xl !py-4 !px-10 !font-black !text-[11px] !uppercase !tracking-widest hover:!bg-[#BE123C] transition-colors shadow-lg shadow-rose-900/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Network Stats Card */}
          <div className="bg-white border border-[#E5E7EB] p-10 rounded-[3rem] flex flex-col justify-between shadow-xl relative overflow-hidden group">
             <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-5">
                   <div className="p-5 bg-[#FFF1F2] rounded-[1.5rem] text-[#E11D48] border border-[#FFE4E6]">
                      <Users size={30} strokeWidth={2.5} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[#111827]">Members<br/><span className="text-[#E11D48]">Status</span></h3>
                   </div>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-[#F9FAFB] p-6 rounded-[2rem] border border-[#F3F4F6]">
                      <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-widest mb-1">Active Members</p>
                      <h4 className="text-4xl font-black text-[#111827] italic">{user.referredUsers?.length || 0} <span className="text-sm font-bold text-[#6B7280] not-italic uppercase tracking-widest ml-1">Members</span></h4>
                  </div>
                  
                  <div className="px-2">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Commission Rate</span>
                        <span className="text-[#E11D48] text-xs font-black italic">{(commissionRate * 100).toFixed(2)}%</span>
                     </div>
                     <div className="w-full h-3 bg-[#F3F4F6] rounded-full overflow-hidden p-1 border border-[#E5E7EB]">
                        <div
                          className="h-full bg-gradient-to-r from-[#E11D48] to-[#BE123C] rounded-full shadow-[0_0_10px_rgba(225,29,72,0.4)]"
                          style={{ width: `${Math.min(100, commissionRate * 100)}%` }}
                        />
                     </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* 3. Operational Partners Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-[3rem] overflow-hidden shadow-sm">
          <div className="p-8 md:p-10 border-b border-[#F3F4F6] flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tighter italic text-[#111827]">
              Network <span className="text-[#E11D48]">Registry</span>
            </h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
              <ShieldCheck size={14} className="text-[#E11D48]" />
              <span className="text-[#111827] text-[10px] font-black uppercase tracking-widest">Verified Entries</span>
            </div>
          </div>
          
          <div className="p-4 md:p-10">
            {user.referredUsers?.length === 0 ? (
              <div className="text-center py-24 bg-[#F9FAFB] rounded-[2.5rem] border-2 border-dashed border-[#E5E7EB]">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Users size={28} className="text-[#D1D5DB]" />
                </div>
                <p className="text-[#9CA3AF] text-[11px] font-black uppercase tracking-[0.3em]">No active members detected in network</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4 px-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Partner Identity</th>
                      <th className="pb-4 px-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest text-center">Protocol Date</th>
                      <th className="pb-4 px-6 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.referredUsers.map((ref: any) => (
                      <tr key={ref.id} className="group hover:translate-x-1 transition-transform">
                        <td className="py-5 px-6 bg-[#F9FAFB] rounded-l-[1.5rem] border-y border-l border-[#F3F4F6]">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#E11D48] border border-[#E5E7EB] shadow-sm">
                               <Users size={18} />
                            </div>
                            <span className="text-sm font-bold text-[#111827] tracking-tight">{ref.email?.split('@')[0]}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 bg-[#F9FAFB] border-y border-[#F3F4F6] text-center">
                           <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-tight">
                             {new Date(ref.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </span>
                        </td>
                        <td className="py-5 px-6 bg-[#F9FAFB] rounded-r-[1.5rem] border-y border-r border-[#F3F4F6] text-right">
                           <span className="px-4 py-1.5 bg-white text-[#059669] border border-[#D1FAE5] rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                             Active Members
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
    </div>
  );
}