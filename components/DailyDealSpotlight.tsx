"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  buildWhatsAppShareUrl,
  buildFacebookShareUrl,
  SITE_URL
} from "@/lib/community";
import {
  Flame,
  Clock,
  ExternalLink,
  Zap,
  TrendingDown,
  Copy,
  Check,
  Share2,
  Swords,
  Sparkles
} from "lucide-react";

interface DailyDealSpotlightProps {
  systems: PrebuiltSystem[];
  onOpenDetail: (system: PrebuiltSystem) => void;
  onTestFps: (system: PrebuiltSystem) => void;
  onOpenCustomVsPrebuilt?: () => void;
}

export const DailyDealSpotlight: React.FC<DailyDealSpotlightProps> = ({
  systems,
  onOpenDetail,
  onTestFps,
  onOpenCustomVsPrebuilt
}) => {
  const [countdown, setCountdown] = useState<string>("08:42:15");
  const [copiedForum, setCopiedForum] = useState<boolean>(false);

  // Pick today's #1 F/P & savings deal deterministically
  const dealSystem = useMemo(() => {
    if (!systems || systems.length === 0) return null;
    const sorted = [...systems].sort((a, b) => {
      const scoreA = a.fpScore * 1000 + (a.individualZeroPrice - a.price) * 0.2;
      const scoreB = b.fpScore * 1000 + (b.individualZeroPrice - b.price) * 0.2;
      return scoreB - scoreA;
    });
    return sorted[0];
  }, [systems]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diffMs = Math.max(0, endOfDay.getTime() - now.getTime());
      const hrs = Math.floor(diffMs / 1000 / 60 / 60);
      const mins = Math.floor((diffMs / 1000 / 60) % 60);
      const secs = Math.floor((diffMs / 1000) % 60);
      setCountdown(
        `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`
      );
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!dealSystem) return null;

  const savings = Math.max(0, dealSystem.individualZeroPrice - dealSystem.price);
  const discountPct = dealSystem.oldPrice
    ? Math.round(((dealSystem.oldPrice - dealSystem.price) / dealSystem.oldPrice) * 100)
    : Math.round((savings / Math.max(1, dealSystem.individualZeroPrice)) * 100);
  const cs2Fps = Math.round(dealSystem.gpuTier * 2.8 + dealSystem.cpuTier * 1.5);
  const shareText = `🔥 GÜNÜN KELEPİR KASASI (${dealSystem.seller})\n🖥️ ${dealSystem.title}\n💰 Fiyat: ${formatTL(dealSystem.price)} (+${formatTL(savings)} TL Parça Kârı!)\n⭐ F/P Skoru: ${dealSystem.fpScore}/10 • CS2 ~${cs2Fps} FPS\n👉 Hemen Gör: ${SITE_URL}`;

  const handleCopyShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedForum(true);
      setTimeout(() => setCopiedForum(false), 2500);
    }
  };

  return (
    <div className="mb-6 relative rounded-3xl bg-gradient-to-br from-rose-950/35 via-neutral-900 to-emerald-950/35 border border-rose-500/40 p-5 sm:p-6 shadow-2xl overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Row: Live Countdown + Badge */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-neutral-950 shadow-lg shadow-rose-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400">
                Günün Kelepir F/P Bombası
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black">
                %{Math.max(8, discountPct)} Avantajlı
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Algoritmamızın bugün Türkiye genelinde yakaladığı en kârlı hazır sistem
            </p>
          </div>
        </div>

        {/* Live Countdown */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950/90 border border-rose-500/30 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span className="text-[11px] text-neutral-400 font-semibold">Yenilenmeye Kalan:</span>
          <span className="text-xs sm:text-sm font-mono font-black text-amber-300 tracking-wider">
            {countdown}
          </span>
        </div>
      </div>

      {/* Main Spotlight Grid */}
      <div className="relative z-10 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Specs */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-2.5 py-0.5 rounded-lg text-xs font-bold"
              style={{
                backgroundColor: `${dealSystem.sellerColor}20`,
                color: dealSystem.sellerColor,
                border: `1px solid ${dealSystem.sellerColor}50`
              }}
            >
              {dealSystem.sellerLogo} {dealSystem.seller}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black">
              ⭐ {dealSystem.fpScore} / 10 F/P Şampiyonu
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              CS2 ~{cs2Fps} FPS
            </span>
          </div>

          <h3
            onClick={() => onOpenDetail(dealSystem)}
            className="text-xl sm:text-2xl font-black text-white hover:text-emerald-400 transition-colors cursor-pointer leading-tight"
          >
            {dealSystem.title}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">Ekran Kartı</span>
              <span className="font-bold text-emerald-300 line-clamp-1">{dealSystem.gpu}</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">İşlemci</span>
              <span className="font-bold text-white line-clamp-1">
                {dealSystem.cpu.split("(")[0].trim()}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">RAM</span>
              <span className="font-bold text-white line-clamp-1">{dealSystem.ram}</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">Depolama</span>
              <span className="font-bold text-white line-clamp-1">{dealSystem.ssd}</span>
            </div>
          </div>

          {/* Quick Virality Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleCopyShare}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedForum ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>{copiedForum ? "Fırsat Metni Kopyalandı!" : "Forum/Grup İçin Kopyala"}</span>
            </button>

            <a
              href={buildWhatsAppShareUrl(shareText)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp&apos;ta Sor</span>
            </a>

            <a
              href={buildFacebookShareUrl(SITE_URL, shareText)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-500/30 text-blue-300 text-[11px] font-bold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Facebook&apos;ta Paylaş</span>
            </a>
          </div>
        </div>

        {/* Right: Price & CTA Box */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-neutral-950/90 border border-emerald-500/30 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[11px] text-neutral-400">
                Tek tek parça toplasan:{" "}
                <span className="line-through text-neutral-500">
                  {formatTL(dealSystem.individualZeroPrice)}
                </span>
              </div>
              <div className="text-3xl font-black text-white tracking-tight mt-0.5">
                {formatTL(dealSystem.price)}
              </div>
              {dealSystem.oldPrice && (
                <div className="text-xs text-neutral-500 line-through">
                  Eski Fiyat: {formatTL(dealSystem.oldPrice)}
                </div>
              )}
            </div>

            <div className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-right shrink-0">
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Net Kârın</div>
              <div className="text-sm font-black text-emerald-400 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                +{formatTL(savings)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={dealSystem.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <span>{dealSystem.seller}&apos;da Yakala</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => onTestFps(dealSystem)}
              className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-neutral-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>FPS &amp; Detay Gör</span>
            </button>
          </div>

          {onOpenCustomVsPrebuilt && (
            <button
              onClick={onOpenCustomVsPrebuilt}
              className="w-full py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-neutral-800 transition-all cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5 text-emerald-400" />
              <span>Parça Parça Fiyat Dökümünü Kıyasla</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
