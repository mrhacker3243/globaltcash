import React from "react";

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Background Glow */}
      <circle cx="50" cy="50" r="40" fill="url(#logo_glow)" fillOpacity="0.2" />
      
      {/* Main Shape: Stylized 'X' and Liquid Flow */}
      <path 
        d="M30 20L50 45L70 20M30 80L50 55L70 80" 
        stroke="url(#logo_gradient)" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Center Power Node */}
      <circle cx="50" cy="50" r="8" fill="#9333ea" className="animate-pulse">
        <animate 
          attributeName="opacity" 
          values="0.4;1;0.4" 
          dur="2s" 
          repeatCount="indefinite" 
        />
      </circle>

      {/* Connection Lines */}
      <path 
        d="M50 20V35M50 65V80M30 50H40M60 50H70" 
        stroke="#94a3b8" 
        strokeWidth="4" 
        strokeLinecap="round" 
        opacity="0.5" 
      />

      <defs>
        <linearGradient id="logo_gradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9333ea" />
          <stop offset="1" stopColor="#7e22ce" />
        </linearGradient>
        <radialGradient id="logo_glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(40)">
          <stop stopColor="#9333ea" />
          <stop offset="1" stopColor="#9333ea" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
