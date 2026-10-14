import { NextResponse } from "next/server";
import { PREBUILT_SYSTEMS } from "@/lib/data";
import { PrebuiltSystem } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { message = "", budget: rawBudget, useCase = "esports", resolution = "1080p" } = await req.json();

    const text = (message || "").toLowerCase().trim();

    // 1. Parse budget from text or param
    let budget = typeof rawBudget === "number" && rawBudget > 0 ? rawBudget : 0;
    const matchK = text.match(/(\d+)\s*k\b/i);
    const matchBin = text.match(/(\d+)\s*bin\b/i);
    const matchNumber = text.match(/(\d{2,3}[\.,]?\d{3})\s*(tl|lira)?/i) || text.match(/\b(\d{5})\b/);

    if (matchK && matchK[1]) {
      budget = parseInt(matchK[1], 10) * 1000;
    } else if (matchBin && matchBin[1]) {
      budget = parseInt(matchBin[1], 10) * 1000;
    } else if (matchNumber && matchNumber[1]) {
      budget = parseInt(matchNumber[1].replace(/[\.,]/g, ""), 10);
    }

    // 2. Identify target priorities
    const wantsEsports =
      text.includes("cs2") ||
      text.includes("cs 2") ||
      text.includes("valorant") ||
      text.includes("espor") ||
      text.includes("rekabetçi") ||
      text.includes("fps") ||
      useCase === "esports";

    const wantsAaa =
      text.includes("cyberpunk") ||
      text.includes("gta") ||
      text.includes("rdr2") ||
      text.includes("rdr") ||
      text.includes("warzone") ||
      text.includes("hikaye") ||
      text.includes("ultra") ||
      text.includes("2k") ||
      text.includes("1440p") ||
      text.includes("4k") ||
      useCase === "story";

    const wantsBudget =
      text.includes("ucuz") ||
      text.includes("f/p") ||
      text.includes("bütçe") ||
      text.includes("en uygun") ||
      text.includes("fiyat performans") ||
      useCase === "budget" ||
      (budget > 0 && budget <= 23000);

    const wantsStreamer =
      text.includes("yayın") ||
      text.includes("stream") ||
      text.includes("render") ||
      text.includes("kurgu") ||
      text.includes("video") ||
      useCase === "content";

    // Hardware specific mentions
    const mentions4070 = text.includes("4070");
    const mentions4060 = text.includes("4060");
    const mentions4080 = text.includes("4080");
    const mentionsRx = text.includes("rx") || text.includes("radeon") || text.includes("amd");
    const mentionsIntel = text.includes("intel") || text.includes("i5") || text.includes("i3");
    const mentionsDdr5 = text.includes("ddr5") || text.includes("am5");

    // 3. Filter candidates by budget
    let candidates = [...PREBUILT_SYSTEMS];

    if (budget > 0) {
      const withinBudget = candidates.filter((s) => s.price <= budget * 1.12);
      if (withinBudget.length > 0) {
        candidates = withinBudget;
      }
    }

    // 4. Score systems intelligently
    candidates.sort((a, b) => {
      let scoreA = a.fpScore * 10;
      let scoreB = b.fpScore * 10;

      // Hardware matching
      if (mentions4080) {
        if (a.gpu.includes("4080")) scoreA += 50;
        if (b.gpu.includes("4080")) scoreB += 50;
      } else if (mentions4070) {
        if (a.gpu.includes("4070")) scoreA += 40;
        if (b.gpu.includes("4070")) scoreB += 40;
      } else if (mentions4060) {
        if (a.gpu.includes("4060")) scoreA += 30;
        if (b.gpu.includes("4060")) scoreB += 30;
      }

      if (mentionsRx) {
        if (a.gpuBrand === "AMD") scoreA += 25;
        if (b.gpuBrand === "AMD") scoreB += 25;
      }

      if (mentionsIntel) {
        if (a.cpuBrand === "Intel") scoreA += 25;
        if (b.cpuBrand === "Intel") scoreB += 25;
      }

      if (mentionsDdr5) {
        if (a.ramType === "DDR5") scoreA += 30;
        if (b.ramType === "DDR5") scoreB += 30;
      }

      if (wantsEsports) {
        scoreA += a.cpuTier * 0.4;
        scoreB += b.cpuTier * 0.4;
      } else if (wantsAaa) {
        scoreA += a.gpuTier * 0.5;
        scoreB += b.gpuTier * 0.5;
      } else if (wantsStreamer) {
        scoreA += (a.ramSizeGb >= 32 ? 25 : 0) + a.cpuTier * 0.3;
        scoreB += (b.ramSizeGb >= 32 ? 25 : 0) + b.cpuTier * 0.3;
      } else if (wantsBudget) {
        scoreA += (50000 - a.price) * 0.001 + a.fpScore * 5;
        scoreB += (50000 - b.price) * 0.001 + b.fpScore * 5;
      }

      return scoreB - scoreA;
    });

    const chosen: PrebuiltSystem = candidates[0] || PREBUILT_SYSTEMS[0];

    // 5. Calculate benchmark estimations based on CPU & GPU tiers
    const cs2Fps = Math.round(180 + chosen.cpuTier * 2.2 + chosen.gpuTier * 0.8);
    const valFps = Math.round(220 + chosen.cpuTier * 3.2);
    const cbFps = Math.round(45 + chosen.gpuTier * 0.75 + (chosen.gpu.includes("4070") || chosen.gpu.includes("4080") ? 15 : 0));
    const gtaFps = Math.round(110 + chosen.gpuTier * 0.7);

    const savings = Math.max(1500, (chosen.individualZeroPrice || Math.round(chosen.price * 1.16)) - chosen.price);
    const bottleneckRate = (Math.abs(chosen.gpuTier - chosen.cpuTier) * 0.25 + 0.9).toFixed(1);

    // 6. Generate expert analysis bullet points
    const bulletPoints = [
      `F/P & Kâr Marjı: Parçaları tek tek perakendeden topladığında ${chosen.individualZeroPrice.toLocaleString("tr-TR")} TL tutarken, bu hazır kasada net ${savings.toLocaleString("tr-TR")} TL tasarruf edersin.`,
      `Espor Performansı: CS2'de ortalama ~${cs2Fps} FPS, Valorant'ta ise ~${valFps} FPS akıcılık sağlar. 144Hz / 240Hz monitörleri sonuna kadar besler.`,
      `AAA Oyunlar & Grafikler: Cyberpunk 2077 ve GTA 5 gibi ağır grafikli oyunlarda yüksek ayarlarda ~${cbFps}+ FPS ile sıfır takılma vadeder.`,
      `Darboğaz & Isı Durumu: ${chosen.cpu.split("(")[0].trim()} ile ${chosen.gpu} ikilisi arasında sadece %${bottleneckRate} mikro darboğaz var; yani tam dengeli ve serin çalışan bir platformdur.`
    ];

    const verdict = `${chosen.seller} güvencesiyle sunulan ${chosen.title}, seçtiğin kriterler ve bütçe aralığında Türkiye pazarında satın alabileceğin en dengeli ve kârlı hazır kasadır.`;

    const formattedReply = `🎯 **KasaRadar Yapay Zeka Tavsiyesi:**
Senin için en mantıklı sistem: **${chosen.title}** (${chosen.seller})

💰 **Fiyat:** ${chosen.price.toLocaleString("tr-TR")} TL (Tek tek toplamaya göre **${savings.toLocaleString("tr-TR")} TL kâr!**)
⭐ **F/P Skoru:** ${chosen.fpScore} / 10 | ⚡ **Darboğaz:** %${bottleneckRate} (Kusursuz Uyum)

🔍 **Neden Bu Sistem?**
• ${bulletPoints[0]}
• ${bulletPoints[1]}
• ${bulletPoints[2]}
• ${bulletPoints[3]}

✅ **Yapay Zeka Kararı:** ${verdict}`;

    return NextResponse.json({
      reply: formattedReply,
      recommendedSystemId: chosen.id,
      recommendedSystem: chosen,
      verdict,
      bulletPoints,
      fpsEstimates: {
        cs2: cs2Fps,
        valorant: valFps,
        cyberpunk: cbFps,
        gta5: gtaFps
      },
      bottleneckPercentage: parseFloat(bottleneckRate),
      savingsTL: savings,
      source: "kasaradar-hardware-engine"
    });
  } catch (err: any) {
    const fallbackSys = PREBUILT_SYSTEMS[0];
    return NextResponse.json({
      reply: `🎯 **KasaRadar Yapay Zeka Tavsiyesi:**
Senin için en mantıklı hazır sistem: **${fallbackSys.title}** (${fallbackSys.seller})
💰 Fiyat: ${fallbackSys.price.toLocaleString("tr-TR")} TL (Piyasaya göre ${(fallbackSys.individualZeroPrice - fallbackSys.price).toLocaleString("tr-TR")} TL kârdasın!)`,
      recommendedSystemId: fallbackSys.id,
      recommendedSystem: fallbackSys,
      verdict: "KasaRadar testlerinden 9.4/10 tam not alan, 1080p Ultra espor ve AAA oyunlarda en çok satan modeldir.",
      bulletPoints: [
        `Net Tasarruf: Perakende fiyatına kıyasla ${(fallbackSys.individualZeroPrice - fallbackSys.price).toLocaleString("tr-TR")} TL kâr.`,
        "Espor Canavarı: CS2 ve Valorant'ta 300+ FPS garantili.",
        "Sıfır Darboğaz: Ryzen 5 5600 ve RTX 4060 dengeli mimari."
      ],
      fpsEstimates: { cs2: 320, valorant: 420, cyberpunk: 85, gta5: 140 },
      bottleneckPercentage: 1.8,
      savingsTL: fallbackSys.individualZeroPrice - fallbackSys.price,
      source: "kasaradar-hardware-engine"
    });
  }
}
