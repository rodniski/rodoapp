/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    async rewrites() {
      return [
        {
          source: "/filiais/:path*",
          destination: "http://localhost:8080/filiais/:path*",
        },
      ];
    },
  };
  
  export default nextConfig;