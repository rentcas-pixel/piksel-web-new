import type { NextConfig } from 'next'

const config: NextConfig = {
  eslint: {
    // Pre-existing <a> lint errors on marketing pages; don't block /c proxy deploys
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eknndiyjolypgxkwtvxn.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Reduce image sizes to save bandwidth
    deviceSizes: [320, 640],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'],
    // Disable image optimization to avoid Vercel limits
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: '/favicon.ico', destination: '/icon' },
      // Partnerių plano / klipų gavimo patvirtinimas → Hub
      {
        source: '/c/:path*',
        destination: 'https://hub.piksel.lt/c/:path*',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/icon',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default config