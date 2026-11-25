"use client";

import React, { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, Cpu, Monitor, Zap, ShieldCheck, Flame, RefreshCw } from "lucide-react";

export const MarketTrendsBar: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState<string>("Az önce");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdated(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-5 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 p-3 sm:p-4 shadow-lg backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>Türkiye Hazır Sistem Piyasası &amp; Borsa Endeksi</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              16+ mağazanın güncel fiyat hareketleri ve yapay zeka pazar analizi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
          <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
            Canlı Takip: 22 Mağaza
          </span>
          <span className="text-neutral-500">•</span>
          <span>Güncelleme: {lastUpdated}</span>
        </div>
      </div>

      {/* Market Indicators Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-3">
        {/* Entry Level */}
        <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-400 font-medium">1080p Giriş Seviye</span>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5 text-[10px]">
              <TrendingDown className="w-3 h-3" /> %-3.4
            </span>
          </div>
          <div className="text-sm font-black text-white">19.499 TL</div>
          <div className="text-[10px] text-neutral-500 truncate">RTX 4060 / RX 7600 Serisi</div>
        </div>

        {/* Mid Level */}
        <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-400 font-medium">2K F/P Canavarı</span>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5 text-[10px]">
              <TrendingDown className="w-3 h-3" /> %-1.8
            </span>
          </div>
          <div className="text-sm font-black text-white">34.999 TL</div>
          <div className="text-[10px] text-neutral-500 truncate">RTX 4070 Super / RX 7800 XT</div>
        </div>

        {/* High-End */}
        <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-400 font-medium">4K Ultra / AM5</span>
            <span className="text-neutral-400 font-bold text-[10px]">Dengede</span>
          </div>
          <div className="text-sm font-black text-white">58.999 TL</div>
          <div className="text-[10px] text-neutral-500 truncate">Ryzen 7800X3D + 4080 Super</div>
        </div>

        {/* Most Popular Hardware */}
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-300 font-bold">Günün Trend Bileşeni</span>
            <Flame className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-sm font-black text-white">RTX 4070 Super</div>
          <div className="text-[10px] text-emerald-400/80 truncate">%42 Pazar Payı İle Lider</div>
        </div>
      </div>
    </div>
  );
};
