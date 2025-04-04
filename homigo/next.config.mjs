import path from 'path'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ["res.cloudinary.com"],
    unoptimized: true, // Required for static exports
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components')
    }
    return config
  }
}

export default nextConfig;
