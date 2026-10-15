"use client";

import React, { useState } from "react";
import { MonitorRecommendation } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  Monitor,
  Zap,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Tv,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface MonitorsModuleProps {
  monitors: MonitorRecommendation[];
}

export const MonitorsModule: React.FC<MonitorsModuleProps> = ({ monitors }) => {
  const [selectedResolution, setSelectedResolution] = useState<string>("all");

  const filtered = monitors.filter((m) => {
    if (selectedResolution === "all") return true;
    if (selectedResolution === "1080p" && m.resolution.includes("1080")) return true;
    if (selectedResolution === "2k" && m.resolution.includes("1440")) return true;
    if (selectedResolution === "4k" && m.resolution.includes("2160")) return true;
    return false;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold">
          <Monitor className="w-3.5 h-3.5" />
          <span>Oyuncu Monitör &amp; Ekipman Eşleştirici</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Ekran Kartına En Uygun Gaming Monitörler
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400">
          Güçlü bir ekran kartı alıp eski 60Hz monitörde oynamak donanımı çöpe atmaktır. Kartının gücünü tam yansıtan en popüler F/P oyuncu monitörlerini inceleyin.
        </p>
      </div>

      {/* Advice banner: Which resolution for which GPU? */}
      <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1">
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            RTX 4060 &amp; RX 6600
          </span>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Bu kartlar için en ideali **1080p 165Hz - 180Hz Fast IPS** monitörlerdir. 2K çözünürlük bu kartları zorlar.
          </p>
        </div>

        <div className="space-y-1">
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            RTX 4070 SUPER &amp; RX 7700 XT
          </span>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Bu kartların tam hakkı **2560x1440 (2K) 170Hz - 240Hz** monitörlerdir. 1080p&apos;de darboğaz yaşayabilirsiniz.
          </p>
        </div>

        <div className="space-y-1">
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            RTX 4080 SUPER &amp; RTX 4090
          </span>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Zirve donanım! **360Hz QD-OLED** veya **4K 144Hz** panellerle hikayeli oyunlarda grafik şöleni yaşatır.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: "all", label: "Tüm Monitörler" },
          { id: "1080p", label: "1080p FHD (180Hz)" },
          { id: "2k", label: "2K QHD (170Hz - 360Hz)" },
          { id: "4k", label: "4K UHD (144Hz)" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedResolution(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedResolution === tab.id
                ? "bg-cyan-500 text-neutral-950 font-bold"
                : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Monitors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((mon) => {
          const cleanQuery = encodeURIComponent(mon.name.replace(/\s*\([^)]*\)/g, "").trim());
          const targetUrl = mon.buyUrl && mon.buyUrl.startsWith("http")
            ? mon.buyUrl
            : `https://www.akakce.com/arama/?q=${cleanQuery}`;
          const secondHandUrl = `https://www.sahibinden.com/kelime-ile-arama?query_text_mf=${cleanQuery}&sorting=date_desc`;

          return (
            <div
              key={mon.id}
              className="flex flex-col justify-between rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all p-5 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {mon.dealTag}
                  </span>
                  <span className="text-[10px] text-neutral-500">{mon.brand}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm line-clamp-1">{mon.name}</h3>
                  <div className="text-xs text-neutral-400">
                    {mon.sizeInch} • {mon.panelType}
                  </div>
                </div>

                {/* Specs */}
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5 text-xs text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Çözünürlük:</span>
                    <span className="font-semibold text-white">{mon.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Tazeleme Hızı:</span>
                    <span className="font-bold text-cyan-400">{mon.refreshRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Uyumlu GPU:</span>
                    <span className="font-semibold text-emerald-400">{mon.idealForGpu}</span>
                  </div>
                </div>
              </div>

              {/* Price & Buy Button */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] text-neutral-500 uppercase">Satış Fiyatı</span>
                  <span className="text-lg font-black text-white">{formatTL(mon.price)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20 transition-all text-center"
                    title="Akakçe ve Mağazalarda En Ucuz Sıfır Fiyatı Karşılaştır"
                  >
                    <span>En Ucuz Sıfır</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <a
                    href={secondHandUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 transition-all text-center"
                    title="Sahibinden Üzerinde İkinci El Monitör İlanlarını İncele"
                  >
                    <span>2. El Ara</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
