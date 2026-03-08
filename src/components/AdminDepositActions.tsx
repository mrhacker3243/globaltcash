"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  depositId: string;
  status: string;
}

export default function AdminDepositActions({ depositId, status }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (type: "approve" | "reject") => {
    if (status !== "PENDING") return;
    const confirmMessage =
      type === "approve"
        ? "Approve this deposit and credit the user?"
        : "Reject this deposit?";

    if (!confirm(confirmMessage)) return;

    setLoading(true);

    const endpoint = type === "approve" ? "/api/admin/deposit/approve" : "/api/admin/deposit/reject";

    const promise = fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ depositId }),
    });

    toast.promise(promise, {
      loading: "Updating status...",
      success: async (res: Response) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Update failed");
        }
        router.refresh();
        return type === "approve" ? "Deposit approved" : "Deposit rejected";
      },
      error: (err: any) => err.message || "Status update failed",
    });

    try {
      await promise;
    } catch (err) {
      // already handled by toast
    } finally {
      setLoading(false);
    }
  };

  if (status !== "PENDING") {
    return (
      <button
        disabled
        className="bg-zinc-800 text-zinc-500 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed"
      >
        Processed
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("reject")}
        disabled={loading}
        className="bg-white text-black px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Reject"}
      </button>
      <button
        onClick={() => handleAction("approve")}
        disabled={loading}
        className="bg-white text-black px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Approve"}
      </button>
    </div>
  );
}
