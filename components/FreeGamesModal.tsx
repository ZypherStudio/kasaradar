"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Search,
  Gift,
  ShieldCheck,
  Send,
  RefreshCw,
  Trophy
} from "lucide-react";

interface FreeGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = "all" | "free" | "steam" | "epic" | "f2p";

export const FreeGamesModal: React.FC<FreeGamesModalProps> = ({ isOpen, onClose }) => {
  const [games, setGames] = useState<FreeGameDeal[]>(FREE_GAMES_DATABASE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch live deals from /api/games/free-deals
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function fetchLiveDeals() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/games/free-deals");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.games && data.games.length > 0) {
            setGames(data.games);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic games, using database:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchLiveDeals();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Filter and search games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = game.title.toLowerCase().includes(q);
        const matchGenre = game.genre.toLowerCase().includes(q);
        const matchDesc = game.description.toLowerCase().includes(q);
        if (!matchTitle && !matchGenre && !matchDesc) return false;
      }

      // 2. Category Filter
      if (filter === "free") return game.discountedPrice === 0;
      if (filter === "steam") return game.platform === "steam";
      if (filter === "epic") return game.platform === "epic";
      if (filter === "f2p") return game.badge === "OYNAMASI ÜCRETSİZ";
      return true;
    });
  }, [games, filter, searchQuery]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
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
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Canlı Tarama
                  </span>
                </h2>
                <p className="text-[11px] text-neutral-400 hidden sm:block">
                  Epic Games Store, Steam ve popüler platformlardaki tüm ücretsiz ve indirimli hit oyunlar
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
        <div className="p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {/* Highlight Banner */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-amber-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Epic Games Bu Hafta Ücretsiz Dağıtıyor!</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-neutral-950 font-black">
                    0 TL
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-300 mt-0.5">
                  Out of Sight ve TerraScape kütüphanene eklersen ömür boyu senin kalıyor. Süresi bitmeden kap!
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

          {/* Search Bar & Filters Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Oyun ara (örn: RDR2, GTA, CS2, Cyberpunk, Witcher)..."
                className="w-full pl-9 pr-9 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none shrink-0">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  filter === "all"
                    ? "bg-white text-neutral-950 shadow-md font-bold"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                Tümü ({games.length})
              </button>
              <button
                onClick={() => setFilter("free")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  filter === "free"
                    ? "bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>0 TL Bedava</span>
              </button>
              <button
                onClick={() => setFilter("steam")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  filter === "steam"
                    ? "bg-sky-500 text-neutral-950 font-bold shadow-md shadow-sky-500/20"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Steam Kelepir</span>
              </button>
              <button
                onClick={() => setFilter("f2p")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  filter === "f2p"
                    ? "bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Hit F2P</span>
              </button>
              <button
                onClick={() => setFilter("epic")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  filter === "epic"
                    ? "bg-purple-500 text-neutral-950 font-bold shadow-md"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Epic Games</span>
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-3 text-xs text-neutral-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Canlı Steam ve Epic Games fırsatları taranıyor...</span>
            </div>
          )}

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredGames.map((game) => {
              const isFree = game.discountedPrice === 0;

              return (
                <div
                  key={game.id}
                  className="group relative rounded-2xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 overflow-hidden transition-all flex flex-col justify-between shadow-sm hover:shadow-xl"
                >
                  {/* Top Image Banner with Official Capsule Art */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-neutral-950">
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                    {/* Platform Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-neutral-950/85 backdrop-blur-md border border-neutral-700/80 text-white text-[10px] font-bold">
                        {game.platformName}
                      </span>
                      {game.isPermanent && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          Kalıcı
                        </span>
                      )}
                    </div>

                    {/* Discount or Free Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {isFree ? (
                        <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 text-xs font-black shadow-lg shadow-emerald-500/30">
                          {game.badge === "OYNAMASI ÜCRETSİZ" ? "0 TL • F2P" : "0 TL • BEDAVA"}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-red-500 text-white text-xs font-black shadow-md">
                          -%{game.discountPercent}
                        </span>
                      )}
                    </div>

                    {/* Expiration Timer badge */}
                    <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-[10px] text-amber-300 font-medium bg-neutral-950/85 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{game.endDateReadable}</span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-neutral-400 mb-1">
                        <span className="line-clamp-1">{game.genre}</span>
                        <span className="text-amber-400 font-semibold shrink-0">{game.rating}</span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {game.title}
                      </h3>

                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    {/* Price and CTA Buttons */}
                    <div className="mt-3.5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                      <div>
                        {game.originalPrice > 0 && (
                          <div className="text-[10px] text-neutral-500 line-through">
                            {game.originalPrice} {game.currency}
                          </div>
                        )}
                        <div className="text-sm sm:text-base font-black text-white">
                          {isFree ? (
                            <span className="text-emerald-400 font-black">
                              {game.badge === "OYNAMASI ÜCRETSİZ" ? "ÜCRETSİZ OYNA" : "0 TL BEDAVA"}
                            </span>
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
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-md cursor-pointer ${
                            isFree
                              ? "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black shadow-emerald-500/20"
                              : "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                          }`}
                        >
                          <span>{isFree ? "Kütüphaneye Ekle" : "Mağazada Gör"}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-12 text-neutral-400 space-y-2">
              <Gamepad2 className="w-8 h-8 mx-auto text-neutral-600" />
              <p className="text-sm font-semibold text-neutral-300">Aramanıza uygun oyun bulunamadı.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilter("all");
                }}
                className="text-xs text-emerald-400 hover:underline"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}

          {/* Growth & Telegram Bar inside Modal */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  Bedava Oyunları ve %90 İndirimleri Anında Bildirimle Al!
                </p>
                <p className="text-[11px] text-neutral-400">
                  Telegram botumuz her Perşembe ve Steam indirimlerinde kanala anında sinyal gönderir.
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
