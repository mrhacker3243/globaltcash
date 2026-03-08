"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ClientDepositActions({ depositId }: { depositId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    if (!confirm("Kya aap waqai ye deposit approve karna chahte hain? Is se user ke account mein paise add ho jayeinge.")) return;
    
    setLoading(true);
    const promise = fetch("/api/admin/deposit/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ depositId }),
    });

    toast.promise(promise, {
      loading: 'Paisa add ho raha hai...',
      success: async (res: Response) => {
        if (!res.ok) {
           const err = await res.json();
           throw new Error(err.error || "Kuch ghalti hui hai");
        }
        router.refresh();
        return 'Deposit kamyabi se approve ho gaya';
      },
      error: (err: any) => err.message || 'Approve nahi ho saka. Dubara check karein.',
    });

    try {
      await promise;
    } catch (error) {
       console.error("❌ Approval error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("Kya aap waqai ye deposit reject karna chahte hain?")) return;

    setLoading(true);
    const promise = fetch("/api/admin/deposit/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ depositId }),
    });

    toast.promise(promise, {
      loading: 'Reject kar rahe hain...',
      success: async (res: Response) => {
        if (!res.ok) {
           const err = await res.json();
           throw new Error(err.error || "Kuch ghalti hui hai");
        }
        router.refresh();
        return 'Deposit reject ho gaya';
      },
      error: (err: any) => err.message || 'Reject nahi ho saka. Dubara check karein.',
    });

    try {
      await promise;
    } catch (error) {
      console.error("❌ Reject error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-3">
      {/* Approve Button - Green Rose Style */}
      <button 
        onClick={handleApprove} 
        disabled={loading}
        className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all active:scale-90 disabled:opacity-50 shadow-sm"
        title="Approve Karein"
      >
        <Check size={20} strokeWidth={3}/>
      </button>

      {/* Reject Button - Red Rose Style */}
      <button 
        disabled={loading}
        className="bg-rose-50 text-[#E11D48] p-4 rounded-2xl border border-rose-100 hover:bg-[#E11D48] hover:text-white transition-all active:scale-90 disabled:opacity-50 shadow-sm"
        title="Reject Karein"
      >
        <X size={20} strokeWidth={3}/>
      </button>
    </div>
  );
}