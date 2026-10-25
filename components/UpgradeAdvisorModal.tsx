"use client";

import React, { useState, useMemo } from "react";
import {
  POPULAR_CPUS,
  POPULAR_GPUS,
  BenchmarkCpu,
  BenchmarkGpu
} from "@/lib/hardwareBenchmarkData";
import { formatTL } from "@/lib/calculator";
import {
  Zap,
  TrendingUp,
  Cpu,
  Tv,
  Coins,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  X,
  ExternalLink,
  Sliders,
  DollarSign,
  CheckCircle2,
  Share2,
  Copy,
  Check
} from "lucide-react";

interface UpgradeAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeAdvisorModal: React.FC<UpgradeAdvisorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentCpuId, setCurrentCpuId] = useState<string>("r5-3600");
  const [currentGpuId, setCurrentGpuId] = useState<string>("gtx-1650");
  const [currentRam, setCurrentRam] = useState<number>(8);
  const [currentPsu, setCurrentPsu] = useState<number>(500);
  const [budget, setBudget] = useState<number>(7500);
  const [goal, setGoal] = useState<"esports" | "aaa" | "general">("esports");
  const [copiedPlan, setCopiedPlan] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentCpu = POPULAR_CPUS.find((c) => c.id === currentCpuId) || POPULAR_CPUS[0];
  const currentGpu = POPULAR_GPUS.find((g) => g.id === currentGpuId) || POPULAR_GPUS[0];

  // AI Upgrade Engine Calculation
  const upgradePlan = useMemo(() => {
    // 1. Resale value of current components
    const gpuResale = Math.round(currentGpu.priceAvg * 0.85);
    const cpuResale = Math.round(currentCpu.priceAvg * 0.82);

    let effectiveBudget = budget;

    // Diagnose primary bottleneck
    const cpuTier = currentCpu.tier;
    const gpuTier = currentGpu.tier;
    const isGpuWeakest = gpuTier <= cpuTier;

    let targetUpgradeGpu: BenchmarkGpu | null = null;
    let targetUpgradeCpu: BenchmarkCpu | null = null;
    let needsRamUpgrade = currentRam < 16;
    let ramCost = needsRamUpgrade ? 850 : 0;

    let totalGpuCost = 0;
    let totalCpuCost = 0;

    // Strategy based on budget and goals
    if (goal === "esports") {
      // Esports loves strong CPU + decent GPU
      if (cpuTier < 65 && budget >= 4000) {
        // Upgrade CPU to R5 5600 or 7500F
        targetUpgradeCpu = POPULAR_CPUS.find((c) => c.id === "r5-5600") || null;
        totalCpuCost = targetUpgradeCpu ? targetUpgradeCpu.priceAvg : 0;
      }
      // If remaining budget allows GPU upgrade
      const budgetForGpu = budget - totalCpuCost - ramCost + gpuResale;
      if (budgetForGpu >= 6000) {
        targetUpgradeGpu = POPULAR_GPUS.find((g) => g.id === "rx-6600") || POPULAR_GPUS[0];
        if (budgetForGpu >= 11500) {
          targetUpgradeGpu = POPULAR_GPUS.find((g) => g.id === "rtx-4060") || targetUpgradeGpu;
        }
        totalGpuCost = targetUpgradeGpu ? targetUpgradeGpu.priceAvg : 0;
      }
    } else {
      // AAA and General: GPU is king
      const availableGpuBudget = budget - ramCost + gpuResale;
      if (availableGpuBudget >= 24000) {
        targetUpgradeGpu = POPULAR_GPUS.find((g) => g.id === "rtx-4070-super") || null;
      } else if (availableGpuBudget >= 15000) {
        targetUpgradeGpu = POPULAR_GPUS.find((g) => g.id === "rtx-4060-ti") || null;
      } else if (availableGpuBudget >= 11500) {
        targetUpgradeGpu = POPULAR_GPUS.find((g) => g.id === "rtx-4060") || null;
      } else if (availableGpuBudget >= 6500) {
        targetUpgradeGpu = POPULAR_GPUS.find((g) => g.id === "rx-6600") || null;
      }
      totalGpuCost = targetUpgradeGpu ? targetUpgradeGpu.priceAvg : 0;

      // If CPU is severely holding back
      if (cpuTier < 50 && budget - totalGpuCost + cpuResale >= 3500) {
        targetUpgradeCpu = POPULAR_CPUS.find((c) => c.id === "r5-5600") || null;
        totalCpuCost = targetUpgradeCpu ? targetUpgradeCpu.priceAvg : 0;
      }
    }

    // Default fallback if no upgrade found in exact budget: suggest best single step
    if (!targetUpgradeGpu && !targetUpgradeCpu && !needsRamUpgrade) {
      if (isGpuWeakest) {
        targetUpgradeGpu = POPULAR_GPUS.find((g) => g.tier > gpuTier + 15) || POPULAR_GPUS[7];
        totalGpuCost = targetUpgradeGpu.priceAvg;
      } else {
        targetUpgradeCpu = POPULAR_CPUS.find((c) => c.tier > cpuTier + 15) || POPULAR_CPUS[3];
        totalCpuCost = targetUpgradeCpu.priceAvg;
      }
    }

    // Performance increase estimation
    const oldScore = cpuTier * 0.4 + gpuTier * 0.6;
    const newCpuTier = targetUpgradeCpu ? targetUpgradeCpu.tier : cpuTier;
    const newGpuTier = targetUpgradeGpu ? targetUpgradeGpu.tier : gpuTier;
    const newScore = newCpuTier * 0.4 + newGpuTier * 0.6;
    const fpsIncreasePct = Math.max(15, Math.round(((newScore - oldScore) / oldScore) * 100));

    // Resale total deduction
    let totalSpent = totalGpuCost + totalCpuCost + ramCost;
    let totalResaleRecovered = (targetUpgradeGpu ? gpuResale : 0) + (targetUpgradeCpu ? cpuResale : 0);
    let netOutOfPocket = Math.max(0, totalSpent - totalResaleRecovered);

    // PSU Compatibility Check
    const estimatedNewTdp = (newGpuTier > 85 ? 250 : newGpuTier > 70 ? 170 : 120) + (newCpuTier > 80 ? 105 : 65) + 60;
    const isPsuSufficient = currentPsu >= estimatedNewTdp + 100;

    return {
      targetGpu: targetUpgradeGpu,
      targetCpu: targetUpgradeCpu,
      needsRamUpgrade,
      ramCost,
      totalSpent,
      totalResaleRecovered,
      netOutOfPocket,
      fpsIncreasePct,
      isPsuSufficient,
      estimatedNewTdp,
      oldGpuResale: gpuResale,
      oldCpuResale: cpuResale
    };
  }, [currentCpu, currentGpu, currentRam, currentPsu, budget, goal]);

  const handleCopyPlan = () => {
    const text = `🚀 KasaRadar Yükseltme Planım:
Mevcut: ${currentCpu.name} • ${currentGpu.name} (${currentRam}GB RAM)
🎯 Hedef: ${goal === "esports" ? "Espor 240Hz" : "AAA Ultra Grafikler"}
💡 Önerilen Yükseltme: ${upgradePlan.targetGpu ? upgradePlan.targetGpu.name : ""} ${upgradePlan.targetCpu ? "+ " + upgradePlan.targetCpu.name : ""} ${upgradePlan.needsRamUpgrade ? "+ 16GB RAM" : ""}
⚡ Beklenen FPS Artışı: +%${upgradePlan.fpsIncreasePct}
💰 Net Cebimden Çıkan: ${formatTL(upgradePlan.netOutOfPocket)} (Eski parçalar satıldıktan sonra)
🔗 https://kasaradar.com`;

    navigator.clipboard.writeText(text);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-neutral-900 border border-neutral-800 p-5 sm:p-7 shadow-2xl space-y-6">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-lg">Sistemimi Yükselt (Upgrade Sihirbazı)</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                  Yapay Zeka
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Eski parçanı sat, bütçene en uygun parçayı tak, minimum parayla maksimum FPS al!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Input Controls */}
        <div className="space-y-4">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            1. Mevcut Bilgisayarının Özellikleri
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* CPU Select */}
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mevcut İşlemcin:</span>
              </label>
              <select
                value={currentCpuId}
                onChange={(e) => setCurrentCpuId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-cyan-500"
              >
                {POPULAR_CPUS.map((cpu) => (
                  <option key={cpu.id} value={cpu.id}>
                    {cpu.name}
                  </option>
                ))}
              </select>
            </div>

            {/* GPU Select */}
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mevcut Ekran Kartın:</span>
              </label>
              <select
                value={currentGpuId}
                onChange={(e) => setCurrentGpuId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-cyan-500"
              >
                {POPULAR_GPUS.map((gpu) => (
                  <option key={gpu.id} value={gpu.id}>
                    {gpu.name}
                  </option>
                ))}
              </select>
            </div>

            {/* RAM Select */}
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">Mevcut RAM Kapasiten:</label>
              <div className="grid grid-cols-3 gap-2">
                {[8, 16, 32].map((r) => (
                  <button
                    key={r}
                    onClick={() => setCurrentRam(r)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentRam === r
                        ? "bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20"
                        : "bg-neutral-900 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {r} GB
                  </button>
                ))}
              </div>
            </div>

            {/* PSU Select */}
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">Güç Kaynağın (PSU):</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[450, 500, 650, 750].map((w) => (
                  <button
                    key={w}
                    onClick={() => setCurrentPsu(w)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPsu === w
                        ? "bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20"
                        : "bg-neutral-900 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {w}W
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Budget & Goals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              2. Yükseltme Bütçen &amp; Hedefin
            </span>
            <span className="text-base font-black text-emerald-400">{formatTL(budget)}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[3500, 5000, 7500, 10000, 15000, 22000].map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  budget === b
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                    : "bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white"
                }`}
              >
                {formatTL(b)}
              </button>
            ))}
          </div>

          {/* Goal Selector */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => setGoal("esports")}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                goal === "esports"
                  ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold"
                  : "bg-neutral-950 border-neutral-800/80 text-neutral-400"
              }`}
            >
              <span className="text-xs font-bold block">⚡ CS2 &amp; Valorant</span>
              <span className="text-[10px] text-neutral-500">240Hz+ Akıcılık</span>
            </button>

            <button
              onClick={() => setGoal("aaa")}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                goal === "aaa"
                  ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold"
                  : "bg-neutral-950 border-neutral-800/80 text-neutral-400"
              }`}
            >
              <span className="text-xs font-bold block">🎮 Cyberpunk &amp; GTA</span>
              <span className="text-[10px] text-neutral-500">Yüksek Ayar &amp; RT</span>
            </button>

            <button
              onClick={() => setGoal("general")}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                goal === "general"
                  ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold"
                  : "bg-neutral-950 border-neutral-800/80 text-neutral-400"
              }`}
            >
              <span className="text-xs font-bold block">🌟 Genel F/P Zirvesi</span>
              <span className="text-[10px] text-neutral-500">Dengeli Sistem</span>
            </button>
          </div>
        </div>

        {/* 3. AI Master Upgrade Plan Output */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-cyan-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white text-sm">Yapay Zeka Tavsiye Planı</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+%{upgradePlan.fpsIncreasePct} FPS Artışı</span>
            </div>
          </div>

          {/* Action Steps */}
          <div className="space-y-2.5 text-xs">
            {/* Step 1: GPU */}
            {upgradePlan.targetGpu && (
              <div className="flex items-start justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                    1. Öncelikli Adım: Ekran Kartı Değişimi
                  </span>
                  <div className="font-bold text-white text-sm">
                    {upgradePlan.targetGpu.name}
                  </div>
                  <div className="text-neutral-400 text-[11px]">
                    Eski {currentGpu.name} kartını sarı sitede ~{formatTL(upgradePlan.oldGpuResale)}&apos;ye satabilirsin.
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-white block">
                    {formatTL(upgradePlan.targetGpu.priceAvg)}
                  </span>
                  <a
                    href={`https://www.akakce.com/arama/?q=${encodeURIComponent(upgradePlan.targetGpu.name.split(" ").slice(0, 4).join(" "))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:underline font-bold inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>Fiyat Ara</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Step 2: CPU */}
            {upgradePlan.targetCpu && (
              <div className="flex items-start justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    {upgradePlan.targetGpu ? "2." : "1."} Adım: İşlemci Değişimi
                  </span>
                  <div className="font-bold text-white text-sm">
                    {upgradePlan.targetCpu.name}
                  </div>
                  <div className="text-neutral-400 text-[11px]">
                    Eski {currentCpu.name} işlemcini ~{formatTL(upgradePlan.oldCpuResale)}&apos;ye elden çıkarabilirsin.
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-white block">
                    {formatTL(upgradePlan.targetCpu.priceAvg)}
                  </span>
                  <a
                    href={`https://www.akakce.com/arama/?q=${encodeURIComponent(upgradePlan.targetCpu.name.split(" ").slice(0, 3).join(" "))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:underline font-bold inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>Fiyat Ara</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Step 3: RAM */}
            {upgradePlan.needsRamUpgrade && (
              <div className="flex items-start justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                    Kritik Adım: RAM Çift Kanal (Dual-Channel)
                  </span>
                  <div className="font-bold text-white text-sm">
                    +8GB DDR4 RAM Ekle (Toplam 16GB)
                  </div>
                  <div className="text-neutral-400 text-[11px]">
                    8GB tek kanal RAM %25 mikro-kasmaya sebep olur. 16GB çift kanal takılmaları sıfırlar.
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-white block">~850 TL</span>
                  <a
                    href="https://www.akakce.com/arama/?q=8gb+ddr4+3200mhz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:underline font-bold inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>Fiyat Ara</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* PSU and Financial breakdown */}
          <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* PSU Health */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
              {upgradePlan.isPsuSufficient ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <div>
                <span className="font-bold text-white block">
                  {upgradePlan.isPsuSufficient
                    ? `PSU Yeterli (${currentPsu}W Güvenli)`
                    : `PSU Riskli (${currentPsu}W Yetersiz)`}
                </span>
                <span className="text-neutral-500 text-[10px]">
                  Tahmini yeni sistem yükü: ~{upgradePlan.estimatedNewTdp}W
                </span>
              </div>
            </div>

            {/* Net Cost */}
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-neutral-500 text-[10px] block">Eski Parçalar Satılınca:</span>
                <span className="text-emerald-400 font-bold text-xs">
                  Net Cebinden Çıkan:
                </span>
              </div>
              <span className="text-base font-black text-white">
                {formatTL(upgradePlan.netOutOfPocket)}
              </span>
            </div>
          </div>

          {/* Share / Copy Plan CTA */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopyPlan}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {copiedPlan ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Plan Kopyalandı! (Arkadaşına Gönder)</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Yükseltme Planını Kopyala &amp; Paylaş</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
