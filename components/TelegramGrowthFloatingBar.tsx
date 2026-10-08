"use client";

import React, { useState, useEffect } from "react";
import { Send, X, Flame, ArrowRight, BellRing, Sparkles } from "lucide-react";

export const TelegramGrowthFloatingBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<string>("04:18:22");

  useEffect(() => {
    // Show after 3 seconds on page
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem("kr_telegram_floating_dismissed");
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 2500);

    // Live countdown simulation to next flash drop
    const interval = setInterval(() => {
      const now = new Date();
      // Target next drop at top of next hour or 22:00
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      const diffMs = nextHour.getTime() - now.getTime();
      const mins = Math.floor((diffMs / 1000 / 60) % 60);
      const secs = Math.floor((diffMs / 1000) % 60);
      setCountdown(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("kr_telegram_floating_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-4 right-3 sm:right-6 z-40 max-w-sm w-[calc(100%-1.5rem)] sm:w-auto animate-slide-up">
      <div className="relative rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-sky-500/40 p-4 shadow-2xl backdrop-blur-xl space-y-3">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header with live pulse */}
        <div className="flex items-center gap-2 pr-6">
          <div className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </div>
          <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300 uppercase tracking-wider">
            Canlı Gece Radarı
          </span>
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
            Düşüşe: {countdown}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <p className="text-xs text-white font-bold leading-snug">
            🌙 Gece Fırsatlarını İlk Sen Yakala!
          </p>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Botumuz 16+ mağazada fiyatı düşen kelepir kasaları anında Telegram kanalına atıyor.
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-[10px] text-neutral-500 font-semibold">
            👥 2.450+ Donanımcı
          </span>

          <a
            href="https://t.me/+Voua-sJ4TVJiZjc8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-neutral-950 font-black text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Kanala Katıl</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
