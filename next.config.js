/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactRoot: true
  },
  basePath: process.env.NEXT_PUBLIC_BASE_URL
}

module.exports = nextConfig
