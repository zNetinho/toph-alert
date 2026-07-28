import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(appDir, '../..');

const nextConfig: NextConfig = {
  transpilePackages: ['@toph-alert/domain', '@toph-alert/browser-sdk', '@toph-alert/integrations'],
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
