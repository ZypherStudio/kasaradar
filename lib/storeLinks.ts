export type StoreIdentifier =
  | "akakce"
  | "amazon"
  | "hepsiburada"
  | "itopya"
  | "sahibinden"
  | "trendyol"
  | "vatan"
  | "gaminggen"
  | "gamegaraj"
  | "tebilon"
  | "incehesap"
  | "sinerji"
  | "teknobiyotik";

export function getStoreSearchUrl(productName: string, store: StoreIdentifier | string): string {
  const query = encodeURIComponent(productName.trim());
  const normalizedStore = store.toLowerCase().replace(/[^a-z]/g, "");

  if (normalizedStore.includes("amazon")) {
    return `https://www.amazon.com.tr/s?k=${query}&tag=kasaradar-21`;
  }
  if (normalizedStore.includes("hepsiburada")) {
    return `https://www.hepsiburada.com/ara?q=${query}&utm_source=kasaradar`;
  }
  if (normalizedStore.includes("itopya")) {
    return `https://www.itopya.com/AramaSonuclari/?q=${query}&ref=kasaradar`;
  }
  if (normalizedStore.includes("vatan")) {
    return `https://www.vatanbilgisayar.com/arama/${query}/`;
  }
  if (normalizedStore.includes("gaminggen") || normalizedStore.includes("gaming")) {
    return `https://www.gaming.gen.tr/?s=${query}&ref=kasaradar`;
  }
  if (normalizedStore.includes("gamegaraj")) {
    return `https://www.gamegaraj.com/?s=${query}&ref=kasaradar`;
  }
  if (normalizedStore.includes("tebilon")) {
    return `https://www.tebilon.com/arama?q=${query}`;
  }
  if (normalizedStore.includes("incehesap")) {
    return `https://www.incehesap.com/ara/?q=${query}`;
  }
  if (normalizedStore.includes("sinerji")) {
    return `https://www.sinerji.gen.tr/arama?q=${query}`;
  }
  if (normalizedStore.includes("teknobiyotik")) {
    return `https://www.teknobiyotik.com/arama?q=${query}`;
  }
  if (normalizedStore.includes("trendyol")) {
    return `https://www.trendyol.com/sr?q=${query}&utm_source=kasaradar`;
  }
  if (normalizedStore.includes("sahibinden")) {
    return `https://www.sahibinden.com/kelime-ile-arama?query_text=${query}`;
  }
  if (normalizedStore.includes("akakce")) {
    return `https://www.akakce.com/arama/?q=${query}&utm_source=kasaradar`;
  }

  return `https://www.google.com/search?q=${query}+fiyat`;
}
