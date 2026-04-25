import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5012',
                pathname: '/**', // Разрешаем любые пути внутри этого хоста
            },
        ],
    },
};

export default nextConfig;
