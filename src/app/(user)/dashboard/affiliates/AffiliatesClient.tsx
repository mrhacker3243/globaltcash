'use client';

import { useState } from 'react';
import { 
  Share2, Users, Zap, ShieldCheck, Copy, Check, TrendingUp, 
  Activity, ArrowRight, Globe 
} from 'lucide-react';

type Props = {
  initialData: {
    id?: string;
    referralCount?: number;
    rankLevel?: string;
    commissionRate?: number;
  };
};

export default function AffiliatesClient({ initialData }: Props) {
  const [copied, setCopied] = useState(false);

  const referralLink = initialData.id
    ? `${window.location.origin}/register?ref=${initialData.id}`
    : '';

  const copyLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Failed to copy — please copy manually');
    }
  };

  const commission = (initialData.commissionRate ?? 0.05) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-16 lg:pt-20 space-y-10 md:space-y-16 animate-fade-in">
        
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-rose-600 tracking-tight">
            Affiliate <span className="text-rose-600">Network</span>
          </h1>
          <p className="mt-3 text-gray-600 text-lg md:text-xl font-medium max-w-2xl mx-auto md:mx-0">
            Grow your team • Earn <span className="font-bold text-rose-600">{commission.toFixed(2)}%</span> lifetime commissions
          </p>
        </div>

        {/* Main Referral Card – Glassmorphism Premium */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="bg-white/70 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-6 md:p-10 lg:p-12 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left - Link & Stats */}
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-xl transform group-hover:scale-105 transition-transform">
                    <Share2 size={32} className="md:size-40" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your Referral Link</h2>
                    <p className="text-gray-600 mt-1.5 text-base md:text-lg">Share to earn passive income</p>
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-lg border border-white/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <p className="text-sm md:text-base font-mono text-gray-800 flex-1 break-all select-all">
                    {referralLink || 'Loading link...'}
                  </p>
                  <button
                    onClick={copyLink}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-md ${
                      copied 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 hover:shadow-xl hover:scale-[1.02]'
                    }`}
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/30 text-center">
                    <Users className="mx-auto text-rose-600 mb-3" size={28} />
                    <p className="text-sm text-gray-600">Members</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{initialData.referralCount ?? 0}</p>
                  </div>
                  <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/30 text-center">
                    <Zap className="mx-auto text-amber-600 mb-3" size={28} />
                    <p className="text-sm text-gray-600">Commission</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{commission.toFixed(2)}%</p>
                  </div>
                </div>
              </div>

              {/* Right - Rank & Growth */}
              <div className="space-y-8 lg:border-l lg:border-gray-200/40 lg:pl-12">
                <div className="text-center lg:text-left">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Current Rank</p>
                  <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-rose-600">
                    {initialData.rankLevel || 'Starter'}
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
                      style={{ width: `${Math.min(100, (initialData.referralCount ?? 0) * 10)}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 text-center lg:text-left">
                  <a 
                    href={referralLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
                  >
                    <Globe size={22} />
                    Visit Link
                  </a>
                  <button 
                    onClick={copyLink}
                    className="flex-1 flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
                  >
                    <ArrowRight size={22} />
                    Share Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-12">
          Powered by Global Trust Cash • Earn unlimited commissions
        </p>
      </div>
    </div>
  );
}