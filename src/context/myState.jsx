/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import MyContext from './myContext';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { fireDB } from '../firebase/FirebaseConfig';
import toast from 'react-hot-toast';

function MyState({ children }) {
    // Loading State 
    const [loading, setLoading] = useState(false);

    // User State
    const [getAllProduct, setGetAllProduct] = useState([]);

    // Refs to store unsubscribe functions
    const unsubscribeRefs = useRef({
        products: null,
        orders: null,
        users: null,
        reviews: null
    });

    /**========================================================================
     *                          GET All Product Function
     *========================================================================**/

    const getAllProductFunction = async () => {
        setLoading(true);
        try {
            // Clean up existing listener
            if (unsubscribeRefs.current.products) {
                unsubscribeRefs.current.products();
            }

            const q = query(
                collection(fireDB, "products"),
                orderBy('time')
            );
            
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let productArray = [];
                QuerySnapshot.forEach((doc) => {
                    productArray.push({ ...doc.data(), id: doc.id });
                });
                setGetAllProduct(productArray);
                setLoading(false);
            }, (error) => {
                console.error("Products listener error:", error);
                setLoading(false);
                toast.error("Failed to load products. Please refresh the page.");
            });

            // Store unsubscribe function
            unsubscribeRefs.current.products = unsubscribe;
        } catch (error) {
            console.error("Products function error:", error);
            setLoading(false);
            toast.error("Failed to initialize products.");
        }
    }

    // Order State 
    const [getAllOrder, setGetAllOrder] = useState([]);

    /**========================================================================
     *                           GET All Order Function
     *========================================================================**/

    const getAllOrderFunction = async () => {
        setLoading(true);
        try {
            // Clean up existing listener
            if (unsubscribeRefs.current.orders) {
                unsubscribeRefs.current.orders();
            }

            const q = query(
                collection(fireDB, "order"),
                orderBy('time')
            );
            
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let orderArray = [];
                QuerySnapshot.forEach((doc) => {
                    orderArray.push({ ...doc.data(), id: doc.id });
                });
                setGetAllOrder(orderArray);
                setLoading(false);
            }, (error) => {
                console.error("Orders listener error:", error);
                setLoading(false);
                toast.error("Failed to load orders. Please refresh the page.");
            });

            // Store unsubscribe function
            unsubscribeRefs.current.orders = unsubscribe;
        } catch (error) {
            console.error("Orders function error:", error);
            setLoading(false);
            toast.error("Failed to initialize orders.");
        }
    }

    // Delete order Function
    const orderDelete = async (id) => {
        setLoading(true)
        try {
            await deleteDoc(doc(fireDB, 'order', id))
            toast.success('Order Deleted successfully')
            getAllOrderFunction();
            setLoading(false)
        } catch (error) {
            console.error("Delete order error:", error)
            setLoading(false)
            toast.error("Failed to delete order.")
        }
    }

    // user State 
    const [getAllUser, setGetAllUser] = useState([]);

    /**========================================================================
     *                           GET All User Function
     *========================================================================**/

    const getAllUserFunction = async () => {
        setLoading(true);
        try {
            // Clean up existing listener
            if (unsubscribeRefs.current.users) {
                unsubscribeRefs.current.users();
            }

            const q = query(
                collection(fireDB, "user"),
                orderBy('time')
            );
            
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let userArray = [];
                QuerySnapshot.forEach((doc) => {
                    userArray.push({ ...doc.data(), id: doc.id });
                });
                setGetAllUser(userArray);
                setLoading(false);
            }, (error) => {
                console.error("Users listener error:", error);
                setLoading(false);
                toast.error("Failed to load users. Please refresh the page.");
            });

            // Store unsubscribe function
            unsubscribeRefs.current.users = unsubscribe;
        } catch (error) {
            console.error("Users function error:", error);
            setLoading(false);
            toast.error("Failed to initialize users.");
        }
    }

    // Review State 
    const [getAllReview, setGetAllReview] = useState([]);

    /**========================================================================
     *                           GET All Review Function
     *========================================================================**/

    const getAllReviewFunction = async () => {
        setLoading(true);
        try {
            // Clean up existing listener
            if (unsubscribeRefs.current.reviews) {
                unsubscribeRefs.current.reviews();
            }

            const q = query(
                collection(fireDB, "reviews"),
                orderBy('timestamp', 'desc')
            );
            
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let reviewArray = [];
                QuerySnapshot.forEach((doc) => {
                    reviewArray.push({ ...doc.data(), id: doc.id });
                });
                setGetAllReview(reviewArray);
                setLoading(false);
            }, (error) => {
                console.error("Reviews listener error:", error);
                setLoading(false);
                toast.error("Failed to load reviews. Please refresh the page.");
            });

            // Store unsubscribe function
            unsubscribeRefs.current.reviews = unsubscribe;
        } catch (error) {
            console.error("Reviews function error:", error);
            setLoading(false);
            toast.error("Failed to initialize reviews.");
        }
    }

    // Delete review Function
    const reviewDelete = async (id) => {
        setLoading(true)
        try {
            await deleteDoc(doc(fireDB, 'reviews', id))
            toast.success('Review deleted successfully')
            getAllReviewFunction();
            setLoading(false)
        } catch (error) {
            console.error("Delete review error:", error)
            setLoading(false)
            toast.error("Failed to delete review.")
        }
    }

    useEffect(() => {
        getAllProductFunction();
        getAllOrderFunction();
        getAllUserFunction();
        getAllReviewFunction();

        // Cleanup function
        return () => {
            // Clean up all listeners on unmount
            Object.values(unsubscribeRefs.current).forEach(unsubscribe => {
                if (unsubscribe) {
                    unsubscribe();
                }
            });
        };
    }, []);

    return (
        <MyContext.Provider value={{
            loading,
            setLoading,
            getAllProduct,
            getAllProductFunction,
            getAllOrder,
            orderDelete,
            getAllUser,
            getAllUserFunction,
            getAllReview,
            getAllReviewFunction,
            reviewDelete
        }}>
            {children}
        </MyContext.Provider>
    )
}

export default MyState