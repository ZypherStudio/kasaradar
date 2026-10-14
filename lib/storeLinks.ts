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
  const cleanQuery = encodeURIComponent(
    productName
      .replace(/kasa|hazır sistem|sistem|gaming pc|hazir sistem/gi, "")
      .trim() || productName.trim()
  );
  const normalizedStore = store.toLowerCase().replace(/[^a-z]/g, "");

  const isSystemQuery =
    /sistem|kasa|pc|blade|hero|modart|falcon|zenith|vesper|phantom|ghost|ares|titan/i.test(
      productName
    );

  if (normalizedStore.includes("itopya")) {
    if (isSystemQuery) return "https://www.itopya.com/oem-paketler";
    return `https://www.akakce.com/arama/?q=${cleanQuery}`;
  }
  if (normalizedStore.includes("vatan")) {
    if (isSystemQuery) return "https://www.vatanbilgisayar.com/oem-paketler/";
    return `https://www.akakce.com/arama/?q=${cleanQuery}`;
  }
  if (normalizedStore.includes("gaminggen") || normalizedStore.includes("gaming")) {
    if (isSystemQuery) return "https://www.gaming.gen.tr/kategori/hazir-sistemler/";
    return `https://www.gaming.gen.tr/?s=${query}&ref=kasaradar`;
  }
  if (normalizedStore.includes("gamegaraj")) {
    return "https://www.gamegaraj.com/kategori/oem-paketler/";
  }
  if (normalizedStore.includes("tebilon")) {
    return "https://www.tebilon.com/hazir-sistemler/";
  }
  if (normalizedStore.includes("incehesap")) {
    if (isSystemQuery) return "https://www.incehesap.com/hazir-sistemler-fiyatlari/";
    return `https://www.incehesap.com/ara/?q=${cleanQuery}`;
  }
  if (normalizedStore.includes("sinerji")) {
    if (isSystemQuery) return "https://www.sinerji.gen.tr/hazir-sistemler-c-2037";
    return `https://www.sinerji.gen.tr/arama?q=${cleanQuery}`;
  }
  if (normalizedStore.includes("teknobiyotik")) {
    return "https://www.teknobiyotik.com/kampanyali-oyuncu-bilgisayarlari.html";
  }
  if (normalizedStore.includes("akakce")) {
    return `https://www.akakce.com/arama/?q=${cleanQuery}`;
  }
  if (normalizedStore.includes("amazon")) {
    return `https://www.amazon.com.tr/s?k=${cleanQuery}&tag=kasaradar-21`;
  }
  if (normalizedStore.includes("hepsiburada")) {
    return `https://www.hepsiburada.com/ara?q=${cleanQuery}&utm_source=kasaradar`;
  }
  if (normalizedStore.includes("trendyol")) {
    return `https://www.trendyol.com/sr?q=${cleanQuery}&utm_source=kasaradar`;
  }
  if (normalizedStore.includes("sahibinden")) {
    return `https://www.sahibinden.com/kelime-ile-arama?query_text=${cleanQuery}`;
  }
  if (normalizedStore.includes("gencer")) {
    return "https://www.gencergaming.com/hazir-sistemler";
  }
  if (normalizedStore.includes("pckolik")) {
    return "https://pckolik.com/kategori/hazir-sistemler";
  }
  if (normalizedStore.includes("qp")) {
    return "https://www.qp.com.tr/hazir-sistemler";
  }
  if (normalizedStore.includes("inventus")) {
    return "https://inventus.com.tr/dedicated/hazirsistem/";
  }
  if (normalizedStore.includes("n11")) {
    return `https://www.n11.com/arama?q=${cleanQuery}&utm_source=kasaradar`;
  }
  if (normalizedStore.includes("mediamarkt")) {
    return `https://www.mediamarkt.com.tr/tr/search.html?query=${cleanQuery}`;
  }
  if (normalizedStore.includes("teknosa")) {
    return `https://www.teknosa.com/arama?s=${cleanQuery}`;
  }
  if (normalizedStore.includes("molekul") || normalizedStore.includes("molekül")) {
    return "https://molekulpc.com/kategori/hazir-sistemler";
  }
  if (normalizedStore.includes("novabilgisayar") || normalizedStore.includes("nova")) {
    return "https://www.novabilgisayar.com/bilgisayar_kategori.asp?kategori=24";
  }
  if (normalizedStore.includes("dfs")) {
    return "https://www.dfsbilgisayar.com/hazir-sistemler";
  }
  if (normalizedStore.includes("adeks")) {
    return "https://www.adeksstore.com/kategori/hazir-oyun-bilgisayarlari";
  }

  return `https://www.akakce.com/arama/?q=${cleanQuery}`;
}
