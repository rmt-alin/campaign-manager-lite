import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Codespaces serves the dev server from *.app.github.dev.
  allowedDevOrigins: ['*.app.github.dev'],
  agentRules: false,
};

export default nextConfig;
