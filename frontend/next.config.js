const repoName = 'Al-Based-Spring-Revival-and-Recharge-Planning-for-Tribal-Areas';
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isProd ? `/${repoName}` : '',
};

module.exports = nextConfig;
