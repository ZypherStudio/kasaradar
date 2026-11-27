"use client";

import React, { useMemo, useState } from "react";
import { PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  Trophy,
  Crown,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2
} from "lucide-react";

interface StoreLeaderboardProps {
  systems: PrebuiltSystem[];
  selectedSeller: string;
  onSelectSeller: (seller: string) => void;
  onOpenMediaKit?: () => void;
}

interface StoreStat {
  seller: string;
  logo: string;
  color: string;
  systemCount: number;
  avgFpScore: number;
  avgSavings: number;
  maxSavings: number;
  bestPrice: number;
}

export const StoreLeaderboard: React.FC<StoreLeaderboardProps> = ({
  systems,
  selectedSeller,
  onSelectSeller,
  onOpenMediaKit
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const rankings = useMemo<StoreStat[]>(() => {
    const map = new Map<string, PrebuiltSystem[]>();
    systems.forEach((sys) => {
      const existing = map.get(sys.seller) || [];
      existing.push(sys);
      map.set(sys.seller, existing);
    });

    const stats: StoreStat[] = [];
    map.forEach((list, seller) => {
      const count = list.length;
      const avgFp =
        list.reduce((acc, s) => acc + s.fpScore, 0) / Math.max(1, count);
      const savingsList = list.map((s) => Math.max(0, s.individualZeroPrice - s.price));
      const avgSavings = Math.round(
        savingsList.reduce((acc, val) => acc + val, 0) / Math.max(1, count)
      );
      const maxSavings = Math.max(...savingsList, 0);
      const bestPrice = Math.min(...list.map((s) => s.price));

      stats.push({
        seller,
        logo: list[0].sellerLogo,
        color: list[0].sellerColor,
        systemCount: count,
        avgFpScore: Number(avgFp.toFixed(1)),
        avgSavings,
        maxSavings,
        bestPrice
      });
    });

    return stats.sort((a, b) => {
      const scoreA = a.avgFpScore * 1000 + a.avgSavings * 0.15 + a.systemCount * 40;
      const scoreB = b.avgFpScore * 1000 + b.avgSavings * 0.15 + b.systemCount * 40;
      return scoreB - scoreA;
    });
  }, [systems]);

  if (rankings.length === 0) return null;

  const visibleStores = expanded ? rankings : rankings.slice(0, 4);

  return (
    <div className="mb-6 rounded-2xl bg-neutral-900/85 border border-neutral-800 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>Haftanın F/P Şampiyonu Mağazaları</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                Canlı Endeks
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              Listelenen hazır kasaların ortalama F/P skoru ve parça tasarrufuna göre otomatik mağaza sıralaması (filtrelemek için tıkla)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedSeller !== "all" && (
            <button
              onClick={() => onSelectSeller("all")}
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-bold transition-all cursor-pointer"
            >
              Tüm Mağazaları Göster
            </button>
          )}
          {onOpenMediaKit && (
            <button
              onClick={onOpenMediaKit}
              className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Crown className="w-3 h-3" />
              <span>Mağaza Başvurusu</span>
            </button>
          )}
        </div>
      </div>

      {/* Store Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {visibleStores.map((st, idx) => {
          const isSelected = selectedSeller === st.seller;
          const rankBadge =
            idx === 0
              ? { label: "🏆 #1 F/P Lideri", cls: "bg-amber-500/20 text-amber-300 border-amber-500/40" }
              : idx === 1
              ? { label: "🥈 #2 Çok Avantajlı", cls: "bg-slate-400/15 text-slate-200 border-slate-400/30" }
              : idx === 2
              ? { label: "🥉 #3 Fırsat Radarında", cls: "bg-orange-500/15 text-orange-300 border-orange-500/30" }
              : { label: `#${idx + 1} Mağaza`, cls: "bg-neutral-800 text-neutral-400 border-neutral-700" };

          return (
            <button
              key={st.seller}
              onClick={() => onSelectSeller(isSelected ? "all" : st.seller)}
              className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                isSelected
                  ? "bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-500/10"
                  : "bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black ${rankBadge.cls}`}>
                  {rankBadge.label}
                </span>
                {isSelected && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Seçili
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base">{st.logo}</span>
                  <span className="font-black text-sm text-white truncate">{st.seller}</span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black shrink-0">
                  {st.avgFpScore}/10
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-neutral-800/80">
                <span className="text-neutral-400">{st.systemCount} Aktif Kasa</span>
                <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3" />
                  Ort. +{formatTL(st.avgSavings)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expand Toggle if >4 stores */}
      {rankings.length > 4 && (
        <div className="flex justify-center pt-1">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Sadece İlk 4 Mağazayı Göster</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Tüm Mağaza Sıralamasını Gör ({rankings.length} Mağaza)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
