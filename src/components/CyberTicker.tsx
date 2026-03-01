"use client";
import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function CyberTicker() {
  const [prices, setPrices] = useState([
    { coin: "BTC", price: "42,394.12", change: "+1.2%", up: true },
    { coin: "ETH", price: "2,241.05", change: "-0.4%", up: false },
    { coin: "TON", price: "2.14", change: "+5.8%", up: true },
    { coin: "USDT", price: "1.00", change: "0.0%", up: true },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => {
        const movement = (Math.random() - 0.5) * (parseFloat(p.price.replace(',', '')) * 0.001);
        const newPrice = parseFloat(p.price.replace(',', '')) + movement;
        const isUp = movement >= 0;
        return {
          ...p,
          price: newPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          change: `${isUp ? '+' : ''}${((movement / newPrice) * 100).toFixed(2)}%`,
          up: isUp
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-8 overflow-hidden whitespace-nowrap">
      <div className="flex items-center gap-2 border-r border-slate-200 pr-6 mr-2 shrink-0">
         <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(147,51,234,0.3)]" />
         <span className="text-[9px] font-black text-purple-600 uppercase tracking-[0.2em] italic">Market Rates</span>
      </div>
      <div className="flex items-center gap-8">
        {prices.map((p, i) => (
          <div key={i} className="flex items-center gap-2 transition-all duration-1000">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">{p.coin}</span>
            <span className="text-[10px] font-bold text-slate-900 tracking-widest font-mono">${p.price}</span>
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${p.up ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
              {p.up ? <ArrowUp size={8} className="inline mr-1" /> : <ArrowDown size={8} className="inline mr-1" />}
              {p.change}
            </span>
            {i !== prices.length - 1 && <div className="w-1 h-3 bg-slate-100 mx-2 rotate-12" />}
          </div>
        ))}
      </div>
    </div>
  );
}
