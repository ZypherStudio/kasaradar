"use client";

import React, { useState, useEffect } from "react";
import { PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  Swords,
  X,
  Trophy,
  Flame,
  ThumbsUp,
  Share2,
  Check,
  Zap,
  ArrowRight,
  Sparkles,
  ExternalLink,
  RotateCcw
} from "lucide-react";

interface VersusArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: PrebuiltSystem[];
  onTestFps: (system: PrebuiltSystem) => void;
  onSelectSystemDetail: (system: PrebuiltSystem) => void;
}

export const VersusArenaModal: React.FC<VersusArenaModalProps> = ({
  isOpen,
  onClose,
  systems,
  onTestFps,
  onSelectSystemDetail
}) => {
  const [systemAId, setSystemAId] = useState<string>(systems[0]?.id || "");
  const [systemBId, setSystemBId] = useState<string>(systems[1]?.id || "");
  const [userVote, setUserVote] = useState<"A" | "B" | null>(null);
  const [votesA, setVotesA] = useState<number>(142);
  const [votesB, setVotesB] = useState<number>(89);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (systems.length >= 2) {
      if (!systemAId) setSystemAId(systems[0].id);
      if (!systemBId) setSystemBId(systems[1].id);
    }
  }, [systems, systemAId, systemBId]);

  // Load vote from localStorage
  useEffect(() => {
    if (!systemAId || !systemBId) return;
    const voteKey = `kr_versus_${systemAId}_vs_${systemBId}`;
    const saved = localStorage.getItem(voteKey);
    if (saved === "A" || saved === "B") {
      setUserVote(saved);
    } else {
      setUserVote(null);
    }

    // Seed realistic dynamic votes
    const hashA = systemAId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 100);
    const hashB = systemBId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 80);
    setVotesA(hashA);
    setVotesB(hashB);
  }, [systemAId, systemBId]);

  if (!isOpen) return null;

  const systemA = systems.find((s) => s.id === systemAId) || systems[0];
  const systemB = systems.find((s) => s.id === systemBId) || systems[1];

  const handleVote = (choice: "A" | "B") => {
    if (userVote) return;
    const voteKey = `kr_versus_${systemAId}_vs_${systemBId}`;
    localStorage.setItem(voteKey, choice);
    setUserVote(choice);
    if (choice === "A") setVotesA((prev) => prev + 1);
    if (choice === "B") setVotesB((prev) => prev + 1);
  };

  const totalVotes = votesA + votesB;
  const pctA = Math.round((votesA / totalVotes) * 100);
  const pctB = 100 - pctA;

  const priceDiff = Math.abs(systemA.price - systemB.price);
  const cheaperIsA = systemA.price < systemB.price;

  // Estimated fps
  const cs2FpsA = Math.round(systemA.cpuTier * 2.2 + systemA.gpuTier * 1.8);
  const cs2FpsB = Math.round(systemB.cpuTier * 2.2 + systemB.gpuTier * 1.8);

  const cpFpsA = Math.round(systemA.gpuTier * 1.35);
  const cpFpsB = Math.round(systemB.gpuTier * 1.35);

  const handleCopyBattle = () => {
    const text = `🔥 KasaRadar Kasa Kapışması: ${systemA.title} (${formatTL(systemA.price)}) VS ${systemB.title} (${formatTL(systemB.price)}) - Sen hangisini alırdın? Oy ver: https://kasaradar.com`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-purple-500/40 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold">
            <Swords className="w-3.5 h-3.5" />
            <span>Kasa Kapışması • Topluluk Oylaması Arenası</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            İki Kasa Karşı Karşıya: Sen Hangisini Alırdın?
          </h3>
          <p className="text-xs text-neutral-400">
            Fiyat, donanım gücü ve oyun FPS değerlerini yan yana kıyasla. Topluluk oylamasına katıl!
          </p>
        </div>

        {/* Live Vote Bar */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span>{systemA.seller} Köşesi</span>
              <span className="text-[11px] font-mono">({votesA} Oy • %{pctA})</span>
            </span>
            <span className="text-purple-400 flex items-center gap-1.5">
              <span className="text-[11px] font-mono">(%{pctB} • {votesB} Oy)</span>
              <span>{systemB.seller} Köşesi</span>
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${pctA}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${pctB}%` }}
            />
          </div>

          <div className="text-center pt-1">
            {userVote ? (
              <span className="text-xs font-bold text-amber-400 inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Oyun kaydedildi! ({userVote === "A" ? systemA.title : systemB.title} yönünde)
              </span>
            ) : (
              <span className="text-[11px] text-neutral-400">
                Aşağıdaki &quot;Bu Kasayı Alırım&quot; butonuna basarak oyunu kullanabilirsin.
              </span>
            )}
          </div>
        </div>

        {/* Versus Duel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {/* Center VS Badge (desktop) */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-neutral-900 border-2 border-purple-500 text-purple-300 font-black items-center justify-center shadow-2xl">
            VS
          </div>

          {/* SYSTEM A CARD */}
          <div className={`p-4 sm:p-5 rounded-3xl border-2 transition-all space-y-4 ${
            userVote === "A"
              ? "bg-emerald-950/20 border-emerald-500 ring-2 ring-emerald-500/40"
              : "bg-neutral-950/80 border-neutral-800"
          }`}>
            {/* System A Selector */}
            <div>
              <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                1. Kasa (Seçebilirsin):
              </label>
              <select
                value={systemAId}
                onChange={(e) => setSystemAId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold truncate"
              >
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.seller}: {s.title} ({formatTL(s.price)})
                  </option>
                ))}
              </select>
            </div>

            {/* Price & Score */}
            <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block font-semibold">Fiyat</span>
                <div className="text-xl font-black text-emerald-400">{formatTL(systemA.price)}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block font-semibold">F/P Skoru</span>
                <div className="text-sm font-extrabold text-white">{systemA.fpScore} / 10</div>
              </div>
            </div>

            {/* Hardware Specs comparison rows */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">Ekran Kartı:</span>
                <span className="font-bold text-white truncate max-w-[180px]">{systemA.gpu}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">İşlemci:</span>
                <span className="font-bold text-white truncate max-w-[180px]">{systemA.cpu}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">RAM Standardı:</span>
                <span className="font-semibold text-amber-300">{systemA.ramType} ({systemA.ram})</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">Depolama (SSD):</span>
                <span className="font-semibold text-neutral-200">{systemA.ssd}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">CS2 Beklenen FPS:</span>
                <span className="font-bold text-emerald-400">{cs2FpsA} FPS</span>
              </div>
            </div>

            {/* Vote Button A */}
            <button
              onClick={() => handleVote("A")}
              disabled={userVote !== null}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                userVote === "A"
                  ? "bg-emerald-500 text-neutral-950 shadow-emerald-500/20"
                  : userVote === "B"
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{userVote === "A" ? "Sen Bu Kasayı Seçtin ✓" : "1. Kasayı Alırdım!"}</span>
            </button>
          </div>

          {/* SYSTEM B CARD */}
          <div className={`p-4 sm:p-5 rounded-3xl border-2 transition-all space-y-4 ${
            userVote === "B"
              ? "bg-purple-950/20 border-purple-500 ring-2 ring-purple-500/40"
              : "bg-neutral-950/80 border-neutral-800"
          }`}>
            {/* System B Selector */}
            <div>
              <label className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">
                2. Kasa (Seçebilirsin):
              </label>
              <select
                value={systemBId}
                onChange={(e) => setSystemBId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-semibold truncate"
              >
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.seller}: {s.title} ({formatTL(s.price)})
                  </option>
                ))}
              </select>
            </div>

            {/* Price & Score */}
            <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block font-semibold">Fiyat</span>
                <div className="text-xl font-black text-purple-400">{formatTL(systemB.price)}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block font-semibold">F/P Skoru</span>
                <div className="text-sm font-extrabold text-white">{systemB.fpScore} / 10</div>
              </div>
            </div>

            {/* Hardware Specs comparison rows */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">Ekran Kartı:</span>
                <span className="font-bold text-white truncate max-w-[180px]">{systemB.gpu}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">İşlemci:</span>
                <span className="font-bold text-white truncate max-w-[180px]">{systemB.cpu}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">RAM Standardı:</span>
                <span className="font-semibold text-amber-300">{systemB.ramType} ({systemB.ram})</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">Depolama (SSD):</span>
                <span className="font-semibold text-neutral-200">{systemB.ssd}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400">CS2 Beklenen FPS:</span>
                <span className="font-bold text-purple-400">{cs2FpsB} FPS</span>
              </div>
            </div>

            {/* Vote Button B */}
            <button
              onClick={() => handleVote("B")}
              disabled={userVote !== null}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                userVote === "B"
                  ? "bg-purple-500 text-neutral-950 shadow-purple-500/20"
                  : userVote === "A"
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  : "bg-purple-500 hover:bg-purple-400 text-neutral-950 shadow-purple-500/20"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{userVote === "B" ? "Sen Bu Kasayı Seçtin ✓" : "2. Kasayı Alırdım!"}</span>
            </button>
          </div>
        </div>

        {/* Bottom Verdict & Share Bar */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-white">
              ⚖️ Fiyat Farkı: {formatTL(priceDiff)}
            </div>
            <div className="text-[11px] text-neutral-400">
              {cheaperIsA ? `${systemA.title} daha ucuz.` : `${systemB.title} daha ucuz.`}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyBattle}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-neutral-700"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-400" />
              <span>{copiedLink ? "Link Kopyalandı! ✓" : "Kapışmayı Paylaş"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
