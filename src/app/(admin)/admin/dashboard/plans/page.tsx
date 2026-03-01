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

  // Form State
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

  // Handle real-time plan updates from other admins
  const handlePlanChange = useCallback((event: any) => {
    if (event.type === 'CONNECTED') {
      setSyncStatus("Live");
      console.log("✅ Connected to real-time plan updates");
      return;
    }

    if (event.type === 'UPDATE' || event.type === 'CREATE' || event.type === 'DELETE') {
      console.log("🔄 Plan change detected from admin:", event.adminEmail);
      setSyncStatus("Syncing...");
      fetchPlans();
      toast.info(`Plan ${event.type.toLowerCase()} by ${event.adminEmail}`);
      setTimeout(() => setSyncStatus("Live"), 1500);
    }
  }, []);

  // Use plan sync hook
  usePlanSync(handlePlanChange, true);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPlans(data);
      } else {
        console.error("Fetch plans failed:", data);
      }
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      minAmount: "",
      maxAmount: "",
      roi: "",
      duration: "1 Month",
      icon: "Zap",
      popular: false,
      active: true,
    });
    setEditingPlan(null);
  };

  const handleEdit = (plan: any) => {
    console.log("✏️ Editing plan:", plan);
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      minAmount: plan.minAmount.toString(),
      maxAmount: plan.maxAmount.toString(),
      roi: plan.roi.toString(),
      duration: plan.duration, // Ensure the duration is set from the plan
      icon: plan.icon || "Zap",
      popular: plan.popular,
      active: plan.active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan? This will NOT affect existing deposits but will disappear from future options.")) return;
    
    const promise = fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
    
    toast.promise(promise, {
      loading: 'Deleting plan...',
      success: (res) => {
        if (!res.ok) throw new Error("Deletion failed");
        fetchPlans();
        return 'Plan deleted successfully';
      },
      error: 'Delete failed. Check logs.',
    });

    try {
      const res = await promise;
      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Delete failed:", errorData);
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    const isEditing = !!editingPlan;
    const url = isEditing ? `/api/admin/plans/${editingPlan.id}` : "/api/admin/plans";
    const method = isEditing ? "PUT" : "POST";

    console.log(`🚀 Sending ${method} to ${url}`, formData);

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        toast.success(isEditing ? 'Plan updated' : 'New plan created');
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(false);
          resetForm();
          fetchPlans();
        }, 800);
      } else {
        console.error("❌ Action failed:", data);
        toast.error(data.error || "Failed to commit changes");
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      toast.error("Network communication failure");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 pt-24 lg:pt-10 max-w-[1600px] mx-auto text-slate-900">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 flex items-center gap-3">
             <Layers className="text-purple-600" size={32} />
             Investment <span className="text-purple-600">Plans</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 ml-1">
            Configure ROI rates and participation limits • Sync Status: <span className={`italic ${syncStatus === 'Live' ? 'text-emerald-600' : 'text-yellow-600'}`}>{syncStatus}</span>
          </p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-purple-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-[11px] uppercase tracking-widest hover:shadow-lg hover:shadow-purple-600/20 transition-all active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-20 text-center">
           <Database className="mx-auto text-slate-200 mb-6" size={60} />
           <p className="text-slate-400 font-black uppercase tracking-widest italic text-sm">No plans found in database</p>
           <button onClick={fetchPlans} className="mt-6 text-purple-600 text-[10px] font-bold uppercase tracking-widest underline underline-offset-4">Force Refresh</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-white border ${plan.active ? 'border-slate-200' : 'border-red-100 grayscale'} p-8 rounded-[2.5rem] relative group overflow-hidden transition-all hover:border-purple-500/30 hover:shadow-md`}>
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform group-hover:opacity-[0.08]">
                {plan.icon === "Zap" && <Zap size={100} />}
                {plan.icon === "Trophy" && <Trophy size={100} />}
                {plan.icon === "Crown" && <Crown size={100} />}
              </div>
              
              {!plan.active && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-[8px] font-black px-3 py-1 rounded-full uppercase italic z-10 shadow-lg shadow-red-900/50">
                  Suspended
                </div>
              )}

               <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${plan.active ? 'bg-slate-50 border border-slate-100' : 'bg-red-50 border border-red-100'} flex items-center justify-center`}>
                     {plan.icon === "Zap" && <Zap size={24} className="text-purple-600" />}
                     {plan.icon === "Trophy" && <Trophy size={24} className="text-yellow-600" />}
                     {plan.icon === "Crown" && <Crown size={24} className="text-indigo-600" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">
                      {plan.name}
                      {plan.popular && <span className="text-purple-600 ml-2 animate-pulse text-xs">★</span>}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{plan.duration}</p>
                  </div>
                </div>
                <div className="flex gap-2 relative z-20">
                  <button 
                    onClick={() => handleEdit(plan)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all active:scale-90 shadow-sm"
                  >
                    <Edit3 size={16}/>
                  </button>
                  <button 
                    onClick={() => handleDelete(plan.id)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-red-400 hover:text-white hover:bg-red-600 hover:border-red-500 transition-all active:scale-90 shadow-sm"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>

               <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6 mt-4">
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-widest">Daily ROI</p>
                  <p className="text-lg font-black text-purple-600">{plan.roi}%</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-widest">Min Entry</p>
                  <p className="text-lg font-black text-slate-900">Rs. {plan.minAmount}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-widest">Max Entry</p>
                  <p className="text-lg font-black text-slate-900">Rs. {plan.maxAmount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                {editingPlan ? "Modify" : "Create"} <span className="text-blue-600">Plan</span>
              </h2>
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-zinc-900 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 mb-2 block">Plan Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. ULTRA PULSE"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-600 transition-all font-bold placeholder:text-zinc-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 mb-2 block">Min Amount (Rs.)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.minAmount}
                    onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-600 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 mb-2 block">Max Amount (Rs.)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.maxAmount}
                    onChange={(e) => setFormData({...formData, maxAmount: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-600 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 mb-2 block">Daily ROI (%)</label>
                  <input 
                    required
                    type="number" 
                    step="0.1"
                    value={formData.roi}
                    onChange={(e) => setFormData({...formData, roi: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-blue-500 focus:outline-none focus:border-blue-600 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 mb-2 block">Duration</label>
                  <select 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-600 transition-all font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:1.2em_1.2em] bg-[right_1.2rem_center] bg-no-repeat"
                  >
                    <option value="24 Hours">24 Hours</option>
                    <option value="48 Hours">48 Hours</option>
                    <option value="72 Hours">72 Hours</option>
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="4 Months">4 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="12 Months">12 Months</option>
                    <option value="15 Months">15 Months</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 mb-2 block">Plan Icon</label>
                  <div className="flex gap-2">
                     {icons.map(icon => (
                       <button 
                        key={icon}
                        type="button"
                        onClick={() => setFormData({...formData, icon})}
                        className={`flex-1 p-3 rounded-xl border transition-all flex items-center justify-center ${formData.icon === icon ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                       >
                         {icon === "Zap" && <Zap size={18} />}
                         {icon === "Trophy" && <Trophy size={18} />}
                         {icon === "Crown" && <Crown size={18} />}
                       </button>
                     ))}
                  </div>
                </div>
                <div className="flex items-end gap-2">
                   <button 
                    type="button"
                    onClick={() => setFormData({...formData, popular: !formData.popular})}
                    className={`flex-1 py-4 px-2 rounded-xl border text-[9px] font-black uppercase italic transition-all ${formData.popular ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
                   >
                     Recommended
                   </button>
                   <button 
                    type="button"
                    onClick={() => setFormData({...formData, active: !formData.active})}
                    className={`flex-1 py-4 px-2 rounded-xl border text-[9px] font-black uppercase italic transition-all ${formData.active ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400' : 'bg-red-600/20 border-red-500/50 text-red-400'}`}
                   >
                     {formData.active ? 'Status: Active' : 'Status: Offline'}
                   </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 ${success ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20'} disabled:opacity-50 text-white mt-4 active:scale-95`}
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : success ? <CheckCircle2 size={18} /> : <Save size={18} />}
                {submitting ? "Processing..." : success ? "Changes Saved" : editingPlan ? "Save Plan Changes" : "Create New Plan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}