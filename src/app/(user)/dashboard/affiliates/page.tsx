import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Activity, ShieldCheck, Share2, Zap } from "lucide-react";
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
    <div className="bg-[#F3F4F6] min-h-screen p-3 sm:p-6 md:p-8 lg:p-10 pt-24 lg:pt-10 font-sans text-[#1F2937]">
      <div className="max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 sm:space-y-10">
        
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-[#111827] uppercase italic">
              Referral<span className="text-[#E11D48]">Network</span>
            </h1>
            <p className="text-[#6B7280] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] mt-2 leading-relaxed">
              Scale your team • Earn {(commissionRate * 100).toFixed(2)}% instant commission
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-[#E5E7EB] flex items-center gap-2 w-fit mx-auto md:mx-0">
            <Zap size={12} className="text-[#E11D48] fill-[#E11D48]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#4B5563]">Rewards: Active</span>
          </div>
        </div>

        {/* 2. Referral System Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Main Referral Terminal */}
          <div className="lg:col-span-2 relative group">
            <div className="absolute inset-0 bg-[#E11D48] blur-[80px] opacity-[0.03] pointer-events-none" />
            <div className="bg-[#111827] rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between border border-white/5">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E11D48]/10 blur-[100px] rounded-full -mr-10 -mt-10 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-8 sm:mb-12">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-[#E11D48] blur-2xl opacity-20 animate-pulse" />
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#E11D48] to-[#9F1239] rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-white border border-white/10 shadow-2xl">
                      {/* FIX: Size handled by class for responsiveness */}
                      <Share2 className="w-7 h-7 sm:w-9 sm:h-9" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-2">
                      <span className="px-2 py-0.5 bg-[#E11D48] text-white text-[8px] font-black uppercase tracking-widest rounded-full">Elite Tier</span>
                      <h2 className="text-xl sm:text-4xl font-black text-white uppercase italic tracking-tighter">Referral Link</h2>
                    </div>
                    <p className="text-white/40 text-[9px] sm:text-xs font-bold uppercase tracking-[0.1em] flex items-center justify-center sm:justify-start gap-2">
                      <Activity size={12} className="text-[#E11D48]" />
                      Invite members for passive income
                    </p>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <p className="text-white/20 text-[9px] uppercase font-black tracking-[0.2em] ml-1">Personal Referral URL</p>
                  <div className="flex flex-col sm:flex-row items-stretch gap-3 bg-white/[0.03] border border-white/10 p-2 sm:p-3 rounded-2xl sm:rounded-[2rem] backdrop-blur-md group-hover:border-[#E11D48]/30 transition-all">
                    <div className="flex-1 px-4 py-3 sm:py-0 overflow-hidden flex items-center">
                      <p className="text-white/80 text-xs font-mono truncate tracking-tight w-full">{referralLink}</p>
                    </div>
                    <CopyButton text={referralLink} className="!w-full sm:!w-auto !bg-[#E11D48] !text-white !rounded-xl sm:!rounded-2xl !py-4 !px-8 !font-black !text-[10px] !uppercase !tracking-widest shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Network Stats Card */}
          <div className="bg-white border border-[#E5E7EB] p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] flex flex-col justify-between shadow-xl relative overflow-hidden group">
             <div className="relative z-10 space-y-6 sm:space-y-10">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-[#FFF1F2] rounded-2xl text-[#E11D48] border border-[#FFE4E6]">
                      <Users size={24} strokeWidth={2.5} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter text-[#111827]">Members<br/><span className="text-[#E11D48]">Status</span></h3>
                   </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#F3F4F6]">
                      <p className="text-[#9CA3AF] text-[9px] font-black uppercase tracking-widest mb-1">Active Members</p>
                      <h4 className="text-3xl font-black text-[#111827] italic">{user.referredUsers?.length || 0} <span className="text-xs font-bold text-[#6B7280] not-italic uppercase tracking-widest ml-1">Nodes</span></h4>
                  </div>
                  
                  <div className="px-1">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-black text-[#111827] uppercase tracking-widest">Rate</span>
                        <span className="text-[#E11D48] text-[10px] font-black italic">{(commissionRate * 100).toFixed(2)}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden p-0.5 border border-[#E5E7EB]">
                        <div
                          className="h-full bg-gradient-to-r from-[#E11D48] to-[#BE123C] rounded-full"
                          style={{ width: `${Math.min(100, commissionRate * 100)}%` }}
                        />
                      </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* 3. Operational Partners Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-sm">
          <div className="p-6 sm:p-10 border-b border-[#F3F4F6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter italic text-[#111827]">
              Network <span className="text-[#E11D48]">Registry</span>
            </h3>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <ShieldCheck size={12} className="text-[#E11D48]" />
              <span className="text-[#111827] text-[9px] font-black uppercase tracking-widest">Verified</span>
            </div>
          </div>
          
          <div className="p-3 sm:p-10">
            {user.referredUsers?.length === 0 ? (
              <div className="text-center py-16 sm:py-24 bg-[#F9FAFB] rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-[#E5E7EB]">
                <Users size={24} className="text-[#D1D5DB] mx-auto mb-4" />
                <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.2em] px-4">No active members detected</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-3 px-3 pb-2">
                <table className="w-full border-separate border-spacing-y-2 min-w-[450px]">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-3 px-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Partner</th>
                      <th className="pb-3 px-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest text-center">Date</th>
                      <th className="pb-3 px-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.referredUsers.map((ref: any) => (
                      <tr key={ref.id} className="group">
                        <td className="py-4 px-4 bg-[#F9FAFB] rounded-l-xl border-y border-l border-[#F3F4F6]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#E11D48] border border-[#E5E7EB]">
                               <Users size={14} />
                            </div>
                            <span className="text-xs font-bold text-[#111827] truncate max-w-[80px] sm:max-w-none">{ref.email?.split('@')[0]}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 bg-[#F9FAFB] border-y border-[#F3F4F6] text-center">
                           <span className="text-[10px] font-bold text-[#6B7280] whitespace-nowrap">
                             {new Date(ref.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                           </span>
                        </td>
                        <td className="py-4 px-4 bg-[#F9FAFB] rounded-r-xl border-y border-r border-[#F3F4F6] text-right">
                           <span className="px-2 py-1 bg-white text-[#059669] border border-[#D1FAE5] rounded-md text-[8px] font-black uppercase tracking-tighter sm:tracking-widest">
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
    </div>
  );
}