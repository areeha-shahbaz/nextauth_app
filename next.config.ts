import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/non-auth/login',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/non-auth/signup',
        permanent: true,
      },
    ];
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // increase body size for image uploads
    },
  },

  images: {
    domains: ['openweathermap.org'], 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
        pathname: "/img/wn/**",
      },
    ],
  },
};

export default nextConfig;
