import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'api.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;