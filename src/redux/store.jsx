import { configureStore } from '@reduxjs/toolkit' 
import cartSlice from './cartSlice'

// Middleware to persist cart to localStorage
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Only persist if it's a cart-related action
  if (action.type?.startsWith('cart/')) {
    const state = store.getState();
    try {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
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