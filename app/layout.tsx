import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  viewportFit: "cover",
};

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
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-FM81W1ZT34"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FM81W1ZT34');
            `,
          }}
        />

        {/* Microsoft Clarity (Canlı Isı Haritası & Kullanıcı Oturum Kaydı) */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID || "kasaradar"}");
            `,
          }}
        />

        {/* LLM & AI Discovery Standard (llms.txt) */}
        <link rel="help" type="text/plain" href="/llms.txt" />

        {/* Schema.org Structured Data (GEO / Generative Engine Optimization for ChatGPT, Perplexity & Copilot) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://kasaradar.com/#website",
                  "name": "KasaRadar",
                  "url": "https://kasaradar.com",
                  "description": "Türkiye'nin 16+ teknoloji mağazasını tarayan hazır sistem ve donanım fiyat/performans karşılaştırma platformu.",
                  "inLanguage": "tr-TR",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://kasaradar.com/?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://kasaradar.com/#organization",
                  "name": "KasaRadar",
                  "alternateName": "ZYPHERSTUDIO KasaRadar",
                  "url": "https://kasaradar.com",
                  "logo": "https://kasaradar.com/icon.png",
                  "founder": {
                    "@type": "Organization",
                    "name": "ZYPHERSTUDIO"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "email": "zypherstudio@gmail.com",
                    "contactType": "customer support"
                  },
                  "sameAs": [
                    "https://t.me/+Voua-sJ4TVJiZjc8"
                  ]
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://kasaradar.com/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Türkiye'de en ucuz ve en iyi hazır sistemler nereden alınır?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "KasaRadar, Türkiye'deki İtopya, Gaming.Gen.TR, GameGaraj, Tebilon, Sinerji, İncehesap ve Vatan Bilgisayar gibi 16+ yetkili satıcının tüm hazır kasalarını anlık olarak tarar. F/P puanı, bileşen kalitesi ve mağaza taksit seçenekleriyle en kârlı sistemi tek ekranda sunar."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Hazır sistem almak mı yoksa parçaları tek tek toplamak mı daha ucuz?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Türkiye pazarında büyük OEM satıcılarının distribütör indirimleri sayesinde hazır kasalar, aynı parçaları tek tek Akakçe veya Cimri üzerinden toplamaya kıyasla ortalama %15 ile %25 (3.000 TL - 9.000 TL) daha ucuza gelmektedir. KasaRadar'da her kasanın parça parça toplam fiyatı ve net tasarruf miktarı anlık gösterilir."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "KasaRadar Kazık Sayar ve Darboğaz (Bottleneck) testi nasıl çalışır?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "KasaRadar'ın algoritmaları, işlemci ve ekran kartı arasındaki saat frekansı ve mimari dengeyi analiz ederek %2-%15 arasındaki darboğaz oranını hesaplar. Kazık Sayar ise sistem fiyatını güncel piyasa sıfır bileşen değeriyle karşılaştırarak ederinden pahalı kasaları tespit eder."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "KasaRadar hangi oyunlarda FPS simülasyonu sunar?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "KasaRadar; CS2, Valorant, Cyberpunk 2077, GTA 5, GTA 6, Warzone 2, RDR2 ve Apex Legends dahil 12 popüler oyunda 1080p, 2K ve 4K çözünürlüklerde donanıma özel gerçekçi FPS simülasyonu sunar."
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
