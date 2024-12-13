/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  // Configure images for static export
  experimental: {
    images: {
      unoptimized: true,
    }
  }
}

module.exports = nextConfig