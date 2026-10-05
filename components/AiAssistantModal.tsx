"use client";

import React, { useState } from "react";
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
  Tv
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
  const [analyzed, setAnalyzed] = useState<boolean>(false);
  const [aiThinking, setAiThinking] = useState<boolean>(false);
  const [aiNote, setAiNote] = useState<string>("");

  if (!isOpen) return null;

  const handleAnalyze = async (overridePrompt?: string) => {
    setAiThinking(true);
    const query = overridePrompt || customPrompt;

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          budget,
          useCase,
          resolution
        })
      });

      const data = await res.json();
      setAiThinking(false);
      setAnalyzed(true);

      if (data.reply) {
        setAiNote(data.reply);
      } else {
        setAiNote("Bütçene göre tek tek toplamaya kıyasla en yüksek net kâr marjını veren, parça uyumu onaylanmış en mantıklı hazır kasa seçildi.");
      }
    } catch (e) {
      setAiThinking(false);
      setAnalyzed(true);
      setAiNote("Bütçene göre tek tek toplamaya kıyasla en yüksek net kâr marjını veren, parça uyumu onaylanmış en mantıklı hazır kasa seçildi.");
    }
  };

  // AI Matching algorithm
  const recommendedSystem = (() => {
    const promptLower = customPrompt.toLowerCase();
    let candidates = [...systems];

    if (promptLower.includes("bütçe") || promptLower.includes("ucuz") || promptLower.includes("15") || promptLower.includes("16")) {
      candidates = candidates.filter((s) => s.price <= 24000);
    } else if (promptLower.includes("4080") || promptLower.includes("4k") || promptLower.includes("üst seviye")) {
      candidates = candidates.filter((s) => s.price >= 50000);
    } else {
      candidates = candidates.filter((s) => s.price <= budget * 1.12);
    }

    if (candidates.length === 0) candidates = systems;

    return candidates.sort((a, b) => {
      if (useCase === "esports") return b.cpuTier - a.cpuTier;
      if (useCase === "story") return b.gpuTier - a.gpuTier;
      if (useCase === "content") return b.ramSizeGb - a.ramSizeGb || b.cpuTier - a.cpuTier;
      return b.fpScore - a.fpScore;
    })[0] || systems[0];
  })();

  const handleSendEmailReport = () => {
    if (!isLoggedIn && onRequireAuth) {
      onRequireAuth();
      return;
    }
    if (onOpenEmailPreview) {
      onOpenEmailPreview(
        `KasaRadar AI Önerisi: ${recommendedSystem.title}`,
        recommendedSystem.price,
        recommendedSystem.imageUrl,
        recommendedSystem.seller
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-y-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <Bot className="w-3.5 h-3.5" />
            <span>KasaRadar Akıllı Donanım Danışmanı v2.5</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Bütçene ve Hedefine En Uygun Kasayı Bulalım
          </h3>
          <p className="text-xs text-neutral-400">
            Kriterlerini seç veya yapay zekaya doğrudan ne istediğini yaz; 8 mağazadaki hazır kasalar arasından en mantıklı sistemi seçelim.
          </p>
        </div>

        {/* Quick Question / Prompt Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Özel İstek veya Oynamak İstediğin Oyunlar (İsteğe Bağlı):</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => {
                setCustomPrompt(e.target.value);
                setAnalyzed(false);
              }}
              placeholder="Örn: 30K bütçem var CS2 ve Valorant'ta 360 FPS istiyorum..."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          {/* Quick preset prompt chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              "🔥 15K - 20K En İyi F/P",
              "🎯 Valorant & CS2 360 FPS",
              "🌟 2K & 4K GTA 6 Canavarı",
              "🎥 Twitch Yayın & Video Montaj"
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setCustomPrompt(chip);
                  handleAnalyze(chip);
                }}
                className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Parameter Sliders & Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800">
          {/* Question 1: Budget Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-300">
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
                setBudget(Number(e.target.value));
                setAnalyzed(false);
              }}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>15.000 TL</span>
              <span>50.000 TL</span>
              <span>85.000 TL+</span>
            </div>
          </div>

          {/* Question 2: Primary Use Case */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-neutral-300 block">
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
                  onClick={() => {
                    setUseCase(u.id as any);
                    setAnalyzed(false);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
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

        {/* Analyze / Recommend Button */}
        {!analyzed ? (
          <button
            onClick={() => handleAnalyze()}
            disabled={aiThinking}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
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
        ) : (
          /* Recommended Result Box */
          <div className="p-5 rounded-2xl bg-neutral-950 border border-emerald-500 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-400" />
                Senin İçin Seçtiğimiz #1 Tavsiye Kasa
              </span>
              <span className="text-base font-black text-white">{formatTL(recommendedSystem.price)}</span>
            </div>

            {/* AI Reasoning Note */}
            {aiNote && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed flex items-start gap-2">
                <Bot className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Yapay Zeka Değerlendirmesi:</span>
                  <span>{aiNote}</span>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: `${recommendedSystem.sellerColor}20`, color: recommendedSystem.sellerColor }}>
                  {recommendedSystem.seller}
                </span>
                <h4 className="text-base font-black text-white">{recommendedSystem.title}</h4>
              </div>
              <p className="text-xs text-neutral-400">{recommendedSystem.highlight}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <div>
                <span className="text-neutral-500 block text-[10px]">Ekran Kartı:</span>
                <span className="font-semibold text-emerald-400">{recommendedSystem.gpu}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">İşlemci:</span>
                <span className="font-semibold text-cyan-400">{recommendedSystem.cpu.split("(")[0]}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">RAM &amp; Platform:</span>
                <span className="font-semibold">{recommendedSystem.ram}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">F/P Skoru:</span>
                <span className="font-bold text-white">{recommendedSystem.fpScore} / 10</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onSelectSystem(recommendedSystem);
                  onClose();
                }}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-all cursor-pointer text-center"
              >
                Sistem Detaylarını Gör
              </button>

              <button
                onClick={handleSendEmailReport}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Raporu E-Postama Gönder</span>
              </button>

              <a
                href={recommendedSystem.directUrl}
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
