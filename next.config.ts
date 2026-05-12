import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    // removed Windows path - was causing build failures on Linux builder
  },
};

export default nextConfig;
