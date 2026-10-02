"use client";

import React, { useState, useMemo } from "react";
import { GameRequirement, PrebuiltSystem, HardwareComponent } from "@/lib/types";
import { calculateGameFps, ResolutionPreset, formatTL } from "@/lib/calculator";
import {
  Zap,
  Gauge,
  Cpu,
  Tv,
  MemoryStick,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Gamepad2,
  ExternalLink
} from "lucide-react";

interface FpsSimulatorModuleProps {
  games: GameRequirement[];
  hardwareList: HardwareComponent[];
  systems: PrebuiltSystem[];
  preselectedSystem?: PrebuiltSystem | null;
  onClearPreselectedSystem: () => void;
  onSelectSystemForPurchase: (system: PrebuiltSystem) => void;
}

export const FpsSimulatorModule: React.FC<FpsSimulatorModuleProps> = ({
  games,
  hardwareList,
  systems,
  preselectedSystem,
  onClearPreselectedSystem,
  onSelectSystemForPurchase
}) => {
  const [selectedGameId, setSelectedGameId] = useState<string>("cs2");
  const [resolutionPreset, setResolutionPreset] = useState<ResolutionPreset>("1080p_ultra");

  // Hardware state
  const [selectedCpuTier, setSelectedCpuTier] = useState<number>(preselectedSystem ? preselectedSystem.cpuTier : 82);
  const [selectedGpuTier, setSelectedGpuTier] = useState<number>(preselectedSystem ? preselectedSystem.gpuTier : 79);
  const [selectedRamGb, setSelectedRamGb] = useState<number>(preselectedSystem ? preselectedSystem.ramSizeGb : 16);
  const [activeSystemName, setActiveSystemName] = useState<string>(preselectedSystem ? preselectedSystem.title : "");

  // Update hardware if preselectedSystem changes
  React.useEffect(() => {
    if (preselectedSystem) {
      setSelectedCpuTier(preselectedSystem.cpuTier);
      setSelectedGpuTier(preselectedSystem.gpuTier);
      setSelectedRamGb(preselectedSystem.ramSizeGb);
      setActiveSystemName(preselectedSystem.title);
    }
  }, [preselectedSystem]);

  const selectedGame = useMemo(() => {
    return games.find((g) => g.id === selectedGameId) || games[0];
  }, [games, selectedGameId]);

  const calculation = useMemo(() => {
    return calculateGameFps(
      selectedGame,
      selectedCpuTier,
      selectedGpuTier,
      selectedRamGb,
      resolutionPreset
    );
  }, [selectedGame, selectedCpuTier, selectedGpuTier, selectedRamGb, resolutionPreset]);

  // Find the closest prebuilt system that can run this game smoothly
  const recommendedSystem = useMemo(() => {
    return systems
      .filter((s) => s.gpuTier >= selectedGame.recGpuTier && s.cpuTier >= selectedGame.recCpuTier)
      .sort((a, b) => a.price - b.price)[0] || systems[0];
  }, [systems, selectedGame]);

  const gpus = hardwareList.filter((h) => h.type === "gpu");
  const cpus = hardwareList.filter((h) => h.type === "cpu");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Gerçek Oyun Motoru Benchmark Simülasyonu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            FPS &amp; &quot;Kaldırır Mı?&quot; Test Motoru
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            İstediğin oyunu ve donanımını seç; sistem sana beklenen ortalama FPS&apos;i, %1 düşük FPS&apos;i ve olası darboğazı anında hesaplasın.
          </p>
        </div>

        {activeSystemName && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="text-xs">
              <span className="text-neutral-400 block text-[10px]">Test Edilen Hazır Kasa:</span>
              <span className="text-emerald-400 font-bold">{activeSystemName}</span>
            </div>
            <button
              onClick={() => {
                setActiveSystemName("");
                onClearPreselectedSystem();
              }}
              className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all cursor-pointer"
            >
              Sıfırla
            </button>
          </div>
        )}
      </div>

      {/* Game Selector Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            1. Test Edilecek Oyunu Seç:
          </span>
          <span className="text-xs text-neutral-500">{games.length} Popüler Oyun</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {games.map((game) => {
            const isSelected = game.id === selectedGameId;
            return (
              <button
                key={game.id}
                onClick={() => setSelectedGameId(game.id)}
                className={`relative flex flex-col p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden group ${
                  isSelected
                    ? "bg-gradient-to-b from-emerald-500/20 to-neutral-900 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500"
                    : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
                }`}
              >
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {game.title}
                </div>
                <div className="text-[10px] text-neutral-400 truncate mt-0.5">{game.genre}</div>
                <div className="mt-2 text-[9px] px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400 self-start border border-neutral-800">
                  {game.releaseYear}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Hardware Selector on Left, Real-Time FPS Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Hardware Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Donanım Parçalarını Ayarla
              </span>
              <span className="text-[11px] text-neutral-400">Özelleştirilebilir</span>
            </div>

            {/* Quick load from ready-built systems */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                Popüler Hazır Kasalardan Hızlı Yükle:
              </label>
              <select
                onChange={(e) => {
                  const sys = systems.find((s) => s.id === e.target.value);
                  if (sys) {
                    setSelectedCpuTier(sys.cpuTier);
                    setSelectedGpuTier(sys.gpuTier);
                    setSelectedRamGb(sys.ramSizeGb);
                    setActiveSystemName(sys.title);
                  }
                }}
                value={systems.find((s) => s.title === activeSystemName)?.id || ""}
                aria-label="Hazır kasa şablonu seçimi"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Hazır Kasa Şablonu Seç --</option>
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.seller} - {s.title} ({formatTL(s.price)})
                  </option>
                ))}
              </select>
            </div>

            {/* GPU Selector */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-emerald-400" />
                  Ekran Kartı (GPU)
                </span>
                <span className="text-emerald-400 font-bold">Güç Puanı: {selectedGpuTier}</span>
              </div>
              <select
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSelectedGpuTier(val);
                  setActiveSystemName("");
                }}
                value={selectedGpuTier}
                aria-label="Ekran kartı seçimi"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {gpus.map((g) => (
                  <option key={g.id} value={g.tier}>
                    {g.name} ({g.specsSummary})
                  </option>
                ))}
                <option value={96}>Nvidia GeForce RTX 4080 SUPER 16GB (Ultra High)</option>
                <option value={100}>Nvidia GeForce RTX 4090 24GB (God Tier)</option>
                <option value={45}>Nvidia GeForce GTX 1650 4GB (Eski Nesil Giriş)</option>
              </select>
            </div>

            {/* CPU Selector */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  İşlemci (CPU)
                </span>
                <span className="text-cyan-400 font-bold">Güç Puanı: {selectedCpuTier}</span>
              </div>
              <select
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSelectedCpuTier(val);
                  setActiveSystemName("");
                }}
                value={selectedCpuTier}
                aria-label="İşlemci seçimi"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {cpus.map((c) => (
                  <option key={c.id} value={c.tier}>
                    {c.name} ({c.specsSummary})
                  </option>
                ))}
                <option value={85}>AMD Ryzen 5 7600X (6C/12T AM5)</option>
                <option value={95}>Intel Core i9 14900KS (Amiral Gemisi)</option>
                <option value={50}>Intel Core i3 12100F (Giriş Seviye)</option>
              </select>
            </div>

            {/* RAM Selector */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <MemoryStick className="w-3.5 h-3.5 text-purple-400" />
                  Bellek (RAM)
                </span>
                <span className="text-purple-400 font-bold">{selectedRamGb} GB</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[8, 16, 32, 64].map((gb) => (
                  <button
                    key={gb}
                    onClick={() => setSelectedRamGb(gb)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedRamGb === gb
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500 shadow-sm"
                        : "bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {gb} GB
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution & Quality Preset */}
            <div className="pt-2 border-t border-neutral-800">
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Çözünürlük ve Grafik Kalitesi:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "1080p_low", label: "1080p Rekabetçi (Düşük)" },
                  { id: "1080p_ultra", label: "1080p Ultra Grafik" },
                  { id: "1440p_high", label: "1440p 2K Yüksek" },
                  { id: "4k_ultra", label: "4K Ultra / Ray Tracing" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setResolutionPreset(item.id as ResolutionPreset)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                      resolutionPreset === item.id
                        ? "bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20"
                        : "bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live FPS Output Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-900/95 border border-neutral-800 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <span className="text-xs text-neutral-400 block">Hesaplanan Oyun Motoru:</span>
                <span className="text-base font-bold text-white flex items-center gap-2">
                  {selectedGame.title}
                  <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-normal">
                    {resolutionPreset.replace("_", " ").toUpperCase()}
                  </span>
                </span>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-bold border ${calculation.verdict.badgeColor}`}
              >
                {calculation.verdict.label}
              </div>
            </div>

            {/* Giant FPS Counter */}
            <div className="grid grid-cols-2 gap-4 text-center p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Beklenen Ortalama FPS
                </div>
                <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  {calculation.avgFps}
                </div>
                <div className="text-[11px] text-neutral-500">Ortalama Kare Hızı</div>
              </div>

              <div className="space-y-1 border-l border-neutral-800 pl-4">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  %1 En Düşük FPS (Akıcılık)
                </div>
                <div className="text-5xl sm:text-6xl font-black text-neutral-300">
                  {calculation.lowFps}
                </div>
                <div className="text-[11px] text-neutral-500">Takılma &amp; Ani Düşüş Göstergesi</div>
              </div>
            </div>

            {/* Verdict Explanation */}
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed">
              <span className="font-bold text-white block mb-1">Oynanış Değerlendirmesi:</span>
              {calculation.verdict.description}
            </div>

            {/* Bottleneck Radar */}
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  Donanım Darboğazı (Bottleneck) Analizi
                </span>
                <span
                  className={`font-semibold ${
                    calculation.bottleneckComponent === "balanced"
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {calculation.bottleneckComponent === "balanced"
                    ? "Dengeli Sistem (Sıfır Darboğaz)"
                    : `%${calculation.bottleneckPercentage} ${
                        calculation.bottleneckComponent === "cpu"
                          ? "İşlemci Darboğazı"
                          : calculation.bottleneckComponent === "gpu"
                          ? "Ekran Kartı Darboğazı"
                          : "RAM Darboğazı"
                      }`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    calculation.bottleneckComponent === "balanced"
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.max(10, calculation.bottleneckPercentage * 2)}%` }}
                />
              </div>

              <div className="flex items-start gap-2 text-[11px] text-neutral-400 pt-1">
                {calculation.bottleneckComponent === "balanced" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span>{calculation.recommendedUpgrade}</span>
              </div>
            </div>

            {/* Recommended Matching Pre-Built Rig (The Monetization Bridge!) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-950 to-neutral-900 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Bu Oyunu Uçuracak En İyi F/P Hazır Kasa:
                </span>
                <span className="text-xs font-black text-white">{formatTL(recommendedSystem.price)}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="text-xs">
                  <div className="font-bold text-white">{recommendedSystem.title}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {recommendedSystem.gpu} • {recommendedSystem.cpu}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectSystemForPurchase(recommendedSystem)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-all cursor-pointer"
                  >
                    Detaylar
                  </button>
                  <a
                    href={recommendedSystem.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center gap-1 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <span>Satın Al</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
