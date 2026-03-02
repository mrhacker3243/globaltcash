"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePlanSync } from "@/hooks/usePlanSync";

function PlanCard({ title, percent, days, min, max, featured = false }: any) {
  return (
    <div className={`w-full p-6 md:p-8 rounded-[2rem] border ${featured ? 'border-[#22c55e] bg-[#0f172a] shadow-2xl shadow-[#22c55e]/10' : 'border-[#22c55e]/20 bg-[#0f172a]'} relative transition-all hover:scale-[1.02]`}>
      {featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#22c55e] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-black">Popular</span>}
      <h4 className="text-lg md:text-xl font-bold mb-1 text-white">{title} Plan</h4>
      <div className="text-3xl md:text-4xl font-black text-[#22c55e] mb-1">{percent} <span className="text-xs md:text-sm font-medium text-slate-400 italic">Daily</span></div>
      <p className="text-xs text-slate-400 mb-6 underline decoration-[#22c55e]/50">Period: {days}</p>
      
      <div className="space-y-3 mb-8">
        <div className="flex justify-between text-xs md:text-sm text-slate-400">
          <span>Min:</span> <span className="font-bold text-white">Rs. {min}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm text-slate-400">
          <span>Max:</span> <span className="font-bold text-white">Rs. {max}</span>
        </div>
      </div>
      
      <Link href="/register" className={`block w-full text-center py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition ${featured ? 'bg-[#22c55e] text-black shadow-lg shadow-[#22c55e]/30 hover:shadow-[#22c55e]/50' : 'bg-[#22c55e] text-black hover:bg-[#16a34a]'}`}>
        Invest Now
      </Link>
    </div>
  );
}

interface Plan {
  id: string;
  name: string;
  roi: number;
  duration: string;
  minAmount: number;
  maxAmount: number;
  popular: boolean;
}

export function InvestmentPlansSection({ initialPlans }: { initialPlans: Plan[] }) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [loading, setLoading] = useState(false);

  // Handle real-time plan updates
  const handlePlanChange = useCallback((event: any) => {
    if (event.type === 'CONNECTED') {
      console.log("✅ Landing page connected to real-time plan updates");
      return;
    }

    if (event.type === 'UPDATE' || event.type === 'CREATE' || event.type === 'DELETE') {
      console.log("🔄 Landing page: Plan update detected", event);
      setLoading(true);
      fetchPlans();
    }
  }, []);

  // Use plan sync hook
  usePlanSync(handlePlanChange, true);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPlans(data);
      }
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="plans" className="px-4 py-24 bg-[#020617] border-y border-[#22c55e]/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic text-white">
            Investment <span className="text-[#22c55e]">Tiers</span>
          </h3>
          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#facc15] rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing...</span>
            </div>
          )}
          {!loading && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#22c55e] rounded-full"></div>
              <span className="text-xs font-bold text-[#22c55e] uppercase tracking-widest">Live</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan: Plan) => (
            <PlanCard 
              key={plan.id}
              title={plan.name} 
              percent={`${plan.roi}%`} 
              days={plan.duration} 
              min={plan.minAmount} 
              max={plan.maxAmount} 
              featured={plan.popular} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
