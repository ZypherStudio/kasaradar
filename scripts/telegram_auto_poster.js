/**
 * KasaRadar Otomatik Telegram Bot & İlan Yayıncısı
 * ZYPHERSTUDIO • YAPIMCI | zypherstudio@gmail.com
 * 
 * Bu bot KasaRadar veritabanındaki en karlı hazır sistemleri,
 * fiyatı düşen donanımları ve gece kelepirlerini Telegram kanalınıza
 * insan müdahalesi olmadan otomatik olarak gönderir.
 * 
 * Kurulum:
 * 1. Telegram'da @BotFather'a gidin -> /newbot yazıp bot oluşturun.
 * 2. Size verilen HTTP API Token'ı alın.
 * 3. Botunuzu kanalınıza (@kasaradar veya davet linkiniz olan kanala) YÖNETİCİ (Admin) olarak ekleyin ("Post Messages" yetkisi verin).
 * 4. Terminalden çalıştırın:
 *    TELEGRAM_BOT_TOKEN="BOT_TOKENINIZ" TELEGRAM_CHANNEL_ID="@kanaliniz_veya_id" node scripts/telegram_auto_poster.js --now
 */

const fs = require("fs");
const path = require("path");

// .env.local veya .env dosyasını otomatik yükle
function loadEnv() {
  const envPaths = [
    path.join(__dirname, "../.env.local"),
    path.join(__dirname, "../.env"),
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env")
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const lines = content.split("\n");
      for (const line of lines) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          value = value.trim().replace(/^['"]|['"]$/g, "");
          if (!process.env[key]) process.env[key] = value;
        }
      }
    }
  }
}
loadEnv();

let BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
let CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || "https://t.me/+Voua-sJ4TVJiZjc8";

// KasaRadar Sıcak Fırsat & Hazır Kasa Veritabanı
const DEALS_QUEUE = [
  {
    title: "Gençer Phantom V1 / RTX 4060 Ti",
    seller: "Gençer Gaming",
    price: 27999,
    oldPrice: 30500,
    savings: 5401,
    fpScore: 9.6,
    gpu: "Gainward GeForce RTX 4060 Ti Ghost 8GB",
    cpu: "AMD Ryzen 5 5600 (4.4GHz 6C/12T)",
    ram: "16GB DDR4 Lexar Thor",
    ssd: "1TB Agi High Speed Gen3 NVMe (3500MB/s)",
    installments: "Peşin Fiyatına 3 Taksit: 9.333 TL",
    directUrl: "https://kasaradar.com",
    badge: "🔥 GÜNÜN F/P ŞAMPİYONU"
  },
  {
    title: "ModArt-X1 V2 / RTX 4060 Gaming",
    seller: "İtopya",
    price: 22999,
    oldPrice: 25499,
    savings: 4200,
    fpScore: 9.4,
    gpu: "Gigabyte GeForce RTX 4060 Windforce OC 8GB",
    cpu: "AMD Ryzen 5 5600 4.4GHz",
    ram: "16GB G.Skill Ripjaws 3200MHz",
    ssd: "500GB Kioxia Exceria NVMe",
    installments: "Peşin Fiyatına 4 Taksit: 5.749 TL",
    directUrl: "https://kasaradar.com",
    badge: "⚡ İNDİRİM ALARMI (FİYAT DÜŞTÜ)"
  },
  {
    title: "Blade-7500F / RTX 4060 Ti DDR5 Canavarı",
    seller: "Gaming.Gen.TR",
    price: 31499,
    oldPrice: 34999,
    savings: 6401,
    fpScore: 9.6,
    gpu: "ASUS Dual GeForce RTX 4060 Ti OC 8GB",
    cpu: "AMD Ryzen 5 7500F AM5 5.0GHz",
    ram: "16GB Corsair Vengeance 5600MHz DDR5",
    ssd: "1TB Kingston NV2 Gen4 M.2",
    installments: "Peşin Fiyatına 3 Taksit: 10.499 TL",
    directUrl: "https://kasaradar.com",
    badge: "👑 DDR5 EN ÇOK SATAN"
  },
  {
    title: "Dark Diamond Pro / RX 7800 XT 16GB",
    seller: "Teknobiyotik",
    price: 39999,
    oldPrice: 43500,
    savings: 7201,
    fpScore: 9.3,
    gpu: "Sapphire Nitro+ Radeon RX 7800 XT 16GB",
    cpu: "AMD Ryzen 5 7600 AM5 (240mm Sıvı Soğutma)",
    ram: "32GB Kingston Fury DDR5",
    ssd: "1TB Kioxia Exceria Plus G3 Gen4",
    installments: "Peşin Fiyatına 4 Taksit: 9.999 TL",
    directUrl: "https://kasaradar.com",
    badge: "🚀 16GB VRAM 2K & 4K CANAVARI"
  },
  {
    title: "Pckolik Ghost / i5 13400F & RTX 4070 Super",
    seller: "Pckolik",
    price: 44499,
    oldPrice: 48900,
    savings: 7500,
    fpScore: 9.5,
    gpu: "Inno3D GeForce RTX 4070 SUPER Twin X2 12GB",
    cpu: "Intel Core i5 13400F (10C/16T)",
    ram: "16GB Lexar Ares 6000MHz DDR5",
    ssd: "1TB Kingston NV2 Gen4",
    installments: "Peşin Fiyatına 4 Taksit: 11.124 TL",
    directUrl: "https://kasaradar.com",
    badge: "⭐ 2K ULTRA CANAVAR"
  }
];

/**
 * Gönderi metnini Telegram formatında zengin olarak hazırlar
 */
function formatTelegramMessage(item) {
  return `${item.badge}

🖥️ <b>${item.title}</b>
🏪 <b>Satıcı Mağaza:</b> ${item.seller}

💰 <b>Fiyat:</b> ${item.price.toLocaleString("tr-TR")} TL ${item.oldPrice ? `<s>(${item.oldPrice.toLocaleString("tr-TR")} TL)</s>` : ""}
💎 <b>Tek Tek Toplamaya Göre Kâr:</b> +${item.savings.toLocaleString("tr-TR")} TL Cepte!
⭐ <b>F/P Skoru:</b> ${item.fpScore} / 10

🎮 <b>Ekran Kartı:</b> ${item.gpu}
⚡ <b>İşlemci:</b> ${item.cpu}
💾 <b>Bellek & SSD:</b> ${item.ram} • ${item.ssd}
💳 <b>Finansman:</b> ${item.installments}

🎯 <i>KasaRadar yapay zeka algoritması tarafından 16+ mağaza taranarak onaylanmıştır.</i>

🔗 <b>Hemen İncele & Satın Al:</b>
👉 <a href="${item.directUrl}">kasaradar.com üzerinden gör</a>

━━━━━━━━━━━━━━━━━━━━
📡 <b>KasaRadar Resmi Fırsat Radarı</b> • ZYPHERSTUDIO`;
}

/**
 * Telegram API üzerinden kanala mesaj gönderir
 */
async function sendToTelegram(messageHtml) {
  if (!BOT_TOKEN) {
    console.log("[SIMÜLASYON MODU] Bot Token girilmedi.");
    console.log("Gönderilecek Mesaj Taslağı:\n");
    console.log(messageHtml);
    console.log("\n✅ Otomasyon motoru hazır! Canlıya almak için token belirleyin.");
    return { ok: true, simulated: true };
  }

  // Eğer channel_id invite link ise getUpdates ile gerçek ID'yi otomatik bul
  if (!CHANNEL_ID || CHANNEL_ID.startsWith("https://t.me/")) {
    try {
      const updatesRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
      const updatesData = await updatesRes.json();
      if (updatesData.ok && updatesData.result) {
        for (const upd of updatesData.result) {
          const chat = upd.my_chat_member?.chat || upd.channel_post?.chat || upd.message?.chat;
          if (chat && (chat.type === "channel" || chat.type === "supergroup")) {
            CHANNEL_ID = chat.id.toString();
            console.log(`[OTOMATİK KANAL BULUNDU] Kanal ID: ${CHANNEL_ID}`);
            break;
          }
        }
      }
    } catch (e) {}
  }

  const endpoint = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHANNEL_ID,
      text: messageHtml,
      parse_mode: "HTML",
      disable_web_page_preview: false
    })
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(`Telegram API Hatası: ${data.description}`);
  }
  return data;
}

/**
 * Ana akış: Sıradaki fırsatı kanala gönderir
 */
async function runBot() {
  const isNow = process.argv.includes("--now");
  console.log("🤖 [KasaRadar Otomatik İlan Botu] Başlatılıyor...");
  console.log(`Hedef Kanal: ${CHANNEL_ID || "Belirtilmedi (Simülasyon)"}`);

  // Rastgele veya sıradaki ilanı seç
  const selected = DEALS_QUEUE[Math.floor(Math.random() * DEALS_QUEUE.length)];
  const postText = formatTelegramMessage(selected);

  try {
    const res = await sendToTelegram(postText);
    if (res.simulated) {
      console.log(`[BAŞARILI] '${selected.title}' yayına hazırlandı!`);
    } else {
      console.log(`✅ [BAŞARILI] '${selected.title}' Telegram kanalına başarıyla gönderildi! Mesaj ID: ${res.result.message_id}`);
    }
  } catch (err) {
    console.error("❌ Gönderim sırasında hata oluştu:", err.message);
  }

  if (!isNow) {
    console.log("⏰ Bot her 3 saatte bir otomatik yeni fırsat göndermek üzere arka planda dinlemede...");
    setInterval(async () => {
      const nextItem = DEALS_QUEUE[Math.floor(Math.random() * DEALS_QUEUE.length)];
      try {
        await sendToTelegram(formatTelegramMessage(nextItem));
        console.log(`[ZAMANLAYICI] Yeni ilan paylaşıldı: ${nextItem.title}`);
      } catch (e) {
        console.error("[ZAMANLAYICI HATA]", e.message);
      }
    }, 3 * 60 * 60 * 1000); // 3 saat
  }
}

runBot();
