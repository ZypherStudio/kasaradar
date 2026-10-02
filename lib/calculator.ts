import { GameRequirement } from "./types";

export type ResolutionPreset = "1080p_low" | "1080p_ultra" | "1440p_high" | "4k_ultra";

export interface FpsCalculationResult {
  avgFps: number;
  lowFps: number; // 1% Low
  bottleneckComponent: "cpu" | "gpu" | "ram" | "balanced";
  bottleneckPercentage: number;
  verdict: {
    status: "legendary" | "esports" | "smooth" | "playable" | "unplayable";
    label: string;
    description: string;
    badgeColor: string;
  };
  recommendedUpgrade: string;
}

export function calculateGameFps(
  game: GameRequirement,
  cpuTier: number,
  gpuTier: number,
  ramGb: number,
  preset: ResolutionPreset
): FpsCalculationResult {
  // Preset scaling factors for resolution and graphical fidelity
  const presetFactors: Record<ResolutionPreset, { cpuMult: number; gpuMult: number; baseMult: number }> = {
    "1080p_low": { cpuMult: 1.1, gpuMult: 0.85, baseMult: 1.0 },
    "1080p_ultra": { cpuMult: 1.0, gpuMult: 1.25, baseMult: 0.65 },
    "1440p_high": { cpuMult: 0.9, gpuMult: 1.55, baseMult: 0.48 },
    "4k_ultra": { cpuMult: 0.75, gpuMult: 2.30, baseMult: 0.28 },
  };

  const factors = presetFactors[preset];

  // Normalized performance ratios relative to recommended specs
  const cpuRatio = Math.min(1.8, Math.max(0.2, (cpuTier / game.recCpuTier) * factors.cpuMult));
  const gpuRatio = Math.min(2.0, Math.max(0.15, (gpuTier / game.recGpuTier) * (1 / (factors.gpuMult * 0.7))));
  
  // Ram penalty if under minimum or recommended
  let ramFactor = 1.0;
  if (ramGb < game.minRamGb) {
    ramFactor = 0.55; // severe stuttering
  } else if (ramGb < game.recRamGb) {
    ramFactor = 0.85;
  } else if (ramGb >= 32) {
    ramFactor = 1.05; // 32GB headroom in modern open-world games
  }

  // Combined score using game-specific weights
  const weightedPerformance = (
    cpuRatio * game.cpuWeight +
    gpuRatio * game.gpuWeight
  ) * ramFactor;

  // Raw predicted FPS
  let avgFps = Math.round(game.baseFps1080pLow * weightedPerformance * factors.baseMult);
  avgFps = Math.max(12, Math.min(600, avgFps));

  // 1% Lows (stability depends on RAM and CPU strength)
  const stability = (cpuRatio * 0.5 + (ramGb >= game.recRamGb ? 0.5 : 0.25));
  const lowFps = Math.max(8, Math.round(avgFps * (0.65 + stability * 0.15)));

  // Bottleneck detection
  let bottleneckComponent: "cpu" | "gpu" | "ram" | "balanced" = "balanced";
  let bottleneckPercentage = 0;

  if (ramGb < game.minRamGb) {
    bottleneckComponent = "ram";
    bottleneckPercentage = 45;
  } else {
    const delta = Math.abs(cpuTier - gpuTier);
    if (cpuTier < gpuTier - 15) {
      bottleneckComponent = "cpu";
      bottleneckPercentage = Math.min(38, Math.round(delta * 0.8));
    } else if (gpuTier < cpuTier - 18) {
      bottleneckComponent = "gpu";
      bottleneckPercentage = Math.min(42, Math.round(delta * 0.75));
    } else {
      bottleneckComponent = "balanced";
      bottleneckPercentage = Math.min(8, Math.round(delta * 0.2));
    }
  }

  // Verdict evaluation
  let verdict: FpsCalculationResult["verdict"];
  if (avgFps >= 200) {
    verdict = {
      status: "legendary",
      label: "E-Spor Canavarı (200+ FPS)",
      description: "240Hz veya 360Hz monitörünüzün hakkını sonuna kadar verir. Sıfır takılma, kusursuz akıcılık.",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
    };
  } else if (avgFps >= 120) {
    verdict = {
      status: "esports",
      label: "Mükemmel Akıcı (120+ FPS)",
      description: "144Hz - 165Hz oyuncu monitörleri için ideal rekabetçi deneyim.",
      badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
    };
  } else if (avgFps >= 60) {
    verdict = {
      status: "smooth",
      label: "Akıcı & Rahat (60+ FPS)",
      description: "Konsol standartlarının üzerinde, hikayeli oyunları keyifle oynatır.",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/40"
    };
  } else if (avgFps >= 35) {
    verdict = {
      status: "playable",
      label: "Oynanabilir (35-60 FPS)",
      description: "Grafik ayarlarını biraz düşürerek veya FSR / DLSS açarak 60 FPS'e ulaşabilirsiniz.",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40"
    };
  } else {
    verdict = {
      status: "unplayable",
      label: "Yetersiz / Kasar (<35 FPS)",
      description: "Bu donanımla bu oyunda akıcı bir deneyim almak çok zordur, donanım yükseltmesi şart.",
      badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/40"
    };
  }

  // Suggest upgrade path
  let recommendedUpgrade = "";
  if (bottleneckComponent === "cpu") {
    recommendedUpgrade = "İşlemciniz ekran kartınızı frenliyor. Ryzen 5 7500F veya Ryzen 7 7800X3D'ye geçmek FPS'inizi doğrudan %25 artırır.";
  } else if (bottleneckComponent === "gpu") {
    recommendedUpgrade = "Ekran kartınız bu çözünürlük için sınırda. RTX 4060 veya RTX 4070 Super gibi bir karta geçiş yapabilirsiniz.";
  } else if (bottleneckComponent === "ram") {
    recommendedUpgrade = "RAM miktarınız oyunun anlık kasmalar (stutter) yaşamasına neden olur. En az 16GB, tercihen 32GB RAM'e yükseltin.";
  } else {
    recommendedUpgrade = "Sisteminiz son derece dengeli çalışıyor! Donanım darboğazı bulunmuyor.";
  }

  return {
    avgFps,
    lowFps,
    bottleneckComponent,
    bottleneckPercentage,
    verdict,
    recommendedUpgrade
  };
}

export function formatTL(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}
