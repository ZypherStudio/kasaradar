import { NextRequest, NextResponse } from "next/server";

export interface SteamSearchResultItem {
  id: number;
  title: string;
  tinyImage: string;
  headerImage: string;
  price: number | null;
  currency: string;
  platforms?: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const filter = searchParams.get("filter")?.trim() || "";

    // 1. If search query is provided, query Steam Store Search
    if (query) {
      const steamUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(
        query
      )}&l=turkish&cc=tr`;

      const res = await fetch(steamUrl, {
        headers: {
          "User-Agent": "KasaRadar-GameHub/1.0",
          Accept: "application/json"
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      });

      if (!res.ok) {
        return NextResponse.json(
          { success: false, error: "Steam API yanıt vermedi" },
          { status: 502 }
        );
      }

      const data = await res.json();
      const rawItems = data?.items || [];

      const items: SteamSearchResultItem[] = rawItems.map((item: any) => ({
        id: item.id,
        title: item.name,
        tinyImage:
          item.tiny_image ||
          `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${item.id}/capsule_231x87.jpg`,
        headerImage: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${item.id}/header.jpg`,
        price: item.price?.final ? Math.round(item.price.final / 100) : null,
        currency: item.price?.currency || "USD",
        platforms: item.platforms || { windows: true, mac: false, linux: false }
      }));

      return NextResponse.json({
        success: true,
        source: "steam_search",
        query,
        count: items.length,
        items
      });
    }

    // 2. If no query or filter is trending/top_sellers, fetch featured Steam categories
    const featuredUrl = "https://store.steampowered.com/api/featuredcategories/";
    const featuredRes = await fetch(featuredUrl, {
      headers: {
        "User-Agent": "KasaRadar-GameHub/1.0",
        Accept: "application/json"
      },
      next: { revalidate: 1800 } // Cache 30 mins
    });

    if (featuredRes.ok) {
      const catData = await featuredRes.json();
      const topSellers = catData?.top_sellers?.items || [];
      const newReleases = catData?.new_releases?.items || [];

      const combined = [...topSellers, ...newReleases];
      const seen = new Set<number>();
      const items: SteamSearchResultItem[] = [];

      for (const item of combined) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          items.push({
            id: item.id,
            title: item.name,
            tinyImage:
              item.small_capsule_image ||
              `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${item.id}/capsule_231x87.jpg`,
            headerImage:
              item.header_image ||
              `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${item.id}/header.jpg`,
            price: item.final_price ? Math.round(item.final_price / 100) : null,
            currency: item.currency || "USD"
          });
        }
      }

      return NextResponse.json({
        success: true,
        source: "steam_featured",
        count: items.length,
        items
      });
    }

    return NextResponse.json({
      success: true,
      items: []
    });
  } catch (error: any) {
    console.error("Steam Search Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Bilinmeyen bir hata oluştu" },
      { status: 500 }
    );
  }
}
