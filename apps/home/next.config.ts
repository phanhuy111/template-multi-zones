import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    '@repo/services'
  ],
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: 'http://localhost:3001/blog',
      },
      {
        source: '/blog/:path*',
        destination: 'http://localhost:3001/blog/:path*',
      },
    ]
  },
};

export default nextConfig;
