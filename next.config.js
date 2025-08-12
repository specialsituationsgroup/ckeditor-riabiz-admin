/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables that should be available in the browser
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  },

  // Image optimization configuration
  images: {
    domains: [
      'localhost',
      'ucarecdn.com', // Uploadcare CDN
      // Add your image CDN domains here
    ],
  },

  // Redirects for admin routes
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/index',
        permanent: false,
      },
    ];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle module aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
      '@/components': `${__dirname}/components`,
      '@/pages': `${__dirname}/pages`,
      '@/utils': `${__dirname}/utils`,
      '@/interfaces': `${__dirname}/interfaces`,
      '@/config': `${__dirname}/config`,
      '@/styles': `${__dirname}/styles`,
      '@/constants': `${__dirname}/constants`,
      '@/layouts': `${__dirname}/layouts`,
    };

    return config;
  },
};

module.exports = nextConfig;