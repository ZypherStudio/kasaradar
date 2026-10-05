import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/telegram-broadcast", "/api/telegram-config"],
    },
    sitemap: "https://kasaradar.com/sitemap.xml",
  };
}
