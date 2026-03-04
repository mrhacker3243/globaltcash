import { db } from "@/lib/db";
import { ArrowUpRight } from "lucide-react";
import ClientWithdrawalActions from "@/components/ClientWithdrawalActions";

export default async function AdminWithdrawals() {
  const withdrawals = await db.withdrawal.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1400px] mx-auto text-slate-900 min-h-screen bg-[#F9FAFB]">
      
      {/* SIMPLE HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900">
          Withdraw <span className="text-[#E11D48]">Requests</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
          Check and approve user withdrawal requests
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {withdrawals.length === 0 ? (
          <div className="bg-white border border-slate-200 p-20 rounded-[2.5rem] text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
            No Requests Found
          </div>
        ) : (
          withdrawals.map((wd) => (
            <div key={wd.id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-sm transition-all shadow-sm">
              
              {/* USER INFO */}
              <div className="flex items-center gap-5">
                <div className="bg-rose-50 p-4 rounded-2xl text-[#E11D48] border border-rose-100">
                  <ArrowUpRight size={24}/>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight italic">{wd.user.email}</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider truncate max-w-[250px]">
                    Account: {wd.address}
                  </p>
                </div>
              </div>
              
              {/* AMOUNT */}
              <div className="text-center">
                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Amount to Pay</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter italic">
                  Rs. {wd.amount.toLocaleString()}
                </p>
              </div>

              {/* STATUS & ACTIONS */}
              <div className="flex items-center gap-8">
                 <div className="text-right hidden sm:block">
                    <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Status</p>
                    <span className={`text-[10px] font-black uppercase italic ${wd.status === 'PENDING' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {wd.status}
                    </span>
                 </div>
                 
                 {/* BUTTONS (Approve/Reject) */}
                 <div className="scale-110">
                    <ClientWithdrawalActions withdrawalId={wd.id} status={wd.status} />
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}