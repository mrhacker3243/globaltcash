import { db } from "@/lib/db";
import { Check, X, ExternalLink, Hash } from "lucide-react";
import ClientDepositActions from "@/components/ClientDepositActions";
import SlipImage from "@/components/SlipImage";

export default async function AdminDeposits() {
  const pendingDeposits = await db.deposit.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto text-slate-900">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-600 h-8 w-1.5 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.3)]" />
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">
            Pending <span className="text-purple-600">Deposits</span>
          </h1>
        </div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] ml-5 italic">
          Verify payments and update user balance • Status: <span className="text-emerald-500 italic">Live Tracking</span>
        </p>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="p-6">User Details</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Transaction ID / Slip</th>
              <th className="p-6 text-right">System Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pendingDeposits.length === 0 ? (
              <tr><td colSpan={4} className="p-20 text-center text-slate-400 text-xs font-black uppercase tracking-[0.3em]">No Pending Deposits</td></tr>
            ) : (
              pendingDeposits.map((dep) => (
                <tr key={dep.id} className="hover:bg-slate-50 transition-all group">
                  <td className="p-6">
                    <p className="font-bold text-slate-900 uppercase text-xs">{dep.user.email}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase italic tracking-tighter">Gateway: {dep.gateway}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-lg font-black text-emerald-600 tracking-tighter">Rs. {dep.amount.toFixed(2)}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-slate-500 hover:text-purple-600 cursor-pointer transition-colors">
                        <Hash size={12} />
                        <span className="text-[10px] font-mono">{dep.transactionId}</span>
                        <ExternalLink size={12} />
                      </div>
                      {(dep as any).slipImage && (
                        <SlipImage src={(dep as any).slipImage} />
                      )}
                    </div>
                  </td>
                  <td className="p-6 text-right space-x-3">
                    <ClientDepositActions depositId={dep.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
