/**
 * Enhanced input validation utilities for secure data handling
 */

/**
 * Sanitize HTML input to prevent XSS attacks
 * @param {string} input - Raw input string
 * @returns {string} Sanitized string
 */
export const sanitizeHTML = (input) => {
    if (typeof input !== 'string') return '';
    
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
};

/**
 * Validate and sanitize email input
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return { isValid: false, message: 'Email is required' };
    }
    
    const sanitized = sanitizeHTML(email.toLowerCase().trim());
    
    // Enhanced email regex pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(sanitized)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    if (sanitized.length > 254) {
        return { isValid: false, message: 'Email address is too long' };
    }
    
    return { isValid: true, sanitized };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength score
 */
export const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return { isValid: false, message: 'Password is required', strength: 0 };
    }
    
    let strength = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Calculate strength score
    Object.values(checks).forEach(check => {
        if (check) strength += 20;
    });
    
    // Validation messages
    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long', strength };
    }
    
    if (password.length < 8) {
        return { isValid: true, message: 'Password is weak. Consider using 8+ characters', strength };
    }
    
    if (strength < 60) {
        return { 
            isValid: true, 
            message: 'Password could be stronger. Try adding uppercase, numbers, or special characters', 
            strength 
        };
    }
    
    return { isValid: true, message: 'Strong password', strength };
};

/**
 * Validate and sanitize name input
 * @param {string} name - Name to validate
 * @returns {Object} Validation result
 */
export const validateName = (name) => {
    if (!name || typeof name !== 'string') {
        return { isValid: false, message: 'Name is required' };
    }
    
    const sanitized = sanitizeHTML(name.trim());
    
    if (sanitized.length < 2) {
        return { isValid: false, message: 'Name must be at least 2 characters long' };
    }
    
    if (sanitized.length > 50) {
        return { isValid: false, message: 'Name is too long (max 50 characters)' };
    }
    
    // Allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(sanitized)) {
        return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }
    
    return { isValid: true, sanitized };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result
 */
export const validatePhone = (phone) => {
    if (!phone || typeof phone !== 'string') {
        return { isValid: false, message: 'Phone number is required' };
    }
    
    // Remove all non-digit characters for validation
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length < 10) {
        return { isValid: false, message: 'Phone number must be at least 10 digits' };
    }
    
    if (digits.length > 15) {
        return { isValid: false, message: 'Phone number is too long' };
    }
    
    return { isValid: true, sanitized: digits };
};

/**
 * Validate URL input
 * @param {string} url - URL to validate
 * @returns {Object} Validation result
 */
export const validateURL = (url) => {
    if (!url || typeof url !== 'string') {
        return { isValid: false, message: 'URL is required' };
    }
    
    const sanitized = url.trim();
    
    try {
        new URL(sanitized);
        return { isValid: true, sanitized };
    } catch {
        return { isValid: false, message: 'Please enter a valid URL' };
    }
};

/**
 * Validate product price
 * @param {string|number} price - Price to validate
 * @returns {Object} Validation result
 */
export const validatePrice = (price) => {
    if (price === null || price === undefined || price === '') {
        return { isValid: false, message: 'Price is required' };
    }
    
    const numPrice = Number(price);
    
    if (isNaN(numPrice)) {
        return { isValid: false, message: 'Price must be a valid number' };
    }
    
    if (numPrice < 0) {
        return { isValid: false, message: 'Price cannot be negative' };
    }
    
    if (numPrice > 1000000) {
        return { isValid: false, message: 'Price is too high' };
    }
    
    return { isValid: true, sanitized: numPrice };
};

/**
 * Validate text content (descriptions, reviews, etc.)
 * @param {string} text - Text to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateText = (text, options = {}) => {
    const {
        required = true,
        minLength = 0,
        maxLength = 1000,
        allowHTML = false
    } = options;
    
    if (!text || typeof text !== 'string') {
        if (required) {
            return { isValid: false, message: 'This field is required' };
        }
        return { isValid: true, sanitized: '' };
    }
    
    const sanitized = allowHTML ? text.trim() : sanitizeHTML(text);
    
    if (required && sanitized.length === 0) {
        return { isValid: false, message: 'This field is required' };
    }
    
    if (sanitized.length < minLength) {
        return { isValid: false, message: `Must be at least ${minLength} characters long` };
    }
    
    if (sanitized.length > maxLength) {
        return { isValid: false, message: `Must be no more than ${maxLength} characters long` };
    }
    
    return { isValid: true, sanitized };
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        required = true
    } = options;
    
    if (!file) {
        if (required) {
            return { isValid: false, message: 'File is required' };
        }
        return { isValid: true };
    }
    
    if (file.size > maxSize) {
        return { 
            isValid: false, 
            message: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` 
        };
    }
    
    if (!allowedTypes.includes(file.type)) {
        return { 
            isValid: false, 
            message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
        };
    }
    
    return { isValid: true };
};

/**
 * Comprehensive form validation
 * @param {Object} data - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation results
 */
export const validateForm = (data, rules) => {
    const errors = {};
    let isValid = true;
    
    Object.keys(rules).forEach(field => {
        const rule = rules[field];
        const value = data[field];
        
        let result;
        
        switch (rule.type) {
            case 'email':
                result = validateEmail(value);
                break;
            case 'password':
                result = validatePassword(value);
                break;
            case 'name':
                result = validateName(value);
                break;
            case 'phone':
                result = validatePhone(value);
                break;
            case 'url':
                result = validateURL(value);
                break;
            case 'price':
                result = validatePrice(value);
                break;
            case 'text':
                result = validateText(value, rule.options);
                break;
            case 'file':
                result = validateFile(value, rule.options);
                break;
            default:
                result = { isValid: true };
        }
        
        if (!result.isValid) {
            errors[field] = result.message;
            isValid = false;
        }
    });
    
    return { isValid, errors };
};

/**
 * Rate limiting for form submissions
 */
export class FormRateLimiter {
    constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
        this.attempts = new Map();
    }
    
    isAllowed(identifier) {
        const now = Date.now();
        const userAttempts = this.attempts.get(identifier) || [];
        
        // Remove old attempts outside the window
        const recentAttempts = userAttempts.filter(time => now - time < this.windowMs);
        this.attempts.set(identifier, recentAttempts);
        
        return recentAttempts.length < this.maxAttempts;
    }
    
    recordAttempt(identifier) {
        const now = Date.now();
        const userAttempts = this.attempts.get(identifier) || [];
        userAttempts.push(now);
        this.attempts.set(identifier, userAttempts);
    }
    
    getRemainingAttempts(identifier) {
        const userAttempts = this.attempts.get(identifier) || [];
        const now = Date.now();
        const recentAttempts = userAttempts.filter(time => now - time < this.windowMs);
        return Math.max(0, this.maxAttempts - recentAttempts.length);
    }
}
