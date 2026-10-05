"use client";

import React from "react";
import { Zap, Monitor, Sparkles, Scale, Bell, SlidersHorizontal, Tv, Heart, User, Headphones, Bot } from "lucide-react";
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
  onOpenRewardsModal
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/85 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Handcrafted Vector Logo */}
          <div className="cursor-pointer" onClick={() => setActiveTab("systems")}>
            <Logo size="sm" />
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800 shrink-0">
            <button
              onClick={() => setActiveTab("systems")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "systems"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Hazır Kasalar</span>
              <span className="inline xl:hidden">Kasalar</span>
            </button>

            <button
              onClick={() => setActiveTab("fps")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "fps"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>FPS Testi</span>
            </button>

            <button
              onClick={() => setActiveTab("monitors")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "monitors"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Ekipman &amp; Monitör</span>
              <span className="inline xl:hidden">Ekipman</span>
            </button>

            <button
              onClick={() => setActiveTab("streamers")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "streamers"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yayıncılar</span>
            </button>

            <button
              onClick={() => setActiveTab("arbitrage")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "arbitrage"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Sıfır vs 2. El</span>
              <span className="inline xl:hidden">2. El</span>
            </button>

            <button
              onClick={() => setActiveTab("deals")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "deals"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Fırsat Radarı</span>
              <span className="inline xl:hidden">Fırsatlar</span>
            </button>
          </nav>

          {/* Quick Actions (AI Assistant + Compare + Favorites + User Account) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Compare Badge Button */}
            {comparisonCount > 0 && (
              <button
                onClick={onOpenComparison}
                className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all cursor-pointer"
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
              className="relative p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-rose-400 transition-all cursor-pointer"
              title="Favorilerim & Telegram Bildirimleri"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? "text-rose-500 fill-rose-500" : ""}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem AI</span>
            </button>

            {/* User Account / Profile Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              {user && user.isLoggedIn ? (
                <>
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center text-[10px] font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline truncate max-w-[80px]">{user.name}</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="hidden sm:inline">Giriş Yap</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-neutral-800/80 no-scrollbar">
          <button
            onClick={() => setActiveTab("systems")}
            className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium ${
              activeTab === "systems" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400"
            }`}
          >
            Hazır Kasalar
          </button>
          <button
            onClick={() => setActiveTab("fps")}
            className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium ${
              activeTab === "fps" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400"
            }`}
          >
            FPS Testi
          </button>
          <button
            onClick={() => setActiveTab("monitors")}
            className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium ${
              activeTab === "monitors" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400"
            }`}
          >
            Ekipman &amp; Monitör
          </button>
          <button
            onClick={() => setActiveTab("streamers")}
            className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium ${
              activeTab === "streamers" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400"
            }`}
          >
            Yayıncılar
          </button>
          <button
            onClick={() => setActiveTab("arbitrage")}
            className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium ${
              activeTab === "arbitrage" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400"
            }`}
          >
            2. El vs Sıfır
          </button>
          <button
            onClick={() => setActiveTab("deals")}
            className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium ${
              activeTab === "deals" ? "bg-emerald-500 text-neutral-950 font-bold" : "text-neutral-400"
            }`}
          >
            Fırsat Alarmı
          </button>
        </div>
      </div>
    </header>
  );
};
