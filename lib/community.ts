import { PrebuiltSystem } from "./types";
import { formatTL } from "./calculator";

export const TELEGRAM_CHANNEL_URL = "https://t.me/+Voua-sJ4TVJiZjc8";
// Kullanıcı Facebook Grup linkini paylaştığında buraya eklenir; boşsa Facebook Paylaşım penceresi kullanılır.
export const FACEBOOK_GROUP_URL = process.env.NEXT_PUBLIC_FACEBOOK_GROUP_URL || "";
export const SITE_URL = "https://kasaradar.com";

export function buildWhatsAppShareUrl(text: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function buildTelegramShareUrl(url: string, text: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

export function buildFacebookShareUrl(url: string, quote?: string): string {
  const base = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  return quote ? `${base}&quote=${encodeURIComponent(quote)}` : base;
}

export function generateComparisonForumText(systems: PrebuiltSystem[]): string {
  if (systems.length === 0) return "";

  const best = [...systems].sort((a, b) => b.fpScore - a.fpScore)[0];
  const lines: string[] = [
    `[B][SIZE=4]🔥 Sizce Hangisi Alınır? (${systems.map((s) => s.seller).join(" vs ")})[/SIZE][/B]`,
    `KasaRadar.com üzerinden parça kârı ve F/P analizi yaptım, fikirlerinizi bekliyorum 👇`,
    ""
  ];

  systems.forEach((s, idx) => {
    const savings = Math.max(0, s.individualZeroPrice - s.price);
    const cs2 = Math.round(s.gpuTier * 2.8 + s.cpuTier * 1.5);
    lines.push(
      `[B]${idx + 1}. ${s.title} (${s.seller})[/B]`,
      `• Fiyat: [B]${formatTL(s.price)}[/B] (Tek tek toplasan ${formatTL(s.individualZeroPrice)} → [COLOR=green]+${formatTL(savings)} Kâr[/COLOR])`,
      `• GPU / CPU: ${s.gpu} | ${s.cpu.split("(")[0].trim()}`,
      `• RAM / SSD: ${s.ram} (${s.ramType}) | ${s.ssd}`,
      `• KasaRadar F/P Skoru: [B]${s.fpScore}/10[/B] • Tahmini CS2: ~${cs2} FPS`,
      `• Mağaza Linki: ${s.directUrl}`,
      ""
    );
  });

  if (best && systems.length >= 2) {
    lines.push(`🏆 [I]Algoritma Önerisi:[/I] [B]${best.title}[/B] (${best.fpScore}/10 F/P)`);
  }
  lines.push(`📊 Canlı F/P Kıyaslama & Parça Hesabı: ${SITE_URL}`);

  return lines.join("\n");
}

export function generateComparisonChatText(systems: PrebuiltSystem[]): string {
  if (systems.length === 0) return "";
  const best = [...systems].sort((a, b) => b.fpScore - a.fpScore)[0];
  const rows = systems.map((s, idx) => {
    const savings = Math.max(0, s.individualZeroPrice - s.price);
    return `${idx + 1}️⃣ *${s.title}* (${s.seller})\n   💰 ${formatTL(s.price)} (+${formatTL(savings)} kâr) • ⭐ ${s.fpScore}/10 F/P\n   🎮 ${s.gpu} / ${s.cpu.split("(")[0].trim()}`;
  });
  return `🤔 *Beyler hangisi alınır? KasaRadar'da kıyasladım:*\n\n${rows.join("\n\n")}\n\n🏆 Önerilen: *${best.title}*\n👉 Detay & F/P Tablosu: ${SITE_URL}`;
}
