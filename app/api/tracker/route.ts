import { NextResponse } from "next/server";
import { PREBUILT_SYSTEMS, LIVE_DEAL_ALERTS } from "@/lib/data";

export async function GET() {
  const summary = {
    service: "KasaRadar Engine",
    developer: "ZYPHERSTUDIO",
    producer: "YAPIMCI",
    email: "zypherstudio@gmail.com",
    activeStores: ["İtopya", "Gaming.Gen.TR", "GameGaraj", "Tebilon", "İncehesap", "Sinerji", "Vatan Bilgisayar", "Teknobiyotik"],
    totalTrackedSystems: PREBUILT_SYSTEMS.length,
    recentDrops: LIVE_DEAL_ALERTS.length,
    status: "All Scraper Daemons Operational",
    lastRunAt: new Date().toISOString()
  };

  return NextResponse.json(summary);
}
