"use client";

import React, { useState, useMemo } from "react";
import { POPULAR_CPUS, POPULAR_GPUS, calculateBottleneck } from "@/lib/hardwareBenchmarkData";
import { GAMES } from "@/lib/games";
import { calculateGameFps, formatTL } from "@/lib/calculator";
import { PrebuiltSystem } from "@/lib/types";
import {
  buildWhatsAppShareUrl,
  buildFacebookShareUrl,
  SITE_URL
} from "@/lib/community";
import {
  X,
  Trophy,
  Cpu,
  Tv,
  MemoryStick,
  Zap,
  Copy,
  Check,
  Share2,
  ExternalLink,
  ArrowUpRight,
  Gamepad2,
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface RigRaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: PrebuiltSystem[];
  onSelectSystemDetail: (system: PrebuiltSystem) => void;
}

type RamOption = "8gb_ddr4" | "16gb_ddr4" | "16gb_ddr5" | "32gb_ddr5";

const RAM_OPTIONS: { id: RamOption; label: string; gb: number; bonus: number }[] = [
  { id: "8gb_ddr4", label: "8 GB DDR4 (Tek Kanal)", gb: 8, bonus: -8 },
  { id: "16gb_ddr4", label: "16 GB DDR4 (2x8 Çift Kanal)", gb: 16, bonus: 0 },
  { id: "16gb_ddr5", label: "16 GB DDR5 (Yeni Nesil)", gb: 16, bonus: 4 },
  { id: "32gb_ddr5", label: "32 GB DDR5 (6000MHz+)", gb: 32, bonus: 8 }
];

const FEATURED_GAME_IDS = ["rdr2", "cs2", "cyberpunk", "wukong", "warzone", "valorant"];

export const RigRaterModal: React.FC<RigRaterModalProps> = ({
  isOpen,
  onClose,
  systems,
  onSelectSystemDetail
}) => {
  const [selectedCpuId, setSelectedCpuId] = useState<string>("r5-5600");
  const [selectedGpuId, setSelectedGpuId] = useState<string>("gtx-1660-super");
  const [selectedRamId, setSelectedRamId] = useState<RamOption>("16gb_ddr4");
  const [selectedGameId, setSelectedGameId] = useState<string>("rdr2");
  const [copiedCard, setCopiedCard] = useState<boolean>(false);

  const playableGames = useMemo(
    () => GAMES.filter((g) => g.id !== "gta6"),
    []
  );

  const analysis = useMemo(() => {
    const cpu = POPULAR_CPUS.find((c) => c.id === selectedCpuId) || POPULAR_CPUS[0];
    const gpu = POPULAR_GPUS.find((g) => g.id === selectedGpuId) || POPULAR_GPUS[0];
    const ram = RAM_OPTIONS.find((r) => r.id === selectedRamId) || RAM_OPTIONS[1];
    const targetGame =
      playableGames.find((g) => g.id === selectedGameId) || playableGames[0];

    const rawScore = Math.round(gpu.tier * 0.62 + cpu.tier * 0.34 + ram.bonus);
    const score = Math.max(12, Math.min(99, rawScore));

    let rankTitle = "D — Emeklilik Vakti Gelmiş";
    let rankBadgeCls = "bg-rose-500/20 text-rose-300 border-rose-500/40";
    let summary =
      "Güncel AAA oyunlarda ciddi FPS düşüşleri yaşanır. Yeni bir hazır sisteme geçmenin tam zamanı.";

    if (score >= 88) {
      rankTitle = "S+ Efsane Canavar";
      rankBadgeCls = "bg-amber-500/20 text-amber-300 border-amber-500/40";
      summary =
        "Piyasadaki en güçlü sistemlerden biri! Ağır AAA yapımları 2K/4K Ultra ayarlarda akıcı çalıştırır.";
    } else if (score >= 75) {
      rankTitle = "A+ Üst Segment Oyuncu";
      rankBadgeCls = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      summary =
        "Harika bir donanım dengesi! Güncel oyunları 1080p ve 2K yüksek ayarlarda rahatça oynatır.";
    } else if (score >= 60) {
      rankTitle = "B+ Sağlam F/P Sistemi";
      rankBadgeCls = "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      summary =
        "Rekabetçi oyunlarda yüksek FPS verir, hikayeli AAA oyunlarda da orta-yüksek ayarlarda tatmin eder.";
    } else if (score >= 44) {
      rankTitle = "C Orta Segment / Sınırda";
      rankBadgeCls = "bg-orange-500/20 text-orange-300 border-orange-500/40";
      summary =
        "CS2 ve Valorant'ta akıcı ancak Cyberpunk 2077, Wukong veya RDR2 gibi oyunlarda ayar kısmak gerekir.";
    }

    const bottleneck = calculateBottleneck(cpu.id, gpu.id, "1080p", "aaa");

    const focusUltra = calculateGameFps(targetGame, cpu.tier, gpu.tier, ram.gb, "1080p_ultra");
    const focusLow = calculateGameFps(targetGame, cpu.tier, gpu.tier, ram.gb, "1080p_low");

    const featuredBenchmarks = FEATURED_GAME_IDS.map((id) => {
      const game = playableGames.find((g) => g.id === id);
      if (!game) return null;
      const preset = id === "cs2" || id === "valorant" ? "1080p_low" : "1080p_ultra";
      const res = calculateGameFps(game, cpu.tier, gpu.tier, ram.gb, preset);
      return {
        game,
        fps: res.avgFps,
        lowFps: res.lowFps,
        label: preset === "1080p_low" ? "1080p Rekabetçi" : "1080p Ultra",
        status: res.verdict.status
      };
    }).filter((x): x is NonNullable<typeof x> => x !== null);

    const rigPower = gpu.tier * 0.65 + cpu.tier * 0.35;
    const recommendedUpgrades = [...systems]
      .map((sys) => {
        const sysPower = sys.gpuTier * 0.65 + sys.cpuTier * 0.35;
        const gainPct = Math.round(((sysPower - rigPower) / Math.max(1, rigPower)) * 100);
        return { system: sys, sysPower, gainPct };
      })
      .filter((item) => item.gainPct >= 15)
      .sort((a, b) => b.system.fpScore - a.system.fpScore)
      .slice(0, 2);

    return {
      cpu,
      gpu,
      ram,
      targetGame,
      focusUltra,
      focusLow,
      score,
      rankTitle,
      rankBadgeCls,
      summary,
      bottleneck,
      featuredBenchmarks,
      recommendedUpgrades
    };
  }, [selectedCpuId, selectedGpuId, selectedRamId, selectedGameId, playableGames, systems]);

  if (!isOpen) return null;

  const cs2Bench = analysis.featuredBenchmarks.find((b) => b.game.id === "cs2");
  const cpBench = analysis.featuredBenchmarks.find((b) => b.game.id === "cyberpunk");
  const shareMessage = `🏆 KasaRadar Sistem Karnem: ${analysis.score}/100 (${analysis.rankTitle})\n🖥️ Donanım: ${analysis.gpu.name} + ${analysis.cpu.name} (${analysis.ram.label})\n🎮 ${analysis.targetGame.title} (1080p Ultra): ~${analysis.focusUltra.avgFps} FPS (${analysis.focusUltra.verdict.label})\n🔫 CS2: ~${cs2Bench?.fps ?? "-"} FPS | Cyberpunk 2077: ~${cpBench?.fps ?? "-"} FPS\n\nSenin kasa kaç puan alıyor? Hemen test et 👇\n${SITE_URL}/#sistem-puanla`;

  const handleCopyScoreCard = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage);
      setCopiedCard(true);
      setTimeout(() => setCopiedCard(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-500 text-neutral-950 shadow-lg">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Kendi Sistemini Puanlat &amp; Oyun Performans Karnesi
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black">
                  Canlı Karne
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Mevcut bilgisayarının parçalarını ve test etmek istediğin oyunu seç; 100 üzerinden puanını ve gerçekçi FPS tahminlerini gör.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800">
          <div>
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5 mb-1.5">
              <Tv className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ekran Kartın (GPU)</span>
            </label>
            <select
              value={selectedGpuId}
              onChange={(e) => setSelectedGpuId(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {POPULAR_GPUS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5 mb-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>İşlemcin (CPU)</span>
            </label>
            <select
              value={selectedCpuId}
              onChange={(e) => setSelectedCpuId(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {POPULAR_CPUS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5 mb-1.5">
              <MemoryStick className="w-3.5 h-3.5 text-purple-400" />
              <span>Bellek (RAM)</span>
            </label>
            <select
              value={selectedRamId}
              onChange={(e) => setSelectedRamId(e.target.value as RamOption)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {RAM_OPTIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5 mb-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Edilecek Oyun</span>
            </label>
            <select
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {playableGames.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scorecard Result */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Big Score Gauge */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-emerald-950/30 border border-emerald-500/30 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs uppercase font-black tracking-wider text-neutral-400">
                KasaRadar Sistem Skoru
              </span>
              <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-black ${analysis.rankBadgeCls}`}>
                {analysis.rankTitle}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-white tracking-tight">
                {analysis.score}
              </span>
              <span className="text-xl font-bold text-neutral-500">/ 100</span>
            </div>

            <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analysis.score}%` }}
              />
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">{analysis.summary}</p>

            {/* Bottleneck quick tag */}
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] flex items-center justify-between">
              <span className="text-neutral-400">Darboğaz Riski (1080p):</span>
              <span
                className={`font-bold ${
                  analysis.bottleneck.status === "perfect"
                    ? "text-emerald-400"
                    : analysis.bottleneck.status === "acceptable"
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                %{analysis.bottleneck.bottleneckPercent} ({analysis.bottleneck.statusText})
              </span>
            </div>
          </div>

          {/* Selected Game Spotlight + 6 Popular Games */}
          <div className="lg:col-span-7 space-y-3">
            {/* Selected Game Check */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-neutral-950 to-neutral-950 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-black text-white">
                    {analysis.targetGame.title} Performansı
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full border text-xs font-bold flex items-center gap-1 ${analysis.focusUltra.verdict.badgeColor}`}
                >
                  {analysis.focusUltra.avgFps >= 60 ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                  <span>{analysis.focusUltra.verdict.label}</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
                <span>
                  1080p Ultra: <strong className="text-amber-300">~{analysis.focusUltra.avgFps} FPS</strong>{" "}
                  <span className="text-neutral-500">(%1 Low: {analysis.focusUltra.lowFps})</span>
                </span>
                <span>
                  1080p Düşük/Orta: <strong className="text-emerald-300">~{analysis.focusLow.avgFps} FPS</strong>
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">{analysis.focusUltra.verdict.description}</p>
            </div>

            {/* 6 Popular Games Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {analysis.featuredBenchmarks.map((b) => (
                <button
                  key={b.game.id}
                  onClick={() => setSelectedGameId(b.game.id)}
                  className={`text-left p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    selectedGameId === b.game.id
                      ? "bg-amber-500/10 border-amber-500/50"
                      : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <div className="text-[11px] text-neutral-300 font-bold truncate" title={b.game.title}>
                    {b.game.title}
                  </div>
                  <div
                    className={`text-lg font-black ${
                      b.fps >= 120
                        ? "text-emerald-400"
                        : b.fps >= 60
                        ? "text-cyan-400"
                        : b.fps >= 35
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    ~{b.fps} FPS
                  </div>
                  <div className="text-[10px] text-neutral-500">{b.label}</div>
                </button>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="p-3.5 rounded-2xl bg-neutral-950/90 border border-neutral-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-neutral-300">
                Arkadaşlarına hava at veya gruplarda kıyasla:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyScoreCard}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedCard ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  <span>{copiedCard ? "Karne Kopyalandı!" : "Skor Kartını Kopyala"}</span>
                </button>

                <a
                  href={buildWhatsAppShareUrl(shareMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp&apos;ta Paylaş</span>
                </a>

                <a
                  href={buildFacebookShareUrl(SITE_URL, shareMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Facebook&apos;ta Paylaş</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Suggestions if stronger systems exist */}
        {analysis.recommendedUpgrades.length > 0 && (
          <div className="space-y-2.5 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>Bu Sistemlerden Birine Geçersen FPS Uçuşa Geçer</span>
              </span>
              <span className="text-[11px] text-neutral-400">
                Mevcut 2. el sistemini satıp yükseltebilirsin
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.recommendedUpgrades.map(({ system, gainPct }) => (
                <div
                  key={system.id}
                  className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 flex items-center justify-between gap-3 transition-all"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black">
                        +%{gainPct} Daha Güçlü
                      </span>
                      <span className="text-[11px] text-neutral-400">{system.seller}</span>
                    </div>
                    <div className="font-bold text-sm text-white truncate">{system.title}</div>
                    <div className="text-[11px] text-neutral-400 truncate">
                      {system.gpu} • {formatTL(system.price)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectSystemDetail(system);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>İncele</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={system.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-bold flex items-center justify-center gap-1"
                    >
                      <span>Mağaza</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
