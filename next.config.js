/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  // Remove exportPathMap as it's not compatible with app directory
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig