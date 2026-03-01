import { db } from "@/lib/db";
import { ArrowUpRight, Clock, ShieldCheck } from "lucide-react";
import ClientWithdrawalActions from "@/components/ClientWithdrawalActions";

export default async function AdminWithdrawals() {
  const withdrawals = await db.withdrawal.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto text-slate-900">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 flex items-baseline gap-2">
          Payout <span className="text-red-600 text-5xl">Queue</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Process user withdrawal requests</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {withdrawals.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 p-20 rounded-[2.5rem] text-center text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
            No Withdrawal Requests Found
          </div>
        ) : (
          withdrawals.map((wd) => (
            <div key={wd.id} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-5">
                <div className="bg-red-50 p-4 rounded-2xl text-red-600 border border-red-100"><ArrowUpRight size={24}/></div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">{wd.user.email}</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase italic mt-1 tracking-widest truncate max-w-[200px]">Address: {wd.address}</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Withdrawal Amount</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">Rs. {wd.amount.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-6">
                 <div className="text-right hidden sm:block">
                    <p className="text-[9px] text-slate-400 font-black uppercase">Status</p>
                    <span className={`text-[10px] font-black uppercase italic ${wd.status === 'PENDING' ? 'text-amber-600' : 'text-emerald-600'}`}>{wd.status}</span>
                 </div>
                 <ClientWithdrawalActions withdrawalId={wd.id} status={wd.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
