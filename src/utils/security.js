// Security utilities for data protection and validation

// Input sanitization
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/javascript:/gi, '') // Remove javascript: URLs
        .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
        .replace(/on\w+='[^']*'/gi, ''); // Remove event handlers
};

// SQL injection prevention (for future database queries)
export const sanitizeForQuery = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/'/g, "''") // Escape single quotes
        .replace(/"/g, '""') // Escape double quotes
        .replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/\x00/g, ''); // Remove null bytes
};

// XSS prevention
export const escapeHtml = (text) => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Content Security Policy generator
export const generateCSP = () => {
    return {
        "default-src": "'self'",
        "script-src": "'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.googletagmanager.com",
        "style-src": "'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src": "'self' https://fonts.gstatic.com",
        "img-src": "'self' data: https:",
        "connect-src": "'self' https://api.github.com https://api.openai.com wss:",
        "frame-src": "'none'",
        "object-src": "'none'",
        "base-uri": "'self'",
        "form-action": "'self'"
    };
};

// Secure session management
export class SecureSession {
    static setSecureItem(key, value, expirationMinutes = 60) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + (expirationMinutes * 60 * 1000),
            checksum: this.generateChecksum(value)
        };
        
        try {
            localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.error('Failed to set secure item:', error);
        }
    }
    
    static getSecureItem(key) {
        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return null;
            
            const item = JSON.parse(itemStr);
            const now = new Date();
            
            // Check expiration
            if (now.getTime() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            
            // Verify integrity
            if (this.generateChecksum(item.value) !== item.checksum) {
                localStorage.removeItem(key);
                console.warn('Data integrity check failed for:', key);
                return null;
            }
            
            return item.value;
        } catch (error) {
            console.error('Failed to get secure item:', error);
            localStorage.removeItem(key);
            return null;
        }
    }
    
    static generateChecksum(data) {
        // Simple checksum for data integrity
        return btoa(JSON.stringify(data)).length.toString(36);
    }
}

// GDPR compliance helpers
export const gdprUtils = {
    // Get user consent status
    getConsentStatus: () => {
        try {
            return JSON.parse(localStorage.getItem('gdpr_consent') || '{}');
        } catch {
            return {};
        }
    },
    
    // Set user consent
    setConsent: (consentTypes) => {
        const consent = {
            ...consentTypes,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        localStorage.setItem('gdpr_consent', JSON.stringify(consent));
    },
    
    // Check if specific consent is given
    hasConsent: (type) => {
        const consent = gdprUtils.getConsentStatus();
        return consent[type] === true;
    },
    
    // Clear all user data (for data deletion requests)
    clearUserData: () => {
        const keysToKeep = ['gdpr_consent']; // Keep consent record
        const allKeys = Object.keys(localStorage);
        
        allKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        });
    }
};

// API request security
export const secureApiCall = async (url, options = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // CSRF protection
    };
    
    const secureOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        },
        credentials: 'same-origin', // CSRF protection
    };
    
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
        secureOptions.headers['X-CSRF-Token'] = csrfToken;
    }
    
    try {
        const response = await fetch(url, secureOptions);
        
        // Check for security headers in response
        if (!response.headers.get('X-Content-Type-Options')) {
            console.warn('Missing X-Content-Type-Options header');
        }
        
        return response;
    } catch (error) {
        console.error('Secure API call failed:', error);
        throw error;
    }
};

// Password security utilities
export const passwordSecurity = {
    // Check for common passwords
    isCommonPassword: (password) => {
        const commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123',
            'password123', 'admin', 'letmein', 'welcome', 'monkey',
            'dragon', 'master', 'sunshine', 'princess', 'football'
        ];
        return commonPasswords.includes(password.toLowerCase());
    },
    
    // Generate secure password
    generateSecurePassword: (length = 12) => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        return password;
    },
    
    // Hash password (client-side - for additional security layer)
    hashPassword: async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
};

// Environment security checks
export const securityChecks = {
    // Check if running in secure context
    isSecureContext: () => {
        return window.isSecureContext || location.protocol === 'https:';
    },
    
    // Check for development environment
    isDevelopment: () => {
        return import.meta.env.DEV;
    },
    
    // Validate browser security features
    checkBrowserSecurity: () => {
        const checks = {
            crypto: !!window.crypto,
            localStorage: !!window.localStorage,
            sessionStorage: !!window.sessionStorage,
            fetch: !!window.fetch,
            webWorkers: !!window.Worker
        };
        
        const failed = Object.entries(checks)
            .filter(([key, value]) => !value)
            .map(([key]) => key);
            
        if (failed.length > 0) {
            console.warn('Missing browser security features:', failed);
        }
        
        return failed.length === 0;
    }
};

export default {
    sanitizeInput,
    sanitizeForQuery,
    escapeHtml,
    generateCSP,
    SecureSession,
    gdprUtils,
    secureApiCall,
    passwordSecurity,
    securityChecks
}; 