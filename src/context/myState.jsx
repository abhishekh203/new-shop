/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, useCallback } from 'react';
import MyContext from './myContext';
import { supabase } from '../supabase/supabaseConfig';
import { normalizeProduct, normalizeOrder, normalizeReview } from '../utils/dataNormalization';
import toast from 'react-hot-toast';
import logger from '../utils/logger';

function MyState({ children }) {
    // Loading State 
    const [loading, setLoading] = useState(false);

    // User State
    const [getAllProduct, setGetAllProduct] = useState([]);

    // Order State 
    const [getAllOrder, setGetAllOrder] = useState([]);

    // User State 
    const [getAllUser, setGetAllUser] = useState([]);

    // Review State 
    const [getAllReview, setGetAllReview] = useState([]);

    // Refs to store subscription channels and cleanup functions
    const subscriptionsRef = useRef({
        products: { channel: null, cleanup: null },
        orders: { channel: null, cleanup: null },
        users: { channel: null, cleanup: null },
        reviews: { channel: null, cleanup: null }
    });
    
    // Track subscription status to prevent duplicate subscriptions
    const [subscriptionStatus, setSubscriptionStatus] = useState({
        products: false,
        orders: false,
        users: false,
        reviews: false
    });

    const fetchProducts = useCallback(async (options = { showToast: false }) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                throw error;
            }

            const normalizedProducts = (data || []).map(normalizeProduct);

            setGetAllProduct(normalizedProducts);
        } catch (error) {
            logger.error('Products fetch error:', { error: error.message || error });
            if (options.showToast) {
                toast.error('Failed to load products. Please refresh the page.');
            }
        }
    }, []);

    const fetchOrders = useCallback(async (options = { showToast: false }) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                throw error;
            }

            const normalizedOrders = (data || []).map(normalizeOrder);

            setGetAllOrder(normalizedOrders);
        } catch (error) {
            logger.error('Orders fetch error:', { error: error.message || error });
            if (options.showToast) {
                toast.error('Failed to load orders. Please refresh the page.');
            }
        }
    }, []);

    const fetchUsers = useCallback(async (options = { showToast: false }) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                throw error;
            }

            setGetAllUser(data || []);
        } catch (error) {
            logger.error('Users fetch error:', { error: error.message || error });
            if (options.showToast) {
                toast.error('Failed to load users. Please refresh the page.');
            }
        }
    }, []);

    const fetchReviews = useCallback(async (options = { showToast: false }) => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            const normalizedReviews = (data || []).map(normalizeReview);

            setGetAllReview(normalizedReviews);
        } catch (error) {
            logger.error('Reviews fetch error:', { error: error.message || error });
            if (options.showToast) {
                toast.error('Failed to load reviews. Please refresh the page.');
            }
        }
    }, []);

    /**========================================================================
     *                          GET All Product Function
     *========================================================================**/
    const getAllProductFunction = useCallback(async () => {
        setLoading(true);
        try {
            await fetchProducts({ showToast: true });
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);

    /**========================================================================
     *                           GET All Order Function
     *========================================================================**/
    const getAllOrderFunction = useCallback(async () => {
        setLoading(true);
        try {
            await fetchOrders({ showToast: true });
        } finally {
            setLoading(false);
        }
    }, [fetchOrders]);

    /**========================================================================
     *                           GET All User Function
     *========================================================================**/
    const getAllUserFunction = useCallback(async () => {
        setLoading(true);
        try {
            await fetchUsers({ showToast: true });
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    /**========================================================================
     *                           GET All Review Function
     *========================================================================**/
    const getAllReviewFunction = useCallback(async () => {
        setLoading(true);
        try {
            await fetchReviews({ showToast: true });
        } finally {
            setLoading(false);
        }
    }, [fetchReviews]);

    // Enhanced subscription management with error handling and status tracking
    const createSubscription = useCallback((tableName, fetchFunction) => {
        const subscriptionKey = tableName.replace('s', ''); // products -> product
        
        // Cleanup existing subscription
        const existing = subscriptionsRef.current[subscriptionKey];
        if (existing.channel) {
            try {
                supabase.removeChannel(existing.channel);
            } catch (error) {
                logger.warn('Error removing existing ${tableName} subscription:', { context: error });
            }
        }
        
        // Create new subscription with error handling
        const channel = supabase
            .channel(`${tableName}-changes-${Date.now()}`) // Unique channel name
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: tableName }, 
                (payload) => {
                    logger.debug('${tableName} change detected:', { context: payload.eventType });
                    // Debounce rapid changes
                    if (existing.debounceTimer) {
                        clearTimeout(existing.debounceTimer);
                    }
                    existing.debounceTimer = setTimeout(() => {
                        fetchFunction({ showToast: false });
                    }, 500);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    logger.debug('✅ Subscribed to ${tableName} changes');
                    setSubscriptionStatus(prev => ({ ...prev, [subscriptionKey]: true }));
                } else if (status === 'CHANNEL_ERROR') {
                    logger.error('❌ Error subscribing to ${tableName} changes');
                    setSubscriptionStatus(prev => ({ ...prev, [subscriptionKey]: false }));
                } else if (status === 'CLOSED') {
                    logger.debug('🔌 ${tableName} subscription closed');
                    setSubscriptionStatus(prev => ({ ...prev, [subscriptionKey]: false }));
                }
            });

        // Store subscription reference
        subscriptionsRef.current[subscriptionKey] = {
            channel,
            cleanup: () => {
                if (existing.debounceTimer) {
                    clearTimeout(existing.debounceTimer);
                }
                try {
                    supabase.removeChannel(channel);
                } catch (error) {
                    logger.warn('Error cleaning up ${tableName} subscription:', { context: error });
                }
                setSubscriptionStatus(prev => ({ ...prev, [subscriptionKey]: false }));
            },
            debounceTimer: null
        };
        
        return subscriptionsRef.current[subscriptionKey].cleanup;
    }, []);

    const subscribeToProducts = useCallback(() => {
        return createSubscription('products', fetchProducts);
    }, [createSubscription, fetchProducts]);

    const subscribeToOrders = useCallback(() => {
        return createSubscription('orders', fetchOrders);
    }, [createSubscription, fetchOrders]);

    const subscribeToUsers = useCallback(() => {
        return createSubscription('users', fetchUsers);
    }, [createSubscription, fetchUsers]);

    const subscribeToReviews = useCallback(() => {
        return createSubscription('reviews', fetchReviews);
    }, [createSubscription, fetchReviews]);


    useEffect(() => {
        // Initialize data fetching
        const initializeData = async () => {
            try {
                await Promise.all([
                    getAllProductFunction(),
                    getAllOrderFunction(),
                    getAllUserFunction(),
                    getAllReviewFunction()
                ]);
                
                // Set up subscriptions after initial data load
                const cleanupFunctions = [
                    subscribeToProducts(),
                    subscribeToOrders(),
                    subscribeToUsers(),
                    subscribeToReviews()
                ];
                
                // Store cleanup functions for later use
                subscriptionsRef.current.cleanupAll = () => {
                    cleanupFunctions.forEach(cleanup => {
                        if (typeof cleanup === 'function') {
                            cleanup();
                        }
                    });
                };
            } catch (error) {
                logger.error('Error initializing data:', { error: error.message || error });
                toast.error('Failed to initialize application data');
            }
        };

        initializeData();

        // Cleanup function
        return () => {
            // Clean up all subscriptions
            Object.values(subscriptionsRef.current).forEach((subscription) => {
                if (subscription && typeof subscription.cleanup === 'function') {
                    subscription.cleanup();
                }
            });
            
            // Clear any remaining timers
            Object.values(subscriptionsRef.current).forEach((subscription) => {
                if (subscription && subscription.debounceTimer) {
                    clearTimeout(subscription.debounceTimer);
                }
            });
        };
    }, []); // Empty dependency array to run only once

    return (
        <MyContext.Provider value={{
            loading,
            setLoading,
            getAllProduct,
            getAllProductFunction,
            getAllOrder,
            getAllOrderFunction,
            getAllUser,
            getAllUserFunction,
            getAllReview,
            getAllReviewFunction,
            subscriptionStatus // Add subscription status for debugging/monitoring
        }}>
            {children}
        </MyContext.Provider>
    );
}

export default MyState;