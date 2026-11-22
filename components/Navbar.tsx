"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Zap,
  Monitor,
  Sparkles,
  Scale,
  Bell,
  SlidersHorizontal,
  Heart,
  User,
  Headphones,
  Gift,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  LayoutGrid,
  ChevronRight
} from "lucide-react";
import { UserAccount } from "./AuthModal";
import { Logo } from "./Logo";

export type NavTab = "systems" | "fps" | "monitors" | "streamers" | "arbitrage" | "deals";

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenAiAssistant: () => void;
  comparisonCount: number;
  onOpenComparison: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  user: UserAccount | null;
  onOpenAuth: () => void;
  onOpenRewardsModal?: () => void;
  onOpenFreeGames?: () => void;
  onOpenKazikSayar?: () => void;
  onOpenDdosShield?: () => void;
  onOpenUpgradeAdvisor?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiAssistant,
  comparisonCount,
  onOpenComparison,
  favoritesCount,
  onOpenFavorites,
  user,
  onOpenAuth,
  onOpenRewardsModal,
  onOpenFreeGames,
  onOpenKazikSayar,
  onOpenDdosShield,
  onOpenUpgradeAdvisor
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState<boolean>(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Close tools dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsToolsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/90 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div
            className="cursor-pointer shrink-0 transition-transform active:scale-95"
            onClick={() => setActiveTab("systems")}
          >
            <Logo size="sm" />
          </div>

          {/* Navigation Tabs (Centered & Comfortable) */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/90 p-1 rounded-2xl border border-neutral-800/90 shrink-0">
            <button
              onClick={() => setActiveTab("systems")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "systems"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800/70"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Hazır Kasalar</span>
            </button>

            <button
              onClick={() => setActiveTab("fps")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "fps"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800/70"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>FPS Testi</span>
            </button>

            <button
              onClick={() => setActiveTab("monitors")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "monitors"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800/70"
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Ekipman &amp; Monitör</span>
            </button>

            <button
              onClick={() => setActiveTab("streamers")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "streamers"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800/70"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yayıncılar</span>
            </button>

            <button
              onClick={() => setActiveTab("arbitrage")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "arbitrage"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800/70"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Sıfır vs 2. El</span>
            </button>

            <button
              onClick={() => setActiveTab("deals")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "deals"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800/70"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Fırsat Radarı</span>
            </button>
          </nav>

          {/* Quick Actions (Decluttered, Modern & Spacious) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Compare Badge Button (Shows only when items selected) */}
            {comparisonCount > 0 && (
              <button
                onClick={onOpenComparison}
                className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all cursor-pointer"
                title="Karşılaştırma Sepeti"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Kıyasla</span>
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-neutral-950 text-[10px] font-bold">
                  {comparisonCount}
                </span>
              </button>
            )}

            {/* Favorites Heart Button */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-rose-400 transition-all cursor-pointer"
              title="Favorilerim & Fiyat Alarmları"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? "text-rose-500 fill-rose-500" : ""}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black shadow-md shadow-rose-500/30">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Unified Tools Dropdown (Replaces 4 cramped individual buttons) */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isToolsOpen
                    ? "bg-neutral-800 text-white border-neutral-600 shadow-lg shadow-black/40"
                    : "bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border-neutral-800"
                }`}
                title="KasaRadar Akıllı Araçlar"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Araçlar</span>
                <span className="relative flex h-2 w-2 ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                    isToolsOpen ? "rotate-180 text-white" : ""
                  }`}
                />
              </button>

              {/* Tools Dropdown Menu */}
              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-neutral-900/95 backdrop-blur-2xl border border-neutral-700/80 p-2 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Özel Araçlar</span>
                    <span className="text-[10px] text-emerald-400 font-semibold lowercase">4 aktif araç</span>
                  </div>

                  <div className="p-1 space-y-1">
                    {/* Upgrade Advisor */}
                    {onOpenUpgradeAdvisor && (
                      <button
                        onClick={() => {
                          setIsToolsOpen(false);
                          onOpenUpgradeAdvisor();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-800/80 text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500/25 transition-colors">
                            <Zap className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                              <span>Sistem Yükselt</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                                Sihirbaz
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-400 line-clamp-1">
                              En ucuz yoldan FPS artır &amp; 2. el borsa analizi
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    )}

                    {/* Kazık Sayar */}
                    {onOpenKazikSayar && (
                      <button
                        onClick={() => {
                          setIsToolsOpen(false);
                          onOpenKazikSayar();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-800/80 text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/30 group-hover:bg-rose-500/25 transition-colors">
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-rose-300 flex items-center gap-1.5">
                              <span>Kazık Sayar</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-semibold">
                                AI Dedektör
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-400 line-clamp-1">
                              Bu fiyata alınır mı? Kazık analizi yap
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    )}

                    {/* Bedava Oyun */}
                    {onOpenFreeGames && (
                      <button
                        onClick={() => {
                          setIsToolsOpen(false);
                          onOpenFreeGames();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-800/80 text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:bg-amber-500/25 transition-colors">
                            <Gift className="w-4 h-4 text-amber-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                              <span>Bedava Oyunlar</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                                Hediye
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-400 line-clamp-1">
                              Epic Games, Steam &amp; Prime bedava oyunlar
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    )}

                    {/* DDoS & WAF Shield */}
                    {onOpenDdosShield && (
                      <button
                        onClick={() => {
                          setIsToolsOpen(false);
                          onOpenDdosShield();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-800/80 text-left transition-all group cursor-pointer border-t border-neutral-800/60 mt-1"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500/25 transition-colors">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center gap-1.5">
                              <span>DDoS Kalkanı v2.0</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                                Canlı Aktif
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-400 line-clamp-1">
                              WAF &amp; Burst Rate Limiter kalkan durumunu gör
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Button (Flagship Gradient CTA) */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95 shrink-0"
              title="KasaRadar AI Sistem Asistanı"
            >
              <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
              <span className="hidden sm:inline">Sistem AI</span>
            </button>

            {/* User Account Button (Enhanced with Avatar Image & Name) */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-white text-xs font-semibold transition-all cursor-pointer shrink-0"
              title={user?.isLoggedIn ? `${user.name} Profilim` : "Giriş Yap / Kayıt Ol"}
            >
              {user && user.isLoggedIn ? (
                <>
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-neutral-800 border border-emerald-400/60 flex items-center justify-center shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-[11px] font-black text-emerald-400">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline truncate max-w-[85px] text-xs font-bold text-neutral-200">
                    {user.name}
                  </span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="hidden sm:inline text-xs font-bold">Giriş Yap</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 border-t border-neutral-800/80 no-scrollbar">
          <button
            onClick={() => setActiveTab("systems")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "systems" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Hazır Kasalar
          </button>
          <button
            onClick={() => setActiveTab("fps")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "fps" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            FPS Testi
          </button>
          <button
            onClick={() => setActiveTab("monitors")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "monitors" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Ekipman &amp; Monitör
          </button>
          <button
            onClick={() => setActiveTab("streamers")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "streamers" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Yayıncılar
          </button>
          <button
            onClick={() => setActiveTab("arbitrage")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "arbitrage" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            2. El vs Sıfır
          </button>
          <button
            onClick={() => setActiveTab("deals")}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "deals" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Fırsat Alarmı
          </button>
        </div>
      </div>
    </header>
  );
};
