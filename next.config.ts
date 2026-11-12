import type { NextConfig } from "next";

// Next.js loads .env files from this standalone repository root.

// The platform control dashboard is an internal tool (DEC-045): never framed, never indexed,
// no referrer to other sites. HSTS is added by the reverse proxy at deployment (HTTPS only).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

const nextConfig: NextConfig = {
  // Docker builds a self-contained server from this repository root.
  ...(process.env.NEXT_OUTPUT === "standalone"
    ? { output: "standalone" as const, outputFileTracingRoot: __dirname }
    : {}),
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
