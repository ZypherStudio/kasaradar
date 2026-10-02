"use client";

import React, { useState } from "react";
import { DealAlert, PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  Bell,
  TrendingDown,
  Clock,
  Sparkles,
  Send,
  CheckCircle,
  ExternalLink,
  Flame,
  ShieldCheck,
  Zap
} from "lucide-react";

interface DealsModuleProps {
  deals: DealAlert[];
  systems: PrebuiltSystem[];
  onSelectSystem: (system: PrebuiltSystem) => void;
}

export const DealsModule: React.FC<DealsModuleProps> = ({
  deals,
  systems,
  onSelectSystem
}) => {
  const [targetSystemId, setTargetSystemId] = useState<string>(systems[0].id);
  const [targetPrice, setTargetPrice] = useState<number>(systems[0].price - 2000);
  const [notificationContact, setNotificationContact] = useState<string>("");
  const [alertSaved, setAlertSaved] = useState<boolean>(false);

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationContact) return;
    setAlertSaved(true);
    setTimeout(() => {
      setAlertSaved(false);
      setNotificationContact("");
    }, 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
          <Bell className="w-3.5 h-3.5" />
          <span>Fiyatı Düşen Sistemler &amp; Canlı İndirim Nöbetçisi</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Fırsat Radarı &amp; Alarm Merkezi
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400">
          Mağazalardaki ani fiyat düşüşlerini ve gece indirimlerini anlık yakalayın. İstediğiniz kasa için fiyat alarmı kurun, fiyat düştüğü saniye haberiniz olsun.
        </p>
      </div>

      {/* Grid: Live Deals Feed on Left (7 cols), Custom Alert Form on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Live Deals (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              Son 24 Saatin En Sıcak İndirimleri
            </span>
            <span className="text-xs text-emerald-400 font-bold">Canlı Akış</span>
          </div>

          <div className="space-y-3">
            {deals.map((deal) => {
              const matchingSys = systems.find((s) => s.id === deal.systemId) || systems[0];
              const diff = deal.oldPrice - deal.newPrice;

              return (
                <div
                  key={deal.id}
                  className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {deal.seller}
                      </span>
                      <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {deal.timeAgo}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {deal.systemTitle}
                    </h4>

                    <div className="text-xs text-neutral-400">
                      {matchingSys.gpu} • {matchingSys.cpu.split("(")[0]}
                    </div>
                  </div>

                  {/* Price info & CTA */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500 line-through">
                        {formatTL(deal.oldPrice)}
                      </span>
                      <span className="text-base font-black text-emerald-400">
                        {formatTL(deal.newPrice)}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      -%{deal.dropPercentage} İndirim ({formatTL(diff)} Kâr)
                    </span>

                    <button
                      onClick={() => onSelectSystem(matchingSys)}
                      className="mt-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    >
                      Detayları Gör &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Custom Price Alert Setup (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-900/95 border border-emerald-500/40 space-y-5 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4" />
                Özel Fiyat Alarmı Kur
              </span>
              <h3 className="text-lg font-black text-white">İstediğin Fiyata Düşünce Haber Verelim</h3>
              <p className="text-xs text-neutral-400">
                Hedeflediğin kasanın fiyatı belirttiğin tutara ulaştığında sana anında e-posta veya Telegram bildirimi gönderelim.
              </p>
            </div>

            <form onSubmit={handleSaveAlert} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Takip Edilecek Hazır Kasa:
                </label>
                <select
                  value={targetSystemId}
                  onChange={(e) => {
                    setTargetSystemId(e.target.value);
                    const s = systems.find((sys) => sys.id === e.target.value);
                    if (s) setTargetPrice(s.price - 2000);
                  }}
                  aria-label="Takip edilecek hazır kasa seçimi"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {systems.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.seller} - {s.title} ({formatTL(s.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-neutral-300 mb-1.5">
                  <span>Hedef Fiyatın (TL):</span>
                  <span className="text-emerald-400 font-bold">{formatTL(targetPrice)}</span>
                </div>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  aria-label="Hedef fiyatı belirleyin"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  E-Posta Adresin veya Telegram Kullanıcı Adın:
                </label>
                <input
                  type="text"
                  placeholder="ornek@gmail.com veya @kullaniciadi"
                  value={notificationContact}
                  onChange={(e) => setNotificationContact(e.target.value)}
                  required
                  aria-label="İletişim bilgisi girin"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {alertSaved ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Harika! Fiyat alarmı kuruldu. Fiyat düşünce bildireceğiz.</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Fiyat Alarmını Aktif Et</span>
                </button>
              )}
            </form>

            {/* Telegram Community VIP Card */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>KasaRadar Telegram Fırsat Kanalı</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                4.200&apos;den fazla donanımcı ve al-satçının olduğu kanala katıl, gece düşen kelepir ilanları herkesten önce yakala.
              </p>
              <button
                onClick={() => alert("KasaRadar VIP Telegram Kanalına Yönlendiriliyorsunuz! (Simülasyon)")}
                className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Telegram Kanalına Katıl</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
