"use client";

import React, { useState, useEffect } from "react";
import { PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import { PriceHistoryChart } from "./PriceHistoryChart";
import {
  TrendingDown,
  X,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag
} from "lucide-react";

interface PriceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: PrebuiltSystem[];
  initialSystem?: PrebuiltSystem | null;
  onSelectSystemDetail: (system: PrebuiltSystem) => void;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({
  isOpen,
  onClose,
  systems,
  initialSystem,
  onSelectSystemDetail
}) => {
  const [selectedSystemId, setSelectedSystemId] = useState<string>(
    initialSystem?.id || systems[0]?.id || ""
  );

  useEffect(() => {
    if (initialSystem) {
      setSelectedSystemId(initialSystem.id);
    } else if (systems.length > 0 && !selectedSystemId) {
      setSelectedSystemId(systems[0].id);
    }
  }, [initialSystem, systems, selectedSystemId]);

  if (!isOpen) return null;

  const currentSystem =
    systems.find((s) => s.id === selectedSystemId) || systems[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-emerald-500/40 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Fiyat Geçmişi &amp; İndirim Trendi • Son 30-90 Gün</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Kasa Fiyatı Gerçekten Düştü mü? (Borsa Grafiği)
          </h3>
          <p className="text-xs text-neutral-400">
            Sistemlerin son 30, 60 ve 90 günlük fiyat geçmişini, en tepe ve en dip noktalarını canlı inceleyin. Sahte indirimlere kanmayın.
          </p>
        </div>

        {/* System Selector Header */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                İncelenen Hazır Sistem:
              </label>
              <select
                value={selectedSystemId}
                onChange={(e) => setSelectedSystemId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold truncate"
              >
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.seller} — {s.title} ({formatTL(s.price)})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 uppercase block font-semibold">
                  Güncel Satış Fiyatı
                </span>
                <span className="text-lg font-black text-emerald-400">
                  {formatTL(currentSystem.price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Interactive Price History Chart */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-2 sm:p-4">
          <PriceHistoryChart
            currentPrice={currentSystem.price}
            oldPrice={currentSystem.oldPrice}
            individualZeroPrice={currentSystem.individualZeroPrice}
            systemTitle={currentSystem.title}
            seller={currentSystem.seller}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/80 text-xs">
          <div className="text-neutral-400 text-[11px]">
            💡 <strong className="text-white">İpucu:</strong> KasaRadar fiyat takip motoru 16 mağazayı günde 24 kez tarar.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSelectSystemDetail(currentSystem);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <span>Kasa Donanım Detaylarını Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
