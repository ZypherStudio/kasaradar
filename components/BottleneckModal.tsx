"use client";

import React, { useState, useMemo } from "react";
import {
  POPULAR_CPUS,
  POPULAR_GPUS,
  calculateBottleneck,
  BottleneckAnalysisResult
} from "@/lib/hardwareBenchmarkData";
import { PrebuiltSystem } from "@/lib/types";
import {
  Activity,
  X,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Cpu,
  Tv,
  Monitor,
  Gamepad2,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
  TrendingDown,
  ExternalLink,
  Flame
} from "lucide-react";

interface BottleneckModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: PrebuiltSystem[];
  onSelectSystemDetail?: (system: PrebuiltSystem) => void;
}

export const BottleneckModal: React.FC<BottleneckModalProps> = ({
  isOpen,
  onClose,
  systems,
  onSelectSystemDetail
}) => {
  const [selectedCpuId, setSelectedCpuId] = useState<string>("r5-5600");
  const [selectedGpuId, setSelectedGpuId] = useState<string>("rtx-4060");
  const [resolution, setResolution] = useState<"1080p" | "1440p" | "2160p">("1080p");
  const [gameType, setGameType] = useState<"esports" | "aaa">("esports");
  const [copiedText, setCopiedText] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedCpu = POPULAR_CPUS.find((c) => c.id === selectedCpuId) || POPULAR_CPUS[0];
  const selectedGpu = POPULAR_GPUS.find((g) => g.id === selectedGpuId) || POPULAR_GPUS[0];

  const analysis: BottleneckAnalysisResult = useMemo(() => {
    return calculateBottleneck(selectedCpuId, selectedGpuId, resolution, gameType);
  }, [selectedCpuId, selectedGpuId, resolution, gameType]);

  // Systems matching the GPU
  const matchingSystems = useMemo(() => {
    return systems
      .filter((s) => s.gpu.toLowerCase().includes(selectedGpu.name.split(" ")[2]?.toLowerCase() || "4060"))
      .slice(0, 2);
  }, [systems, selectedGpu]);

  const handlePreset = (cpu: string, gpu: string, res: "1080p" | "1440p") => {
    setSelectedCpuId(cpu);
    setSelectedGpuId(gpu);
    setResolution(res);
  };

  const handleShare = () => {
    const text = `⚡ KASARADAR DARBOĞAZ (BOTTLENECK) TESTİ
İşlemci: ${selectedCpu.name}
Ekran Kartı: ${selectedGpu.name}
Çözünürlük: ${resolution} (${gameType === "esports" ? "Espor" : "AAA"})
Darboğaz Oranı: %${analysis.bottleneckPercent} (${analysis.statusText})
${analysis.sourceText}

Tavsiye: ${analysis.recommendation}

Canlı darboğaz testi yap: https://www.kasaradar.com#darbogaz`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    }
  };

  const getStatusColor = () => {
    if (analysis.status === "perfect") return "#10b981"; // emerald
    if (analysis.status === "acceptable") return "#eab308"; // amber
    return "#ef4444"; // rose
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all active:scale-95 cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Geri Dön"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Geri</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  Darboğaz (Bottleneck) Hesaplayıcı
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold uppercase tracking-wider">
                    Uyum Testi
                  </span>
                </h2>
                <p className="text-[11px] text-neutral-400 hidden sm:block">
                  İşlemci ve ekran kartının ne kadar uyumlu çalıştığını ve olası FPS kaybını hesapla!
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          {/* Presets */}
          <div>
            <div className="text-xs text-neutral-400 mb-2 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Popüler İkilileri Test Et:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                onClick={() => handlePreset("r5-3600", "rtx-4070-super", "1080p")}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition-all cursor-pointer"
              >
                🔴 Ryzen 5 3600 + RTX 4070 S (%28 Darboğaz)
              </button>
              <button
                onClick={() => handlePreset("r5-5600", "rtx-4060", "1080p")}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-all cursor-pointer"
              >
                🟢 Ryzen 5 5600 + RTX 4060 (%3 Uyumlu)
              </button>
              <button
                onClick={() => handlePreset("r5-7500f", "rtx-4070-super", "1440p")}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-all cursor-pointer"
              >
                🟢 Ryzen 5 7500F + RTX 4070 S (%2 Uyumlu)
              </button>
              <button
                onClick={() => handlePreset("i3-12100f", "rtx-4060-ti", "1080p")}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition-all cursor-pointer"
              >
                🔴 i3 12100F + RTX 4060 Ti (%22 Darboğaz)
              </button>
            </div>
          </div>

          {/* Selection Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-neutral-950/70 p-3.5 sm:p-4 rounded-2xl border border-neutral-800">
            {/* CPU Select */}
            <div>
              <label className="text-xs text-neutral-400 font-semibold mb-1 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-sky-400" /> İşlemci:
              </label>
              <select
                value={selectedCpuId}
                onChange={(e) => setSelectedCpuId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {POPULAR_CPUS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.cores})
                  </option>
                ))}
              </select>
            </div>

            {/* GPU Select */}
            <div>
              <label className="text-xs text-neutral-400 font-semibold mb-1 flex items-center gap-1">
                <Tv className="w-3.5 h-3.5 text-emerald-400" /> Ekran Kartı:
              </label>
              <select
                value={selectedGpuId}
                onChange={(e) => setSelectedGpuId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {POPULAR_GPUS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.vramGb}GB)
                  </option>
                ))}
              </select>
            </div>

            {/* Resolution Selector */}
            <div>
              <label className="text-xs text-neutral-400 font-semibold mb-1 flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-amber-400" /> Çözünürlük:
              </label>
              <div className="grid grid-cols-3 gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-700">
                <button
                  onClick={() => setResolution("1080p")}
                  className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    resolution === "1080p" ? "bg-cyan-500 text-neutral-950" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  1080p
                </button>
                <button
                  onClick={() => setResolution("1440p")}
                  className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    resolution === "1440p" ? "bg-cyan-500 text-neutral-950" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  2K
                </button>
                <button
                  onClick={() => setResolution("2160p")}
                  className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    resolution === "2160p" ? "bg-cyan-500 text-neutral-950" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  4K
                </button>
              </div>
            </div>

            {/* Game Type Selector */}
            <div>
              <label className="text-xs text-neutral-400 font-semibold mb-1 flex items-center gap-1">
                <Gamepad2 className="w-3.5 h-3.5 text-purple-400" /> Oyun Türü:
              </label>
              <div className="grid grid-cols-2 gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-700">
                <button
                  onClick={() => setGameType("esports")}
                  className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    gameType === "esports" ? "bg-purple-500 text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  🎯 Espor
                </button>
                <button
                  onClick={() => setGameType("aaa")}
                  className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    gameType === "aaa" ? "bg-purple-500 text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  🎮 AAA Oyun
                </button>
              </div>
            </div>
          </div>

          {/* RESULTS CARD */}
          <div
            className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 border overflow-hidden transition-all shadow-2xl"
            style={{
              backgroundColor: "#0a0a0a",
              borderColor: getStatusColor() + "55"
            }}
          >
            {/* Background Glow */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: getStatusColor() }}
            />

            {/* Header of Report */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-black text-neutral-950 shadow-lg shrink-0"
                  style={{ backgroundColor: getStatusColor() }}
                >
                  <span className="text-xl sm:text-2xl leading-none">%{analysis.bottleneckPercent}</span>
                  <span className="text-[9px] uppercase tracking-tighter font-extrabold mt-0.5">Darboğaz</span>
                </div>
                <div>
                  <div
                    className="text-xs sm:text-sm font-extrabold tracking-wider uppercase"
                    style={{ color: getStatusColor() }}
                  >
                    {analysis.statusText}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    {selectedCpu.name} &amp; {selectedGpu.name}
                  </h3>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {resolution} Çözünürlük • {gameType === "esports" ? "Espor (CS2, Valo)" : "AAA Ağır Oyunlar"}
                  </div>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-neutral-700 cursor-pointer shrink-0"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Sonuç Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Discord / WhatsApp İçin Kopyala</span>
                  </>
                )}
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block mb-0.5">Darboğaz Kaynağı</span>
                <span className="text-xs sm:text-sm font-bold text-white leading-tight block">
                  {analysis.bottleneckSource === "cpu"
                    ? "İşlemci (CPU)"
                    : analysis.bottleneckSource === "gpu"
                    ? "Ekran Kartı (GPU)"
                    : "Mükemmel Denge"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block mb-0.5">Tahmini FPS Kaybı</span>
                <span
                  className="text-xs sm:text-sm font-bold leading-tight block"
                  style={{ color: getStatusColor() }}
                >
                  {analysis.estimatedFpsLoss === 0
                    ? "%0 (Kayıp Yok)"
                    : `~%${analysis.estimatedFpsLoss} FPS Kaybı`}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block mb-0.5">Önerilen Çözünürlük</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400 leading-tight block">
                  {selectedGpu.tier >= 85 ? "2K (1440p) veya 4K" : "1080p (FHD)"}
                </span>
              </div>
            </div>

            {/* Explanation & Expert Advice */}
            <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80 space-y-2">
              <div className="text-xs text-neutral-400 font-semibold">{analysis.sourceText}</div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                {analysis.recommendation}
              </p>
            </div>

            {/* Watermark for viral screenshots */}
            <div className="mt-3 pt-2 flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-900">
              <span>Test Algoritması: KasaRadar Hardware Bench v2.0</span>
              <span className="font-bold text-neutral-400">kasaradar.com • Canlı Donanım Ekspertizi</span>
            </div>
          </div>

          {/* Matching Prebuilt Systems on KasaRadar */}
          {matchingSystems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <span>Bu Ekran Kartına Sahip Dengeli KasaRadar Sistemleri:</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingSystems.map((sys) => (
                  <div
                    key={sys.id}
                    className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">{sys.seller}</div>
                      <div className="text-xs font-bold text-white line-clamp-1">{sys.title}</div>
                      <div className="text-[11px] text-neutral-400">
                        {sys.gpu} • {sys.cpu}
                      </div>
                      <div className="text-sm font-black text-white mt-1">
                        {sys.price.toLocaleString("tr-TR")} TL
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectSystemDetail) onSelectSystemDetail(sys);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
                    >
                      <span>İncele</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Mobile Back Bar */}
        <div className="px-4 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kapat ve Kasalara Dön</span>
          </button>
        </div>
      </div>
    </div>
  );
};
