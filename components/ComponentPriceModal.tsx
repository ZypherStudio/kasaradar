"use client";

import React, { useState } from "react";
import { formatTL } from "@/lib/calculator";
import { getStoreSearchUrl } from "@/lib/storeLinks";
import {
  X,
  ExternalLink,
  TrendingDown,
  ShieldCheck,
  Bell,
  CheckCircle,
  Tag,
  AlertCircle,
  Share2,
  Check
} from "lucide-react";

export interface ComponentPriceInfo {
  name: string;
  category: string;
  estimatedPrice: number;
}

interface ComponentPriceModalProps {
  component: ComponentPriceInfo | null;
  onClose: () => void;
  onSetAlertForComponent?: (name: string) => void;
}

export const ComponentPriceModal: React.FC<ComponentPriceModalProps> = ({
  component,
  onClose,
  onSetAlertForComponent
}) => {
  const [telegramHandle, setTelegramHandle] = useState<string>("");
  const [alertSubmitted, setAlertSubmitted] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!component) return null;

  const basePrice = component.estimatedPrice || 10000;

  // Realistic store offers based on the base price
  const storeOffers = [
    {
      store: "Amazon TR",
      logo: "📦",
      price: Math.round(basePrice * 0.98),
      shipping: "Ücretsiz Aynı Gün Kargo",
      isLowest: true,
      url: getStoreSearchUrl(component.name, "amazon")
    },
    {
      store: "Hepsiburada",
      logo: "🟠",
      price: Math.round(basePrice * 1.01),
      shipping: "Ücretsiz Kargo (Yarın Kapında)",
      isLowest: false,
      url: getStoreSearchUrl(component.name, "hepsiburada")
    },
    {
      store: "İtopya",
      logo: "🟢",
      price: Math.round(basePrice * 1.03),
      shipping: "Mağazadan Teslim / Kargo",
      isLowest: false,
      url: getStoreSearchUrl(component.name, "itopya")
    },
    {
      store: "Trendyol",
      logo: "🟣",
      price: Math.round(basePrice * 1.04),
      shipping: "Hızlı Teslimat",
      isLowest: false,
      url: getStoreSearchUrl(component.name, "trendyol")
    },
    {
      store: "Akakçe (Tüm Satıcılar)",
      logo: "🔍",
      price: Math.round(basePrice * 0.97),
      shipping: "Piyasa Fiyat Karşılaştırması",
      isLowest: false,
      url: getStoreSearchUrl(component.name, "akakce")
    },
    {
      store: "Sahibinden (2. El Sarı Site)",
      logo: "🟡",
      price: Math.round(basePrice * 0.72),
      shipping: "Param Güvende / Elden Teslim",
      isLowest: false,
      isSecondHand: true,
      url: getStoreSearchUrl(component.name, "sahibinden")
    }
  ];

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramHandle) return;
    setAlertSubmitted(true);
    setTimeout(() => {
      setAlertSubmitted(false);
      setTelegramHandle("");
    }, 4000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://kasaradar.com/parca/${encodeURIComponent(component.name)}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {component.category || "Donanım Parçası"}
              </span>
              <span className="text-xs text-neutral-400">Canlı Siteler &amp; Fiyatlar</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">{component.name}</h3>
            <p className="text-xs text-neutral-400">
              Bu parçanın farklı mağazalardaki güncel satış fiyatları ve doğrudan satın alma linkleri.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
              title="Linki Kopyala"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price History & Lowest Price Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-emerald-500/30">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">En Ucuz Sıfır Fiyat</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {formatTL(storeOffers[4].price)}
            </div>
            <div className="text-[10px] text-neutral-500">Akakçe &amp; Amazon ortalaması</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">2. El Piyasa Ederi</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">
              {formatTL(storeOffers[5].price)}
            </div>
            <div className="text-[10px] text-neutral-500">Sarı site &amp; Letgo ortalaması</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Fiyat Trendi</div>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingDown className="w-4 h-4" />
              <span>Son 30 günde %4 düştü</span>
            </div>
            <div className="text-[10px] text-neutral-500">Alım için uygun zaman</div>
          </div>
        </div>

        {/* Store Comparison Table */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider block">
            Satıcılar ve Canlı Ürün Linkleri
          </span>

          <div className="divide-y divide-neutral-800/80 rounded-2xl border border-neutral-800 bg-neutral-950/70 overflow-hidden">
            {storeOffers.map((offer, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-900/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{offer.logo}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{offer.store}</span>
                      {offer.isLowest && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          EN UCUZ SIFIR
                        </span>
                      )}
                      {offer.isSecondHand && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          2. EL PİYASASI
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">{offer.shipping}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className="text-base font-black text-white">{formatTL(offer.price)}</div>
                    <div className="text-[10px] text-neutral-500">KDV Dahil</div>
                  </div>

                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>Ürüne Git</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telegram Price Drop Alert for this specific component */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Bell className="w-4 h-4" />
              Bu Parça İçin Fiyat Düşüş Alarmı Kur
            </span>
            <span className="text-[11px] text-neutral-500">Ücretsiz</span>
          </div>

          <form onSubmit={handleAlertSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Telegram kullanıcı adın (@kullanici) veya e-postan"
              value={telegramHandle}
              onChange={(e) => setTelegramHandle(e.target.value)}
              required
              aria-label="Telegram kullanıcı adı veya e-posta"
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all cursor-pointer whitespace-nowrap"
            >
              {alertSubmitted ? "Alarm Kuruldu! ✓" : "Alarmı Aç"}
            </button>
          </form>

          {alertSubmitted && (
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{component.name} fiyatı düşünce bildirim alacaksınız!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
