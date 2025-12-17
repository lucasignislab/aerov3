/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@plane-clone/ui", "@plane-clone/database"],
};

module.exports = nextConfig;
