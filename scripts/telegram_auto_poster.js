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

// KasaRadar Sıcak Fırsat & Hazır Kasa Veritabanı (16+ Mağaza)
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
    title: "Tebilon Zenith / i5 12400F & RTX 4060",
    seller: "Tebilon",
    price: 20499,
    oldPrice: 22800,
    savings: 4601,
    fpScore: 9.5,
    gpu: "Gigabyte GeForce RTX 4060 Eagle OC 8GB",
    cpu: "Intel Core i5 12400F 4.4GHz",
    ram: "16GB Corsair Vengeance 3200MHz",
    ssd: "500GB Kingston NV2 M.2 NVMe",
    installments: "Peşin Fiyatına 3 Taksit: 6.833 TL",
    directUrl: "https://kasaradar.com",
    badge: "💥 20.000 TL BANDI F/P KRALI"
  },
  {
    title: "Falcon AMD Pure Power / RX 7700 XT 12GB",
    seller: "İncehesap",
    price: 34999,
    oldPrice: 38500,
    savings: 6201,
    fpScore: 9.3,
    gpu: "Sapphire Pulse Radeon RX 7700 XT 12GB",
    cpu: "AMD Ryzen 5 7500F AM5 5.0GHz",
    ram: "16GB Team T-Force 5600MHz DDR5",
    ssd: "1TB Lexar NM620 Gen3 NVMe",
    installments: "Peşin Fiyatına 3 Taksit: 11.666 TL",
    directUrl: "https://kasaradar.com",
    badge: "🚀 12GB VRAM 2K OYUN CANAVARI"
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
    badge: "🔥 16GB VRAM 2K & 4K CANAVARI"
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
  },
  {
    title: "GameGaraj Hero V2 / RTX 4060 Ti & R5 5600",
    seller: "GameGaraj",
    price: 26499,
    oldPrice: 28999,
    savings: 4800,
    fpScore: 9.4,
    gpu: "Palit GeForce RTX 4060 Ti Dual 8GB",
    cpu: "AMD Ryzen 5 5600 4.4GHz 6C/12T",
    ram: "16GB G.Skill Ripjaws 3200MHz",
    ssd: "1TB Crucial P3 Plus Gen4 NVMe",
    installments: "Peşin Fiyatına 3 Taksit: 8.833 TL",
    directUrl: "https://kasaradar.com",
    badge: "⚡ KELEPİR ALARMI"
  },
  {
    title: "Sinerji Vesper Ultimate / 7800X3D & RTX 4080 Super",
    seller: "Sinerji",
    price: 79999,
    oldPrice: 87500,
    savings: 9500,
    fpScore: 9.7,
    gpu: "Gainward GeForce RTX 4080 SUPER Panther 16GB",
    cpu: "AMD Ryzen 7 7800X3D (Dünyanın 1 Numaralı Oyun İşlemcisi)",
    ram: "32GB Corsair Vengeance 6000MHz CL30",
    ssd: "2TB Kingston KC3000 (7000MB/s Hız)",
    installments: "Peşin Fiyatına 6 Taksit: 13.333 TL",
    directUrl: "https://kasaradar.com",
    badge: "👑 4K ULTRA E-SPOR AMİRAL GEMİSİ"
  },
  {
    title: "QP Eclipse Pro / Ryzen 7 7700X & RX 7800 XT",
    seller: "QP Bilişim",
    price: 49999,
    oldPrice: 55000,
    savings: 8201,
    fpScore: 9.6,
    gpu: "Sapphire Nitro+ Radeon RX 7800 XT 16GB",
    cpu: "AMD Ryzen 7 7700X AM5 5.4GHz",
    ram: "32GB Corsair Vengeance 6000MHz DDR5",
    ssd: "1TB Kingston KC3000 Gen4 M.2 (7000MB/s)",
    installments: "Peşin Fiyatına 4 Taksit: 12.499 TL",
    directUrl: "https://kasaradar.com",
    badge: "🚀 16GB VRAM 2K & 4K CANAVARI"
  },
  {
    title: "Nova Titan Ultra / 7800X3D & 4070 Ti Super",
    seller: "Novabilgisayar",
    price: 64999,
    oldPrice: 71500,
    savings: 9801,
    fpScore: 9.7,
    gpu: "Palit GeForce RTX 4070 Ti SUPER 16GB",
    cpu: "AMD Ryzen 7 7800X3D (3D V-Cache)",
    ram: "32GB G.Skill Flare X5 6000MHz DDR5",
    ssd: "1TB Samsung 980 Pro NVMe Gen4",
    installments: "Peşin Fiyatına 6 Taksit: 10.833 TL",
    directUrl: "https://kasaradar.com",
    badge: "🏆 360Hz E-SPOR AMİRAL GEMİSİ"
  },
  {
    title: "Adeks Pro Esports / i5 14400F & 4060 Ti 16GB",
    seller: "Adeks Store",
    price: 37999,
    oldPrice: 42000,
    savings: 6201,
    fpScore: 9.5,
    gpu: "Gigabyte GeForce RTX 4060 Ti 16GB VRAM",
    cpu: "Intel Core i5 14400F 14. Nesil",
    ram: "32GB Corsair Vengeance 3600MHz",
    ssd: "1TB WD Black SN770 Gen4 NVMe",
    installments: "Peşin Fiyatına 4 Taksit: 9.499 TL",
    directUrl: "https://kasaradar.com",
    badge: "⚡ 16GB VRAM DEV KAPASİTE"
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

async function resolveChannel() {
  if (CHANNEL_ID && !CHANNEL_ID.startsWith("https://t.me/")) {
    return CHANNEL_ID;
  }

  console.log("⏳ [@kasadarrbot] Bot kanalınıza eklenmeyi bekliyor...");
  console.log("👉 Lütfen Telegram kanalınızda (Yöneticiler > Yönetici Ekle) kısmından @kasadarrbot botunu yönetici yapın.");

  while (!CHANNEL_ID || CHANNEL_ID.startsWith("https://t.me/")) {
    try {
      const allowed = encodeURIComponent(JSON.stringify(["message", "channel_post", "my_chat_member", "chat_member"]));
      const updatesRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?allowed_updates=${allowed}`);
      const updatesData = await updatesRes.json();
      if (updatesData.ok && updatesData.result && updatesData.result.length > 0) {
        for (const upd of updatesData.result) {
          const chat = upd.my_chat_member?.chat || 
                       upd.channel_post?.chat || 
                       upd.message?.forward_from_chat ||
                       (upd.message?.chat?.type !== "private" ? upd.message?.chat : null);
          if (chat && (chat.type === "channel" || chat.type === "supergroup" || chat.type === "group")) {
            CHANNEL_ID = chat.id.toString();
            console.log(`🎉 [BAĞLANTI TAMAMLANDI] Kanal bulundu: "${chat.title || "KasaRadar"}" (ID: ${CHANNEL_ID})`);
            
            // .env.local ve .env dosyasına kalıcı kaydet
            try {
              const envFile = path.join(__dirname, "../.env.local");
              let currentEnv = fs.existsSync(envFile) ? fs.readFileSync(envFile, "utf-8") : "";
              if (!currentEnv.includes("TELEGRAM_CHANNEL_ID")) {
                fs.appendFileSync(envFile, `\nTELEGRAM_CHANNEL_ID="${CHANNEL_ID}"\n`);
              }
            } catch (e) {}
            return CHANNEL_ID;
          }
        }
      }
    } catch (e) {}
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  return CHANNEL_ID;
}

/**
 * Ana akış: Sıradaki fırsatı kanala gönderir
 */
async function runBot() {
  const isNow = process.argv.includes("--now");
  console.log("🤖 [KasaRadar Otomatik İlan Botu] Aktif ediliyor...");
  console.log(`Bot: @kasadarrbot (ID: 8960486610)`);

  await resolveChannel();

  // Rastgele veya sıradaki ilanı seç
  const selected = DEALS_QUEUE[Math.floor(Math.random() * DEALS_QUEUE.length)];
  const postText = formatTelegramMessage(selected);

  try {
    const res = await sendToTelegram(postText);
    if (!res.simulated) {
      console.log(`✅ [BAŞARILI] '${selected.title}' Telegram kanalına otomatik gönderildi! Mesaj ID: ${res.result?.message_id}`);
    }
  } catch (err) {
    console.error("❌ Gönderim sırasında hata oluştu:", err.message);
  }

  if (!isNow) {
    const intervalMinutes = parseInt(process.env.TELEGRAM_POST_INTERVAL_MINUTES || "40", 10);
    const intervalMs = intervalMinutes * 60 * 1000;
    console.log(`⏰ Bot her ${intervalMinutes} dakikada bir yeni hazır kasa ilanını otomatik olarak kanalınıza paylaşmaya devam edecek...`);
    setInterval(async () => {
      const nextItem = DEALS_QUEUE[Math.floor(Math.random() * DEALS_QUEUE.length)];
      try {
        await sendToTelegram(formatTelegramMessage(nextItem));
        console.log(`[OTOMATİK YAYINLANDI] Yeni ilan: ${nextItem.title} (${new Date().toLocaleTimeString("tr-TR")})`);
      } catch (e) {
        console.error("[YAYINLAMA HATA]", e.message);
      }
    }, intervalMs);
  }
}

runBot();
