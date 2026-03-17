/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:5000/api/:path*', // Proxy to Express Backend
            },
        ];
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'img.olympics.com' },
            { protocol: 'https', hostname: 'www.lasemaine.fr' },
            { protocol: 'https', hostname: 'azimpremjiuniversity.edu.in' },
            { protocol: 'https', hostname: 'i.pinimg.com' },
        ],
    },
};

export default nextConfig;
