import { NextResponse } from "next/server";

export async function GET() {
  return handleIndexNow();
}

export async function POST() {
  return handleIndexNow();
}

async function handleIndexNow() {
  const host = "kasaradar.com";
  const key = "kasaradar-indexnow-key";
  const keyLocation = "https://kasaradar.com/kasaradar-indexnow-key.txt";
  const urlList = [
    "https://kasaradar.com/",
    "https://kasaradar.com/#hazir-kasalar",
    "https://kasaradar.com/#fps-testi",
    "https://kasaradar.com/#ekipman",
    "https://kasaradar.com/#yayincilar",
    "https://kasaradar.com/#sifir-vs-ikinciel",
    "https://kasaradar.com/#firsatlar",
    "https://kasaradar.com/#bedava-oyunlar",
    "https://kasaradar.com/#kazik-sayar",
    "https://kasaradar.com/#yukseltme"
  ];

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList
      })
    });

    const status = response.status;
    return NextResponse.json({
      success: status === 200 || status === 202,
      status,
      message: status === 200 || status === 202
        ? "Bing & Yandex IndexNow protokolüne 10 URL başarıyla gönderildi ve anlık indeksleme tetiklendi!"
        : `IndexNow API yanıt kodu: ${status}`,
      urlsSubmitted: urlList.length
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "IndexNow bağlantı hatası"
    }, { status: 500 });
  }
}
