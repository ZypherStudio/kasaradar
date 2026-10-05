"use client";

import React, { useState } from "react";
import { PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  Sparkles,
  Flame,
  Zap,
  TrendingDown,
  ThumbsUp,
  ThumbsDown,
  Camera
} from "lucide-react";

interface StoryShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  system: PrebuiltSystem | null;
}

export const StoryShareModal: React.FC<StoryShareModalProps> = ({
  isOpen,
  onClose,
  system
}) => {
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [voted, setVoted] = useState<"yes" | "no" | null>("yes");

  if (!isOpen || !system) return null;

  const savings = system.individualZeroPrice - system.price;
  const cs2Fps = Math.round(system.cpuTier * 2.2 + system.gpuTier * 1.8);
  const valoFps = Math.round(system.cpuTier * 4.3);
  const cpFps = Math.round(system.gpuTier * 1.35);

  const shareText = `🔥 Kanka KasaRadar'da şu kasayı buldum, sence bu fiyata alınır mı?\n\n🖥️ ${system.title} (${system.seller})\n💰 Fiyat: ${formatTL(system.price)} (Ayrı toplamaya göre +${formatTL(savings)} kâr!)\n🎮 CS2: ~${cs2Fps} FPS | Valorant: ~${valoFps} FPS\n\n👉 Detaylar: ${system.directUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(system.directUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm sm:max-w-md bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white">
              <Camera className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-white">Hikaye &amp; WhatsApp Kartı</h3>
              <p className="text-[10px] text-neutral-400">Arkadaşına sor veya Instagram&apos;da paylaş</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The 9:16 Vertical Instagram Story Mockup Card */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-gradient-to-b from-neutral-900 via-black to-neutral-950 p-4 shadow-2xl space-y-3.5">
          {/* Top Brand Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-emerald-500 text-neutral-950 flex items-center justify-center font-black text-[10px]">
                KR
              </div>
              <span className="text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-300">
                KASARADAR
              </span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
              F/P EKSPERTİZİ
            </span>
          </div>

          {/* PC System Image & Seller Tag */}
          <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 h-36 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={system.imageUrl}
              alt={system.title}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
            <span
              className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded font-black text-white"
              style={{ backgroundColor: system.sellerColor || "#10b981" }}
            >
              {system.seller}
            </span>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/80 text-cyan-300 font-bold border border-cyan-500/30">
                🎯 {system.targetResolution}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500 text-neutral-950 font-black">
                F/P: {system.fpScore} / 10
              </span>
            </div>
          </div>

          {/* System Name */}
          <div className="space-y-1">
            <h4 className="text-sm font-black text-white line-clamp-1">{system.title}</h4>
            <div className="text-[11px] text-neutral-400 flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">{system.gpu}</span>
              <span>•</span>
              <span className="text-cyan-400 font-semibold">{system.cpu.split("(")[0]}</span>
            </div>
          </div>

          {/* Pricing Highlight Box */}
          <div className="p-3 rounded-xl bg-neutral-900/90 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[9px] text-neutral-400 uppercase font-bold block">Canlı Hazır Kasa Fiyatı</span>
              <div className="text-lg font-black text-white flex items-baseline gap-2">
                <span>{formatTL(system.price)}</span>
                {system.oldPrice && (
                  <span className="text-xs text-neutral-500 line-through">{formatTL(system.oldPrice)}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-lg border border-emerald-500/40 block">
                +{formatTL(savings)} KÂR
              </span>
              <span className="text-[8px] text-neutral-500 mt-0.5 block">Parça toplamaya göre</span>
            </div>
          </div>

          {/* Mini FPS Benchmarks */}
          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
            <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[9px]">CS2</span>
              <strong className="text-amber-400 font-black">{cs2Fps} FPS</strong>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[9px]">Valorant</span>
              <strong className="text-rose-400 font-black">{valoFps} FPS</strong>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[9px]">Cyberpunk</span>
              <strong className="text-cyan-400 font-black">{cpFps} FPS</strong>
            </div>
          </div>

          {/* Simulated Instagram Sticker Poll */}
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-950/60 to-pink-950/60 border border-purple-500/40 text-center space-y-2">
            <span className="text-[11px] font-black text-white block">
              Sence Bu Fiyata Alınır Mı? 🤔
            </span>
            <div className="flex items-center gap-2 text-xs font-bold">
              <button
                onClick={() => setVoted("yes")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  voted === "yes"
                    ? "bg-emerald-500 text-neutral-950 font-black shadow-md shadow-emerald-500/30"
                    : "bg-neutral-900/90 text-neutral-300 hover:text-white"
                }`}
              >
                🔥 ALINIR (%88)
              </button>
              <button
                onClick={() => setVoted("no")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  voted === "no"
                    ? "bg-rose-500 text-white font-black shadow-md shadow-rose-500/30"
                    : "bg-neutral-900/90 text-neutral-300 hover:text-white"
                }`}
              >
                ❌ PAHALI (%12)
              </button>
            </div>
          </div>

          {/* Footer watermark */}
          <div className="text-center text-[9px] text-neutral-500 font-medium">
            kasaradar.com • 16+ Mağaza Canlı Fiyat Radarı
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleWhatsApp}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp&apos;tan Arkadaşına Sor</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTelegram}
              className="py-2 px-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-neutral-700"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? "Kopyalandı!" : "Metni Kopyala"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
