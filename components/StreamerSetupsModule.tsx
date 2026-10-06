"use client";

import React, { useState, useMemo } from "react";
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
  CheckCircle,
  Search,
  Trophy,
  Globe,
  Layers,
  Square
} from "lucide-react";

interface StreamerSetupsModuleProps {
  streamers: StreamerSetup[];
  systems: PrebuiltSystem[];
  onTestSystemFps: (system: PrebuiltSystem) => void;
}

const TURKISH_STREAMER_IDS = new Set([
  "elraenn",
  "wtcn",
  "kendinemuzisyen",
  "mithrain",
  "unlost",
  "jahrein",
  "rraenee",
  "eray"
]);

const ESPORTS_PRO_IDS = new Set([
  "xantares",
  "woxic",
  "cned",
  "s1mple",
  "niko",
  "m0nesy",
  "donk",
  "tenz"
]);

const GLOBAL_STREAMER_IDS = new Set([
  "shroud",
  "tarik",
  "xqc",
  "kaicenat",
  "ishowspeed"
]);

type StreamerCategory = "all" | "turkish" | "esports" | "global";

export const StreamerSetupsModule: React.FC<StreamerSetupsModuleProps> = ({
  streamers,
  systems,
  onTestSystemFps
}) => {
  const [selectedStreamerId, setSelectedStreamerId] = useState<string>(streamers[0]?.id || "elraenn");
  const [activeCategory, setActiveCategory] = useState<StreamerCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredStreamers = useMemo(() => {
    return streamers.filter((s) => {
      if (activeCategory === "turkish" && !TURKISH_STREAMER_IDS.has(s.id)) return false;
      if (activeCategory === "esports" && !ESPORTS_PRO_IDS.has(s.id)) return false;
      if (activeCategory === "global" && !GLOBAL_STREAMER_IDS.has(s.id)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = s.alias.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
        const matchesGame = s.primaryGame.toLowerCase().includes(q);
        const matchesGpu = s.pcSpecs.gpu.toLowerCase().includes(q);
        const matchesCpu = s.pcSpecs.cpu.toLowerCase().includes(q);
        return matchesName || matchesGame || matchesGpu || matchesCpu;
      }
      return true;
    });
  }, [streamers, activeCategory, searchQuery]);

  const activeStreamer =
    streamers.find((s) => s.id === selectedStreamerId) ||
    filteredStreamers[0] ||
    streamers[0];

  const closestSystem =
    systems.find((s) => s.id === activeStreamer.closestSystemId) || systems[0];

  const categoryCounts = useMemo(() => {
    return {
      all: streamers.length,
      turkish: streamers.filter((s) => TURKISH_STREAMER_IDS.has(s.id)).length,
      esports: streamers.filter((s) => ESPORTS_PRO_IDS.has(s.id)).length,
      global: streamers.filter((s) => GLOBAL_STREAMER_IDS.has(s.id)).length
    };
  }, [streamers]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>21+ Popüler Yayıncı &amp; Esporcu Setup Kataloğu</span>
          </div>
          <span className="text-xs text-neutral-400 bg-neutral-950 px-3 py-1 rounded-full border border-neutral-800">
            Resmi Profil Fotoğrafları &amp; Gerçek Donanım Bilgileri
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Yayıncıların PC ve Ekipman Rehberi
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl">
          Türkiye ve dünyanın en popüler yayıncılarının, dünya şampiyonu esporcularının kullandığı
          orijinal donanımları incele. Yüz binlerce liralık setup&apos;lar yerine aynı oyun performansını veren bütçe dostu hazır kasa alternatiflerini yakala.
        </p>

        {/* Filters and Search Bar */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-neutral-800/80">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "all"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tümü ({categoryCounts.all})</span>
            </button>
            <button
              onClick={() => setActiveCategory("turkish")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "turkish"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <span>🇹🇷 Türk Yayıncılar ({categoryCounts.turkish})</span>
            </button>
            <button
              onClick={() => setActiveCategory("esports")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "esports"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Espor Yıldızları ({categoryCounts.esports})</span>
            </button>
            <button
              onClick={() => setActiveCategory("global")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "global"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Global ({categoryCounts.global})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px] sm:w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Yayıncı, oyun veya GPU ara..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Streamer Avatar Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {filteredStreamers.map((streamer) => {
          const isSelected = streamer.id === activeStreamer.id;
          return (
            <button
              key={streamer.id}
              onClick={() => setSelectedStreamerId(streamer.id)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col items-center text-center gap-2 group ${
                isSelected
                  ? "bg-gradient-to-b from-purple-950/40 to-neutral-900 border-purple-500 ring-2 ring-purple-500/50 shadow-xl shadow-purple-500/20"
                  : "bg-neutral-900/80 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/80"
              }`}
            >
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-transform duration-200 group-hover:scale-105 ${
                    isSelected ? "border-purple-400 shadow-md shadow-purple-500/40" : "border-neutral-700"
                  }`}
                >
                  <img
                    src={streamer.avatar}
                    alt={streamer.alias}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback placeholder with initial if image fails
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        streamer.alias
                      )}&background=18181b&color=a855f7&bold=true`;
                    }}
                  />
                </div>
                {isSelected && (
                  <span className="absolute -bottom-1 -right-1 bg-purple-500 text-white rounded-full p-0.5 shadow">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div className="w-full overflow-hidden">
                <div className="text-xs font-black text-white truncate flex items-center justify-center gap-1">
                  <span>{streamer.alias}</span>
                </div>
                <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                  {streamer.primaryGame.split("/")[0]}
                </div>
                <div className="text-[9px] text-purple-400 font-semibold mt-0.5 truncate">
                  {streamer.platform.split("/")[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredStreamers.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-neutral-900/50 border border-neutral-800 text-neutral-400 text-xs">
          Aramanızla eşleşen yayıncı bulunamadı. Lütfen arama terimini değiştirin.
        </div>
      )}

      {/* Active Streamer Detailed Spec Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Streamer Setup Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-6">
            {/* Streamer Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-neutral-800">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-xl shadow-purple-500/20 shrink-0">
                <img
                  src={activeStreamer.avatar}
                  alt={activeStreamer.alias}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl font-black text-white">{activeStreamer.alias}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                    {activeStreamer.name}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 font-medium">
                    {activeStreamer.platform}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300">{activeStreamer.description}</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-400">
                  <span className="text-purple-400 font-bold">Ana Oyun:</span>
                  <span className="text-neutral-200">{activeStreamer.primaryGame}</span>
                </div>
              </div>
            </div>

            {/* PC Specs Grid */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Yayın &amp; Oyun Bilgisayarı (Kasa Donanımı)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors">
                  <span className="text-[10px] text-neutral-500 block uppercase font-medium">İşlemci (CPU)</span>
                  <span className="font-bold text-white text-sm">{activeStreamer.pcSpecs.cpu}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                  <span className="text-[10px] text-emerald-500 block uppercase font-medium">Ekran Kartı (GPU)</span>
                  <span className="font-bold text-emerald-400 text-sm">{activeStreamer.pcSpecs.gpu}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase font-medium">RAM (Bellek)</span>
                  <span className="font-semibold text-neutral-200">{activeStreamer.pcSpecs.ram}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase font-medium">Anakart</span>
                  <span className="font-semibold text-neutral-200">{activeStreamer.pcSpecs.motherboard}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase font-medium">Depolama</span>
                  <span className="font-semibold text-neutral-200">{activeStreamer.pcSpecs.storage}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block uppercase font-medium">Soğutma Sistemi</span>
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
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2.5">
                  <Tv className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-neutral-500 block uppercase">Monitör</span>
                    <span className="font-semibold text-neutral-200 break-words">{activeStreamer.gear.monitor}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2.5">
                  <Mouse className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-neutral-500 block uppercase">Mouse</span>
                    <span className="font-semibold text-neutral-200 break-words">{activeStreamer.gear.mouse}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2.5">
                  <Keyboard className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-neutral-500 block uppercase">Klavye</span>
                    <span className="font-semibold text-neutral-200 break-words">{activeStreamer.gear.keyboard}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2.5">
                  <Headphones className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-neutral-500 block uppercase">Kulaklık</span>
                    <span className="font-semibold text-neutral-200 break-words">{activeStreamer.gear.headset}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2.5">
                  <Mic className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-neutral-500 block uppercase">Mikrofon</span>
                    <span className="font-semibold text-neutral-200 break-words">{activeStreamer.gear.microphone}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2.5">
                  <Square className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-neutral-500 block uppercase">Mousepad</span>
                    <span className="font-semibold text-neutral-200 break-words">
                      {activeStreamer.gear.mousepad || "Profesyonel Espor Mousepad"}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2.5 sm:col-span-3">
                  <Shield className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Oyuncu Koltuğu / Çalışma Alanı</span>
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
