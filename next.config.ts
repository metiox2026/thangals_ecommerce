import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['192.168.1.112', '192.168.70.22'],
};

export default nextConfig;
