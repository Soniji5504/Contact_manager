import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.189'],
  async rewrites() {
    return [
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:5001/api/users/:path*',
      },
      {
        source: '/api/contacts/:path*',
        destination: 'http://localhost:5001/api/contacts/:path*',
      },
    ];
  },
};

export default nextConfig;
