"use client";

import React from "react";
import { Monitor, Zap, Sparkles, Swords, Scale } from "lucide-react";
import { NavTab } from "./Navbar";

interface MobileBottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenPcRecommender: () => void;
  onOpenVersusArena: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenPcRecommender,
  onOpenVersusArena,
}) => {
  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Mobil Alt Gezinme"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/80 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Kasalar */}
        <button
          onClick={() => handleTabClick("systems")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] ${
            activeTab === "systems"
              ? "text-emerald-400 font-bold"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div
            className={`p-1 rounded-lg transition-colors ${
              activeTab === "systems" ? "bg-emerald-500/15" : ""
            }`}
          >
            <Monitor className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Kasalar</span>
        </button>

        {/* 2. FPS Testi */}
        <button
          onClick={() => handleTabClick("fps")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] ${
            activeTab === "fps"
              ? "text-emerald-400 font-bold"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div
            className={`p-1 rounded-lg transition-colors ${
              activeTab === "fps" ? "bg-emerald-500/15" : ""
            }`}
          >
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none">FPS Testi</span>
        </button>

        {/* 3. Bana PC Öner (Sihirbaz) - Vurgulu Orta Buton */}
        <button
          onClick={onOpenPcRecommender}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-neutral-300 hover:text-white transition-all cursor-pointer min-w-[56px] group"
        >
          <div className="p-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 shadow-md shadow-emerald-500/30 group-active:scale-95 transition-transform">
            <Sparkles className="w-5 h-5 font-black" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold text-emerald-400 leading-none">
            PC Öner
          </span>
        </button>

        {/* 4. Kasa Kapışması (Versus) */}
        <button
          onClick={onOpenVersusArena}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-neutral-400 hover:text-purple-300 transition-all cursor-pointer min-w-[56px]"
        >
          <div className="p-1 rounded-lg">
            <Swords className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Versus</span>
        </button>

        {/* 5. 2. El Arbitraj */}
        <button
          onClick={() => handleTabClick("arbitrage")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[56px] ${
            activeTab === "arbitrage"
              ? "text-emerald-400 font-bold"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div
            className={`p-1 rounded-lg transition-colors ${
              activeTab === "arbitrage" ? "bg-emerald-500/15" : ""
            }`}
          >
            <Scale className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none">2. El</span>
        </button>
      </div>
    </nav>
  );
};
