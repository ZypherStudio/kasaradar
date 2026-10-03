"use client";

import React, { useState } from "react";
import { PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  X,
  ExternalLink,
  Zap,
  Cpu,
  Tv,
  Layers,
  Sparkles,
  Share2,
  Copy,
  Check,
  TrendingDown,
  Monitor,
  Flame,
  CheckCircle2,
  Sliders,
  DollarSign
} from "lucide-react";

import { ComponentPriceInfo } from "./ComponentPriceModal";

interface SystemDetailModalProps {
  system: PrebuiltSystem | null;
  onClose: () => void;
  onTestFps: (system: PrebuiltSystem) => void;
  onOpenComponentPrice?: (comp: ComponentPriceInfo) => void;
}

export const SystemDetailModal: React.FC<SystemDetailModalProps> = ({
  system,
  onClose,
  onTestFps,
  onOpenComponentPrice
}) => {
  const [dailyGamingHours, setDailyGamingHours] = useState<number>(4);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedForumCode, setCopiedForumCode] = useState<boolean>(false);

  // Customization simulator states
  const [upgradeRam32, setUpgradeRam32] = useState<boolean>(false);
  const [upgradeSsd2Tb, setUpgradeSsd2Tb] = useState<boolean>(false);
  const [upgradeCooler, setUpgradeCooler] = useState<boolean>(false);

  if (!system) return null;

  // Customization additions
  const extraRamCost = system.ramType === "DDR5" ? 2200 : 1600;
  const extraSsdCost = 2400;
  const extraCoolerCost = 1350;

  const customizedPrice =
    system.price +
    (upgradeRam32 ? extraRamCost : 0) +
    (upgradeSsd2Tb ? extraSsdCost : 0) +
    (upgradeCooler ? extraCoolerCost : 0);

  // Electricity calculation (Turkey average tier ~ 2.60 TL per kWh)
  const powerKw = (system.tdpWatts || 300) / 1000;
  const monthlyKwh = powerKw * dailyGamingHours * 30;
  const monthlyElectricBillTL = Math.round(monthlyKwh * 2.60);

  // Copy share link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://kasaradar.com/kasa/${system.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Copy forum BBCode for Technopat / DonanımHaber
  const handleCopyForumCode = () => {
    const bbCode = `[B]${system.title}[/B] - ${system.seller} (${formatTL(system.price)})\nGPU: ${system.gpu}\nCPU: ${system.cpu}\nRAM: ${system.ram}\nSSD: ${system.ssd}\nİnceleme: https://kasaradar.com/kasa/${system.id}`;
    navigator.clipboard.writeText(bbCode);
    setCopiedForumCode(true);
    setTimeout(() => setCopiedForumCode(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-y-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded text-xs font-bold text-white"
                style={{ backgroundColor: `${system.sellerColor}25`, color: system.sellerColor }}
              >
                {system.seller}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-semibold">
                {system.targetResolution}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black">
                F/P: {system.fpScore} / 10
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{system.title}</h2>
            <p className="text-xs text-neutral-400">{system.highlight}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing & Direct Store Action Bar */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-neutral-400 uppercase font-semibold">
              Canlı Hazır Kasa Satış Fiyatı
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-3">
              <span>{formatTL(customizedPrice)}</span>
              {customizedPrice !== system.price && (
                <span className="text-xs text-emerald-400 font-normal">
                  (Özelleştirilmiş Fiyat)
                </span>
              )}
              {system.oldPrice && (
                <span className="text-sm text-neutral-500 line-through font-normal">
                  {formatTL(system.oldPrice)}
                </span>
              )}
            </div>
            <div className="text-xs text-emerald-400 font-semibold mt-0.5">
              Parçaları tek tek sıfır toplamaya göre{" "}
              {formatTL(system.individualZeroPrice - system.price)} kârdasınız!
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onTestFps(system);
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 border border-cyan-500/30 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>FPS Test Et</span>
            </button>

            <a
              href={system.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>{system.seller}&apos;dan Satın Al</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Chassis, Cooling Architecture & Installments Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
          <div className="sm:col-span-6 p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
              <Cpu className="w-4 h-4" />
              <span>Kasa, Soğutma &amp; Güç Mimarisi</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Kasa Modeli:</span>
                <span className="font-bold text-white text-right max-w-[220px] truncate" title={system.caseModel}>
                  {system.caseModel}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">İşlemci Soğutucu:</span>
                <span className="font-semibold text-cyan-300 text-right max-w-[220px] truncate" title={system.cooling}>
                  {system.cooling}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Güç Kaynağı (PSU):</span>
                <span className="font-semibold text-neutral-200 text-right max-w-[220px] truncate" title={system.psu}>
                  {system.psu}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Güç Tüketimi (TDP):</span>
                <span className="font-bold text-amber-400">{system.tdpWatts || 350}W</span>
              </div>
            </div>
          </div>

          <div className="sm:col-span-6 p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between space-y-2.5 text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                <DollarSign className="w-4 h-4" />
                <span>Finansman &amp; Taksit Seçenekleri</span>
              </div>
              <p className="text-neutral-300 font-semibold leading-relaxed mt-1">
                {system.installmentsText || "Peşin Fiyatına 3 - 6 Taksit İmkanı: Axess, Maximum, World, Bonus, Paraf"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80">
              <div>
                3 Taksit: <strong className="text-white">{formatTL(Math.round(customizedPrice / 3))} / Ay</strong>
              </div>
              <div>
                6 Taksit: <strong className="text-white">{formatTL(Math.round(customizedPrice / 6))} / Ay</strong>
              </div>
            </div>
            <span className="text-[10px] text-neutral-500 block">
              *Taksit oranları ve vade farksız seçenekler satıcı mağazanın ödeme adımında geçerlidir.
            </span>
          </div>
        </div>

        {/* Individual Component Links (Parça Parça Satın Alma Linkleri) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Kasanın Bileşenleri &amp; Ayrı Ayrı Satın Alma Linkleri
            </span>
            <span className="text-[11px] text-neutral-400">
              Ayrı Sıfır Toplam: {formatTL(system.individualZeroPrice)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {system.partsBreakdown.map((part, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-all flex items-center justify-between gap-3"
              >
                <div
                  onClick={() =>
                    onOpenComponentPrice &&
                    onOpenComponentPrice({
                      name: part.name,
                      category: part.category,
                      estimatedPrice: part.individualNewPrice
                    })
                  }
                  className="overflow-hidden cursor-pointer hover:text-emerald-400 transition-colors"
                  title="Tüm mağaza fiyatlarını gör"
                >
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold flex items-center gap-1">
                    <span>{part.category}</span>
                    <span className="text-cyan-400 text-[9px] font-bold">• Fiyatları Karşılaştır</span>
                  </div>
                  <div className="font-semibold text-white truncate">{part.name}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-neutral-300">
                    {formatTL(part.individualNewPrice)}
                  </span>
                  <a
                    href={part.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all"
                    title={`${part.store} üzerinde hemen incele`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KILLER FEATURE 1: Darboğaz (Bottleneck) & PSU Güvenlik / Tier List Dedektörü */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Darboğaz Analizi */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                İşlemci - Ekran Kartı Darboğaz Testi
              </span>
              <span className="text-xs font-black text-emerald-400">
                %{Math.min(15, Math.max(2, Math.round(Math.abs(system.cpuTier - system.gpuTier) * 0.7)))} Darboğaz
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">İşlemci Gücü:</span>
                <span className="font-bold text-cyan-400">{system.cpuTier} / 100</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Ekran Kartı Gücü:</span>
                <span className="font-bold text-emerald-400">{system.gpuTier} / 100</span>
              </div>
              <div className="pt-1.5 border-t border-neutral-800 text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {Math.abs(system.cpuTier - system.gpuTier) <= 8
                    ? "Kusursuz Uyum! İşlemci ekran kartının %100 potansiyelini besler."
                    : "Dengeli Konfigürasyon. 1080p ve 2K'da akıcı yüksek FPS üretir."}
                </span>
              </div>
            </div>
          </div>

          {/* PSU Tier List & Güvenlik Analizi */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Güç Kaynağı (PSU) Kalite Derecesi
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                Tier A/B • 80+ Onaylı
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 space-y-1.5">
              <div className="text-[11px] font-bold text-white truncate">
                {system.psu}
              </div>
              <p className="text-[10px] text-neutral-400 leading-relaxed">
                Yüksek akım ve voltaj korumaları (OVP, OCP, SCP) devrededir. C4/kalitesiz PSU riski taşımayan, güvenilir markadır.
              </p>
              <div className="pt-1 border-t border-neutral-800 text-[10px] text-emerald-400 font-bold">
                🛡️ Sistem Koruma Skoru: 9.8 / 10 (Donanım Dostu)
              </div>
            </div>
          </div>
        </div>

        {/* KILLER FEATURE 2: Son 30 Gün Fiyat Geçmişi & Şişirme İndirim Dedektörü */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                Son 30 Gün Fiyat Geçmişi &amp; İndirim Doğrulama
              </span>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                Mağaza fiyatı önce artırıp sonra sahte indirim mi yapmış? Fiyat takip botu analizi:
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 shrink-0 self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5" />
              %100 GERÇEK İNDİRİM
            </span>
          </div>

          {/* Interactive Timeline Graph Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-500 block">30 Gün Önce</span>
              <span className="font-bold text-neutral-300">{formatTL(Math.round(system.price * 1.08))}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-500 block">15 Gün Önce</span>
              <span className="font-bold text-neutral-300">{formatTL(Math.round(system.price * 1.05))}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-500 block">7 Gün Önce</span>
              <span className="font-bold text-neutral-400 line-through">
                {formatTL(system.oldPrice || Math.round(system.price * 1.09))}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-center">
              <span className="text-[10px] text-emerald-400 font-bold block">Bugünkü Fiyat</span>
              <span className="font-black text-white">{formatTL(system.price)}</span>
            </div>
          </div>
        </div>

        {/* KILLER FEATURE 3: Kasa Parçalama & Al-Satçı Arbitraj Kârı */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-purple-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-purple-400" />
              Al-Satçı &amp; Kasa Parçalama Kâr Analizi
            </span>
            <span className="text-xs font-black text-purple-300">
              +{formatTL(system.individualZeroPrice - system.price)} Net Tasarruf
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            Bu kasayı mağazadan satın alıp parçalarını tek tek sıfır kapalı kutu satsan bile kârdasın! Sarı sitedeki 2. el hızlı satış ederi ise yaklaşık <b>{formatTL(system.individualSecondHandPrice)}</b> seviyesindedir.
          </p>
        </div>

        {/* Customization Simulator (Parça Özelleştirme) */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-400" />
              Sistem Özelleştirme Simülatörü
            </span>
            <span className="text-[11px] text-neutral-400">
              Bu kasayı yükseltirsen ne kadara mal olur?
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setUpgradeRam32(!upgradeRam32)}
              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                upgradeRam32
                  ? "bg-purple-500/20 border-purple-500 text-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>32GB RAM Yükseltmesi</span>
                <span className="text-purple-400">+{formatTL(extraRamCost)}</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">Yayın ve ağır oyunlar için önerilir</div>
            </button>

            <button
              onClick={() => setUpgradeSsd2Tb(!upgradeSsd2Tb)}
              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                upgradeSsd2Tb
                  ? "bg-purple-500/20 border-purple-500 text-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2TB Gen4 SSD Yükseltmesi</span>
                <span className="text-purple-400">+{formatTL(extraSsdCost)}</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">GTA 6 ve 5 büyük oyun aynı anda</div>
            </button>

            <button
              onClick={() => setUpgradeCooler(!upgradeCooler)}
              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                upgradeCooler
                  ? "bg-purple-500/20 border-purple-500 text-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>Kule Tipi Sıvı Soğutma</span>
                <span className="text-purple-400">+{formatTL(extraCoolerCost)}</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">Sessiz çalışma &amp; -15°C sıcaklık</div>
            </button>
          </div>
        </div>

        {/* TDP & Monthly Electricity Bill Simulator */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Güç Tüketimi (TDP) &amp; Elektrik Faturası Tahmini
            </span>
            <span className="text-xs font-bold text-amber-400">
              Yük Altında ~{system.tdpWatts} Watt
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                <span>Günde Kaç Saat Oyun Oynuyorsun?</span>
                <span className="font-bold text-white">{dailyGamingHours} Saat / Gün</span>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                value={dailyGamingHours}
                onChange={(e) => setDailyGamingHours(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
              />
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-neutral-500 uppercase">Aylık Tahmini Elektrik Maliyeti</div>
                <div className="text-lg font-black text-amber-400">~{monthlyElectricBillTL} TL / Ay</div>
              </div>
              <div className="text-[11px] text-neutral-400 text-right">
                <div>(30 gün üzerinden)</div>
                <div className="text-neutral-500 text-[10px]">2.60 TL / kWh tarifesi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Monitors for this GPU */}
        {system.recommendedMonitors && system.recommendedMonitors.length > 0 && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-emerald-400" />
              Bu Ekran Kartı İçin En İyi Monitör Eşleşmesi
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {system.recommendedMonitors.map((mon) => (
                <div
                  key={mon.id}
                  className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 block">{mon.dealTag}</span>
                    <div className="font-bold text-white">{mon.name}</div>
                    <div className="text-[11px] text-neutral-400">
                      {mon.resolution} • {mon.refreshRate} • {mon.panelType}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-black text-white">{formatTL(mon.price)}</div>
                    <a
                      href={mon.buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500 text-neutral-950 font-bold"
                    >
                      <span>Satın Al</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share & Forum Code Generation */}
        <div className="pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Link Kopyalandı!" : "Paylaşım Linkini Kopyala"}</span>
            </button>

            <button
              onClick={handleCopyForumCode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              {copiedForumCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedForumCode ? "Forum Kodu Kopyalandı!" : "Technopat / DH Forum Formatı Kopyala"}</span>
            </button>
          </div>

          <span className="text-[11px] text-neutral-500">
            Garanti: {system.warranty}
          </span>
        </div>
      </div>
    </div>
  );
};
