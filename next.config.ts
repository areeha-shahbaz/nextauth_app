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
};

export default nextConfig;
