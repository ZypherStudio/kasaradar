"use client";

import React, { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Leaderboard 728x90 Adsterra Code (User Key: 506395e460fcb46e874e350d092b860f)
  if (format === "leaderboard") {
    const width = isMobile ? 320 : 728;
    const height = isMobile ? 50 : 90;

    const leaderboardHtml = `
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
            }
          </style>
        </head>
        <body>
          <script>
            atOptions = {
              'key' : '506395e460fcb46e874e350d092b860f',
              'format' : 'iframe',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          </script>
          <script src="https://bicea.org/22/506395e460fcb46e874e350d092b860f"></script>
        </body>
      </html>
    `;

    return (
      <div className={`w-full flex flex-col items-center justify-center my-3 ${customClass}`}>
        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
          <Megaphone className="w-3 h-3 text-emerald-400" />
          <span>Sponsorlu Reklam</span>
        </div>

        <div
          className="relative rounded-2xl bg-neutral-950/80 border border-neutral-800/80 p-1 flex items-center justify-center overflow-hidden shadow-lg"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <iframe
            srcDoc={leaderboardHtml}
            width={width}
            height={height}
            scrolling="no"
            frameBorder="0"
            className="border-0 overflow-hidden"
            title="KasaRadar Leaderboard Banner"
          />
        </div>
      </div>
    );
  }

  // Native Banner Adsterra Code (Container ID: container-8335dda75d0764b291243ec4d7c886c5)
  if (format === "native") {
    const nativeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              background: transparent; 
              font-family: system-ui, -apple-system, sans-serif; 
              overflow: hidden; 
              display: flex;
              justify-content: center;
              align-items: center;
            }
          </style>
        </head>
        <body>
          <script async="async" data-cfasync="false" src="https://bicea.org/21/8335dda75d0764b291243ec4d7c886c5"></script>
          <div id="container-8335dda75d0764b291243ec4d7c886c5"></div>
        </body>
      </html>
    `;

    return (
      <div className={`w-full flex flex-col items-center justify-center my-4 ${customClass}`}>
        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
          <Megaphone className="w-3 h-3 text-cyan-400" />
          <span>Öne Çıkan Fırsatlar</span>
        </div>

        <div className="w-full max-w-4xl rounded-2xl bg-neutral-950/80 border border-neutral-800/80 p-2 flex items-center justify-center overflow-hidden shadow-lg min-h-[160px]">
          <iframe
            srcDoc={nativeHtml}
            width="100%"
            height="180"
            scrolling="no"
            frameBorder="0"
            className="border-0 w-full overflow-hidden"
            title="KasaRadar Native Banner"
          />
        </div>
      </div>
    );
  }

  return null;
};
