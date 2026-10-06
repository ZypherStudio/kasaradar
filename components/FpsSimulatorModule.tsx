"use client";

import React, { useState, useMemo, useEffect } from "react";
import { GameRequirement, PrebuiltSystem, HardwareComponent } from "@/lib/types";
import { calculateGameFps, ResolutionPreset, formatTL } from "@/lib/calculator";
import {
  Zap,
  Gauge,
  Cpu,
  Tv,
  MemoryStick,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Gamepad2,
  ExternalLink,
  Search,
  Globe,
  HardDrive,
  Layers,
  Trophy,
  X,
  Loader2,
  Flame,
  Plus
} from "lucide-react";

interface FpsSimulatorModuleProps {
  games: GameRequirement[];
  hardwareList: HardwareComponent[];
  systems: PrebuiltSystem[];
  preselectedSystem?: PrebuiltSystem | null;
  onClearPreselectedSystem: () => void;
  onSelectSystemForPurchase: (system: PrebuiltSystem) => void;
  onOpenGameSettings?: () => void;
}

type GameCategoryFilter = "all" | "popular" | "esports" | "aaa" | "new" | "custom";

const POPULAR_GAME_IDS = new Set([
  "cs2",
  "valorant",
  "gta5",
  "wukong",
  "cyberpunk",
  "eafc25",
  "rdr2",
  "warzone",
  "eldenring",
  "fortnite",
  "rust",
  "pubg",
  "lol"
]);

const ESPORTS_GAME_IDS = new Set([
  "cs2",
  "valorant",
  "warzone",
  "apex",
  "fortnite",
  "pubg",
  "r6siege",
  "overwatch2",
  "lol",
  "dota2",
  "rocketleague",
  "tf2"
]);

const AAA_GAME_IDS = new Set([
  "wukong",
  "cyberpunk",
  "gta6",
  "gta5",
  "rdr2",
  "bg3",
  "eldenring",
  "forza5",
  "helldivers2",
  "gow_ragnarok",
  "stalker2",
  "silenthill2",
  "mhw_wilds",
  "starfield",
  "hogwarts",
  "witcher3",
  "re4_remake",
  "spiderman",
  "alanwake2",
  "tlou1"
]);

const NEW_GAME_IDS = new Set([
  "wukong",
  "eafc25",
  "helldivers2",
  "gow_ragnarok",
  "stalker2",
  "silenthill2",
  "mhw_wilds",
  "farm_sim25",
  "msfs2024",
  "manorlords",
  "palworld",
  "gta6"
]);

export const FpsSimulatorModule: React.FC<FpsSimulatorModuleProps> = ({
  games: initialGames,
  hardwareList,
  systems,
  preselectedSystem,
  onClearPreselectedSystem,
  onSelectSystemForPurchase,
  onOpenGameSettings
}) => {
  // Master games list combining built-in 48+ games and user-added Steam games
  const [allGames, setAllGames] = useState<GameRequirement[]>(initialGames);
  const [selectedGameId, setSelectedGameId] = useState<string>("cs2");
  const [resolutionPreset, setResolutionPreset] = useState<ResolutionPreset>("1080p_ultra");
  const [activeCategory, setActiveCategory] = useState<GameCategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Steam Live Search State
  const [isSteamModalOpen, setIsSteamModalOpen] = useState<boolean>(false);
  const [steamSearchQuery, setSteamSearchQuery] = useState<string>("");
  const [isSearchingSteam, setIsSearchingSteam] = useState<boolean>(false);
  const [steamSearchResults, setSteamSearchResults] = useState<any[]>([]);
  const [addingAppId, setAddingAppId] = useState<number | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Hardware state
  const [selectedCpuTier, setSelectedCpuTier] = useState<number>(preselectedSystem ? preselectedSystem.cpuTier : 82);
  const [selectedGpuTier, setSelectedGpuTier] = useState<number>(preselectedSystem ? preselectedSystem.gpuTier : 79);
  const [selectedRamGb, setSelectedRamGb] = useState<number>(preselectedSystem ? preselectedSystem.ramSizeGb : 16);
  const [activeSystemName, setActiveSystemName] = useState<string>(preselectedSystem ? preselectedSystem.title : "");

  // Load custom/live added games from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kasaradar_custom_games");
      if (stored) {
        const parsed: GameRequirement[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge unique games by ID
          setAllGames((prev) => {
            const existingIds = new Set(prev.map((g) => g.id));
            const newOnes = parsed.filter((g) => !existingIds.has(g.id));
            return [...prev, ...newOnes];
          });
        }
      }
    } catch (e) {
      console.error("Failed to load custom games from localStorage", e);
    }
  }, []);

  // Update hardware if preselectedSystem changes
  useEffect(() => {
    if (preselectedSystem) {
      setSelectedCpuTier(preselectedSystem.cpuTier);
      setSelectedGpuTier(preselectedSystem.gpuTier);
      setSelectedRamGb(preselectedSystem.ramSizeGb);
      setActiveSystemName(preselectedSystem.title);
    }
  }, [preselectedSystem]);

  // Filter games based on search and category
  const filteredGames = useMemo(() => {
    return allGames.filter((g) => {
      // Category filter
      if (activeCategory === "popular" && !POPULAR_GAME_IDS.has(g.id)) return false;
      if (activeCategory === "esports" && !ESPORTS_GAME_IDS.has(g.id)) return false;
      if (activeCategory === "aaa" && !AAA_GAME_IDS.has(g.id)) return false;
      if (activeCategory === "new" && !NEW_GAME_IDS.has(g.id)) return false;
      if (activeCategory === "custom" && !g.isLiveAdded) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = g.title.toLowerCase().includes(q);
        const matchesGenre = g.genre.toLowerCase().includes(q);
        const matchesDesc = g.description.toLowerCase().includes(q);
        return matchesTitle || matchesGenre || matchesDesc;
      }
      return true;
    });
  }, [allGames, activeCategory, searchQuery]);

  const selectedGame = useMemo(() => {
    return allGames.find((g) => g.id === selectedGameId) || allGames[0];
  }, [allGames, selectedGameId]);

  const calculation = useMemo(() => {
    return calculateGameFps(
      selectedGame,
      selectedCpuTier,
      selectedGpuTier,
      selectedRamGb,
      resolutionPreset
    );
  }, [selectedGame, selectedCpuTier, selectedGpuTier, selectedRamGb, resolutionPreset]);

  // Find the closest prebuilt system that can run this game smoothly
  const recommendedSystem = useMemo(() => {
    return (
      systems
        .filter((s) => s.gpuTier >= selectedGame.recGpuTier && s.cpuTier >= selectedGame.recCpuTier)
        .sort((a, b) => a.price - b.price)[0] || systems[0]
    );
  }, [systems, selectedGame]);

  const gpus = hardwareList.filter((h) => h.type === "gpu");
  const cpus = hardwareList.filter((h) => h.type === "cpu");

  // Show toast notification
  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Perform Live Steam Store Search
  const handleSearchSteam = async (q: string) => {
    const term = q.trim();
    if (!term) return;
    setIsSearchingSteam(true);
    try {
      const res = await fetch(`/api/games/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setSteamSearchResults(data.items);
      } else {
        setSteamSearchResults([]);
      }
    } catch (err) {
      console.error("Steam search error:", err);
      setSteamSearchResults([]);
    } finally {
      setIsSearchingSteam(false);
    }
  };

  // Load trending games from Steam
  const handleLoadSteamTrending = async () => {
    setIsSearchingSteam(true);
    setSteamSearchQuery("");
    try {
      const res = await fetch(`/api/games/search?filter=top_sellers`);
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setSteamSearchResults(data.items);
      }
    } catch (err) {
      console.error("Trending games error:", err);
    } finally {
      setIsSearchingSteam(false);
    }
  };

  // Fetch full details and auto-add a Steam game to KasaRadar
  const handleAddSteamGame = async (appId: number) => {
    setAddingAppId(appId);
    try {
      const res = await fetch(`/api/games/details?appId=${appId}`);
      const data = await res.json();

      if (data.success && data.game) {
        const newGame: GameRequirement = data.game;

        // Add to state if not exists
        setAllGames((prev) => {
          const filtered = prev.filter((g) => g.id !== newGame.id);
          const updated = [newGame, ...filtered];
          // Save to localStorage
          try {
            const customOnly = updated.filter((g) => g.isLiveAdded);
            localStorage.setItem("kasaradar_custom_games", JSON.stringify(customOnly));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });

        // Set as selected game immediately
        setSelectedGameId(newGame.id);
        setIsSteamModalOpen(false);
        showToast(`🎉 "${newGame.title}" Steam'den eklendi ve FPS benchmark analizi yapıldı!`);
      } else {
        alert("Oyun bilgileri Steam'den çekilemedi. Lütfen tekrar deneyin.");
      }
    } catch (err) {
      console.error("Add steam game error:", err);
      alert("Bir bağlantı hatası oluştu.");
    } finally {
      setAddingAppId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-neutral-950 font-bold text-xs shadow-2xl flex items-center gap-3 border border-emerald-300 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastNotification}</span>
          <button
            onClick={() => setToastNotification(null)}
            className="ml-2 hover:opacity-70 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Gerçek Oyun Motoru Benchmark Simülasyonu</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-emerald-400 border border-neutral-700 font-bold">
              {allGames.length} Oyun &amp; Canlı Steam Veritabanı
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            FPS &amp; &quot;Kaldırır Mı?&quot; Test Motoru
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            İstediğin oyunu seç ya da Steam&apos;deki on binlerce oyundan birini ara. Seçtiğin donanımla
            beklenen ortalama FPS&apos;i, %1 takılma değerini ve işlemci/ekran kartı darboğazını anında hesapla.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          {/* Steam Live Search Trigger Button */}
          <button
            onClick={() => {
              setIsSteamModalOpen(true);
              if (steamSearchResults.length === 0) {
                handleLoadSteamTrending();
              }
            }}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4 text-cyan-200" />
            <span>Steam&apos;de Canlı Ara &amp; Ekle</span>
          </button>

          {onOpenGameSettings && (
            <button
              onClick={onOpenGameSettings}
              className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center gap-1.5 border border-neutral-700 transition-all cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span>Espor Pro Ayarları</span>
            </button>
          )}

          {activeSystemName && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-xs">
                <span className="text-neutral-400 block text-[10px]">Test Edilen Kasa:</span>
                <span className="text-emerald-400 font-bold">{activeSystemName}</span>
              </div>
              <button
                onClick={() => {
                  setActiveSystemName("");
                  onClearPreselectedSystem();
                }}
                className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all cursor-pointer"
              >
                Sıfırla
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Game Selector Filter Bar & Search */}
      <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "all"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                  : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tümü ({allGames.length})</span>
            </button>
            <button
              onClick={() => setActiveCategory("popular")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "popular"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                  : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Çok Satanlar</span>
            </button>
            <button
              onClick={() => setActiveCategory("esports")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "esports"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                  : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>E-Spor &amp; FPS</span>
            </button>
            <button
              onClick={() => setActiveCategory("aaa")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "aaa"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                  : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <span>⚔️ AAA &amp; Ağır Grafikler</span>
            </button>
            <button
              onClick={() => setActiveCategory("new")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "new"
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                  : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <span>⚡ 2024-2025 Yeni</span>
            </button>
            {allGames.some((g) => g.isLiveAdded) && (
              <button
                onClick={() => setActiveCategory("custom")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === "custom"
                    ? "bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20"
                    : "bg-neutral-950 text-cyan-400 hover:text-white border border-cyan-800/50"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Steam Eklenenler</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Oyun veya tür ara (Örn: Wukong, FC 25)..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* If local search has few or 0 results, suggest Steam Live Search */}
        {searchQuery.trim().length > 1 && (
          <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-cyan-300">
              Aradığın oyun listede yok mu? Steam resmi mağazasından anında bulup ekleyebilirsin:
            </span>
            <button
              onClick={() => {
                setSteamSearchQuery(searchQuery);
                setIsSteamModalOpen(true);
                handleSearchSteam(searchQuery);
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>&quot;{searchQuery}&quot; için Steam&apos;de Canlı Ara</span>
            </button>
          </div>
        )}

        {/* Game Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[460px] overflow-y-auto pr-1">
          {filteredGames.map((game) => {
            const isSelected = game.id === selectedGameId;
            return (
              <button
                key={game.id}
                onClick={() => setSelectedGameId(game.id)}
                className={`relative flex flex-col p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden group ${
                  isSelected
                    ? "bg-gradient-to-b from-emerald-950/60 to-neutral-900 border-emerald-500 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500"
                    : "bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
                }`}
              >
                {/* Cover Image */}
                <div className="w-full h-24 rounded-xl overflow-hidden bg-neutral-900 relative mb-2">
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  {game.isLiveAdded && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-cyan-500 text-neutral-950 text-[9px] font-black uppercase tracking-wider shadow">
                      Steam Canlı
                    </span>
                  )}
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-neutral-950 rounded-full p-1 shadow">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="w-full">
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {game.title}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate mt-0.5">{game.genre}</div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-900 text-[9px] text-neutral-500">
                    <span>{game.releaseYear}</span>
                    <span className="uppercase font-semibold text-neutral-400">
                      {game.platform || "PC"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filteredGames.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-400 text-xs space-y-3">
            <p>Aradığınız kriterlere uygun yerel oyun bulunamadı.</p>
            <button
              onClick={() => {
                setSteamSearchQuery(searchQuery);
                setIsSteamModalOpen(true);
                handleSearchSteam(searchQuery);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs cursor-pointer shadow"
            >
              <Globe className="w-4 h-4" />
              <span>Steam Mağazasında Canlı Ara</span>
            </button>
          </div>
        )}
      </div>

      {/* Selected Game Specs & Hardware Simulator Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Hardware Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Donanım Parçalarını Ayarla
              </span>
              <span className="text-[11px] text-neutral-400">Özelleştirilebilir</span>
            </div>

            {/* Quick load from ready-built systems */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                Popüler Hazır Kasalardan Hızlı Yükle:
              </label>
              <select
                onChange={(e) => {
                  const sys = systems.find((s) => s.id === e.target.value);
                  if (sys) {
                    setSelectedCpuTier(sys.cpuTier);
                    setSelectedGpuTier(sys.gpuTier);
                    setSelectedRamGb(sys.ramSizeGb);
                    setActiveSystemName(sys.title);
                  }
                }}
                value={systems.find((s) => s.title === activeSystemName)?.id || ""}
                aria-label="Hazır kasa şablonu seçimi"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Hazır Kasa Şablonu Seç --</option>
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.seller} - {s.title} ({formatTL(s.price)})
                  </option>
                ))}
              </select>
            </div>

            {/* GPU Selector */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-emerald-400" />
                  Ekran Kartı (GPU)
                </span>
                <span className="text-emerald-400 font-bold">Güç Puanı: {selectedGpuTier}</span>
              </div>
              <select
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSelectedGpuTier(val);
                  setActiveSystemName("");
                }}
                value={selectedGpuTier}
                aria-label="Ekran kartı seçimi"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {gpus.map((g) => (
                  <option key={g.id} value={g.tier}>
                    {g.name} ({g.specsSummary})
                  </option>
                ))}
                <option value={96}>Nvidia GeForce RTX 4080 SUPER 16GB (Ultra High)</option>
                <option value={100}>Nvidia GeForce RTX 4090 24GB (God Tier)</option>
                <option value={45}>Nvidia GeForce GTX 1650 4GB (Eski Nesil Giriş)</option>
              </select>
            </div>

            {/* CPU Selector */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  İşlemci (CPU)
                </span>
                <span className="text-cyan-400 font-bold">Güç Puanı: {selectedCpuTier}</span>
              </div>
              <select
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSelectedCpuTier(val);
                  setActiveSystemName("");
                }}
                value={selectedCpuTier}
                aria-label="İşlemci seçimi"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {cpus.map((c) => (
                  <option key={c.id} value={c.tier}>
                    {c.name} ({c.specsSummary})
                  </option>
                ))}
                <option value={85}>AMD Ryzen 5 7600X (6C/12T AM5)</option>
                <option value={95}>Intel Core i9 14900KS (Amiral Gemisi)</option>
                <option value={50}>Intel Core i3 12100F (Giriş Seviye)</option>
              </select>
            </div>

            {/* RAM Selector */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <MemoryStick className="w-3.5 h-3.5 text-purple-400" />
                  Bellek (RAM)
                </span>
                <span className="text-purple-400 font-bold">{selectedRamGb} GB</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[8, 16, 32, 64].map((gb) => (
                  <button
                    key={gb}
                    onClick={() => setSelectedRamGb(gb)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedRamGb === gb
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500 shadow-sm"
                        : "bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {gb} GB
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution & Quality Preset */}
            <div className="pt-2 border-t border-neutral-800">
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Çözünürlük ve Grafik Kalitesi:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "1080p_low", label: "1080p Rekabetçi (Düşük)" },
                  { id: "1080p_ultra", label: "1080p Ultra Grafik" },
                  { id: "1440p_high", label: "1440p 2K Yüksek" },
                  { id: "4k_ultra", label: "4K Ultra / Ray Tracing" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setResolutionPreset(item.id as ResolutionPreset)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                      resolutionPreset === item.id
                        ? "bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20"
                        : "bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Game Specs Reference Card */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                {selectedGame.title} Sistem Gereksinimleri
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="text-neutral-400">
                  Önerilen RAM: <span className="font-bold text-white">{selectedGame.recRamGb} GB</span>
                </div>
                <div className="text-neutral-400">
                  Depolama: <span className="font-bold text-white">{selectedGame.storageGb} GB</span>
                </div>
                <div className="text-neutral-400">
                  Gereken GPU:{" "}
                  <span className="font-bold text-emerald-400">{selectedGame.recGpuTier}/100</span>
                </div>
                <div className="text-neutral-400">
                  Gereken CPU:{" "}
                  <span className="font-bold text-cyan-400">{selectedGame.recCpuTier}/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live FPS Output Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-900/95 border border-neutral-800 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <span className="text-xs text-neutral-400 block">Hesaplanan Oyun:</span>
                <span className="text-base font-bold text-white flex items-center gap-2">
                  {selectedGame.title}
                  <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-normal">
                    {resolutionPreset.replace("_", " ").toUpperCase()}
                  </span>
                </span>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-bold border ${calculation.verdict.badgeColor}`}
              >
                {calculation.verdict.label}
              </div>
            </div>

            {/* Giant FPS Counter */}
            <div className="grid grid-cols-2 gap-4 text-center p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Beklenen Ortalama FPS
                </div>
                <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  {calculation.avgFps}
                </div>
                <div className="text-[11px] text-neutral-500">Ortalama Kare Hızı</div>
              </div>

              <div className="space-y-1 border-l border-neutral-800 pl-4">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  %1 En Düşük FPS (Akıcılık)
                </div>
                <div className="text-5xl sm:text-6xl font-black text-neutral-300">
                  {calculation.lowFps}
                </div>
                <div className="text-[11px] text-neutral-500">Takılma &amp; Ani Düşüş Göstergesi</div>
              </div>
            </div>

            {/* Verdict Explanation */}
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed">
              <span className="font-bold text-white block mb-1">Oynanış Değerlendirmesi:</span>
              {calculation.verdict.description}
            </div>

            {/* Bottleneck Radar */}
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  Donanım Darboğazı (Bottleneck) Analizi
                </span>
                <span
                  className={`font-semibold ${
                    calculation.bottleneckComponent === "balanced"
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {calculation.bottleneckComponent === "balanced"
                    ? "Dengeli Sistem (Sıfır Darboğaz)"
                    : `%${calculation.bottleneckPercentage} ${
                        calculation.bottleneckComponent === "cpu"
                          ? "İşlemci Darboğazı"
                          : calculation.bottleneckComponent === "gpu"
                          ? "Ekran Kartı Darboğazı"
                          : "RAM Darboğazı"
                      }`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    calculation.bottleneckComponent === "balanced"
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.max(10, calculation.bottleneckPercentage * 2)}%` }}
                />
              </div>

              <div className="flex items-start gap-2 text-[11px] text-neutral-400 pt-1">
                {calculation.bottleneckComponent === "balanced" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span>{calculation.recommendedUpgrade}</span>
              </div>
            </div>

            {/* Recommended Matching Pre-Built Rig (The Monetization Bridge!) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-950 to-neutral-900 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Bu Oyunu Uçuracak En İyi F/P Hazır Kasa:
                </span>
                <span className="text-xs font-black text-white">{formatTL(recommendedSystem.price)}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="text-xs">
                  <div className="font-bold text-white">{recommendedSystem.title}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {recommendedSystem.gpu} • {recommendedSystem.cpu}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectSystemForPurchase(recommendedSystem)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-all cursor-pointer"
                  >
                    Detaylar
                  </button>
                  <a
                    href={recommendedSystem.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center gap-1 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <span>Satın Al</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steam Live Search & Auto-Add Modal */}
      {isSteamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold mb-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Resmi Steam Mağazası Canlı Entegrasyonu</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Steam&apos;deki Tüm Oyunları Ara &amp; Ekle
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Dünyadaki herhangi bir Steam oyununu ara. Sistem oyunun resmi donanım gereksinimlerini
                  otomatik çekip benchmark motoruna anında eklesin.
                </p>
              </div>
              <button
                onClick={() => setIsSteamModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input in Modal */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSteam(steamSearchQuery);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={steamSearchQuery}
                  onChange={(e) => setSteamSearchQuery(e.target.value)}
                  placeholder="Steam'de ara (Örn: Space Marine 2, Manor Lords, Elden Ring, Rust...)"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isSearchingSteam}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                {isSearchingSteam ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Aranıyor...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Ara</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Suggestions / Trending Header */}
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-neutral-300">
                {steamSearchQuery ? `"${steamSearchQuery}" Sonuçları:` : "Steam Çok Satan & Popüler Oyunlar:"}
              </span>
              <button
                onClick={handleLoadSteamTrending}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                Çok Satanları Yenile
              </button>
            </div>

            {/* Search Results Grid */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {isSearchingSteam && (
                <div className="py-12 text-center text-neutral-400 space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
                  <p className="text-xs">Steam API üzerinden canlı katalog taranıyor...</p>
                </div>
              )}

              {!isSearchingSteam && steamSearchResults.length === 0 && (
                <div className="py-10 text-center text-neutral-400 text-xs">
                  Herhangi bir oyun bulunamadı. Lütfen arama terimini değiştirin.
                </div>
              )}

              {!isSearchingSteam &&
                steamSearchResults.map((item) => {
                  const isAddingThis = addingAppId === item.id;
                  const isAlreadyInList = allGames.some(
                    (g) => g.steamAppId === item.id || g.id === `steam-${item.id}`
                  );

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={item.tinyImage || item.headerImage}
                          alt={item.title}
                          className="w-24 h-12 rounded-lg object-cover bg-neutral-900 shrink-0"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80";
                          }}
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-500">
                            <span>Steam ID: {item.id}</span>
                            {item.price !== null && (
                              <span className="text-emerald-400 font-semibold">
                                {item.price === 0 ? "Ücretsiz" : `$${item.price}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="self-end sm:self-auto shrink-0">
                        {isAlreadyInList ? (
                          <button
                            onClick={() => {
                              setSelectedGameId(`steam-${item.id}`);
                              setIsSteamModalOpen(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Listede Var (Seç)
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddSteamGame(item.id)}
                            disabled={isAddingThis}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all"
                          >
                            {isAddingThis ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Gereksinimler Alınıyor...</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Sisteme Ekle &amp; Test Et</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
