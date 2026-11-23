"use client";

import React, { useState } from "react";
import {
  Send,
  X,
  Sparkles,
  Gift,
  Zap,
  ShieldAlert,
  Users,
  CheckCircle2,
  Copy,
  ExternalLink,
  Flame,
  Award,
  ArrowRight
} from "lucide-react";

interface TelegramGrowthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const TelegramGrowthModal: React.FC<TelegramGrowthModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const inviteLink = "https://t.me/+Voua-sJ4TVJiZjc8";
  const shareText = "KasaRadar'ın canlı indirim Telegram kanalına katıl! 16+ mağazada fiyatı düşen kelepir kasalar ve bedava oyunlar anında burada: " + inviteLink;

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleShareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent("🔥 Beyler KasaRadar'ın indirim Telegram kanalını buldum, 30 kişi olduk 50'de Steam kodu çekilişi var, katılın:")}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold">
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span>KASARADAR VIP TELEGRAM KULÜBÜ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            🎉 Ailemiz 30 Kişiye Ulaştı!
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            16+ büyük Türk bilgisayar mağazasını 7/24 tarayan botumuz, gece kelepirlerini ve stok indirimlerini önce Telegram kanalımıza atıyor.
          </p>
        </div>

        {/* Milestone & Target Progress Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-sky-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-neutral-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              Mevcut Topluluk: <span className="text-emerald-400">30+ Donanımcı</span>
            </span>
            <span className="text-amber-400 font-mono">Hedef: 50 Üye</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 via-sky-400 to-teal-300 h-2.5 rounded-full transition-all duration-500"
              style={{ width: "60%" }}
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-amber-300 font-semibold bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
            <Gift className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>50. Üye Hediyesi:</strong> Kanala 50 kişi katıldığında ilk <strong>Steam Cüzdan Kodu</strong> çekilişi başlayacak!
            </span>
          </div>
        </div>

        {/* 3 Key Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Gece 22:00</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              İtopya ve GamingGen flaş gece indirimleri siteden önce kanala düşer.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Gift className="w-3.5 h-3.5" />
              <span>0 TL Oyunlar</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Epic Games ve Steam bedava oyunları kaçırmadan anında kütüphanene ekle.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Kazık İfşası</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Piyasada fahiş fiyata satılan hazır kasaları tek tek ifşa ediyoruz.
            </p>
          </div>
        </div>

        {/* Direct Action: Join Button */}
        <div className="space-y-3">
          <a
            href={inviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 hover:from-sky-400 hover:to-emerald-300 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 transition-all cursor-pointer active:scale-[0.99]"
          >
            <Send className="w-4 h-4" />
            <span>Kanalımıza Katıl (Ücretsiz)</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Viral Share / Invite Friends Buttons */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleShareTelegram}
              className="py-2.5 px-3 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/40 text-sky-300 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram&apos;da Paylaş</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>WhatsApp&apos;ta Paylaş</span>
            </button>
          </div>

          {/* Copy Link input */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-400 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Kopyalandı!" : "Linki Kopyala"}</span>
            </button>
          </div>
        </div>

        {/* Admin Quick Trigger (if provided) */}
        {onOpenAdmin && (
          <div className="pt-2 border-t border-neutral-800 flex justify-end">
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="text-[10px] text-neutral-500 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              ⚙️ Bot Yönetici Paneli
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
