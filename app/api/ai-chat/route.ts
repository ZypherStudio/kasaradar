import { NextResponse } from "next/server";
import { PREBUILT_SYSTEMS, MONITORS_DATABASE } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const { message, budget, useCase, resolution } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || "";

    // Build context about available systems
    const systemsSummary = PREBUILT_SYSTEMS.slice(0, 10).map((s) => ({
      title: s.title,
      seller: s.seller,
      price: s.price,
      gpu: s.gpu,
      cpu: s.cpu,
      ram: s.ram,
      ssd: s.ssd,
      fpScore: s.fpScore,
      savings: s.individualZeroPrice - s.price,
      link: s.directUrl
    }));

    if (apiKey) {
      // Call Google Gemini API
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const systemPrompt = `Sen "KasaRadar" platformunun yapay zeka destekli profesyonel donanım ve hazır sistem danışmanısın.
Görevin: Kullanıcının bütçesine, oynamak istediği oyunlara (CS2, Valorant, Cyberpunk, GTA 6 vb.) ve kullanım amacına göre en mantıklı hazır kasayı önermek.
Aşağıda KasaRadar'da listelenen güncel hazır sistemler var:
${JSON.stringify(systemsSummary, null, 2)}

Kurallar:
1. Yanıtlarını samimi, tecrübeli bir donanım uzmanı ağzıyla ver (Türkçe).
2. Sistemlerin F/P skorunu, kâr oranını ve darboğaz durumunu belirt.
3. Gereksiz uzun laf kalabalığı yapma; net, nokta atışı tavsiyeler ver.
4. Vurguladığın sistemin mağazasını ve fiyatını yaz.`;

      const response = await fetch(geminiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `Kullanıcı Mesajı: "${message || 'Bana en mantıklı hazır kasayı öner'}" | Bütçe: ${budget || 'Belirtilmedi'} TL | Kullanım: ${useCase || 'Oyun'} | Çözünürlük: ${resolution || '1080p'}` }]
            }
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          }
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return NextResponse.json({
          reply: data.candidates[0].content.parts[0].text,
          source: "gemini-1.5-flash"
        });
      }
    }

    // Fallback: Yerleşik akıllı yapay zeka algoritması (API Key yokken bile kesintisiz çalışır)
    const lower = (message || "").toLowerCase();
    let matched = PREBUILT_SYSTEMS[0];

    if (lower.includes("espor") || lower.includes("valorant") || lower.includes("cs2")) {
      matched = PREBUILT_SYSTEMS.find((s) => s.cpuTier >= 80) || PREBUILT_SYSTEMS[0];
    } else if (lower.includes("2k") || lower.includes("4k") || lower.includes("cyberpunk") || lower.includes("gta")) {
      matched = PREBUILT_SYSTEMS.find((s) => s.gpuTier >= 85) || PREBUILT_SYSTEMS[2];
    } else if (budget && budget > 0) {
      matched = PREBUILT_SYSTEMS.filter((s) => s.price <= budget * 1.15).sort((a, b) => b.fpScore - a.fpScore)[0] || PREBUILT_SYSTEMS[0];
    }

    const fallbackReply = `🎯 **KasaRadar Yapay Zeka Tavsiyesi:**

Senin için en mantıklı seçenek: **${matched.title}** (${matched.seller})
💰 **Fiyat:** ${matched.price.toLocaleString("tr-TR")} TL (Piyasaya göre ${((matched.individualZeroPrice || matched.price * 1.15) - matched.price).toLocaleString("tr-TR")} TL kârdasınız!)
⭐ **F/P Skoru:** ${matched.fpScore} / 10

🎮 **Donanım:** ${matched.cpu} & ${matched.gpu}
⚡ **Yapay Zeka Notu:** Bu sistem güncel DLSS/FSR teknolojileri ve yüksek saat hızlarıyla seçtiğiniz bütçede sıfır darboğaz ile maksimum akıcılık sunar.`;

    return NextResponse.json({
      reply: fallbackReply,
      source: "builtin-rule-engine",
      recommendedSystem: matched
    });
  } catch (err: any) {
    return NextResponse.json({
      reply: "Sistem önerisi hazırlanırken küçük bir gecikme oldu. Lütfen tekrar deneyin.",
      error: err.message
    }, { status: 500 });
  }
}
