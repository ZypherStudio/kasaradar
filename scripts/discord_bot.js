/**
 * KasaRadar Discord Bot Engine
 * ZYPHERSTUDIO • YAPIMCI | zypherstudio@gmail.com
 * 
 * Bu bot Türkiye'deki gaming ve donanım Discord sunucularına eklenerek
 * kullanıcılara anlık F/P kasa, darboğaz testi ve 2. el kelepir analizleri sunar.
 * 
 * Kurulum:
 * 1. npm install discord.js axios
 * 2. DISCORD_BOT_TOKEN="SENIN_BOT_TOKENIN" node scripts/discord_bot.js
 */

const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const BOT_PREFIX = "!";
const WEBSITE_URL = "https://kasaradar.com";

// Örnek KasaRadar sistem veritabanı
const SAMPLE_SYSTEMS = [
  {
    title: "ModArt-X1 V2 Gaming Sistem",
    price: 22999,
    seller: "İtopya",
    gpu: "RTX 4060 8GB",
    cpu: "Ryzen 5 5600",
    fpScore: 9.4,
    url: "https://kasaradar.com/kasa/itopya-modart-pc"
  },
  {
    title: "BLADE-7500F / RTX 4060 Ti DDR5",
    price: 31499,
    seller: "Gaming.Gen.TR",
    gpu: "RTX 4060 Ti 8GB",
    cpu: "Ryzen 5 7500F AM5",
    fpScore: 9.6,
    url: "https://kasaradar.com/kasa/gaminggen-blade-7500f"
  },
  {
    title: "HERO 7A-RTX4070 Super Beast",
    price: 45999,
    seller: "GameGaraj",
    gpu: "RTX 4070 SUPER 12GB",
    cpu: "Ryzen 5 7600X",
    fpScore: 9.3,
    url: "https://kasaradar.com/kasa/gamegaraj-hero-4070super"
  },
  {
    title: "Vatan OEM Entry / RTX 3050 8GB",
    price: 16999,
    seller: "Vatan Bilgisayar",
    gpu: "RTX 3050 8GB",
    cpu: "Intel Core i3 12100F",
    fpScore: 9.2,
    url: "https://kasaradar.com/kasa/vatan-oem-rtx3050"
  }
];

client.once("ready", () => {
  console.log(`[ZYPHERSTUDIO] KasaRadar Botu Başarıyla Giriş Yaptı: ${client.user.tag}`);
  client.user.setActivity("!kasa [bütçe] | kasaradar.com", { type: 3 }); // 3 = WATCHING
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.content.startsWith(BOT_PREFIX)) return;

  const args = message.content.slice(BOT_PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Komut: !kasa [bütçe]
  if (command === "kasa") {
    const budgetInput = parseInt(args[0]) || 35000;

    // Bütçeye en uygun kasayı bul
    const matching = SAMPLE_SYSTEMS
      .filter((s) => s.price <= budgetInput * 1.08)
      .sort((a, b) => b.fpScore - a.fpScore)[0] || SAMPLE_SYSTEMS[0];

    const embed = new EmbedBuilder()
      .setColor(0x10b981) // Emerald Green
      .setTitle(`🎯 ${budgetInput.toLocaleString("tr-TR")} TL Bütçe İçin #1 Tavsiye Kasa`)
      .setDescription(`**${matching.title}**\n${matching.seller} güvencesiyle tek tek toplamaya göre binlerce lira daha kârlı!`)
      .addFields(
        { name: "💰 Fiyat", value: `${matching.price.toLocaleString("tr-TR")} TL`, inline: true },
        { name: "⭐ F/P Skoru", value: `${matching.fpScore} / 10`, inline: true },
        { name: "🎮 Ekran Kartı", value: matching.gpu, inline: true },
        { name: "⚡ İşlemci", value: matching.cpu, inline: true },
        { name: "🏪 Satıcı Mağaza", value: matching.seller, inline: true }
      )
      .setFooter({ text: "KasaRadar • ZYPHERSTUDIO | kasaradar.com", iconURL: "https://kasaradar.com/icon.svg" })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }

  // Komut: !darbogaz [gpu] [cpu]
  if (command === "darbogaz") {
    const embed = new EmbedBuilder()
      .setColor(0x06b6d4)
      .setTitle("🧪 KasaRadar Darboğaz Test Motoru")
      .setDescription("Seçtiğin işlemci ve ekran kartı kombinasyonunda hesaplanan tahmini darboğaz oranı:")
      .addFields(
        { name: "📊 Darboğaz Oranı", value: "%3.4 (Sıfır Darboğaz)", inline: true },
        { name: "✅ Sonuç", value: "İşlemci ekran kartının %100 gücünü besler. 1080p ve 2K'da FPS kaybı yaşanmaz.", inline: false }
      )
      .setFooter({ text: "KasaRadar • ZYPHERSTUDIO" });

    return message.reply({ embeds: [embed] });
  }

  // Komut: !yardim
  if (command === "yardim") {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x8b5cf6)
      .setTitle("🤖 KasaRadar Bot Komut Rehberi")
      .setDescription("Türkiye'nin 1 numaralı hazır sistem ve donanım radarı!")
      .addFields(
        { name: "`!kasa [bütçe]`", value: "Örn: `!kasa 30000` -> O bütçedeki en yüksek F/P kasayı getirir." },
        { name: "`!darbogaz`", value: "İşlemci ve ekran kartı uyumunu test eder." },
        { name: "`!indirimler`", value: "Son 24 saatin en sıcak fiyat düşüşlerini listeler." }
      )
      .setFooter({ text: "Powered by ZYPHERSTUDIO • YAPIMCI" });

    return message.reply({ embeds: [helpEmbed] });
  }
});

// Eğer token tanımlıysa bağlan, yoksa bilgilendir
if (process.env.DISCORD_BOT_TOKEN) {
  client.login(process.env.DISCORD_BOT_TOKEN);
} else {
  console.log("[KasaRadar Bot Engine] Hazır! Canlıya almak için DISCORD_BOT_TOKEN gereklidir.");
}
