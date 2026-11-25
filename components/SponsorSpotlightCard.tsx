"use client";

import React from "react";
import {
  Crown,
  ExternalLink,
  Tag,
  Zap,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Monitor
} from "lucide-react";

interface SponsorSpotlightCardProps {
  onOpenMediaKit?: () => void;
}

export const SponsorSpotlightCard: React.FC<SponsorSpotlightCardProps> = ({
  onOpenMediaKit
}) => {
  return (
    <div className="mb-6 relative rounded-3xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-emerald-950/40 border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl shadow-amber-500/5 overflow-hidden group">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Row */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-neutral-950 font-black shadow-md shadow-amber-500/20">
            <Crown className="w-4 h-4" />
          </span>
          <div>
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>HAFTANIN SPONSORLU F/P SİSTEMİ</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Resmi Partner
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Gaming.Gen.TR x KasaRadar Özel Tavsiyesi • Doğrulanmış Stok &amp; Fiyat
            </p>
          </div>
        </div>

        {onOpenMediaKit && (
          <button
            onClick={onOpenMediaKit}
            className="text-[11px] text-neutral-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer w-fit"
            title="Markanızın sistemini bu vitrine taşımak için tıklayın"
          >
            <span>💼 Bu Alana Sponsor Ol</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Content Row */}
      <div className="relative z-10 pt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-400">Gaming.Gen.TR</span>
              <span className="text-neutral-600">•</span>
              <span className="text-xs text-neutral-400 font-medium">OEM Paketler</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                ⭐ 9.9 / 10 F/P Puanı
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white leading-snug group-hover:text-amber-300 transition-colors">
              BLADE-7500F / AMD Ryzen 5 7500F / ASUS DUAL RTX 4070 SUPER 12GB
            </h3>
          </div>

          {/* Quick Hardware Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">Ekran Kartı</span>
              <span className="font-bold text-white">RTX 4070 Super 12GB</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">İşlemci</span>
              <span className="font-bold text-white">Ryzen 5 7500F (AM5)</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">Bellek</span>
              <span className="font-bold text-white">32GB 6000MHz DDR5</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">Depolama</span>
              <span className="font-bold text-white">1TB Gen4 NVMe</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 line-through text-xs font-semibold">47.500 TL</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                %16 İndirim
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              39.999 <span className="text-sm font-bold text-amber-400">TL</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-400 mt-0.5">
              💎 Parça Fiyatına Göre: +7.400 TL Cepte
            </div>
          </div>

          <a
            href="https://www.gaming.gen.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
          >
            <span>Mağazada İncele</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
