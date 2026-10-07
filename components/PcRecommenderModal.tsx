"use client";

import React, { useState, useMemo } from "react";
import { PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  Sparkles,
  X,
  Target,
  Trophy,
  Zap,
  CheckCircle2,
  Cpu,
  Tv,
  ArrowRight,
  RotateCcw,
  Sliders,
  DollarSign,
  Gamepad2,
  ExternalLink,
  Flame,
  Award,
  Layers
} from "lucide-react";

interface PcRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: PrebuiltSystem[];
  onSelectSystemForFps: (system: PrebuiltSystem) => void;
  onSelectSystemDetail: (system: PrebuiltSystem) => void;
}

type BudgetRange = "entry" | "mid" | "high" | "ultra";
type GamingGoal = "esports" | "aaa" | "streaming" | "futureproof";
type PriorityChoice = "fps" | "cooling" | "best_value";

export const PcRecommenderModal: React.FC<PcRecommenderModalProps> = ({
  isOpen,
  onClose,
  systems,
  onSelectSystemForFps,
  onSelectSystemDetail
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange>("mid");
  const [selectedGoal, setSelectedGoal] = useState<GamingGoal>("esports");
  const [selectedPriority, setSelectedPriority] = useState<PriorityChoice>("best_value");
  const [customMaxPrice, setCustomMaxPrice] = useState<number>(35000);

  // Recommendations calculation
  const recommendations = useMemo(() => {
    let budgetMin = 15000;
    let budgetMax = 30000;

    if (selectedBudget === "entry") {
      budgetMin = 15000;
      budgetMax = 25000;
    } else if (selectedBudget === "mid") {
      budgetMin = 25000;
      budgetMax = 38000;
    } else if (selectedBudget === "high") {
      budgetMin = 38000;
      budgetMax = 55000;
    } else {
      budgetMin = 55000;
      budgetMax = 150000;
    }

    // Filter systems within or near the range
    const inRange = systems.filter(
      (s) => s.price >= budgetMin * 0.85 && s.price <= budgetMax * 1.15
    );

    const scored = (inRange.length > 0 ? inRange : systems).map((s) => {
      let score = s.fpScore * 10;

      // Bonus based on goal
      if (selectedGoal === "esports" && (s.cpu.includes("5600") || s.cpu.includes("7500F") || s.cpu.includes("7800X3D"))) {
        score += 15;
      }
      if (selectedGoal === "aaa" && (s.gpu.includes("4070") || s.gpu.includes("7800") || s.gpu.includes("4060 Ti"))) {
        score += 15;
      }
      if (selectedGoal === "futureproof" && s.ramType === "DDR5") {
        score += 20;
      }
      if (selectedGoal === "streaming" && s.gpu.includes("RTX")) {
        score += 12; // NVENC encoder bonus
      }

      // Bonus based on priority
      if (selectedPriority === "best_value") {
        const savingsPct = ((s.individualZeroPrice - s.price) / s.individualZeroPrice) * 100;
        score += savingsPct * 0.8;
      } else if (selectedPriority === "fps") {
        score += s.gpuTier * 0.2 + s.cpuTier * 0.15;
      }

      return { system: s, finalScore: score };
    });

    scored.sort((a, b) => b.finalScore - a.finalScore);

    return {
      champion: scored[0]?.system || systems[0],
      runnerUp: scored[1]?.system || systems[1],
      powerUpgrade: scored[2]?.system || systems[2]
    };
  }, [systems, selectedBudget, selectedGoal, selectedPriority]);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
    setSelectedBudget("mid");
    setSelectedGoal("esports");
    setSelectedPriority("best_value");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-emerald-500/40 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl space-y-6 my-8">
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>Akıllı Sistem Sihirbazı • 3 Saniyede PC Bul</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Bütçene ve Oyununa En Uygun Kasayı Bulalım!
          </h3>
          <p className="text-xs text-neutral-400">
            Kararsız mı kaldın? 3 soruda ihtiyacını belirle; 16 mağazadaki yüzlerce kasa arasından en mantıklı kasayı önüne serelim.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between gap-2 border-y border-neutral-800/80 py-3 text-xs font-semibold">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              step === 1 ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>1. Bütçe</span>
          </button>
          <span className="text-neutral-600">→</span>
          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              step === 2 ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>2. Oyun Tercihi</span>
          </button>
          <span className="text-neutral-600">→</span>
          <button
            onClick={() => setStep(3)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              step === 3 ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>3. Sonuç &amp; Öneriler</span>
          </button>
        </div>

        {/* STEP 1: Bütçe Seçimi */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Ayırdığın bütçe aralığı nedir?</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedBudget("entry")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedBudget === "entry"
                    ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/40"
                    : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="font-bold text-white text-sm">F/P Başlangıç</div>
                <div className="text-emerald-400 font-extrabold text-base mt-0.5">15.000 TL - 25.000 TL</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  1080p Espor (CS2, Valorant, GTA 5) akıcı oyun deneyimi
                </div>
              </button>

              <button
                onClick={() => setSelectedBudget("mid")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedBudget === "mid"
                    ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/40"
                    : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="font-bold text-white text-sm">Orta Segment (En Popüler)</div>
                <div className="text-emerald-400 font-extrabold text-base mt-0.5">25.000 TL - 38.000 TL</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  RTX 4060 / 4060 Ti ve DDR5 AM5 sistemler, Ultra grafikler
                </div>
              </button>

              <button
                onClick={() => setSelectedBudget("high")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedBudget === "high"
                    ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/40"
                    : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="font-bold text-white text-sm">Üst Düzey Performans</div>
                <div className="text-emerald-400 font-extrabold text-base mt-0.5">38.000 TL - 55.000 TL</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  RTX 4070 Super / 7800 XT, 2K (1440p) 144Hz canavarı
                </div>
              </button>

              <button
                onClick={() => setSelectedBudget("ultra")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedBudget === "ultra"
                    ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/40"
                    : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="font-bold text-white text-sm">Ultra &amp; Geleceğe Yatırım</div>
                <div className="text-emerald-400 font-extrabold text-base mt-0.5">55.000 TL ve Üzeri</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  RTX 4070 Ti Super / 4080 Super / 7800X3D, 4K ve render
                </div>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>İleri: Oyun Tercihi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Oyun ve Kullanım Amacı */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>Bu bilgisayarda en çok ne yapacaksın?</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedGoal("esports")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedGoal === "esports"
                    ? "bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/40"
                    : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="font-bold text-white text-sm">🏆 Espor &amp; FPS Oyunları</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Valorant, CS2, LoL, PUBG. Öncelik: İşlemci hızı ve yüksek 240+ FPS.
                </div>
              </button>

              <button
                onClick={() => setSelectedGoal("aaa")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedGoal === "aaa"
                    ? "bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/40"
                    : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="font-bold text-white text-sm">🔥 AAA Hikayeli Grafikli Oyunlar</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Cyberpunk, Black Myth Wukong, RDR2, GTA 6. Öncelik: Ekran kartı VRAM ve Ray Tracing.
                </div>
              </button>

              <button
                onClick={() => setSelectedGoal("futureproof")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedGoal === "futureproof"
                    ? "bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/40"
                    : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="font-bold text-white text-sm">⚡ DDR5 / AM5 Geleceğe Yatırım</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  4-5 yıl boyunca parça değiştirmeden güncel kalacak modern soket yapısı.
                </div>
              </button>

              <button
                onClick={() => setSelectedGoal("streaming")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedGoal === "streaming"
                    ? "bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/40"
                    : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="font-bold text-white text-sm">🎙️ Yayın &amp; Video Kurgu</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Twitch yayını açma, Premiere Pro / After Effects ile 4K render alma.
                </div>
              </button>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs cursor-pointer"
              >
                Geri
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>Sistemleri Göster!</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Öneriler Vitrini */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>KasaRadar Algoritması Senin İçin 3 Kasayı Seçti:</span>
              </h4>
              <button
                onClick={handleReset}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Tekrar Başlat</span>
              </button>
            </div>

            {/* 1. Şampiyon Seçim (Champion Card) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-950 to-neutral-950 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-neutral-950 font-black text-xs flex items-center gap-1.5 shadow">
                  <Award className="w-3.5 h-3.5" />
                  <span>🥇 EN MANTIKLI KASA (ŞAMPİYON SEÇİM)</span>
                </span>
                <span className="text-xs text-emerald-400 font-bold">
                  F/P Skoru: {recommendations.champion.fpScore} / 10
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                <div>
                  <h5 className="text-base font-black text-white">
                    {recommendations.champion.title}
                  </h5>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <span className="text-white font-semibold">{recommendations.champion.seller}</span>
                    <span>•</span>
                    <span className="text-cyan-400">{recommendations.champion.targetResolution}</span>
                    <span>•</span>
                    <span className="text-amber-400">{recommendations.champion.ramType}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xl font-black text-emerald-400">
                    {formatTL(recommendations.champion.price)}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Ayrı toplasan: {formatTL(recommendations.champion.individualZeroPrice)}
                  </div>
                </div>
              </div>

              {/* Hardware Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block">GPU</span>
                  <span className="font-bold text-white truncate block">{recommendations.champion.gpu}</span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block">CPU</span>
                  <span className="font-bold text-white truncate block">{recommendations.champion.cpu}</span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block">RAM</span>
                  <span className="font-semibold text-neutral-300 truncate block">{recommendations.champion.ram}</span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 block">SSD</span>
                  <span className="font-semibold text-neutral-300 truncate block">{recommendations.champion.ssd}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800/80">
                <button
                  onClick={() => {
                    onSelectSystemDetail(recommendations.champion);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <span>Detayları ve Fiyat Grafiğini Gör</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    onSelectSystemForFps(recommendations.champion);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-semibold text-xs flex items-center gap-1.5 border border-neutral-700 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>FPS Testine Gönder</span>
                </button>
                <a
                  href={recommendations.champion.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs flex items-center gap-1.5 border border-neutral-700 transition-all cursor-pointer ml-auto"
                >
                  <span>Mağazada İncele</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 2. Alternatif Seçimler Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Runner Up */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-cyan-400 uppercase">
                    🥈 Bütçe Dostu Alternatif
                  </span>
                  <span className="text-xs font-bold text-white">
                    {formatTL(recommendations.runnerUp.price)}
                  </span>
                </div>
                <h6 className="text-xs font-bold text-neutral-200 line-clamp-1">
                  {recommendations.runnerUp.title}
                </h6>
                <p className="text-[11px] text-neutral-400">
                  {recommendations.runnerUp.gpu} • {recommendations.runnerUp.cpu}
                </p>
                <button
                  onClick={() => {
                    onSelectSystemDetail(recommendations.runnerUp);
                    onClose();
                  }}
                  className="w-full py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold border border-neutral-800 transition-colors cursor-pointer"
                >
                  Bu Kasayı İncele
                </button>
              </div>

              {/* Power Upgrade */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-amber-400 uppercase">
                    🥉 Bir Tık Üst Güçlü Seçenek
                  </span>
                  <span className="text-xs font-bold text-white">
                    {formatTL(recommendations.powerUpgrade.price)}
                  </span>
                </div>
                <h6 className="text-xs font-bold text-neutral-200 line-clamp-1">
                  {recommendations.powerUpgrade.title}
                </h6>
                <p className="text-[11px] text-neutral-400">
                  {recommendations.powerUpgrade.gpu} • {recommendations.powerUpgrade.cpu}
                </p>
                <button
                  onClick={() => {
                    onSelectSystemDetail(recommendations.powerUpgrade);
                    onClose();
                  }}
                  className="w-full py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold border border-neutral-800 transition-colors cursor-pointer"
                >
                  Bu Kasayı İncele
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
