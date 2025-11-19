import logger from './logger';
/**
 * Data normalization utilities for consistent data handling across the application
 * These functions help standardize data coming from Supabase to match expected formats
 */

/**
 * Normalize product data from Supabase
 * @param {Object} product - Raw product data from Supabase
 * @returns {Object} Normalized product data
 */
export const normalizeProduct = (product) => {
    if (!product) return null;
    
    return {
        ...product,
        // Ensure consistent field names
        productImageUrl: product.product_image_url ?? product.productImageUrl ?? '',
        categoryId: product.category_id ?? product.categoryId ?? null,
        categoryColor: product.category_color ?? product.categoryColor ?? null,
        createdAt: product.created_at ?? product.createdAt ?? null,
        updatedAt: product.updated_at ?? product.updatedAt ?? null
    };
};

/**
 * Normalize order data from Supabase
 * @param {Object} order - Raw order data from Supabase
 * @returns {Object} Normalized order data
 */
export const normalizeOrder = (order) => {
    if (!order) return null;
    
    const addressInfo = order.address_info ?? order.addressInfo ?? {};
    const createdAt = order.created_at ?? order.date ?? null;
    
    return {
        ...order,
        // Standardize user ID field
        userId: order.user_id ?? order.userId ?? null,
        // Standardize cart items
        cartItems: order.cart_items ?? order.cartItems ?? [],
        // Address information
        addressInfo,
        // Payment fields
        paymentMethod: order.payment_method ?? order.paymentMethod ?? '',
        paymentStatus: order.payment_status ?? order.paymentStatus ?? '',
        // Address fields for backward compatibility
        address: order.address ?? addressInfo?.address ?? addressInfo?.shippingAddress ?? '',
        shippingAddress: order.shippingAddress ?? addressInfo?.shippingAddress ?? '',
        phoneNumber: order.phoneNumber ?? addressInfo?.phoneNumber ?? addressInfo?.phone ?? '',
        // Date fields
        date: createdAt,
        created_at: createdAt
    };
};

/**
 * Normalize review data from Supabase
 * @param {Object} review - Raw review data from Supabase
 * @returns {Object} Normalized review data
 */
export const normalizeReview = (review) => {
    if (!review) return null;
    
    const createdAt = review.created_at ? new Date(review.created_at) : null;
    
    return {
        ...review,
        // Standardize product and user references
        productId: review.product_id ?? review.productId ?? null,
        productTitle: review.product_title ?? review.productTitle ?? '',
        userId: review.user_id ?? review.userId ?? null,
        userName: review.user_name ?? review.userName ?? 'Anonymous',
        // Review metrics
        helpfulCount: review.helpful_count ?? review.helpfulCount ?? 0,
        reviewType: review.review_type ?? review.reviewType ?? 'product',
        // Timestamp handling for backward compatibility
        timestamp: review.timestamp ?? (createdAt ? {
            seconds: Math.floor(createdAt.getTime() / 1000),
            toDate: () => createdAt
        } : null)
    };
};

/**
 * Normalize user data from Supabase
 * @param {Object} user - Raw user data from Supabase
 * @returns {Object} Normalized user data
 */
export const normalizeUser = (user) => {
    if (!user) return null;
    
    return {
        ...user,
        // Ensure consistent ID field
        id: user.id,
        // Email and name fields
        email: user.email ?? '',
        name: user.name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'User',
        // Role and permissions
        role: user.role ?? user.user_metadata?.role ?? 'user',
        // Timestamps
        createdAt: user.created_at ?? user.createdAt ?? null,
        updatedAt: user.updated_at ?? user.updatedAt ?? null,
        // Email verification
        emailVerified: Boolean(user.email_confirmed_at ?? user.emailVerified)
    };
};

/**
 * Batch normalize an array of items using the appropriate normalizer
 * @param {Array} items - Array of items to normalize
 * @param {string} type - Type of items ('product', 'order', 'review', 'user')
 * @returns {Array} Array of normalized items
 */
export const batchNormalize = (items, type) => {
    if (!Array.isArray(items)) return [];
    
    const normalizers = {
        product: normalizeProduct,
        order: normalizeOrder,
        review: normalizeReview,
        user: normalizeUser
    };
    
    const normalizer = normalizers[type];
    if (!normalizer) {
        logger.warn('Unknown normalization type: ${type}');
        return items;
    }
    
    return items.map(normalizer).filter(Boolean);
};

/**
 * Create a timestamp object compatible with both Firebase and Supabase
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {Object} Timestamp object with seconds and toDate method
 */
export const createTimestamp = (dateInput) => {
    if (!dateInput) return null;
    
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    
    return {
        seconds: Math.floor(date.getTime() / 1000),
        toDate: () => date
    };
};

/**
 * Safely parse JSON from localStorage with error handling
 * @param {string} key - localStorage key
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed value or default
 */
export const safeParseJSON = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        logger.warn('Failed to parse localStorage item', { key, error: error.message });
        return defaultValue;
    }
};

/**
 * Safely stringify and store data in localStorage
 * @param {string} key - localStorage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const safeSetJSON = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        logger.warn('Failed to store localStorage item', { key, error: error.message });
        return false;
    }
};
