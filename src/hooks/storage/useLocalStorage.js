import { useState, useEffect, useCallback } from 'react';
import logger from '../../utils/logger';

/**
 * Custom hook for localStorage management with error handling and type safety
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @param {Object} options - Configuration options
 * @param {boolean} options.serialize - Whether to JSON serialize the value (default: true)
 * @param {Function} options.onError - Error callback function
 * @returns {Array} - [value, setValue, removeValue]
 */
const useLocalStorage = (key, defaultValue, options = {}) => {
  const {
    serialize = true,
    onError = (error) => logger.error('localStorage error:', { key, error: error.message || error })
  } = options;

  // Initialize state with value from localStorage or default
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      
      return serialize ? JSON.parse(item) : item;
    } catch (error) {
      onError(error);
      return defaultValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        if (valueToStore === undefined || valueToStore === null) {
          window.localStorage.removeItem(key);
        } else {
          const serializedValue = serialize ? JSON.stringify(valueToStore) : valueToStore;
          window.localStorage.setItem(key, serializedValue);
        }
      }
    } catch (error) {
      onError(error);
    }
  }, [key, serialize, storedValue, onError]);

  // Remove value from localStorage and reset to default
  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      onError(error);
    }
  }, [key, defaultValue, onError]);

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = serialize ? JSON.parse(e.newValue) : e.newValue;
          setStoredValue(newValue);
        } catch (error) {
          onError(error);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(defaultValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue, serialize, onError]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
