import { NextRequest, NextResponse } from "next/server";
import { GameRequirement } from "@/lib/types";

function extractField(html: string, fieldNames: string[]): string {
  if (!html) return "";
  for (const name of fieldNames) {
    const regex = new RegExp("<strong>\\s*" + name + "\\s*:?\\s*<\\/strong>\\s*([^<]+)", "i");
    const match = html.match(regex);
    if (match) return match[1].trim();
  }
  return "";
}

function parseRamGb(html: string, fallback = 16): number {
  if (!html) return fallback;
  const raw = extractField(html, ["Bellek", "Memory", "RAM"]);
  const m = (raw || html).match(/(\d+)\s*GB/i);
  return m ? parseInt(m[1], 10) : fallback;
}

function parseStorageGb(html: string, fallback = 70): number {
  if (!html) return fallback;
  const raw = extractField(html, ["Depolama", "Storage", "Hard Drive", "Alan"]);
  const m = (raw || html).match(/(\d+)\s*GB/i);
  return m ? parseInt(m[1], 10) : fallback;
}

function estimateGpuTier(text: string, isRec = false): number {
  const t = (text || "").toLowerCase();
  if (t.includes("4090") || t.includes("7900 xtx") || t.includes("5090")) return 98;
  if (t.includes("4080") || t.includes("7900 xt") || t.includes("5080")) return 94;
  if (t.includes("4070 ti") || t.includes("7900 gre") || t.includes("3090")) return 88;
  if (t.includes("4070") || t.includes("6800 xt") || t.includes("3080") || t.includes("7800 xt")) return 84;
  if (t.includes("4060 ti") || t.includes("3070") || t.includes("6700 xt") || t.includes("6750 xt")) return 78;
  if (t.includes("4060") || t.includes("3060") || t.includes("6600") || t.includes("2070") || t.includes("7600")) return 70;
  if (t.includes("2060") || t.includes("5700") || t.includes("a770") || t.includes("a750") || t.includes("1080")) return 64;
  if (t.includes("1660") || t.includes("1070") || t.includes("5600 xt") || t.includes("vega 56")) return 55;
  if (t.includes("1060") || t.includes("580") || t.includes("570") || t.includes("a380") || t.includes("480")) return 48;
  if (t.includes("1650") || t.includes("1050 ti") || t.includes("550") || t.includes("970")) return 40;
  if (t.includes("1050") || t.includes("960") || t.includes("750 ti") || t.includes("hd 7870")) return 32;
  if (t.includes("intel hd") || t.includes("uhd") || t.includes("iris")) return 20;
  return isRec ? 72 : 45;
}

function estimateCpuTier(text: string, isRec = false): number {
  const t = (text || "").toLowerCase();
  if (t.includes("7800x3d") || t.includes("14900k") || t.includes("13900k") || t.includes("9800x3d") || t.includes("7950x")) return 96;
  if (t.includes("14700") || t.includes("13700") || t.includes("7900x") || t.includes("7700x")) return 90;
  if (t.includes("13600") || t.includes("5800x3d") || t.includes("7600x") || t.includes("12700") || t.includes("5800x")) return 82;
  if (t.includes("12600") || t.includes("12400") || t.includes("5600x") || t.includes("5600") || t.includes("5700x")) return 74;
  if (t.includes("10700") || t.includes("9700") || t.includes("3700x") || t.includes("3600")) return 64;
  if (t.includes("10400") || t.includes("8700") || t.includes("8600") || t.includes("2600") || t.includes("1600")) return 52;
  if (t.includes("7700") || t.includes("6700") || t.includes("4790") || t.includes("3570") || t.includes("fx-8350")) return 42;
  if (t.includes("2500k") || t.includes("core 2 quad") || t.includes("i3")) return 30;
  return isRec ? 75 : 45;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get("appId")?.trim();

    if (!appId || isNaN(Number(appId))) {
      return NextResponse.json(
        { success: false, error: "Geçerli bir Steam App ID belirtmelisiniz." },
        { status: 400 }
      );
    }

    const steamUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=turkish`;
    const res = await fetch(steamUrl, {
      headers: {
        "User-Agent": "KasaRadar-GameHub/1.0",
        Accept: "application/json"
      },
      next: { revalidate: 86400 } // Cache 24 hours
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Steam API detayları alamadı." },
        { status: 502 }
      );
    }

    const rawData = await res.json();
    const appData = rawData[appId];

    if (!appData || !appData.success || !appData.data) {
      return NextResponse.json(
        { success: false, error: "Oyun detayları Steam üzerinde bulunamadı." },
        { status: 404 }
      );
    }

    const data = appData.data;

    const minHtml = data.pc_requirements?.minimum || "";
    const recHtml = data.pc_requirements?.recommended || "";

    const minGpuText = extractField(minHtml, ["Ekran Kartı", "Graphics", "GPU"]);
    const recGpuText = extractField(recHtml, ["Ekran Kartı", "Graphics", "GPU"]);
    const minCpuText = extractField(minHtml, ["İşlemci", "Processor", "CPU"]);
    const recCpuText = extractField(recHtml, ["İşlemci", "Processor", "CPU"]);

    const minGpuTier = estimateGpuTier(minGpuText, false);
    const recGpuTier = Math.max(minGpuTier + 10, estimateGpuTier(recGpuText || minGpuText, true));

    const minCpuTier = estimateCpuTier(minCpuText, false);
    const recCpuTier = Math.max(minCpuTier + 10, estimateCpuTier(recCpuText || minCpuText, true));

    const minRamGb = parseRamGb(minHtml, 8);
    const recRamGb = parseRamGb(recHtml, Math.max(16, minRamGb));
    const storageGb = parseStorageGb(recHtml || minHtml, 70);

    // Extract release year
    let releaseYear = new Date().getFullYear();
    if (data.release_date?.date) {
      const yearMatch = data.release_date.date.match(/\b(20\d\d|19\d\d)\b/);
      if (yearMatch) releaseYear = parseInt(yearMatch[1], 10);
    }

    // Genre
    const genreList: string[] = (data.genres || []).map((g: any) => g.description);
    const genre = genreList.slice(0, 2).join(" / ") || "Aksiyon";

    // FPS weights based on genre and engine
    const isFpsOrShooter = /fps|nişancı|shooter|action/i.test(genre) || /counter|warzone|apex/i.test(data.name);
    const isRpgOrOpenWorld = /rpg|ryo|açık dünya|open world|macera/i.test(genre);
    const isSimOrStrategy = /simülasyon|simulation|strateji|strategy/i.test(genre);

    let cpuWeight = 0.45;
    let gpuWeight = 0.55;
    let baseFps1080pLow = 95;

    if (isFpsOrShooter) {
      cpuWeight = 0.60;
      gpuWeight = 0.40;
      baseFps1080pLow = 200;
    } else if (isSimOrStrategy) {
      cpuWeight = 0.70;
      gpuWeight = 0.30;
      baseFps1080pLow = 110;
    } else if (isRpgOrOpenWorld) {
      cpuWeight = 0.40;
      gpuWeight = 0.60;
      baseFps1080pLow = 85;
    }

    const cleanDesc =
      data.short_description ||
      `${data.name}, Steam'de yayınlanan popüler bir bilgisayar oyunudur. Donanım gereksinimleri Steam resmi mağazasından alınmıştır.`;

    const gameRequirement: GameRequirement = {
      id: `steam-${data.steam_appid}`,
      title: data.name,
      genre,
      coverImage:
        data.header_image ||
        `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${data.steam_appid}/header.jpg`,
      releaseYear,
      description: cleanDesc,
      minCpuTier,
      recCpuTier,
      minGpuTier,
      recGpuTier,
      minRamGb,
      recRamGb,
      storageGb,
      cpuWeight,
      gpuWeight,
      ramWeight: 0.15,
      baseFps1080pLow,
      steamAppId: data.steam_appid,
      platform: "steam",
      isLiveAdded: true,
      officialUrl: `https://store.steampowered.com/app/${data.steam_appid}/`
    };

    return NextResponse.json({
      success: true,
      source: "steam_details",
      game: gameRequirement
    });
  } catch (error: any) {
    console.error("Steam Details Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Bilinmeyen bir hata oluştu" },
      { status: 500 }
    );
  }
}
