import type { NextConfig } from 'next'

const config: NextConfig = {
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