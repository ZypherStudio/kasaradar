"use client";

import React from "react";
import { Search, Flame, ArrowUpRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectPreset: (preset: string) => void;
  onGoToFps: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectPreset,
  onGoToFps
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-900/60 to-neutral-950 border border-neutral-800 p-6 sm:p-10 mb-8 shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Tüm Türk Mağazaları Canlı Taranıyor • Bugün 4 Fiyat İndirimi Yakalandı</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Kazıklanmadan En İyi{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Hazır PC&apos;yi
          </span>{" "}
          Bul!
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
          İtopya, GamingGen, GameGaraj, Tebilon ve İncehesap&apos;taki tüm hazır kasaları
          karşılaştırıyoruz. Parçaları tek tek toplasan kaç TL, hazır alsan kaç TL kâr edersin anında gör.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative pt-2">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ekran kartı, işlemci veya kasa adı ara (örn: RTX 4060, Ryzen 7500F, ModArt)..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-700/80 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-24 text-xs text-neutral-400 hover:text-white"
              >
                Temizle
              </button>
            )}
            <button
              onClick={onGoToFps}
              className="absolute right-2 top-2 bottom-2 px-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 border border-neutral-700 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">FPS Testi</span>
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 text-neutral-500 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Popüler:
            </span>
            <button
              onClick={() => onSelectPreset("RTX 4060")}
              className="px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-all cursor-pointer"
            >
              RTX 4060 Sistemler
            </button>
            <button
              onClick={() => onSelectPreset("DDR5")}
              className="px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-all cursor-pointer"
            >
              DDR5 AM5 Kasalar
            </button>
            <button
              onClick={() => onSelectPreset("4070")}
              className="px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-all cursor-pointer"
            >
              RTX 4070 Super
            </button>
            <button
              onClick={() => onSelectPreset("20.000")}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
            >
              20.000 TL Bandı
            </button>
          </div>
        </div>

        {/* Live metric stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-neutral-800/80 mt-6">
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/60 text-left">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>Taranan Mağazalar</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white">8 Büyük Satıcı</div>
            <div className="text-[11px] text-neutral-500">İtopya, GamingGen, Vatan, GameGaraj...</div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/60 text-left">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>Ortalama Kâr</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400">4.850 ₺ Kâr</div>
            <div className="text-[11px] text-neutral-500">Tek tek toplamaya kıyasla</div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/60 text-left">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>En Yüksek F/P Skoru</span>
              <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-cyan-400">9.7 / 10</div>
            <div className="text-[11px] text-neutral-500">RX 6600 &amp; RTX 4060 modelleri</div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/60 text-left">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>Sıfır vs 2. El Radarı</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-400">Canlı Borsa</div>
            <div className="text-[11px] text-neutral-500">Sarı site &amp; Letgo analizi</div>
          </div>
        </div>
      </div>
    </div>
  );
};
