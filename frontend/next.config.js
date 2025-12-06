/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
      domains: ['images.unsplash.com', 'via.placeholder.com'],
      unoptimized: process.env.NODE_ENV === 'development',
    },
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
      NEXT_PUBLIC_SEARCH_API_URL: process.env.NEXT_PUBLIC_SEARCH_API_URL || 'http://localhost:8082',
    },
};
  
export default nextConfig;