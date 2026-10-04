import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, channelId, message } = body;

    const botToken = token || process.env.TELEGRAM_BOT_TOKEN;
    const targetChannel = channelId || process.env.TELEGRAM_CHANNEL_ID || "@kasaradartr";

    if (!botToken) {
      return NextResponse.json({
        success: false,
        message: "Bot Token eksik. Lütfen Telegram @BotFather'dan aldığınız token'ı girin."
      }, { status: 400 });
    }

    const defaultHtml = `🔥 <b>KasaRadar Otomatik Fırsat Radarı Testi</b>

🖥️ <b>Gençer Phantom V1 / RTX 4060 Ti</b>
💰 <b>Fiyat:</b> 27.999 TL
⭐ <b>F/P Skoru:</b> 9.6 / 10
💎 <b>Tek Tek Toplamaya Göre:</b> +5.401 TL Kârlı!

🔗 <a href="https://kasaradar.com">kasaradar.com üzerinden incele</a>

📡 <i>KasaRadar Bot Engine • ZYPHERSTUDIO</i>`;

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
        error: data.description
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      messageId: data.result.message_id
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Bilinmeyen sunucu hatası"
    }, { status: 500 });
  }
}
