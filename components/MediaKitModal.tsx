"use client";

import React, { useState } from "react";
import {
  Briefcase,
  X,
  CheckCircle2,
  Send,
  Mail,
  Award,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  ShieldCheck,
  Crown,
  ExternalLink,
  Copy
} from "lucide-react";

interface MediaKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediaKitModal: React.FC<MediaKitModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  if (!isOpen) return null;

  const email = "zypherstudio@gmail.com";
  const telegramInvite = "https://t.me/+Voua-sJ4TVJiZjc8";

  const handleCopyEmail = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 pb-2 border-b border-neutral-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>KASARADAR MEDYA KİTİ &amp; REKLAM ORTAKLIKLARI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Markanızı Binlerce Oyuncuya Ulaştırın
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            KasaRadar; hazır sistem arayan, bütçesini hazırlamış ve satın alma kararı aşamasındaki en nitelikli oyuncu ve teknoloji kitlesini bir araya getirir.
          </p>
        </div>

        {/* 4 Key Platform Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 font-medium">Haftalık Kitle</span>
            <div className="text-lg font-black text-emerald-400">430+ Oyuncu</div>
            <p className="text-[10px] text-neutral-500 leading-tight">Doğrudan Türk Oyuncu Kitlesi</p>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 font-medium">Etkileşim</span>
            <div className="text-lg font-black text-sky-400">2.800+ Event</div>
            <p className="text-[10px] text-neutral-500 leading-tight">Kasa &amp; FPS Test Etkileşimi</p>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 font-medium">AI Trafiği</span>
            <div className="text-lg font-black text-amber-400">419 Tavsiye</div>
            <p className="text-[10px] text-neutral-500 leading-tight">ChatGPT &amp; Perplexity Yönlendirmesi</p>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] text-neutral-400 font-medium">Mağaza Ağı</span>
            <div className="text-lg font-black text-purple-400">22+ Mağaza</div>
            <p className="text-[10px] text-neutral-500 leading-tight">7/24 Anlık F/P Taraması</p>
          </div>
        </div>

        {/* Sponsorship Packages */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Sponsorluk Paketlerimiz
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Package 1 */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/10 to-neutral-950 border border-amber-500/30 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                  <Crown className="w-4 h-4" />
                  <span>Haftanın Kasası Vitrini</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Ana sayfada listenin en tepesinde altın çerçeveli özel vitrin ve doğrudan satın alma butonu.
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold w-fit">
                En Popüler
              </span>
            </div>

            {/* Package 2 */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-neutral-950 border border-emerald-500/30 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
                  <Award className="w-4 h-4" />
                  <span>Kategori Üstü Banner</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Hazır Kasalar, FPS Testi ve Ekipman sayfalarında markanıza özel temiz sponsorlu gösterim.
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold w-fit">
                Yüksek Görünürlük
              </span>
            </div>

            {/* Package 3 */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-sky-500/10 to-neutral-950 border border-sky-500/30 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold mb-1">
                  <Send className="w-4 h-4" />
                  <span>Telegram İndirim Yayını</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  30+ aktif donanımcının bulunduğu Telegram kanalımıza sisteminizin anlık sıcak fırsat bildirimi.
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold w-fit">
                Anlık Satış
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Booking Channels */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Rezervasyon &amp; Teklif Almak İçin İletişime Geçin</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a
              href={telegramInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-neutral-950 font-bold flex items-center justify-center gap-2 border border-sky-500/30 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Üzerinden Yazın</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={handleCopyEmail}
              className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold flex items-center justify-center gap-2 border border-neutral-700 transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>{copiedEmail ? "E-Posta Kopyalandı!" : "zypherstudio@gmail.com"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
