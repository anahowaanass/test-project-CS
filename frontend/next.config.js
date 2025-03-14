/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  // output: 'export',
  reactStrictMode: true,
  images: {
    domains: ['127.0.0.1', 'localhost'],
    remotePatterns: [
      {
        hostname: '**.cyber-scale.me',
      },
    ],
  },
  i18n,
};

module.exports = nextConfig;
