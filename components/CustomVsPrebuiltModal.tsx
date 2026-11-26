"use client";

import React, { useState, useMemo } from "react";
import { PrebuiltSystem } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  Swords,
  X,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Zap,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Layers,
  Cpu,
  PackageCheck,
  AlertTriangle,
  Flame,
  Share2
} from "lucide-react";

interface CustomVsPrebuiltModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: PrebuiltSystem[];
  onSelectSystemDetail?: (system: PrebuiltSystem) => void;
  onSelectSystemForFps?: (system: PrebuiltSystem) => void;
}

export const CustomVsPrebuiltModal: React.FC<CustomVsPrebuiltModalProps> = ({
  isOpen,
  onClose,
  systems,
  onSelectSystemDetail,
  onSelectSystemForFps
}) => {
  const [selectedSystemId, setSelectedSystemId] = useState<string>(
    systems[0]?.id || ""
  );
  const [copiedBBCode, setCopiedBBCode] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const currentSystem = useMemo(() => {
    return systems.find((s) => s.id === selectedSystemId) || systems[0];
  }, [systems, selectedSystemId]);

  if (!isOpen || !currentSystem) return null;

  const individualSum = currentSystem.individualZeroPrice;
  const prebuiltPrice = currentSystem.price;
  const netSavings = Math.max(0, individualSum - prebuiltPrice);
  const savingsPercent = individualSum > 0 ? Math.round((netSavings / individualSum) * 100) : 0;

  const handleCopyForumBBCode = () => {
    const text = `[B][SIZE=4]⚔️ Parça Parça Toplama vs Hazır Kasa Fiyat Savaşı[/SIZE][/B]
[B]Sistem:[/B] ${currentSystem.title} (${currentSystem.seller})
[B]Tek Tek Parça Toplama Maliyeti:[/B] ${formatTL(individualSum)}
[B]Hazır Kasa Satış Fiyatı:[/B] ${formatTL(prebuiltPrice)}
[B]🔥 Net Tasarruf:[/B] ${formatTL(netSavings)} (%${savingsPercent} daha kârlı!)

[B]Bileşenler:[/B]
• GPU: ${currentSystem.gpu}
• CPU: ${currentSystem.cpu}
• Anakart: ${currentSystem.motherboard}
• RAM: ${currentSystem.ram}
• SSD: ${currentSystem.ssd}
• Kasa & PSU: ${currentSystem.caseModel} • ${currentSystem.psu}

[B]Detaylı Analiz & FPS Testi:[/B] https://kasaradar.com/?q=${encodeURIComponent(currentSystem.title)}
[B]Doğrudan Mağaza Linki:[/B] ${currentSystem.directUrl}`;

    navigator.clipboard.writeText(text);
    setCopiedBBCode(true);
    setTimeout(() => setCopiedBBCode(false), 2500);
  };

  const handleShare = () => {
    const shareText = `Kanka şu kasaya baksana! Tek tek toplasan ${formatTL(individualSum)} tutuyor ama hazır kasayı ${formatTL(prebuiltPrice)}'ye veriyorlar. Tam ${formatTL(netSavings)} TL cepte kalıyor: https://kasaradar.com/?q=${encodeURIComponent(currentSystem.title)}`;
    if (navigator.share) {
      navigator.share({
        title: "KasaRadar Parça vs Hazır Sistem Savaşı",
        text: shareText,
        url: "https://kasaradar.com"
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Swords className="w-4 h-4 text-emerald-400" />
              <span>PCPartPicker Tarzı Akıllı Borsa Karşılaştırması</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Parça Parça Toplama vs Hazır Kasa Savaşı
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Aynı parçaları tek tek Akakçe veya Cimri&apos;den toplarsan kaç TL, hazır kasa olarak alırsan kaç TL tutar?
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Selector Dropdown & Quick Badges */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
            Analiz Edilecek Hazır Kasayı Seç:
          </label>
          <div className="relative">
            <select
              value={selectedSystemId}
              onChange={(e) => setSelectedSystemId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-700 text-white font-bold text-sm focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
            >
              {systems.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.seller} • {s.title} — {formatTL(s.price)} ({s.gpu})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Chip Shortcuts */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {systems.slice(0, 4).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSystemId(s.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                  selectedSystemId === s.id
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
                }`}
              >
                {s.seller}: {s.gpu}
              </button>
            ))}
          </div>
        </div>

        {/* NET SAVINGS HERO BANNER */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-neutral-950 to-cyan-950/60 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>KasaRadar Kâr &amp; Arbitraj Analizi</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              +{formatTL(netSavings)}{" "}
              <span className="text-emerald-400 text-2xl sm:text-3xl">Cepte Kalıyor!</span>
            </div>
            <p className="text-xs text-neutral-300">
              Bu kasayı hazır almak, parçaları tek tek satın almaktan{" "}
              <strong className="text-emerald-400 font-black">%{savingsPercent} daha kârlı</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href={currentSystem.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>{currentSystem.seller}&apos;dan Bu Fiyata Kap</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {onSelectSystemDetail && (
              <button
                onClick={() => {
                  onClose();
                  onSelectSystemDetail(currentSystem);
                }}
                className="px-4 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 border border-neutral-700 transition-all cursor-pointer"
              >
                <span>Detaylı İncele</span>
              </button>
            )}
          </div>
        </div>

        {/* TWO COMBATANTS (Tek Tek vs Hazır Kasa) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sol: Tek Tek Parça Toplama */}
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  Alternatif Yol
                </span>
                <h3 className="text-base font-black text-white">Tek Tek Parça Toplama</h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-neutral-500 line-through">Toplam Fiyat</div>
                <div className="text-xl font-black text-rose-400">
                  {formatTL(individualSum)}
                </div>
              </div>
            </div>

            {/* Parça Dağılımı Listesi */}
            <div className="space-y-2 text-xs">
              {currentSystem.partsBreakdown.map((part, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800/80 flex items-center justify-between gap-2"
                >
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                      {part.category}
                    </span>
                    <span className="font-semibold text-neutral-200 truncate block">
                      {part.name}
                    </span>
                  </div>
                  <span className="font-bold text-neutral-300 shrink-0">
                    {formatTL(part.individualNewPrice)}
                  </span>
                </div>
              ))}
            </div>

            {/* Dezavantajlar */}
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Tek Tek Toplamanın Zorlukları:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-neutral-300">
                <li>En az 4-6 farklı kargo ve kargo gecikmesi riski</li>
                <li>Montaj, kablolama ve termal macun uygulaması zahmeti</li>
                <li>Bileşen arızasında 6 farklı servisle uğraşma</li>
              </ul>
            </div>
          </div>

          {/* Sağ: KasaRadar Hazır Kasa Paketi */}
          <div className="p-5 rounded-2xl bg-neutral-950 border-2 border-emerald-500/40 space-y-4 relative shadow-xl shadow-emerald-500/5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Önerilen Akıllı Tercih
                </span>
                <h3 className="text-base font-black text-white flex items-center gap-1.5">
                  <span>{currentSystem.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    Hazır Kasa
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-neutral-400">Satış Fiyatı</div>
                <div className="text-2xl font-black text-emerald-400">
                  {formatTL(prebuiltPrice)}
                </div>
              </div>
            </div>

            {/* Avantajlar */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
                <PackageCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Hazır Montaj &amp; Kablolama</div>
                  <div className="text-neutral-400 text-[11px]">
                    Kasa uzman teknisyenler tarafından toplanır, BIOS son sürüme güncellenir ve Windows kurulumuna hazır gönderilir.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">2 Yıl Bütünleşik Sistem Garantisi</div>
                  <div className="text-neutral-400 text-[11px]">
                    {currentSystem.seller} garantisi altında tek noktadan teknik destek ve kapıdan teslimat.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
                <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Toplu OEM İndirimi Avantajı</div>
                  <div className="text-neutral-400 text-[11px]">
                    Distribütörlerden binlerce adet çekildiği için parça başına 800 - 2.500 TL indirim hazır sisteme yansıtılır.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Stres &amp; Kararlılık Testleri</div>
                  <div className="text-neutral-400 text-[11px]">
                    Prime95 ve FurMark ile 2 saat boyunca sıcaklık, fan ve voltaj testinden geçirilir.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action & Sharing Buttons */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyForumBBCode}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="DonanımArşivi, Technopat, DonanımHaber forumları için kopyala"
            >
              {copiedBBCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">BBCode Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Forum Raporu Kopyala (BBCode)</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Link Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Arkadaşınla Paylaş</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[11px] text-neutral-500">
            *Fiyatlar Türkiye&apos;deki yetkili distribütör ve mağazaların güncel satış rakamlarıdır.
          </div>
        </div>

      </div>
    </div>
  );
};
