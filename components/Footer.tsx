"use client";

import React from "react";
import { Logo } from "./Logo";
import { ShieldCheck, Heart, Mail, ExternalLink, Cpu, Terminal, Send, ShieldAlert } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 pt-12 pb-8 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-2">
            <Logo size="md" />
            <p className="text-neutral-400 text-xs max-w-md leading-relaxed">
              KasaRadar, Türkiye&apos;deki tüm hazır oyuncu kasalarını, sıfır ve 2. el donanım piyasasını anlık tarayan bağımsız teknoloji radarıdır. Oyuncuların kazıklanmadan en yüksek F/P sistemlere ulaşmasını sağlamak amacıyla geliştirilmiştir.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Algoritmik ve tarafsız donanım analizi • Python &amp; Node.js veri motoru.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <span className="text-white font-bold text-xs uppercase tracking-wider block">
              Modüller
            </span>
            <ul className="space-y-1.5 text-neutral-400">
              <li>Hazır Sistem &amp; F/P Karşılaştırma</li>
              <li>FPS &amp; &quot;Kaldırır Mı?&quot; Test Motoru</li>
              <li>Gaming Monitör Radarı</li>
              <li>Elraenn, wtcN &amp; Esporcu Setup&apos;ları</li>
              <li>Sıfır vs 2. El Donanım Borsası</li>
              <li>Fırsat Radarı &amp; Canlı İndirim Alarmları</li>
            </ul>
          </div>

          {/* Supported Retailers */}
          <div className="space-y-2">
            <span className="text-white font-bold text-xs uppercase tracking-wider block">
              Taranan 22+ Büyük Mağaza
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">İtopya</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Gaming.Gen.TR</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">GameGaraj</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Vatan Bilgisayar</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Tebilon</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">İncehesap</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Sinerji</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Teknobiyotik</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Gençer Gaming</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Pckolik</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">QP Bilişim</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Inventus</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Molekül PC</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Novabilgisayar</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">DFS Bilgisayar</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Adeks Store</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Amazon TR</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Hepsiburada</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Trendyol</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Mediamarkt</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Teknosa</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">N11</span>
            </div>
          </div>
        </div>

        {/* Developer & Producer Banner (ZYPHERSTUDIO & YAPIMCI) */}
        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-black text-sm tracking-wide flex items-center gap-2">
                <span>ZYPHERSTUDIO</span>
                <span className="text-neutral-600">•</span>
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">YAPIMCI</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Geliştirici İletişim &amp; İş Birlikleri:{" "}
                <a
                  href="mailto:zypherstudio@gmail.com"
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  zypherstudio@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href="https://t.me/+Voua-sJ4TVJiZjc8"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-neutral-950 font-bold flex items-center gap-1.5 border border-sky-500/30 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Kanalı</span>
            </a>

            <a
              href="mailto:zypherstudio@gmail.com"
              className="py-1.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold flex items-center gap-1.5 border border-neutral-700 transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>E-Posta Gönder</span>
            </a>
          </div>
        </div>

        {/* Legal Disclaimer / Yasal Sorumluluk Reddi Beyanı */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400 space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Yasal Bilgilendirme &amp; Sorumluluk Reddi Beyanı</span>
          </div>
          <p>
            <strong className="text-neutral-200">KasaRadar bir e-ticaret platformu, pazaryeri veya doğrudan ürün satıcısı DEĞİLDİR.</strong> KasaRadar, Türkiye&apos;deki donanım mağazalarının (İtopya, Gaming.Gen.TR, GameGaraj, Tebilon, Sinerji, Vatan vb.) ve ilan platformlarının halka açık verilerini tarafsız algoritmalarla derleyerek tüketicilere fiyat karşılaştırması ve F/P ekspertizi sunan bağımsız bir araştırma aracıdır.
          </p>
          <p className="text-neutral-500">
            Platformda listelenen tüm hazır sistemlerin ve donanımların satışı, stok takibi, faturalandırılması, kargolanması, garanti ve iade süreçleri doğrudan ilgili satıcı mağazanın sorumluluğundadır. KasaRadar üzerinden yönlendirilen sitelerdeki olası anlık fiyat, stok veya donanım revizyonu değişikliklerinden KasaRadar doğrudan veya dolaylı olarak hukuki ve mali sorumluluk kabul etmez. İkinci el alım-satımlarda kullanıcıların kendi güvenlik önlemlerini (Param Güvende, elden teslim, donanım stres testleri) almaları önerilir.
          </p>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            &copy; 2026 KasaRadar • <strong className="text-neutral-400">ZYPHERSTUDIO</strong> Tarafından Geliştirilmiştir. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-1">
            <span>Yapay zeka ve donanım tutkunları için</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>üretildi.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
