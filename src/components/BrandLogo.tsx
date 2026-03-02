"use client";
import React from "react";

// Inline Logo SVG component to avoid resolve errors
const LogoIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* Background Glow */}
    <circle cx="50" cy="50" r="40" fill="url(#logo_glow)" fillOpacity="0.2" />
    
    {/* Main Shape: Stylized 'X' (Toxic Green) */}
    <path 
      d="M30 20L50 45L70 20M30 80L50 55L70 80" 
      stroke="url(#logo_gradient)" 
      strokeWidth="12" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    {/* Center Power Node */}
    <circle cx="50" cy="50" r="8" fill="#22c55e">
      <animate 
        attributeName="opacity" 
        values="0.4;1;0.4" 
        dur="2s" 
        repeatCount="indefinite" 
      />
    </circle>

    <defs>
      <linearGradient id="logo_gradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#22c55e" />
        <stop offset="1" stopColor="#16a34a" />
      </linearGradient>
      <radialGradient id="logo_glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(40)">
        <stop stopColor="#22c55e" />
        <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

interface BrandLogoProps {
  type?: "user" | "admin" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  hideText?: boolean;
}

export default function BrandLogo({ type = "default", size = "md", className = "", hideText = false }: BrandLogoProps) {
  const sizeClasses = {
    sm: { logo: "w-8 h-8", title: "text-lg", subtitle: "text-[8px] tracking-[0.4em]" },
    md: { logo: "w-9 h-9", title: "text-xl", subtitle: "text-[9px] tracking-[0.4em]" },
    lg: { logo: "w-11 h-11", title: "text-2xl", subtitle: "text-[11px] tracking-[0.6em]" }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 ${className} group`}>
      {/* Inline Logo with group hover effect */}
      <LogoIcon className={`${currentSize.logo} group-hover:rotate-12 transition-transform duration-300`} />
      
      {!hideText && (
        <div className="flex flex-col leading-none">
          {/* Main Title: Neon Green (Toxic Profit) */}
          <span className={`${currentSize.title} font-black text-[#22c55e] tracking-tighter italic uppercase drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]`}>
            Global
          </span>
          
          <div className="flex items-center gap-2">
            {/* Subtitle: Amber/Gold */}
            <span className={`${currentSize.subtitle} font-bold text-[#facc15] uppercase ml-0.5 tracking-[0.4em] drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]`}>
              Trust Cash
            </span>

            {/* Admin/User Badge: Updated for Toxic Theme */}
            {type === "admin" && (
              <span className="text-[7px] bg-[#22c55e] text-black px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                Admin
              </span>
            )}
            {type === "user" && (
              <span className="text-[7px] bg-[#22c55e] text-black px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                User
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}