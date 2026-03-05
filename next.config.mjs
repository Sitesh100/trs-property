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
            {
                protocol: 'https',
                hostname: 'rx100realty.in',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
                pathname: '/**',
            },
             {
                protocol: 'https',
                hostname: 'images.pexels.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'amzn-s3-bucket-trsmallproperties.s3.amazonaws.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
