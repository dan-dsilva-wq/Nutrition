import type { NextConfig } from "next";

const allowedDevOrigins =
  process.env.NEXT_ALLOWED_DEV_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  ...(allowedDevOrigins.length ? { allowedDevOrigins } : {}),
  async redirects() {
    return [
      // The weekly food plan now lives on /you/foods. Redirecting here instead
      // of calling redirect() in a page avoids a client router crash on
      // direct loads of the old URL.
      { source: "/you/foods/week", destination: "/you/foods", permanent: false },
      // Old static policy URL, already given to Google Play and Health Connect.
      { source: "/privacypolicy.html", destination: "/privacy", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
