"use client";

import React from "react";
import { Search, Flame, ArrowUpRight, TrendingUp, ShieldCheck, Zap, X } from "lucide-react";

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectPreset: (preset: string) => void;
  onGoToFps: () => void;
  onOpenAdInspector?: () => void;
  onOpenGameSettings?: () => void;
  onOpenRewardsModal?: () => void;
  onOpenPcRecommender?: () => void;
  onOpenVersusArena?: () => void;
  onOpenPriceHistory?: () => void;
  onOpenFreeGames?: () => void;
  onOpenKazikSayar?: () => void;
  onOpenBottleneck?: () => void;
  onOpenUpgradeAdvisor?: () => void;
  onOpenDdosShield?: () => void;
  onOpenCustomVsPrebuilt?: () => void;
  onOpenRigRater?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectPreset,
  onGoToFps,
  onOpenAdInspector,
  onOpenGameSettings,
  onOpenRewardsModal,
  onOpenPcRecommender,
  onOpenVersusArena,
  onOpenPriceHistory,
  onOpenFreeGames,
  onOpenKazikSayar,
  onOpenBottleneck,
  onOpenUpgradeAdvisor,
  onOpenDdosShield,
  onOpenCustomVsPrebuilt,
  onOpenRigRater
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-900/60 to-neutral-950 border border-neutral-800 p-6 sm:p-10 mb-8 shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
        {/* Live Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Tüm Türk Mağazaları Canlı Taranıyor • Bugün 4 Fiyat İndirimi Yakalandı</span>
          </div>

          {onOpenDdosShield && (
            <button
              onClick={onOpenDdosShield}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="KasaRadar DDoS Kalkanı Güvenlik Paneli"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DDoS Kalkanı: Aktif</span>
            </button>
          )}
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

        {/* KILLER FEATURE QUICK BUTTONS - CLEANLY ORGANIZED & PRIORITIZED */}
        <div className="space-y-2.5 pt-1">
          {/* Top Priority: Ana F/P Araçları */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {onOpenPcRecommender && (
              <button
                onClick={onOpenPcRecommender}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-95"
              >
                <span>🎯 Bana PC Öner</span>
                <span className="text-[10px] bg-neutral-950/20 px-1.5 py-0.2 rounded font-bold">Sihirbaz</span>
              </button>
            )}

            {onOpenCustomVsPrebuilt && (
              <button
                onClick={onOpenCustomVsPrebuilt}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/25 to-teal-500/25 hover:from-emerald-500/35 hover:to-teal-500/35 text-emerald-300 border border-emerald-500/50 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10 active:scale-95"
              >
                <span>⚔️ Parça vs Kasa Savaşı</span>
                <span className="text-[10px] bg-emerald-500/30 px-1.5 py-0.2 rounded font-black text-emerald-200">Kâr Kıyasla</span>
              </button>
            )}

            {onOpenUpgradeAdvisor && (
              <button
                onClick={onOpenUpgradeAdvisor}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/10 active:scale-95"
              >
                <span>🚀 Sistem Yükselt</span>
                <span className="text-[10px] bg-cyan-500/30 px-1.5 py-0.2 rounded font-black text-cyan-200">Upgrade</span>
              </button>
            )}

            {onOpenKazikSayar && (
              <button
                onClick={onOpenKazikSayar}
                className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-rose-500/10 active:scale-95"
              >
                <span>🚨 Kazık Sayar</span>
                <span className="text-[10px] bg-rose-500/30 px-1.5 py-0.2 rounded font-black text-rose-200">Alınır Mı?</span>
              </button>
            )}

            {onOpenRigRater && (
              <button
                onClick={onOpenRigRater}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-amber-500/10 active:scale-95"
              >
                <span>🏆 Sistemini Puanlat</span>
                <span className="text-[10px] bg-amber-500/30 px-1.5 py-0.2 rounded font-black text-amber-200">Oyun Karnesi</span>
              </button>
            )}
          </div>

          {/* Secondary Utilities Row */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
            {onOpenBottleneck && (
              <button
                onClick={onOpenBottleneck}
                className="px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>⚡ Darboğaz Testi</span>
              </button>
            )}

            {onOpenVersusArena && (
              <button
                onClick={onOpenVersusArena}
                className="px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-purple-300 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>🥊 Kasa Kapışması</span>
              </button>
            )}

            {onOpenPriceHistory && (
              <button
                onClick={onOpenPriceHistory}
                className="px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>📈 30 Günlük Fiyat</span>
              </button>
            )}

            {onOpenFreeGames && (
              <button
                onClick={onOpenFreeGames}
                className="px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>🎁 Bedava Oyunlar</span>
              </button>
            )}

            {onOpenAdInspector && (
              <button
                onClick={onOpenAdInspector}
                className="px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>🔍 2. El Ekspertiz</span>
              </button>
            )}

            {onOpenGameSettings && (
              <button
                onClick={onOpenGameSettings}
                className="px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>🎮 Espor Ayarları</span>
              </button>
            )}

            <a
              href="https://t.me/+Voua-sJ4TVJiZjc8"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-sky-300 border border-sky-500/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>📢 Telegram Kanalı</span>
            </a>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative pt-1">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ekran kartı, işlemci veya kasa adı ara (örn: RTX 4060, Ryzen 7500F, ModArt)..."
              className="w-full pl-11 sm:pl-12 pr-20 sm:pr-36 py-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-700/80 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-12 sm:right-28 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
                title="Aramayı Temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onGoToFps}
              className="absolute right-2 top-2 bottom-2 px-2.5 sm:px-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-all cursor-pointer shrink-0"
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
            <div className="text-lg font-bold text-white">22+ Büyük Mağaza</div>
            <div className="text-[11px] text-neutral-500">İtopya, GamingGen, Vatan, Tebilon, QP, Inventus, Nova...</div>
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
