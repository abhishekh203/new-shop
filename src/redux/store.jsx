import { configureStore } from '@reduxjs/toolkit' 
import cartSlice from './cartSlice'
import logger from '../utils/logger'

// Middleware to persist cart to localStorage
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Persist cart to localStorage for all cart actions
  if (action.type?.startsWith('cart/')) {
    const state = store.getState();
    try {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    } catch (error) {
      logger.error('Error saving cart to localStorage', { error: error.message });
    }
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    cart : cartSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['cart/addToCart', 'cart/deleteFromCart'],
      },
    }).concat(localStorageMiddleware),
  devTools : true
})