/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export
  images: {
    unoptimized: true, // Disable Image Optimization API as it's not available for static exports
  },
  // If you're using a basePath (for GitHub Pages user/organization sites)
  basePath: process.env.NODE_ENV === 'production' ? '/portfolio' : '',
  // If you're using assetPrefix (for GitHub Pages project sites)
  assetPrefix: process.env.NODE_ENV === 'production' ? '/portfolio/' : '',
}

export default nextConfig