"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ClientDepositActions({ depositId }: { depositId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this deposit? This will add the balance to the user's account.")) return;
    
    setLoading(true);
    const promise = fetch("/api/admin/deposit/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ depositId }),
    });

    toast.promise(promise, {
      loading: 'Approving deposit...',
      success: async (res: Response) => {
        if (!res.ok) {
           const err = await res.json();
           throw new Error(err.error || "Authorization failed");
        }
        router.refresh();
        return 'Deposit approved successfully';
      },
      error: (err: any) => err.message || 'Approval failed. Check logs.',
    });

    try {
      await promise;
    } catch (error) {
       console.error("❌ Approval error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <button 
        onClick={handleApprove} 
        disabled={loading}
        className="bg-emerald-600/10 text-emerald-500 p-3 rounded-xl hover:bg-emerald-600 hover:text-white transition-all active:scale-90 disabled:opacity-50"
      >
        <Check size={18}/>
      </button>
      <button 
        disabled={loading}
        className="bg-red-600/10 text-red-500 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-90 disabled:opacity-50"
      >
        <X size={18}/>
      </button>
    </div>
  );
}
