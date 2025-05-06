import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  env: {
    API_DEV: 'http://192.168.137.195:5339'
  },
};

export default nextConfig;
