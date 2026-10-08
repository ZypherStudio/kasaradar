"use client";

import React, { useState } from "react";
import { FreeGameDeal, FREE_GAMES_DATABASE } from "@/lib/freeGamesData";
import {
  Gamepad2,
  X,
  ArrowLeft,
  Flame,
  Clock,
  Sparkles,
  ExternalLink,
  Share2,
  Check,
  Tag,
  Gift,
  ShieldCheck,
  Send
} from "lucide-react";

interface FreeGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = "all" | "free" | "steam" | "epic";

export const FreeGamesModal: React.FC<FreeGamesModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredGames = FREE_GAMES_DATABASE.filter((game) => {
    if (filter === "free") return game.discountedPrice === 0;
    if (filter === "steam") return game.platform === "steam";
    if (filter === "epic") return game.platform === "epic";
    return true;
  });

  const handleShare = (game: FreeGameDeal) => {
    const shareText =
      game.discountedPrice === 0
        ? `🔥 Kanka koş! ${game.title} şu an ${game.platformName}'da 0 TL / BEDAVA! Son gün: ${game.endDateReadable}. Detaylar: https://www.kasaradar.com#bedava-oyunlar`
        : `⚡ Steam'de dev indirim: ${game.title} %${game.discountPercent} indirimle ${game.discountedPrice} ${game.currency}! Detaylar: https://www.kasaradar.com#bedava-oyunlar`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(game.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all active:scale-95 cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Geri Dön"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Geri</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  Bedava &amp; Kelepir Oyunlar Radarı
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase tracking-wider">
                    Haftalık Güncel
                  </span>
                </h2>
                <p className="text-[11px] text-neutral-400 hidden sm:block">
                  Epic Games, Steam ve GOG&apos;da kaçırılmayacak ücretsiz oyunlar ve %90&apos;a varan kelepir fırsatlar
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          {/* Highlight Banner */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-amber-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Bu Hafta Epic Games&apos;te 2 Dev Oyun Tamamen 0 TL!</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-neutral-950 font-black">
                    KAP
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-300 mt-0.5">
                  Ghostrunner 2 ve The Outer Worlds kütüphanene eklersen ömür boyu senin kalıyor. Süre dolmadan al!
                </p>
              </div>
            </div>

            <a
              href="https://store.epicgames.com/tr/free-games"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            >
              <span>Epic Store&apos;da Kap</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filter === "all"
                  ? "bg-white text-neutral-950 shadow-md"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              Tüm Fırsatlar ({FREE_GAMES_DATABASE.length})
            </button>
            <button
              onClick={() => setFilter("free")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                filter === "free"
                  ? "bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sadece 0 TL Bedava ({FREE_GAMES_DATABASE.filter((g) => g.discountedPrice === 0).length})</span>
            </button>
            <button
              onClick={() => setFilter("steam")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                filter === "steam"
                  ? "bg-sky-500 text-neutral-950 font-bold shadow-md shadow-sky-500/20"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-sky-400" />
              <span>Steam Kelepir ({FREE_GAMES_DATABASE.filter((g) => g.platform === "steam").length})</span>
            </button>
            <button
              onClick={() => setFilter("epic")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                filter === "epic"
                  ? "bg-purple-500 text-neutral-950 font-bold shadow-md"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Epic Games ({FREE_GAMES_DATABASE.filter((g) => g.platform === "epic").length})</span>
            </button>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredGames.map((game) => {
              const isFree = game.discountedPrice === 0;

              return (
                <div
                  key={game.id}
                  className="group relative rounded-2xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 overflow-hidden transition-all flex flex-col justify-between"
                >
                  {/* Top Image Banner */}
                  <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-neutral-900">
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                    {/* Platform Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-neutral-700/80 text-white text-[10px] font-bold">
                        {game.platformName}
                      </span>
                      {game.isPermanent && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          Ömür Boyu Senin
                        </span>
                      )}
                    </div>

                    {/* Discount or Free Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {isFree ? (
                        <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 text-xs font-black shadow-lg shadow-emerald-500/30 animate-pulse">
                          0 TL • BEDAVA
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-red-500 text-white text-xs font-black shadow-md">
                          -%{game.discountPercent}
                        </span>
                      )}
                    </div>

                    {/* Expiration Timer badge */}
                    <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-[11px] text-amber-300 font-medium bg-neutral-950/80 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{game.endDateReadable}</span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-neutral-400 mb-1">
                        <span>{game.genre}</span>
                        <span className="text-amber-400 font-semibold">{game.rating}</span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {game.title}
                      </h3>

                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    {/* Price and CTA Buttons */}
                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] text-neutral-500 line-through">
                          {game.originalPrice} {game.currency}
                        </div>
                        <div className="text-base sm:text-lg font-black text-white">
                          {isFree ? (
                            <span className="text-emerald-400">ÜCRETSİZ</span>
                          ) : (
                            <span className="text-white">
                              {game.discountedPrice} {game.currency}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Share Button */}
                        <button
                          onClick={() => handleShare(game)}
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                          title="Arkadaşına Paylaş / Kopyala"
                        >
                          {copiedId === game.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                        </button>

                        {/* Store Link */}
                        <a
                          href={game.storeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-md cursor-pointer ${
                            isFree
                              ? "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20 font-black"
                              : "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                          }`}
                        >
                          <span>{isFree ? "Ücretsiz Al" : "Mağazada Gör"}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Growth & Telegram Bar inside Modal */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  Bedava Oyunları Anında Bildirimle Almak İster misin?
                </p>
                <p className="text-[11px] text-neutral-400">
                  Telegram botumuz her Perşembe yeni bedava oyun çıktığında kanala otomatik atıyor.
                </p>
              </div>
            </div>

            <a
              href="https://t.me/+Voua-sJ4TVJiZjc8"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95 shrink-0"
            >
              Telegram Kanalına Katıl
            </a>
          </div>
        </div>

        {/* Modal Bottom Mobile Back Bar */}
        <div className="px-4 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kapat ve Kasalara Dön</span>
          </button>
        </div>
      </div>
    </div>
  );
};
