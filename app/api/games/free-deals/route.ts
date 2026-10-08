import { NextResponse } from "next/server";
import { FreeGameDeal, FREE_GAMES_DATABASE } from "@/lib/freeGamesData";

export async function GET() {
  try {
    const deals: FreeGameDeal[] = [];

    // 1. Fetch Live Epic Games Free Games
    try {
      const epicRes = await fetch(
        "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=tr&country=TR&allowCountries=TR",
        {
          headers: { "User-Agent": "KasaRadar-DealRadar/1.0" },
          next: { revalidate: 3600 } // Cache 1 hour
        }
      );

      if (epicRes.ok) {
        const epicJson = await epicRes.json();
        const elements = epicJson.data?.Catalog?.searchStore?.elements || [];

        for (const el of elements) {
          const activePromo = el.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0];
          const upcomingPromo = el.promotions?.upcomingPromotionalOffers?.[0]?.promotionalOffers?.[0];

          // Currently Free
          if (activePromo && activePromo.discountSetting?.discountPercentage === 0) {
            const wideImg =
              el.keyImages?.find((k: any) => k.type === "OfferImageWide")?.url ||
              el.keyImages?.find((k: any) => k.type === "Thumbnail")?.url ||
              el.keyImages?.[0]?.url;

            const originalPrice = el.price?.totalPrice?.originalPrice
              ? Math.round(el.price.totalPrice.originalPrice / 100)
              : 500;

            const endDate = new Date(activePromo.endDate);
            const endDateFormatted = endDate.toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit"
            });

            deals.push({
              id: `epic-live-${el.id}`,
              title: el.title,
              platform: "epic",
              platformName: "Epic Games Store",
              badge: "ÜCRETSİZ",
              originalPrice: originalPrice > 0 ? originalPrice : 450,
              currency: "TL",
              discountedPrice: 0,
              discountPercent: 100,
              endsAt: activePromo.endDate,
              endDateReadable: `${endDateFormatted}'ye kadar bedava`,
              imageUrl: wideImg || "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2144740/capsule_616x353.jpg",
              genre: el.categories?.[0]?.path || "Aksiyon & Macera",
              rating: "4.7/5 (Epic Öne Çıkan)",
              storeUrl: el.productSlug
                ? `https://store.epicgames.com/tr/p/${el.productSlug}`
                : "https://store.epicgames.com/tr/free-games",
              description:
                el.description ||
                "Epic Games Store tarafından bu hafta tamamen ücretsiz dağıtılan fırsat oyunu. Kütüphanene eklersen ömür boyu senin!",
              isPermanent: true
            });
          }

          // Upcoming Free (Haftaya Bedava)
          if (upcomingPromo && upcomingPromo.discountSetting?.discountPercentage === 0 && deals.length < 5) {
            const wideImg =
              el.keyImages?.find((k: any) => k.type === "OfferImageWide")?.url ||
              el.keyImages?.find((k: any) => k.type === "Thumbnail")?.url ||
              el.keyImages?.[0]?.url;

            const startDate = new Date(upcomingPromo.startDate);
            const startDateFormatted = startDate.toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long"
            });

            deals.push({
              id: `epic-upcoming-${el.id}`,
              title: el.title,
              platform: "epic",
              platformName: "Epic Games Store",
              badge: "SINIRLI SÜRE",
              originalPrice: 400,
              currency: "TL",
              discountedPrice: 0,
              discountPercent: 100,
              endsAt: upcomingPromo.startDate,
              endDateReadable: `Gelecek Hafta: ${startDateFormatted}`,
              imageUrl: wideImg || "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2144740/capsule_616x353.jpg",
              genre: "Yakında Ücretsiz",
              rating: "Yaklaşan Fırsat",
              storeUrl: "https://store.epicgames.com/tr/free-games",
              description: `Epic Games'te ${startDateFormatted} tarihinde ücretsiz olacak! KasaRadar'ı takipte kal.`,
              isPermanent: true
            });
          }
        }
      }
    } catch (e) {
      console.warn("Epic Live API error, skipping:", e);
    }

    // 2. Fetch Live Steam Specials (Specials Category)
    try {
      const steamRes = await fetch(
        "https://store.steampowered.com/api/featuredcategories/?l=turkish&cc=tr",
        {
          headers: { "User-Agent": "KasaRadar-DealRadar/1.0" },
          next: { revalidate: 1800 } // Cache 30 mins
        }
      );

      if (steamRes.ok) {
        const steamJson = await steamRes.json();
        const specials = steamJson.specials?.items || [];

        for (const item of specials.slice(0, 8)) {
          deals.push({
            id: `steam-live-${item.id}`,
            title: item.name,
            platform: "steam",
            platformName: "Steam",
            badge: "DEV İNDİRİM",
            originalPrice: item.original_price ? item.original_price / 100 : 29.99,
            currency: "USD",
            discountedPrice: item.final_price ? item.final_price / 100 : 9.99,
            discountPercent: item.discount_percent || 50,
            endsAt: item.discount_expiration
              ? new Date(item.discount_expiration * 1000).toISOString()
              : "",
            endDateReadable: "Steam Canlı İndirim",
            imageUrl:
              item.large_capsule_image ||
              `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${item.id}/capsule_616x353.jpg`,
            genre: "Steam Özel Fırsat",
            rating: "Çok Olumlu",
            storeUrl: `https://store.steampowered.com/app/${item.id}/`,
            description: `Steam mağazasında %${item.discount_percent} indirimle sunulan öne çıkan fırsat oyunu.`,
            isPermanent: true
          });
        }
      }
    } catch (e) {
      console.warn("Steam Live API error, skipping:", e);
    }

    // 3. Fallback / Complement with curated evergreen classics if fewer items
    if (deals.length === 0) {
      return NextResponse.json({
        success: true,
        source: "curated_fallback",
        count: FREE_GAMES_DATABASE.length,
        games: FREE_GAMES_DATABASE
      });
    }

    // Merge with our curated classics avoiding duplicates
    const existingTitles = new Set(deals.map((d) => d.title.toLowerCase()));
    for (const curated of FREE_GAMES_DATABASE) {
      if (!existingTitles.has(curated.title.toLowerCase())) {
        deals.push(curated);
      }
    }

    return NextResponse.json({
      success: true,
      source: "live_apis",
      count: deals.length,
      games: deals
    });
  } catch (err: any) {
    console.error("Free deals API failed:", err);
    return NextResponse.json({
      success: true,
      source: "error_fallback",
      count: FREE_GAMES_DATABASE.length,
      games: FREE_GAMES_DATABASE
    });
  }
}
