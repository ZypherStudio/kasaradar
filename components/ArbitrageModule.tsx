"use client";

import React, { useState } from "react";
import { HardwareComponent } from "@/lib/types";
import { formatTL } from "@/lib/calculator";
import {
  Scale,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Search,
  Calculator,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from "lucide-react";

interface ArbitrageModuleProps {
  hardwareList: HardwareComponent[];
  onOpenAdInspector?: () => void;
}

export const ArbitrageModule: React.FC<ArbitrageModuleProps> = ({ hardwareList, onOpenAdInspector }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"all" | "gpu" | "cpu">("all");

  // Interactive valuation tool states
  const [calcComponentId, setCalcComponentId] = useState<string>(hardwareList[0].id);
  const [calcAdPrice, setCalcAdPrice] = useState<number>(hardwareList[0].secondHandAvg);

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Sarı Site &amp; Letgo Canlı Donanım Borsası</span>
          </div>

          {onOpenAdInspector && (
            <button
              onClick={onOpenAdInspector}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-500/20 self-start sm:self-auto"
            >
              <span>🔍 İlan Linki Yapıştır &amp; Ekspertiz Al</span>
            </button>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Sıfır vs. 2. El Fiyat Makası &amp; Kazıklanma Rehberi
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400">
          İkinci el alırken kazıklanmamak için parçaların piyasa değerini, kelepir eşik fiyatlarını ve mining/arıza risk analizlerini inceleyin.
        </p>
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedType === "all" ? "bg-amber-500 text-neutral-950 font-bold" : "bg-neutral-900 text-neutral-400"
            }`}
          >
            Tüm Parçalar
          </button>
          <button
            onClick={() => setSelectedType("gpu")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedType === "gpu" ? "bg-amber-500 text-neutral-950 font-bold" : "bg-neutral-900 text-neutral-400"
            }`}
          >
            Ekran Kartları (GPU)
          </button>
          <button
            onClick={() => setSelectedType("cpu")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedType === "cpu" ? "bg-amber-500 text-neutral-950 font-bold" : "bg-neutral-900 text-neutral-400"
            }`}
          >
            İşlemciler (CPU)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Parça ara..."
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
              <th className="py-3 px-4">Sıfır Piyasa Fiyatı</th>
              <th className="py-3 px-4">2. El Ortalama Ederi</th>
              <th className="py-3 px-4 text-emerald-400">Kelepir Eşik Fiyatı</th>
              <th className="py-3 px-4">2. El Risk Durumu</th>
              <th className="py-3 px-4">Uzman Tavsiyesi</th>
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

                  {/* Advice */}
                  <td className="py-3 px-4 text-neutral-400 text-[11px] max-w-xs">
                    {item.riskReason}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
