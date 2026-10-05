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
  ExternalLink,
  PlusCircle,
  Clock
} from "lucide-react";

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
            <span>Sponsorluk &amp; Reklam Rezervasyonu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sponsorluk &amp; Reklam Alanı
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Bu bölüm hazır sistem mağazaları, e-ticaret siteleri ve donanım distribütörleri için ayrılmıştır. Markanızı her gün binlerce bilinçli oyuncuya ulaştırmak için ilk sponsor olarak yerinizi ayırtın.
          </p>
        </div>

        {/* 22+ Monitored Stores & Verified Partners Showcase */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                KasaRadar Canlı Taranan Mağazalar (22+ Büyük Mağaza Ağı)
              </span>
              <p className="text-xs text-neutral-400 mt-0.5">
                Yapay zeka botumuz Türkiye&apos;nin en güvenilir donanım ve hazır sistem satıcılarını 7/24 tarar, fiyat düşüşlerini anlık yakalar.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full shrink-0 w-fit">
              22 Mağaza Aktif Takipte
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: "İtopya", tag: "Resmi Donanım Devi", rating: "4.9/5", color: "#f97316", count: "35+ Kasa" },
              { name: "Gaming.Gen.TR", tag: "F/P Şampiyonu", rating: "4.9/5", color: "#10b981", count: "42+ Kasa" },
              { name: "Vatan PC", tag: "Yaygın Servis Ağı", rating: "4.8/5", color: "#0284c7", count: "28+ OEM" },
              { name: "GameGaraj", tag: "Özelleştirilebilir PC", rating: "4.8/5", color: "#ef4444", count: "50+ Kasa" },
              { name: "Tebilon", tag: "Hızlı Kargo & Güven", rating: "4.9/5", color: "#3b82f6", count: "24+ Kasa" },
              { name: "İncehesap", tag: "Gaming Gecesi", rating: "4.8/5", color: "#a855f7", count: "30+ Kasa" },
              { name: "Sinerji PC", tag: "High-End Sistemler", rating: "4.8/5", color: "#f59e0b", count: "25+ Kasa" },
              { name: "Teknobiyotik", tag: "AMD & Soğutma", rating: "4.7/5", color: "#64748b", count: "20+ Kasa" },
              { name: "Gençer Gaming", tag: "Kelepir Fırsat Radarı", rating: "4.8/5", color: "#22c55e", count: "18+ Kasa" },
              { name: "Pckolik", tag: "Espor & Gamer Serisi", rating: "4.8/5", color: "#8b5cf6", count: "22+ Kasa" },
              { name: "QP Bilişim", tag: "Özel Tasarım Canavarlar", rating: "4.9/5", color: "#dc2626", count: "16+ Kasa" },
              { name: "Inventus", tag: "24h Stres Testli", rating: "4.9/5", color: "#2563eb", count: "14+ Kasa" },
              { name: "Molekül PC", tag: "AM5 & DDR5 Uzmanı", rating: "4.8/5", color: "#06b6d4", count: "15+ Kasa" },
              { name: "Novabilgisayar", tag: "Ekstrem İş İstasyonu", rating: "4.8/5", color: "#eab308", count: "18+ Kasa" },
              { name: "DFS Bilgisayar", tag: "Bütçe Dostu F/P", rating: "4.7/5", color: "#14b8a6", count: "12+ Kasa" },
              { name: "Adeks Store", tag: "Espor Kulüp Donanımı", rating: "4.9/5", color: "#f43f5e", count: "15+ Kasa" },
              { name: "Amazon TR", tag: "Prime Hızlı Teslimat", rating: "5.0/5", color: "#facc15", count: "100+ Parça" },
              { name: "Hepsiburada", tag: "Resmi Mağaza Garantisi", rating: "4.9/5", color: "#ea580c", count: "80+ Parça" },
              { name: "Trendyol", tag: "Geniş Ekipman Kataloğu", rating: "4.8/5", color: "#f97316", count: "70+ Parça" },
              { name: "Mediamarkt", tag: "Mağazadan Anında Teslim", rating: "4.7/5", color: "#dc2626", count: "20+ PC" },
              { name: "Teknosa", tag: "Kurumsal Güvence", rating: "4.7/5", color: "#f59e0b", count: "18+ PC" },
              { name: "N11", tag: "Doğrulanmış Satıcılar", rating: "4.7/5", color: "#7c3aed", count: "50+ Parça" }
            ].map((store, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-900 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: store.color }}></span>
                    <span className="text-[10px] font-mono text-neutral-500">{store.rating}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {store.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 truncate mt-0.5">{store.tag}</p>
                </div>
                <div className="pt-2 mt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400 font-semibold">{store.count}</span>
                  <span className="text-neutral-500">Canlı</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reserved Sponsor Slots (Ayrılmış Boş Sponsorluk Alanları) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Ayrılmış Sponsorluk Yuvaları (Rezervasyona Açık)
            </span>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              3 Yuva Boş • İlk Başvuran Yer Alır
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Slot 1: Haftanın Sponsor Kasası */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border-2 border-dashed border-neutral-700 hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-4 group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  BOŞ • REZERVASYONA AÇIK
                </span>
                <span className="text-xs font-mono text-neutral-500">YUVA #1</span>
              </div>

              <div className="space-y-2 py-2">
                <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-base group-hover:text-emerald-400 transition-colors">
                  Haftanın Sponsor Kasası
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Bu alan anlaşma sağlandığında ilgili mağazanın hazır sistemiyle doldurulacaktır. Ana sayfanın en üstünde sabit altın rozetli vitrin hakkı.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-500 text-[11px]">Günde 25.000+ Oyuncu</span>
                <button
                  onClick={() => {
                    setSelectedPackage("haftanin-kasasi");
                    document.getElementById("sponsor-application-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950 font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Sponsor Ol</span>
                </button>
              </div>
            </div>

            {/* Slot 2: Telegram & Flaş Bildirim */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border-2 border-dashed border-neutral-700 hover:border-cyan-500/60 transition-all flex flex-col justify-between space-y-4 group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  BOŞ • REZERVASYONA AÇIK
                </span>
                <span className="text-xs font-mono text-neutral-500">YUVA #2</span>
              </div>

              <div className="space-y-2 py-2">
                <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <BellRing className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-base group-hover:text-cyan-400 transition-colors">
                  Telegram &amp; Flaş Alarm Bildirimi
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Kampanyalı sistem stoğunuz veya indirim kuponunuz Telegram kanalımızdaki binlerce aktif donanım takipçisine anlık push mesaj olarak ulaştırılır.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-500 text-[11px]">Anlık Push &amp; E-Posta</span>
                <button
                  onClick={() => {
                    setSelectedPackage("telegram-flas");
                    document.getElementById("sponsor-application-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-neutral-950 font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Sponsor Ol</span>
                </button>
              </div>
            </div>

            {/* Slot 3: Benchmark & Espor Sponsoru */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border-2 border-dashed border-neutral-700 hover:border-amber-500/60 transition-all flex flex-col justify-between space-y-4 group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  BOŞ • REZERVASYONA AÇIK
                </span>
                <span className="text-xs font-mono text-neutral-500">YUVA #3</span>
              </div>

              <div className="space-y-2 py-2">
                <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-base group-hover:text-amber-400 transition-colors">
                  FPS Benchmark &amp; Donanım Sponsoru
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  25 popüler oyunda FPS simülatöründe ve yayıncı setup modülünde donanımınız &quot;Resmi Test Donanımı&quot; olarak önerilir.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-500 text-[11px]">Resmi Donanım Etiketi</span>
                <button
                  onClick={() => {
                    setSelectedPackage("benchmark-sponsor");
                    document.getElementById("sponsor-application-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Sponsor Ol</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Information Callout */}
        <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3 text-xs text-neutral-300">
          <Clock className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            <strong>Sponsorluk Süreci:</strong> Şu anda sponsorluk alanlarımız açık rezervasyondadır. Yeni marka veya mağaza iş birliği sağlandıkça onaylanan logolar ve resmi ilanlar buraya anlık olarak eklenecektir.
          </span>
        </div>

        {/* Application Form & Direct Producer Card */}
        <div id="sponsor-application-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Sponsorluk &amp; Reklam Rezervasyon Formu
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Boş sponsor yuvalarından birinde yer almak için aşağıdaki bilgileri doldurun. ZYPHERSTUDIO yapımcı ekibi teklifinizi inceleyip dönüş yapacaktır.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Rezervasyon Başvurunuz Alındı!</h4>
                <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Sayın <strong>{contactName || companyName}</strong> yetkilisi, sponsorluk talebiniz <strong className="text-emerald-400">ZYPHERSTUDIO</strong> yapımcı ekibine iletildi.
                  Detaylı medya kiti ve sponsorluk şartları <strong>{email}</strong> adresinize gönderilecektir.
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
                      placeholder="Örn: Gaming.Gen.TR, İtopya, ASUS..."
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
                    İlgilendiğiniz Sponsorluk Alanı
                  </label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="haftanin-kasasi">Yuva #1: Haftanın Sponsor Kasası (Ana Sayfa Vitrin)</option>
                    <option value="telegram-flas">Yuva #2: Telegram &amp; Flaş Alarm Bildirimi</option>
                    <option value="benchmark-sponsor">Yuva #3: FPS Benchmark &amp; Espor Donanım Sponsorluğu</option>
                    <option value="ozel-proje">Özel Sponsorluk &amp; Ortak Kampanya</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Mesaj &amp; Tanıtmak İstediğiniz Sistem / Marka
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Sistemin linki, bütçe veya kampanya detayları hakkında bilgi verin..."
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
                Form doldurmak yerine doğrudan yapımcı ve geliştirici ekibimize e-posta göndererek hızlı teklif ve medya kiti alabilirsiniz.
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
