import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide X-Powered-By header from attackers
  poweredByHeader: false,

  // Compress responses with gzip/brotli to mitigate bandwidth exhaustion attacks
  compress: true,

  // Enterprise Security Headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DDoS-Protection",
            value: "active; engine=kasaradar-shield-v2",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
