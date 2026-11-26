import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/telegram-broadcast", "/api/telegram-config"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "Bingbot",
          "Applebot-Extended"
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
      }
    ],
    sitemap: "https://kasaradar.com/sitemap.xml",
  };
}
