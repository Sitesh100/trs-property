/**
 * API Helper Utilities
 * 
 * This file contains helper functions for common API operations
 */

/**
 * Create FormData for property creation
 * @param {Object} propertyData - Property information
 * @param {FileList} images - Image files
 * @param {FileList} documents - Document files
 * @returns {FormData}
 */
export const createPropertyFormData = (propertyData, images = null, documents = null) => {
    const formData = new FormData();
    
    // Required fields
    if (propertyData.title) formData.append('title', propertyData.title);
    if (propertyData.propertyType) formData.append('propertyType', propertyData.propertyType);
    if (propertyData.category) formData.append('category', propertyData.category);
    if (propertyData.city) formData.append('city', propertyData.city);
    if (propertyData.price) formData.append('price', propertyData.price);
    
    // Optional fields
    if (propertyData.projectName) formData.append('projectName', propertyData.projectName);
    if (propertyData.possessionStatus) formData.append('possessionStatus', propertyData.possessionStatus);
    if (propertyData.bookingAmount) formData.append('bookingAmount', propertyData.bookingAmount);
    if (typeof propertyData.isNegotiable !== 'undefined') formData.append('isNegotiable', propertyData.isNegotiable);
    if (propertyData.carpetArea) formData.append('carpetArea', propertyData.carpetArea);
    if (propertyData.superArea) formData.append('superArea', propertyData.superArea);
    if (propertyData.bedrooms) formData.append('bedrooms', propertyData.bedrooms);
    if (propertyData.bathrooms) formData.append('bathrooms', propertyData.bathrooms);
    if (propertyData.balconies) formData.append('balconies', propertyData.balconies);
    if (propertyData.reraId) formData.append('reraId', propertyData.reraId);
    if (propertyData.builderName) formData.append('builderName', propertyData.builderName);
    if (propertyData.landmarks) formData.append('landmarks', propertyData.landmarks);
    
    // Add images (Max 10)
    if (images && images.length > 0) {
        const maxImages = Math.min(images.length, 10);
        for (let i = 0; i < maxImages; i++) {
            formData.append('images', images[i]);
        }
    }
    
    // Add documents (Max 5)
    if (documents && documents.length > 0) {
        const maxDocs = Math.min(documents.length, 5);
        for (let i = 0; i < maxDocs; i++) {
            formData.append('documents', documents[i]);
        }
    }
    
    return formData;
};

/**
 * Build query parameters for property search
 * @param {Object} filters - Search filters
 * @returns {Object}
 */
export const buildPropertySearchParams = (filters = {}) => {
    const params = {};
    
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.city) params.city = filters.city;
    if (filters.propertyType) params.propertyType = filters.propertyType;
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.bedrooms) params.bedrooms = filters.bedrooms;
    if (filters.search) params.search = filters.search;
    
    return params;
};

/**
 * Validate phone number (10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate OTP (6 digits)
 * @param {string} otp - OTP to validate
 * @returns {boolean}
 */
export const isValidOTP = (otp) => {
    const otpRegex = /^[0-9]{6}$/;
    return otpRegex.test(otp);
};

/**
 * Format price for display (Indian format)
 * @param {number} price - Price to format
 * @returns {string}
 */
export const formatPrice = (price) => {
    if (!price) return '₹0';
    
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    });
    
    return formatter.format(price);
};

/**
 * Format price in lakhs/crores
 * @param {number} price - Price to format
 * @returns {string}
 */
export const formatPriceShort = (price) => {
    if (!price) return '₹0';
    
    if (price >= 10000000) {
        // Crores
        return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
        // Lakhs
        return `₹${(price / 100000).toFixed(2)} L`;
    } else if (price >= 1000) {
        // Thousands
        return `₹${(price / 1000).toFixed(2)} K`;
    }
    
    return `₹${price}`;
};

/**
 * Property type display names
 */
export const PROPERTY_TYPES = {
    flat: 'Flat',
    villa: 'Villa',
    plot: 'Plot',
    office: 'Office',
    shop: 'Shop',
    apartment: 'Apartment',
    warehouse: 'Warehouse',
    other: 'Other',
};

/**
 * Property categories
 */
export const PROPERTY_CATEGORIES = {
    residential: 'Residential',
    commercial: 'Commercial',
};

/**
 * Possession status options
 */
export const POSSESSION_STATUS = {
    'ready-to-move': 'Ready to Move',
    'under-construction': 'Under Construction',
    'upcoming': 'Upcoming',
};

/**
 * User roles
 */
export const USER_ROLES = {
    customer: 'Customer',
    builder: 'Builder',
    agent: 'Agent',
};

/**
 * Get property type display name
 * @param {string} type - Property type key
 * @returns {string}
 */
export const getPropertyTypeDisplay = (type) => {
    return PROPERTY_TYPES[type] || type;
};

/**
 * Get category display name
 * @param {string} category - Category key
 * @returns {string}
 */
export const getCategoryDisplay = (category) => {
    return PROPERTY_CATEGORIES[category] || category;
};

/**
 * Get possession status display name
 * @param {string} status - Status key
 * @returns {string}
 */
export const getPossessionStatusDisplay = (status) => {
    return POSSESSION_STATUS[status] || status;
};

/**
 * Get user role display name
 * @param {string} role - Role key
 * @returns {string}
 */
export const getUserRoleDisplay = (role) => {
    return USER_ROLES[role] || role;
};

/**
 * Handle API errors and extract error messages
 * @param {Object} error - Error object from RTK Query
 * @returns {string}
 */
export const getErrorMessage = (error) => {
    if (error?.data?.message) {
        return error.data.message;
    }
    
    if (error?.data?.error) {
        return error.data.error;
    }
    
    if (error?.message) {
        return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if user is authenticated
 * @param {Object} authState - Auth state from Redux
 * @returns {boolean}
 */
export const isAuthenticated = (authState) => {
    return !!(authState?.token && authState?.user);
};

/**
 * Get user name from user object
 * @param {Object} user - User object
 * @returns {string}
 */
export const getUserName = (user) => {
    if (!user) return 'Guest';
    return user.fullName || user.name || 'User';
};

/**
 * Validate property data before submission
 * @param {Object} propertyData - Property data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validatePropertyData = (propertyData) => {
    const errors = [];
    
    if (!propertyData.title || propertyData.title.trim() === '') {
        errors.push('Title is required');
    }
    
    if (!propertyData.propertyType) {
        errors.push('Property type is required');
    }
    
    if (!propertyData.category) {
        errors.push('Category is required');
    }
    
    if (!propertyData.city || propertyData.city.trim() === '') {
        errors.push('City is required');
    }
    
    if (!propertyData.price || propertyData.price <= 0) {
        errors.push('Valid price is required');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string}
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

/**
 * Get relative time (e.g., "2 days ago")
 * @param {string} dateString - ISO date string
 * @returns {string}
 */
export const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};
