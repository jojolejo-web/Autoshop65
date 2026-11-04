import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
