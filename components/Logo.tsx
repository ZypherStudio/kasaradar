import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Handcrafted Geometric Gaming Emblem: Radar Grid + Chassis Perspective */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-lg shadow-emerald-500/10 group-hover:border-emerald-500/50 transition-all duration-300 overflow-hidden`}>
        {/* Ambient subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-cyan-500/20" />
        
        {/* SVG Mark */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-white relative z-10"
        >
          {/* Outer Chassis Cube Frame */}
          <path
            d="M16 3L27 9.5V22.5L16 29L5 22.5V9.5L16 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="text-neutral-500"
          />
          {/* Inner Isometric Grid */}
          <path
            d="M16 3V29M5 9.5L27 22.5M5 22.5L27 9.5"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            className="text-neutral-700"
          />
          {/* Radar Sweep Reticle & Pulse Center */}
          <circle cx="16" cy="16" r="6" stroke="#10b981" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="2.5" fill="#10b981" className="animate-pulse" />
          {/* Neon Radar Target Indicator */}
          <path
            d="M16 10V6M16 26V22M10 16H6M26 16H22"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Live scanning pulse dot */}
        <span className="absolute top-1 right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`${textSizes[size]} font-black tracking-tight text-white leading-none`}>
            KASA<span className="text-emerald-400">RADAR</span>
          </span>
        </div>
        <span className="text-[10px] text-neutral-400 font-medium tracking-tight mt-0.5">
          Hazır Sistem &amp; Donanım Borsası
        </span>
      </div>
    </div>
  );
};
