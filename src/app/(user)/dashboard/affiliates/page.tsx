import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, ShieldCheck, Share2, Calendar, CheckCircle2 } from "lucide-react";
import CopyButton from "@/components/CopyButton";

export default async function AffiliatesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      referredUsers: true,
      referrer: true,
    },
  });

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">
          <Users className="mx-auto mb-4 text-gray-300" size={48} />
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">User Not Found</h2>
        </div>
      </div>
    );
  }

  const rank = await db.referralRank.findUnique({
    where: { name: user.rankLevel || "Starter" },
  });

  const commissionRate = rank?.commissionPercent ?? 0.05;
  const baseUrl = process.env.NEXTAUTH_URL || "https://globaltcash.up.railway.app";
  const referralLink = `${baseUrl}/register?ref=${user.id}`;

  return (
    <div className="bg-gray-50 pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 lg:pb-16">
      <div className="mx-auto w-full max-w-4xl space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900">
            Referral <span className="text-rose-600">Network</span>
          </h1>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-emerald-700">
            <ShieldCheck size={14} />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
              Verified Partner
            </span>
          </div>
        </div>

        {/* Stats & Link Card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow sm:rounded-2xl">
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="space-y-6">
              <div>
                <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-rose-600">
                  Your Earnings
                </p>
                <p className="mt-1.5 text-2xl sm:text-3xl font-bold text-gray-900">
                  Network: <span className="text-rose-600">{user.referredUsers?.length || 0}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-xs sm:text-sm">
                  <div>
                    Rank:{" "}
                    <span className="font-bold text-gray-900">{user.rankLevel || "Starter"}</span>
                  </div>
                  <div>
                    Bonus:{" "}
                    <span className="font-bold text-rose-600">
                      {(commissionRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Referral link block */}
              <div className="rounded-xl bg-gray-900 p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Share2 size={16} className="text-rose-500" />
                  <span className="text-sm font-bold uppercase tracking-wider text-white sm:text-base">
                    Your Private Link
                  </span>
                </div>

                <div className="mb-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                  <p className="break-all font-mono text-sm text-gray-300 sm:text-base leading-relaxed select-all">
                    {referralLink}
                  </p>
                </div>

                {/* ────────────────────────────────────────────────
                    Using your EXISTING CopyButton (no children)
                    Adjust buttonText / label prop if your component supports it
                    ──────────────────────────────────────────────── */}
                <CopyButton
                  text={referralLink}
                  className="
                    w-full flex items-center justify-center gap-2
                    rounded-lg bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white
                    shadow-md shadow-rose-600/20 transition
                    hover:bg-rose-500 active:bg-rose-700 active:scale-[0.98]
                    sm:py-4 sm:text-base
                  "
                />
              </div>
            </div>
          </div>
        </div>

        {/* Members list */}
        <div className="space-y-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-500 sm:text-base">
            <Users size={16} />
            Network Members
          </h3>

          {user.referredUsers?.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-10 text-center sm:py-12">
              <p className="text-sm font-black uppercase tracking-widest text-gray-400 sm:text-base">
                No members yet — share your link!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5">
              {user.referredUsers.map((ref: any) => (
                <div
                  key={ref.id}
                  className="
                    rounded-xl border border-gray-200 bg-white p-4 shadow-sm
                    transition hover:border-rose-200 hover:shadow
                    active:scale-[0.99] sm:p-5 sm:rounded-2xl
                  "
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400 sm:h-11 sm:w-11">
                      <Users size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold uppercase tracking-tight text-gray-900 sm:text-lg">
                        {ref.email?.split("@")[0] || "User"}
                      </p>
                      <p className="truncate text-xs text-gray-500 italic sm:text-sm">
                        {ref.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar size={14} />
                      {new Date(ref.createdAt).toLocaleDateString("en-GB")}
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1 text-emerald-700">
                      <CheckCircle2 size={14} />
                      <span className="font-medium">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}