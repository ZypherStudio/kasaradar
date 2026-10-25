import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ════════════════════════════════════════════════════════════════════════════════
// KASARADAR SHIELD v2.0 - ENTERPRISE DDOS & APPLICATION FIREWALL (WAF)
// ════════════════════════════════════════════════════════════════════════════════

interface RateLimitBucket {
  count: number;
  lastReset: number;
  burstCount: number;
  burstLastReset: number;
}

// In-memory sliding window rate-limiter map (IP -> bucket)
// Automatically purges old entries to prevent memory leak
const ipStore = new Map<string, RateLimitBucket>();
const MAX_STORE_SIZE = 10000;

// Suspicious bot signatures in User-Agent
const BAD_USER_AGENTS = [
  "sqlmap",
  "nikto",
  "masscan",
  "zgrab",
  "acunetix",
  "dirbuster",
  "nmap",
  "wprecon",
  "wpscan",
  "havij",
  "netsparker",
  "python-requests/2.", // raw flood bots without custom headers
];

// Dangerous path probes that attackers scan for
const FORBIDDEN_PATHS = [
  "/wp-admin",
  "/wp-login",
  "/xmlrpc.php",
  "/.env",
  "/.git",
  "/phpmyadmin",
  "/pma",
  "/admin.php",
  "/eval-stdin",
  "/.aws",
  "/config.json",
  "/database.sql",
  "/dump.sql",
  "/etc/passwd",
  "/proc/self",
  "/cgi-bin",
  "/.well-known/security.txt.bak",
];

// WAF Attack Signatures (SQLi, XSS, Path Traversal, Command Injection)
const ATTACK_REGEX = [
  /union\s+select/i,
  /information_schema/i,
  /(?:--|#|\/\*).*(?:select|insert|update|delete)/i,
  /<script\b[^>]*>([\s\S]*?)<\/script>/i,
  /javascript\s*:/i,
  /onload\s*=/i,
  /onerror\s*=/i,
  /\.\.\/|\.\.\\/,
  /\/etc\/passwd/i,
  /\b(exec|eval|system|passthru|shell_exec)\s*\(/i,
];

// Periodic cleanup every 100 requests to keep memory tiny
let cleanupCounter = 0;
function cleanExpiredIps(now: number) {
  if (++cleanupCounter < 100) return;
  cleanupCounter = 0;

  if (ipStore.size > MAX_STORE_SIZE) {
    ipStore.clear();
    return;
  }

  for (const [ip, bucket] of ipStore.entries()) {
    if (now - bucket.lastReset > 120000) {
      ipStore.delete(ip);
    }
  }
}

export function proxy(request: NextRequest) {
  const now = Date.now();
  cleanExpiredIps(now);

  const pathname = request.nextUrl.pathname;

  // 1. Skip static assets, Next.js internal bundles & icons
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico|css|js|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Extract Client IP
  const clientIp =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1";

  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

  // 3. WAF: Check Bad Bot User-Agents
  for (const badAgent of BAD_USER_AGENTS) {
    if (userAgent.includes(badAgent)) {
      return new NextResponse(
        JSON.stringify({
          error: "Access Denied: Malicious scanner detected by KasaRadar Shield WAF.",
          shield: "active",
          code: 403,
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-DDoS-Protection": "active; mode=block",
          },
        }
      );
    }
  }

  // 4. WAF: Block probe scans on common vulnerability targets
  const pathnameLower = pathname.toLowerCase();
  for (const probe of FORBIDDEN_PATHS) {
    if (pathnameLower.includes(probe)) {
      return new NextResponse(
        JSON.stringify({
          error: "Access Forbidden: Probing of internal assets is blocked.",
          shield: "active",
          code: 403,
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-DDoS-Protection": "active; mode=probe-block",
          },
        }
      );
    }
  }

  // 5. WAF: Query string attack signature inspection
  const searchParams = request.nextUrl.search;
  if (searchParams) {
    const decodedQuery = decodeURIComponent(searchParams).replace(/\+/g, " ").toLowerCase();
    for (const regex of ATTACK_REGEX) {
      if (regex.test(decodedQuery)) {
        return new NextResponse(
          JSON.stringify({
            error: "Request blocked: Malicious payload signature detected.",
            shield: "active",
            code: 400,
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "X-DDoS-Protection": "active; mode=waf-signature-block",
            },
          }
        );
      }
    }
  }

  // 6. Sliding Window Rate Limiting (DDoS Defense)
  const isApi = pathname.startsWith("/api");
  const isHeavyApi = pathname.startsWith("/api/ai-chat") || pathname.startsWith("/api/tracker");

  // Limits per 60 seconds
  const windowMs = 60000;
  const maxRequests = isHeavyApi ? 20 : isApi ? 50 : 150;

  // Burst protection: max requests within 3 seconds
  const burstWindowMs = 3000;
  const burstMax = isHeavyApi ? 8 : isApi ? 18 : 45;

  let bucket = ipStore.get(clientIp);
  if (!bucket) {
    bucket = {
      count: 1,
      lastReset: now,
      burstCount: 1,
      burstLastReset: now,
    };
    ipStore.set(clientIp, bucket);
  } else {
    // Check main window
    if (now - bucket.lastReset > windowMs) {
      bucket.count = 1;
      bucket.lastReset = now;
    } else {
      bucket.count++;
    }

    // Check burst window
    if (now - bucket.burstLastReset > burstWindowMs) {
      bucket.burstCount = 1;
      bucket.burstLastReset = now;
    } else {
      bucket.burstCount++;
    }
  }

  // Enforce Burst Flood Block (HTTP 429)
  if (bucket.burstCount > burstMax) {
    return new NextResponse(
      JSON.stringify({
        error: "KasaRadar DDoS Kalkanı: Çok fazla anlık istek algılandı. Lütfen birkaç saniye bekleyin.",
        error_en: "Too many concurrent requests. Rate limited by KasaRadar DDoS Shield.",
        retryAfterSeconds: 5,
        code: 429,
        shield: "active",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Retry-After": "5",
          "X-DDoS-Protection": "active; status=rate-limited-burst",
          "X-RateLimit-Limit": String(burstMax),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Enforce 60-Second Window Rate Limit (HTTP 429)
  if (bucket.count > maxRequests) {
    const remainingSeconds = Math.max(1, Math.ceil((windowMs - (now - bucket.lastReset)) / 1000));
    return new NextResponse(
      JSON.stringify({
        error: `KasaRadar DDoS Kalkanı: İstek kotanız aşıldı. Lütfen ${remainingSeconds} saniye sonra tekrar deneyin.`,
        error_en: `Rate limit exceeded. Try again in ${remainingSeconds} seconds.`,
        retryAfterSeconds: remainingSeconds,
        code: 429,
        shield: "active",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Retry-After": String(remainingSeconds),
          "X-DDoS-Protection": "active; status=rate-limited",
          "X-RateLimit-Limit": String(maxRequests),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // 7. Attach Enterprise Security & Shield Headers to response
  const response = NextResponse.next();
  const remaining = Math.max(0, maxRequests - bucket.count);

  response.headers.set("X-DDoS-Protection", "active; engine=kasaradar-shield-v2");
  response.headers.set("X-RateLimit-Limit", String(maxRequests));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
