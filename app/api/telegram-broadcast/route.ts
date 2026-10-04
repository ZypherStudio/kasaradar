import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ENV_PATH = path.join(process.cwd(), ".env.local");

function getStoredConfig() {
  let token = process.env.TELEGRAM_BOT_TOKEN || "";
  let channelId = process.env.TELEGRAM_CHANNEL_ID || "";

  if (fs.existsSync(ENV_PATH)) {
    const content = fs.readFileSync(ENV_PATH, "utf-8");
    const tokenMatch = content.match(/TELEGRAM_BOT_TOKEN=["']?([^"'\n]+)["']?/);
    const channelMatch = content.match(/TELEGRAM_CHANNEL_ID=["']?([^"'\n]+)["']?/);
    if (tokenMatch) token = tokenMatch[1];
    if (channelMatch) channelId = channelMatch[1];
  }
  return { token, channelId };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let { token, channelId, message } = body;

    const stored = getStoredConfig();
    const botToken = (token || stored.token || process.env.TELEGRAM_BOT_TOKEN || "").trim();
    let targetChannel = (channelId || stored.channelId || process.env.TELEGRAM_CHANNEL_ID || "").trim();

    if (!botToken) {
      return NextResponse.json({
        success: false,
        error: "Bot Token eksik! Lütfen Telegram'da @BotFather'dan aldığınız token kodunu yapıştırın."
      }, { status: 400 });
    }

    // Kanal ID'si yoksa veya davet linki formatındaysa getUpdates ile otomatik bulmayı dene
    if (!targetChannel || targetChannel.startsWith("https://t.me/")) {
      try {
        const updatesRes = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
        const updatesData = await updatesRes.json();
        if (updatesData.ok && updatesData.result && updatesData.result.length > 0) {
          for (const upd of updatesData.result) {
            const chat = upd.my_chat_member?.chat || upd.channel_post?.chat || upd.message?.chat;
            if (chat && (chat.type === "channel" || chat.type === "supergroup")) {
              targetChannel = chat.id.toString();
              // Bulunan kanal ID'sini kalıcı kaydet
              process.env.TELEGRAM_CHANNEL_ID = targetChannel;
              break;
            }
          }
        }
      } catch (e) {
        console.error("Auto channel id discovery failed", e);
      }
    }

    // Eğer hala bulunamadıysa kullanıcıya açıklayıcı mesaj dön
    if (!targetChannel || targetChannel.startsWith("https://t.me/")) {
      return NextResponse.json({
        success: false,
        needsChannelAdmin: true,
        error: "Botunuz kanalınıza eklendi mi? Lütfen kanalınızda (Yöneticiler > Yönetici Ekle) diyerek botu yönetici yapın. Sistem kanalı otomatik tanıyacaktır."
      }, { status: 400 });
    }

    const defaultHtml = `🔥 <b>GÜNÜN F/P ŞAMPİYONU: RTX 4060 Ti Sistem 27.999 TL!</b>

🖥️ <b>Gençer Phantom V1 Gaming PC</b>
🏪 <b>Satıcı Mağaza:</b> Gençer Gaming

💰 <b>Fiyat:</b> 27.999 TL <s>(30.500 TL)</s>
💎 <b>Kâr:</b> +5.401 TL Cepte (Tek tek sıfır toplamaya kıyasla)
⭐ <b>F/P Skoru:</b> 9.6 / 10

🎮 <b>Ekran Kartı:</b> Gainward RTX 4060 Ti Ghost 8GB
⚡ <b>İşlemci:</b> AMD Ryzen 5 5600 (4.4GHz 6C/12T)
💾 <b>Bellek & SSD:</b> 16GB DDR4 • 1TB Gen3 NVMe SSD (3500MB/s)
💳 <b>Taksit:</b> Peşin fiyatına 3 taksit: 9.333 TL x 3

🎯 <i>KasaRadar yapay zeka algoritması tarafından onaylanmıştır.</i>

🔗 <b>Hemen İncele & Satın Al:</b>
👉 <a href="https://kasaradar.com">kasaradar.com üzerinden gör</a>

━━━━━━━━━━━━━━━━━━━━
📡 <b>KasaRadar Otomatik Fırsat Radarı</b> • ZYPHERSTUDIO`;

    const textToSend = message || defaultHtml;

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: targetChannel,
        text: textToSend,
        parse_mode: "HTML",
        disable_web_page_preview: false
      })
    });

    const data = await res.json();
    if (!data.ok) {
      return NextResponse.json({
        success: false,
        error: `Telegram Hatası: ${data.description}`
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      messageId: data.result.message_id,
      channelId: targetChannel,
      message: "İlan Telegram kanalınıza başarıyla yayınlandı!"
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Sunucu hatası"
    }, { status: 500 });
  }
}
