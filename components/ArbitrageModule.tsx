"use client";

import React, { useState } from "react";
import { HardwareComponent, SecondHandDealItem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import { SECOND_HAND_LIVE_DEALS } from "@/lib/data";
import {
  Scale,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Search,
  Calculator,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  AlertTriangle,
  ChevronRight,
  Cpu,
  Tv,
  HardDrive,
  Headphones,
  Check,
  Flame,
  Clock,
  MapPin,
  Tag,
  Filter,
  Monitor
} from "lucide-react";

interface ArbitrageModuleProps {
  hardwareList: HardwareComponent[];
  onOpenAdInspector?: () => void;
}

export const ArbitrageModule: React.FC<ArbitrageModuleProps> = ({ hardwareList, onOpenAdInspector }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"all" | "gpu" | "cpu" | "gear" | "monitor">("all");
  const [activeTab, setActiveTab] = useState<"table" | "checklist">("table");

  // Custom 2nd hand search input
  const [directSearchQuery, setDirectSearchQuery] = useState<string>("RTX 4060");

  // Interactive valuation tool states
  const [calcComponentId, setCalcComponentId] = useState<string>(hardwareList[0].id);
  const [calcAdPrice, setCalcAdPrice] = useState<number>(hardwareList[0].secondHandAvg);

  // Live Second-Hand Deals Filtering
  const [selectedPlatform, setSelectedPlatform] = useState<"all" | "sahibinden" | "dolap" | "letgo" | "dhforum">("all");
  const [selectedShCategory, setSelectedShCategory] = useState<"all" | "gpu" | "cpu" | "system" | "monitor" | "gear">("all");

  const filteredSecondHandDeals = SECOND_HAND_LIVE_DEALS.filter((deal) => {
    if (selectedPlatform !== "all" && deal.platform !== selectedPlatform) return false;
    if (selectedShCategory !== "all" && deal.category !== selectedShCategory) return false;
    return true;
  });

  const filteredHardware = hardwareList.filter((item) => {
    if (selectedType !== "all" && item.type !== selectedType) return false;
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const activeCalcItem = hardwareList.find((h) => h.id === calcComponentId) || hardwareList[0];

  // Deal evaluation logic
  const priceDiffFromAvg = calcAdPrice - activeCalcItem.secondHandAvg;
  const isKelepir = calcAdPrice <= activeCalcItem.dealPriceThreshold;
  const isKazik = calcAdPrice > activeCalcItem.secondHandAvg * 1.15;
  const isFair = !isKelepir && !isKazik;

  // External search URLs
  const openSahibinden = (q: string) => {
    window.open(`https://www.sahibinden.com/kelime-ile-arama?query=${encodeURIComponent(q)}`, "_blank");
  };

  const openLetgo = (q: string) => {
    window.open(`https://www.letgo.com/search?query=${encodeURIComponent(q)}`, "_blank");
  };

  const openDolap = (q: string) => {
    window.open(`https://dolap.com/arama?q=${encodeURIComponent(q)}`, "_blank");
  };

  const openDhForum = (q: string) => {
    window.open(`https://forum.donanimhaber.com/search?q=${encodeURIComponent(q)}`, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Sarı Site &amp; Letgo Canlı Donanım Borsası</span>
          </div>

          {onOpenAdInspector && (
            <button
              onClick={onOpenAdInspector}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-500/20 self-start sm:self-auto"
            >
              <span>🔍 2. El İlan Ekspertizi Yap (Link Yapıştır)</span>
            </button>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Sıfır vs. 2. El Donanım Borsası &amp; Popüler İlan Siteleri
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed">
          Sarı Site (Sahibinden), Letgo, Dolap ve DonanımHaber 2. El Forumu piyasasını anlık takip edin.
          Parçaların gerçek piyasa değerini, kelepir eşik fiyatlarını ve mining/arıza test rehberlerini tek tıkla inceleyin.
        </p>
      </div>

      {/* POPÜLER 2. EL PLATFORMLARI HIZLI ARAMA HUB'I */}
      <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Popüler 2. El Sitelerinde Tek Tıkla Ara</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              İstediğin ekran kartı, işlemci veya ekipmanı tek tıkla en popüler 2. el platformlarında arat.
            </p>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
            <input
              type="text"
              value={directSearchQuery}
              onChange={(e) => setDirectSearchQuery(e.target.value)}
              placeholder="Aranacak parça adı (örn: RTX 4060 Ti, Ryzen 5 7600, Wooting 60HE, ZOWIE XL2566K)..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => openSahibinden(directSearchQuery)}
              className="whitespace-nowrap px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20 transition-all cursor-pointer"
            >
              <span>🟡 Sahibinden (Sarı Site)</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={() => openLetgo(directSearchQuery)}
              className="whitespace-nowrap px-3.5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/20 transition-all cursor-pointer"
            >
              <span>🔴 Letgo</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={() => openDolap(directSearchQuery)}
              className="whitespace-nowrap px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              <span>🟣 Dolap</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={() => openDhForum(directSearchQuery)}
              className="whitespace-nowrap px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <span>🔵 DH 2. El Forum</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Popular 2nd Hand Platform Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">
          <div
            onClick={() => openSahibinden("RTX 4060")}
            className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-400/50 transition-all cursor-pointer group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">🟡 Sahibinden</span>
              <span className="text-[10px] text-neutral-500 font-mono">Param Güvende</span>
            </div>
            <p className="text-[11px] text-neutral-300">
              Türkiye&apos;nin en büyük ilan hacmi. Param Güvende ile onay vermeden para satıcıya geçmez.
            </p>
          </div>

          <div
            onClick={() => openLetgo("RTX 4060")}
            className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-rose-400/50 transition-all cursor-pointer group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400">🔴 Letgo / Otoplus</span>
              <span className="text-[10px] text-neutral-500 font-mono">Konum Bazlı</span>
            </div>
            <p className="text-[11px] text-neutral-300">
              Şehrindeki donanımları elden, görerek ve stres testlerini bizzat yaparak almak için idealdir.
            </p>
          </div>

          <div
            onClick={() => openDolap("oyuncu kulaklığı")}
            className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-purple-400/50 transition-all cursor-pointer group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400">🟣 Dolap</span>
              <span className="text-[10px] text-neutral-500 font-mono">Ekipman Odaklı</span>
            </div>
            <p className="text-[11px] text-neutral-300">
              Özellikle gaming mouse, klavye ve kulaklıklarda korumalı ödeme ve uygun kargo avantajı sunar.
            </p>
          </div>

          <div
            onClick={() => openDhForum("RTX 4070")}
            className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-blue-400/50 transition-all cursor-pointer group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400">🔵 DH 2. El Forumu</span>
              <span className="text-[10px] text-neutral-500 font-mono">Referanslı Donanım</span>
            </div>
            <p className="text-[11px] text-neutral-300">
              Eski forum üyelerinin satıcı referans puanlarıyla güvenle donanım takaslayıp alabildiğin mecra.
            </p>
          </div>
        </div>
      </div>

      {/* OTOMATİK CANLI 2. EL KELEPİR İLANLAR & PLATFORM FİLTRESİ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              <span>Canlı 2. El Radarı ({filteredSecondHandDeals.length} Aktif İlan)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Otomatik Kelepir İlan Akışı &amp; Platform Filtresi
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Sahibinden, Dolap, Letgo ve DonanımHaber forumundaki piyasanın altında düşen sıcak ilanlar.
            </p>
          </div>
        </div>

        {/* PLATFORM FILTERS (Sadece Sahibinden, Sadece Dolap, Letgo veya Tümü) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Filtrele:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "🌐 Tüm Platformlar", count: SECOND_HAND_LIVE_DEALS.length },
              { id: "sahibinden", label: "🟡 Sahibinden (Sarı Site)", count: SECOND_HAND_LIVE_DEALS.filter(d => d.platform === "sahibinden").length, activeColor: "bg-amber-400 text-neutral-950 font-black shadow-lg shadow-amber-400/20" },
              { id: "dolap", label: "🟣 Sadece Dolap", count: SECOND_HAND_LIVE_DEALS.filter(d => d.platform === "dolap").length, activeColor: "bg-purple-600 text-white font-black shadow-lg shadow-purple-600/20" },
              { id: "letgo", label: "🔴 Sadece Letgo", count: SECOND_HAND_LIVE_DEALS.filter(d => d.platform === "letgo").length, activeColor: "bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20" },
              { id: "dhforum", label: "🔵 DH 2. El Forum", count: SECOND_HAND_LIVE_DEALS.filter(d => d.platform === "dhforum").length, activeColor: "bg-blue-600 text-white font-black shadow-lg shadow-blue-600/20" }
            ].map((p) => {
              const isActive = selectedPlatform === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? p.activeColor || "bg-white text-neutral-950 font-black shadow-lg"
                      : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                  }`}
                >
                  <span>{p.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-black/20 text-current" : "bg-neutral-800 text-neutral-400"}`}>
                    {p.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CATEGORY FILTERS (GPU, CPU, Hazır Kasa, Monitör, Ekipman) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kategori Seç:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "Tüm Parçalar" },
              { id: "gpu", label: "⚡ Ekran Kartı (GPU)" },
              { id: "cpu", label: "🧠 İşlemci (CPU)" },
              { id: "system", label: "🖥️ Hazır Kasa Sistem" },
              { id: "monitor", label: "🖥️ Oyuncu Monitörü" },
              { id: "gear", label: "🎧 Oyuncu Ekipmanı" }
            ].map((c) => {
              const isActive = selectedShCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedShCategory(c.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-cyan-500 text-neutral-950 font-black shadow-md shadow-cyan-500/20"
                      : "bg-neutral-900/80 hover:bg-neutral-850 text-neutral-400 hover:text-white border border-neutral-800"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* LIVE DEALS GRID */}
        {filteredSecondHandDeals.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2">
            <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
            <p className="text-sm font-bold text-white">Seçilen filtrede ilan bulunamadı</p>
            <p className="text-xs text-neutral-400">Lütfen farklı bir kategori veya platform seçin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {filteredSecondHandDeals.map((deal) => {
              const platformClick = () => {
                if (deal.platform === "sahibinden") openSahibinden(deal.searchQuery);
                else if (deal.platform === "dolap") openDolap(deal.searchQuery);
                else if (deal.platform === "letgo") openLetgo(deal.searchQuery);
                else openDhForum(deal.searchQuery);
              };

              return (
                <div
                  key={deal.id}
                  className="rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 p-4 flex flex-col justify-between space-y-3 transition-all hover:shadow-xl group"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Platform Badge & Savings Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-[10px] font-black px-2.5 py-1 rounded-lg text-neutral-950 flex items-center gap-1 shadow-sm"
                        style={{ backgroundColor: deal.platformColor }}
                      >
                        {deal.platform === "sahibinden" && "🟡"}
                        {deal.platform === "dolap" && "🟣"}
                        {deal.platform === "letgo" && "🔴"}
                        {deal.platform === "dhforum" && "🔵"}
                        <span>{deal.platformName}</span>
                      </span>

                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        +{formatTL(deal.savingsTL)} KÂR (%{deal.savingsPercent})
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                        {deal.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                        {deal.specsSummary}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-neutral-500 uppercase font-bold block">İlan Fiyatı</span>
                        <div className="text-base font-black text-white">
                          {formatTL(deal.askingPrice)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold block">Sıfır Fiyatı</span>
                        <div className="text-xs font-semibold text-neutral-400 line-through">
                          {formatTL(deal.newPrice)}
                        </div>
                      </div>
                    </div>

                    {/* Location, Date & Trust Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-neutral-400 pt-1 border-t border-neutral-800/60">
                      <div className="flex items-center gap-1 text-neutral-400">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        <span>{deal.city}</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-500">
                        <Clock className="w-3 h-3" />
                        <span>{deal.timeAgo}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-0.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-500/20 font-medium">
                        🛡️ {deal.trustBadge}
                      </span>
                      <span className="text-neutral-500 text-[9px] font-mono">
                        {deal.condition}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={platformClick}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-neutral-700 group-hover:border-amber-400/50"
                  >
                    <span>{deal.platformName}&apos;de İlanı / Benzerini İncele</span>
                    <ExternalLink className="w-3 h-3 text-amber-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Deal Valuation Calculator */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-amber-500/40 shadow-xl space-y-5">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Calculator className="w-5 h-5 text-amber-400" />
          <span>&quot;Bu İlan Alınır Mı?&quot; 2. El Değerleme Hesaplayıcı</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1.5">
              Almak İstediğin Parça:
            </label>
            <select
              value={calcComponentId}
              onChange={(e) => {
                setCalcComponentId(e.target.value);
                const found = hardwareList.find((h) => h.id === e.target.value);
                if (found) setCalcAdPrice(found.secondHandAvg);
              }}
              aria-label="Değerlenecek donanım parçası seçimi"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {hardwareList.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1.5">
              İlandaki Fiyat (TL):
            </label>
            <input
              type="number"
              value={calcAdPrice}
              onChange={(e) => setCalcAdPrice(Number(e.target.value))}
              aria-label="İlan fiyatı girin"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Verdict output */}
          <div className="flex flex-col justify-center">
            {isKelepir && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs space-y-0.5">
                <div className="font-bold flex items-center gap-1.5 text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  🔥 KELEPİR FIRSAT! KAÇIRMA!
                </div>
                <div>Ortalama 2. el piyasasının altında. Testlerini yapıp hemen alabilirsin.</div>
              </div>
            )}

            {isFair && (
              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs space-y-0.5">
                <div className="font-bold flex items-center gap-1.5 text-sm text-blue-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Piyasa Değerinde (Makul)
                </div>
                <div>Fiyat normal aralıkta. Ufak bir pazarlıkla daha tatlı hale gelebilir.</div>
              </div>
            )}

            {isKazik && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs space-y-0.5">
                <div className="font-bold flex items-center gap-1.5 text-sm text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                  ⚠️ ŞİŞİRİLMİŞ FİYAT (KAZIK)
                </div>
                <div>Bu fiyata sıfırına yakın satıyorlar, bu paraya kesinlikle alınmaz!</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Borsayı İncele vs 2. El Stres Test Rehberi */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setActiveTab("table")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "table"
              ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20"
              : "bg-neutral-900 text-neutral-400 hover:text-white"
          }`}
        >
          📊 Canlı Fiyat Makası Tablosu
        </button>

        <button
          onClick={() => setActiveTab("checklist")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "checklist"
              ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20"
              : "bg-neutral-900 text-neutral-400 hover:text-white"
          }`}
        >
          <span>🛡️ 2. El Stres Testi &amp; Ekspertiz Rehberi</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold">Önemli</span>
        </button>
      </div>

      {activeTab === "checklist" ? (
        /* 2. EL DONANIM STRES TESTİ VE GÜVENLİ ALIM KONTROL LİSTESİ */
        <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>İkinci El Alırken Kazıklanmama &amp; Stres Testi Kontrol Listesi</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Sarı siteden veya Letgo&apos;dan parça almadan önce satıcıdan mutlaka talep etmeniz gereken testler:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* GPU Checklist */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Tv className="w-4 h-4" />
                <span>Ekran Kartı (GPU) Kontrolü</span>
              </div>
              <ul className="space-y-2 text-neutral-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>15 Dk FurMark Stres Testi:</strong> Çekirdek sıcaklığı 75°C, Hotspot farkı 15°C altında olmalıdır. Ekranda artifact (renk bozulması) olmamalı.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Güvenlik Etiketi &amp; Vida Kontrolü:</strong> Arka plakadaki garanti vidası yırtılmışsa kart açılmış veya tamir görmüş olabilir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>GPU-Z Sensör Kontrolü:</strong> Fan devirleri dengeli dönmeli, fan bilyelerinde tıkırtı veya sürtme sesi olmamalıdır.</span>
                </li>
              </ul>
            </div>

            {/* CPU Checklist */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Cpu className="w-4 h-4" />
                <span>İşlemci (CPU) Kontrolü</span>
              </div>
              <ul className="space-y-2 text-neutral-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Cinebench R23 Stres Testi:</strong> 10 dakikalık döngüde mavi ekran vermeden stabil puan almalıdır.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Fiziksel Pin Kontrolü:</strong> AMD AM4 işlemcilerin pinlerinde, Intel/AM5 anakart soketlerinde eğiklik veya lehim tamiri olmamalıdır.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Delid Durumu:</strong> İşlemci kapağının açılıp sıvı metal sürülüp sürülmediğini mutlaka satıcıya sorun.</span>
                </li>
              </ul>
            </div>

            {/* RAM & SSD Checklist */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <HardDrive className="w-4 h-4" />
                <span>SSD &amp; RAM Bellek Kontrolü</span>
              </div>
              <ul className="space-y-2 text-neutral-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>CrystalDiskInfo SSD Sağlığı:</strong> Kalan sağlık en az %85-%90 olmalı, Bad Sector (bozuk sektör) bulunmamalıdır.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>TBW Yazma Miktarı:</strong> SSD ömrünün kaç terabayt yazıldığına dikkat edin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>MemTest86 RAM Testi:</strong> Belleklerde hata çıkmamalı, XMP/EXPO profilinde tam hızda çalışmalıdır.</span>
                </li>
              </ul>
            </div>

            {/* Gear & Monitor Checklist */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Headphones className="w-4 h-4" />
                <span>Gaming Ekipman &amp; Monitör Kontrolü</span>
              </div>
              <ul className="space-y-2 text-neutral-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Monitör Ölü Piksel &amp; Işık Sızması:</strong> Düz siyah, beyaz ve RGB arka planda ölü piksel ve panel çizik kontrolü yapın.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Mouse Double-Click Testi:</strong> Sol ve sağ tık switchlerinde çift tıklama veya kaçırma olmamalıdır.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Wooting / Manyetik Klavye:</strong> Rapid trigger tuş hassasiyeti yazılım üzerinden kalibre edilip test edilmelidir.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* 2. EL DONANIM BORSASI FİYAT MAKASI TABLOSU */
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === "all" ? "bg-amber-500 text-neutral-950 font-bold" : "bg-neutral-900 text-neutral-400 hover:text-white"
                }`}
              >
                Tüm İlanlar
              </button>
              <button
                onClick={() => setSelectedType("gpu")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === "gpu" ? "bg-amber-500 text-neutral-950 font-bold" : "bg-neutral-900 text-neutral-400 hover:text-white"
                }`}
              >
                Ekran Kartları (GPU)
              </button>
              <button
                onClick={() => setSelectedType("cpu")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === "cpu" ? "bg-amber-500 text-neutral-950 font-bold" : "bg-neutral-900 text-neutral-400 hover:text-white"
                }`}
              >
                İşlemciler (CPU)
              </button>
              <button
                onClick={() => setSelectedType("gear")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === "gear" ? "bg-amber-500 text-neutral-950 font-bold" : "bg-neutral-900 text-neutral-400 hover:text-white"
                }`}
              >
                🎮 Gaming Ekipman
              </button>
              <button
                onClick={() => setSelectedType("monitor")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === "monitor" ? "bg-amber-500 text-neutral-950 font-bold" : "bg-neutral-900 text-neutral-400 hover:text-white"
                }`}
              >
                🖥️ Espor Monitör
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Tabloda parça ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Hardware Arbitrage Table */}
          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Donanım</th>
                  <th className="py-3 px-4">Sıfır Fiyatı</th>
                  <th className="py-3 px-4">2. El Ortalama</th>
                  <th className="py-3 px-4 text-emerald-400">Kelepir Eşik Fiyatı</th>
                  <th className="py-3 px-4">2. El Risk Durumu</th>
                  <th className="py-3 px-4">İlan Sitelerinde Canlı Ara</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {filteredHardware.map((item) => {
                  const diff = item.newPriceAvg - item.secondHandAvg;
                  const isLowRisk = item.secondHandRisk === "Düşük Risk";

                  return (
                    <tr key={item.id} className="hover:bg-neutral-800/40 transition-colors">
                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-white">
                        <div>{item.name}</div>
                        <div className="text-[10px] text-neutral-500 font-normal">{item.specsSummary}</div>
                      </td>

                      {/* New Price */}
                      <td className="py-3 px-4 text-neutral-300 font-semibold">
                        {formatTL(item.newPriceAvg)}
                      </td>

                      {/* 2nd Hand Price */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-amber-400">{formatTL(item.secondHandAvg)}</span>
                        <span className="text-[10px] text-emerald-400 block font-normal">
                          -{formatTL(diff)} daha ucuz
                        </span>
                      </td>

                      {/* Deal Price Threshold */}
                      <td className="py-3 px-4 font-black text-emerald-400">
                        &lt; {formatTL(item.dealPriceThreshold)}
                      </td>

                      {/* Risk */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isLowRisk
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {isLowRisk ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                          {item.secondHandRisk}
                        </span>
                      </td>

                      {/* Direct 2nd Hand Search Buttons */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openSahibinden(item.name)}
                            className="px-2 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-neutral-950 font-bold text-[10px] border border-amber-400/30 transition-all cursor-pointer flex items-center gap-0.5"
                            title="Sahibinden'de bu parçayı ara"
                          >
                            <span>Sarı Site</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>

                          <button
                            onClick={() => openLetgo(item.name)}
                            className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-[10px] border border-rose-500/30 transition-all cursor-pointer flex items-center gap-0.5"
                            title="Letgo'da bu parçayı ara"
                          >
                            <span>Letgo</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. EL YASAL SORUMLULUK REDDİ & DOLANDIRICILIK UYARISI */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-2 leading-relaxed">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>İkinci El Alışveriş Güvenlik Uyarısı &amp; Sorumluluk Reddi</span>
        </div>
        <p>
          <strong>KasaRadar ikinci el alım-satım işlemlerinde satıcı, aracı veya garantör DEĞİLDİR.</strong> Yukarıda belirtilen fiyatlar Sarı Site (Sahibinden), Letgo, Dolap ve forumlardaki genel piyasa ortalamalarına dayanır.
        </p>
        <p className="text-neutral-500">
          İkinci el donanım alırken asla tanımadığınız kişilere doğrudan IBAN üzerinden kapora veya peşin ödeme göndermeyiniz. Alışverişlerinizi sadece <strong>Param Güvende</strong> veya <strong>yüz yüze donanım stres testlerini (FurMark, Cinebench, CrystalDiskInfo)</strong> yaparak gerçekleştiriniz. Kullanıcılar arası ticarette oluşabilecek arıza, dolandırıcılık veya kargo hasarlarından KasaRadar doğrudan veya dolaylı olarak sorumlu tutulamaz.
        </p>
      </div>
    </div>
  );
};
