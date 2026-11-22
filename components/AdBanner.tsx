"use client";

import React, { useState, useEffect, useRef } from "react";
import { Megaphone, AlertCircle, X, ExternalLink, ShieldCheck, Sparkles, Tag } from "lucide-react";

export type AdFormat = "leaderboard" | "native" | "curated";

interface AdBannerProps {
  format?: AdFormat;
  customClass?: string;
  enableAdsterraScript?: boolean;
}

// Clean & Trusted Gaming & Hardware Deals (Replaces spammy casino/adult ads)
const VERIFIED_HARDWARE_DEALS = [
  {
    id: "deal-1",
    title: "RTX 4070 Super 12GB Hazır Oyuncu Kasası",
    store: "GamingGen.TR",
    category: "Hazır Sistem",
    tag: "F/P Şampiyonu",
    discount: "%18 İndirim",
    link: "https://www.gaming.gen.tr",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "deal-2",
    title: "Kingston Renegade 1TB 7300MB/s Gen4 NVMe SSD",
    store: "İtopya",
    category: "Bileşen",
    tag: "Yüksek Hız",
    discount: "Kelepir Fiyat",
    link: "https://www.itopya.com",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "deal-3",
    title: "AOC 24G2SPU 165Hz 1ms IPS Espor Monitörü",
    store: "Tebilon",
    category: "Monitör",
    tag: "Günün Fırsatı",
    discount: "%22 İndirim",
    link: "https://www.tebilon.com",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "deal-4",
    title: "Razer DeathAdder V3 Pro Kablosuz Mouse",
    store: "GameGaraj",
    category: "Ekipman",
    tag: "Espor Seçimi",
    discount: "Özel Fırsat",
    link: "https://www.gamegaraj.com",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80"
  }
];

export const AdBanner: React.FC<AdBannerProps> = ({
  format = "curated",
  customClass = "",
  enableAdsterraScript = false
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [adBlocked, setAdBlocked] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Only inject external Adsterra network scripts if explicitly enabled and not in clean curated mode
  useEffect(() => {
    if (!enableAdsterraScript || format === "curated") return;

    const container = adContainerRef.current;
    if (!container) return;

    container.innerHTML = "";

    try {
      if (format === "leaderboard") {
        const width = isMobile ? 320 : 728;
        const height = isMobile ? 50 : 90;

        const adWrapper = document.createElement("div");
        adWrapper.id = "adsterra-leaderboard-wrapper";
        adWrapper.style.width = `${width}px`;
        adWrapper.style.height = `${height}px`;
        adWrapper.style.overflow = "hidden";
        adWrapper.style.display = "flex";
        adWrapper.style.alignItems = "center";
        adWrapper.style.justifyContent = "center";

        (window as any).atOptions = {
          key: "506395e460fcb46e874e350d092b860f",
          format: "iframe",
          height: height,
          width: width,
          params: {}
        };

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://bicea.org/22/506395e460fcb46e874e350d092b860f";
        script.async = true;

        script.onerror = () => {
          setAdBlocked(true);
        };

        adWrapper.appendChild(script);
        container.appendChild(adWrapper);
      }
    } catch (err) {
      console.warn("Ad load error:", err);
      setAdBlocked(true);
    }
  }, [format, isMobile, enableAdsterraScript]);

  if (isDismissed) return null;

  // 1. CLEAN CURATED / NATIVE GAMING HARDWARE DEALS (Safe, 100% relevant, 0 spam)
  if (format === "native" || format === "curated" || !enableAdsterraScript) {
    return (
      <div className={`w-full my-6 ${customClass}`}>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Megaphone className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-neutral-300">
              Günün Sponsorlu Donanım &amp; Oyun Fırsatları
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Doğrulanmış Mağazalar
            </span>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-neutral-500 hover:text-neutral-300 p-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer text-[11px] flex items-center gap-1"
            title="Bu alanı kapat"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kapat</span>
          </button>
        </div>

        {/* 4 Cards Grid - Modern, High Quality Hardware Ads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {VERIFIED_HARDWARE_DEALS.map((deal) => (
            <a
              key={deal.id}
              href={deal.link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group relative rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800 hover:border-emerald-500/50 p-3 transition-all duration-200 hover:-translate-y-0.5 shadow-lg flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 mb-2.5">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-neutral-950/85 backdrop-blur-md text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                    <Tag className="w-2.5 h-2.5" />
                    <span>{deal.discount}</span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-md text-[9px] font-bold text-neutral-300">
                    {deal.store}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                    {deal.category} • {deal.tag}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-emerald-300 transition-colors">
                    {deal.title}
                  </h4>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-bold text-neutral-400 group-hover:text-emerald-400 transition-colors">
                <span>Fırsatı İncele</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // 2. LEADERBOARD AD (If enabled)
  const widthStyle = isMobile ? "320px" : "728px";
  const heightStyle = isMobile ? "50px" : "90px";

  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 ${customClass}`}>
      <div className="w-full max-w-[728px] flex items-center justify-between mb-1 px-1 text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <Megaphone className="w-3 h-3 text-emerald-400" />
          <span>Sponsorlu Reklam</span>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-neutral-500 hover:text-neutral-300 cursor-pointer p-0.5"
          title="Gizle"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <div
        className="relative rounded-2xl bg-neutral-950/80 border border-neutral-800/80 p-1 flex items-center justify-center overflow-hidden shadow-lg"
        style={{ minWidth: widthStyle, minHeight: heightStyle }}
      >
        <div ref={adContainerRef} className="flex items-center justify-center w-full" />

        {adBlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/90 text-neutral-400 text-xs gap-2 p-3 text-center">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Reklam engelleyici tespit edildi.</span>
          </div>
        )}
      </div>
    </div>
  );
};
