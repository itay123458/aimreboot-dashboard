import type { NextConfig } from 'next';

const isGitHubPages = process.env.AIMREBOOT_PAGES_BUILD === 'true';

const nextConfig: NextConfig = isGitHubPages
  ? { output: 'export', assetPrefix: '/aimreboot-dashboard', trailingSlash: true }
  : {};

export default nextConfig;
