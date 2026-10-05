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
  if (normalizedStore.includes("gencer")) {
    return `https://www.gencergaming.com/?s=${query}&ref=kasaradar`;
  }
  if (normalizedStore.includes("pckolik")) {
    return `https://pckolik.com/arama?q=${query}&ref=kasaradar`;
  }
  if (normalizedStore.includes("qp")) {
    return `https://www.qp.com.tr/catalogsearch/result/?q=${query}&ref=kasaradar`;
  }
  if (normalizedStore.includes("inventus")) {
    return `https://inventus.com.tr/mi_products/ProductList.aspx?DT=${query}`;
  }
  if (normalizedStore.includes("n11")) {
    return `https://www.n11.com/arama?q=${query}&utm_source=kasaradar`;
  }
  if (normalizedStore.includes("mediamarkt")) {
    return `https://www.mediamarkt.com.tr/tr/search.html?query=${query}`;
  }
  if (normalizedStore.includes("teknosa")) {
    return `https://www.teknosa.com/arama?s=${query}`;
  }
  if (normalizedStore.includes("molekul") || normalizedStore.includes("molekül")) {
    return `https://molekulpc.com/arama?q=${query}`;
  }
  if (normalizedStore.includes("novabilgisayar") || normalizedStore.includes("nova")) {
    return `https://www.novabilgisayar.com/arama.asp?kelime=${query}`;
  }
  if (normalizedStore.includes("dfs")) {
    return `https://www.dfsbilgisayar.com/arama?q=${query}`;
  }
  if (normalizedStore.includes("webdenal")) {
    return `https://www.webdenal.com/arama?q=${query}`;
  }
  if (normalizedStore.includes("bizdehesapli") || normalizedStore.includes("bizdehesaplı")) {
    return `https://www.bizdehesapli.com/arama?q=${query}`;
  }
  if (normalizedStore.includes("elmacik") || normalizedStore.includes("elmacık")) {
    return `https://www.elmacik.com/arama?q=${query}`;
  }
  if (normalizedStore.includes("adeks")) {
    return `https://www.adeksstore.com/arama?q=${query}`;
  }

  return `https://www.google.com/search?q=${query}+fiyat`;
}
