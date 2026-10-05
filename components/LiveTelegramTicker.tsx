"use client";

import React, { useState, useEffect } from "react";
import { Send, Sparkles, ExternalLink, Flame, ShieldAlert, ArrowRight } from "lucide-react";

interface LiveDealItem {
  title: string;
  seller: string;
  price: string;
  savings: string;
  timeAgo: string;
}

const RECENT_DEALS: LiveDealItem[] = [
  {
    title: "Dark Diamond Pro / RX 7800 XT 16GB",
    seller: "Teknobiyotik",
    price: "39.999 TL",
    savings: "+7.201 TL Cepte",
    timeAgo: "Az önce"
  },
  {
    title: "Pckolik Ghost / i5 13400F & RTX 4070 Super",
    seller: "Pckolik",
    price: "44.499 TL",
    savings: "+7.500 TL Cepte",
    timeAgo: "15 dk önce"
  },
  {
    title: "Blade-7500F / RTX 4060 Ti DDR5 Canavarı",
    seller: "Gaming.Gen.TR",
    price: "31.499 TL",
    savings: "+6.401 TL Cepte",
    timeAgo: "35 dk önce"
  },
  {
    title: "Tebilon Zenith / i5 12400F & RTX 4060",
    seller: "Tebilon",
    price: "20.499 TL",
    savings: "+4.601 TL Cepte",
    timeAgo: "1 saat önce"
  }
];

export const LiveTelegramTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % RECENT_DEALS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const deal = RECENT_DEALS[currentIndex];

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-sky-950/60 via-neutral-900/90 to-emerald-950/60 border border-sky-500/30 p-3 sm:p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md">
      <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
        {/* Pulsing Dot */}
        <div className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
        </div>

        {/* Live Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[11px] font-bold shrink-0">
          <Send className="w-3 h-3 text-sky-400" />
          <span>CANLI TELEGRAM RADARI</span>
        </div>

        {/* Rotating Deal Info */}
        <div className="truncate text-xs sm:text-sm text-neutral-300 font-medium">
          <span className="text-white font-bold">{deal.title}</span>{" "}
          <span className="text-neutral-500">({deal.seller})</span>{" "}
          <span className="text-emerald-400 font-bold ml-1">{deal.price}</span>{" "}
          <span className="hidden md:inline-block px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 text-[11px] font-semibold ml-1">
            {deal.savings}
          </span>
          <span className="text-neutral-500 text-[11px] ml-2 font-mono">[{deal.timeAgo}]</span>
        </div>
      </div>

      {/* Direct Telegram Join Button */}
      <a
        href="https://t.me/+Voua-sJ4TVJiZjc8"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-neutral-950 text-xs font-black shadow-md shadow-sky-500/20 transition-all cursor-pointer"
      >
        <span>Fırsatları Kaçırma</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
