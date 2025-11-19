import { createSlice } from '@reduxjs/toolkit'
import logger from '../utils/logger'

// Safe localStorage getter with error handling
const getInitialState = () => {
    try {
        const stored = localStorage.getItem('cart');
        if (stored) {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : [];
        }
        return [];
    } catch (error) {
        logger.error('Error reading cart from localStorage', { error: error.message });
        // Clear corrupted localStorage data
        localStorage.removeItem('cart');
        return [];
    }
};

const initialState = getInitialState();

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const existingItem = state.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity || 1;
            } else {
                state.push(action.payload);
            }
        },
        deleteFromCart(state, action) {
            return state.filter(item => item.id !== action.payload.id);
        },
        incrementQuantity: (state, action) => {
            const item = state.find(item => item.id === action.payload);
            if (item) {
                item.quantity++;
            }
        },
        decrementQuantity: (state, action) => {
            const item = state.find(item => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity--;
            }
        },
        clearCart: (state) => {
            return [];
        },
        updateCartItem: (state, action) => {
            const { id, updates } = action.payload;
            const itemIndex = state.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                state[itemIndex] = { ...state[itemIndex], ...updates };
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { 
    addToCart, 
    deleteFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    clearCart, 
    updateCartItem
} = cartSlice.actions

export default cartSlice.reducer