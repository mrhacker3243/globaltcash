"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label = "Copy Link", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className={`bg-purple-600 hover:bg-purple-500 text-white px-3 sm:px-6 py-3 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 ${className}`}
    >
      {copied ? (
        <>Copied! <Check size={14} /></>
      ) : (
        <span className="flex items-center gap-2 whitespace-nowrap">
          {label} <Copy size={14} />
        </span>
      )}
    </button>
  );
}
