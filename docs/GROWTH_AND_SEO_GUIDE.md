# 🚀 KasaRadar Büyüme, SEO & Sponsorluk Rehberi

Bu rehber, KasaRadar'ın arama motorlarında (Google, Bing, Yandex), yapay zeka araçlarında (ChatGPT, Copilot, Perplexity) ve teknoloji dizinlerinde üst sıralara çıkması için hazırlandı.

---

## 1. Alternatif Arama Motorları (Hızlı İndeks & Ekstra Trafik)

### A. Bing Webmaster Tools (Yahoo, DuckDuckGo & Microsoft Copilot)
* **Adres:** [bing.com/webmasters](https://www.bing.com/webmasters)
* **En Hızlı Kurulum (2 Dakika):**
  1. Bing Webmaster Tools'a Google hesabınla giriş yap.
  2. "Google Search Console'dan İçe Aktar (Import)" butonuna bas.
  3. Tüm site ayarları ve doğrulamalar otomatik olarak Bing'e geçer.
* **Kazanım:** Siten doğrudan **Microsoft Copilot**, **Yahoo** ve **DuckDuckGo**'da indekslenir.

### B. IndexNow Protokolü (Anında İndeksleme)
KasaRadar için IndexNow protokolü aktif edildi:
* **Anahtar Dosyası:** `https://kasaradar.com/kasaradar-indexnow-key.txt`
* **Otomatik Tetikleme Uç Noktası:** `https://kasaradar.com/api/indexnow`
* Yeni bir kasa veya indirim paylaştığında `/api/indexnow` rotasını ziyaret ederek Bing ve Yandex'i saniyeler içinde anında haberdar edebilirsin.

### C. Yandex Webmaster (Türkiye Trafiği İçin)
* **Adres:** [webmaster.yandex.com](https://webmaster.yandex.com)
* Site haritası ekle: `https://kasaradar.com/sitemap.xml`

---

## 2. Microsoft Clarity (Canlı Ziyaretçi Video İzleme & Isı Haritası)
KasaRadar'ın kodlarına Microsoft Clarity scripti entegre edildi (`app/layout.tsx`).
* **Nasıl Aktif Edilir?**
  1. [clarity.microsoft.com](https://clarity.microsoft.com) adresine git ve ücretsiz proje oluştur.
  2. Proje ID'ni al (örn: `abc123xyz`).
  3. `.env.local` dosyasına şunu ekle:
     ```env
     NEXT_PUBLIC_CLARITY_ID="senin_proje_id"
     ```
* **Kazanım:** Sitedeki ziyaretçilerin mouse hareketlerini, nerelere tıkladıklarını ve nereden çıktıklarını canlı video gibi izleyebilirsin.

---

## 3. Yapay Zeka & Araç Dizinleri (Hazır Kopyala-Yapıştır Tanıtımlar)

### A. AlternativeTo (En Yüksek Organik Dönüşüm)
* **Adres:** [alternativeto.net](https://alternativeto.net) -> "Submit an application"
* **Uygulama Adı:** KasaRadar
* **URL:** `https://kasaradar.com`
* **Kısa Açıklama:** Türkiye'nin ilk yapay zeka destekli hazır sistem ve donanım fiyat/performans borsası.
* **Alternatif Olduğu Siteler:** `Akakçe`, `Cimri`, `PCPartPicker`, `UserBenchmark`, `Epey`
* **Etiketler (Tags):** `PC Building`, `Price Comparison`, `Hardware`, `Gaming PC`, `Hardware Benchmarks`

### B. Product Hunt Lansmanı
* **Adres:** [producthunt.com](https://www.producthunt.com)
* **Tagline:** The AI-Powered Gaming PC & Hardware Price Radar
* **Description:** KasaRadar tracks 22+ Turkish PC hardware retailers (Itopya, GamingGen, GameGaraj, etc.) 24/7 to find the highest value-for-money prebuilt gaming rigs, detect overpriced scams, and alert users via Telegram.

### C. SaaSHub & Uneed
* **SaaSHub:** [saashub.com/submit](https://www.saashub.com/submit)
* **Uneed:** [uneed.best/submit](https://www.uneed.best/submit)
* Kaliteli backlink sağlayarak Google aramalarında KasaRadar'ı üst sıraya taşır.
