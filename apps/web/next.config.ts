import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Turbopack is the default bundler in Next 16. These optional deps of
  // WalletConnect/pino are never used in the browser; stub them out.
  turbopack: {
    resolveAlias: {
      "pino-pretty": "./src/lib/empty-module.ts",
      lokijs: "./src/lib/empty-module.ts",
      encoding: "./src/lib/empty-module.ts",
    },
  },
  // Kept for `next build --webpack` / `next dev --webpack`.
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
