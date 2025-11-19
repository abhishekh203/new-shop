import { useMemo } from 'react';

/**
 * Validates individual form fields
 * @param {string} fieldName - Name of the field to validate
 * @param {any} value - Value to validate
 * @param {any} compareValue - Value to compare against (for confirmPassword)
 * @param {boolean} showError - Whether to show validation errors
 * @returns {string|null} - Error message or null if valid
 */
const validateField = (fieldName, value, compareValue = '', showError = true) => {
  if (!showError) return null;

  switch (fieldName) {
    case 'name':
      if (!value?.toString().trim()) return 'Name is required';
      if (value.toString().trim().length < 2) return 'Name must be at least 2 characters';
      if (value.toString().trim().length > 50) return 'Name must be less than 50 characters';
      if (!/^[a-zA-Z\s]+$/.test(value.toString().trim())) return 'Name can only contain letters and spaces';
      return null;

    case 'email':
      if (!value?.toString().trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.toString().trim())) return 'Please enter a valid email address';
      return null;

    case 'password':
      if (!value?.toString()) return 'Password is required';
      if (value.toString().length < 8) return 'Password must be at least 8 characters';
      if (!/(?=.*[a-z])/.test(value.toString())) return 'Password must contain at least one lowercase letter';
      if (!/(?=.*[A-Z])/.test(value.toString())) return 'Password must contain at least one uppercase letter';
      if (!/(?=.*\d)/.test(value.toString())) return 'Password must contain at least one number';
      if (!/(?=.*[@$!%*?&])/.test(value.toString())) return 'Password must contain at least one special character (@$!%*?&)';
      return null;

    case 'confirmPassword':
      if (!value?.toString()) return 'Please confirm your password';
      if (value.toString() !== compareValue?.toString()) return 'Passwords do not match';
      return null;

    case 'terms':
      if (!value) return 'You must accept the terms and conditions';
      return null;

    default:
      return null;
  }
};

/**
 * Custom hook for form validation
 * @param {Object} formData - Form data object
 * @param {Object} options - Validation options
 * @param {Array} options.fields - Fields to validate
 * @param {Object} options.showErrors - Object indicating which fields should show errors
 * @returns {Object} - Object containing validation errors and form validity
 */
const useFormValidation = (formData, options = {}) => {
  const { 
    fields = ['name', 'email', 'password', 'confirmPassword', 'terms'],
    showErrors = {}
  } = options;

  return useMemo(() => {
    // Show validation errors only when user has started typing in each field
    const errors = {};
    const actualErrors = {};

    fields.forEach(field => {
      const shouldShowError = showErrors[field] || (formData[field] && formData[field].toString().length > 0);
      
      if (field === 'confirmPassword') {
        errors[field] = validateField(field, formData[field], formData.password, shouldShowError);
        actualErrors[field] = validateField(field, formData[field], formData.password, true);
      } else if (field === 'terms') {
        errors[field] = validateField(field, formData[field], '', false); // Only show when form is submitted
        actualErrors[field] = validateField(field, formData[field], '', true);
      } else {
        errors[field] = validateField(field, formData[field], '', shouldShowError);
        actualErrors[field] = validateField(field, formData[field], '', true);
      }
    });

    const isValid = Object.values(actualErrors).every(error => !error) && 
                   fields.every(field => {
                     const value = formData[field];
                     return typeof value === 'boolean' ? value : Boolean(value?.toString().trim());
                   });

    return { errors, isValid };
  }, [formData, fields, showErrors]);
};

export default useFormValidation;
