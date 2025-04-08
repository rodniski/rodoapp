/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    async rewrites() {
        return [
            {
                source: "/filiais/:path*", // rota “interna”
                destination: "http://localhost:8080/filiais/:path*", // rota real do Go
            },
        ];
    },
};

export default nextConfig;