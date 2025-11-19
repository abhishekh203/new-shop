/**
 * Utils Barrel Export
 * 
 * Centralized exports for all utility functions.
 * This allows for cleaner imports like:
 * import { logger, sanitizeInput, validateEmail } from '@utils';
 */

// Logger (default export)
export { default as logger } from './logger';

// Security utilities
export * from './security';
export { handleAuthError } from './errorHandler';

// Validation utilities
export * from './validation';
export * from './inputValidation';

// Data utilities
export * from './dataNormalization';

// SEO and content utilities
export { createProductUrl, generateSlug } from './slugUtils';
export { nepalSEOKeywords } from './nepalSEOKeywords';

// Accessibility utilities
export { initializeA11y } from './accessibility';

// Re-export commonly used functions with cleaner names
export { 
  sanitizeInput,
  sanitizeForQuery,
  escapeHtml,
  SecureSession,
  gdprUtils,
  secureApiCall,
  passwordSecurity,
  securityChecks
} from './security';

export {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateTerms,
  getPasswordStrength,
  RateLimiter
} from './validation';

export {
  sanitizeHTML,
  validatePhone,
  validateURL,
  validatePrice,
  validateText,
  validateFile,
  validateForm,
  FormRateLimiter
} from './inputValidation';

export {
  normalizeProduct,
  normalizeOrder,
  normalizeReview,
  normalizeUser,
  safeParseJSON,
  safeSetJSON
} from './dataNormalization';
