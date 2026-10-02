"use client";

import React, { useState } from "react";
import { formatTL } from "@/lib/calculator";
import {
  Mail,
  X,
  Send,
  CheckCircle,
  Sparkles,
  ExternalLink,
  Tag,
  Clock,
  Shield,
  Zap,
  Info
} from "lucide-react";
import { Logo } from "./Logo";

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  originalPrice?: number;
  newPrice?: number;
  imageUrl?: string;
  storeName?: string;
  directUrl?: string;
  userEmail?: string;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({
  isOpen,
  onClose,
  productName = "ModArt-X1 V2 Gaming Sistem (RTX 4060 / Ryzen 5 5600)",
  originalPrice = 25499,
  newPrice = 22999,
  imageUrl = "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
  storeName = "İtopya",
  directUrl = "https://www.itopya.com/AramaSonuclari/?q=modart&ref=kasaradar",
  userEmail = "zypherstudio@gmail.com"
}) => {
  const [recipient, setRecipient] = useState<string>(userEmail);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const discountAmount = originalPrice - newPrice;
  const discountRate = Math.round((discountAmount / originalPrice) * 100);

  const handleSendEmail = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
      }, 5000);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
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
            <Mail className="w-3.5 h-3.5" />
            <span>Özel Formatlı Fiyat Düşüş E-Posta Şablonu</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            KasaRadar Canlı İndirim E-Posta Simülatörü
          </h3>
          <p className="text-xs text-neutral-400">
            Fiyat takip motoru indirim yakaladığında kullanıcılara iletilen özel tasarımlı HTML bülten mektubudur.
          </p>
        </div>

        {/* Recipient Target Box */}
        <div className="flex flex-col sm:flex-row items-center gap-2 p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
          <span className="text-xs font-semibold text-neutral-400 whitespace-nowrap">
            Alıcı E-posta Adresi:
          </span>
          <input
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="flex-1 w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-semibold focus:outline-none focus:border-emerald-500"
            placeholder="zypherstudio@gmail.com"
          />
          <button
            onClick={handleSendEmail}
            disabled={isSending}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isSending ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></span>
                Gönderiliyor...
              </span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>E-Postayı Gönder</span>
              </>
            )}
          </button>
        </div>

        {/* Success Alert Toast */}
        {sentSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Başarılı! Özel indirim bildirimi <b>{recipient}</b> adresine anında gönderildi. (Gelen Kutusu / Spam kontrol edin)
            </span>
          </div>
        )}

        {/* E-MAIL CLIENT PREVIEW FRAME */}
        <div className="rounded-2xl border border-neutral-700 bg-neutral-950 shadow-inner overflow-hidden">
          {/* Email Client Header bar */}
          <div className="p-3 bg-neutral-900/90 border-b border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-300">Kimden:</span>
              <span className="text-emerald-400">KasaRadar Fiyat Botu &lt;radar@kasaradar.com&gt;</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-300">Kime:</span>
              <span>{recipient}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-300">Konu:</span>
              <span className="text-white font-bold">
                🔥 FİYAT DÜŞTÜ! [{storeName}] {productName} için %{discountRate} İndirim Fırsatı!
              </span>
            </div>
          </div>

          {/* Email Body Content */}
          <div className="p-6 bg-neutral-950 text-neutral-200 space-y-5 text-xs font-sans">
            {/* Logo and Brand Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <Logo size="sm" />
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase tracking-wider">
                ⚡ Anlık Fırsat Alarmı
              </span>
            </div>

            {/* Email Greeting */}
            <div className="space-y-1">
              <h4 className="text-base font-black text-white">
                Merhaba Donanım Avcısı,
              </h4>
              <p className="text-neutral-400 leading-relaxed">
                Takip listene eklediğin donanımda beklenen fiyat kırılması gerçekleşti! Aşağıdaki sistem mağazada indirime girdi:
              </p>
            </div>

            {/* Product Feature Card */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-emerald-500/40 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-black shrink-0 border border-neutral-800">
                  <img
                    src={imageUrl}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {storeName}
                    </span>
                    <span className="text-[10px] text-neutral-500">Stok: Sınırlı Sayıda</span>
                  </div>
                  <h5 className="font-black text-white text-sm">
                    {productName}
                  </h5>

                  {/* Price Comparison Block */}
                  <div className="flex items-baseline gap-3 pt-1">
                    <div className="text-2xl font-black text-emerald-400">
                      {formatTL(newPrice)}
                    </div>
                    {originalPrice > newPrice && (
                      <div className="text-xs text-neutral-500 line-through">
                        {formatTL(originalPrice)}
                      </div>
                    )}
                    <div className="ml-auto text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      -{formatTL(discountAmount)} Net Tasarruf
                    </div>
                  </div>
                </div>
              </div>

              {/* Call To Action Direct Link Button */}
              <div className="pt-2">
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all text-center block"
                >
                  <span>Mağazada İndirimli Fiyatla Hemen Satın Al</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Email Footer & Legal info */}
            <div className="pt-4 border-t border-neutral-800 text-[10px] text-neutral-500 space-y-1.5 leading-relaxed">
              <p>
                Bu e-posta, <b>KasaRadar</b> üzerinde kurmuş olduğunuz fiyat takip alarmı doğrultusunda otomatik olarak gönderilmiştir.
              </p>
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-neutral-900 font-bold text-neutral-400">
                <span>ZYPHERSTUDIO • YAPIMCI</span>
                <span>zypherstudio@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
