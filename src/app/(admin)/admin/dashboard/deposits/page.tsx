import { db } from "@/lib/db";
import { Check, X, ExternalLink, Hash, CreditCard, User, Clock, ShieldAlert } from "lucide-react";
import ClientDepositActions from "@/components/ClientDepositActions";
import SlipImage from "@/components/SlipImage";

export default async function AdminDeposits() {
  const pendingDeposits = await db.deposit.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    // Background changed to match landing page (#F9FAFB)
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1400px] mx-auto text-gray-900 font-sans bg-[#F9FAFB] min-h-screen">
      
      {/* --- HEADER SECTION --- */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
            {/* Using Landing Page Red (#E11D48) */}
            <div className="bg-[#E11D48] h-10 w-2 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.3)]" />
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter italic text-gray-900 leading-none">
              Pending <span className="text-[#E11D48]">Deposits</span>
            </h1>
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] ml-0 sm:ml-5 italic">
            Verification Queue • <span className="text-[#E11D48]">{pendingDeposits.length} Pending Nodes</span>
          </p>
        </div>

        {/* Status Badge - Updated with Rose accents */}
        <div className="hidden md:flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
           <ShieldAlert size={18} className="text-[#E11D48] animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Security Check Active</span>
        </div>
      </div>

      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden md:block bg-white border border-gray-100 shadow-xl shadow-rose-100/20 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          {/* Header background changed to Landing Page Dark (#111) */}
          <thead className="bg-[#111] border-b border-gray-800">
            <tr className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
              <th className="p-7">Investor Account</th>
              <th className="p-7">Amount</th>
              <th className="p-7">Transaction Info</th>
              <th className="p-7 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pendingDeposits.length === 0 ? (
              <tr><td colSpan={4} className="p-32 text-center text-gray-300 font-black uppercase text-xs tracking-[0.5em] italic">All nodes verified. Queue Empty.</td></tr>
            ) : (
              pendingDeposits.map((dep) => (
                <tr key={dep.id} className="hover:bg-rose-50/30 transition-all group">
                  <td className="p-7">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#E11D48] border border-gray-100 group-hover:bg-[#E11D48] group-hover:text-white transition-all shadow-sm">
                          <User size={18} />
                       </div>
                       <div>
                          <p className="font-black text-gray-900 text-sm truncate max-w-[180px]">{dep.user.email}</p>
                          <p className="text-[9px] text-[#E11D48] font-black mt-1 uppercase italic tracking-widest">Gateway: {dep.gateway}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-7">
                    <p className="text-xl font-black text-gray-900 tracking-tighter italic">
                      <span className="text-xs text-gray-400 not-italic mr-1">Rs.</span>
                      {dep.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="p-7">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 w-fit">
                        <Hash size={12} className="text-[#E11D48]" />
                        <span className="text-[10px] font-mono font-bold select-all uppercase">{dep.transactionId}</span>
                      </div>
                      {(dep as any).slipImage && (
                        <div className="hover:scale-105 transition-transform origin-left">
                           <SlipImage src={(dep as any).slipImage} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-7 text-right">
                    <ClientDepositActions depositId={dep.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD VIEW --- */}
      <div className="md:hidden space-y-6">
        {pendingDeposits.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
            <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em]">No Pending Tasks</p>
          </div>
        ) : (
          pendingDeposits.map((dep) => (
            <div key={dep.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-7 space-y-6 shadow-xl shadow-rose-100/10">
              <div className="flex justify-between items-start border-b border-gray-50 pb-5">
                <div className="flex items-center gap-3">
                  {/* Icon Box changed to dark theme #111 */}
                  <div className="w-10 h-10 bg-[#111] rounded-2xl flex items-center justify-center text-[#E11D48] shadow-lg shadow-rose-100/20">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 truncate max-w-[140px]">{dep.user.email}</p>
                    <p className="text-[8px] font-black text-[#E11D48] uppercase tracking-widest mt-1 italic">{dep.gateway}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-lg font-black text-gray-900 italic tracking-tighter">Rs. {dep.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                   <Hash size={14} className="text-[#E11D48]" />
                   <span className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-tighter">{dep.transactionId}</span>
                </div>
                {(dep as any).slipImage && (
                  <div className="rounded-[2rem] overflow-hidden border-4 border-gray-50 shadow-inner">
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