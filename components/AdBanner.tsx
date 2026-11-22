"use client";

import React, { useState, useEffect, useRef } from "react";
import { Megaphone, AlertCircle } from "lucide-react";

export type AdFormat = "leaderboard" | "native" | "rectangle";

interface AdBannerProps {
  format?: AdFormat;
  customClass?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format = "leaderboard",
  customClass = ""
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [adBlocked, setAdBlocked] = useState<boolean>(false);
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container) return;

    // Clear previous injections to avoid duplication
    container.innerHTML = "";

    try {
      if (format === "leaderboard") {
        const width = isMobile ? 320 : 728;
        const height = isMobile ? 50 : 90;

        // Container wrapper
        const adWrapper = document.createElement("div");
        adWrapper.id = "adsterra-leaderboard-wrapper";
        adWrapper.style.width = `${width}px`;
        adWrapper.style.height = `${height}px`;
        adWrapper.style.overflow = "hidden";
        adWrapper.style.display = "flex";
        adWrapper.style.alignItems = "center";
        adWrapper.style.justifyContent = "center";

        // Set global options on window directly on host domain
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
      } else if (format === "native") {
        const nativeDiv = document.createElement("div");
        nativeDiv.id = "container-8335dda75d0764b291243ec4d7c886c5";
        nativeDiv.style.width = "100%";
        nativeDiv.style.minHeight = "160px";

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        script.src = "https://bicea.org/21/8335dda75d0764b291243ec4d7c886c5";

        script.onerror = () => {
          setAdBlocked(true);
        };

        container.appendChild(nativeDiv);
        container.appendChild(script);
      }
    } catch (err) {
      console.warn("Adsterra load error:", err);
      setAdBlocked(true);
    }
  }, [format, isMobile]);

  const widthStyle = format === "leaderboard" ? (isMobile ? "320px" : "728px") : "100%";
  const heightStyle = format === "leaderboard" ? (isMobile ? "50px" : "90px") : "160px";

  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 ${customClass}`}>
      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
        <Megaphone className="w-3 h-3 text-emerald-400" />
        <span>Sponsorlu Reklam</span>
      </div>

      <div
        className="relative rounded-2xl bg-neutral-950/80 border border-neutral-800/80 p-1 flex items-center justify-center overflow-hidden shadow-lg"
        style={{ minWidth: widthStyle, minHeight: heightStyle }}
      >
        {/* Real Ad Container */}
        <div ref={adContainerRef} className="flex items-center justify-center w-full" />

        {/* AdBlock Notice Fallback */}
        {adBlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/90 text-neutral-400 text-xs gap-2 p-3 text-center">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Tarayıcınızdaki <strong>AdBlock</strong> veya <strong>Brave Kalkanı</strong> reklamı engelliyor. Reklamları görmek için lütfen kapatın.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
