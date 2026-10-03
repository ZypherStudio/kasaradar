"use client";

import React, { useState } from "react";
import {
  Award,
  Sparkles,
  Send,
  Mail,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Zap,
  Building2,
  BellRing,
  ExternalLink
} from "lucide-react";

interface BrandPartner {
  name: string;
  category: string;
  tagline: string;
  color: string;
  badge: string;
}

const BRAND_PARTNERS: BrandPartner[] = [
  { name: "ASUS ROG", category: "Anakart & Ekran Kartı", tagline: "For Those Who Dare", color: "#ef4444", badge: "Global Partner" },
  { name: "MSI", category: "Ekran Kartı & Monitör", tagline: "True Gaming", color: "#dc2626", badge: "Resmi Donanım" },
  { name: "Gigabyte AORUS", category: "Donanım & Kasa", tagline: "Team Up. Fight On.", color: "#f97316", badge: "Espor Sponsoru" },
  { name: "Sapphire Tech", category: "Radeon Ekran Kartları", tagline: "Pure Gaming Performance", color: "#0ea5e9", badge: "F/P Partneri" },
  { name: "Kingston FURY", category: "RAM & Gen5 NVMe", tagline: "Unleash the Power", color: "#e11d48", badge: "Yüksek Hız" },
  { name: "Corsair", category: "Kasa, PSU & Sıvı Soğutma", tagline: "Born to Game", color: "#eab308", badge: "Elit Donanım" },
  { name: "DeepCool", category: "İşlemci Soğutma", tagline: "Keep It Cool", color: "#10b981", badge: "F/P Soğutma" },
  { name: "ZOTAC Gaming", category: "GeForce RTX Serisi", tagline: "Live to Game", color: "#06b6d4", badge: "RTX Partneri" },
  { name: "Thermaltake", category: "Kasa & Güç Kaynağı", tagline: "Coolall Your Life", color: "#6366f1", badge: "Tier-A PSU" },
  { name: "Cooler Master", category: "Termal Çözümler", tagline: "Make It Yours", color: "#a855f7", badge: "Sıvı Soğutma" },
  { name: "Razer", category: "Espor Ekipmanları", tagline: "For Gamers. By Gamers.", color: "#22c55e", badge: "Espor Partneri" },
  { name: "SteelSeries", category: "Klavye, Kulaklık & Mouse", tagline: "For Glory", color: "#fb923c", badge: "Resmi Ekipman" },
];

export const SponsorsSection: React.FC = () => {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("haftanin-kasasi");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email) return;
    setSubmitted(true);
  };

  return (
    <section className="py-12 border-t border-neutral-800/80 bg-neutral-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Marka &amp; Mağaza Sponsorlukları</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Donanım Ekosistemi &amp; Sponsorluk Ortakları
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Türkiye&apos;nin en aktif hazır sistem ve donanım radarı KasaRadar&apos;da ürünlerinizi günde on binlerce bilinçli oyuncuya doğrudan sergileyin.
          </p>
        </div>

        {/* Brand Grid Showcase */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Taranan Donanım Markaları &amp; Global Ekosistem
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              12+ Resmi Üretici Marka
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {BRAND_PARTNERS.map((brand) => (
              <div
                key={brand.name}
                className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all group flex flex-col justify-between space-y-2 hover:bg-neutral-900"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                    style={{ backgroundColor: `${brand.color}20`, color: brand.color }}
                  >
                    {brand.badge}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.color }} />
                </div>

                <div>
                  <div className="font-extrabold text-white text-xs group-hover:text-emerald-400 transition-colors truncate">
                    {brand.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate">
                    {brand.category}
                  </div>
                </div>

                <div className="text-[9px] text-neutral-500 font-mono italic truncate border-t border-neutral-800/80 pt-1.5">
                  &quot;{brand.tagline}&quot;
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Strategic Sponsorship Packages */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Sponsorluk &amp; Reklam Modelleri
            </span>
            <p className="text-xs text-neutral-400 mt-0.5">
              Hazır sistem mağazaları ve donanım distribütörleri için yüksek dönüşümlü vitrinler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Paket 1 */}
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-emerald-500/40 relative flex flex-col justify-between space-y-4 shadow-xl shadow-emerald-500/5">
              <div className="absolute top-4 right-4">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase">
                  En Popüler
                </span>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Haftanın Sponsor Kasası</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Hazır sisteminiz ana sayfanın en üstünde &quot;Sponsorlu Vitrin&quot; etiketiyle sabitlenir. Günde 25.000+ görüntüleme ve doğrudan satın alım linki.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>En üst sırada sabit sistem kartı</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Doğrudan mağaza sepeti affiliate linki</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Özel &quot;F/P Sponsor&quot; altın rozeti</span>
                </li>
              </ul>

              <button
                onClick={() => {
                  setSelectedPackage("haftanin-kasasi");
                  const formEl = document.getElementById("sponsor-application-form");
                  formEl?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs transition-all cursor-pointer"
              >
                Bu Paketi Seç &amp; Başvur
              </button>
            </div>

            {/* Paket 2 */}
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <BellRing className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Telegram &amp; Flaş Alarm</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  İndirimli kasanız veya yeni stok açılışınız Telegram kanalımızdaki 45.000+ aktif donanım avcısına push bildirim olarak anında gönderilir.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Fiyat Alarmı e-posta &amp; Telegram bülteni</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Stok bitene kadar anlık takip</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Özel indirim kuponu tanımlama desteği</span>
                </li>
              </ul>

              <button
                onClick={() => {
                  setSelectedPackage("telegram-flas");
                  const formEl = document.getElementById("sponsor-application-form");
                  formEl?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-cyan-500/30 font-bold text-xs transition-all cursor-pointer"
              >
                Bu Paketi Seç &amp; Başvur
              </button>
            </div>

            {/* Paket 3 */}
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Benchmark &amp; Espor Sponsorluğu</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  FPS Test Motorunda 25+ oyunda ekran kartı veya donanımınız &quot;Resmi Test Donanımı&quot; olarak önerilir. Yayıncı setup sayfalarında vitrin hakkı.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>FPS simülasyonunda resmi donanım etiketi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Yayıncı Setup modülünde &quot;Önerilen Parça&quot; rozeti</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Aylık detaylı tıklama &amp; dönüşüm analizi</span>
                </li>
              </ul>

              <button
                onClick={() => {
                  setSelectedPackage("benchmark-sponsor");
                  const formEl = document.getElementById("sponsor-application-form");
                  formEl?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 font-bold text-xs transition-all cursor-pointer"
              >
                Bu Paketi Seç &amp; Başvur
              </button>
            </div>
          </div>
        </div>

        {/* Application Form & Direct Producer Card */}
        <div id="sponsor-application-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Sponsorluk &amp; İş Birliği Başvuru Formu
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Aşağıdaki formu doldurarak teklifinizi iletin. ZYPHERSTUDIO ekibi en geç 2 saat içinde dönüş yapacaktır.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Başvurunuz Başarıyla Alındı!</h4>
                <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Sayın <strong>{contactName || companyName}</strong> yetkilisi, sponsorluk talebiniz <strong className="text-emerald-400">ZYPHERSTUDIO</strong> yapımcı ekibine iletildi.
                  Detaylı medya kiti ve fiyatlandırma teklifi <strong>{email}</strong> adresinize gönderilecektir.
                </p>
                <div className="pt-2 text-[11px] text-neutral-400 font-mono">
                  İletişim: <span className="text-cyan-400 font-semibold">zypherstudio@gmail.com</span>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-white cursor-pointer"
                >
                  Yeni Başvuru Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Marka / Mağaza Adı *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Örn: Gaming.Gen.TR, ASUS, İtopya..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Yetkili Adı Soyadı
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Örn: Ahmet Yılmaz"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Kurumsal E-Posta *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pazarlama@marka.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Telefon / Telegram (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05XX XXX XX XX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    İlgilendiğiniz Sponsorluk Paketi
                  </label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="haftanin-kasasi">Haftanın Sponsor Kasası (Ana Sayfa Vitrin)</option>
                    <option value="telegram-flas">Telegram &amp; Flaş Alarm Bildirimi</option>
                    <option value="benchmark-sponsor">Benchmark &amp; Espor Donanım Sponsorluğu</option>
                    <option value="ozel-proje">Özel İş Birliği / Ortak Kampanya</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Mesaj &amp; Tanıtmak İstediğiniz Sistem / Donanım
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Sistemin linki, bütçe veya hedeflenen kampanya süresi hakkında bilgi verin..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Sponsorluk Teklifi Gönder</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Producer & Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-xl">
                  Z
                </div>
                <div>
                  <div className="text-sm font-black text-white flex items-center gap-2">
                    <span>ZYPHERSTUDIO</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-emerald-400 text-xs uppercase tracking-wider font-bold">YAPIMCI</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    KasaRadar Resmi Geliştirici &amp; Yapımcı
                  </p>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                Form doldurmak yerine doğrudan yapımcı ve geliştirici ekibimize e-posta göndererek hızlı teklif alabilirsiniz.
              </p>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2">
                <div className="text-[11px] text-neutral-400 uppercase font-semibold">
                  Doğrudan Yapımcı E-Postası:
                </div>
                <div className="text-sm font-bold text-white flex items-center justify-between">
                  <a
                    href="mailto:zypherstudio@gmail.com"
                    className="text-cyan-400 hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4" />
                    <span>zypherstudio@gmail.com</span>
                  </a>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                    Aktif
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Resmi faturalı ve kurumsal sözleşmeli sponsorluk</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Gerçek zamanlı tıklama &amp; dönüşüm raporlaması</span>
                </div>
              </div>

              <a
                href="mailto:zypherstudio@gmail.com?subject=KasaRadar%20Sponsorluk%20Görüşmesi"
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Doğrudan E-Posta Yaz</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
