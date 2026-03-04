import { db } from "@/lib/db";
import { Search, UserPlus, Filter, MoreHorizontal, ShieldCheck } from "lucide-react";

export default async function InvestorsTerminal() {
  const investors = await db.user.findMany({
    where: { role: "USER" },
    include: { deposits: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    // Background changed to match landing page light gray
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto bg-[#F9FAFB] min-h-screen font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          {/* Purple to Rose #E11D48 */}
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-gray-900">
            Investor <span className="text-[#E11D48]">Assets</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">
            A directory of all registered users
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              placeholder="Search User..." 
              className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:border-[#E11D48] transition-all shadow-sm"
            />
          </div>
          {/* Purple to Rose Button */}
          <button className="bg-[#E11D48] p-3 rounded-2xl text-white hover:bg-rose-700 transition shadow-lg shadow-rose-100">
            <UserPlus size={20}/>
          </button>
        </div>
      </div>

      {/* --- INVESTOR LIST --- */}
      <div className="grid grid-cols-1 gap-4">
        {investors.map((investor) => (
          <div 
            key={investor.id} 
            className="bg-white border border-gray-100 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#E11D48]/30 transition-all group shadow-sm"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Avatar: Light Rose background with Rose text */}
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-[#E11D48] font-black italic border border-rose-100">
                {investor.email?.[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#E11D48] transition-colors">
                  {investor.email}
                </h3>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">
                  Joined: {new Date(investor.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto flex-1 px-4 text-center md:text-left">
              <div>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter mb-1">Current Balance</p>
                {/* Highlighted Balance in Gray-900 (Dark) */}
                <p className="text-lg font-black text-gray-900 italic">Rs. {investor.balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter mb-1">Total Deposited</p>
                <p className="text-lg font-black text-gray-400">Rs. {investor.deposits.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}</p>
              </div>
              <div className="hidden md:block">
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter mb-1">Status</p>
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase italic border border-emerald-100">
                  Active User
                </span>
              </div>
            </div>

            {/* Action Button: Gray to Dark/Rose hover */}
            <button className="w-full md:w-auto bg-[#F9FAFB] border border-gray-100 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#111] hover:text-white transition-all text-gray-600 shadow-sm">
              Edit Balance
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}