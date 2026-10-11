"use client";

import React, { useState, useMemo } from "react";
import {
  POPULAR_CPUS,
  POPULAR_GPUS,
  calculateKazikScore,
  KazikScoreResult
} from "@/lib/hardwareBenchmarkData";
import { PrebuiltSystem } from "@/lib/types";
import {
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Flame,
  Scale,
  Sparkles,
  ExternalLink,
  Zap,
  TrendingDown,
  TrendingUp,
  Cpu,
  Tv,
  DollarSign
} from "lucide-react";

interface KazikSayarModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: PrebuiltSystem[];
  onSelectSystemDetail?: (system: PrebuiltSystem) => void;
}

export const KazikSayarModal: React.FC<KazikSayarModalProps> = ({
  isOpen,
  onClose,
  systems,
  onSelectSystemDetail
}) => {
  const [selectedCpuId, setSelectedCpuId] = useState<string>("r5-5600");
  const [selectedGpuId, setSelectedGpuId] = useState<string>("rtx-4060");
  const [selectedRam, setSelectedRam] = useState<number>(16);
  const [selectedSsd, setSelectedSsd] = useState<number>(500);
  const [priceInput, setPriceInput] = useState<string>("27500");
  const [copiedText, setCopiedText] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPrice = Number(priceInput.replace(/\D/g, "")) || 20000;

  const result: KazikScoreResult = useMemo(() => {
    return calculateKazikScore(
      selectedCpuId,
      selectedGpuId,
      selectedRam,
      selectedSsd,
      currentPrice
    );
  }, [selectedCpuId, selectedGpuId, selectedRam, selectedSsd, currentPrice]);

  const selectedCpu = POPULAR_CPUS.find((c) => c.id === selectedCpuId) || POPULAR_CPUS[0];
  const selectedGpu = POPULAR_GPUS.find((g) => g.id === selectedGpuId) || POPULAR_GPUS[0];

  // Find better alternative systems from KasaRadar
  const betterAlternatives = useMemo(() => {
    return systems
      .filter((s) => s.price <= currentPrice * 1.05 && s.price >= currentPrice * 0.75)
      .slice(0, 2);
  }, [systems, currentPrice]);

  // Preset loaders
  const handleLoadPreset = (cpu: string, gpu: string, price: number) => {
    setSelectedCpuId(cpu);
    setSelectedGpuId(gpu);
    setPriceInput(price.toString());
  };

  const handleShareCard = () => {
    const text = `🚨 KASARADAR KASA KARNESİ / ALINIR MI? 🚨
Bileşenler: ${selectedGpu.name} + ${selectedCpu.name} (${selectedRam}GB RAM / ${selectedSsd}GB SSD)
İstenen Fiyat: ${currentPrice.toLocaleString("tr-TR")} TL
Piyasa Adil Değeri: ${result.fairMarketPrice.toLocaleString("tr-TR")} TL
Karar: [${result.grade}] ${result.gradeTitle} (${result.priceDiff >= 0 ? "+" : ""}${result.priceDiffPercent}%)

${result.summaryExplanation}

Canlı donanım ekspertizi: https://www.kasaradar.com#kazik-sayar`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    }
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
              <div className="p-1.5 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  Kazık Sayar • Fiyat Ekspertizi
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold uppercase tracking-wider">
                    Alınır Mı?
                  </span>
                </h2>
                <p className="text-[11px] text-neutral-400 hidden sm:block">
                  Sarı sitede veya mağazada gördüğün kasanın donanımını gir, kazıklanıp kazıklanmadığını anında gör!
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
          {/* Quick Preset Buttons */}
          <div>
            <div className="text-xs text-neutral-400 mb-2 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hızlı Senaryo Dene:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                onClick={() => handleLoadPreset("r5-3600", "rtx-3060", 27500)}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition-all cursor-pointer"
              >
                🔴 Sarı Sitede 27.500 TL (RTX 3060)
              </button>
              <button
                onClick={() => handleLoadPreset("r5-5600", "rtx-4060", 22999)}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-all cursor-pointer"
              >
                🟢 Kampanyalı 22.999 TL (RTX 4060)
              </button>
              <button
                onClick={() => handleLoadPreset("i5-12400f", "rtx-4060-ti", 39900)}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition-all cursor-pointer"
              >
                🔴 AVM Kasa 39.900 TL (RTX 4060 Ti)
              </button>
              <button
                onClick={() => handleLoadPreset("r5-7500f", "rtx-4070-super", 41500)}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-all cursor-pointer"
              >
                🟢 Tebilon 41.500 TL (RTX 4070 SUPER)
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-neutral-950/70 p-3.5 sm:p-4 rounded-2xl border border-neutral-800">
            {/* GPU Select */}
            <div>
              <label className="text-xs text-neutral-400 font-semibold mb-1 flex items-center gap-1">
                <Tv className="w-3.5 h-3.5 text-emerald-400" /> Ekran Kartı:
              </label>
              <select
                value={selectedGpuId}
                onChange={(e) => setSelectedGpuId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {POPULAR_GPUS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.vramGb}GB)
                  </option>
                ))}
              </select>
            </div>

            {/* CPU Select */}
            <div>
              <label className="text-xs text-neutral-400 font-semibold mb-1 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-sky-400" /> İşlemci:
              </label>
              <select
                value={selectedCpuId}
                onChange={(e) => setSelectedCpuId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {POPULAR_CPUS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* RAM & SSD */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-neutral-400 font-semibold mb-1 block">RAM:</label>
                <select
                  value={selectedRam}
                  onChange={(e) => setSelectedRam(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={16}>16 GB</option>
                  <option value={32}>32 GB</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-neutral-400 font-semibold mb-1 block">SSD:</label>
                <select
                  value={selectedSsd}
                  onChange={(e) => setSelectedSsd(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={500}>500 GB</option>
                  <option value={1000}>1 TB</option>
                  <option value={2000}>2 TB</option>
                </select>
              </div>
            </div>

            {/* Price Input */}
            <div>
              <label className="text-xs text-neutral-400 font-semibold mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> İstenen Fiyat (TL):
              </label>
              <input
                type="number"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="Örn: 27500"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* THE VIRAL RESULT CARD (KASA KARNESİ) */}
          <div
            className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 border overflow-hidden transition-all shadow-2xl"
            style={{
              backgroundColor: "#0a0a0a",
              borderColor: result.gradeColor + "55"
            }}
          >
            {/* Background Glow */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: result.gradeColor }}
            />

            {/* Top Row: Grade Badge + Headline */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl text-neutral-950 shadow-lg shrink-0"
                  style={{ backgroundColor: result.gradeColor }}
                >
                  {result.grade}
                </div>
                <div>
                  <div
                    className="text-xs sm:text-sm font-extrabold tracking-wider uppercase"
                    style={{ color: result.gradeColor }}
                  >
                    {result.gradeTitle}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-0.5 leading-snug">
                    {result.headline}
                  </h3>
                </div>
              </div>

              {/* Share & Copy Button */}
              <button
                onClick={handleShareCard}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-neutral-700 cursor-pointer shrink-0"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Karne Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Story / Discord İçin Kopyala</span>
                  </>
                )}
              </button>
            </div>

            {/* Middle: Price Comparison Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-4">
              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-0.5">İstenen Fiyat</span>
                <span className="text-xl sm:text-2xl font-black text-white">
                  {currentPrice.toLocaleString("tr-TR")} TL
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">
                  Satıcının talep ettiği tutar
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-0.5">Adil Piyasa Değeri</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">
                  {result.fairMarketPrice.toLocaleString("tr-TR")} TL
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">
                  KasaRadar Türk mağazaları piyasa rayici
                </span>
              </div>
            </div>

            {/* Explanation & Breakdown */}
            <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80 space-y-2">
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                {result.summaryExplanation}
              </p>
              <ul className="space-y-1.5 pt-1">
                {result.detailedPoints.map((pt, idx) => (
                  <li key={idx} className="text-xs text-neutral-400 flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold shrink-0">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Watermark for viral screenshots */}
            <div className="mt-3 pt-2 flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-900">
              <span>Rapor Tarihi: {new Date().toLocaleDateString("tr-TR")}</span>
              <span className="font-bold text-neutral-400">kasaradar.com • Canlı Donanım Ekspertizi</span>
            </div>
          </div>

          {/* Better Alternatives from KasaRadar */}
          {betterAlternatives.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <span>Bu Bütçeye KasaRadar&apos;da Bulunan Kelepir Alternatifler:</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {betterAlternatives.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">{alt.seller}</div>
                      <div className="text-xs font-bold text-white line-clamp-1">{alt.title}</div>
                      <div className="text-[11px] text-neutral-400">
                        {alt.gpu} • {alt.cpu}
                      </div>
                      <div className="text-sm font-black text-white mt-1">
                        {alt.price.toLocaleString("tr-TR")} TL
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectSystemDetail) onSelectSystemDetail(alt);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
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
