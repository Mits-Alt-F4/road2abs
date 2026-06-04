import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.coop.ch' },
      { protocol: 'https', hostname: 'www.migros.ch' },
      { protocol: 'https', hostname: 'www.lidl.ch' },
      { protocol: 'https', hostname: 'www.denner.ch' },
    ],
  },
  experimental: {
    // React Compiler may be enabled here once stable
  },
}

export default nextConfig
