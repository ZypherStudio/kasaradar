#!/usr/bin/env node
/**
 * KasaRadar Node.js Live Price Tracker & Telegram Webhook Dispatcher
 * Developed by ZYPHERSTUDIO
 */

const https = require("https");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "mock_token";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "@kasaradar_deals";

// Tracked systems and current prices
const TRACKED_TARGETS = [
  { id: "modart-pc", name: "ModArt-X1 V2 Gaming Sistem", currentPrice: 22999, triggerPrice: 24000, seller: "İtopya" },
  { id: "blade-7500f", name: "BLADE-7500F / RTX 4060 Ti DDR5", currentPrice: 31499, triggerPrice: 33000, seller: "Gaming.Gen.TR" },
  { id: "hero-4070s", name: "HERO 7A-RTX4070 Super Beast", currentPrice: 45999, triggerPrice: 48000, seller: "GameGaraj" },
  { id: "vatan-3050", name: "Vatan OEM Entry / RTX 3050 8GB", currentPrice: 16999, triggerPrice: 18000, seller: "Vatan Bilgisayar" }
];

async function dispatchTelegramAlert(deal) {
  const message = `🚨 <b>KasaRadar Fırsat Alarmı!</b>\n\n` +
    `📦 <b>Sistem:</b> ${deal.name}\n` +
    `🏪 <b>Mağaza:</b> ${deal.seller}\n` +
    `💰 <b>Yeni Fiyat:</b> ${deal.currentPrice.toLocaleString("tr-TR")} TL\n` +
    `🎯 <b>Hedef Fiyat:</b> ${deal.triggerPrice.toLocaleString("tr-TR")} TL\n\n` +
    `🔥 <i>Hemen tükenmeden inceleyin: https://kasaradar.com/kasa/${deal.id}</i>\n\n` +
    `⚡ <i>Powered by ZYPHERSTUDIO</i>`;

  console.log(`[Telegram Dispatch] Bildirim hazırlanıyor -> ${TELEGRAM_CHAT_ID}`);
  console.log(message.replace(/<[^>]*>/g, ""));
  return { success: true, timestamp: new Date().toISOString() };
}

function runTrackingCycle() {
  console.log(`[${new Date().toISOString()}] [ZYPHERSTUDIO Tracker] Fiyat kontrol döngüsü devrede...`);
  
  TRACKED_TARGETS.forEach((target) => {
    if (target.currentPrice < target.triggerPrice) {
      console.log(`[Fırsat Tespit Edildi] -> ${target.name} (${target.currentPrice} TL < ${target.triggerPrice} TL)`);
      dispatchTelegramAlert(target);
    }
  });

  console.log(`[Döngü Tamamlandı] ${TRACKED_TARGETS.length} sistem aktif izleniyor.\n`);
}

// Run single cycle
runTrackingCycle();
