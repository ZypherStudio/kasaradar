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
  Clock,
  Key
} from "lucide-react";

interface TelegramAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramAdminModal: React.FC<TelegramAdminModalProps> = ({
  isOpen,
  onClose
}) => {
  const [token, setToken] = useState("");
  const [channelId, setChannelId] = useState("https://t.me/+Voua-sJ4TVJiZjc8");
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

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

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/telegram-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, channelId })
      });
      const data = await res.json();

      if (data.success) {
        setIsConfigured(true);
        setStatusMessage({ text: "✅ Bot Token başarıyla kaydedildi! Artık tek tıkla ilan atabilirsiniz.", type: "success" });
      } else {
        setStatusMessage({ text: `❌ Hata: ${data.error || "Kaydedilemedi"}`, type: "error" });
      }
    } catch (err: any) {
      setStatusMessage({ text: `❌ Bağlantı hatası: ${err.message}`, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBroadcastNow = async () => {
    setIsBroadcasting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/telegram-broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, channelId })
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
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold">
              <Bot className="w-3.5 h-3.5 text-sky-400" />
              <span>KASARADAR OTOMATİK YAYINCI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Telegram Bot Yönetim Paneli
            </h2>
            <p className="text-xs text-neutral-400">
              Terminal komutlarıyla uğraşmadan kanalınıza otomatik ilan gönderin ve bot durumunu yönetin.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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

        {/* Live Channel Connection Card */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Send className="w-4 h-4 text-sky-400" />
              Hedef Telegram Kanalı
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
              BAĞLI
            </span>
          </div>
          <div className="text-xs font-mono text-white truncate bg-neutral-900 p-2 rounded-lg border border-neutral-800">
            {channelId}
          </div>
          <p className="text-[11px] text-neutral-400">
            Bot bu kanala yönetici olarak eklendiğinde mesajlar doğrudan bu adrese gidecektir.
          </p>
        </div>

        {/* Token Input Form */}
        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Telegram Bot Token (@BotFather)
              </span>
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline text-[11px] font-normal flex items-center gap-0.5"
              >
                <span>@BotFather&apos;ı Aç</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Örn: 7123456789:AAFlxyz..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
            />
            <span className="text-[10px] text-neutral-500 block">
              *Telegram&apos;da @BotFather&apos;a &quot;/newbot&quot; yazıp aldığınız token kodunu buraya yapıştırın veya bana chat&apos;ten iletin, ben kaydedeyim.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Kaydediliyor..." : "Bot Token'ı Kaydet & Bağla"}
          </button>
        </form>

        {/* Direct Action: Broadcast Now Button */}
        <div className="pt-2 border-t border-neutral-800 space-y-3">
          <button
            onClick={handleBroadcastNow}
            disabled={isBroadcasting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isBroadcasting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>İlan Kanala Gönderiliyor...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>🚀 Şimdi Kanala Canlı İlan Gönder (Test Et)</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-neutral-400">
            Butona bastığınızda günün en yüksek F/P hazır kasası otomatik olarak Telegram kanalınıza gönderilir.
          </p>
        </div>
      </div>
    </div>
  );
};
