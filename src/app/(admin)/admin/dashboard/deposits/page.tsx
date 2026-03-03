import { db } from "@/lib/db";
import { Check, X, ExternalLink, Hash, CreditCard, User, Clock } from "lucide-react";
import ClientDepositActions from "@/components/ClientDepositActions";
import SlipImage from "@/components/SlipImage";

export default async function AdminDeposits() {
  const pendingDeposits = await db.deposit.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1400px] mx-auto text-slate-900">
      {/* --- HEADER SECTION --- */}
      <div className="mb-10 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
          <div className="bg-[#E11D48] h-8 w-1.5 rounded-full" />
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">
            Pending <span className="text-[#E11D48]">Deposits</span>
          </h1>
        </div>
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] ml-0 sm:ml-5 italic">
          Verification Queue • Total: <span className="text-[#E11D48]">{pendingDeposits.length} Nodes</span>
        </p>
      </div>

      {/* --- DESKTOP TABLE VIEW (Hidden on Mobile < 768px) --- */}
      <div className="hidden md:block bg-white border border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="p-6">User / Account</th>
              <th className="p-6">Amount</th>
              <th className="p-6">TxID & Evidence</th>
              <th className="p-6 text-right">System Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pendingDeposits.length === 0 ? (
              <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-black uppercase text-xs tracking-[0.4em]">Queue Cleared</td></tr>
            ) : (
              pendingDeposits.map((dep) => (
                <tr key={dep.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="p-6">
                    <p className="font-bold text-slate-900 text-xs truncate max-w-[150px]">{dep.user.email}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase italic tracking-tighter">Via: {dep.gateway}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-lg font-black text-emerald-600 tracking-tighter">Rs. {dep.amount.toLocaleString()}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-slate-400 hover:text-[#E11D48] transition-colors">
                        <Hash size={12} />
                        <span className="text-[10px] font-mono select-all uppercase">{dep.transactionId}</span>
                      </div>
                      {(dep as any).slipImage && <SlipImage src={(dep as any).slipImage} />}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <ClientDepositActions depositId={dep.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD VIEW (Hidden on Desktop > 768px) --- */}
      <div className="md:hidden space-y-4">
        {pendingDeposits.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-dashed border-slate-200 text-center text-[10px] font-black uppercase text-slate-400">
            Empty Queue
          </div>
        ) : (
          pendingDeposits.map((dep) => (
            <div key={dep.id} className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <User size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Investor</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[180px]">{dep.user.email}</p>
                </div>
                <div className="text-right">
                   <p className="text-sm font-black text-emerald-600 italic">Rs. {dep.amount.toLocaleString()}</p>
                   <p className="text-[8px] font-black text-slate-300 uppercase mt-1 italic tracking-widest">{dep.gateway}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                   <CreditCard size={14} className="text-slate-400" />
                   <span className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">{dep.transactionId}</span>
                </div>
                {(dep as any).slipImage && (
                  <div className="rounded-2xl overflow-hidden border border-slate-100">
                    <SlipImage src={(dep as any).slipImage} />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <ClientDepositActions depositId={dep.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}