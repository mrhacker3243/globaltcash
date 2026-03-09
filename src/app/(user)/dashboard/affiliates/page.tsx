// src/app/(user)/dashboard/affiliates/page.tsx
// IMPORTANT: NO 'use client' here — this is a Server Component

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Zap, ShieldCheck, Share2 } from "lucide-react";
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
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-md mx-4">
          <Users className="mx-auto text-gray-400 mb-6" size={80} />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">User Not Found</h2>
          <p className="text-gray-600 text-lg">Please log in again or contact support.</p>
        </div>
      </div>
    );
  }

  const rank = await db.referralRank.findUnique({
    where: { name: user.rankLevel || "Starter" },
  });

  const commissionRate = rank?.commissionPercent ?? 0.05;

  const referralLink = `${process.env.NEXTAUTH_URL || 'https://globaltcash.up.railway.app'}/register?ref=${user.id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 pt-20 md:pt-16 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-rose-600">
              Referral <span className="text-rose-600">Network</span>
            </h1>
            <p className="mt-2 text-gray-600 text-sm md:text-base font-medium">
              Build your team • Earn <span className="font-bold text-rose-600">{(commissionRate * 100).toFixed(2)}%</span> instant commission
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/40">
            <Zap className="text-rose-500" size={20} />
            <span className="text-sm font-semibold text-gray-800">Rewards Active</span>
          </div>
        </div>

        {/* Main Referral Card – Glassmorphism */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="bg-white/70 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-6 md:p-10 lg:p-12 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left - Link & Stats */}
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-xl transform group-hover:scale-105 transition-transform">
                    <Share2 size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your Referral Link</h2>
                    <p className="text-gray-600 mt-1.5 text-base md:text-lg">Share to earn passive income</p>
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-lg border border-white/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <p className="text-sm md:text-base font-mono text-gray-800 flex-1 break-all select-all">
                    {referralLink}
                  </p>
                  <CopyButton text={referralLink} className="shrink-0" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/30 text-center">
                    <Users className="mx-auto text-rose-600 mb-3" size={28} />
                    <p className="text-sm text-gray-600">Members</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{user.referredUsers?.length || 0}</p>
                  </div>
                  <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/30 text-center">
                    <Zap className="mx-auto text-amber-600 mb-3" size={28} />
                    <p className="text-sm text-gray-600">Commission</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{(commissionRate * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>

              {/* Right - Rank & Growth */}
              <div className="space-y-8 lg:border-l lg:border-gray-200/40 lg:pl-12">
                <div className="text-center lg:text-left">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Current Rank</p>
                  <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-rose-600">
                    {user.rankLevel || 'Starter'}
                  </h3>
                </div>

                <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/80 rounded-2xl p-8 border border-rose-100/60">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-base font-medium text-gray-800">Network Growth</span>
                    <span className="text-xs font-bold bg-rose-100 text-rose-700 px-4 py-2 rounded-full">Active</span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-4 overflow-hidden border border-white/40">
                    <div 
                      className="bg-gradient-to-r from-rose-500 to-pink-600 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, (user.referredUsers?.length || 0) * 10)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral List */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/80 to-white/50">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="text-rose-600" size={24} />
              Network Registry
            </h3>
          </div>

          {user.referredUsers?.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-600 font-medium">No active members yet</p>
              <p className="text-sm text-gray-500 mt-2">Share your link to start building your network</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50/80">
                  <tr className="text-left text-sm font-semibold text-gray-600">
                    <th className="px-8 py-5">Partner</th>
                    <th className="px-8 py-5 hidden md:table-cell">Joined</th>
                    <th className="px-8 py-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {user.referredUsers.map((ref: any) => (
                    <tr key={ref.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-gray-700 shadow-sm">
                            <Users size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 truncate max-w-[180px]">
                              {ref.email?.split('@')[0] || "User"}
                            </p>
                            <p className="text-xs text-gray-500">{ref.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 hidden md:table-cell text-gray-600 text-sm">
                        {new Date(ref.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}