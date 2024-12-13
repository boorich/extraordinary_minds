/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  basePath: '/extraordinary_minds',
  assetPrefix: '/extraordinary_minds/'
}

module.exports = nextConfig