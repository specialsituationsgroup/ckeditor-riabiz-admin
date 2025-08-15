/*
 * Admin Writing Interface
 * Copyright (C) 2024 RIABiz
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, see <https://www.gnu.org/licenses/>.
 */

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