export interface BenchmarkCpu {
  id: string;
  name: string;
  brand: "AMD" | "Intel";
  tier: number; // 1-100
  cores: string;
  priceAvg: number;
}

export interface BenchmarkGpu {
  id: string;
  name: string;
  brand: "Nvidia" | "AMD";
  tier: number; // 1-100
  vramGb: number;
  priceAvg: number;
}

export const POPULAR_CPUS: BenchmarkCpu[] = [
  // AMD AM5 & Son Nesil
  { id: "r7-9800x3d", name: "AMD Ryzen 7 9800X3D", brand: "AMD", tier: 100, cores: "8 Çekirdek / 16 İzlek", priceAvg: 19500 },
  { id: "r7-7800x3d", name: "AMD Ryzen 7 7800X3D", brand: "AMD", tier: 99, cores: "8 Çekirdek / 16 İzlek", priceAvg: 16500 },
  { id: "r7-9700x", name: "AMD Ryzen 7 9700X (AM5)", brand: "AMD", tier: 92, cores: "8 Çekirdek / 16 İzlek", priceAvg: 13900 },
  { id: "r5-7600", name: "AMD Ryzen 5 7600 (AM5)", brand: "AMD", tier: 85, cores: "6 Çekirdek / 12 İzlek", priceAvg: 7200 },
  { id: "r5-7500f", name: "AMD Ryzen 5 7500F (AM5)", brand: "AMD", tier: 84, cores: "6 Çekirdek / 12 İzlek", priceAvg: 5800 },
  { id: "r5-8400f", name: "AMD Ryzen 5 8400F (AM5)", brand: "AMD", tier: 80, cores: "6 Çekirdek / 12 İzlek", priceAvg: 5200 },

  // AMD AM4 Popüler & 2. El Efsaneleri
  { id: "r7-5700x3d", name: "AMD Ryzen 7 5700X3D", brand: "AMD", tier: 86, cores: "8 Çekirdek / 16 İzlek", priceAvg: 8500 },
  { id: "r7-5800x", name: "AMD Ryzen 7 5800X", brand: "AMD", tier: 76, cores: "8 Çekirdek / 16 İzlek", priceAvg: 6800 },
  { id: "r5-5600x", name: "AMD Ryzen 5 5600X", brand: "AMD", tier: 70, cores: "6 Çekirdek / 12 İzlek", priceAvg: 4400 },
  { id: "r5-5600", name: "AMD Ryzen 5 5600", brand: "AMD", tier: 68, cores: "6 Çekirdek / 12 İzlek", priceAvg: 3800 },
  { id: "r5-5500", name: "AMD Ryzen 5 5500", brand: "AMD", tier: 55, cores: "6 Çekirdek / 12 İzlek", priceAvg: 2900 },
  { id: "r5-3600", name: "AMD Ryzen 5 3600", brand: "AMD", tier: 48, cores: "6 Çekirdek / 12 İzlek", priceAvg: 2200 },
  { id: "r5-2600", name: "AMD Ryzen 5 2600", brand: "AMD", tier: 40, cores: "6 Çekirdek / 12 İzlek", priceAvg: 1600 },
  { id: "r3-3100", name: "AMD Ryzen 3 3100", brand: "AMD", tier: 38, cores: "4 Çekirdek / 8 İzlek", priceAvg: 1400 },

  // Intel 13. & 14. Nesil
  { id: "i7-14700k", name: "Intel Core i7 14700K", brand: "Intel", tier: 96, cores: "20 Çekirdek / 28 İzlek", priceAvg: 16000 },
  { id: "i5-14600kf", name: "Intel Core i5 14600KF", brand: "Intel", tier: 90, cores: "14 Çekirdek / 20 İzlek", priceAvg: 11000 },
  { id: "i7-13700k", name: "Intel Core i7 13700K", brand: "Intel", tier: 92, cores: "16 Çekirdek / 24 İzlek", priceAvg: 13500 },
  { id: "i5-14400f", name: "Intel Core i5 14400F", brand: "Intel", tier: 78, cores: "10 Çekirdek / 16 İzlek", priceAvg: 7500 },
  { id: "i5-13400f", name: "Intel Core i5 13400F", brand: "Intel", tier: 75, cores: "10 Çekirdek / 16 İzlek", priceAvg: 6700 },

  // Intel 10., 11. & 12. Nesil (2. El Çok Satanlar)
  { id: "i5-12400f", name: "Intel Core i5 12400F", brand: "Intel", tier: 66, cores: "6 Çekirdek / 12 İzlek", priceAvg: 4100 },
  { id: "i3-12100f", name: "Intel Core i3 12100F", brand: "Intel", tier: 52, cores: "4 Çekirdek / 8 İzlek", priceAvg: 2800 },
  { id: "i5-11400f", name: "Intel Core i5 11400F", brand: "Intel", tier: 58, cores: "6 Çekirdek / 12 İzlek", priceAvg: 3300 },
  { id: "i5-10400f", name: "Intel Core i5 10400F", brand: "Intel", tier: 50, cores: "6 Çekirdek / 12 İzlek", priceAvg: 2600 },
  { id: "i3-10100f", name: "Intel Core i3 10100F", brand: "Intel", tier: 42, cores: "4 Çekirdek / 8 İzlek", priceAvg: 1800 }
];

export const POPULAR_GPUS: BenchmarkGpu[] = [
  // Nvidia RTX 4000 Serisi
  { id: "rtx-4090", name: "Nvidia GeForce RTX 4090 24GB", brand: "Nvidia", tier: 100, vramGb: 24, priceAvg: 80000 },
  { id: "rtx-4080-super", name: "Nvidia GeForce RTX 4080 SUPER 16GB", brand: "Nvidia", tier: 97, vramGb: 16, priceAvg: 46000 },
  { id: "rtx-4070-ti-super", name: "Nvidia GeForce RTX 4070 Ti SUPER 16GB", brand: "Nvidia", tier: 93, vramGb: 16, priceAvg: 34500 },
  { id: "rtx-4070-super", name: "Nvidia GeForce RTX 4070 SUPER 12GB", brand: "Nvidia", tier: 89, vramGb: 12, priceAvg: 26000 },
  { id: "rtx-4070", name: "Nvidia GeForce RTX 4070 12GB", brand: "Nvidia", tier: 85, vramGb: 12, priceAvg: 22500 },
  { id: "rtx-4060-ti-16gb", name: "Nvidia GeForce RTX 4060 Ti 16GB", brand: "Nvidia", tier: 80, vramGb: 16, priceAvg: 19000 },
  { id: "rtx-4060-ti", name: "Nvidia GeForce RTX 4060 Ti 8GB", brand: "Nvidia", tier: 79, vramGb: 8, priceAvg: 16000 },
  { id: "rtx-4060", name: "Nvidia GeForce RTX 4060 8GB", brand: "Nvidia", tier: 72, vramGb: 8, priceAvg: 12500 },

  // Nvidia RTX 3000 & 2000 Serisi (Sıfır & 2. El)
  { id: "rtx-3080", name: "Nvidia GeForce RTX 3080 10GB", brand: "Nvidia", tier: 86, vramGb: 10, priceAvg: 16500 },
  { id: "rtx-3070-ti", name: "Nvidia GeForce RTX 3070 Ti 8GB", brand: "Nvidia", tier: 78, vramGb: 8, priceAvg: 13500 },
  { id: "rtx-3070", name: "Nvidia GeForce RTX 3070 8GB", brand: "Nvidia", tier: 75, vramGb: 8, priceAvg: 11500 },
  { id: "rtx-3060-ti", name: "Nvidia GeForce RTX 3060 Ti 8GB", brand: "Nvidia", tier: 71, vramGb: 8, priceAvg: 9500 },
  { id: "rtx-3060", name: "Nvidia GeForce RTX 3060 12GB", brand: "Nvidia", tier: 62, vramGb: 12, priceAvg: 8500 },
  { id: "rtx-3050", name: "Nvidia GeForce RTX 3050 8GB", brand: "Nvidia", tier: 50, vramGb: 8, priceAvg: 6800 },
  { id: "rtx-2060-super", name: "Nvidia GeForce RTX 2060 Super 8GB", brand: "Nvidia", tier: 56, vramGb: 8, priceAvg: 5800 },
  { id: "rtx-2060", name: "Nvidia GeForce RTX 2060 6GB", brand: "Nvidia", tier: 49, vramGb: 6, priceAvg: 4800 },

  // Nvidia GTX Efsaneleri (Milyonlarca Oyuncunun Elindeki Kartlar)
  { id: "gtx-1660-super", name: "Nvidia GeForce GTX 1660 Super 6GB", brand: "Nvidia", tier: 44, vramGb: 6, priceAvg: 3800 },
  { id: "gtx-1660-ti", name: "Nvidia GeForce GTX 1660 Ti 6GB", brand: "Nvidia", tier: 46, vramGb: 6, priceAvg: 4100 },
  { id: "gtx-1650", name: "Nvidia GeForce GTX 1650 4GB", brand: "Nvidia", tier: 32, vramGb: 4, priceAvg: 2600 },
  { id: "gtx-1060-6gb", name: "Nvidia GeForce GTX 1060 6GB", brand: "Nvidia", tier: 36, vramGb: 6, priceAvg: 2400 },
  { id: "gtx-1050-ti", name: "Nvidia GeForce GTX 1050 Ti 4GB", brand: "Nvidia", tier: 24, vramGb: 4, priceAvg: 1800 },

  // AMD Radeon RX 7000 & 6000 & 500 Serisi
  { id: "rx-7900-xtx", name: "AMD Radeon RX 7900 XTX 24GB", brand: "AMD", tier: 96, vramGb: 24, priceAvg: 38000 },
  { id: "rx-7900-gre", name: "AMD Radeon RX 7900 GRE 16GB", brand: "AMD", tier: 91, vramGb: 16, priceAvg: 25000 },
  { id: "rx-7800-xt", name: "AMD Radeon RX 7800 XT 16GB", brand: "AMD", tier: 88, vramGb: 16, priceAvg: 21500 },
  { id: "rx-7700-xt", name: "AMD Radeon RX 7700 XT 12GB", brand: "AMD", tier: 84, vramGb: 12, priceAvg: 17500 },
  { id: "rx-7600-xt", name: "AMD Radeon RX 7600 XT 16GB", brand: "AMD", tier: 74, vramGb: 16, priceAvg: 14000 },
  { id: "rx-7600", name: "AMD Radeon RX 7600 8GB", brand: "AMD", tier: 71, vramGb: 8, priceAvg: 10800 },
  { id: "rx-6700-xt", name: "AMD Radeon RX 6700 XT 12GB", brand: "AMD", tier: 76, vramGb: 12, priceAvg: 10500 },
  { id: "rx-6600-xt", name: "AMD Radeon RX 6600 XT 8GB", brand: "AMD", tier: 66, vramGb: 8, priceAvg: 7500 },
  { id: "rx-6600", name: "AMD Radeon RX 6600 8GB", brand: "AMD", tier: 58, vramGb: 8, priceAvg: 6800 },
  { id: "rx-580-8gb", name: "AMD Radeon RX 580 8GB", brand: "AMD", tier: 33, vramGb: 8, priceAvg: 2200 },
  { id: "rx-570-4gb", name: "AMD Radeon RX 570 4GB", brand: "AMD", tier: 28, vramGb: 4, priceAvg: 1600 }
];

export interface BottleneckAnalysisResult {
  bottleneckPercent: number;
  status: "perfect" | "acceptable" | "heavy";
  statusText: string;
  bottleneckSource: "cpu" | "gpu" | "balanced";
  sourceText: string;
  estimatedFpsLoss: number;
  recommendation: string;
  bestAlternativeCpu?: string;
  bestAlternativeGpu?: string;
}

export function calculateBottleneck(
  cpuId: string,
  gpuId: string,
  resolution: "1080p" | "1440p" | "2160p",
  gameType: "esports" | "aaa"
): BottleneckAnalysisResult {
  const cpu = POPULAR_CPUS.find((c) => c.id === cpuId) || POPULAR_CPUS[0];
  const gpu = POPULAR_GPUS.find((g) => g.id === gpuId) || POPULAR_GPUS[0];

  // Resolution adjustment: Higher resolution moves workload to GPU, reducing CPU bottleneck
  let resolutionModifier = 1.0;
  if (resolution === "1440p") resolutionModifier = 0.75;
  if (resolution === "2160p") resolutionModifier = 0.45;

  // Game type adjustment: Esports relies heavily on single-thread CPU performance
  const gameModifier = gameType === "esports" ? 1.25 : 0.85;

  // Calculate raw disparity: If GPU is significantly stronger than CPU
  const rawTierDiff = (gpu.tier - cpu.tier);

  let rawBottleneck = 0;
  let source: "cpu" | "gpu" | "balanced" = "balanced";

  if (rawTierDiff > 4) {
    // CPU cannot keep up with GPU
    source = "cpu";
    rawBottleneck = Math.max(3, Math.round(rawTierDiff * 1.8 * resolutionModifier * gameModifier));
  } else if (rawTierDiff < -18) {
    // GPU is much weaker than CPU
    source = "gpu";
    rawBottleneck = Math.max(3, Math.round(Math.abs(rawTierDiff) * 0.9 * (1 / resolutionModifier)));
  } else {
    source = "balanced";
    rawBottleneck = Math.max(1, Math.round(Math.abs(rawTierDiff) * 0.6));
  }

  // Cap bottleneck percent at 65%
  const bottleneckPercent = Math.min(65, Math.max(0, rawBottleneck));

  let status: "perfect" | "acceptable" | "heavy" = "perfect";
  let statusText = "Mükemmel Uyum! Sıfır Darboğaz.";
  if (bottleneckPercent >= 16) {
    status = "heavy";
    statusText = "Ciddi Darboğaz Riski!";
  } else if (bottleneckPercent >= 6) {
    status = "acceptable";
    statusText = "Hafif / Kabul Edilebilir Darboğaz";
  }

  const sourceText =
    source === "cpu"
      ? "İşlemci Darboğazı (İşlemciniz ekran kartınızın tüm gücünü vermesini engelliyor)"
      : source === "gpu"
      ? "Ekran Kartı Darboğazı (İşlemciniz ekran kartınızdan çok daha güçlü, kart %100 yükte)"
      : "Dengeli Sistem (Bileşenler birbirini kusursuz besliyor)";

  const estimatedFpsLoss = status === "heavy" ? Math.round(bottleneckPercent * 0.8) : status === "acceptable" ? Math.round(bottleneckPercent * 0.4) : 0;

  let recommendation = "";
  if (source === "cpu" && status === "heavy") {
    recommendation = `${cpu.name}, ${gpu.name} için özellikle ${resolution} çözünürlükte yetersiz kalıyor. Yaklaşık %${estimatedFpsLoss} FPS kaybı yaşarsınız. İşlemcinizi en az ${cpu.brand === "AMD" ? "Ryzen 5 7500F veya Ryzen 7 5700X3D" : "Core i5 13400F veya 14600K"}'e yükseltmeniz önerilir.`;
  } else if (source === "cpu" && status === "acceptable") {
    recommendation = `Bu ikili çoğu oyunda akıcı çalışır ancak rekabetçi espor oyunlarında ufak mikro takılmalar veya %${estimatedFpsLoss} FPS kaybı olabilir. İleride işlemci yükseltmesi düşünülebilir.`;
  } else if (source === "gpu" && status === "heavy") {
    recommendation = `${cpu.name} çok güçlü bir işlemci, ${gpu.name} ise bu işlemcinin yanında biraz zayıf kalıyor. Darboğaz bilgisayara zarar vermez ancak işlemcinizin potansiyelini tam kullanabilmek için ileride daha üst segment bir ekran kartına geçebilirsiniz.`;
  } else {
    recommendation = `Tebrikler! ${cpu.name} ve ${gpu.name} ${resolution} çözünürlükte birbirini kusursuz besliyor. Sisteminizden %100 tam verim ve stabil kare hızları alırsınız.`;
  }

  return {
    bottleneckPercent,
    status,
    statusText,
    bottleneckSource: source,
    sourceText,
    estimatedFpsLoss,
    recommendation,
    bestAlternativeCpu: source === "cpu" ? (cpu.brand === "AMD" ? "AMD Ryzen 5 7500F" : "Intel Core i5 13400F") : undefined,
    bestAlternativeGpu: source === "gpu" ? "Nvidia GeForce RTX 4070 SUPER" : undefined
  };
}

export interface KazikScoreResult {
  grade: "S" | "A" | "B" | "C" | "F";
  gradeTitle: string;
  gradeColor: string;
  fairMarketPrice: number;
  priceDiff: number; // positive = more expensive (kazık), negative = cheaper (kelepir)
  priceDiffPercent: number;
  verdict: "kelepir" | "fiyat_performans" | "piyasa" | "pahali" | "asiri_kazik";
  headline: string;
  summaryExplanation: string;
  detailedPoints: string[];
}

export function calculateKazikScore(
  cpuId: string,
  gpuId: string,
  ramGb: number,
  ssdGb: number,
  actualPrice: number
): KazikScoreResult {
  const cpu = POPULAR_CPUS.find((c) => c.id === cpuId) || POPULAR_CPUS[0];
  const gpu = POPULAR_GPUS.find((g) => g.id === gpuId) || POPULAR_GPUS[0];

  // Fair component calculation (motherboard + psu + case + cooling included)
  const ramPrice = ramGb >= 32 ? 3200 : 1600;
  const ssdPrice = ssdGb >= 1000 ? 2800 : 1600;
  const otherPartsAvg = 6500; // Motherboard (2500) + Case & PSU (3200) + Basic Cooler (800)

  // Standard retail ready prebuilt fair market cost
  const individualSum = cpu.priceAvg + gpu.priceAvg + ramPrice + ssdPrice + otherPartsAvg;
  // Prebuilt bundle discount is normally 8-12% cheaper than individual sum
  const fairMarketPrice = Math.round(individualSum * 0.92);

  const priceDiff = actualPrice - fairMarketPrice;
  const priceDiffPercent = Math.round((priceDiff / fairMarketPrice) * 100);

  if (priceDiffPercent <= -10) {
    return {
      grade: "S",
      gradeTitle: "EFSANE KELEPİR",
      gradeColor: "#10b981",
      fairMarketPrice,
      priceDiff,
      priceDiffPercent,
      verdict: "kelepir",
      headline: `🔥 %${Math.abs(priceDiffPercent)} KELEPİR! Piyasa ortalamasından ${Math.abs(priceDiff).toLocaleString("tr-TR")} TL daha ucuz!`,
      summaryExplanation: `Bu sistem piyasa rayicinin çok altında satılıyor. Parçaları tek tek toplamaya kalksanız dahi ${individualSum.toLocaleString("tr-TR")} TL harcarsınız. Bütçeniz varsa kaçırmadan direkt yapışın!`,
      detailedPoints: [
        `Piyasa ortalama hazır kasa değeri: ${fairMarketPrice.toLocaleString("tr-TR")} TL`,
        `Parçaları tek tek toplama maliyeti: ${individualSum.toLocaleString("tr-TR")} TL`,
        `Kârınız: ${Math.abs(priceDiff).toLocaleString("tr-TR")} TL cebinizde kalıyor!`,
        `Ekran kartı ve işlemci dengesi f/p açısından mükemmel seviyede.`
      ]
    };
  }

  if (priceDiffPercent <= -2) {
    return {
      grade: "A",
      gradeTitle: "FİYAT / PERFORMANS",
      gradeColor: "#06b6d4",
      fairMarketPrice,
      priceDiff,
      priceDiffPercent,
      verdict: "fiyat_performans",
      headline: `⚡ GAYET İYİ F/P! Piyasa fiyatının %${Math.abs(priceDiffPercent)} altında.`,
      summaryExplanation: `Fiyatı gayet makul ve dürüst fiyatlandırılmış bir hazır sistem. Kazıklanma riski yok, parçaların uyumu tatmin edici.`,
      detailedPoints: [
        `Piyasa dengi ortalama: ${fairMarketPrice.toLocaleString("tr-TR")} TL`,
        `Fiyat parçaların kalitesini tam olarak karşılıyor.`,
        `Benzer bütçede daha yüksek bir ekran kartı bulmak çok zor.`
      ]
    };
  }

  if (priceDiffPercent <= 8) {
    return {
      grade: "B",
      gradeTitle: "PİYASA STANDARDI",
      gradeColor: "#eab308",
      fairMarketPrice,
      priceDiff,
      priceDiffPercent,
      verdict: "piyasa",
      headline: `⚖️ NORMAL PİYASA FİYATI. Ne kelepir ne de kazık.`,
      summaryExplanation: `Sistem tam olarak piyasa ederinde fiyatlanmış. Acil ihtiyacınız varsa alınabilir ancak KasaRadar'da kampanyalı günleri beklerseniz 1.500 - 2.500 TL daha ucuza benzer kasa yakalayabilirsiniz.`,
      detailedPoints: [
        `Piyasa adil değeri: ${fairMarketPrice.toLocaleString("tr-TR")} TL`,
        `Kazık değil ama indirim de sayılmaz.`,
        `KasaRadar indirimlerini takip ederek daha iyi kampanya beklenebilir.`
      ]
    };
  }

  if (priceDiffPercent <= 20) {
    return {
      grade: "C",
      gradeTitle: "PAHALI / ZORLAMA",
      gradeColor: "#f97316",
      fairMarketPrice,
      priceDiff,
      priceDiffPercent,
      verdict: "pahali",
      headline: `⚠️ DİKKAT: %${priceDiffPercent} PAHALI! Yaklaşık ${priceDiff.toLocaleString("tr-TR")} TL fazla ödüyorsunuz.`,
      summaryExplanation: `Bu sisteme bu fiyatı vermek pek mantıklı değil. Parçaların gerçek ederi ${fairMarketPrice.toLocaleString("tr-TR")} TL civarındayken gereksiz yere ${priceDiff.toLocaleString("tr-TR")} TL fazla ödüyorsunuz.`,
      detailedPoints: [
        `Piyasa gerçek ederi: ${fairMarketPrice.toLocaleString("tr-TR")} TL`,
        `Bu bütçeye KasaRadar'da 1 üst segment ekran kartı veya 32GB RAM'li sistem bulunabilir.`,
        `Bu fiyata hemen almayın, alternatif mağazalara bakın.`
      ]
    };
  }

  return {
    grade: "F",
    gradeTitle: "🚨 AŞIRI KAZIK!",
    gradeColor: "#ef4444",
    fairMarketPrice,
    priceDiff,
    priceDiffPercent,
    verdict: "asiri_kazik",
    headline: `🚨 AŞIRI KAZIK! Paranızı çöpe atmayın! Tam ${priceDiff.toLocaleString("tr-TR")} TL fazla isteniyor!`,
    summaryExplanation: `BU SİSTEMDEN UZAK DURUN! Satıcı piyasanın %${priceDiffPercent} üzerinde aşırı şişirilmiş bir fiyat talep ediyor. Bu paraya KasaRadar'da en az bir üst ekran kartına sahip (örn. RTX 4060 yerine RTX 4070 SUPER) çok daha güçlü sistemler var!`,
    detailedPoints: [
      `Bu sistemin adil piyasa değeri: Sadece ${fairMarketPrice.toLocaleString("tr-TR")} TL!`,
      `Boşa gidecek paranız: Tam ${priceDiff.toLocaleString("tr-TR")} TL!`,
      `Bu paraya 32GB DDR5 RAM ve kat kat daha yüksek FPS veren kasalar alınabilir.`,
      `KasaRadar'daki alternatif kasalara bakın, paranızı heba etmeyin.`
    ]
  };
}
