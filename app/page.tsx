"use client";

import React, { useState, useEffect } from "react";
import { Navbar, NavTab } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { SystemsModule } from "@/components/SystemsModule";
import { FpsSimulatorModule } from "@/components/FpsSimulatorModule";
import { GearModule } from "@/components/GearModule";
import { StreamerSetupsModule } from "@/components/StreamerSetupsModule";
import { ArbitrageModule } from "@/components/ArbitrageModule";
import { DealsModule } from "@/components/DealsModule";
import { AiAssistantModal } from "@/components/AiAssistantModal";
import { ComparisonModal } from "@/components/ComparisonModal";
import { SystemDetailModal } from "@/components/SystemDetailModal";
import { ComponentPriceModal, ComponentPriceInfo } from "@/components/ComponentPriceModal";
import { AuthModal, UserAccount } from "@/components/AuthModal";
import { FavoritesDrawer } from "@/components/FavoritesDrawer";
import { EmailNotificationModal } from "@/components/EmailNotificationModal";
import { AdInspectorModal } from "@/components/AdInspectorModal";
import { GameSettingsModal } from "@/components/GameSettingsModal";
import { DiscordBotModal } from "@/components/DiscordBotModal";
import { Footer } from "@/components/Footer";
import {
  PREBUILT_SYSTEMS,
  GAMES,
  HARDWARE_DATABASE,
  STREAMER_SETUPS,
  LIVE_DEAL_ALERTS,
  MONITORS_DATABASE,
  GAMING_GEAR_DATABASE
} from "@/lib/data";
import { PrebuiltSystem } from "@/lib/types";
import { getStoreSearchUrl } from "@/lib/storeLinks";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("systems");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [comparisonList, setComparisonList] = useState<PrebuiltSystem[]>([]);
  const [preselectedSystemForFps, setPreselectedSystemForFps] = useState<PrebuiltSystem | null>(null);
  const [selectedDetailSystem, setSelectedDetailSystem] = useState<PrebuiltSystem | null>(null);
  const [selectedComponentForPrice, setSelectedComponentForPrice] = useState<ComponentPriceInfo | null>(null);

  // Modals & Drawers state
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  // 3 Killer New Features Modals
  const [isAdInspectorOpen, setIsAdInspectorOpen] = useState<boolean>(false);
  const [isGameSettingsOpen, setIsGameSettingsOpen] = useState<boolean>(false);
  const [isDiscordBotOpen, setIsDiscordBotOpen] = useState<boolean>(false);

  const [emailModalData, setEmailModalData] = useState<{
    productName: string;
    originalPrice: number;
    newPrice: number;
    imageUrl: string;
    storeName: string;
    directUrl: string;
  }>({
    productName: "ModArt-X1 V2 Gaming Sistem (RTX 4060 / Ryzen 5 5600)",
    originalPrice: 25499,
    newPrice: 22999,
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    storeName: "İtopya",
    directUrl: "https://www.itopya.com/AramaSonuclari/?q=modart&ref=kasaradar"
  });

  // User and Favorites state with localStorage persistence
  const [user, setUser] = useState<UserAccount | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("kasaradar_user");
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedFavs = localStorage.getItem("kasaradar_favorites");
      if (savedFavs) setFavoriteIds(JSON.parse(savedFavs));
    } catch (e) {
      console.error("Local storage load error", e);
    }
  }, []);

  const handleLogin = (account: UserAccount) => {
    setUser(account);
    try {
      localStorage.setItem("kasaradar_user", JSON.stringify(account));
    } catch (e) {}
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem("kasaradar_user");
    } catch (e) {}
  };

  const handleToggleFavorite = (system: PrebuiltSystem) => {
    if (!user || !user.isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setFavoriteIds((prev) => {
      const exists = prev.includes(system.id);
      const next = exists ? prev.filter((id) => id !== system.id) : [...prev, system.id];
      try {
        localStorage.setItem("kasaradar_favorites", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Switch to FPS test with system preloaded
  const handleTestFps = (system: PrebuiltSystem) => {
    setPreselectedSystemForFps(system);
    setActiveTab("fps");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add / Remove from comparison
  const handleAddToComparison = (system: PrebuiltSystem) => {
    if (comparisonList.some((c) => c.id === system.id)) {
      setComparisonList((prev) => prev.filter((c) => c.id !== system.id));
    } else {
      if (comparisonList.length >= 3) {
        alert("En fazla 3 kasayı aynı anda karşılaştırabilirsiniz.");
        return;
      }
      setComparisonList((prev) => [...prev, system]);
      setIsComparisonModalOpen(true);
    }
  };

  const handleSelectPreset = (preset: string) => {
    setSearchQuery(preset);
    setActiveTab("systems");
  };

  const favoriteSystems = PREBUILT_SYSTEMS.filter((s) => favoriteIds.includes(s.id));

  // Filter systems by search query if on systems tab
  const displayedSystems = searchQuery
    ? PREBUILT_SYSTEMS.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.gpu.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.cpu.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.seller.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : PREBUILT_SYSTEMS;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-emerald-500 selection:text-neutral-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        comparisonCount={comparisonList.length}
        onOpenComparison={() => setIsComparisonModalOpen(true)}
        favoritesCount={favoriteIds.length}
        onOpenFavorites={() => setIsFavoritesDrawerOpen(true)}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDiscordBot={() => setIsDiscordBotOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Hero Header Banner */}
        <HeroBanner
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectPreset={handleSelectPreset}
          onGoToFps={() => setActiveTab("fps")}
          onOpenAdInspector={() => setIsAdInspectorOpen(true)}
          onOpenGameSettings={() => setIsGameSettingsOpen(true)}
          onOpenDiscordBot={() => setIsDiscordBotOpen(true)}
        />

        {/* Tab 1: Hazır Kasalar & F/P Radarı */}
        {activeTab === "systems" && (
          <SystemsModule
            systems={displayedSystems}
            onTestFps={handleTestFps}
            onAddToComparison={handleAddToComparison}
            comparisonList={comparisonList}
            onSetAlert={(system) => {
              if (!user || !user.isLoggedIn) {
                setIsAuthModalOpen(true);
                return;
              }
              setEmailModalData({
                productName: system.title,
                originalPrice: system.oldPrice || Math.round(system.price * 1.1),
                newPrice: system.price,
                imageUrl: system.imageUrl,
                storeName: system.seller,
                directUrl: system.directUrl
              });
              setIsEmailModalOpen(true);
            }}
            onOpenDetail={(system) => setSelectedDetailSystem(system)}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onOpenComponentPrice={(comp) => setSelectedComponentForPrice(comp)}
            isLoggedIn={!!user?.isLoggedIn}
            onRequireAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* Tab 2: FPS Simülatörü & Kaldırır Mı? */}
        {activeTab === "fps" && (
          <FpsSimulatorModule
            games={GAMES}
            hardwareList={HARDWARE_DATABASE}
            systems={PREBUILT_SYSTEMS}
            preselectedSystem={preselectedSystemForFps}
            onClearPreselectedSystem={() => setPreselectedSystemForFps(null)}
            onSelectSystemForPurchase={(sys) => {
              setSelectedDetailSystem(sys);
            }}
            onOpenGameSettings={() => setIsGameSettingsOpen(true)}
          />
        )}

        {/* Tab 3: Gaming Ekipman & Monitörler */}
        {activeTab === "monitors" && (
          <GearModule
            monitors={MONITORS_DATABASE}
            gear={GAMING_GEAR_DATABASE}
            isLoggedIn={!!user?.isLoggedIn}
            onRequireAuth={() => setIsAuthModalOpen(true)}
            onOpenEmailPreview={(title, price, img, store) => {
              setEmailModalData({
                productName: title,
                originalPrice: Math.round(price * 1.15),
                newPrice: price,
                imageUrl: img,
                storeName: store,
                directUrl: getStoreSearchUrl(title, store)
              });
              setIsEmailModalOpen(true);
            }}
          />
        )}

        {/* Tab 4: Yayıncı Setup'ları */}
        {activeTab === "streamers" && (
          <StreamerSetupsModule
            streamers={STREAMER_SETUPS}
            systems={PREBUILT_SYSTEMS}
            onTestSystemFps={handleTestFps}
          />
        )}

        {/* Tab 5: Sıfır vs 2. El Borsası */}
        {activeTab === "arbitrage" && (
          <ArbitrageModule
            hardwareList={HARDWARE_DATABASE}
            onOpenAdInspector={() => setIsAdInspectorOpen(true)}
          />
        )}

        {/* Tab 6: Fırsat Radarı & Alarmlar */}
        {activeTab === "deals" && (
          <DealsModule
            deals={LIVE_DEAL_ALERTS}
            systems={PREBUILT_SYSTEMS}
            onSelectSystem={(sys) => {
              setSelectedDetailSystem(sys);
            }}
          />
        )}
      </main>

      {/* System Deep Detail Modal */}
      <SystemDetailModal
        system={selectedDetailSystem}
        onClose={() => setSelectedDetailSystem(null)}
        onTestFps={handleTestFps}
        onOpenComponentPrice={(comp) => setSelectedComponentForPrice(comp)}
      />

      {/* Component Price Comparison Modal */}
      <ComponentPriceModal
        component={selectedComponentForPrice}
        onClose={() => setSelectedComponentForPrice(null)}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        systems={PREBUILT_SYSTEMS}
        onSelectSystem={(sys) => {
          setSelectedDetailSystem(sys);
        }}
        isLoggedIn={!!user?.isLoggedIn}
        onRequireAuth={() => setIsAuthModalOpen(true)}
        onOpenEmailPreview={(title, price, img, store) => {
          setEmailModalData({
            productName: title,
            originalPrice: Math.round(price * 1.12),
            newPrice: price,
            imageUrl: img,
            storeName: store,
            directUrl: getStoreSearchUrl(title, store)
          });
          setIsEmailModalOpen(true);
        }}
      />

      {/* Enhanced Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        systems={comparisonList}
        onRemoveSystem={(id) => setComparisonList((prev) => prev.filter((c) => c.id !== id))}
        onClearAll={() => setComparisonList([])}
        onTestFps={handleTestFps}
      />

      {/* User Account / Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Favorites & Price Drop Alert Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        favoriteSystems={favoriteSystems}
        onRemoveFavorite={(id) => {
          setFavoriteIds((prev) => {
            const next = prev.filter((favId) => favId !== id);
            try {
              localStorage.setItem("kasaradar_favorites", JSON.stringify(next));
            } catch (e) {}
            return next;
          });
        }}
        onOpenSystemDetail={(system) => setSelectedDetailSystem(system)}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Custom Email Notification Preview & Sender Modal */}
      <EmailNotificationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        productName={emailModalData.productName}
        originalPrice={emailModalData.originalPrice}
        newPrice={emailModalData.newPrice}
        imageUrl={emailModalData.imageUrl}
        storeName={emailModalData.storeName}
        directUrl={emailModalData.directUrl}
        userEmail={user?.email || "zypherstudio@gmail.com"}
      />

      {/* KILLER FEATURE 1: Sarı Site / 2. El İlan Ekspertiz Modalı */}
      <AdInspectorModal
        isOpen={isAdInspectorOpen}
        onClose={() => setIsAdInspectorOpen(false)}
      />

      {/* KILLER FEATURE 2: Espor Pro Ayarları & Başlatma Kodları Modalı */}
      <GameSettingsModal
        isOpen={isGameSettingsOpen}
        onClose={() => setIsGameSettingsOpen(false)}
        initialGameId="cs2"
      />

      {/* KILLER FEATURE 3: Discord Bot Simülatörü & Sunucu Davet Modalı */}
      <DiscordBotModal
        isOpen={isDiscordBotOpen}
        onClose={() => setIsDiscordBotOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
