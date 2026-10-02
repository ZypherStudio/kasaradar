"use client";

import React, { useState } from "react";
import { StreamerSetup, PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  Sparkles,
  Tv,
  Cpu,
  Headphones,
  Mouse,
  Keyboard,
  Mic,
  Shield,
  ExternalLink,
  Zap,
  CheckCircle
} from "lucide-react";

interface StreamerSetupsModuleProps {
  streamers: StreamerSetup[];
  systems: PrebuiltSystem[];
  onTestSystemFps: (system: PrebuiltSystem) => void;
}

export const StreamerSetupsModule: React.FC<StreamerSetupsModuleProps> = ({
  streamers,
  systems,
  onTestSystemFps
}) => {
  const [selectedStreamerId, setSelectedStreamerId] = useState<string>(streamers[0].id);

  const activeStreamer = streamers.find((s) => s.id === selectedStreamerId) || streamers[0];
  const closestSystem = systems.find((s) => s.id === activeStreamer.closestSystemId) || systems[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Yayıncı &amp; Pro Espor Ekipman Veritabanı</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Yayıncıların PC ve Ekipman Rehberi
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400">
          Sevdiğin yayıncı ve esporcuların kullandığı donanımı incele. Yüz binlerce liralık setup&apos;lar yerine aynı FPS&apos;i veren bütçe dostu hazır kasa alternatiflerini gör.
        </p>
      </div>

      {/* Streamer Avatar Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {streamers.map((streamer) => {
          const isSelected = streamer.id === selectedStreamerId;
          return (
            <button
              key={streamer.id}
              onClick={() => setSelectedStreamerId(streamer.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? "bg-neutral-800 border-purple-500 ring-1 ring-purple-500 shadow-lg shadow-purple-500/10"
                  : "bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-neutral-700 shrink-0">
                <img
                  src={streamer.avatar}
                  alt={streamer.alias}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-black text-white truncate">{streamer.alias}</div>
                <div className="text-[10px] text-neutral-400 truncate">{streamer.primaryGame}</div>
                <div className="text-[9px] text-purple-400 font-semibold">{streamer.platform}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Streamer Detailed Spec Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Streamer Setup Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{activeStreamer.alias}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                  {activeStreamer.name}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">{activeStreamer.description}</p>
            </div>

            {/* PC Specs Grid */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Yayın &amp; Oyun Bilgisayarı (Kasa Donanımı)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase">İşlemci (CPU)</span>
                  <span className="font-bold text-white">{activeStreamer.pcSpecs.cpu}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase">Ekran Kartı (GPU)</span>
                  <span className="font-bold text-emerald-400">{activeStreamer.pcSpecs.gpu}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase">RAM (Bellek)</span>
                  <span className="font-semibold text-neutral-200">{activeStreamer.pcSpecs.ram}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase">Anakart</span>
                  <span className="font-semibold text-neutral-200">{activeStreamer.pcSpecs.motherboard}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase">Depolama</span>
                  <span className="font-semibold text-neutral-200">{activeStreamer.pcSpecs.storage}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase">Sıvı Soğutma</span>
                  <span className="font-semibold text-neutral-200">{activeStreamer.pcSpecs.cooling}</span>
                </div>
              </div>
            </div>

            {/* Peripherals & Gear */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-purple-400" />
                Ekipman &amp; Çevre Birimleri
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2">
                  <Tv className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Monitör</span>
                    <span className="font-semibold text-neutral-200">{activeStreamer.gear.monitor}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2">
                  <Mouse className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Mouse</span>
                    <span className="font-semibold text-neutral-200">{activeStreamer.gear.mouse}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2">
                  <Keyboard className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Klavye</span>
                    <span className="font-semibold text-neutral-200">{activeStreamer.gear.keyboard}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2">
                  <Headphones className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Kulaklık</span>
                    <span className="font-semibold text-neutral-200">{activeStreamer.gear.headset}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2">
                  <Mic className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Mikrofon</span>
                    <span className="font-semibold text-neutral-200">{activeStreamer.gear.microphone}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Oyuncu Koltuğu</span>
                    <span className="font-semibold text-neutral-200">{activeStreamer.gear.chair}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Closest Ready-To-Buy Pre-Built System (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-emerald-500/40 space-y-5 sticky top-24 shadow-xl">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Bu Performansa En Yakın Hazır Kasa
              </span>
              <h4 className="text-lg font-black text-white">{closestSystem.title}</h4>
              <p className="text-xs text-neutral-400">
                Bu yayıncının sistem gücünün %85&apos;ini, 3&apos;te 1 fiyatına alabileceğin en mantıklı hazır sistem:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-neutral-400">
                <span>Ekran Kartı:</span>
                <span className="font-bold text-white">{closestSystem.gpu}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>İşlemci:</span>
                <span className="font-bold text-white">{closestSystem.cpu.split("(")[0]}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>Bellek:</span>
                <span className="font-bold text-white">{closestSystem.ram}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>Mağaza:</span>
                <span className="font-bold text-emerald-400">{closestSystem.seller}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Satış Fiyatı</span>
                <span className="text-xl font-black text-emerald-400">{formatTL(closestSystem.price)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">F/P Skoru</span>
                <span className="text-sm font-black text-white">{closestSystem.fpScore} / 10</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <a
                href={closestSystem.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>Sistemi Mağazada İncele</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => onTestSystemFps(closestSystem)}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 border border-cyan-500/30 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bu Kasanın FPS Testini Yap</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
