import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/icons%20xp/:path*',
        destination: '/api/assets/icons%20xp/:path*',
      },
      {
        source: '/icons xp/:path*',
        destination: '/api/assets/icons%20xp/:path*',
      },
    ];
  },
};

export default nextConfig;
