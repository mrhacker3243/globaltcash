"use client";
import { Layers, Edit3, Plus, Power, Trash2, X, Loader2, CheckCircle2, Save, Zap, Trophy, Crown, Database } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { usePlanSync } from "@/hooks/usePlanSync";

const icons = ["Zap", "Trophy", "Crown"];

export default function AdminPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>("Initializing...");

  const [formData, setFormData] = useState({
    name: "",
    minAmount: "",
    maxAmount: "",
    roi: "",
    duration: "1 Month",
    icon: "Zap",
    popular: false,
    active: true,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanChange = useCallback((event: any) => {
    if (event.type === 'CONNECTED') {
      setSyncStatus("Live");
      return;
    }
    if (event.type === 'UPDATE' || event.type === 'CREATE' || event.type === 'DELETE') {
      setSyncStatus("Syncing...");
      fetchPlans();
      toast.info(`Plan ${event.type.toLowerCase()} by ${event.adminEmail}`);
      setTimeout(() => setSyncStatus("Live"), 1500);
    }
  }, []);

  usePlanSync(handlePlanChange, true);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      if (Array.isArray(data)) setPlans(data);
    } catch (err) {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "", minAmount: "", maxAmount: "", roi: "",
      duration: "1 Month", icon: "Zap", popular: false, active: true,
    });
    setEditingPlan(null);
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      minAmount: plan.minAmount.toString(),
      maxAmount: plan.maxAmount.toString(),
      roi: plan.roi.toString(),
      duration: plan.duration,
      icon: plan.icon || "Zap",
      popular: plan.popular,
      active: plan.active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const promise = fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
    toast.promise(promise, {
      loading: 'Deleting plan...',
      success: () => { fetchPlans(); return 'Plan deleted'; },
      error: 'Delete failed',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const isEditing = !!editingPlan;
    const url = isEditing ? `/api/admin/plans/${editingPlan.id}` : "/api/admin/plans";
    try {
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        toast.success(isEditing ? 'Plan updated' : 'Plan created');
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(false);
          resetForm();
          fetchPlans();
        }, 800);
      }
    } catch (err) {
      toast.error("Network failure");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#E11D48]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto text-gray-900 bg-[#F9FAFB] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-gray-900 flex items-center gap-3">
             <Layers className="text-[#E11D48]" size={32} />
             Investment <span className="text-[#E11D48]">Plans</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 ml-1 italic">
            Configure ROI • Sync Status: <span className={`italic ${syncStatus === 'Live' ? 'text-emerald-500' : 'text-amber-500'}`}>{syncStatus}</span>
          </p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-[#E11D48] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-[11px] uppercase tracking-widest hover:shadow-lg hover:shadow-rose-200 transition-all active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-20 text-center shadow-sm">
           <Database className="mx-auto text-gray-100 mb-6" size={60} />
           <p className="text-gray-300 font-black uppercase tracking-widest italic text-sm">No plans in database</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-white border ${plan.active ? 'border-gray-100' : 'border-rose-100 grayscale'} p-8 rounded-[2.5rem] relative group overflow-hidden transition-all hover:border-[#E11D48]/30 shadow-sm`}>
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform group-hover:opacity-[0.08]">
                {plan.icon === "Zap" && <Zap size={100} />}
                {plan.icon === "Trophy" && <Trophy size={100} />}
                {plan.icon === "Crown" && <Crown size={100} />}
              </div>
              
              {!plan.active && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#E11D48] text-[8px] font-black px-3 py-1 rounded-full uppercase italic z-10 shadow-lg shadow-rose-900/50">
                  Suspended
                </div>
              )}

               <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${plan.active ? 'bg-gray-50 border border-gray-100' : 'bg-rose-50 border border-rose-100'} flex items-center justify-center`}>
                     {plan.icon === "Zap" && <Zap size={24} className="text-[#E11D48]" />}
                     {plan.icon === "Trophy" && <Trophy size={24} className="text-amber-500" />}
                     {plan.icon === "Crown" && <Crown size={24} className="text-[#E11D48]" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-900">
                      {plan.name}
                      {plan.popular && <span className="text-[#E11D48] ml-2 animate-pulse text-xs">★</span>}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{plan.duration}</p>
                  </div>
                </div>
                <div className="flex gap-2 relative z-20">
                  <button onClick={() => handleEdit(plan)} className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-white hover:bg-[#111] transition-all shadow-sm">
                    <Edit3 size={16}/>
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="p-3 bg-white border border-gray-100 rounded-xl text-rose-400 hover:text-white hover:bg-[#E11D48] transition-all shadow-sm">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>

               <div className="grid grid-cols-3 gap-4 border-t border-gray-50 pt-6 mt-4">
                <div>
                  <p className="text-[9px] text-gray-400 font-black uppercase mb-1 tracking-widest">Daily ROI</p>
                  <p className="text-lg font-black text-[#E11D48] italic">{plan.roi}%</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-black uppercase mb-1 tracking-widest">Min</p>
                  <p className="text-lg font-black text-gray-900 italic">Rs.{plan.minAmount}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-black uppercase mb-1 tracking-widest">Max</p>
                  <p className="text-lg font-black text-gray-900 italic">Rs.{plan.maxAmount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Dark Theme matching Landing Page dark sections */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-gray-800 w-full max-w-lg rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E11D48]/10 rounded-full blur-[80px]" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                {editingPlan ? "Modify" : "Create"} <span className="text-[#E11D48]">Plan</span>
              </h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-gray-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-1 mb-2 block">Plan Name</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 px-6 text-white focus:border-[#E11D48] transition-all font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-1 mb-2 block">Min Amount</label>
                  <input required type="number" value={formData.minAmount} onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 px-6 text-white focus:border-[#E11D48] transition-all font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-1 mb-2 block">Max Amount</label>
                  <input required type="number" value={formData.maxAmount} onChange={(e) => setFormData({...formData, maxAmount: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 px-6 text-white focus:border-[#E11D48] transition-all font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-1 mb-2 block">Daily ROI (%)</label>
                  <input required type="number" step="0.1" value={formData.roi} onChange={(e) => setFormData({...formData, roi: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 px-6 text-[#E11D48] focus:border-[#E11D48] transition-all font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-1 mb-2 block">Duration</label>
                  <select value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-2xl py-4 px-6 text-white focus:border-[#E11D48] appearance-none">
                    <option value="24 Hours">24 Hours</option>
                    <option value="1 Month">1 Month</option>
                    <option value="6 Months">6 Months</option>
                    <option value="12 Months">12 Months</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-1 mb-2 block">Icon & Settings</label>
                  <div className="flex gap-2">
                    {icons.map(icon => (
                      <button key={icon} type="button" onClick={() => setFormData({...formData, icon})}
                        className={`flex-1 p-3 rounded-xl border transition-all ${formData.icon === icon ? 'bg-[#E11D48] border-[#E11D48] text-white' : 'bg-black border-gray-800 text-gray-500'}`}>
                        {icon === "Zap" && <Zap size={18} />}
                        {icon === "Trophy" && <Trophy size={18} />}
                        {icon === "Crown" && <Crown size={18} />}
                      </button>
                    ))}
                    <button type="button" onClick={() => setFormData({...formData, popular: !formData.popular})}
                      className={`flex-1 px-2 rounded-xl border text-[9px] font-black uppercase italic ${formData.popular ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-black border-gray-800 text-gray-600'}`}>
                      ★ Pop
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={submitting}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 ${success ? 'bg-emerald-600' : 'bg-[#E11D48] hover:shadow-lg hover:shadow-rose-900/40'} text-white mt-4`}>
                {submitting ? <Loader2 className="animate-spin" size={18} /> : success ? <CheckCircle2 size={18} /> : <Save size={18} />}
                {submitting ? "Processing..." : success ? "Saved" : "Commit Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}