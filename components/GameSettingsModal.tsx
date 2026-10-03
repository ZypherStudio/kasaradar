"use client";

import React, { useState } from "react";
import {
  Gamepad2,
  X,
  Copy,
  Check,
  Zap,
  Sparkles,
  Tv,
  Cpu,
  Monitor,
  Flame,
  Layers,
  Terminal
} from "lucide-react";

interface GameSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGameId?: string;
}

interface ProConfig {
  gameId: string;
  gameTitle: string;
  proPlayer: string;
  resolution: string;
  aspectRatio: string;
  scalingMode: string;
  refreshRate: string;
  launchOptions: string;
  graphicsSettings: { setting: string; value: string; reason: string }[];
  nvidiaSettings: { setting: string; value: string }[];
}

const PRO_PRESETS: ProConfig[] = [
  {
    gameId: "cs2",
    gameTitle: "Counter-Strike 2",
    proPlayer: "s1mple / NiKo Preset",
    resolution: "1280x960",
    aspectRatio: "4:3 Genişletilmiş (Stretched)",
    scalingMode: "Ekran Ölçekleme (GPU / Display)",
    refreshRate: "240Hz / 360Hz",
    launchOptions: "-novid -tickrate 128 -freq 240 +fps_max 0 -high -nojoy +exec autoexec",
    graphicsSettings: [
      { setting: "Gelişmiş Oyuncu Kontrastı", value: "Etkin (Açık)", reason: "Karanlık köşelerdeki düşman modellerini belirginleştirir" },
      { setting: "Model / Doku Detayı", value: "Düşük (Low)", reason: "Maksimum stabil FPS ve sıfır gecikme" },
      { setting: "Parçacık Detayı", value: "Düşük (Low)", reason: "Smoke ve el bombası patlamalarında FPS düşüşünü engeller" },
      { setting: "Evrensel Gölge Kalitesi", value: "Düşük (Low)", reason: "Gereksiz gölge yükünü kaldırır, sadece düşman gölgesini korur" },
      { setting: "Çoklu Örneklemeli Kenar Yumuşatma", value: "2x MSAA", reason: "Piksel tırtıklarını yumuşatır, nişan almayı kolaylaştırır" },
      { setting: "Nvidia Reflex Düşük Gecikme", value: "Etkin + Boost", reason: "Giriş gecikmesini (input lag) 3ms seviyesine çeker" },
      { setting: "FidelityFX Super Resolution (FSR)", value: "Devre Dışı (Kapalı)", reason: "Görüntü netliğini bozmaması için kapalı tutulmalı" }
    ],
    nvidiaSettings: [
      { setting: "Güç Yönetimi Modu", value: "Maksimum Performansı Tercih Et" },
      { setting: "Düşük Gecikme Oranı", value: "Ultra" },
      { setting: "Dikey Eşitleme (V-Sync)", value: "Kapalı" }
    ]
  },
  {
    gameId: "valorant",
    gameTitle: "Valorant",
    proPlayer: "TenZ / cNed Preset",
    resolution: "1920x1080 (FHD)",
    aspectRatio: "16:9 Doğal (Native)",
    scalingMode: "En Boy Oranını Koru",
    refreshRate: "240Hz - 360Hz",
    launchOptions: "-high -USEALLAVAILABLECORES",
    graphicsSettings: [
      { setting: "Materyal Kalitesi", value: "Düşük (Low)", reason: "Maksimum harita görünürlüğü ve yüksek framerate" },
      { setting: "Doku Kalitesi", value: "Düşük (Low)", reason: "VRAM kullanımını minimize eder" },
      { setting: "Ayrıntı Kalitesi", value: "Düşük (Low)", reason: "Gereksiz harita süslemelerini kaldırır" },
      { setting: "Arayüz (UI) Kalitesi", value: "Düşük (Low)", reason: "UI render gecikmesini sıfırlar" },
      { setting: "V-Sync", value: "Kapalı (Off)", reason: "Dikey senkronizasyon girdi gecikmesi yapar" },
      { setting: "Nvidia Reflex", value: "Açık + Takviye (On + Boost)", reason: "GPU gecikmesini en aza indirir" },
      { setting: "Çok İzlekli Görselleştirme", value: "Açık (On)", reason: "Tüm CPU çekirdeklerini tam güçte çalıştırır (ZORUNLU)" },
      { setting: "Saf Girdi Süresi (RawInputBuffer)", value: "Açık (On)", reason: "Mouse sinyalini doğrudan oyuna iletir, sıfır gecikme" }
    ],
    nvidiaSettings: [
      { setting: "Maksimum Kare Hızı", value: "Sınırsız (Off)" },
      { setting: "Doku Süzme - Kalite", value: "Yüksek Performans" },
      { setting: "Kenar Yumuşatma Modu", value: "Kapalı" }
    ]
  },
  {
    gameId: "gta",
    gameTitle: "GTA 5 / GTA 6",
    proPlayer: "Ultra Akıcı Optimizasyon",
    resolution: "1920x1080 veya 2560x1440 (2K)",
    aspectRatio: "16:9",
    scalingMode: "Doğal",
    refreshRate: "144Hz - 180Hz",
    launchOptions: "-dx12 -high -noBenchmark",
    graphicsSettings: [
      { setting: "DirectX Versiyonu", value: "DirectX 11 / 12", reason: "En yüksek kararlılık ve en az çökme" },
      { setting: "Doku Kalitesi (Texture)", value: "Çok Yüksek (Very High)", reason: "VRAM yettiği sürece FPS düşürmez, görüntü harika olur" },
      { setting: "Çim Kalitesi (Grass Quality)", value: "Normal (ZORUNLU)", reason: "Ultra yapıldığında dağlık alanlarda FPS %50 düşer!" },
      { setting: "MSAA", value: "Kapalı (FXAA: Açık)", reason: "MSAA ekran kartını gereksiz boğar; FXAA yeterlidir" },
      { setting: "Gölge Kalitesi", value: "Yüksek (High)", reason: "Yumuşak gölgeler açıkken akıcı görüntü" },
      { setting: "Yansıma Kalitesi", value: "Yüksek (High)", reason: "Araç kaportalarında gerçekçi parlama" }
    ],
    nvidiaSettings: [
      { setting: "Anizotropik Süzme", value: "16x" },
      { setting: "Güç Modu", value: "Normal / Dengeli" }
    ]
  },
  {
    gameId: "apex",
    gameTitle: "Apex Legends & Warzone",
    proPlayer: "Pro Battle Royale Preset",
    resolution: "1920x1080 FHD",
    aspectRatio: "16:9",
    scalingMode: "Full Screen",
    refreshRate: "165Hz - 240Hz",
    launchOptions: "-novid -fullscreen +fps_max 0 -forcenovsync",
    graphicsSettings: [
      { setting: "Görüş Açısı (FOV)", value: "104 - 110", reason: "Geniş çevre görüşü sağlar" },
      { setting: "V-Sync", value: "Devre Dışı", reason: "Hızlı nişan alırken kaymayı önler" },
      { setting: "Uyarlanabilir Çözünürlük", value: "0", reason: "Bulanıklığı engeller" },
      { setting: "Ortam Perdesi (Ambient Occlusion)", value: "Devre Dışı", reason: "Karanlık binaların içini aydınlık gösterir" },
      { setting: "Model Ayrıntısı", value: "Düşük (Low)", reason: "Düşman modellerini çevre çalılarından ayırır" }
    ],
    nvidiaSettings: [
      { setting: "Düşük Gecikme", value: "Ultra" },
      { setting: "Performans Modu", value: "Yüksek Performans" }
    ]
  }
];

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  isOpen,
  onClose,
  initialGameId = "cs2"
}) => {
  const [selectedGameId, setSelectedGameId] = useState<string>(initialGameId);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentConfig = PRO_PRESETS.find((p) => p.gameId === selectedGameId) || PRO_PRESETS[0];

  const handleCopyLaunchOptions = () => {
    navigator.clipboard.writeText(currentConfig.launchOptions);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Espor &amp; FPS Optimizasyon Rehberi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Profesyonel Oyuncu Ayarları &amp; Başlatma Kodları
          </h3>
          <p className="text-xs text-neutral-400">
            En yüksek FPS&apos;i ve sıfır gecikmeyi (input lag) almak için s1mple, TenZ ve espor takımlarının kullandığı resmi oyun içi grafik ayarları.
          </p>
        </div>

        {/* Game Tabs Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PRO_PRESETS.map((preset) => {
            const isSelected = preset.gameId === selectedGameId;
            return (
              <button
                key={preset.gameId}
                onClick={() => setSelectedGameId(preset.gameId)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-emerald-500 text-neutral-950 font-black shadow-md shadow-emerald-500/20"
                    : "bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{preset.gameTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Pro Overview Card */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">Espor Preset:</span>
            <span className="font-bold text-emerald-400">{currentConfig.proPlayer}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">Çözünürlük:</span>
            <span className="font-bold text-white">{currentConfig.resolution}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">En Boy Oranı:</span>
            <span className="font-semibold text-neutral-300">{currentConfig.aspectRatio}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">Hedef Monitör:</span>
            <span className="font-bold text-cyan-400">{currentConfig.refreshRate}</span>
          </div>
        </div>

        {/* Launch Options Code Box (Steam / Başlatma Seçenekleri) */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              Steam / Başlatma Seçenekleri Kodu (Launch Options)
            </span>
            <button
              onClick={handleCopyLaunchOptions}
              className="flex items-center gap-1 text-[11px] font-bold text-neutral-300 hover:text-white px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-all cursor-pointer"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? "Kopyalandı!" : "Kodu Kopyala"}</span>
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-200 select-all overflow-x-auto">
            {currentConfig.launchOptions}
          </div>
          <span className="text-[10px] text-neutral-500 block">
            *Steam &gt; Oyuna Sağ Tık &gt; Özellikler &gt; Başlatma Seçenekleri kutucuğuna yapıştırın.
          </span>
        </div>

        {/* In-Game Detailed Settings Table */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider block">
            Oyun İçi Grafik &amp; Performans Ayarları Tablosu:
          </span>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden text-xs">
            <div className="grid grid-cols-12 p-3 bg-neutral-900 border-b border-neutral-800 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              <div className="col-span-4">Grafik Ayarı</div>
              <div className="col-span-3 text-emerald-400">Önerilen Değer</div>
              <div className="col-span-5">Neden Bu Ayar?</div>
            </div>

            <div className="divide-y divide-neutral-800/80">
              {currentConfig.graphicsSettings.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 p-3 hover:bg-neutral-900/50 transition-colors items-center">
                  <div className="col-span-4 font-bold text-white">{item.setting}</div>
                  <div className="col-span-3 font-bold text-emerald-400">{item.value}</div>
                  <div className="col-span-5 text-neutral-400 text-[11px]">{item.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nvidia Denetim Masası İpuçları */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
          <span className="font-bold text-white flex items-center gap-1.5 uppercase text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Nvidia Denetim Masası 3D Ayarları:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentConfig.nvidiaSettings.map((n, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">{n.setting}:</span>
                <span className="font-bold text-cyan-300">{n.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
