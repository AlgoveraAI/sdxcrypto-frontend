/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "images.unsplash.com",
      "pbs.twimg.com",
      "firebasestorage.googleapis.com",
    ],
  },
};

module.exports = nextConfig;
