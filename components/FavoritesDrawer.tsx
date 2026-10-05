"use client";

import React, { useState } from "react";
import { PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import { UserAccount } from "./AuthModal";
import {
  X,
  Heart,
  Trash2,
  ExternalLink,
  Send,
  Mail,
  Zap,
  CheckCircle2,
  BellRing,
  Info
} from "lucide-react";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteSystems: PrebuiltSystem[];
  onRemoveFavorite: (id: string) => void;
  onOpenSystemDetail: (system: PrebuiltSystem) => void;
  user: UserAccount | null;
  onOpenAuth: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favoriteSystems,
  onRemoveFavorite,
  onOpenSystemDetail,
  user,
  onOpenAuth
}) => {
  const [telegramSimulatedAlert, setTelegramSimulatedAlert] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestTelegramNotification = (system: PrebuiltSystem) => {
    const handle = user?.telegram || "@KasaRadarUyesi";
    setTelegramSimulatedAlert(
      `🔔 KasaRadar Bot Bildirimi (${handle}):\n"${system.title}" için gece indirimi başladı! Fiyat ${formatTL(
        system.price + 2500
      )} yerine ${formatTL(system.price)} oldu. Kaçırmadan al!`
    );
    setTimeout(() => {
      setTelegramSimulatedAlert(null);
    }, 6000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <div>
                <h3 className="text-base font-black text-white">Favori Sistemlerim</h3>
                <span className="text-[11px] text-neutral-400">
                  {favoriteSystems.length} adet takip edilen hazır kasa
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Telegram / Email Notification Status Banner */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BellRing className="w-4 h-4 text-amber-400" />
                İndirim Bildirim Kanalları
              </span>
              {user?.isLoggedIn ? (
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Aktif
                </span>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="text-[10px] text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  Hesap Bağla &rarr;
                </button>
              )}
            </div>

            <div className="text-xs text-neutral-400 space-y-1">
              <div className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  Telegram:{" "}
                  <strong className="text-neutral-200">
                    {user?.telegram || "Bağlanmadı (Giriş yapın)"}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  E-Posta:{" "}
                  <strong className="text-neutral-200">
                    {user?.email || "Kayıtlı değil"}
                  </strong>
                </span>
              </div>
            </div>
            <p className="text-[10px] text-neutral-500 pt-1">
              Favorideki kasaların fiyatı düştüğü anda otomatik Telegram ve e-posta bildirimi gönderilir.
            </p>
          </div>

          {/* Simulated Telegram Toast if triggered */}
          {telegramSimulatedAlert && (
            <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500 text-cyan-200 text-xs space-y-1 animate-fade-in shadow-xl">
              <div className="font-bold flex items-center gap-1.5 text-cyan-400">
                <Send className="w-4 h-4" />
                <span>Canlı Telegram Bot Bildirimi Geldi!</span>
              </div>
              <p className="whitespace-pre-line text-[11px] leading-relaxed">
                {telegramSimulatedAlert}
              </p>
            </div>
          )}

          {/* Favorite Systems List */}
          {favoriteSystems.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 space-y-2">
              <Heart className="w-10 h-10 mx-auto text-neutral-700" />
              <p className="text-xs font-semibold text-neutral-300">Henüz favori sistem eklemediniz.</p>
              <p className="text-[11px] text-neutral-500">
                Kasa kartlarındaki kalp simgesine basarak indirimini takip etmek istediğiniz kasaları buraya ekleyin.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteSystems.map((system) => (
                <div
                  key={system.id}
                  className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 block">{system.seller}</span>
                      <h4
                        onClick={() => {
                          onOpenSystemDetail(system);
                          onClose();
                        }}
                        className="text-xs font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1"
                      >
                        {system.title}
                      </h4>
                      <div className="text-[10px] text-neutral-500 mt-0.5">{system.gpu}</div>
                    </div>

                    <button
                      onClick={() => onRemoveFavorite(system.id)}
                      className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                      title="Favorilerden Çıkar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-850">
                    <span className="text-sm font-black text-emerald-400">{formatTL(system.price)}</span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleTestTelegramNotification(system)}
                        className="py-1 px-2 rounded-lg bg-neutral-850 hover:bg-neutral-800 text-[10px] text-cyan-400 font-semibold border border-cyan-500/20 transition-all cursor-pointer flex items-center gap-1"
                        title="Telegram Bildirimini Test Et"
                      >
                        <Send className="w-2.5 h-2.5" />
                        <span>Test Et</span>
                      </button>

                      <a
                        href={system.directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-[10px] flex items-center gap-1 transition-all"
                      >
                        <span>Satın Al</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom footer button */}
        <div className="pt-4 border-t border-neutral-800 text-center">
          <p className="text-[10px] text-neutral-500">
            KasaRadar Fırsat Takip Motoru • Tarayıcınızda otomatik kaydedilir
          </p>
        </div>
      </div>
    </div>
  );
};
