"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePlanSync } from "@/hooks/usePlanSync";

function PlanCard({ title, percent, days, min, max, featured = false }: any) {
  return (
    <div className={`w-full p-6 md:p-8 rounded-[2rem] border ${featured ? 'border-purple-600 bg-white shadow-2xl shadow-purple-600/10' : 'border-slate-200 bg-white'} relative transition-all hover:scale-[1.02]`}>
      {featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">Popular</span>}
      <h4 className="text-lg md:text-xl font-bold mb-1 text-slate-900">{title} Plan</h4>
      <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{percent} <span className="text-xs md:text-sm font-medium text-slate-400 italic">Daily</span></div>
      <p className="text-xs text-slate-400 mb-6 underline decoration-purple-500/50">Period: {days}</p>
      
      <div className="space-y-3 mb-8">
        <div className="flex justify-between text-xs md:text-sm text-slate-500">
          <span>Min:</span> <span className="font-bold text-slate-900">Rs. {min}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm text-slate-500">
          <span>Max:</span> <span className="font-bold text-slate-900">Rs. {max}</span>
        </div>
      </div>
      
      <Link href="/register" className={`block w-full text-center py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition ${featured ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-900 text-white hover:bg-black'}`}>
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
    <section id="plans" className="px-4 py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic text-slate-900">
            Investment <span className="text-purple-600">Tiers</span>
          </h3>
          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing...</span>
            </div>
          )}
          {!loading && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Live</span>
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
