import { createSlice } from '@reduxjs/toolkit'

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
        console.error('Error reading cart from localStorage:', error);
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
            state.push(action.payload)
        },
        deleteFromCart(state, action) {
            return state.filter(item => item.id != action.payload.id);
        },
        incrementQuantity: (state, action) => {
            state = state.map(item => {
                if (item.id === action.payload) {
                    item.quantity++;
                }
                return item;
            });
        },
        decrementQuantity: (state, action) => {
            state = state.map(item => {
                if (item.quantity !== 1) {
                    if (item.id === action.payload) {
                        item.quantity--;
                    }
                }
                return item;

            })
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
    },
})

// Action creators are generated for each case reducer function
export const { addToCart, deleteFromCart, incrementQuantity, decrementQuantity, clearCart, updateCartItem } = cartSlice.actions

export default cartSlice.reducer