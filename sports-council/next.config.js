/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'img.olympics.com' },
            { protocol: 'https', hostname: 'i.pinimg.com' },
            { protocol: 'https', hostname: 'www.lasemaine.fr' },
            { protocol: 'https', hostname: 'azimpremjiuniversity.edu.in' },
            { protocol: 'https', hostname: '**.pinimg.com' },
            { protocol: 'https', hostname: '**.unsplash.com' },
        ],
    },
};

module.exports = nextConfig;
