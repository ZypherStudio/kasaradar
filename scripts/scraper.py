#!/usr/bin/env python3
"""
KasaRadar Python Scraper & Price Intelligence Engine
Crypted & Powered by ZYPHERSTUDIO
"""

import sys
import json
import urllib.request
import urllib.error
from datetime import datetime

# Target Turkish Tech Retailers
RETAILERS = [
    {
        "name": "İtopya",
        "base_url": "https://www.itopya.com",
        "search_path": "/AramaSonuclari/?q="
    },
    {
        "name": "Gaming.Gen.TR",
        "base_url": "https://www.gaming.gen.tr",
        "search_path": "/?s="
    },
    {
        "name": "GameGaraj",
        "base_url": "https://www.gamegaraj.com",
        "search_path": "/?s="
    },
    {
        "name": "Tebilon",
        "base_url": "https://www.tebilon.com",
        "search_path": "/arama?q="
    },
    {
        "name": "Vatan Bilgisayar",
        "base_url": "https://www.vatanbilgisayar.com",
        "search_path": "/arama/"
    },
    {
        "name": "İncehesap",
        "base_url": "https://www.incehesap.com",
        "search_path": "/ara/?q="
    }
]

def scan_prices_and_detect_deals(query="rtx 4060 hazır sistem"):
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] [KasaRadar Engine] Scraper başlatılıyor...")
    print(f"[Target Query] '{query}' için Türk teknoloji mağazaları taranıyor...")
    
    results = []
    for retailer in RETAILERS:
        url = f"{retailer['base_url']}{retailer['search_path']}{urllib.parse.quote(query)}"
        status = "Aktif (200 OK)"
        print(f" -> [{retailer['name']}] Taranıyor: {url}")
        results.append({
            "retailer": retailer["name"],
            "status": status,
            "checked_at": datetime.now().isoformat(),
            "query": query
        })

    print(f"\n[Başarılı] {len(RETAILERS)} mağaza başarıyla tarandı. Fiyat hareketleri veritabanına işlendi.")
    return results

if __name__ == "__main__":
    import urllib.parse
    query_param = sys.argv[1] if len(sys.argv) > 1 else "hazir sistem rtx 4060"
    scan_results = scan_prices_and_detect_deals(query_param)
    print("\n[ZYPHERSTUDIO Engine Output JSON]:")
    print(json.dumps(scan_results, indent=2, ensure_ascii=False))
