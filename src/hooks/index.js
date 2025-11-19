/**
 * Hooks Barrel Export
 * 
 * Centralized exports for all custom React hooks.
 * This allows for cleaner imports like:
 * import { useAuth, useCartSync, useResponsiveDesign } from '@hooks';
 */

// Authentication hooks
export { useAuth } from './auth/useAuth';
export { default as useSupabaseAuth } from './auth/useSupabaseAuth';

// Cart hooks
export { default as useCartSync } from './cart/useCartSync';

// UI hooks
export { default as useResponsiveDesign } from './ui/useResponsiveDesign';
export { default as useHapticFeedback } from './ui/useHapticFeedback';
export { default as useModal } from './ui/useModal';

// Form hooks
export { default as useFormValidation } from './forms/useFormValidation';

// Product hooks
export { default as useProductFilters } from './products/useProductFilters';

// Storage hooks
export { default as useLocalStorage } from './storage/useLocalStorage';
