#!/bin/bash
# KasaRadar 7/24 Canlı Yayın Başlatıcı (Next.js Production + Cloudflare Tunnel)
echo "🚀 [KasaRadar] Production sunucusu ve Cloudflare Tunnel başlatılıyor..."

# 3001 portunda eski süreç varsa temizle
lsof -ti:3001 | xargs kill -9 2>/dev/null

# 1. Next.js Production Server başlat
echo "⚡ Next.js Production başlatılıyor (port: 3001)..."
nohup npm run start -- -p 3001 > /tmp/kasaradar_web.log 2>&1 &

sleep 2

# 2. Cloudflare Tunnel başlat
echo "🛡️ Cloudflare Tunnel bağlanıyor (kasaradar.com)..."
nohup /opt/homebrew/bin/cloudflared tunnel run kasaradar > /tmp/kasaradar_tunnel.log 2>&1 &

echo "✅ KasaRadar CANLIDA! https://kasaradar.com ve https://www.kasaradar.com adreslerinden erişebilirsiniz."
