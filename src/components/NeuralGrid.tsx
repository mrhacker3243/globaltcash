"use client";

import { useEffect, useState } from "react";

export default function NeuralGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 grid grid-cols-12 grid-rows-8 gap-1.5 opacity-50">
        {Array.from({ length: 96 }).map((_, i) => (
          <div key={i} className="h-full bg-slate-100 rounded-[2px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 grid grid-cols-12 grid-rows-8 gap-1.5 overflow-hidden">
      {Array.from({ length: 96 }).map((_, i) => (
        <div 
          key={i} 
          className={`h-full rounded-[2px] transition-all duration-[2000ms] ${
            Math.random() > 0.95 ? 'bg-purple-600 shadow-sm scale-110' : 
            Math.random() > 0.8 ? 'bg-slate-200' : 'bg-slate-100'
          }`} 
        />
      ))}
    </div>
  );
}
