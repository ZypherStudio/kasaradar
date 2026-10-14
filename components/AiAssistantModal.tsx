"use client";

import React, { useState, useEffect } from "react";
import { PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  Sparkles,
  X,
  Check,
  ArrowRight,
  Zap,
  Trophy,
  ExternalLink,
  Bot,
  Send,
  MessageSquare,
  Mail,
  ShieldCheck,
  Cpu,
  Tv,
  Gamepad2,
  TrendingDown,
  Activity,
  Layers
} from "lucide-react";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: PrebuiltSystem[];
  onSelectSystem: (system: PrebuiltSystem) => void;
  onOpenEmailPreview?: (title: string, price: number, image: string, store: string) => void;
  isLoggedIn?: boolean;
  onRequireAuth?: () => void;
}

interface FpsEstimates {
  cs2: number;
  valorant: number;
  cyberpunk: number;
  gta5: number;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  systems,
  onSelectSystem,
  onOpenEmailPreview,
  isLoggedIn = false,
  onRequireAuth
}) => {
  const [budget, setBudget] = useState<number>(32000);
  const [useCase, setUseCase] = useState<"esports" | "story" | "content" | "budget">("esports");
  const [resolution, setResolution] = useState<"1080p" | "2k" | "4k">("1080p");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [analyzed, setAnalyzed] = useState<boolean>(true);
  const [aiThinking, setAiThinking] = useState<boolean>(false);

  // AI response state
  const [currentSystem, setCurrentSystem] = useState<PrebuiltSystem>(systems[0] || {} as PrebuiltSystem);
  const [aiVerdict, setAiVerdict] = useState<string>(
    "KasaRadar testlerinden 9.4/10 tam not alan, 1080p Ultra espor ve AAA oyunlarda Türkiye pazarındaki en dengeli ve kârlı hazır kasadır."
  );
  const [aiBulletPoints, setAiBulletPoints] = useState<string[]>([
    "F/P & Kâr Marjı: Parçaları tek tek perakendeden topladığında 38.400 TL tutarken, bu hazır kasada net ~5.900 TL tasarruf sağlarsın.",
    "Espor Performansı: CS2'de ortalama ~320 FPS, Valorant'ta ~420 FPS akıcılık vadeder. 144Hz / 240Hz monitörleri tam besler.",
    "AAA Oyun Grafikleri: Cyberpunk 2077 ve GTA 5'te yüksek grafik ayarlarında 85+ FPS ile sıfır takılma garantilidir.",
    "Darboğaz & Termal Denge: Ryzen 5 ve RTX 40 serisi uyumuyla %1.8 mikro darboğaz eşiğinde kalarak tam dengeli çalışır."
  ]);
  const [fpsEstimates, setFpsEstimates] = useState<FpsEstimates>({
    cs2: 320,
    valorant: 420,
    cyberpunk: 85,
    gta5: 145
  });
  const [bottleneckRate, setBottleneckRate] = useState<number>(1.8);
  const [savingsTL, setSavingsTL] = useState<number>(5900);

  // Sync initial system on mount or open
  useEffect(() => {
    if (systems && systems.length > 0 && !currentSystem.id) {
      setCurrentSystem(systems[0]);
    }
  }, [systems, currentSystem.id]);

  if (!isOpen) return null;

  const executeAiAnalysis = async (overridePrompt?: string, overrideBudget?: number) => {
    setAiThinking(true);
    const query = overridePrompt !== undefined ? overridePrompt : customPrompt;
    const targetBudget = overrideBudget !== undefined ? overrideBudget : budget;

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          budget: targetBudget,
          useCase,
          resolution
        })
      });

      const data = await res.json();
      setAiThinking(false);
      setAnalyzed(true);

      // 1. Resolve matching system
      let matchedSystem: PrebuiltSystem | undefined = undefined;
      if (data.recommendedSystem && data.recommendedSystem.id) {
        matchedSystem = systems.find((s) => s.id === data.recommendedSystem.id) || data.recommendedSystem;
      } else if (data.recommendedSystemId) {
        matchedSystem = systems.find((s) => s.id === data.recommendedSystemId);
      }

      if (!matchedSystem) {
        matchedSystem = systems.find((s) => s.price <= targetBudget * 1.15) || systems[0];
      }

      if (matchedSystem) {
        setCurrentSystem(matchedSystem);
      }

      // 2. Resolve verdict & bullets
      if (data.verdict) {
        setAiVerdict(data.verdict);
      }
      if (Array.isArray(data.bulletPoints) && data.bulletPoints.length > 0) {
        setAiBulletPoints(data.bulletPoints);
      }
      if (data.fpsEstimates) {
        setFpsEstimates(data.fpsEstimates);
      }
      if (typeof data.bottleneckPercentage === "number") {
        setBottleneckRate(data.bottleneckPercentage);
      }
      if (typeof data.savingsTL === "number") {
        setSavingsTL(data.savingsTL);
      } else if (matchedSystem) {
        setSavingsTL(Math.max(1500, (matchedSystem.individualZeroPrice || Math.round(matchedSystem.price * 1.16)) - matchedSystem.price));
      }
    } catch (e) {
      setAiThinking(false);
      setAnalyzed(true);
      const fallback = systems.find((s) => s.price <= targetBudget * 1.12) || systems[0];
      setCurrentSystem(fallback);
    }
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeAiAnalysis();
  };

  const handleSendEmailReport = () => {
    if (!isLoggedIn && onRequireAuth) {
      onRequireAuth();
      return;
    }
    if (onOpenEmailPreview && currentSystem.id) {
      onOpenEmailPreview(
        `KasaRadar AI Önerisi: ${currentSystem.title}`,
        currentSystem.price,
        currentSystem.imageUrl,
        currentSystem.seller
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 my-6 max-h-[94vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer z-10"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <Bot className="w-3.5 h-3.5" />
            <span>KasaRadar Donanım Danışmanı v2.5 • Canlı AI Motoru</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Bütçene ve Hedefine En Uygun Kasayı Bulalım
          </h3>
          <p className="text-xs text-neutral-400">
            8 mağazadaki hazır kasalar ve perakende parça fiyatları anlık taranır. Bütçeni seç veya oynamak istediğin oyunları yaz.
          </p>
        </div>

        {/* Quick Question / Prompt Form */}
        <form onSubmit={handlePromptSubmit} className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Özel İstek veya Oynamak İstediğin Oyunlar:</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Örn: 30K bütçem var CS2 ve Valorant'ta 360 FPS istiyorum..."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl pl-4 pr-11 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={aiThinking}
              className="absolute right-1.5 p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-all cursor-pointer disabled:opacity-40"
              title="Soruyu Gönder"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preset Chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {[
              { label: "🔥 20K En İyi F/P", prompt: "20.000 TL bütçe ile en iyi F/P hazır kasa", targetBudget: 22000 },
              { label: "🎯 Valorant & CS2 360 FPS", prompt: "CS2 ve Valorant rekabetçi espor için 360 FPS kasa", targetBudget: 32000 },
              { label: "🌟 2K & 4K GTA 6 Canavarı", prompt: "2K ve 4K AAA oyunlar GTA 6 ve Cyberpunk kasası", targetBudget: 48000 },
              { label: "🎥 Twitch Yayın & Video Montaj", prompt: "Yayın açmak ve Premiere montaj için 32GB RAM kasa", targetBudget: 42000 }
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setCustomPrompt(chip.prompt);
                  setBudget(chip.targetBudget);
                  executeAiAnalysis(chip.prompt, chip.targetBudget);
                }}
                className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </form>

        {/* Sliders & Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-xs">
          {/* Budget Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center font-semibold text-neutral-300">
              <span>Maksimum Bütçen:</span>
              <span className="text-emerald-400 font-bold text-sm">{formatTL(budget)}</span>
            </div>
            <input
              type="range"
              min={15000}
              max={85000}
              step={1000}
              value={budget}
              onChange={(e) => {
                const val = Number(e.target.value);
                setBudget(val);
              }}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>15.000 TL</span>
              <span>50.000 TL</span>
              <span>85.000 TL+</span>
            </div>
          </div>

          {/* Use Case Tabs */}
          <div className="space-y-1.5">
            <span className="font-semibold text-neutral-300 block">
              Kullanım Amacı:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "esports", label: "E-Spor" },
                { id: "story", label: "AAA Oyun" },
                { id: "content", label: "Yayın/İş" }
              ].map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setUseCase(u.id as any)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                    useCase === u.id
                      ? "bg-emerald-500 text-neutral-950 font-bold"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Big Action / Re-analyze Button */}
        <button
          type="button"
          onClick={() => executeAiAnalysis()}
          disabled={aiThinking}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {aiThinking ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></span>
              <span>8 Mağaza ve Donanım Parametreleri Analiz Ediliyor...</span>
            </span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Yapay Zekaya Analiz Ettir &amp; En İyisini Öner</span>
            </>
          )}
        </button>

        {/* Recommended Result Box */}
        {currentSystem && currentSystem.id && (
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-emerald-500/60 space-y-4 animate-fade-in shadow-xl">
            {/* Header: Title + Price + Store */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded font-black text-neutral-950 shadow-sm"
                    style={{ backgroundColor: currentSystem.sellerColor || "#10b981" }}
                  >
                    {currentSystem.seller}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    <span>#1 KasaRadar AI Tavsiyesi</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">
                    {currentSystem.targetResolution}
                  </span>
                </div>
                <h4 className="text-base font-black text-white">{currentSystem.title}</h4>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-lg sm:text-xl font-black text-emerald-400">
                  {formatTL(currentSystem.price)}
                </div>
                <div className="text-[10px] text-emerald-300 font-semibold">
                  +{formatTL(savingsTL)} Tasarruf Kârı
                </div>
              </div>
            </div>

            {/* LIVE FPS BENCHMARK TILES */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tahmini Canlı Oyun FPS Değerleri</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block font-semibold">CS2 (1080p Espor)</span>
                  <span className="text-sm font-black text-emerald-400">~{fpsEstimates.cs2} FPS</span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block font-semibold">Valorant (Ultra)</span>
                  <span className="text-sm font-black text-cyan-400">~{fpsEstimates.valorant} FPS</span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block font-semibold">Cyberpunk 2077</span>
                  <span className="text-sm font-black text-amber-400">~{fpsEstimates.cyberpunk} FPS</span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block font-semibold">GTA 5 (En Yüksek)</span>
                  <span className="text-sm font-black text-purple-400">~{fpsEstimates.gta5} FPS</span>
                </div>
              </div>
            </div>

            {/* AI Verdict & Bullet Points */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2.5">
              <div className="flex items-start gap-2 text-emerald-300 font-medium">
                <Bot className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-white block font-bold mb-0.5">Yapay Zeka Kararı:</strong>
                  <span>{aiVerdict}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-500/20 text-[11px] text-neutral-300">
                {aiBulletPoints.map((bp, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-neutral-300 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <div>
                <span className="text-neutral-500 block text-[10px]">Ekran Kartı:</span>
                <span className="font-bold text-emerald-400 truncate block">{currentSystem.gpu}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">İşlemci:</span>
                <span className="font-bold text-cyan-400 truncate block">{currentSystem.cpu.split("(")[0]}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">RAM &amp; Platform:</span>
                <span className="font-semibold text-white truncate block">{currentSystem.ram}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">F/P Skoru &amp; Darboğaz:</span>
                <span className="font-bold text-white block">
                  {currentSystem.fpScore}/10 • <span className="text-emerald-400">%{bottleneckRate}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onSelectSystem(currentSystem);
                  onClose();
                }}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-all cursor-pointer text-center"
              >
                Sistem Detaylarını Gör
              </button>

              <button
                type="button"
                onClick={handleSendEmailReport}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Raporu Gönder</span>
              </button>

              <a
                href={currentSystem.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all text-center"
              >
                <span>Mağazada Al</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
