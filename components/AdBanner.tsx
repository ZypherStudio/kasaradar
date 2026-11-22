"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Megaphone, ExternalLink, ShieldCheck } from "lucide-react";

export type AdFormat = "leaderboard" | "rectangle" | "banner-mobile";

interface AdBannerProps {
  format?: AdFormat;
  adKey?: string; // Adsterra 32-karakter banner anahtarı (atOptions.key)
  customClass?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format = "leaderboard",
  adKey,
  customClass = ""
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Determine width & height based on format and device
  let width = 728;
  let height = 90;

  if (format === "rectangle") {
    width = 300;
    height = 250;
  } else if (format === "banner-mobile" || (format === "leaderboard" && isMobile)) {
    width = 320;
    height = 50;
  }

  // If adKey is provided, render isolated safe iframe
  if (adKey && adKey.trim().length > 0) {
    const iframeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              background: transparent; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              overflow: hidden; 
              font-family: system-ui, sans-serif;
            }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : '${adKey}',
              'format' : 'iframe',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="//www.highperformanceformat.com/${adKey}/invoke.js"></script>
        </body>
      </html>
    `;

    return (
      <div className={`w-full flex flex-col items-center justify-center my-4 ${customClass}`}>
        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
          <Megaphone className="w-3 h-3 text-emerald-400" />
          <span>Sponsorlu Bağlantı</span>
        </div>

        <div
          className="relative rounded-2xl bg-neutral-950/80 border border-neutral-800/80 p-1 flex items-center justify-center overflow-hidden shadow-lg"
          style={{ minWidth: `${width}px`, minHeight: `${height}px` }}
        >
          <iframe
            srcDoc={iframeHtml}
            width={width}
            height={height}
            scrolling="no"
            frameBorder="0"
            className="border-0 overflow-hidden"
            title="Adsterra Sponsor Banner"
          />
        </div>
      </div>
    );
  }

  // High-Tech Cyber Placeholder (Kod henüz girilmediğinde gösterilen estetik sponsorluk alanı)
  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 ${customClass}`}>
      <div className="w-full max-w-4xl p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-neutral-900/90 via-neutral-900/60 to-neutral-900/90 border border-neutral-800 hover:border-emerald-500/40 transition-all shadow-md group">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Megaphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-white font-bold text-xs sm:text-sm">
                  KasaRadar Sponsorluk &amp; Reklam Alanı
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                  {format === "rectangle" ? "300x250" : isMobile ? "320x50" : "728x90"}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Türkiye&apos;nin en aktif donanım ve hazır sistem alıcı kitlesine markanızı ulaştırın.
              </p>
            </div>
          </div>

          <a
            href="mailto:iletisim@kasaradar.com?subject=KasaRadar%20Reklam%20ve%20Sponsorluk%20Talebi"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all shrink-0 cursor-pointer"
          >
            <span>Reklam Verin</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
