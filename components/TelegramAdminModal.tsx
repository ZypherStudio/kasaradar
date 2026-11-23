"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bot,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Gift,
  AlertTriangle,
  Award,
  Users,
  Eye,
  Key
} from "lucide-react";

interface TelegramAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BroadcastTemplate {
  id: string;
  title: string;
  icon: any;
  iconColor: string;
  description: string;
  message: string;
}

const BROADCAST_TEMPLATES: BroadcastTemplate[] = [
  {
    id: "deal",
    title: "Günün F/P Şampiyonu",
    icon: Zap,
    iconColor: "text-amber-400",
    description: "Tek tek toplamaya göre +5.400 TL kârlı RTX 4060 Ti sistemi ilanı",
    message: `🔥 <b>GÜNÜN F/P ŞAMPİYONU: RTX 4060 Ti Sistem 27.999 TL!</b>\n\n🖥️ <b>Gençer Phantom V1 Gaming PC</b>\n🏪 <b>Satıcı Mağaza:</b> Gençer Gaming\n\n💰 <b>Fiyat:</b> 27.999 TL <s>(30.500 TL)</s>\n💎 <b>Kâr:</b> +5.401 TL Cepte (Tek tek sıfır toplamaya kıyasla)\n⭐ <b>F/P Skoru:</b> 9.6 / 10\n\n🎮 <b>Ekran Kartı:</b> Gainward RTX 4060 Ti Ghost 8GB\n⚡ <b>İşlemci:</b> AMD Ryzen 5 5600 (4.4GHz 6C/12T)\n💾 <b>Bellek & SSD:</b> 16GB DDR4 • 1TB Gen3 NVMe SSD\n💳 <b>Taksit:</b> Peşin fiyatına 3 taksit: 9.333 TL x 3\n\n🔗 <b>Hemen İncele & Karşılaştır:</b>\n👉 <a href="https://kasaradar.com">kasaradar.com üzerinden gör</a>\n\n━━━━━━━━━━━━━━━━━━━━\n📡 <b>KasaRadar Otomatik Fırsat Radarı</b> • ZYPHERSTUDIO`
  },
  {
    id: "free_games",
    title: "Haftalık Bedava Oyun",
    icon: Gift,
    iconColor: "text-emerald-400",
    description: "Epic Games & Steam 0 TL'ye düşen haftalık kelepir oyunlar",
    message: `🎁 <b>HAFTANIN BEDAVA OYUNLARI DAĞITILDI! (0 TL)</b>\n\n🎮 <b>Epic Games & Steam Kelepir Radarı:</b>\nOyuncular dikkat! Bu haftanın ücretsiz oyunları erişime açıldı. Kütüphanenize bir kez ekleyin, ömür boyu sizde kalsın:\n\n✨ <b>1. Oyun:</b> Epic Games Gizemli Oyun (0 TL)\n⚡ <b>2. Oyun:</b> Steam Hafta Sonu Ücretsiz Kelepirleri\n\n🎯 <i>Sistem gereksinimlerini ve kaç FPS alacağını KasaRadar'da test edebilirsin!</i>\n\n🔗 <b>Bedava Oyunları Hemen Kap:</b>\n👉 <a href="https://kasaradar.com/#bedava-oyunlar">kasaradar.com/bedava-oyunlar</a>\n\n━━━━━━━━━━━━━━━━━━━━\n📡 <b>KasaRadar Topluluğu</b> • 30+ Donanımcı Aramızda!`
  },
  {
    id: "kazik",
    title: "Kazık Kasa İfşası",
    icon: AlertTriangle,
    iconColor: "text-rose-400",
    description: "Piyasada fahiş fiyata satılan hazır kasayı ifşa edip uyaran mesaj",
    message: `⚠️ <b>KAZIK SAYAR ALARMI: BU SİSTEME BU PARA VERİLMEZ!</b>\n\n🚨 <b>Piyasada Çok Satan Bir Kasa Hakkında Uyarı:</b>\nAlgoritmamız popüler bir e-ticaret sitesinde 32.999 TL'ye satılan hazır sistemin gerçek parça değerini hesapladı:\n\n❌ <b>Satış Fiyatı:</b> 32.999 TL\n📉 <b>Gerçek Parça Değeri:</b> 24.100 TL\n💸 <b>Zarar:</b> -8.899 TL Fazla Fiyat!\n\n💡 <b>Tavsiye:</b> Bu fiyata DDR5 & RTX 4070 sistem toplanabiliyor. Reklamlara aldanıp paranızı çöpe atmayın!\n\n🔍 <b>Alacağın sistemi KasaRadar'da sorgulatmadan sipariş verme:</b>\n👉 <a href="https://kasaradar.com/#kazik-sayar">kasaradar.com Kazık Sayar</a>\n\n━━━━━━━━━━━━━━━━━━━━\n🛡️ <b>KasaRadar Tüketici Kalkanı</b>`
  },
  {
    id: "giveaway",
    title: "50 Üyede Çekiliş Duyurusu",
    icon: Award,
    iconColor: "text-cyan-400",
    description: "30 üyeye teşekkür ve 50 üyeye ulaşıldığında Steam kodu çekilişi",
    message: `🎉 <b>KASARADAR TOPLULUĞU 30 KİŞİYİ GEÇTİ!</b> 🚀\n\nAramıza yeni katılan tüm donanımcı arkadaşlara hoş geldiniz diyoruz! 🤝\n\n🔥 <b>Hedef: 50 Üye!</b>\nKanalımız 50 kişiye ulaştığında üyelerimize özel <b>İlk Steam Cüzdan Kodu Çekilişimizi</b> başlatıyoruz!\n\n📢 <b>Bize Destek Ol:</b>\nArkadaşlarını, kasa arayan tanıdıklarını kanala davet et, 50 kişiye daha hızlı ulaşalım ve çekilişi başlatalım:\n👉 <a href="https://t.me/+Voua-sJ4TVJiZjc8">Kanal Davet Linkimiz</a>\n\n🌐 <b>Canlı Donanım Borsası:</b> <a href="https://kasaradar.com">kasaradar.com</a>\n\n━━━━━━━━━━━━━━━━━━━━\n👑 <b>ZYPHERSTUDIO • KasaRadar</b>`
  }
];

export const TelegramAdminModal: React.FC<TelegramAdminModalProps> = ({
  isOpen,
  onClose
}) => {
  const [token, setToken] = useState("");
  const [channelId, setChannelId] = useState("-1004406242049");
  const [isConfigured, setIsConfigured] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("deal");
  const [customMessage, setCustomMessage] = useState<string>(BROADCAST_TEMPLATES[0].message);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/telegram-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.configured) {
          setIsConfigured(true);
        }
        if (data.channelId) {
          setChannelId(data.channelId);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectTemplate = (template: BroadcastTemplate) => {
    setSelectedTemplateId(template.id);
    setCustomMessage(template.message);
  };

  const handleBroadcast = async (messageToSend: string) => {
    setIsBroadcasting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/telegram-broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token || undefined,
          channelId: channelId || undefined,
          message: messageToSend
        })
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({
          text: `🎉 Başarılı! İlan kanalınıza anında gönderildi. (Mesaj ID: ${data.messageId})`,
          type: "success"
        });
      } else {
        setStatusMessage({
          text: `❌ ${data.error || "Gönderim başarısız"}`,
          type: "error"
        });
      }
    } catch (err: any) {
      setStatusMessage({ text: `❌ Gönderim hatası: ${err.message}`, type: "error" });
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-neutral-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold">
              <Bot className="w-3.5 h-3.5 text-sky-400" />
              <span>KASARADAR YAYINCI KONSOLU</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Telegram Canlı Yayın Paneli
            </h2>
            <p className="text-xs text-neutral-400">
              Kanalındaki 30+ üyeye tek tıkla hazır F/P fırsatları, bedava oyunlar veya çekiliş duyuruları gönder.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Channel Status Card */}
        <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center border border-sky-500/30 shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>KasaRadar | Hazır Sistem &amp; Donanım</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                Bot: @kasadarrbot • ID: {channelId}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>30+ Üye Aktif</span>
            </span>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
            >
              {showConfig ? "Ayarları Gizle" : "Ayarlar"}
            </button>
          </div>
        </div>

        {/* Optional Token Config (Collapsed by default) */}
        {showConfig && (
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 animate-in fade-in">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Bot Token Değiştir:
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Yeni Bot Token yapıştırın..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
            />
          </div>
        )}

        {/* Status Notification Toast */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-fade-in ${
              statusMessage.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-rose-500/15 border-rose-500/40 text-rose-300"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* 4 Ready Broadcast Templates */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
            <span>Hazır Yayın Şablonları (1-Tıkla Seç)</span>
            <span className="text-[10px] text-neutral-500">HTML &amp; Emojili Hazır Format</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BROADCAST_TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon;
              const isSelected = selectedTemplateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? "bg-neutral-800/90 border-sky-500/80 shadow-lg shadow-sky-500/10 scale-[1.01]"
                      : "bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0 ${tmpl.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      <span>{tmpl.title}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {tmpl.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Message Preview & Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Yayınlanacak Mesaj İçeriği</span>
            </span>
            <span className="text-[10px] text-neutral-500">Düzenleyebilir veya direkt gönderebilirsiniz</span>
          </div>

          <textarea
            rows={7}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-200 leading-relaxed focus:outline-none focus:border-sky-500 selection:bg-sky-500 selection:text-neutral-950 resize-y"
          />
        </div>

        {/* Action Button: Broadcast to Channel */}
        <div className="pt-2 border-t border-neutral-800 space-y-2">
          <button
            onClick={() => handleBroadcast(customMessage)}
            disabled={isBroadcasting || !customMessage.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {isBroadcasting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Kanala Yayınlanıyor...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>🚀 Bu Mesajı Telegram Kanalına Hemen Yayınla</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-neutral-400">
            Mesaj doğrudan <strong>@kasadarrbot</strong> tarafından 30+ üyeye canlı bildirim olarak iletilir.
          </p>
        </div>
      </div>
    </div>
  );
};
