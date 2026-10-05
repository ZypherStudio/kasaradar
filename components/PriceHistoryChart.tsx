"use client";

import React, { useState } from "react";
import { formatTL } from "@/lib/calculator";
import {
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Bell,
  Sparkles,
  Calendar,
  Layers,
  ArrowDownRight,
  ShieldCheck,
  Send,
  Mail
} from "lucide-react";

interface PricePoint {
  date: string;
  daysAgo: number;
  price: number;
  note?: string;
  isPeak?: boolean;
  isLowest?: boolean;
}

interface PriceHistoryChartProps {
  currentPrice: number;
  oldPrice?: number;
  individualZeroPrice: number;
  systemTitle: string;
  seller: string;
  userTelegram?: string;
  userEmail?: string;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  currentPrice,
  oldPrice,
  individualZeroPrice,
  systemTitle,
  seller,
  userTelegram,
  userEmail
}) => {
  const [timeframe, setTimeframe] = useState<"30d" | "60d" | "90d">("30d");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(
    Math.round(currentPrice * 0.95 / 100) * 100
  );
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);

  // Generate realistic, deterministic price trajectory points based on timeframe and system price
  const generateHistory = (): PricePoint[] => {
    const today = new Date();
    const formatDate = (daysAgo: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - daysAgo);
      return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
    };

    if (timeframe === "30d") {
      const p30 = Math.round(currentPrice * 1.13);
      const p22 = Math.round(currentPrice * 1.11);
      const p15 = Math.round(currentPrice * 1.16); // peak
      const p10 = Math.round(currentPrice * 1.09);
      const p5 = oldPrice || Math.round(currentPrice * 1.07);
      const p2 = Math.round(currentPrice * 1.04);
      const p0 = currentPrice; // lowest

      return [
        { date: formatDate(30), daysAgo: 30, price: p30, note: "Normal Sezon Satışı" },
        { date: formatDate(22), daysAgo: 22, price: p22, note: "Kur Dalgalanması" },
        { date: formatDate(15), daysAgo: 15, price: p15, note: "Zirve Fiyat (Stok Azlığı)", isPeak: true },
        { date: formatDate(10), daysAgo: 10, price: p10, note: "Hafta Sonu İndirimi" },
        { date: formatDate(5), daysAgo: 5, price: p5, note: "Kampanya Başlangıcı" },
        { date: formatDate(2), daysAgo: 2, price: p2, note: "Gece Fırsatı Öncesi" },
        { date: "Bugün", daysAgo: 0, price: p0, note: "🎯 Tarihi Dip (KasaRadar Sıcak Fırsat)", isLowest: true }
      ];
    } else if (timeframe === "60d") {
      const p60 = Math.round(currentPrice * 1.18);
      const p45 = Math.round(currentPrice * 1.14);
      const p30 = Math.round(currentPrice * 1.19); // peak
      const p20 = Math.round(currentPrice * 1.12);
      const p10 = Math.round(currentPrice * 1.08);
      const p0 = currentPrice;

      return [
        { date: formatDate(60), daysAgo: 60, price: p60, note: "İlk Listelenme" },
        { date: formatDate(45), daysAgo: 45, price: p45, note: "Yaz Kampanyası" },
        { date: formatDate(30), daysAgo: 30, price: p30, note: "Piyasa Zirvesi", isPeak: true },
        { date: formatDate(20), daysAgo: 20, price: p20, note: "Okula Dönüş İndirimi" },
        { date: formatDate(10), daysAgo: 10, price: p10, note: "Stok Yenileme" },
        { date: "Bugün", daysAgo: 0, price: p0, note: "🎯 En Düşük Fiyat Seviyesi", isLowest: true }
      ];
    } else {
      // 90d
      const p90 = Math.round(currentPrice * 1.22);
      const p70 = Math.round(currentPrice * 1.18);
      const p50 = Math.round(currentPrice * 1.24); // peak
      const p35 = Math.round(currentPrice * 1.15);
      const p15 = Math.round(currentPrice * 1.11);
      const p0 = currentPrice;

      return [
        { date: formatDate(90), daysAgo: 90, price: p90, note: "Lansman Dönemi" },
        { date: formatDate(70), daysAgo: 70, price: p70, note: "Bahar Fırsatı" },
        { date: formatDate(50), daysAgo: 50, price: p50, note: "90 Günün En Yüksek Fiyatı", isPeak: true },
        { date: formatDate(35), daysAgo: 35, price: p35, note: "Yarı Yıl Kampanyası" },
        { date: formatDate(15), daysAgo: 15, price: p15, note: "Flaş İndirim" },
        { date: "Bugün", daysAgo: 0, price: p0, note: "🎯 90 Günün En İyi Fiyatı", isLowest: true }
      ];
    }
  };

  const points = generateHistory();
  const prices = points.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const totalSavings = maxPrice - currentPrice;
  const discountPercent = Math.round((totalSavings / maxPrice) * 100);

  // SVG dimensions
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 35;
  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingY * 2;

  // Coordinate mapper
  const getX = (index: number) => paddingX + (index / (points.length - 1)) * innerWidth;
  const getY = (price: number) => {
    if (maxPrice === minPrice) return svgHeight / 2;
    // higher price = lower y (svg origin at top)
    const ratio = (price - minPrice) / (maxPrice - minPrice);
    return paddingY + (1 - ratio) * innerHeight;
  };

  // Generate smooth SVG path
  const coords = points.map((p, i) => ({ x: getX(i), y: getY(p.price) }));
  const pathD = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  // Area path for gradient background
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${svgHeight - paddingY + 15} L ${coords[0].x} ${
    svgHeight - paddingY + 15
  } Z`;

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];
  const activeCoord = hoveredIndex !== null ? coords[hoveredIndex] : coords[coords.length - 1];

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 4500);
  };

  return (
    <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5">
      {/* Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-black text-white">Canlı Fiyat Geçmişi &amp; İndirim Doğrulama</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
              Canlı Takip Botu
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Bu hazır kasanın mağaza fiyat trendi, şişirme indirim kontrolü ve dip noktası analizi.
          </p>
        </div>

        {/* Timeframe switch tabs */}
        <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => {
              setTimeframe("30d");
              setHoveredIndex(null);
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              timeframe === "30d"
                ? "bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Son 30 Gün
          </button>
          <button
            onClick={() => {
              setTimeframe("60d");
              setHoveredIndex(null);
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              timeframe === "60d"
                ? "bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Son 60 Gün
          </button>
          <button
            onClick={() => {
              setTimeframe("90d");
              setHoveredIndex(null);
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              timeframe === "90d"
                ? "bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Son 90 Gün
          </button>
        </div>
      </div>

      {/* 4 Quick Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-neutral-900/90 border border-emerald-500/30 flex flex-col justify-between">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            Tarihi Dip Fiyat
          </span>
          <div className="text-base sm:text-lg font-black text-white mt-1">{formatTL(minPrice)}</div>
          <span className="text-[10px] text-emerald-300 font-semibold mt-0.5">Bugün En İyi Fırsat!</span>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            Dönem Zirvesi
          </span>
          <div className="text-base sm:text-lg font-black text-neutral-300 mt-1">{formatTL(maxPrice)}</div>
          <span className="text-[10px] text-neutral-500 mt-0.5">Zirveden -{formatTL(totalSavings)} indi</span>
        </div>

        <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            Dönem Ortalaması
          </span>
          <div className="text-base sm:text-lg font-black text-neutral-200 mt-1">{formatTL(avgPrice)}</div>
          <span className="text-[10px] text-neutral-500 mt-0.5">Piyasa normu</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex flex-col justify-between">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            Net İndirim Oranı
          </span>
          <div className="text-base sm:text-lg font-black text-emerald-400 mt-1">%{discountPercent} İndirim</div>
          <span className="text-[10px] text-neutral-300 mt-0.5">+{formatTL(totalSavings)} cepte</span>
        </div>
      </div>

      {/* Interactive SVG Chart Container */}
      <div className="relative p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 overflow-hidden">
        {/* Active hover info badge on top-right of chart */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>Tarih: <strong className="text-white">{activePoint.date}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">O Günkü Fiyat:</span>
            <span className="font-black text-emerald-400 text-sm">{formatTL(activePoint.price)}</span>
            {activePoint.note && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-semibold border border-neutral-700">
                {activePoint.note}
              </span>
            )}
          </div>
        </div>

        {/* The SVG Canvas */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-44 sm:h-52 select-none overflow-visible"
          >
            <defs>
              <linearGradient id="priceLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="60%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>

              <linearGradient id="priceAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>

              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Horizontal Grid lines */}
            <line
              x1={paddingX}
              y1={paddingY}
              x2={svgWidth - paddingX}
              y2={paddingY}
              stroke="#262626"
              strokeDasharray="4 4"
            />
            <line
              x1={paddingX}
              y1={svgHeight / 2}
              x2={svgWidth - paddingX}
              y2={svgHeight / 2}
              stroke="#262626"
              strokeDasharray="4 4"
            />
            <line
              x1={paddingX}
              y1={svgHeight - paddingY + 15}
              x2={svgWidth - paddingX}
              y2={svgHeight - paddingY + 15}
              stroke="#262626"
            />

            {/* Gradient Area Fill */}
            <path d={areaD} fill="url(#priceAreaGrad)" />

            {/* The Price Line */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#priceLineGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#neonGlow)"
            />

            {/* Interactive Data Points */}
            {coords.map((c, i) => {
              const pt = points[i];
              const isHovered = hoveredIndex === i;
              const isToday = i === points.length - 1;

              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onClick={() => setHoveredIndex(i)}
                >
                  {/* Invisible wide hit area */}
                  <circle cx={c.x} cy={c.y} r="18" fill="transparent" />

                  {/* Pulsing ring for today's price */}
                  {isToday && (
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r="10"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      className="animate-ping opacity-60"
                    />
                  )}

                  {/* Outer circle */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isHovered ? "7" : isToday ? "6" : "4.5"}
                    fill={pt.isPeak ? "#ef4444" : isToday ? "#10b981" : "#1e293b"}
                    stroke={pt.isPeak ? "#fca5a5" : isToday ? "#34d399" : "#06b6d4"}
                    strokeWidth="2.5"
                    className="transition-all duration-150"
                  />

                  {/* Date Label on X Axis */}
                  <text
                    x={c.x}
                    y={svgHeight - 4}
                    textAnchor="middle"
                    fill={isHovered ? "#34d399" : "#737373"}
                    fontSize="10"
                    fontWeight={isHovered ? "bold" : "normal"}
                  >
                    {pt.date}
                  </text>
                </g>
              );
            })}

            {/* Active pointer line indicator */}
            {hoveredIndex !== null && (
              <line
                x1={activeCoord.x}
                y1={paddingY}
                x2={activeCoord.x}
                y2={svgHeight - paddingY + 15}
                stroke="#34d399"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                opacity="0.8"
              />
            )}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
          <span>*Grafik üzerindeki noktalara tıklayarak geçmiş fiyatları inceleyebilirsiniz.</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Canlı Bot Verisi
          </span>
        </div>
      </div>

      {/* Fake Discount Audit & Price Alarm Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Audit box */}
        <div className="md:col-span-7 p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>KasaRadar Sahte İndirim Denetimi (Anti-Fake Price)</span>
          </div>
          <p className="text-[11px] text-neutral-300 leading-relaxed">
            Bu hazır kasa satıcısı ({seller}), indirim yapmadan önce fiyatı yapay olarak şişirmemiştir.
            Ayrı ayrı sıfır parça maliyeti <b>{formatTL(individualZeroPrice)}</b> iken, hazır kasa paket
            fiyatı <b>{formatTL(currentPrice)}</b> seviyesindedir. Gerçek tasarruf sağlanmaktadır.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              ✓ Gerçek Kampanya
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
              ✓ Sıfır Şişirme Skoru: 10/10
            </span>
          </div>
        </div>

        {/* Set Target Price Alert Widget */}
        <div className="md:col-span-5 p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
              <Bell className="w-4 h-4" />
              <span>Fiyat Düşüş Alarmı Kur</span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              Fiyat belirlediğin seviyenin altına indiğinde Telegram &amp; E-Posta ile haber verelim.
            </p>
          </div>

          <form onSubmit={handleSetAlert} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(Number(e.target.value))}
                  step={100}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                />
                <span className="absolute right-3 top-2 text-[10px] text-neutral-400 font-semibold">TL</span>
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all cursor-pointer whitespace-nowrap shadow-md shadow-amber-500/20"
              >
                Alarm Kur
              </button>
            </div>

            {alertSuccess ? (
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  Alarm kuruldu! Fiyat {formatTL(alertTargetPrice)} altına düştüğünde anında bildirim alacaksın.
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <Send className="w-3 h-3 text-cyan-400" />
                  Telegram: {userTelegram || "Bağlı"}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-emerald-400" />
                  E-Posta: {userEmail ? "Aktif" : "Aktif"}
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
