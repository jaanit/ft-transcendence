/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

// next.config.js
module.exports = {
  images: {
    domains: ['cdn.intra.42.fr', 'lh3.googleusercontent.com'], 
  },
};
