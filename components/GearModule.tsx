"use client";

import React, { useState, useMemo } from "react";
import { GamingGear, MonitorRecommendation } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  Monitor,
  Mouse,
  Keyboard,
  Headphones,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
  CheckCircle2,
  Bell,
  Heart,
  ShieldCheck,
  Zap,
  Tag
} from "lucide-react";

interface GearModuleProps {
  monitors: MonitorRecommendation[];
  gear: GamingGear[];
  onSetAlert?: (itemTitle: string, price: number) => void;
  onOpenEmailPreview?: (itemTitle: string, price: number, image: string, store: string) => void;
  isLoggedIn?: boolean;
  onRequireAuth?: () => void;
}

type GearCategory = "all" | "monitor" | "mouse" | "keyboard" | "headset" | "mousepad";

export const GearModule: React.FC<GearModuleProps> = ({
  monitors,
  gear,
  onSetAlert,
  onOpenEmailPreview,
  isLoggedIn = false,
  onRequireAuth
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GearCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [savedGearIds, setSavedGearIds] = useState<string[]>([]);

  // Adapt monitors to unified gear format for display
  const combinedItems = useMemo(() => {
    const monitorItems: GamingGear[] = monitors.map((m) => ({
      id: m.id,
      name: m.name,
      category: "monitor",
      categoryLabel: "Gaming Monitör",
      brand: m.brand,
      price: m.price,
      tag: m.dealTag || `${m.refreshRate} • ${m.panelType}`,
      specs: `${m.sizeInch} • ${m.resolution} • ${m.refreshRate} • ${m.panelType} • İdeal: ${m.idealForGpu}`,
      imageUrl: m.imageUrl,
      buyUrl: m.buyUrl,
      proPlayersUsing: m.name.includes("ZOWIE") ? ["s1mple", "wtcN", "NiKo"] : undefined
    }));

    return [...gear, ...monitorItems];
  }, [gear, monitors]);

  // Extract all distinct brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(combinedItems.map((item) => item.brand))).sort();
    return ["all", ...list];
  }, [combinedItems]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return combinedItems.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (selectedBrand !== "all" && item.brand !== selectedBrand) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesSpecs = item.specs.toLowerCase().includes(q);
        const matchesPro = item.proPlayersUsing?.some((p) => p.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesSpecs && !matchesPro) return false;
      }
      return true;
    });
  }, [combinedItems, selectedCategory, selectedBrand, searchQuery]);

  const handleToggleSave = (id: string) => {
    if (!isLoggedIn && onRequireAuth) {
      onRequireAuth();
      return;
    }
    setSavedGearIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAlertClick = (item: GamingGear) => {
    if (!isLoggedIn && onRequireAuth) {
      onRequireAuth();
      return;
    }
    if (onOpenEmailPreview) {
      onOpenEmailPreview(item.name, item.price, item.imageUrl, item.brand);
    } else if (onSetAlert) {
      onSetAlert(item.name, item.price);
    }
  };

  const getCategoryIcon = (category: GearCategory | string) => {
    switch (category) {
      case "monitor":
        return <Monitor className="w-4 h-4" />;
      case "mouse":
        return <Mouse className="w-4 h-4" />;
      case "keyboard":
        return <Keyboard className="w-4 h-4" />;
      case "headset":
        return <Headphones className="w-4 h-4" />;
      case "mousepad":
        return <Layers className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>E-Spor Donanım &amp; Çevre Birimleri Veritabanı</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Gaming Ekipman &amp; Monitör Radarı
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1 leading-relaxed">
              Profesyonel esporcuların ve yayıncıların kullandığı gerçek ekipmanlar: Monitör, Mouse, Hall Effect Klavye, Odiofil Kulaklık ve Japon Artisan mousepad&apos;ler.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 bg-neutral-950/80 px-4 py-2.5 rounded-2xl border border-neutral-800 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Tüm fiyatlar ve mağaza stokları günceldir</span>
          </div>
        </div>
      </div>

      {/* Guide Card: Why gear matters */}
      <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="space-y-1">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-cyan-400" />
            Monitör: 180Hz - 360Hz
          </span>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Fast IPS ve OLED panellerde 0.03ms - 1ms tepki süresiyle bulanıklığı sıfırlar.
          </p>
        </div>

        <div className="space-y-1">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Mouse className="w-4 h-4 text-emerald-400" />
            Mouse: 50-60g &amp; 8000Hz
          </span>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Ultra hafif gövde ve optik hibrit switchler ile piksel hassasiyetinde nişan alma.
          </p>
        </div>

        <div className="space-y-1">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Keyboard className="w-4 h-4 text-purple-400" />
            Klavye: Rapid Trigger
          </span>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Manyetik Hall Effect switchler ile parmağınızı kaldırdığınız anda counter-strafe yapın.
          </p>
        </div>

        <div className="space-y-1">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Headphones className="w-4 h-4 text-amber-400" />
            Kulaklık: 3D Konumlandırma
          </span>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Açık akustik ve 53mm sürücülerle duvar arkasındaki ayak seslerini milimetrik duyun.
          </p>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-4">
        {/* Category Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "Tüm Ekipmanlar", icon: <Sparkles className="w-4 h-4" /> },
            { id: "monitor", label: "Monitörler", icon: <Monitor className="w-4 h-4" /> },
            { id: "mouse", label: "Oyuncu Mouse", icon: <Mouse className="w-4 h-4" /> },
            { id: "keyboard", label: "Mekanik Klavye", icon: <Keyboard className="w-4 h-4" /> },
            { id: "headset", label: "Kulaklık", icon: <Headphones className="w-4 h-4" /> },
            { id: "mousepad", label: "Espor Mousepad", icon: <Layers className="w-4 h-4" /> }
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as GearCategory)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20 font-black"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Brand Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ekipman adı, marka, özellik veya pro oyuncu ara (Örn: Wooting, Superlight, TenZ, OLED)..."
              className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
              >
                Temizle
              </button>
            )}
          </div>

          {/* Brand Filter */}
          <div className="w-full sm:w-auto shrink-0">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              aria-label="Marka Filtresi"
              className="w-full sm:w-48 bg-neutral-900 border border-neutral-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="all">Tüm Markalar ({brands.length - 1})</option>
              {brands.filter((b) => b !== "all").map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Gear Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isSaved = savedGearIds.includes(item.id);

          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 overflow-hidden"
            >
              {/* Card Image Banner */}
              <div className="relative h-44 bg-neutral-950 overflow-hidden border-b border-neutral-800/80">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                {/* Category Badge & Save Button */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900/90 backdrop-blur-md text-[11px] font-bold text-white border border-neutral-700">
                    {getCategoryIcon(item.category)}
                    <span>{item.categoryLabel}</span>
                  </span>

                  <button
                    onClick={() => handleToggleSave(item.id)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isSaved
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-500"
                        : "bg-neutral-900/80 backdrop-blur-md border-neutral-700 text-neutral-400 hover:text-rose-400"
                    }`}
                    title={isSaved ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-rose-500" : ""}`} />
                  </button>
                </div>

                {/* Highlight Tag */}
                {item.tag && (
                  <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded-md bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 text-[10px] text-cyan-300 font-bold flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />
                    {item.tag}
                  </span>
                )}
              </div>

              {/* Body Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">
                      {item.brand}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">Orijinal Distribütör</span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {item.name}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {item.specs}
                  </p>
                </div>

                {/* Pro Players usage */}
                {item.proPlayersUsing && item.proPlayersUsing.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1">
                    <span className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">
                      Tercih Eden Esporcular &amp; Yayıncılar:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.proPlayersUsing.map((pro) => (
                        <span
                          key={pro}
                          className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold"
                        >
                          ⭐ {pro}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price and CTA */}
                <div className="pt-2 border-t border-neutral-800/80 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
                        Piyasa Satış Fiyatı
                      </span>
                      <span className="text-xl font-black text-white">
                        {formatTL(item.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAlertClick(item)}
                      className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-bold px-2 py-1 rounded-lg hover:bg-neutral-800 transition-all cursor-pointer"
                      title="İndirim E-postası / Fiyat Alarmı Kur"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>İndirim Alarmı</span>
                    </button>
                  </div>

                  <a
                    href={item.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <span>En Uygun Mağazada Satın Al</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800 text-neutral-400">
          <p className="text-base font-semibold text-white">Aramanıza uygun gaming ekipman bulunamadı.</p>
          <p className="text-xs text-neutral-500 mt-1">Farklı bir kelime deneyin veya kategori filtresini sıfırlayın.</p>
        </div>
      )}
    </div>
  );
};
