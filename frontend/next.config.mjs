/** @type {import('next').NextConfig} */
const api = process.env.API_INTERNAL_URL || "http://127.0.0.1:3001";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${api}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
