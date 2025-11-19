// UserDashboard.js - Refactored with Admin-style Layout
import React, { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { supabase } from "../../supabase/supabaseConfig";
import { addToCart } from "../../redux/cartSlice";
import { serifTheme } from "../../design-system/themes";
import { SerifButton, SerifBadge } from "../../design-system/components";
import logger from "../../utils/logger";
import {
    FiUser, FiMail, FiCalendar, FiShoppingBag, FiLogOut, FiMenu, FiX, FiHome
} from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

// Import modular components
import { TrackingModal } from "./components";
import { OrdersTab, ReviewsTab } from "./tabs";
import { generateInvoice } from "./utils/invoiceGenerator";
import { TAB_ORDERS, TAB_REVIEWS } from "./constants";

/**
 * Main User Dashboard Component with Admin-style Layout
 */
const UserDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const context = useContext(myContext);
    
    // Secure user state from Supabase auth
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    
    // Dashboard state
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [activeTab, setActiveTab] = useState(TAB_ORDERS);
    const [orderView, setOrderView] = useState("all");
    const [trackingModal, setTrackingModal] = useState({ isOpen: false, order: null });
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Reviews state
    const [userReviews, setUserReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewsFilter, setReviewsFilter] = useState('all');
    
    const userId = useMemo(() => (currentUser?.id || currentUser?.uid || null), [currentUser]);
    const { loading = false, getAllOrder = [], getAllOrderFunction } = context || {};
    
    // Navigation items
    const navigationItems = [
        { id: TAB_ORDERS, name: 'My Orders', icon: <BsBoxSeam size={20} /> },
        { id: TAB_REVIEWS, name: 'My Reviews', icon: <FaStar size={20} /> }
    ];
    
    // Secure user verification
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                
                if (error || !user) {
                    logger.info('UserDashboard: No user session found');
                    navigate('/login');
                    return;
                }

                const { data: userRecord, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (userError || !userRecord) {
                    logger.error('UserDashboard: Error fetching user data', { error: userError?.message });
                    navigate('/login');
                    return;
                }

                setCurrentUser(userRecord);
            } catch (error) {
                logger.error('UserDashboard: Error verifying user', { error: error.message });
                navigate('/login');
            } finally {
                setUserLoading(false);
            }
        };

        verifyUser();
    }, [navigate]);

    // Fetch orders when user is verified or when returning from purchase
    useEffect(() => {
        if (userId && getAllOrderFunction) {
            getAllOrderFunction();
        }
    }, [userId, getAllOrderFunction]);

    // Filter user orders
    const userOrders = useMemo(() => {
        if (!getAllOrder || !userId) return [];
        return getAllOrder.filter(order => {
            const orderUserId = order.userid ?? order.userId ?? order.user_id ?? null;
            return orderUserId === userId;
        }).sort((a, b) => {
            const dateA = new Date(a.date || a.created_at || 0);
            const dateB = new Date(b.date || b.created_at || 0);
            return dateB - dateA;
        });
    }, [getAllOrder, userId]);

    // Calculate total amount for an order
    const calculateTotalAmount = (order) => {
        const cartItems = order.cartItems || order.cart_items || [];
        return cartItems.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity, 10) || 0;
            return sum + (price * quantity);
        }, 0);
    };

    // Stats
    const totalOrders = userOrders.length;
    const totalSpent = useMemo(() => {
        return userOrders.reduce((sum, order) => sum + calculateTotalAmount(order), 0);
    }, [userOrders]);

    const statusStats = useMemo(() => {
        const stats = { active: 0, previous: 0 };
        if (!getAllOrder || !userId) return stats;
        
        getAllOrder.forEach(order => {
            const orderUserId = order.userid ?? order.userId ?? order.user_id ?? null;
            if (orderUserId === userId) {
                if (['placed', 'pending', 'processing', 'shipped'].includes(order.status)) {
                    stats.active++;
                } else if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
                    stats.previous++;
                }
            }
        });
        return stats;
    }, [getAllOrder, userId]);
    
    const lastOrderDate = useMemo(() => {
        if (!userOrders.length || !userOrders[0]?.date) return 'N/A';
        try { return new Date(userOrders[0].date).toLocaleDateString(); } catch { return 'Invalid Date'; }
    }, [userOrders]);
    
    // Fetch reviews when Reviews tab is active
    useEffect(() => {
        const fetchUserReviews = async () => {
            if (!userId || activeTab !== TAB_REVIEWS || userReviews.length > 0) return;
        
            setLoadingReviews(true);
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const normalizedReviews = (data || []).map((item) => {
                    const createdAt = item.created_at ? new Date(item.created_at) : null;
                    return {
                        ...item,
                        productTitle: item.productTitle ?? item.product_title ?? '',
                        userId: item.userId ?? item.user_id ?? userId,
                        helpfulCount: item.helpfulCount ?? item.helpful_count ?? 0,
                        timestamp:
                            item.timestamp ??
                            (createdAt
                                ? {
                                      seconds: Math.floor(createdAt.getTime() / 1000),
                                      toDate: () => createdAt
                                  }
                                : null)
                    };
                });

                setUserReviews(normalizedReviews);
            } catch (error) {
                logger.error('Error fetching reviews', { error: error.message });
                toast.error('Failed to load your reviews');
            } finally {
                setLoadingReviews(false);
            }
        };

        fetchUserReviews();
    }, [activeTab, userId, userReviews.length]);

    
    // Show loading while verifying user
    if (userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }
    
    if (!currentUser) {
        return null;
    }

    // Event Handlers
    const toggleOrderExpand = (orderId) => setExpandedOrder(prev => (prev === orderId ? null : orderId));

    const handleGenerateInvoice = (order) => {
        generateInvoice(order, currentUser, calculateTotalAmount);
    };

    const requestRefund = (orderId) => {
        toast.success(`Refund requested for order #${orderId.substring(0, 8)}. We'll contact you soon.`);
    };

    const trackShipping = (orderId) => {
        const order = userOrders.find(o => o.id === orderId);
        if (order) {
            setTrackingModal({ isOpen: true, order });
        } else {
            toast.error("Order not found for tracking");
        }
    };

    const handleAddToCart = (item) => {
        dispatch(addToCart(item));
        toast.success(`${item.title} added to cart!`, {
            icon: <FiShoppingBag className="text-blue-500" />,
            style: {
                background: '#0a0a0a',
                color: '#fff',
                border: '1px solid #262626'
            },
            position: 'bottom-right'
        });
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            logger.error('Logout error:', { error: error.message });
            toast.error('Error logging out');
        }
    };

    const handleGoToHomepage = () => {
        navigate('/');
    };

    // Main Render
    return (
        <div className={`min-h-screen ${serifTheme.colors.background.primary}`} style={{ fontFamily: serifTheme.fontFamily.serif }}>
            {/* Mobile Header */}
            <div className={`lg:hidden fixed top-0 left-0 right-0 z-20 ${serifTheme.gradients.card} border-b ${serifTheme.colors.border.primary} backdrop-blur-xl`}>
                <div className="flex items-center justify-between p-4">
                    <h1 className={`text-xl font-bold ${serifTheme.colors.text.primary}`}>
                        My Dashboard
                    </h1>
                    <button
                        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        className={`p-2 ${serifTheme.radius.button} ${serifTheme.colors.text.primary} hover:bg-amber-50/50`}
                    >
                        {mobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileSidebarOpen && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="lg:hidden fixed inset-0 z-30"
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileSidebarOpen(false)} />
                        <div className={`absolute left-0 top-0 w-72 h-full ${serifTheme.gradients.card} shadow-xl border-r ${serifTheme.colors.border.primary}`}>
                            <div className="flex flex-col h-full">
                                {/* User Profile */}
                                <div className={`p-6 border-b ${serifTheme.colors.border.primary}`}>
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-full border-2 ${serifTheme.colors.border.secondary} bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl`}>
                                            👤
                                        </div>
                                        <div>
                                            <h2 className={`text-lg font-semibold ${serifTheme.colors.text.primary}`}>{currentUser?.name}</h2>
                                            <p className={`text-sm ${serifTheme.colors.text.tertiary}`}>{currentUser?.email}</p>
                                            <SerifBadge variant="secondary" size="small" className="mt-1">
                                                Customer
                                            </SerifBadge>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <nav className="flex-1 p-4">
                                    <div className="space-y-2">
                                        {navigationItems.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setActiveTab(item.id);
                                                    setMobileSidebarOpen(false);
                                                }}
                                                className={`w-full flex items-center px-4 py-3 ${serifTheme.radius.button} transition-all duration-200 ${
                                                    activeTab === item.id 
                                                        ? `${serifTheme.colors.button.secondary} ${serifTheme.colors.text.accent} border ${serifTheme.colors.border.primary}` 
                                                        : `${serifTheme.colors.text.secondary} hover:bg-amber-50/50`
                                                }`}
                                            >
                                                <span className="mr-3">{item.icon}</span>
                                                {item.name}
                                            </button>
                                        ))}
                                    </div>
                                </nav>

                                {/* Footer */}
                                <div className={`p-4 border-t ${serifTheme.colors.border.primary} space-y-3`}>
                                    <SerifButton
                                        onClick={handleGoToHomepage}
                                        variant="secondary"
                                        size="medium"
                                        fullWidth
                                        icon={<FiHome />}
                                    >
                                        Go to Homepage
                                    </SerifButton>
                                    <SerifButton
                                        onClick={handleLogout}
                                        variant="danger"
                                        size="medium"
                                        fullWidth
                                        icon={<FiLogOut />}
                                    >
                                        Logout
                                    </SerifButton>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className={`hidden lg:block fixed inset-y-0 left-0 w-80 ${serifTheme.gradients.card} shadow-xl border-r ${serifTheme.colors.border.primary}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className={`p-6 border-b ${serifTheme.colors.border.primary}`}>
                        <h1 className={`text-2xl font-bold ${serifTheme.colors.text.primary} flex items-center`}>
                            <FiUser className={`mr-3 ${serifTheme.colors.text.accent}`} />
                            My Dashboard
                        </h1>
                    </div>

                    {/* User Profile */}
                    <div className={`p-6 border-b ${serifTheme.colors.border.primary}`}>
                        <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full border-2 ${serifTheme.colors.border.secondary} bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl`}>
                                👤
                            </div>
                            <div>
                                <h2 className={`text-lg font-semibold ${serifTheme.colors.text.primary}`}>{currentUser?.name}</h2>
                                <p className={`text-sm ${serifTheme.colors.text.tertiary}`}>{currentUser?.email}</p>
                                <SerifBadge variant="secondary" size="small" className="mt-1">
                                    Customer
                                </SerifBadge>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className={`p-6 border-b ${serifTheme.colors.border.primary}`}>
                        <div className="space-y-3">
                            <div className={`${serifTheme.colors.background.secondary} p-3 ${serifTheme.radius.card}`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${serifTheme.colors.text.secondary}`}>Total Orders</span>
                                    <span className={`text-lg font-bold ${serifTheme.colors.text.primary}`}>{totalOrders}</span>
                                </div>
                            </div>
                            <div className={`${serifTheme.colors.background.secondary} p-3 ${serifTheme.radius.card}`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${serifTheme.colors.text.secondary}`}>Total Spent</span>
                                    <span className={`text-lg font-bold ${serifTheme.colors.text.primary}`}>रु {totalSpent.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className={`${serifTheme.colors.background.secondary} p-3 ${serifTheme.radius.card}`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${serifTheme.colors.text.secondary}`}>Last Order</span>
                                    <span className={`text-sm font-medium ${serifTheme.colors.text.primary}`}>{lastOrderDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <div className="space-y-2">
                            {navigationItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center px-4 py-3 ${serifTheme.radius.button} transition-all duration-200 ${
                                        activeTab === item.id 
                                            ? `${serifTheme.colors.button.secondary} ${serifTheme.colors.text.accent} border ${serifTheme.colors.border.primary}` 
                                            : `${serifTheme.colors.text.secondary} hover:bg-amber-50/50`
                                    }`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className={`p-4 border-t ${serifTheme.colors.border.primary} space-y-3`}>
                        <SerifButton
                            onClick={handleGoToHomepage}
                            variant="secondary"
                            size="medium"
                            fullWidth
                            icon={<FiHome />}
                        >
                            Go to Homepage
                        </SerifButton>
                        <SerifButton
                            onClick={handleLogout}
                            variant="danger"
                            size="medium"
                            fullWidth
                            icon={<FiLogOut />}
                        >
                            Logout
                        </SerifButton>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-80 pt-16 lg:pt-0">
                <div className="p-4 lg:p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className={`text-2xl lg:text-3xl font-bold ${serifTheme.colors.text.primary} mb-2`}>
                            {activeTab === TAB_ORDERS ? 'My Orders' : 'My Reviews'}
                        </h1>
                        <p className={`text-sm ${serifTheme.colors.text.secondary}`}>
                            {activeTab === TAB_ORDERS 
                                ? 'Track and manage your orders' 
                                : 'View and manage your product reviews'}
                        </p>
                    </div>

                    {/* Tab Content */}
                    {activeTab === TAB_ORDERS && (
                        <OrdersTab
                            userOrders={userOrders}
                            loading={loading}
                            expandedOrder={expandedOrder}
                            toggleOrderExpand={toggleOrderExpand}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            orderView={orderView}
                            setOrderView={setOrderView}
                            statusStats={statusStats}
                            totalSpent={totalSpent}
                            lastOrderDate={lastOrderDate}
                            calculateTotalAmount={calculateTotalAmount}
                            generateInvoice={handleGenerateInvoice}
                            requestRefund={requestRefund}
                            trackShipping={trackShipping}
                            handleAddToCart={handleAddToCart}
                        />
                    )}

                    {activeTab === TAB_REVIEWS && (
                        <ReviewsTab
                            userReviews={userReviews}
                            loadingReviews={loadingReviews}
                            reviewsFilter={reviewsFilter}
                            setReviewsFilter={setReviewsFilter}
                        />
                    )}

                </div>
            </div>

            {/* Tracking Modal */}
            <TrackingModal
                isOpen={trackingModal.isOpen}
                onClose={() => setTrackingModal({ isOpen: false, order: null })}
                order={trackingModal.order}
                calculateTotalAmount={calculateTotalAmount}
            />
        </div>
    );
};

export default UserDashboard;
