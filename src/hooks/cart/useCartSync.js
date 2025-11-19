import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    addToCart,
    deleteFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart
} from '../../redux/cartSlice';

export const useCartSync = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [pendingProduct, setPendingProduct] = useState(null);

    // Check if user is authenticated
    const isAuthenticated = useCallback(() => {
        try {
            const user = localStorage.getItem('users');
            return user && JSON.parse(user);
        } catch {
            return false;
        }
    }, []);

    // Add to cart with authentication check
    const addToCartWithSync = useCallback((product) => {
        if (!isAuthenticated()) {
            // Show login popup for guest users
            setPendingProduct(product);
            setShowLoginPopup(true);
            return false; // Indicate that item was not added
        }
        
        // User is authenticated, add to cart
        dispatch(addToCart(product));
        return true; // Indicate that item was added
    }, [dispatch, isAuthenticated]);

    // Simple remove from cart - localStorage only
    const removeFromCartWithSync = useCallback((product) => {
        dispatch(deleteFromCart(product));
    }, [dispatch]);

    // Simple increment quantity - localStorage only
    const incrementQuantityWithSync = useCallback((productId) => {
        dispatch(incrementQuantity(productId));
    }, [dispatch]);

    // Simple decrement quantity - localStorage only
    const decrementQuantityWithSync = useCallback((productId) => {
        const item = cartItems.find(item => item.id === productId);
        if (!item || item.quantity <= 1) return;
        
        dispatch(decrementQuantity(productId));
    }, [dispatch, cartItems]);

    // Clear cart function
    const clearUserCart = useCallback(() => {
        dispatch(clearCart());
    }, [dispatch]);

    // Close login popup
    const closeLoginPopup = useCallback(() => {
        setShowLoginPopup(false);
        setPendingProduct(null);
    }, []);

    // Add pending product after login (to be called after successful login)
    const addPendingProduct = useCallback(() => {
        if (pendingProduct && isAuthenticated()) {
            dispatch(addToCart(pendingProduct));
            setPendingProduct(null);
            return true;
        }
        return false;
    }, [pendingProduct, dispatch, isAuthenticated]);

    return {
        cartItems,
        addToCartWithSync,
        removeFromCartWithSync,
        incrementQuantityWithSync,
        decrementQuantityWithSync,
        clearUserCart,
        showLoginPopup,
        closeLoginPopup,
        pendingProduct,
        addPendingProduct,
        isAuthenticated: isAuthenticated()
    };
};

export default useCartSync;
