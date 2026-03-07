export const getImageUrl = (path) => {
    if (!path) return "/assets/images/detail/image4.jpg";

    // If it's a string containing comma-separated URLs (new API format)
    if (typeof path === 'string' && path.includes(',')) {
        // Split by comma and return the first URL
        const urls = path.split(',').map(url => url.trim());
        return urls[0] || "/assets/images/detail/image4.jpg";
    }

    // If it's a number (image ID from API), construct URL to fetch from backend
    if (typeof path === 'number') {
        return `https://trsmalldev.onrender.com/property-images/${path}`;
    }

    // already absolute URL (Cloudinary, Unsplash, CDN, AWS S3)
    if (path.startsWith("http://") || path.startsWith("https://")) {
        // Validate S3 URL format and fix if needed
        if (path.includes('s3.amazonaws.com') || path.includes('s3.ap-south-1.amazonaws.com')) {
            // Return as-is if it's a proper S3 URL
            return path;
        }
        return path;
    }

    // relative path from Django backend (old API)
    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

// Helper function to get all images as an array from comma-separated string or array
export const getImageUrls = (images) => {
    if (!images) return ["/assets/images/detail/image4.jpg"];

    // If it's already an array (old API format with image_ids)
    if (Array.isArray(images)) {
        return images.map(img => getImageUrl(img));
    }

    // If it's a comma-separated string (new API format)
    if (typeof images === 'string' && images.includes(',')) {
        return images.split(',').map(url => url.trim()).filter(url => url);
    }

    // Single image
    return [getImageUrl(images)];
};
