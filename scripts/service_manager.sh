#!/bin/bash

# KasaRadar 24/7 Service Manager (macOS Launchd Native Daemon)

PLIST_DIR="$HOME/Library/LaunchAgents"

case "$1" in
  start|load)
    echo "🚀 KasaRadar 24/7 Servisleri Başlatılıyor..."
    launchctl load -w "$PLIST_DIR/com.kasaradar.web.plist" 2>/dev/null
    launchctl load -w "$PLIST_DIR/com.kasaradar.tunnel.plist" 2>/dev/null
    launchctl load -w "$PLIST_DIR/com.kasaradar.bot.plist" 2>/dev/null
    echo "✅ Servisler macOS sistem arka planına bağlandı!"
    ;;
  stop|unload)
    echo "🛑 KasaRadar Servisleri Durduruluyor..."
    launchctl unload "$PLIST_DIR/com.kasaradar.web.plist" 2>/dev/null
    launchctl unload "$PLIST_DIR/com.kasaradar.tunnel.plist" 2>/dev/null
    launchctl unload "$PLIST_DIR/com.kasaradar.bot.plist" 2>/dev/null
    echo "✅ Servisler durduruldu."
    ;;
  restart)
    echo "🔄 KasaRadar Servisleri Yeniden Başlatılıyor..."
    launchctl unload "$PLIST_DIR/com.kasaradar.web.plist" 2>/dev/null
    launchctl unload "$PLIST_DIR/com.kasaradar.tunnel.plist" 2>/dev/null
    launchctl unload "$PLIST_DIR/com.kasaradar.bot.plist" 2>/dev/null
    sleep 1
    launchctl load -w "$PLIST_DIR/com.kasaradar.web.plist" 2>/dev/null
    launchctl load -w "$PLIST_DIR/com.kasaradar.tunnel.plist" 2>/dev/null
    launchctl load -w "$PLIST_DIR/com.kasaradar.bot.plist" 2>/dev/null
    echo "✅ Tüm servisler yeniden başlatıldı!"
    ;;
  status)
    echo "📊 KasaRadar Canlı Servis Durumu:"
    launchctl list | grep -E "com.kasaradar|Label"
    echo ""
    echo "🌐 HTTP Port 3001 Durumu:"
    curl -s -I http://localhost:3001 | head -n 3
    echo ""
    echo "🌍 Canlı Domain (kasaradar.com) Durumu:"
    curl -s -I https://kasaradar.com | head -n 3
    ;;
  logs)
    echo "📄 Son Loglar:"
    tail -n 15 /Users/erdalalp/e/kasaradar/logs/*.log
    ;;
  *)
    echo "Kullanım: ./scripts/service_manager.sh {start|stop|restart|status|logs}"
    ;;
esac
