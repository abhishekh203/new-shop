/**
 * Redux Barrel Export
 * 
 * Centralized exports for Redux store and actions.
 * This allows for cleaner imports like:
 * import { store, addToCart, deleteFromCart } from '@redux';
 */

// Store
export { store } from './store';

// Cart actions and reducer
export { 
  addToCart, 
  deleteFromCart, 
  incrementQuantity, 
  decrementQuantity, 
  clearCart, 
  updateCartItem 
} from './cartSlice';

export { default as cartReducer } from './cartSlice';
