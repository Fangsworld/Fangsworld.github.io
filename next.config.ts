import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages 静态导出配置（构建时启用）
  // output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
