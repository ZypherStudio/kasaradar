import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kasaradar.com"),
  title: "KasaRadar | Hazır Sistem & Donanım İndirim Radarı (16+ Mağaza)",
  description: "İtopya, GamingGen, Tebilon, Sinerji, İncehesap ve Vatan hazır sistemlerini tek ekranda karşılaştırın. Fiyatı düşen kelepir kasaları anlık yakalayın.",
  keywords: [
    "hazır sistem",
    "oyuncu bilgisayarı",
    "gaming pc",
    "itopya hazır sistem",
    "gaming gen hazır kasa",
    "tebilon",
    "sinerji bilgisayar",
    "rtx 4060 sistem",
    "rtx 4070 super",
    "en ucuz hazır kasa",
    "fiyat performans pc",
    "donanım radarı",
    "kasaradar"
  ],
  authors: [{ name: "ZYPHERSTUDIO" }],
  creator: "ZYPHERSTUDIO",
  publisher: "KasaRadar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "KasaRadar | Hazır Sistem & Donanım İndirim Radarı",
    description: "16+ Mağazayı tarayan yapay zeka destekli Türkiye'nin en gelişmiş hazır kasa karşılaştırma ve indirim takip platformu.",
    siteName: "KasaRadar",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/kasaradar_telegram_neon_text.jpg",
        width: 1200,
        height: 630,
        alt: "KasaRadar Hazır Sistem & Donanım Radarı",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KasaRadar | Hazır Sistem & Donanım Radarı",
    description: "16+ Mağazayı tarayan yapay zeka destekli Türkiye'nin en gelişmiş hazır kasa karşılaştırma ve indirim takip platformu.",
    images: ["/kasaradar_telegram_neon_text.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">{children}</body>
    </html>
  );
}
