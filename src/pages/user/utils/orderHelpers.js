import { serifTheme } from '../../../design-system/themes';
import logger from '../../../utils/logger';
import {
    STATUS_DELIVERED, STATUS_PLACED, STATUS_PENDING,
    STATUS_PROCESSING, STATUS_SHIPPED, STATUS_CANCELLED, STATUS_REFUNDED
} from '../constants';

/**
 * Get CSS classes for order status badge
 */
export const getStatusClasses = (status) => {
    switch (status) {
        case STATUS_DELIVERED: return 'bg-green-100 text-green-800';
        case STATUS_PLACED: return 'bg-cyan-100 text-cyan-800';
        case STATUS_PENDING: return 'bg-yellow-100 text-yellow-800';
        case STATUS_PROCESSING: return 'bg-blue-100 text-blue-800';
        case STATUS_SHIPPED: return 'bg-indigo-100 text-indigo-800';
        case STATUS_CANCELLED: return 'bg-red-100 text-red-800';
        case STATUS_REFUNDED: return 'bg-purple-100 text-purple-800';
        default: return `${serifTheme.colors.background.secondary} ${serifTheme.colors.text.secondary}`;
    }
};

/**
 * Get icon component name for order status
 * Returns null - icons are now rendered directly in components
 */
export const getStatusIcon = (status) => {
    // This function is kept for backwards compatibility but returns null
    // Icons are now rendered directly in the OrderCard component
    return null;
};

/**
 * Get product names from order's cart items
 */
export const getProductNames = (order) => {
    if (!order?.cartItems || !Array.isArray(order.cartItems)) return 'product';
    
    const productNames = order.cartItems.map(item => item.title || item.name).filter(Boolean);
    
    // Debug logging
    logger.debug('getProductNames debug', {
        orderId: order?.id,
        cartItems: order?.cartItems,
        productNames: productNames
    });
    
    if (productNames.length === 0) return 'product';
    if (productNames.length === 1) return productNames[0];
    
    // For multiple products, show first product + " and X more"
    return `${productNames[0]} and ${productNames.length - 1} more`;
};

