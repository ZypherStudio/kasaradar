"use client";

import React from "react";
import { PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  X,
  ExternalLink,
  Trash2,
  Trophy,
  TrendingDown,
  Zap,
  Cpu,
  Tv,
  CheckCircle2,
  Gauge
} from "lucide-react";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: PrebuiltSystem[];
  onRemoveSystem: (id: string) => void;
  onClearAll: () => void;
  onTestFps: (system: PrebuiltSystem) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  systems,
  onRemoveSystem,
  onClearAll,
  onTestFps
}) => {
  if (!isOpen) return null;

  // Find the FP score winner
  const bestSystem = [...systems].sort((a, b) => b.fpScore - a.fpScore)[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl bg-neutral-900 border border-neutral-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">Hazır Kasa Karşılaştırma Laboratuvarı</h3>
              {systems.length > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  {systems.length} Kasa Kıyaslanıyor
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Seçilen kasaların teknik donanımlarını, oyun FPS performanslarını ve kâr oranlarını yan yana kıyaslayın.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {systems.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 text-xs transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Listeyi Temizle</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {systems.length === 0 ? (
          <div className="text-center py-16 text-neutral-400 space-y-2">
            <p className="text-base font-semibold text-white">Henüz karşılaştırma sepetine kasa eklemediniz.</p>
            <p className="text-xs text-neutral-500">
              Kasa kartlarındaki &quot;Karşılaştır&quot; butonuna basarak 2 veya 3 kasayı yan yana kıyaslayabilirsiniz.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1 space-y-6">
            {/* FP Winner Announcement Banner */}
            {systems.length >= 2 && bestSystem && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-500/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500 text-neutral-950 font-black">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider block">
                      KasaRadar F/P Karşılaştırma Kazananı
                    </span>
                    <span className="text-sm font-black text-white">
                      {bestSystem.title} ({formatTL(bestSystem.price)})
                    </span>
                    <span className="text-xs text-neutral-400 ml-2">
                      — {bestSystem.fpScore} / 10 puan ile en yüksek fiyat/performans oranını sunuyor.
                    </span>
                  </div>
                </div>

                <a
                  href={bestSystem.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all shrink-0"
                >
                  <span>Kazananı Al</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Spec Comparison Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="p-3 w-40 text-neutral-400 uppercase text-[10px] tracking-wider">
                    Özellik
                  </th>
                  {systems.map((s) => (
                    <th key={s.id} className="p-3 min-w-[220px]">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-white mb-1 inline-block"
                            style={{ backgroundColor: `${s.sellerColor}25`, color: s.sellerColor }}
                          >
                            {s.seller}
                          </span>
                          <div className="font-bold text-white text-sm line-clamp-1">{s.title}</div>
                        </div>
                        <button
                          onClick={() => onRemoveSystem(s.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-800/60">
                {/* Price */}
                <tr className="bg-neutral-950/40">
                  <td className="p-3 font-bold text-neutral-400">Satış Fiyatı</td>
                  {systems.map((s) => (
                    <td key={s.id} className="p-3">
                      <div className="text-base font-black text-white">{formatTL(s.price)}</div>
                      {s.oldPrice && (
                        <div className="text-[10px] text-neutral-500 line-through">
                          {formatTL(s.oldPrice)}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Savings */}
                <tr>
                  <td className="p-3 font-bold text-neutral-400">Tasarruf / Kâr</td>
                  {systems.map((s) => {
                    const savings = s.individualZeroPrice - s.price;
                    return (
                      <td key={s.id} className="p-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <TrendingDown className="w-3 h-3" />
                          +{formatTL(savings)} Kâr
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* F/P Score */}
                <tr className="bg-neutral-950/40">
                  <td className="p-3 font-bold text-neutral-400">F/P Skoru</td>
                  {systems.map((s) => (
                    <td key={s.id} className="p-3">
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs">
                        {s.fpScore} / 10
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Estimated Game FPS Benchmarks */}
                <tr>
                  <td className="p-3 font-bold text-neutral-400">
                    <div className="flex items-center gap-1 text-cyan-400">
                      <Zap className="w-3.5 h-3.5" />
                      <span>FPS Tahminleri</span>
                    </div>
                  </td>
                  {systems.map((s) => (
                    <td key={s.id} className="p-3 space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-neutral-400">CS2 (1080p):</span>
                        <span className="font-bold text-emerald-400">
                          ~{Math.round(s.gpuTier * 2.8 + s.cpuTier * 1.5)} FPS
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-neutral-400">Valorant:</span>
                        <span className="font-bold text-cyan-400">
                          ~{Math.round(s.cpuTier * 3.5 + 80)} FPS
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-neutral-400">GTA 6 (2K):</span>
                        <span className="font-bold text-amber-400">
                          ~{Math.round(s.gpuTier * 0.95)} FPS
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* GPU */}
                <tr className="bg-neutral-950/40">
                  <td className="p-3 font-bold text-neutral-400">Ekran Kartı</td>
                  {systems.map((s) => (
                    <td key={s.id} className="p-3 text-neutral-200">
                      <div className="font-bold text-emerald-400">{s.gpu}</div>
                      <div className="text-[10px] text-neutral-500">{s.gpuVram}</div>
                    </td>
                  ))}
                </tr>

                {/* CPU */}
                <tr>
                  <td className="p-3 font-bold text-neutral-400">İşlemci</td>
                  {systems.map((s) => (
                    <td key={s.id} className="p-3 text-neutral-200 font-semibold">
                      {s.cpu}
                    </td>
                  ))}
                </tr>

                {/* RAM */}
                <tr className="bg-neutral-950/40">
                  <td className="p-3 font-bold text-neutral-400">Bellek (RAM)</td>
                  {systems.map((s) => (
                    <td key={s.id} className="p-3 text-neutral-200">
                      <div>{s.ram}</div>
                      <div className="text-[10px] text-purple-400 font-bold">{s.ramType} Platformu</div>
                    </td>
                  ))}
                </tr>

                {/* SSD */}
                <tr>
                  <td className="p-3 font-bold text-neutral-400">Depolama (SSD)</td>
                  {systems.map((s) => (
                    <td key={s.id} className="p-3 text-neutral-200">
                      {s.ssd}
                    </td>
                  ))}
                </tr>

                {/* TDP & Power Draw */}
                <tr className="bg-neutral-950/40">
                  <td className="p-3 font-bold text-neutral-400">Güç Tüketimi (TDP)</td>
                  {systems.map((s) => (
                    <td key={s.id} className="p-3 text-neutral-200">
                      <div className="font-bold text-amber-400">~{s.tdpWatts || 300} Watt</div>
                      <div className="text-[10px] text-neutral-500">{s.psu}</div>
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-3 font-bold text-neutral-400">Satın Al</td>
                  {systems.map((s) => (
                    <td key={s.id} className="p-3 space-y-1.5">
                      <a
                        href={s.directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all text-center"
                      >
                        <span>{s.seller}&apos;dan Al</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => {
                          onTestFps(s);
                          onClose();
                        }}
                        className="w-full py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-cyan-300 text-[11px] font-semibold transition-all cursor-pointer text-center"
                      >
                        FPS Testine Gönder
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
