import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    basePath: '/blog',
    transpilePackages: [
      '@repo/services',
    ],
};

export default nextConfig;
