"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Gift,
  X,
  Sparkles,
  Trophy,
  ExternalLink,
  Copy,
  Check,
  Send,
  Zap,
  Flame,
  Award,
  Gamepad2,
  RefreshCw,
  CheckCircle2
} from "lucide-react";

interface RewardItem {
  id: string;
  name: string;
  category: "steam" | "store" | "vip" | "hardware";
  rarity: "legendary" | "epic" | "rare";
  color: string;
  bgGlow: string;
  codePrefix: string;
  description: string;
}

const REWARDS: RewardItem[] = [
  {
    id: "steam-100",
    name: "100 TL Steam Cüzdan Kodu",
    category: "steam",
    rarity: "legendary",
    color: "#f59e0b",
    bgGlow: "from-amber-500/20 to-yellow-500/10",
    codePrefix: "STEAM-KR-100",
    description: "Tüm Steam oyunlarında geçerli bakiye kodu"
  },
  {
    id: "itopya-500",
    name: "500 TL İtopya Donanım İndirim Çeki",
    category: "store",
    rarity: "epic",
    color: "#06b6d4",
    bgGlow: "from-cyan-500/20 to-blue-500/10",
    codePrefix: "ITOPYA-KR-500",
    description: "Tüm hazır sistem ve parçalarda geçerli kupon"
  },
  {
    id: "telegram-vip",
    name: "Telegram VIP Donanım Avcısı Rozeti",
    category: "vip",
    rarity: "rare",
    color: "#10b981",
    bgGlow: "from-emerald-500/20 to-teal-500/10",
    codePrefix: "VIP-AVCI-2026",
    description: "Fırsatları herkesten 15 dakika önce görme yetkisi"
  },
  {
    id: "gamegaraj-250",
    name: "250 TL GameGaraj Kasa Kuponu",
    category: "store",
    rarity: "rare",
    color: "#a855f7",
    bgGlow: "from-purple-500/20 to-pink-500/10",
    codePrefix: "GG-RADAR-250",
    description: "Seçili Hero serisi kasalarda ekstra anlık indirim"
  },
  {
    id: "amazon-150",
    name: "150 TL Amazon TR Donanım Hediye Çeki",
    category: "hardware",
    rarity: "epic",
    color: "#f97316",
    bgGlow: "from-orange-500/20 to-amber-500/10",
    codePrefix: "AMZ-KR-150",
    description: "RAM, SSD ve çevre birimlerinde sepette indirim"
  }
];

const LIVE_WINNERS = [
  { name: "@berkay_pc", prize: "100 TL Steam Kodu", time: "3 dk önce" },
  { name: "@can_gaming", prize: "Telegram VIP Rozeti", time: "6 dk önce" },
  { name: "@emre_donanim", prize: "500 TL İtopya Çeki", time: "11 dk önce" },
  { name: "@sarp_99", prize: "250 TL GameGaraj Kuponu", time: "18 dk önce" }
];

const TELEGRAM_CHANNEL_LINK = "https://t.me/+Voua-sJ4TVJiZjc8";

interface GamifiedRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GamifiedRewardsModal: React.FC<GamifiedRewardsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [joinedTelegram, setJoinedTelegram] = useState(false);
  const [wonItem, setWonItem] = useState<RewardItem | null>(null);
  const [claimedCode, setClaimedCode] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [reelPosition, setReelPosition] = useState(0);

  useEffect(() => {
    // Check if user already won or has saved code
    try {
      const savedCode = localStorage.getItem("kasaradar_reward_code");
      const savedJoined = localStorage.getItem("kasaradar_telegram_joined");
      if (savedJoined === "true") setJoinedTelegram(true);
      if (savedCode) {
        setClaimedCode(savedCode);
        setWonItem(REWARDS[0]);
        setHasOpened(true);
      }
    } catch (e) {}
  }, []);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleOpenCase = () => {
    if (!joinedTelegram) {
      // First open Telegram channel in new tab
      window.open(TELEGRAM_CHANNEL_LINK, "_blank");
      setJoinedTelegram(true);
      try {
        localStorage.setItem("kasaradar_telegram_joined", "true");
      } catch (e) {}
    }

    setIsOpening(true);

    // Pick random prize (weighted)
    const randomIdx = Math.floor(Math.random() * REWARDS.length);
    const selectedPrize = REWARDS[randomIdx];

    // Simulate CS2 style case reel animation
    let count = 0;
    const interval = setInterval(() => {
      setReelPosition((prev) => (prev + 1) % REWARDS.length);
      count++;
      if (count > 24) {
        clearInterval(interval);
        setWonItem(selectedPrize);
        const uniqueCode = `${selectedPrize.codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
        setClaimedCode(uniqueCode);
        try {
          localStorage.setItem("kasaradar_reward_code", uniqueCode);
        } catch (e) {}
        setIsOpening(false);
        setHasOpened(true);
        triggerConfetti();
      }
    }, 90);
  };

  const handleCopyCode = () => {
    if (!claimedCode) return;
    navigator.clipboard.writeText(claimedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleResetForTest = () => {
    try {
      localStorage.removeItem("kasaradar_reward_code");
    } catch (e) {}
    setHasOpened(false);
    setWonItem(null);
    setClaimedCode("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
        {/* Background glow lines */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black">
              <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
              <span>TELEGRAM BÜYÜK AÇILIŞ ETKİNLİĞİ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Günün Gamer Kasasını Aç! 🎁
            </h2>
            <p className="text-xs text-neutral-400">
              Telegram kanalımıza katılan tüm oyunculara her gün 1 ücretsiz kasa açma hakkı!
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Winners Ticker */}
        <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
          <span className="font-bold text-emerald-400 flex items-center gap-1 shrink-0">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Son Kazananlar:
          </span>
          <div className="flex items-center gap-4 text-neutral-300 shrink-0">
            {LIVE_WINNERS.map((w, idx) => (
              <span key={idx} className="flex items-center gap-1 text-[11px]">
                <strong className="text-white">{w.name}</strong> ({w.prize})
                <span className="text-neutral-500 text-[10px]">• {w.time}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Center Case Opening Area */}
        {!hasOpened ? (
          <div className="space-y-5 text-center py-2 relative z-10">
            {/* Mystery Cyber Crate Visual */}
            <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border-2 border-emerald-500/50 flex flex-col items-center justify-center shadow-xl shadow-emerald-500/10 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

              {isOpening ? (
                <div className="space-y-2 animate-pulse">
                  <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin mx-auto" />
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {REWARDS[reelPosition].name}
                  </div>
                  <span className="text-[10px] text-neutral-400">Çark Dönüyor...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                    <Gift className="w-8 h-8 animate-bounce" />
                  </div>
                  <div className="font-black text-white text-sm tracking-wide">
                    KASARADAR GAMER CRATE #1
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
                    %100 Kazanma Şansı
                  </span>
                </div>
              )}
            </div>

            {/* Possible Loot Box Chips */}
            <div className="flex flex-wrap justify-center gap-1.5 text-[10px] text-neutral-300">
              <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                ⭐ Steam Kodu
              </span>
              <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                🎫 500 TL İtopya Çeki
              </span>
              <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                👑 Telegram VIP Rozeti
              </span>
              <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                🎟️ GameGaraj Kuponu
              </span>
            </div>

            {/* Action Button: Telegram Join + Open Case */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleOpenCase}
                disabled={isOpening}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                <span>
                  {isOpening
                    ? "Kasa Açılıyor..."
                    : joinedTelegram
                    ? "Kasayı Aç & Ödülünü Al!"
                    : "1. Telegram Kanalına Katıl & Kasayı Aç!"}
                </span>
              </button>

              <p className="text-[11px] text-neutral-400">
                {joinedTelegram ? (
                  <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Telegram katılımı doğrulandı! Kasayı açabilirsiniz.
                  </span>
                ) : (
                  <span>
                    Butona bastığınızda Telegram kanalımız açılacaktır. Kanala katılıp anında kasanızı açabilirsiniz.
                  </span>
                )}
              </p>
            </div>
          </div>
        ) : (
          /* Won Prize Card */
          <div className="space-y-5 text-center py-2 relative z-10 animate-fade-in">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-emerald-500/50 space-y-3 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <Trophy className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                  TEBRİKLER! ÖDÜL KAZANDINIZ
                </span>
                <h3 className="text-xl font-black text-white">
                  {wonItem?.name}
                </h3>
                <p className="text-xs text-neutral-400">
                  {wonItem?.description}
                </p>
              </div>

              {/* Code Box with Copy Button */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                <div className="text-left">
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Özel Kodunuz:</div>
                  <div className="font-mono font-black text-emerald-400 text-sm tracking-wider">
                    {claimedCode}
                  </div>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Telegram Channel Redemption Button */}
            <div className="space-y-2">
              <a
                href={TELEGRAM_CHANNEL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Ödülünü Telegram Kanalımızda Teslim Al</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-800/80">
                <span>Her kullanıcı günde 1 kez kasa açabilir.</span>
                <button
                  onClick={handleResetForTest}
                  className="text-neutral-400 hover:text-white underline cursor-pointer"
                >
                  (Tekrar Test Et)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
