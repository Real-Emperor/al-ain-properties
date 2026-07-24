import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  // Allow large request bodies for photo uploads (base64 images)
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
    ],
    minimumCacheTTL: 86400, // 1 day
  },
  // Enable compression
  compress: true,
  // Optimize powered-by header (removes X-Powered-By for security + slight perf)
  poweredByHeader: false,
  // Enable experimental optimizations
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
    ],
  },
};

export default nextConfig;
