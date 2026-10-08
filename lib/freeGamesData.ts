export interface FreeGameDeal {
  id: string;
  title: string;
  platform: "epic" | "steam" | "gog" | "prime";
  platformName: string;
  badge: "ÜCRETSİZ" | "DEV İNDİRİM" | "SINIRLI SÜRE";
  originalPrice: number; // in TL or USD
  currency: "TL" | "USD";
  discountedPrice: number; // 0 for free
  discountPercent: number; // 100 for free
  endsAt: string; // ISO date string or description
  endDateReadable: string;
  imageUrl: string;
  genre: string;
  rating: string;
  storeUrl: string;
  description: string;
  isPermanent: boolean; // if kept forever in library
}

export const FREE_GAMES_DATABASE: FreeGameDeal[] = [
  {
    id: "epic-ghostrunner-2",
    title: "Ghostrunner 2",
    platform: "epic",
    platformName: "Epic Games Store",
    badge: "ÜCRETSİZ",
    originalPrice: 799,
    currency: "TL",
    discountedPrice: 0,
    discountPercent: 100,
    endsAt: "2026-10-15T18:00:00+03:00",
    endDateReadable: "15 Ekim Perşembe 18:00'e kadar",
    imageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2144740/capsule_616x353.jpg",
    genre: "Aksiyon / Cyberpunk / Hızlı Parkur",
    rating: "4.8/5 (Çok Olumlu)",
    storeUrl: "https://store.epicgames.com/tr/free-games",
    description: "Kıyamet sonrası siberpunk dünyada tek vuruşta öldüren kılıç dövüşleri ve nefes kesen birinci şahıs parkur deneyimi. Kütüphanene eklersen sonsuza dek senin!",
    isPermanent: true
  },
  {
    id: "epic-the-outer-worlds",
    title: "The Outer Worlds: Spacer's Choice Edition",
    platform: "epic",
    platformName: "Epic Games Store",
    badge: "ÜCRETSİZ",
    originalPrice: 1250,
    currency: "TL",
    discountedPrice: 0,
    discountPercent: 100,
    endsAt: "2026-10-15T18:00:00+03:00",
    endDateReadable: "15 Ekim Perşembe 18:00'e kadar",
    imageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1920490/capsule_616x353.jpg",
    genre: "Bilim Kurgu / RPG / Açık Dünya",
    rating: "4.7/5 (Ödüllü RPG)",
    storeUrl: "https://store.epicgames.com/tr/free-games",
    description: "Obsidian Entertainment yapımı efsanevi uzay RPG'si. Tüm DLC'ler dahil geliştirilmiş grafiklerle tamamen bedava!",
    isPermanent: true
  },
  {
    id: "steam-witcher-3",
    title: "The Witcher 3: Wild Hunt - Complete Edition",
    platform: "steam",
    platformName: "Steam",
    badge: "DEV İNDİRİM",
    originalPrice: 39.99,
    currency: "USD",
    discountedPrice: 7.99,
    discountPercent: 80,
    endsAt: "2026-10-14T20:00:00+03:00",
    endDateReadable: "Hafta Ortası İndirimi",
    imageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/capsule_616x353.jpg",
    genre: "Aksiyon / RPG / Hikaye Başyapıtı",
    rating: "9.7/10 (Son Derece Olumlu)",
    storeUrl: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
    description: "250'den fazla Yılın Oyunu ödülü. Blood and Wine ve Hearts of Stone DLC'leri dahil yeni nesil güncellenmiş sürüm.",
    isPermanent: true
  },
  {
    id: "steam-titanfall-2",
    title: "Titanfall 2: Ultimate Edition",
    platform: "steam",
    platformName: "Steam",
    badge: "DEV İNDİRİM",
    originalPrice: 29.99,
    currency: "USD",
    discountedPrice: 2.99,
    discountPercent: 90,
    endsAt: "2026-10-16T20:00:00+03:00",
    endDateReadable: "Steam Özel Fırsat",
    imageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1237970/capsule_616x353.jpg",
    genre: "FPS / Dev Robotlar / Kampanya",
    rating: "9.6/10 (Efsanevi Hikaye)",
    storeUrl: "https://store.steampowered.com/app/1237970/Titanfall_2/",
    description: "Tarihin en iyi tek kişilik FPS hikayelerinden biri. Dev mech Titan BT-7274 ile kurulan unutulmaz dostluk.",
    isPermanent: true
  },
  {
    id: "steam-ets2",
    title: "Euro Truck Simulator 2",
    platform: "steam",
    platformName: "Steam",
    badge: "DEV İNDİRİM",
    originalPrice: 10.09,
    currency: "USD",
    discountedPrice: 2.52,
    discountPercent: 75,
    endsAt: "2026-10-18T20:00:00+03:00",
    endDateReadable: "Son Günler",
    imageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/227300/capsule_616x353.jpg",
    genre: "Simülasyon / Açık Dünya / Sürüş",
    rating: "9.8/10 (Kült Başyapıt)",
    storeUrl: "https://store.steampowered.com/app/227300/Euro_Truck_Simulator_2/",
    description: "Avrupa yollarında direksiyon başına geçin. Türkiye topluluğunun en sevdiği chill simülasyon oyunu.",
    isPermanent: true
  },
  {
    id: "steam-metro-exodus",
    title: "Metro Exodus - Enhanced Edition",
    platform: "steam",
    platformName: "Steam",
    badge: "DEV İNDİRİM",
    originalPrice: 29.99,
    currency: "USD",
    discountedPrice: 5.99,
    discountPercent: 80,
    endsAt: "2026-10-15T20:00:00+03:00",
    endDateReadable: "Sınırlı Süre",
    imageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/412020/capsule_616x353.jpg",
    genre: "Post-Apokaliptik / Hayatta Kalma / FPS",
    rating: "9.2/10 (Görsel Şölen)",
    storeUrl: "https://store.steampowered.com/app/412020/Metro_Exodus/",
    description: "Nükleer kıyamet sonrası Rusya tundralarında geçen nefes kesici tren yolculuğu ve Ray Tracing destekli enfes grafikler.",
    isPermanent: true
  },
  {
    id: "gog-fallout-tactics",
    title: "Fallout Tactics: Brotherhood of Steel",
    platform: "gog",
    platformName: "GOG.com",
    badge: "ÜCRETSİZ",
    originalPrice: 249,
    currency: "TL",
    discountedPrice: 0,
    discountPercent: 100,
    endsAt: "2026-10-12T16:00:00+03:00",
    endDateReadable: "Hafta Sonu Özel Hediye",
    imageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/38420/capsule_616x353.jpg",
    genre: "Taktiksel RPG / Kıyamet Sonrası",
    rating: "4.5/5 (DRM'siz Klasik)",
    storeUrl: "https://www.gog.com",
    description: "DRM korumasız, tamamen ücretsiz klasik Fallout taktik strateji oyunu. GOG hesabına anında ekle.",
    isPermanent: true
  }
];
