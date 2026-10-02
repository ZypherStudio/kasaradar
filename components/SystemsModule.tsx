"use client";

import React, { useState, useMemo } from "react";
import { PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import { ComponentPriceInfo } from "./ComponentPriceModal";
import {
  Cpu,
  Tv,
  HardDrive,
  MemoryStick,
  Zap,
  SlidersHorizontal,
  ExternalLink,
  Bell,
  Check,
  TrendingDown,
  Layers,
  ArrowUpDown,
  Tag,
  Info,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Search,
  Clock,
  RefreshCw,
  Sparkles,
  ShieldCheck
} from "lucide-react";

interface SystemsModuleProps {
  systems: PrebuiltSystem[];
  onTestFps: (system: PrebuiltSystem) => void;
  onAddToComparison: (system: PrebuiltSystem) => void;
  comparisonList: PrebuiltSystem[];
  onSetAlert: (system: PrebuiltSystem) => void;
  onOpenDetail: (system: PrebuiltSystem) => void;
  favoriteIds: string[];
  onToggleFavorite: (system: PrebuiltSystem) => void;
  onOpenComponentPrice: (comp: ComponentPriceInfo) => void;
  isLoggedIn?: boolean;
  onRequireAuth?: () => void;
}

type QuickCategory = "all" | "today" | "amd_cpu" | "intel_cpu" | "nvidia_gpu" | "amd_gpu" | "fp_champ" | "high_end";

export const SystemsModule: React.FC<SystemsModuleProps> = ({
  systems,
  onTestFps,
  onAddToComparison,
  comparisonList,
  onSetAlert,
  onOpenDetail,
  favoriteIds,
  onToggleFavorite,
  onOpenComponentPrice,
  isLoggedIn = false,
  onRequireAuth
}) => {
  const [selectedQuickCategory, setSelectedQuickCategory] = useState<QuickCategory>("all");
  const [selectedSeller, setSelectedSeller] = useState<string>("all");
  const [selectedGpu, setSelectedGpu] = useState<string>("all");
  const [selectedRamType, setSelectedRamType] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(130000);
  const [sortBy, setSortBy] = useState<"fpScore" | "priceAsc" | "priceDesc" | "savings">("fpScore");

  // Bot auto-scanner simulation state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastScanTime, setLastScanTime] = useState<string>("2 dakika önce");
  const [scanToast, setScanToast] = useState<string | null>(null);

  // Community votes state
  const [userVotes, setUserVotes] = useState<Record<string, "yes" | "no">>({});

  const sellers = useMemo(() => ["all", "İtopya", "Gaming.Gen.TR", "GameGaraj", "Vatan Bilgisayar", "Tebilon", "İncehesap", "Sinerji", "Teknobiyotik"], []);
  const gpus = useMemo(() => ["all", "RTX 3050", "RTX 4060", "RTX 4060 Ti", "RTX 4070", "RTX 4070 SUPER", "RTX 4080 SUPER", "RX 7700 XT", "RX 7800 XT", "RX 6600"], []);

  const filteredSystems = useMemo(() => {
    return systems
      .filter((s) => {
        // Quick Category filter
        if (selectedQuickCategory === "today") {
          const isToday = s.listedDate.toLowerCase().includes("bugün") || s.listedDate.toLowerCase().includes("saat");
          if (!isToday) return false;
        } else if (selectedQuickCategory === "amd_cpu") {
          if (s.cpuBrand !== "AMD") return false;
        } else if (selectedQuickCategory === "intel_cpu") {
          if (s.cpuBrand !== "Intel") return false;
        } else if (selectedQuickCategory === "nvidia_gpu") {
          if (s.gpuBrand !== "Nvidia") return false;
        } else if (selectedQuickCategory === "amd_gpu") {
          if (s.gpuBrand !== "AMD") return false;
        } else if (selectedQuickCategory === "fp_champ") {
          if (s.fpScore < 9.2) return false;
        } else if (selectedQuickCategory === "high_end") {
          if (s.targetResolution !== "1440p 2K" && s.targetResolution !== "4K Gaming") return false;
        }

        // Secondary dropdown filters
        if (selectedSeller !== "all" && s.seller !== selectedSeller) return false;
        if (selectedGpu !== "all" && !s.gpu.toLowerCase().includes(selectedGpu.toLowerCase())) return false;
        if (selectedRamType !== "all" && s.ramType !== selectedRamType) return false;
        if (s.price > maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "fpScore") return b.fpScore - a.fpScore;
        if (sortBy === "priceAsc") return a.price - b.price;
        if (sortBy === "priceDesc") return b.price - a.price;
        if (sortBy === "savings") {
          const savingsA = a.individualZeroPrice - a.price;
          const savingsB = b.individualZeroPrice - b.price;
          return savingsB - savingsA;
        }
        return 0;
      });
  }, [systems, selectedQuickCategory, selectedSeller, selectedGpu, selectedRamType, maxPrice, sortBy]);

  const handleVote = (systemId: string, vote: "yes" | "no") => {
    setUserVotes((prev) => ({
      ...prev,
      [systemId]: prev[systemId] === vote ? ("" as any) : vote
    }));
  };

  const handleFavoriteClick = (system: PrebuiltSystem) => {
    if (!isLoggedIn && onRequireAuth) {
      onRequireAuth();
      return;
    }
    onToggleFavorite(system);
  };

  const handleAlertClick = (system: PrebuiltSystem) => {
    if (!isLoggedIn && onRequireAuth) {
      onRequireAuth();
      return;
    }
    onSetAlert(system);
  };

  const triggerLiveScrape = () => {
    setIsScanning(true);
    setScanToast(null);

    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime("Az önce");
      setScanToast("✅ 8 Mağaza taranarak tüm hazır kasa stokları ve fiyatları güncellendi!");
      setTimeout(() => setScanToast(null), 4000);
    }, 850);
  };

  return (
    <div className="space-y-6">
      {/* Live Scraper & Daily Feed Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Canlı Fiyat &amp; Günlük İlan Radarı</span>
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                CANLI AKTİF
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              8 Türk teknoloji mağazası taranıyor • Son kontrol: <span className="text-neutral-200 font-semibold">{lastScanTime}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={triggerLiveScrape}
            disabled={isScanning}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin text-emerald-400" : ""}`} />
            <span>{isScanning ? "Taranıyor..." : "Şimdi Güncelle"}</span>
          </button>
        </div>
      </div>

      {/* Live Scan Notification Toast */}
      {scanToast && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{scanToast}</span>
        </div>
      )}

      {/* Quick Category Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: "Tüm Kasalar (10)" },
          { id: "today", label: "🔥 Son 24 Saat (Bugün)" },
          { id: "amd_cpu", label: "🔴 Sadece AMD Ryzen" },
          { id: "intel_cpu", label: "🔵 Sadece Intel Core" },
          { id: "nvidia_gpu", label: "🟢 Nvidia GeForce RTX" },
          { id: "amd_gpu", label: "🔴 AMD Radeon RX" },
          { id: "fp_champ", label: "⚡ F/P Şampiyonları (>9.2)" },
          { id: "high_end", label: "👑 2K & 4K Canavarı" }
        ].map((tab) => {
          const isSelected = selectedQuickCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedQuickCategory(tab.id as QuickCategory)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-black"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters Card */}
      <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <span>Filtreler &amp; Detaylı Sıralama</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-normal">
              {filteredSystems.length} sistem bulundu
            </span>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-neutral-400" />
            <span className="text-xs text-neutral-400">Sırala:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sıralama ölçütü"
              className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="fpScore">En Yüksek F/P Skoru (Önerilen)</option>
              <option value="priceAsc">En Düşük Fiyat</option>
              <option value="priceDesc">En Yüksek Fiyat</option>
              <option value="savings">En Fazla Tasarruf / Kâr</option>
            </select>
          </div>
        </div>

        {/* Filter Rows */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          {/* Seller Filter */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1.5">Mağaza</label>
            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              aria-label="Mağaza seçimi"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Tüm Mağazalar (8 Satıcı)</option>
              {sellers.filter((s) => s !== "all").map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* GPU Filter */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1.5">Ekran Kartı Ailesi</label>
            <select
              value={selectedGpu}
              onChange={(e) => setSelectedGpu(e.target.value)}
              aria-label="Ekran kartı seçimi"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Tüm Ekran Kartları</option>
              {gpus.filter((g) => g !== "all").map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* RAM Platform Filter */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1.5">Bellek Standardı</label>
            <select
              value={selectedRamType}
              onChange={(e) => setSelectedRamType(e.target.value)}
              aria-label="RAM tipi seçimi"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Tüm Platformlar (DDR4 &amp; DDR5)</option>
              <option value="DDR5">Sadece DDR5 (AM5 / Yeni Nesil)</option>
              <option value="DDR4">Sadece DDR4 (F/P Odaklı)</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-400 mb-1.5">
              <span>Maksimum Bütçe</span>
              <span className="text-emerald-400 font-bold">{formatTL(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={15000}
              max={130000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Maksimum bütçe belirleme çubuğu"
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>15.000 TL</span>
              <span>130.000 TL+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSystems.map((system) => {
          const savings = system.individualZeroPrice - system.price;
          const isComparing = comparisonList.some((c) => c.id === system.id);
          const isFavorite = favoriteIds.includes(system.id);
          const userVote = userVotes[system.id];

          // Dynamic community percentages
          const baseYes = Math.round(system.fpScore * 9.5);
          const yesPercent = userVote === "yes" ? Math.min(99, baseYes + 2) : userVote === "no" ? Math.max(50, baseYes - 3) : baseYes;
          const noPercent = 100 - yesPercent;

          return (
            <div
              key={system.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700/90 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 overflow-hidden"
            >
              {/* Top Banner Tag & Favorite Button */}
              <div className="p-4 pb-0 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white flex items-center gap-1.5"
                    style={{ backgroundColor: `${system.sellerColor}25`, border: `1px solid ${system.sellerColor}60` }}
                  >
                    <span>{system.sellerLogo}</span>
                    <span style={{ color: system.sellerColor }}>{system.seller}</span>
                  </span>

                  {/* Listing Date Badge */}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 font-semibold flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {system.listedDate}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {system.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {system.badge}
                    </span>
                  )}

                  {/* Favorite Heart Button */}
                  <button
                    onClick={() => handleFavoriteClick(system)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isFavorite
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-500"
                        : "bg-neutral-800/80 border-neutral-700 text-neutral-400 hover:text-rose-400"
                    }`}
                    title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle (Fiyat Alarmı Aç)"}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-rose-500" : ""}`} />
                  </button>
                </div>
              </div>

              {/* PC Case Visual Banner */}
              <div
                onClick={() => onOpenDetail(system)}
                className="relative h-40 mx-4 mt-3 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80 cursor-pointer group-hover:border-emerald-500/40 transition-all"
              >
                <img
                  src={system.imageUrl}
                  alt={system.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-neutral-900/90 backdrop-blur-md text-[10px] text-neutral-300 font-bold border border-neutral-700">
                    {system.targetResolution}
                  </span>
                  {system.installmentsText && (
                    <span className="px-2 py-0.5 rounded bg-neutral-900/90 backdrop-blur-md text-[10px] text-emerald-400 font-bold border border-emerald-500/30">
                      💳 {system.installmentsText.split(":")[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & F/P Score (Clickable to open Detail) */}
              <div
                onClick={() => onOpenDetail(system)}
                className="p-4 pt-3 space-y-2 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {system.title}
                  </h3>
                  {/* F/P Score Badge */}
                  <div className="flex flex-col items-center justify-center min-w-[50px] px-2 py-1 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-400 shrink-0">
                    <span className="text-xs font-black tracking-tight">{system.fpScore}</span>
                    <span className="text-[8px] uppercase tracking-wider text-emerald-500/80 font-bold">F/P Skoru</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {system.highlight}
                </p>
              </div>

              {/* Hardware Specifications */}
              <div className="px-4 py-3 mx-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-2 text-xs">
                {/* GPU */}
                <div
                  onClick={() =>
                    onOpenComponentPrice({
                      name: system.gpu,
                      category: "Ekran Kartı (GPU)",
                      estimatedPrice: 13000
                    })
                  }
                  className="flex items-center gap-2 text-neutral-300 hover:text-emerald-400 cursor-pointer p-1 rounded hover:bg-neutral-900 transition-all"
                  title="Tüm mağazalardaki fiyatları karşılaştır"
                >
                  <Tv className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white truncate">{system.gpu}</span>
                  <span className="text-[10px] text-cyan-400 ml-auto flex items-center gap-0.5 font-bold">
                    <Search className="w-2.5 h-2.5" /> Siteleri Gör
                  </span>
                </div>

                {/* CPU */}
                <div
                  onClick={() =>
                    onOpenComponentPrice({
                      name: system.cpu.split("(")[0].trim(),
                      category: "İşlemci (CPU)",
                      estimatedPrice: 5000
                    })
                  }
                  className="flex items-center gap-2 text-neutral-300 hover:text-cyan-400 cursor-pointer p-1 rounded hover:bg-neutral-900 transition-all"
                  title="Tüm mağazalardaki fiyatları karşılaştır"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{system.cpu}</span>
                  <span className="text-[10px] text-cyan-400 ml-auto flex items-center gap-0.5 font-bold">
                    <Search className="w-2.5 h-2.5" /> Siteleri Gör
                  </span>
                </div>

                {/* RAM */}
                <div className="flex items-center gap-2 text-neutral-300 p-1">
                  <MemoryStick className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{system.ram}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 ml-auto">
                    {system.ramType}
                  </span>
                </div>

                {/* SSD */}
                <div className="flex items-center gap-2 text-neutral-300 p-1">
                  <HardDrive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{system.ssd}</span>
                </div>
              </div>

              {/* Price & Arbitrage Analysis Box */}
              <div className="p-4 space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-500/30">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                        Hazır Sistem Fiyatı
                      </div>
                      <div className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                        <span>{formatTL(system.price)}</span>
                        {system.oldPrice && (
                          <span className="text-xs text-neutral-500 line-through font-normal">
                            {formatTL(system.oldPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <TrendingDown className="w-3 h-3" />
                        {formatTL(savings)} Kâr
                      </span>
                    </div>
                  </div>

                  {/* Arbitrage comparison details */}
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-neutral-800/80 text-[10px] text-neutral-400">
                    <div>
                      Ayrı Sıfır Toplasan:{" "}
                      <span className="text-neutral-300 font-semibold">{formatTL(system.individualZeroPrice)}</span>
                    </div>
                    <div className="text-right">
                      2. El Ederi:{" "}
                      <span className="text-neutral-300 font-semibold">{formatTL(system.individualSecondHandPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Community Voting */}
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="font-semibold text-neutral-300">Bu Fiyata Alınır Mı?</span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      %{yesPercent} Alınır • %{noPercent} Alınmaz
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(system.id, "yes")}
                      className={`flex-1 py-1 px-2 rounded-lg border flex items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                        userVote === "yes"
                          ? "bg-emerald-500 text-neutral-950 border-emerald-500"
                          : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-emerald-400"
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Alınır</span>
                    </button>

                    <button
                      onClick={() => handleVote(system.id, "no")}
                      className={`flex-1 py-1 px-2 rounded-lg border flex items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                        userVote === "no"
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-rose-400"
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>Pahalı</span>
                    </button>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onOpenDetail(system)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-all cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Parçaları Gör</span>
                  </button>

                  <a
                    href={system.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <span>Mağazada Al</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Sub actions (FPS Test + Compare + Price Alert) */}
                <div className="flex items-center justify-between text-xs text-neutral-400 pt-1 border-t border-neutral-800/60 mt-1">
                  <button
                    onClick={() => onTestFps(system)}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>FPS Testi</span>
                  </button>

                  <button
                    onClick={() => onAddToComparison(system)}
                    className={`flex items-center gap-1 text-[11px] transition-colors cursor-pointer ${
                      isComparing ? "text-emerald-400 font-semibold" : "hover:text-neutral-200"
                    }`}
                  >
                    {isComparing ? <Check className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
                    <span>{isComparing ? "Karşılaştırmada" : "Karşılaştır"}</span>
                  </button>

                  <button
                    onClick={() => handleAlertClick(system)}
                    className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Bell className="w-3 h-3" />
                    <span>Alarm</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSystems.length === 0 && (
        <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800 text-neutral-400">
          <p className="text-base font-semibold text-white">Seçilen filtrelere uygun hazır kasa bulunamadı.</p>
          <p className="text-xs text-neutral-500 mt-1">Bütçe aralığını artırmayı veya filtreleri temizlemeyi deneyin.</p>
        </div>
      )}
    </div>
  );
};
