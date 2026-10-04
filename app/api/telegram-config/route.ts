import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ENV_PATH = path.join(process.cwd(), ".env.local");

export async function GET() {
  try {
    let token = process.env.TELEGRAM_BOT_TOKEN || "";
    let channelId = process.env.TELEGRAM_CHANNEL_ID || "https://t.me/+Voua-sJ4TVJiZjc8";

    if (fs.existsSync(ENV_PATH)) {
      const content = fs.readFileSync(ENV_PATH, "utf-8");
      const tokenMatch = content.match(/TELEGRAM_BOT_TOKEN=["']?([^"'\n]+)["']?/);
      const channelMatch = content.match(/TELEGRAM_CHANNEL_ID=["']?([^"'\n]+)["']?/);
      if (tokenMatch) token = tokenMatch[1];
      if (channelMatch) channelId = channelMatch[1];
    }

    return NextResponse.json({
      configured: !!token,
      channelId,
      hasToken: !!token
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { token, channelId } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token boş olamaz" }, { status: 400 });
    }

    const envContent = `# KasaRadar Otomasyon Değişkenleri
TELEGRAM_BOT_TOKEN="${token.trim()}"
TELEGRAM_CHANNEL_ID="${(channelId || "https://t.me/+Voua-sJ4TVJiZjc8").trim()}"
`;

    fs.writeFileSync(ENV_PATH, envContent, "utf-8");
    process.env.TELEGRAM_BOT_TOKEN = token.trim();
    process.env.TELEGRAM_CHANNEL_ID = (channelId || "https://t.me/+Voua-sJ4TVJiZjc8").trim();

    return NextResponse.json({
      success: true,
      message: "Telegram bot ayarları başarıyla kaydedildi ve terminale aktarıldı!"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
