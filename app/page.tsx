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
import { getCurrentUser, logoutCurrentUser, getUserFavorites, saveUserFavorites } from "@/lib/authStorage";
import { FavoritesDrawer } from "@/components/FavoritesDrawer";
import { EmailNotificationModal } from "@/components/EmailNotificationModal";
import { AdInspectorModal } from "@/components/AdInspectorModal";
import { GameSettingsModal } from "@/components/GameSettingsModal";
import { GamifiedRewardsModal } from "@/components/GamifiedRewardsModal";
import { PcRecommenderModal } from "@/components/PcRecommenderModal";
import { VersusArenaModal } from "@/components/VersusArenaModal";
import { PriceHistoryModal } from "@/components/PriceHistoryModal";
import { FreeGamesModal } from "@/components/FreeGamesModal";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { LiveTelegramTicker } from "@/components/LiveTelegramTicker";
import { TelegramGrowthFloatingBar } from "@/components/TelegramGrowthFloatingBar";
import { SponsorsSection } from "@/components/SponsorsSection";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowUp } from "lucide-react";
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

  // Killer Features Modals
  const [isAdInspectorOpen, setIsAdInspectorOpen] = useState<boolean>(false);
  const [isGameSettingsOpen, setIsGameSettingsOpen] = useState<boolean>(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState<boolean>(false);
  const [isPcRecommenderOpen, setIsPcRecommenderOpen] = useState<boolean>(false);
  const [isVersusArenaOpen, setIsVersusArenaOpen] = useState<boolean>(false);
  const [isPriceHistoryModalOpen, setIsPriceHistoryModalOpen] = useState<boolean>(false);
  const [isFreeGamesModalOpen, setIsFreeGamesModalOpen] = useState<boolean>(false);

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

  // User and Favorites state with bulletproof persistence
  const [user, setUser] = useState<UserAccount | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [pendingFavoriteSystem, setPendingFavoriteSystem] = useState<PrebuiltSystem | null>(null);

  // Initialize from auth storage on mount
  useEffect(() => {
    try {
      const activeUser = getCurrentUser();
      if (activeUser) {
        setUser(activeUser);
        const userFavs = getUserFavorites(activeUser.email);
        setFavoriteIds(userFavs);
      } else {
        setUser(null);
        setFavoriteIds([]);
      }
    } catch (e) {
      console.error("Local storage load error", e);
    }
  }, []);

  const handleLogin = (account: UserAccount) => {
    setUser(account);
    try {
      const userFavs = getUserFavorites(account.email);
      let updatedFavs = [...userFavs];
      if (pendingFavoriteSystem) {
        if (!updatedFavs.includes(pendingFavoriteSystem.id)) {
          updatedFavs.push(pendingFavoriteSystem.id);
        }
        setPendingFavoriteSystem(null);
      }
      saveUserFavorites(account.email, updatedFavs);
      setFavoriteIds(updatedFavs);
    } catch (e) {}
  };

  const handleLogout = () => {
    logoutCurrentUser();
    setUser(null);
    setFavoriteIds([]);
    setPendingFavoriteSystem(null);
  };

  // Scroll to top state for mobile
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Native phone back gesture (Android Back & iPhone Swipe-Back) integration
  useEffect(() => {
    const handlePopState = () => {
      if (selectedDetailSystem) {
        setSelectedDetailSystem(null);
        return;
      }
      if (isPcRecommenderOpen) {
        setIsPcRecommenderOpen(false);
        return;
      }
      if (isVersusArenaOpen) {
        setIsVersusArenaOpen(false);
        return;
      }
      if (isPriceHistoryModalOpen) {
        setIsPriceHistoryModalOpen(false);
        return;
      }
      if (isFreeGamesModalOpen) {
        setIsFreeGamesModalOpen(false);
        return;
      }
      if (isAdInspectorOpen) {
        setIsAdInspectorOpen(false);
        return;
      }
      if (isGameSettingsOpen) {
        setIsGameSettingsOpen(false);
        return;
      }
      if (isAiAssistantOpen) {
        setIsAiAssistantOpen(false);
        return;
      }
      if (isComparisonModalOpen) {
        setIsComparisonModalOpen(false);
        return;
      }
      if (isFavoritesDrawerOpen) {
        setIsFavoritesDrawerOpen(false);
        return;
      }
      if (isAuthModalOpen) {
        setIsAuthModalOpen(false);
        return;
      }
      if (isRewardsModalOpen) {
        setIsRewardsModalOpen(false);
        return;
      }
      if (isEmailModalOpen) {
        setIsEmailModalOpen(false);
        return;
      }

      if (activeTab !== "systems") {
        setActiveTab("systems");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [
    selectedDetailSystem,
    isPcRecommenderOpen,
    isVersusArenaOpen,
    isPriceHistoryModalOpen,
    isFreeGamesModalOpen,
    isAdInspectorOpen,
    isGameSettingsOpen,
    isAiAssistantOpen,
    isComparisonModalOpen,
    isFavoritesDrawerOpen,
    isAuthModalOpen,
    isRewardsModalOpen,
    isEmailModalOpen,
    activeTab
  ]);

  const handleTabChangeWithHistory = (tab: NavTab) => {
    if (tab !== activeTab) {
      if (typeof window !== "undefined") {
        window.history.pushState({ tab }, "", `#${tab}`);
      }
      setActiveTab(tab);
    }
  };

  const handleToggleFavorite = (system: PrebuiltSystem) => {
    if (!user || !user.isLoggedIn) {
      setPendingFavoriteSystem(system);
      setIsAuthModalOpen(true);
      return;
    }
    setFavoriteIds((prev) => {
      const exists = prev.includes(system.id);
      const next = exists ? prev.filter((id) => id !== system.id) : [...prev, system.id];
      if (user?.email) {
        saveUserFavorites(user.email, next);
      }
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
        setActiveTab={handleTabChangeWithHistory}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        comparisonCount={comparisonList.length}
        onOpenComparison={() => setIsComparisonModalOpen(true)}
        favoritesCount={favoriteIds.length}
        onOpenFavorites={() => setIsFavoritesDrawerOpen(true)}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenRewardsModal={() => setIsRewardsModalOpen(true)}
        onOpenFreeGames={() => {
          if (typeof window !== "undefined") window.history.pushState({ modal: "freegames" }, "", "#bedava-oyunlar");
          setIsFreeGamesModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full pb-28 lg:pb-8">
        {/* Mobile Sticky Back Bar (When not on systems tab) */}
        {activeTab !== "systems" && (
          <div className="lg:hidden sticky top-16 z-30 mb-4 p-2.5 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 shadow-xl flex items-center justify-between animate-fade-in">
            <button
              onClick={() => {
                setActiveTab("systems");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-bold text-xs transition-all active:scale-95 cursor-pointer border border-neutral-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Hazır Kasalara Dön</span>
            </button>
            <span className="text-xs font-bold text-neutral-300 pr-2">
              {activeTab === "fps" && "🎮 FPS Testi"}
              {activeTab === "monitors" && "🎧 Ekipman & Monitör"}
              {activeTab === "streamers" && "✨ Yayıncı Sistemleri"}
              {activeTab === "arbitrage" && "⚖️ 2. El vs Sıfır"}
              {activeTab === "deals" && "🔔 Fırsat Radarı"}
            </span>
          </div>
        )}

        {/* Hero Header Banner */}
        <HeroBanner
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectPreset={handleSelectPreset}
          onGoToFps={() => handleTabChangeWithHistory("fps")}
          onOpenAdInspector={() => {
            if (typeof window !== "undefined") window.history.pushState({ modal: "ad" }, "", "#ekspertiz");
            setIsAdInspectorOpen(true);
          }}
          onOpenGameSettings={() => {
            if (typeof window !== "undefined") window.history.pushState({ modal: "game" }, "", "#ayarlar");
            setIsGameSettingsOpen(true);
          }}
          onOpenRewardsModal={() => {
            if (typeof window !== "undefined") window.history.pushState({ modal: "rewards" }, "", "#oduller");
            setIsRewardsModalOpen(true);
          }}
          onOpenPcRecommender={() => {
            if (typeof window !== "undefined") window.history.pushState({ modal: "recommender" }, "", "#sihirbaz");
            setIsPcRecommenderOpen(true);
          }}
          onOpenVersusArena={() => {
            if (typeof window !== "undefined") window.history.pushState({ modal: "versus" }, "", "#versus");
            setIsVersusArenaOpen(true);
          }}
          onOpenPriceHistory={() => {
            if (typeof window !== "undefined") window.history.pushState({ modal: "history" }, "", "#fiyat");
            setIsPriceHistoryModalOpen(true);
          }}
          onOpenFreeGames={() => {
            if (typeof window !== "undefined") window.history.pushState({ modal: "freegames" }, "", "#bedava-oyunlar");
            setIsFreeGamesModalOpen(true);
          }}
        />

        {/* Live Telegram Deal Feed Ticker */}
        <LiveTelegramTicker />

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
        user={user}
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
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingFavoriteSystem(null);
        }}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenFavorites={() => setIsFavoritesDrawerOpen(true)}
        favoritesCount={favoriteIds.length}
        pendingFavoriteTitle={pendingFavoriteSystem?.title}
      />

      {/* Favorites & Price Drop Alert Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        favoriteSystems={favoriteSystems}
        onRemoveFavorite={(id) => {
          setFavoriteIds((prev) => {
            const next = prev.filter((favId) => favId !== id);
            if (user?.email) {
              saveUserFavorites(user.email, next);
            }
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

      {/* Gamified Rewards & Telegram Case Opening Modal */}
      <GamifiedRewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
      />

      {/* KILLER FEATURE 3: Akıllı PC Sihirbazı */}
      <PcRecommenderModal
        isOpen={isPcRecommenderOpen}
        onClose={() => setIsPcRecommenderOpen(false)}
        systems={PREBUILT_SYSTEMS}
        onSelectSystemForFps={handleTestFps}
        onSelectSystemDetail={(s) => setSelectedDetailSystem(s)}
      />

      {/* KILLER FEATURE 4: Kasa Kapışması & Topluluk Oylama Arenası */}
      <VersusArenaModal
        isOpen={isVersusArenaOpen}
        onClose={() => setIsVersusArenaOpen(false)}
        systems={PREBUILT_SYSTEMS}
        onTestFps={handleTestFps}
        onSelectSystemDetail={(s) => setSelectedDetailSystem(s)}
      />

      {/* KILLER FEATURE 5: 30-90 Günlük Fiyat Geçmişi & İndirim Trendi Modalı */}
      <PriceHistoryModal
        isOpen={isPriceHistoryModalOpen}
        onClose={() => setIsPriceHistoryModalOpen(false)}
        systems={PREBUILT_SYSTEMS}
        initialSystem={selectedDetailSystem}
        onSelectSystemDetail={(s) => setSelectedDetailSystem(s)}
      />

      {/* KILLER FEATURE 6: Epic Games & Steam Bedava / Kelepir Oyunlar Radarı */}
      <FreeGamesModal
        isOpen={isFreeGamesModalOpen}
        onClose={() => setIsFreeGamesModalOpen(false)}
      />

      {/* Sponsors & Brand Partnerships Section */}
      <SponsorsSection />

      <TelegramGrowthFloatingBar />

      {/* Floating Scroll To Top Button on Mobile */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="lg:hidden fixed bottom-20 left-3.5 z-40 p-2.5 rounded-2xl bg-neutral-900/95 text-neutral-200 border border-neutral-700 shadow-2xl backdrop-blur-xl active:scale-90 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          title="Başa Dön"
        >
          <ArrowUp className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] pr-0.5">Yukarı</span>
        </button>
      )}

      {/* Native App-like Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={handleTabChangeWithHistory}
        onOpenPcRecommender={() => {
          if (typeof window !== "undefined") window.history.pushState({ modal: "recommender" }, "", "#sihirbaz");
          setIsPcRecommenderOpen(true);
        }}
        onOpenVersusArena={() => {
          if (typeof window !== "undefined") window.history.pushState({ modal: "versus" }, "", "#versus");
          setIsVersusArenaOpen(true);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
