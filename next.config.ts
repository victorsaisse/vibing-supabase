import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uvvctnndpellvuhctmqh.supabase.co",
      },
    ],
  },
};

export default nextConfig;
