/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'realestate123.pythonanywhere.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            // ← ADD THIS ONE LINE BELOW
            {
                protocol: 'https',
                hostname: 'rx100realty.in',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
