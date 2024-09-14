/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
      config.resolve.fallback = { ...config.resolve.fallback, crypto: false };
      return config;
    },
  };
  

export default nextConfig;
