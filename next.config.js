/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // External packages for server-side
    if (isServer) {
      config.externals.push('mongodb', 'mongoose', 'bcryptjs');
    } else {
      // For client-side, fallback Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        child_process: false,
        'fs/promises': false,
        'timers/promises': false,
      };
    }

    return config;
  },

  // Image optimization
  images: {
    domains: ['webrayandev.ir', 'www.webrayandev.ir', 'localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Server external packages (Next.js 15+)
  serverExternalPackages: ['mongodb', 'mongoose', 'bcryptjs'],
};

module.exports = nextConfig;
