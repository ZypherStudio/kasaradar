"use client";

import React, { useState } from "react";
import { formatTL } from "@/lib/calculator";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ExternalLink,
  Bot,
  Hash,
  Users,
  Copy,
  Check,
  Zap,
  ShieldCheck
} from "lucide-react";
import { Logo } from "./Logo";

interface DiscordBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  username: string;
  avatarBg: string;
  time: string;
  content: string;
  isEmbed?: boolean;
  embedData?: {
    title: string;
    description: string;
    color: string;
    fields: { name: string; value: string; inline?: boolean }[];
  };
}

export const DiscordBotModal: React.FC<DiscordBotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "user",
      username: "GamerAhmet",
      avatarBg: "bg-indigo-600",
      time: "Bugün 14:20",
      content: "!kasa 30000"
    },
    {
      id: "2",
      sender: "bot",
      username: "KasaRadar",
      avatarBg: "bg-emerald-500",
      time: "Bugün 14:20",
      content: "",
      isEmbed: true,
      embedData: {
        title: "🎯 30.000 TL Bütçe İçin #1 Tavsiye Kasa",
        description: "**BLADE-7500F / RTX 4060 Ti DDR5**\nGaming.Gen.TR güvencesiyle tek tek toplamaya göre 6.401 TL daha kârlı!",
        color: "border-l-4 border-emerald-500",
        fields: [
          { name: "💰 Fiyat", value: "31.499 TL", inline: true },
          { name: "⭐ F/P Skoru", value: "9.6 / 10", inline: true },
          { name: "🎮 Ekran Kartı", value: "ASUS Dual RTX 4060 Ti 8GB", inline: true },
          { name: "⚡ İşlemci", value: "AMD Ryzen 5 7500F (AM5)", inline: true },
          { name: "🏪 Mağaza", value: "Gaming.Gen.TR", inline: true },
          { name: "🔗 İncele", value: "[KasaRadar'da Gör](https://kasaradar.com)", inline: true }
        ]
      }
    }
  ]);

  const [inputCommand, setInputCommand] = useState<string>("");
  const [copiedInvite, setCopiedInvite] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendCommand = (cmdText?: string) => {
    const text = (cmdText || inputCommand).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      username: "Sen",
      avatarBg: "bg-cyan-600",
      time: "Az önce",
      content: text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputCommand("");

    // Simulate bot response
    setTimeout(() => {
      let botMsg: ChatMessage;

      if (text.startsWith("!kasa") || text.includes("kasa")) {
        botMsg = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          username: "KasaRadar",
          avatarBg: "bg-emerald-500",
          time: "Az önce",
          content: "",
          isEmbed: true,
          embedData: {
            title: "🎯 ModArt-X1 V2 Gaming Sistem (F/P Şampiyonu)",
            description: "İtopya üzerinde 22.999 TL'ye satılan en popüler 1080p Ultra espor sistemi!",
            color: "border-l-4 border-emerald-500",
            fields: [
              { name: "💰 Fiyat", value: "22.999 TL", inline: true },
              { name: "🎮 Ekran Kartı", value: "RTX 4060 Dual OC 8GB", inline: true },
              { name: "⚡ İşlemci", value: "AMD Ryzen 5 5600", inline: true },
              { name: "📈 Tasarruf", value: "+4.851 TL Kâr", inline: true }
            ]
          }
        };
      } else if (text.startsWith("!darbogaz") || text.includes("darboğaz")) {
        botMsg = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          username: "KasaRadar",
          avatarBg: "bg-emerald-500",
          time: "Az önce",
          content: "",
          isEmbed: true,
          embedData: {
            title: "🧪 Donanım Darboğaz (Bottleneck) Analizi",
            description: "Ryzen 5 5600 + RTX 4060 Kombinasyonu Test Edildi:",
            color: "border-l-4 border-cyan-500",
            fields: [
              { name: "📊 Darboğaz Oranı", value: "%3.2 (Kusursuz Uyum)", inline: true },
              { name: "✅ Sonuç", value: "1080p Ultra'da sıfır FPS kaybı.", inline: true }
            ]
          }
        };
      } else {
        botMsg = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          username: "KasaRadar",
          avatarBg: "bg-emerald-500",
          time: "Az önce",
          content: "",
          isEmbed: true,
          embedData: {
            title: "🤖 KasaRadar Bot Komut Listesi",
            description: "Discord sunucunuzda kullanabileceğiniz hızlı komutlar:",
            color: "border-l-4 border-purple-500",
            fields: [
              { name: "!kasa [bütçe]", value: "Örn: `!kasa 25000` -> En iyi kasayı önerir", inline: false },
              { name: "!darbogaz", value: "İşlemci ve ekran kartı uyumunu ölçer", inline: false },
              { name: "!indirimler", value: "Canlı fırsatları ve gece indirimlerini listeler", inline: false }
            ]
          }
        };
      }

      setMessages((prev) => [...prev, botMsg]);
    }, 450);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText("https://discord.com/api/oauth2/authorize?client_id=1284920482019&permissions=8&scope=bot");
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#313338] text-white border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#2b2d31] hover:bg-[#35373c] text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold">
            <Bot className="w-3.5 h-3.5" />
            <span>KasaRadar Discord Bot Entegrasyonu</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Kendi Discord Sunucuna Ekle — Topluluğunu Büyüt!
          </h3>
          <p className="text-xs text-neutral-300">
            Sunucundaki üyeler `!kasa [bütçe]` yazdığında bot saniyeler içinde mağazalardaki en iyi hazır kasayı Discord mesajı olarak sunucuya atsın.
          </p>
        </div>

        {/* Discord Invite CTA Banner */}
        <div className="p-4 rounded-2xl bg-[#2b2d31] border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5865F2] flex items-center justify-center font-black text-base shadow-lg shrink-0">
              🤖
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>KasaRadar Bot v2.0 (Resmi Doğrulanmış)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#5865F2] text-white font-bold">BOT</span>
              </div>
              <p className="text-[11px] text-neutral-400">120+ Gaming sunucusunda 45.000+ üyeye hizmet veriyor.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyInvite}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              {copiedInvite ? <Check className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
              <span>{copiedInvite ? "Davet Linki Kopyalandı!" : "Sunucuma Ekle"}</span>
            </button>
          </div>
        </div>

        {/* Interactive Discord Channel Simulation Frame */}
        <div className="rounded-2xl border border-neutral-700 bg-[#2b2d31] shadow-inner overflow-hidden flex flex-col h-[340px]">
          {/* Discord Channel Header Bar */}
          <div className="p-3 bg-[#1e1f22] border-b border-neutral-800 flex items-center justify-between text-xs font-semibold text-neutral-300">
            <div className="flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-neutral-400" />
              <span>kasa-fırsatları</span>
              <span className="text-neutral-500 text-[10px] hidden sm:inline">| KasaRadar Botu Canlı Kanalı</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
              <Users className="w-3.5 h-3.5" />
              <span>Online: 1.482</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 text-xs">
                <div className={`w-8 h-8 rounded-full ${msg.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                  {msg.username.charAt(0)}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{msg.username}</span>
                    {msg.sender === "bot" && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-[#5865F2] text-white font-bold">BOT</span>
                    )}
                    <span className="text-[10px] text-neutral-500">{msg.time}</span>
                  </div>

                  {msg.content && <p className="text-neutral-200">{msg.content}</p>}

                  {/* Discord Embed Card */}
                  {msg.isEmbed && msg.embedData && (
                    <div className={`p-3 rounded-lg bg-[#1e1f22] ${msg.embedData.color} space-y-2 mt-1 max-w-xl text-xs`}>
                      <div className="font-bold text-white text-sm">{msg.embedData.title}</div>
                      <p className="text-neutral-300 text-[11px] leading-relaxed whitespace-pre-line">
                        {msg.embedData.description}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-neutral-800/80">
                        {msg.embedData.fields.map((f, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <span className="text-[10px] text-neutral-400 font-semibold block">{f.name}:</span>
                            <span className="text-white font-bold text-[11px]">{f.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Chat Bar */}
          <div className="p-3 bg-[#383a40] flex items-center gap-2">
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendCommand();
              }}
              placeholder="#kasa-fırsatları kanalına komut yaz... (Örn: !kasa 35000 veya !darbogaz)"
              className="flex-1 bg-transparent text-white placeholder-neutral-400 text-xs focus:outline-none"
            />
            <button
              onClick={() => handleSendCommand()}
              className="p-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Command Chips to Try */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-neutral-400">Canlı Test Et:</span>
          <button
            onClick={() => handleSendCommand("!kasa 25000")}
            className="px-2.5 py-1 rounded-lg bg-[#2b2d31] hover:bg-[#383a40] text-emerald-400 border border-neutral-700 text-xs font-mono cursor-pointer"
          >
            !kasa 25000
          </button>
          <button
            onClick={() => handleSendCommand("!darbogaz")}
            className="px-2.5 py-1 rounded-lg bg-[#2b2d31] hover:bg-[#383a40] text-cyan-400 border border-neutral-700 text-xs font-mono cursor-pointer"
          >
            !darbogaz
          </button>
          <button
            onClick={() => handleSendCommand("!yardim")}
            className="px-2.5 py-1 rounded-lg bg-[#2b2d31] hover:bg-[#383a40] text-purple-400 border border-neutral-700 text-xs font-mono cursor-pointer"
          >
            !yardim
          </button>
        </div>
      </div>
    </div>
  );
};
