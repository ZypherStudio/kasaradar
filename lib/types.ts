export interface MonitorRecommendation {
  id: string;
  name: string;
  brand: string;
  sizeInch: string;
  resolution: string;
  refreshRate: string;
  panelType: "Fast IPS" | "OLED" | "VA" | "Mini-LED";
  price: number;
  dealTag?: string;
  imageUrl: string;
  buyUrl: string;
  idealForGpu: string;
}

export interface GamingGear {
  id: string;
  name: string;
  category: "monitor" | "mouse" | "keyboard" | "headset" | "mousepad";
  categoryLabel: string;
  brand: string;
  price: number;
  tag: string;
  specs: string;
  imageUrl: string;
  buyUrl: string;
  proPlayersUsing?: string[];
}

export interface SystemDetailedPart {
  name: string;
  category: "Ekran Kartı" | "İşlemci" | "RAM" | "SSD" | "Anakart" | "Güç Kaynağı" | "Kasa" | "Soğutucu";
  individualNewPrice: number;
  buyUrl: string;
  store: string;
}

export interface PrebuiltSystem {
  id: string;
  title: string;
  seller: string;
  sellerLogo: string;
  sellerColor: string;
  price: number;
  oldPrice?: number;
  installmentsText?: string;
  cpuBrand: "AMD" | "Intel";
  gpuBrand: "Nvidia" | "AMD";
  listedDate: string; // "Bugün", "Dün", "2 saat önce", "3 gün önce"
  cpu: string;
  cpuTier: number; // 1-100 benchmark score
  gpu: string;
  gpuTier: number; // 1-100 benchmark score
  gpuVram: string;
  ram: string;
  ramType: "DDR4" | "DDR5";
  ramSizeGb: number;
  ssd: string;
  ssdSizeGb: number;
  motherboard: string;
  psu: string;
  caseModel: string;
  cooling: string;
  imageUrl: string;
  directUrl: string;
  fpScore: number; // 1.0 - 10.0 calculated score
  individualZeroPrice: number; // If bought piece by piece brand new
  individualSecondHandPrice: number; // If bought piece by piece 2nd hand
  badge?: string;
  highlight: string;
  targetResolution: "1080p Ultra" | "1440p 2K" | "4K Gaming" | "E-Spor 240Hz";
  warranty: string;
  tdpWatts: number; // Expected total power draw under load
  partsBreakdown: SystemDetailedPart[];
  recommendedMonitors?: MonitorRecommendation[];
}

export interface GameRequirement {
  id: string;
  title: string;
  genre: string;
  coverImage: string;
  releaseYear: number;
  description: string;
  minCpuTier: number;
  recCpuTier: number;
  minGpuTier: number;
  recGpuTier: number;
  minRamGb: number;
  recRamGb: number;
  storageGb: number;
  // Performance factors for FPS math
  cpuWeight: number; // 0.0 - 1.0 (How CPU heavy is it)
  gpuWeight: number; // 0.0 - 1.0 (How GPU heavy is it)
  ramWeight: number;
  baseFps1080pLow: number;
}

export interface HardwareComponent {
  id: string;
  name: string;
  type: "gpu" | "cpu" | "ram" | "ssd" | "gear" | "monitor" | string;
  tier: number; // 1-100
  brand: string;
  newPriceAvg: number;
  secondHandAvg: number;
  dealPriceThreshold: number; // Price under this is a steal
  secondHandRisk: "Düşük Risk" | "Orta Risk" | "Yüksek Risk";
  riskReason: string;
  specsSummary: string;
  directBuyUrl: string;
  direct2ndHandUrl: string;
}

export interface StreamerSetup {
  id: string;
  name: string;
  alias: string;
  platform: string;
  avatar: string;
  banner: string;
  description: string;
  primaryGame: string;
  pcSpecs: {
    cpu: string;
    gpu: string;
    ram: string;
    motherboard: string;
    storage: string;
    cooling: string;
  };
  gear: {
    monitor: string;
    mouse: string;
    keyboard: string;
    headset: string;
    microphone: string;
    mousepad: string;
    chair: string;
  };
  closestSystemId: string; // References a PrebuiltSystem
}

export interface DealAlert {
  id: string;
  systemTitle: string;
  seller: string;
  oldPrice: number;
  newPrice: number;
  dropPercentage: number;
  timeAgo: string;
  systemId: string;
}
