// Utility functions for handling URL slugs

/**
 * Converts a product title to a URL-friendly slug
 * @param {string} title - The product title
 * @returns {string} - URL-friendly slug
 */
export const createSlug = (title) => {
    if (!title) return '';
    
    return title
        .toLowerCase()
        .trim()
        // Replace spaces with hyphens
        .replace(/\s+/g, '-')
        // Remove special characters except hyphens
        .replace(/[^a-z0-9-]/g, '')
        // Remove multiple consecutive hyphens
        .replace(/-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '');
};

/**
 * Converts a slug back to a searchable format
 * @param {string} slug - The URL slug
 * @returns {string} - Searchable title format
 */
export const slugToTitle = (slug) => {
    if (!slug) return '';
    
    return slug
        .replace(/-/g, ' ')
        .toLowerCase();
};

/**
 * Creates a product URL with slug (without ID)
 * @param {Object} product - Product object with id and title
 * @returns {string} - Product URL
 */
export const createProductUrl = (product) => {
    if (!product || !product.title) return `/productinfo/${product?.id || ''}`;
    
    const slug = createSlug(product.title);
    return `/productinfo/${slug}`;
};

/**
 * Extracts product ID from a slug-based URL (deprecated - kept for backward compatibility)
 * @param {string} slugWithId - Slug with ID (e.g., "netflix-premium-nepal-abc123")
 * @returns {string} - Product ID
 */
export const extractIdFromSlug = (slugWithId) => {
    if (!slugWithId) return '';
    
    // Split by hyphen and get the last part (should be the ID)
    const parts = slugWithId.split('-');
    return parts[parts.length - 1];
};

/**
 * Checks if a string is likely a product ID (not a slug)
 * @param {string} str - String to check
 * @returns {boolean} - True if it looks like an ID
 */
export const isProductId = (str) => {
    if (!str) return false;
    
    // Supabase UUIDs are typically 36 characters with hyphens
    // Supabase uses UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};
