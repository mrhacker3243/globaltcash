"use client";
import React from "react";
import Logo from "./Logo";

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
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo className={`${currentSize.logo} group-hover:rotate-12 transition-transform`} />
      {!hideText && (
        <div className="flex flex-col leading-none">
          <span className={`${currentSize.title} font-black text-purple-600 tracking-tighter italic uppercase drop-shadow-[0_0_8px_rgba(147,51,234,0.3)]`}>
            Exotic
          </span>
          <div className="flex items-center gap-2">
            <span className={`${currentSize.subtitle} font-bold text-amber-500 uppercase ml-0.5 tracking-[0.4em] drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]`}>
              Cash
            </span>
            {type === "admin" && (
              <span className="text-[7px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm">
                Admin
              </span>
            )}
            {type === "user" && (
              <span className="text-[7px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm">
                User
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
