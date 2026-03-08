"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  userId: string;
  role: string;
  isFrozen: boolean;
  isCurrentUser?: boolean;
}

export default function AdminUserActions({ userId, role, isFrozen, isCurrentUser }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const runAction = async (action: string) => {
    if (loading) return;

    setLoading(true);
    const promise = fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action }),
    });

    toast.promise(promise, {
      loading: "Updating user...",
      success: async (res: Response) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Update failed");
        }
        router.refresh();
        return "Update successful";
      },
      error: (err: any) => err?.message || "Update failed",
    });

    try {
      await promise;
    } catch (err) {
      // already handled in toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {role !== "ADMIN" && (
        <button
          disabled={loading}
          onClick={() => runAction("makeAdmin")}
          className="px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-[#E11D48] text-white hover:bg-black transition-all disabled:opacity-50"
        >
          Make Admin
        </button>
      )}
      {role === "ADMIN" && !isCurrentUser && (
        <button
          disabled={loading}
          onClick={() => runAction("revokeAdmin")}
          className="px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-all disabled:opacity-50"
        >
          Revoke Admin
        </button>
      )}

      {isFrozen ? (
        <button
          disabled={loading}
          onClick={() => runAction("unfreeze")}
          className="px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all disabled:opacity-50"
        >
          Unfreeze
        </button>
      ) : (
        <button
          disabled={loading || isCurrentUser}
          onClick={() => runAction("freeze")}
          className="px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-amber-500 text-white hover:bg-amber-400 transition-all disabled:opacity-50"
          title={isCurrentUser ? "You cannot freeze your own account" : undefined}
        >
          Freeze
        </button>
      )}
    </div>
  );
}
