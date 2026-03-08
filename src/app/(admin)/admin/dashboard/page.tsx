import { db } from "@/lib/db";
import { Users, Wallet, Clock, BarChart3, History, ArrowDownLeft, ShieldCheck, Search, TrendingUp, AlertCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import YieldTrigger from "@/components/YieldTrigger";
import AdminUserActions from "@/components/AdminUserActions";

const formatPKR = (val: number) => {
  return "Rs. " + val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  let statsData = {
    users: [],
    totalUsers: 0,
    completedStats: { _sum: { amount: 0 } },
    pendingDeposits: 0,
    totalWithdrawals: { _sum: { amount: 0 } },
    recentTransactions: []
  };

  try {
    const [users, totalUsers, completedStats, pendingDeposits, totalWithdrawals, recentTransactions]: any[] = await Promise.all([
      db.user.findMany({
        include: { deposits: { take: 1 }, withdrawals: { take: 1 } },
        orderBy: { createdAt: 'desc' },
        take: 8
      }),
      db.user.count(),
      db.deposit.aggregate({ _sum: { amount: true }, where: { status: "APPROVED" } }),
      db.deposit.count({ where: { status: "PENDING" } }),
      db.withdrawal.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
      db.deposit.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { user: { select: { email: true } } }
      })
    ]);
    statsData = { users, totalUsers, completedStats, pendingDeposits, totalWithdrawals, recentTransactions };
  } catch (error) {
    console.error("Data Fetch Error:", error);
  }

  const { users, totalUsers, completedStats, pendingDeposits, totalWithdrawals, recentTransactions } = statsData;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 p-4 md:p-12 pt-28">
      
      {/* 1. SIMPLE HEADER */}
      <div className="max-w-[1400px] mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic text-gray-900">
            Admin <span className="text-[#E11D48]">Panel.</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">
            System Overlook & User Management
          </p>
        </div>
        <YieldTrigger />
      </div>

      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* 2. STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Total Deposits", val: formatPKR(completedStats._sum.amount || 0), icon: <BarChart3 />, color: "rose" },
            { label: "Pending Requests", val: pendingDeposits, icon: <Clock />, color: "amber" },
            { label: "Total Users", val: totalUsers, icon: <Users />, color: "rose" },
            { label: "Total Withdrawals", val: formatPKR(totalWithdrawals._sum.amount || 0), icon: <Wallet />, color: "rose" },
          ].map((card, i) => (
            <div key={i} className="bg-white border border-gray-100 p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
               <div className={`p-3 w-fit rounded-xl mb-6 ${card.color === 'rose' ? 'bg-rose-50 text-[#E11D48]' : 'bg-amber-50 text-amber-600'}`}>
                {card.icon}
               </div>
               <p className="text-gray-400 text-[9px] font-black uppercase mb-1 tracking-wider">{card.label}</p>
               <h3 className="text-xl md:text-2xl font-black text-gray-900 italic tracking-tight">{card.val}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* 3. RECENT ACTIVITY FEED */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <History size={18} className="text-[#E11D48]" />
               <h2 className="text-sm font-black uppercase italic tracking-wider">Recent Activity</h2>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
              {recentTransactions.map((tx: any) => (
                <div key={tx.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tx.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-[#E11D48]'}`}>
                         <ArrowDownLeft size={14} />
                      </div>
                      <div className="max-w-[130px]">
                         <p className="text-[10px] font-bold text-gray-900 truncate">{tx.user.email}</p>
                         <p className="text-[8px] font-black text-gray-400 uppercase italic">{tx.gateway || 'Bank Transfer'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-900">Rs.{tx.amount}</p>
                      <p className={`text-[7px] font-black uppercase ${tx.status === 'APPROVED' ? 'text-emerald-500' : 'text-amber-500'}`}>{tx.status}</p>
                    </div>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full py-4 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#E11D48] transition-all">
              Download Report
            </button>
          </div>

          {/* 4. USER LIST TABLE */}
          <div className="xl:col-span-2 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
                <div className="flex items-center gap-3">
                   <Users className="text-[#E11D48]" size={20} />
                   <h2 className="text-sm font-black uppercase italic tracking-wider text-gray-900">User Management</h2>
                </div>
                <div className="relative w-full md:w-72">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                   <input type="text" placeholder="Search user email..." className="w-full bg-gray-50 border border-gray-100 pl-10 pr-4 py-3 rounded-xl text-[10px] font-bold outline-none focus:border-[#E11D48]" />
                </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] font-black uppercase text-gray-400 border-b border-gray-50 italic">
                    <th className="pb-4 px-4">User Details</th>
                    <th className="pb-4 px-4">Role</th>
                    <th className="pb-4 px-4">Balance</th>
                    <th className="pb-4 px-4 text-center">Status</th>
                    <th className="pb-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.filter((u: any) => u.role !== 'ADMIN').map((user: any) => (
                    <tr key={user.id} className="group hover:bg-gray-50/50 transition-all">
                       <td className="py-5 px-4">
                          <p className="text-[11px] font-black text-gray-900 uppercase italic">{user.email}</p>
                          <p className="text-[8px] text-gray-400 font-bold uppercase">ID: {user.id.slice(-8)}</p>
                       </td>
                       <td className="py-5 px-4">
                         <span className="text-[10px] font-black uppercase tracking-widest">
                           {user.role}
                         </span>
                       </td>
                       <td className="py-5 px-4 font-black text-sm text-gray-900">
                          {formatPKR(user.balance)}
                       </td>
                       <td className="py-5 px-4 text-center">
                          <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${user.isFrozen ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                            {user.isFrozen ? 'Frozen' : 'Active'}
                          </span>
                       </td>
                       <td className="py-5 px-4 text-right">
                          <AdminUserActions userId={user.id} role={user.role} isFrozen={user.isFrozen} isCurrentUser={user.id === (session.user as any)?.id} />
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}