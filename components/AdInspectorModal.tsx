"use client";

import React, { useState } from "react";
import { formatTL } from "@/lib/calculator";
import {
  Search,
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Scale,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  FileText
} from "lucide-react";

interface AdInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InspectionResult {
  title: string;
  sellerPrice: number;
  fairMarketValue: number;
  bargainPrice: number;
  verdict: "kelepir" | "makul" | "kazik";
  diffPct: number;
  miningRisk: "Yüksek Risk" | "Orta Risk" | "Düşük Risk";
  miningReason: string;
  testChecklist: { test: string; tool: string; passCriteria: string }[];
  detectedSpecs: { gpu: string; cpu: string; ram: string; psu: string };
}

export const AdInspectorModal: React.FC<AdInspectorModalProps> = ({ isOpen, onClose }) => {
  const [adInput, setAdInput] = useState<string>("");
  const [adPrice, setAdPrice] = useState<number>(18500);
  const [hasBoxInvoice, setHasBoxInvoice] = useState<boolean>(true);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [copiedBargain, setCopiedBargain] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleInspect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsInspecting(true);

    setTimeout(() => {
      setIsInspecting(false);

      const inputLower = (adInput || "RTX 3070 Ryzen 5 5600 Sistem").toLowerCase();

      // Estimate specs from text
      let gpu = "GeForce RTX 3070 8GB";
      let cpu = "AMD Ryzen 5 5600";
      let fairVal = 17500;
      let miningRisk: "Yüksek Risk" | "Orta Risk" | "Düşük Risk" = "Düşük Risk";
      let miningReason = "Bu ekran kartı mining döneminde aşırı kullanılmadı; yıpranma riski düşüktür.";

      if (inputLower.includes("3060")) {
        gpu = "GeForce RTX 3060 12GB";
        fairVal = 14500;
        miningRisk = "Orta Risk";
        miningReason = "LHR kilidi kırılan modellerde mining yapılmış olabilir. VRAM termal pedlerini kontrol edin.";
      } else if (inputLower.includes("3080") || inputLower.includes("3090")) {
        gpu = "GeForce RTX 3080 10GB";
        fairVal = 23000;
        miningRisk = "Yüksek Risk";
        miningReason = "GDDR6X bellekler 100°C+ sıcaklıkta madencilikte uzun süre çalışmış olabilir. FurMark Hotspot testi zorunludur.";
      } else if (inputLower.includes("5700") || inputLower.includes("580") || inputLower.includes("rx 580")) {
        gpu = "Radeon RX 580 / RX 5700 XT";
        fairVal = 10500;
        miningRisk = "Yüksek Risk";
        miningReason = "Ethereum madenciliğinin en çok kullanılan kartıdır. Reballing veya BIOS flash yapılmış olma ihtimali çok yüksektir!";
      } else if (inputLower.includes("4060")) {
        gpu = "GeForce RTX 4060 8GB";
        fairVal = 19000;
        miningRisk = "Düşük Risk";
        miningReason = "Yeni nesil mimari (Ada Lovelace). Madencilik dönemi kapandıktan sonra çıktığı için mining riski %0'dır.";
      } else if (inputLower.includes("3050")) {
        gpu = "GeForce RTX 3050 8GB";
        fairVal = 12500;
        miningRisk = "Düşük Risk";
        miningReason = "Madencilik için yetersiz kaldığından mining riski sıfıra yakındır.";
      }

      if (inputLower.includes("intel") || inputLower.includes("12400") || inputLower.includes("i5")) {
        cpu = "Intel Core i5 12400F";
      } else if (inputLower.includes("7500f") || inputLower.includes("am5")) {
        cpu = "AMD Ryzen 5 7500F (AM5)";
        fairVal += 4000;
      }

      // Add box/invoice premium
      if (hasBoxInvoice) {
        fairVal += 800;
      }

      const diff = adPrice - fairVal;
      const diffPct = Math.round((diff / fairVal) * 100);

      let verdict: "kelepir" | "makul" | "kazik" = "makul";
      if (diffPct <= -8) verdict = "kelepir";
      else if (diffPct >= 10) verdict = "kazik";

      const bargain = Math.round(fairVal * 0.95);

      setResult({
        title: adInput || "Sahibinden 2. El Oyuncu Kasası",
        sellerPrice: adPrice,
        fairMarketValue: fairVal,
        bargainPrice: bargain,
        verdict,
        diffPct,
        miningRisk,
        miningReason,
        detectedSpecs: {
          gpu,
          cpu,
          ram: "16GB DDR4 3200MHz",
          psu: "650W 80+ Güç Kaynağı"
        },
        testChecklist: [
          {
            test: "1. Ekran Kartı FurMark Stres Testi",
            tool: "FurMark v1.38",
            passCriteria: "15 dk testte GPU < 75°C, Hotspot < 88°C olmalı. Ekranda karıncalanma veya siyah ekran olmamalı."
          },
          {
            test: "2. SSD Sağlık ve Yazma Ömrü",
            tool: "CrystalDiskInfo",
            passCriteria: "Sağlık durumu %85 üzeri olmalı. Kötü sektör (Reallocated Sector) sayısı sıfır (0) olmalıdır."
          },
          {
            test: "3. İşlemci Yük ve Isınma Testi",
            tool: "Cinebench R23 / AIDA64",
            passCriteria: "10 dk testte işlemci sıcaklığı 85°C'yi aşmamalı, termal throttling (frekans kısma) yapmamalı."
          },
          {
            test: "4. Güç Kaynağı ve Ani Akım Testi",
            tool: "OCCT Power Supply Test",
            passCriteria: "Kasa yük altındayken kapanmamalı veya cızırtı (coil whine) harici yanık kokusu gelmemelidir."
          }
        ]
      });
    }, 600);
  };

  const handleLoadSample = (sampleText: string, samplePrice: number) => {
    setAdInput(sampleText);
    setAdPrice(samplePrice);
  };

  const handleCopyBargainMessage = () => {
    if (!result) return;
    const msg = `Merhaba, ilanınız için teşekkürler. Sistemin parçalarını güncel 2. el piyasası doğrultusunda inceledim. Tüm testleri (FurMark ve CrystalDiskInfo) elden yapıp kontrol etmek kaydıyla nakit ${formatTL(result.bargainPrice)} teklif ediyorum. Uygunsa bugün gelip alabilirim.`;
    navigator.clipboard.writeText(msg);
    setCopiedBargain(true);
    setTimeout(() => setCopiedBargain(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-amber-500/40 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl space-y-4 sm:space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
            <Scale className="w-3.5 h-3.5" />
            <span>Sarı Site &amp; 2. El Donanım Ekspertizi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            İlan Linki veya Başlığı Yapıştır — Kazıklanma!
          </h3>
          <p className="text-xs text-neutral-400">
            Sahibinden, Letgo veya Dolap&apos;ta gördüğün kasanın linkini veya parça listesini gir. Piyasa değerini, mining riskini ve satıcıya teklif edilecek pazarlık mesajını çıkaralım.
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleInspect} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 block">
              İlan Linki veya Parça Açıklaması:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={adInput}
                onChange={(e) => setAdInput(e.target.value)}
                placeholder="Örn: Sahibinden RTX 3070 Ryzen 5 5600 16GB RAM Kasa veya shbd.io/s/..."
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>

            {/* Fast sample chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-neutral-500 self-center">Hızlı Dene:</span>
              <button
                type="button"
                onClick={() => handleLoadSample("Sahibinden RTX 3070 / Ryzen 5 5600 Temiz Kasa", 17000)}
                className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[10px] text-emerald-400 cursor-pointer"
              >
                🔥 Kelepir RTX 3070 (17.000 TL)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample("Letgo RTX 3080 Rog Strix Kasa Faturalı", 29000)}
                className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[10px] text-rose-400 cursor-pointer"
              >
                ⚠️ Şişirilmiş RTX 3080 (29.000 TL)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample("Sahibinden RX 580 8GB i5 9400F Gaming Kasa", 10000)}
                className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[10px] text-amber-400 cursor-pointer"
              >
                ⛏️ Mining Şüpheli RX 580 (10.000 TL)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                Satıcının İstediği İlan Fiyatı (TL):
              </label>
              <input
                type="number"
                value={adPrice}
                onChange={(e) => setAdPrice(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white font-bold"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasBoxInvoice}
                  onChange={(e) => setHasBoxInvoice(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4"
                />
                <span>Kutu, Fatura ve Garanti Mevcut (+800 TL Değer)</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isInspecting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isInspecting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></span>
                <span>İlan Veritabanı Taranıyor...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>İlanı İncele &amp; Ekspertiz Raporunu Çıkar</span>
              </>
            )}
          </button>
        </form>

        {/* Inspection Result Box */}
        {result && (
          <div className="p-5 rounded-2xl bg-neutral-950 border border-amber-500/40 space-y-5 animate-fade-in text-xs">
            {/* Verdict Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
                  Ekspertiz Kararı
                </span>
                <div className="text-lg font-black flex items-center gap-2">
                  {result.verdict === "kelepir" && (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      🔥 KELEPİR FIRSAT! (Kaçırma)
                    </span>
                  )}
                  {result.verdict === "makul" && (
                    <span className="text-cyan-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-5 h-5 text-cyan-400" />
                      Piyasa Değerinde (Makul Fiyat)
                    </span>
                  )}
                  {result.verdict === "kazik" && (
                    <span className="text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                      ⚠️ ŞİŞİRİLMİŞ FİYAT (Kazık İlan)
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-neutral-500 block">Gerçek Piyasa Ederi:</span>
                <span className="text-base font-black text-white">{formatTL(result.fairMarketValue)}</span>
              </div>
            </div>

            {/* Key Comparison Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">Satıcı İstiyor:</span>
                <span className="font-bold text-white">{formatTL(result.sellerPrice)}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">Makul Eder:</span>
                <span className="font-bold text-emerald-400">{formatTL(result.fairMarketValue)}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">Fiyat Farkı:</span>
                <span className={`font-bold ${result.diffPct > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  %{result.diffPct > 0 ? `+${result.diffPct}` : result.diffPct}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-[10px] text-amber-400 font-bold block">Pazarlık Teklifin:</span>
                <span className="font-black text-amber-300">{formatTL(result.bargainPrice)}</span>
              </div>
            </div>

            {/* Mining Risk Warning */}
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Mining (Kripto Madenciliği) Riski:
                </span>
                <span className={`font-bold text-xs ${
                  result.miningRisk === "Yüksek Risk" ? "text-rose-400" : result.miningRisk === "Orta Risk" ? "text-amber-400" : "text-emerald-400"
                }`}>
                  {result.miningRisk}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {result.miningReason}
              </p>
            </div>

            {/* 4 Step Test Checklist */}
            <div className="space-y-2">
              <span className="font-bold text-white block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Almadan Önce Satıcıdan İstenecek 4 Kritik Test:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.testChecklist.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 space-y-1">
                    <div className="font-bold text-white text-[11px]">{item.test}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">Araç: {item.tool}</div>
                    <div className="text-[10px] text-neutral-400 leading-normal">{item.passCriteria}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy Bargain Text Button */}
            <div className="pt-2 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-neutral-400">
                Satıcıya göndermek için hazır profesyonel pazarlık mesajı:
              </span>
              <button
                type="button"
                onClick={handleCopyBargainMessage}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                {copiedBargain ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBargain ? "Mesaj Kopyalandı!" : "Pazarlık Mesajını Kopyala"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
