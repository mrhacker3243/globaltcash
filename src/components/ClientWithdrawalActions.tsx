"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ClientWithdrawalActions({ withdrawalId, status }: { withdrawalId: string, status: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    if (status !== 'PENDING') return;
    if (!confirm("Confirm this withdrawal? This will mark the withdrawal as paid.")) return;
    
    setLoading(true);
    const promise = fetch("/api/admin/withdrawals/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ withdrawalId }),
    });

    toast.promise(promise, {
      loading: 'Updating status...',
      success: async (res: Response) => {
        if (!res.ok) {
           const err = await res.json();
           throw new Error(err.error || "Update failed");
        }
        router.refresh();
        return 'Withdrawal marked as paid';
      },
      error: (err: any) => err.message || 'Status update failed',
    });

    try {
      await promise;
    } catch (error) {
       console.error("❌ Withdrawal approval error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status !== 'PENDING') {
    return (
      <button 
        disabled 
        className="bg-zinc-800 text-zinc-500 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed"
      >
        Already Processed
      </button>
    );
  }

  return (
    <button 
      onClick={handleApprove} 
      disabled={loading}
      className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
    >
      {loading ? "Processing..." : "Mark as Paid"}
    </button>
  );
}
