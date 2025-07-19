// UserDashboard.js - Improved Version (Standalone)
import React, { useContext, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"; // Assuming BrowserRouter is setup in your main App
import Layout from "../../components/layout/Layout"; // Your existing Layout path
import myContext from "../../context/myContext"; // Your existing context path
import Loader from "../../components/loader/Loader"; // Your existing Loader path
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import {
    FiUser, FiMail, FiCalendar, FiShoppingBag,
    FiClock, FiDownload, FiChevronDown, FiChevronUp,
    FiSearch, FiCreditCard,
    FiMapPin, FiRefreshCw, FiEdit3,
    FiCamera, FiSave, FiRotateCcw, FiInfo, FiSettings, FiX, FiHome, FiMessageCircle, FiBox
} from "react-icons/fi";
import {
    BsBoxSeam, BsCurrencyRupee,
    BsShieldCheck, BsQuestionCircle, BsLock, BsPhone
} from "react-icons/bs";
import {
    FaCheckCircle, FaTimesCircle, FaShippingFast,
    FaRegStar, FaStar, FaRegHeart, FaHeart, FaThumbsUp, FaCheck
} from "react-icons/fa";
import { RiRefund2Line, RiCustomerService2Line } from "react-icons/ri";
import { MdOutlineSecurity, MdDevicesOther } from "react-icons/md";
import { toast } from "react-hot-toast"; // Ensure Toaster is included in your Layout or App root
// import Chart from 'react-apexcharts'; // Keep commented if not used or causes issues
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, getDocs, orderBy, getDoc, doc } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

// --- Reusable Components (Place these in the same file or import from separate files) ---

// Enhanced Stats Card Component
const StatsCard = ({ title, value, icon, bgColor, textColor, footerText, footerIcon }) => {
    const IconComponent = icon;
    const FooterIcon = footerIcon;
    return (
        <motion.div
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-xl relative overflow-hidden"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 rounded-2xl"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-400 mb-2">{title}</p>
                        <p className="text-3xl font-black text-white">{value}</p>
                    </div>
                    <motion.div
                        className={`p-3 rounded-xl ${bgColor} ${textColor} shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <IconComponent className="w-6 h-6" />
                    </motion.div>
                </div>
                {footerText && (
                    <div className="flex items-center text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                        {FooterIcon && <FooterIcon className="mr-2 w-4 h-4 text-cyan-400" />}
                        <span>{footerText}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Enhanced Product Card Component
const ProductCard = ({ item, isFavorite, onToggleFavorite, onAddToCart }) => {
    const rating = 4; // Static rating for example
    return (
        <motion.div
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/30 shadow-xl transition-all duration-300 relative"
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
        >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 rounded-2xl"></div>

            <div className="relative z-10">
                <div className="relative">
                    <img
                        src={item.productImageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/300/1f2937/9ca3af?text=No+Image";
                        }}
                    />
                    <motion.button
                        className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-700/50 transition-colors duration-200 hover:bg-red-600/20"
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                        aria-label={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isFavorite ? (
                            <FaHeart className="text-red-400 w-4 h-4" />
                        ) : (
                            <FaRegHeart className="text-gray-300 w-4 h-4" />
                        )}
                    </motion.button>
                    {item.category && (
                        <div className="absolute bottom-3 left-3">
                            <span className="bg-cyan-600/20 backdrop-blur-sm text-cyan-300 text-xs font-medium px-3 py-1 rounded-full border border-cyan-500/30 capitalize">
                                {item.category}
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-6">
                    <h3 className="font-bold text-white mb-2 line-clamp-1" title={item.title}>{item.title}</h3>
                    <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                            i < rating ? (
                                <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                            ) : (
                                <FaRegStar key={i} className="w-4 h-4 text-gray-500" />
                            )
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-white">रु {Number(item.price).toFixed(2)}</span>
                        <motion.button
                            onClick={() => onAddToCart(item)}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-200 shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Add to Cart
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};



// Order Card Component
const OrderCard = ({
    order,
    expandedOrder,
    onToggleExpand,
    onGenerateInvoice,
    onRequestRefund,
    onTrackShipping,
    onToggleFavorite,
    favorites,
    calculateTotalAmount,
    handleAddToCart
}) => {
    // ... (Keep the OrderCard component code from the previous response)
    const isExpanded = expandedOrder === order.id;
    const totalAmount = useMemo(() => calculateTotalAmount(order), [order, calculateTotalAmount]);



    return (
        <motion.div
            layout // Animate layout changes
            key={order.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm transition-all duration-300 border border-gray-200 dark:border-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ y: -3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
        >
            {/* Order Summary Header */}
            <div
                className="p-4 sm:p-6 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 touch-manipulation"
                onClick={() => onToggleExpand(order.id)}
                role="button"
                aria-expanded={isExpanded}
                aria-controls={`order-details-${order.id}`}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center text-gray-900 dark:text-white mb-1 font-medium">
                        <FiShoppingBag className="mr-2 text-blue-500 flex-shrink-0" />
                        <span className="truncate" title={`Order #${order.id}`}>Order #{order.id.substring(0, 8)}...</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 dark:text-gray-400 text-sm">
                        <div className="flex items-center">
                            <FiClock className="mr-1.5 flex-shrink-0" />
                            <span>{new Date(order.date).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                            <FiCreditCard className="mr-1.5 flex-shrink-0" />
                            <span className="capitalize">{order.paymentMethod || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-2 sm:mt-0 w-full sm:w-auto">
                    <div className="flex items-center justify-between sm:justify-start">
                         <span className="sm:hidden text-sm text-gray-500 dark:text-gray-400">Total:</span>
                        <div className="flex items-center">
                            <BsCurrencyRupee className="mr-1 text-green-600 dark:text-green-400 text-lg" />
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                                रु {totalAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>
                     <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap justify-center ${getStatusClasses(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                    </div>
                    <button
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition flex items-center justify-center text-sm p-2 rounded-full sm:bg-gray-100 sm:dark:bg-gray-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(order.id);
                        }}
                        aria-label={isExpanded ? "Collapse order details" : "Expand order details"}
                    >
                        {isExpanded ? (
                            <FiChevronUp className="w-5 h-5" />
                        ) : (
                            <FiChevronDown className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Order Details (Collapsible Content) */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        id={`order-details-${order.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="border-t border-gray-200 dark:border-gray-600 overflow-hidden"
                    >
                        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800">
                           {/* ... (rest of the expanded content: shipping, summary, items, actions) ... */}
                           {/* Shipping Info & Order Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Shipping Info */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                        <FiMapPin className="mr-2 text-blue-500" />
                                        Shipping Information
                                    </h3>
                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-sm space-y-2">
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <strong>Address:</strong> {order.shippingAddress || 'Not specified'}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <strong>Phone:</strong> {order.phoneNumber || 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                                {/* Order Summary */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                                                                    <FiBox className="mr-2 text-blue-500" />
                                        Order Summary
                                    </h3>
                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-sm space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                रु {totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700 dark:text-gray-300">Shipping:</span>
                                            <span className="text-gray-900 dark:text-white font-medium">रु 0.00</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700 dark:text-gray-300">Tax:</span>
                                            <span className="text-gray-900 dark:text-white font-medium">रु 0.00</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
                                            <span className="text-base font-semibold text-gray-900 dark:text-white">Total:</span>
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                रु {totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Order Items ({order.cartItems.length})</h3>
                            <div className="space-y-4 mb-6">
                                {order.cartItems.map((item, index) => (
                                    <div key={item.id || index} className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3 sm:p-4 gap-4 shadow-sm">
                                        <div className="flex-shrink-0 relative">
                                            <img
                                                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-md border border-gray-200 dark:border-gray-500 bg-white dark:bg-gray-800"
                                                src={item.productImageUrl}
                                                alt={item.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/100/f0f0f0/cccccc?text=No+Image";
                                                }}
                                            />
                                            <button
                                                className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/50"
                                                onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                                                aria-label={favorites.includes(item.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                            >
                                                {favorites.includes(item.id) ? (
                                                    <FaHeart className="text-red-500 w-4 h-4" />
                                                ) : (
                                                    <FaRegHeart className="text-gray-400 w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2">{item.title}</h4>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">{item.category}</p>
                                             <button
                                                onClick={() => handleAddToCart(item)} // Add Buy Again functionality
                                                className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                Buy Again
                                            </button>
                                        </div>
                                        <div className="text-left sm:text-right mt-2 sm:mt-0 w-full sm:w-auto">
                                            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                                रु {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">रु {Number(item.price).toFixed(2)} × {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                                {(order.status === STATUS_PLACED || order.status === STATUS_PENDING || order.status === STATUS_PROCESSING || order.status === STATUS_SHIPPED || order.status === STATUS_DELIVERED) && (
                                    <button
                                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center justify-center text-sm"
                                        onClick={() => onTrackShipping(order.id)}
                                    >
                                        <FaShippingFast className="mr-2" />
                                        Track Delivery
                                    </button>
                                )}
                                 <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center text-sm"
                                    onClick={() => onGenerateInvoice(order)}
                                >
                                    <FiDownload className="mr-2" />
                                    Download Invoice
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


// --- Constants ---
const WHATSAPP_SUPPORT_NUMBER = "+9779807677391"; // Example number
const TAB_ORDERS = "orders";
const TAB_WISHLIST = "wishlist";
const TAB_RECENT = "recent";
const TAB_REVIEWS = "reviews";
const TAB_SECURITY = "security";

const STATUS_DELIVERED = 'delivered';
const STATUS_PLACED = 'placed';
const STATUS_PENDING = 'pending';
const STATUS_PROCESSING = 'processing';
const STATUS_SHIPPED = 'shipped';
const STATUS_CANCELLED = 'cancelled';
const STATUS_REFUNDED = 'refunded';

// --- Shared Functions ---
// Helper function to get product names from cartItems
const getProductNames = (order) => {
    if (!order?.cartItems || !Array.isArray(order.cartItems)) return 'product';
    
    const productNames = order.cartItems.map(item => item.title || item.name).filter(Boolean);
    
    // Debug logging
    console.log('getProductNames debug:', {
        orderId: order?.id,
        cartItems: order?.cartItems,
        productNames: productNames
    });
    
    if (productNames.length === 0) return 'product';
    if (productNames.length === 1) return productNames[0];
    
    // For multiple products, show first product + " and X more"
    return `${productNames[0]} and ${productNames.length - 1} more`;
};

const getStatusClasses = (status) => {
    switch (status) {
        case STATUS_DELIVERED: return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200';
        case STATUS_PLACED: return 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200';
        case STATUS_PENDING: return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200';
        case STATUS_PROCESSING: return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200';
        case STATUS_SHIPPED: return 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200';
        case STATUS_CANCELLED: return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200';
        case STATUS_REFUNDED: return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200';
        default: return 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case STATUS_DELIVERED: return <FaCheckCircle className="mr-2" />;
        case STATUS_PLACED: return <FaCheckCircle className="mr-2" />;
        case STATUS_PENDING: return <FiClock className="mr-2" />;
        case STATUS_PROCESSING: return <FiRefreshCw className="mr-2" />;
        case STATUS_SHIPPED: return <FaShippingFast className="mr-2" />;
        case STATUS_CANCELLED: return <FaTimesCircle className="mr-2" />;
        case STATUS_REFUNDED: return <RiRefund2Line className="mr-2" />;
        default: return <BsBoxSeam className="mr-2" />;
    }
};

// --- Main Dashboard Component ---

const UserDashboard = () => {
    // Get user from localStorage (ensure it's set during login in your app)
    const user = useMemo(() => {
        const storedUser = localStorage.getItem('users');
        try {
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            console.log("UserDashboard Debug:", {
                hasStoredUser: !!storedUser,
                parsedUser: parsedUser ? { uid: parsedUser.uid, name: parsedUser.name } : null
            });
            return parsedUser;
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            return null; // Handle parsing error
        }
    }, []); // Re-calculate only if localStorage changes (rarely needed unless updated elsewhere)

    const context = useContext(myContext);
    const { loading = false, getAllOrder = [] } = context || {}; // Default values if context is not yet available
    
    // Add error boundary for context
    if (!context) {
        console.warn("UserDashboard: Context not available");
    }

    // Add mobile-specific optimizations
    useEffect(() => {
        // Prevent zoom on input focus on iOS
        const preventZoom = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                e.target.style.fontSize = '16px';
            }
        };
        
        document.addEventListener('focusin', preventZoom);
        return () => document.removeEventListener('focusin', preventZoom);
    }, []);

    const [expandedOrder, setExpandedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [activeTab, setActiveTab] = useState(TAB_ORDERS);
    const [orderView, setOrderView] = useState("all"); // "all", "active", or "previous"
    const [trackingModal, setTrackingModal] = useState({ isOpen: false, order: null });

    // Favorites state: Needs persistence (e.g., API call on change, load from API/localStorage on mount)
    const [favorites, setFavorites] = useState([]); // Initialize empty, load from persistent storage in useEffect

    // Placeholder state for actual Recently Viewed items
    // In a real app, fetch/load this data in useEffect
    const [recentlyViewedItems] = useState([]);

    // User's reviews state
    const [userReviews, setUserReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewsFilter, setReviewsFilter] = useState('all'); // all, pending, approved, rejected

    // Wishlist items state
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loadingWishlist, setLoadingWishlist] = useState(false);

    // Edit Profile Form State
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        address: {
            street: '',
            city: '',
            postalCode: '',
            country: 'Nepal'
        },
        preferences: {
            emailNotifications: true,
            smsNotifications: false,
            marketingCommunications: true
        }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Initialize form data when user data is available
    useEffect(() => {
        if (user) {
            setEditFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dob: user.dob || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    postalCode: user.address?.postalCode || '',
                    country: user.address?.country || 'Nepal'
                },
                preferences: {
                    emailNotifications: user.preferences?.emailNotifications !== false,
                    smsNotifications: user.preferences?.smsNotifications === true,
                    marketingCommunications: user.preferences?.marketingCommunications !== false
                }
            });
        }
    }, [user]);

    // Handle form input changes
    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setEditFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setEditFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
        setIsEditing(true);
        // Clear error for this field
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        
        if (!editFormData.name.trim()) {
            errors.name = 'Name is required';
        }
        
        if (!editFormData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (editFormData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(editFormData.phone.replace(/\s/g, ''))) {
            errors.phone = 'Please enter a valid phone number';
        }
        
        if (editFormData.dob) {
            const today = new Date();
            const birthDate = new Date(editFormData.dob);
            if (birthDate > today) {
                errors.dob = 'Date of birth cannot be in the future';
            }
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Fetch wishlist items from Firebase
    const fetchWishlistItems = async () => {
        if (!user?.uid || favorites.length === 0) {
            setWishlistItems([]);
            return;
        }
        
        setLoadingWishlist(true);
        try {
            const productsRef = collection(fireDB, 'products');
            const wishlistItems = [];
            
            // Fetch each product by ID from favorites
            for (const productId of favorites) {
                try {
                    const docRef = doc(productsRef, productId);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        wishlistItems.push({
                            id: docSnap.id,
                            ...docSnap.data()
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching product ${productId}:`, error);
                }
            }
            
            setWishlistItems(wishlistItems);
        } catch (error) {
            console.error('Error fetching wishlist items:', error);
            toast.error('Failed to load wishlist items');
        } finally {
            setLoadingWishlist(false);
        }
    };

    // Fetch user's reviews
    const fetchUserReviews = async () => {
        if (!user?.uid) return;
        
        setLoadingReviews(true);
        try {
            const reviewsRef = collection(fireDB, 'reviews');
            const q = query(
                reviewsRef,
                where('userId', '==', user.uid),
                orderBy('timestamp', 'desc')
            );
            
            const querySnapshot = await getDocs(q);
            const reviews = [];
            querySnapshot.forEach((doc) => {
                reviews.push({ id: doc.id, ...doc.data() });
            });
            setUserReviews(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load your reviews');
        } finally {
            setLoadingReviews(false);
        }
    };

    // Load favorites, reviews, and other items
    useEffect(() => {
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem(`favorites_${user?.uid}`);
        if (savedFavorites) {
            try {
                setFavorites(JSON.parse(savedFavorites));
            } catch (e) { console.error("Failed to parse favorites"); }
        }

        // Load user's reviews
        fetchUserReviews();

        // TODO: Load wishlistItems and recentlyViewedItems from your API or storage
        // setWishlistItems(api.fetchWishlist(user?.uid));
        // setRecentlyViewedItems(api.fetchRecent(user?.uid));
    }, [user?.uid]); // Re-run if user changes

    // Fetch wishlist items when favorites change
    useEffect(() => {
        fetchWishlistItems();
    }, [favorites, user?.uid]);




    // Dark mode state management - default to dark mode
    const [darkMode, setDarkMode] = useState(() => {
        try {
            const savedMode = localStorage.getItem('darkMode');
            if (savedMode !== null) return JSON.parse(savedMode);
            return true; // Default to dark mode
        } catch (error) {
            console.error("Error reading dark mode preference:", error);
            return true; // Default to dark mode
        }
    });

    // Apply dark mode class
    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);

    // Memoized function for calculating total amount
    const calculateTotalAmount = useMemo(() => {
        return (order) => {
            if (!order?.cartItems) return 0;
            return order.cartItems.reduce((total, item) => {
                const price = Number(item?.price) || 0;
                const quantity = Number(item?.quantity) || 0;
                return total + (price * quantity);
            }, 0);
        };
    }, []);

    // Filter and sort orders based on search, view, and sort criteria
    const userOrders = useMemo(() => {
        if (!getAllOrder || !user?.uid) return [];

        const filteredOrders = getAllOrder
            .filter(order => {
                // Filter by user
                const matchesUser = order.userid === user.uid;
                if (!matchesUser) return false;

                // Filter by search term
                const matchesSearch = !searchTerm || 
                    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.cartItems?.some(item => 
                        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                // Filter by order view (active vs previous vs all)
                const isActiveOrder = ['placed', 'pending', 'processing', 'shipped'].includes(order.status);
                const isPreviousOrder = ['delivered', 'cancelled', 'refunded'].includes(order.status);
                
                let matchesView = true; // Default to show all
                if (orderView === "active") {
                    matchesView = isActiveOrder;
                } else if (orderView === "previous") {
                    matchesView = isPreviousOrder;
                }
                // If orderView === "all", matchesView remains true

                return matchesSearch && matchesView;
            })
            .sort((a, b) => {
                const dateA = a?.date ? new Date(a.date).getTime() : 0;
                const dateB = b?.date ? new Date(b.date).getTime() : 0;
                if (sortBy === "newest") return dateB - dateA;
                if (sortBy === "oldest") return dateA - dateB;
                const totalA = calculateTotalAmount(a);
                const totalB = calculateTotalAmount(b);
                if (sortBy === "highest") return totalB - totalA;
                if (sortBy === "lowest") return totalA - totalB;
                return 0;
            });

        // Debug logging
        console.log('UserDashboard Debug:', {
            totalOrders: getAllOrder.length,
            userOrders: filteredOrders.length,
            orderView,
            userUid: user?.uid,
            orderStatuses: getAllOrder.filter(o => o.userid === user?.uid).map(o => o.status),
            filteredOrderStatuses: filteredOrders.map(o => o.status),
            userOrdersDetails: filteredOrders.map(o => ({ id: o.id, status: o.status, date: o.date }))
        });

        return filteredOrders;
    }, [getAllOrder, user?.uid, searchTerm, orderView, sortBy, calculateTotalAmount]);

    // --- Derived State & Memos ---
    const totalSpent = useMemo(() => userOrders.reduce((total, order) => total + calculateTotalAmount(order), 0), [userOrders, calculateTotalAmount]);
    const statusStats = useMemo(() => {
        const stats = { active: 0, previous: 0 };
        if (!getAllOrder || !user?.uid) return stats;
        
        getAllOrder.forEach(order => {
            if (order.userid === user.uid) {
                if (['placed', 'pending', 'processing', 'shipped'].includes(order.status)) {
                    stats.active++;
                } else if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
                    stats.previous++;
                }
            }
        });
        return stats;
    }, [getAllOrder, user?.uid]);
    const lastOrderDate = useMemo(() => {
        if (!userOrders.length || !userOrders[0]?.date) return 'N/A';
        try { return new Date(userOrders[0].date).toLocaleDateString(); } catch { return 'Invalid Date'; }
    }, [userOrders]);

     // --- Event Handlers ---
    const toggleOrderExpand = (orderId) => setExpandedOrder(prev => (prev === orderId ? null : orderId));

    // Invoice Generation (Same logic as before, using the constant)
     const generateInvoice = (order) => {
        // ... (Keep the generateInvoice function code from the previous response, ensure it uses WHATSAPP_SUPPORT_NUMBER)
        if (!order || !user) {
            toast.error("Cannot generate invoice: Missing order or user data.");
            return;
        }
        const toastId = toast.loading("Generating invoice...");
        try {
            const orderIdShort = order.id ? order.id.substring(0, 8) : 'N/A';
            const orderTotal = calculateTotalAmount(order).toFixed(2);
            const itemsHTML = order.cartItems?.map(item => `
                <tr>
                    <td>${item.title || 'N/A'}</td>
                    <td class="capitalize">${item.category || 'N/A'}</td>
                                                <td>रु ${Number(item.price).toFixed(2) || '0.00'}</td>
                    <td class="text-center">${item.quantity || 0}</td>
                            <td class="text-right">रु ${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</td>
                </tr>
            `).join('') || '<tr><td colspan="5" class="text-center">No items found</td></tr>';

             // Use template literals and default values for safety
            const invoiceHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invoice #${orderIdShort}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 20px; font-size: 14px; line-height: 1.6; color: #111827; background-color: #f9fafb; }
                    .container { max-width: 800px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
                    .logo-section .logo { font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 5px; }
                    .logo-section p { font-size: 12px; color: #6b7280; margin: 0; }
                    .invoice-meta { text-align: right; }
                    .invoice-title { font-size: 28px; font-weight: bold; color: #111827; margin-bottom: 8px; }
                    .invoice-meta p { margin: 3px 0; font-size: 13px; color: #4b5563; }
                    .invoice-meta p strong { color: #1f2937; }
                    .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-bottom: 40px; }
                    .customer-info, .shipping-info { margin-bottom: 0; } /* Removed bottom margin as grid handles gap */
                    .section-title { font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb; }
                    .info-block p { margin: 4px 0; font-size: 14px; color: #374151; }
                    .info-block p strong { font-weight: 500; color: #111827; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
                    th { background-color: #f3f4f6; text-align: left; padding: 10px 8px; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
                    td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
                    tbody tr:last-child td { border-bottom: none; }
                    .summary-box { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
                    .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                    .summary-row span:first-child { color: #4b5563; }
                    .summary-row span:last-child { font-weight: 500; color: #1f2937; }
                    .summary-total { font-size: 16px; font-weight: 600; padding-top: 10px; margin-top: 10px; border-top: 1px solid #e5e7eb; }
                    .summary-total span:last-child { font-size: 18px; }
                    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
                    .whatsapp-support { margin: 20px 0; padding: 15px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; text-align: center; }
                    .whatsapp-support p { margin: 8px 0; font-size: 13px; }
                    .whatsapp-link { display: inline-block; color: #16a34a; font-weight: bold; text-decoration: none; margin-top: 10px; padding: 8px 15px; border: 1px solid #16a34a; border-radius: 6px; transition: all 0.3s; }
                    .whatsapp-link:hover { background-color: #16a34a; color: white; }
                    .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; line-height: 1; text-transform: capitalize; }
                    .status-delivered { background-color: #D1FAE5; color: #065F46; }
                    .status-pending { background-color: #FEF3C7; color: #92400E; }
                    .status-cancelled { background-color: #FEE2E2; color: #991B1B; }
                    .status-refunded { background-color: #EDE9FE; color: #5B21B6; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="invoice-header">
                        <div class="logo-section">
                            <div class="logo">Digital Shop Nepal</div>
                            <p>Kathmandu, Nepal</p>
                            <p>+9779807677391</p>
                        </div>
                        <div class="invoice-meta">
                            <h1 class="invoice-title">INVOICE</h1>
                            <p><strong>Order #:</strong> ${orderIdShort}</p>
                            <p><strong>Date:</strong> ${new Date(order.date || Date.now()).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> <span class="badge status-${order.status || 'unknown'}">${order.status || 'N/A'}</span></p>
                        </div>
                    </div>

                    <div class="details-grid">
                        <div class="customer-info info-block">
                            <h3 class="section-title">Customer Details</h3>
                            <p><strong>Name:</strong> ${user?.name || 'N/A'}</p>
                            <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
                        </div>

                        <div class="shipping-info info-block">
                            <h3 class="section-title">Shipping Details</h3>
                            <p><strong>Address:</strong> ${order.shippingAddress || 'Not specified'}</p>
                            <p><strong>Phone:</strong> ${order.phoneNumber || 'Not specified'}</p>
                            <p><strong>Payment:</strong> <span class="capitalize">${order.paymentMethod || 'Not specified'}</span></p>
                        </div>
                    </div>

                    <h3 class="section-title">Order Items</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Category</th>
                                <th>Unit Price</th>
                                <th class="text-center">Qty</th>
                                <th class="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHTML}
                        </tbody>
                    </table>

                    <div style="display: flex; justify-content: flex-end;">
                       <div class="summary-box" style="width: 100%; max-width: 350px;">
                            <div class="summary-row">
                                <span>Subtotal:</span>
                                <span>रु ${orderTotal}</span>
                            </div>
                            <div class="summary-row">
                                <span>Shipping:</span>
                                <span>रु 0.00</span>
                            </div>
                            <div class="summary-row">
                                <span>Tax (0%):</span>
                                <span>रु 0.00</span>
                            </div>
                            <div class="summary-row summary-total">
                                <span>Total:</span>
                                <span>रु ${orderTotal}</span>
                            </div>
                        </div>
                     </div>

                    <div class="footer">
                        <div class="whatsapp-support">
                            <p>Thank you for your purchase! We appreciate your business ❤️</p>
                            <p>If you have any questions about your order or don't receive updates within 30 minutes, our support team is happy to help:</p>
                            <a href="https://wa.me/${WHATSAPP_SUPPORT_NUMBER.replace('+', '')}" target="_blank" rel="noopener noreferrer" class="whatsapp-link">
                                WhatsApp Support: ${WHATSAPP_SUPPORT_NUMBER}
                            </a>
                        </div>
                        <p>© ${new Date().getFullYear()} Digital Shop Nepal. All rights reserved.</p>
                        <p style="margin-top: 10px;">This is a computer-generated invoice. No signature required.</p>
                    </div>
                </div>
            </body>
            </html>
            `;

            const blob = new Blob([invoiceHTML], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice_${orderIdShort}.html`;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success("Invoice downloaded!", { id: toastId });
        } catch (error) {
            toast.error("Failed to generate invoice", { id: toastId });
            console.error("Invoice generation error:", error);
        }
    };

    // Refund Request
    const requestRefund = (orderId) => {
        toast.success(`Refund requested for order #${orderId.substring(0, 8)}. We'll contact you soon.`);
        // TODO: Implement API call for refund request
    };

    // Track Shipping
    const trackShipping = (orderId) => {
        const order = userOrders.find(o => o.id === orderId);
        if (order) {
            setTrackingModal({ isOpen: true, order });
        } else {
            toast.error("Order not found for tracking");
        }
    };

    // Toggle Favorite
    const toggleFavorite = (productId) => {
        const isCurrentlyFavorite = favorites.includes(productId);
        const newFavorites = isCurrentlyFavorite
            ? favorites.filter(id => id !== productId)
            : [...favorites, productId];

        setFavorites(newFavorites);
        // Persist favorites
        try {
            localStorage.setItem(`favorites_${user?.uid}`, JSON.stringify(newFavorites));
        } catch (e) { console.error("Failed to save favorites"); }

        toast.success(isCurrentlyFavorite ? 'Removed from Wishlist' : 'Added to Wishlist', { duration: 1500 });
        // TODO: Add API call to sync favorites with backend if needed
    };

    // Add to Cart functionality
    const dispatch = useDispatch();
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

    // Profile edit handlers
    const handleSaveProfile = async () => {
        if (!validateForm()) {
            toast.error("Please fix the errors before saving");
            return;
        }

        try {
            // Here you would typically update the user data in Firebase
            // For now, we'll just update localStorage and show success
            const updatedUser = {
                ...user,
                ...editFormData,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem('users', JSON.stringify(updatedUser));
            
            // Update the user state in context if needed
            // context.updateUser(updatedUser);
            
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    const handleResetForm = () => {
        if (user) {
            setEditFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dob: user.dob || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    postalCode: user.address?.postalCode || '',
                    country: user.address?.country || 'Nepal'
                },
                preferences: {
                    emailNotifications: user.preferences?.emailNotifications !== false,
                    smsNotifications: user.preferences?.smsNotifications === true,
                    marketingCommunications: user.preferences?.marketingCommunications !== false
                }
            });
        }
        setFormErrors({});
        setIsEditing(false);
        toast.info("Form reset to original values");
    };

     // Render Fallback if user data is not loaded
    if (!user) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
                    {loading ? <Loader /> : (
                        <div className="text-center p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
                            <h2 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Access Denied</h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">Please log in to view your dashboard.</p>
                             <Link to="/login" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                                Go to Login
                             </Link>
                        </div>
                    )}
                </div>
            </Layout>
        );
     }

    // --- Main Render ---
    return (
        <Layout>
            <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Modern Background Pattern */}
                <div className="absolute inset-0 opacity-3">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #1f2937 0%, transparent 50%),
                                         radial-gradient(circle at 75% 75%, #374151 0%, transparent 50%)`,
                        backgroundSize: '150px 150px'
                    }}></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-20 left-10 w-24 h-24 bg-gray-800/20 rounded-full blur-2xl"
                        animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute top-40 right-20 w-20 h-20 bg-gray-700/20 rounded-full blur-2xl"
                        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute bottom-32 left-1/4 w-32 h-32 bg-gray-600/20 rounded-full blur-2xl"
                        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
                



                <div className="max-w-7xl mx-auto relative z-10 px-2 sm:px-0">
                    {/* Enhanced User Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-2xl p-6 mb-8 overflow-hidden relative"
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 rounded-2xl"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative flex-shrink-0">
                                <motion.img
                                    src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                    alt="User Profile"
                                    className="w-24 h-24 rounded-full border-4 border-cyan-400/50 object-cover shadow-xl bg-gray-800"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                                    }}
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <motion.div
                                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full p-2 shadow-lg border-2 border-gray-900"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <FiUser className="text-white text-sm" />
                                </motion.div>

                                {/* Status Indicator */}
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                            </div>
                            <div className="text-center sm:text-left flex-1 relative z-10">
                                <motion.h1
                                    className="text-3xl md:text-4xl font-black text-white mb-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{user?.name || 'User'}</span>!
                                </motion.h1>

                                <motion.div
                                    className="flex flex-col sm:flex-row gap-4 mb-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-full backdrop-blur-sm">
                                        <FiMail className="text-cyan-400" />
                                        <span className="text-sm text-gray-300 truncate" title={user?.email}>{user?.email || 'No Email'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-full backdrop-blur-sm">
                                        <FiCalendar className="text-green-400" />
                                        <span className="text-sm text-gray-300">Member since: {user?.date ? new Date(user.date).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-full backdrop-blur-sm">
                                        <FiShoppingBag className="text-blue-400" />
                                        <span className="text-sm text-gray-300 capitalize">{user?.role || 'User'}</span>
                                    </div>
                                </motion.div>

                                {/* User Status Badge */}
                                <motion.div
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                >
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-green-300 font-medium text-sm">Premium Member</span>
                                </motion.div>
                            </div>
                            <motion.div
                                className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 relative z-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                            >
                                <motion.button
                                    onClick={() => setActiveTab(TAB_SECURITY)}
                                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 text-sm flex items-center justify-center shadow-lg"
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(6, 182, 212, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiEdit3 className="mr-2 w-4 h-4"/> Edit Profile
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Enhanced Dashboard Tabs */}
                    <motion.div
                                className="mb-6 sm:mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/30 p-2 shadow-xl">
                                    <nav className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2 touch-pan-x -mx-1 px-1">
                                {[
                                    { name: TAB_ORDERS, label: "Orders", icon: BsBoxSeam, count: userOrders.length },
                                    { name: TAB_WISHLIST, label: "Wishlist", icon: FaRegHeart, count: favorites.length },
                                    { name: TAB_RECENT, label: "Recent", icon: FiRefreshCw, count: recentlyViewedItems.length },
                                    { name: TAB_REVIEWS, label: "Reviews", icon: FaStar, count: userReviews.length },
                                    { name: TAB_SECURITY, label: "Profile", icon: FiEdit3, count: null }
                                ].map(tab => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.name;
                                    return (
                                        <motion.button
                                            key={tab.name}
                                            onClick={() => setActiveTab(tab.name)}
                                            className={`relative whitespace-nowrap py-3 px-4 sm:px-6 font-medium text-xs sm:text-sm flex items-center rounded-xl transition-all duration-300 flex-shrink-0 ${
                                                isActive
                                                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                                                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                            }`}
                                            role="tab"
                                            aria-selected={isActive}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Icon className={`mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                                            {tab.count !== null && tab.count > 0 && (
                                                <motion.span
                                                    className={`ml-1 sm:ml-2 text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                                                        isActive
                                                            ? 'bg-white/20 text-white'
                                                            : 'bg-gray-600/50 text-gray-300'
                                                    }`}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    {tab.count}
                                                </motion.span>
                                            )}

                                            {/* Active indicator */}
                                            {isActive && (
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-xl"
                                                    layoutId="activeTab"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </nav>
                        </div>
                    </motion.div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Orders Tab */}
                            {activeTab === TAB_ORDERS && (
                                <div>
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                        <motion.div
                                            onClick={() => setOrderView("all")}
                                            className="cursor-pointer touch-manipulation"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                        <StatsCard title="Total Orders" value={userOrders.length} icon={BsBoxSeam} bgColor="bg-blue-100 dark:bg-blue-900/30" textColor="text-blue-600 dark:text-blue-400" footerText={`Last order: ${lastOrderDate}`} footerIcon={FiCalendar} />
                                        </motion.div>
                                        <motion.div
                                            onClick={() => setOrderView("all")}
                                            className="cursor-pointer"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <StatsCard title="Total Spent" value={`रु ${totalSpent.toFixed(2)}`} icon={BsCurrencyRupee} bgColor="bg-green-100 dark:bg-green-900/30" textColor="text-green-600 dark:text-green-400" footerText={`Avg: रु ${(totalSpent / (userOrders.length || 1)).toFixed(2)}`} footerIcon={FiCreditCard} />
                                        </motion.div>
                                        <motion.div
                                            onClick={() => setOrderView("active")}
                                            className="cursor-pointer"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <StatsCard title="Active Orders" value={statusStats.active} icon={FiRefreshCw} bgColor={orderView === "active" ? "bg-amber-200 dark:bg-amber-800/50" : "bg-amber-100 dark:bg-amber-900/30"} textColor="text-amber-600 dark:text-amber-400" footerText={`${statusStats.active} order${statusStats.active !== 1 ? 's' : ''} in progress`} />
                                        </motion.div>
                                        <motion.div
                                            onClick={() => setOrderView("previous")}
                                            className="cursor-pointer"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <StatsCard title="Previous Orders" value={statusStats.previous} icon={FaCheckCircle} bgColor={orderView === "previous" ? "bg-green-200 dark:bg-green-800/50" : "bg-green-100 dark:bg-green-900/30"} textColor="text-green-600 dark:text-green-400" footerText={`${statusStats.previous} completed order${statusStats.previous !== 1 ? 's' : ''}`} />
                                        </motion.div>
                                     </div>

                                     {/* Orders List Section */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-colors duration-300">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6 gap-4">
                                            <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                                <BsBoxSeam className="mr-3 text-blue-500" />
                                                Order History
                                            </h2>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {orderView === "active" ? "Showing active orders" : orderView === "previous" ? "Showing previous orders" : "Showing all orders"} 
                                                    ({userOrders.length} order{userOrders.length !== 1 ? 's' : ''})
                                                </p>
                                            </div>

                                            {/* Filters */}
                                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                                <div className="relative flex-1 min-w-0 sm:min-w-[180px]">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FiSearch className="text-gray-400 w-4 h-4" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Search orders..."
                                                        className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>

                                                <div className="flex gap-2">
                                                    <select
                                                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-3 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                                                        value={sortBy}
                                                        onChange={(e) => setSortBy(e.target.value)}
                                                         style={{ backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                                                    >
                                                        <option value="newest">Newest First</option>
                                                        <option value="oldest">Oldest First</option>
                                                        <option value="highest">Highest Amount</option>
                                                        <option value="lowest">Lowest Amount</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {loading && <Loader />}

                                        {!loading && userOrders.length === 0 && (
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 sm:p-8 text-center shadow-inner transition-colors duration-300 my-4 sm:my-6 border border-gray-200 dark:border-gray-600">
                                                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                                                    <BsBoxSeam className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-300" />
                                                </div>
                                                <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {searchTerm ? "No orders match your search" : orderView === "active" ? "No active orders" : orderView === "previous" ? "No previous orders" : "No orders found"}
                                                </h3>
                                                <p className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                                                    {searchTerm ? "Try adjusting your search terms." : orderView === "active" ? "Click on 'All Orders' to see all your orders." : orderView === "previous" ? "Click on 'All Orders' to see all your orders." : "You haven't placed any orders yet."}
                                                </p>
                                                {orderView !== "all" && (
                                                    <div className="mb-3 sm:mb-4">
                                                        <button
                                                            onClick={() => setOrderView("all")}
                                                            className="inline-flex items-center px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium mr-2 touch-manipulation"
                                                        >
                                                            View All Orders
                                                        </button>
                                                    </div>
                                                )}
                                                <Link
                                                    to="/" // Link to homepage or products page
                                                    className="inline-flex items-center px-5 py-3 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm touch-manipulation"
                                                >
                                                    Start Shopping
                                                </Link>
                                            </div>
                                        )}

                                        {!loading && userOrders.length > 0 && (
                                            <div className="space-y-4">
                                                <AnimatePresence initial={false}>
                                                    {userOrders.map((order) => (
                                                        <OrderCard
                                                            key={order.id}
                                                            order={order}
                                                            expandedOrder={expandedOrder}
                                                            onToggleExpand={toggleOrderExpand}
                                                            onGenerateInvoice={generateInvoice}
                                                            onRequestRefund={requestRefund}
                                                            onTrackShipping={trackShipping}
                                                            onToggleFavorite={toggleFavorite}
                                                            favorites={favorites}

                                                            calculateTotalAmount={calculateTotalAmount}
                                                            handleAddToCart={handleAddToCart}
                                                        />
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Wishlist Tab */}
                             {activeTab === TAB_WISHLIST && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-colors duration-300">
                                    {/* ... (Wishlist Tab JSX - same as before) ... */}
                                     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                            <FaHeart className="mr-3 text-red-500" />
                                            Your Wishlist
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {wishlistItems.length} item(s) saved
                                        </p>
                                    </div>

                                    {/* Loading state for wishlist items */}
                                    {loadingWishlist ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : favorites.length === 0 ? (
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 sm:p-8 text-center shadow-inner transition-colors duration-300 my-4 sm:my-6 border border-gray-200 dark:border-gray-600">
                                            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                                                <FaRegHeart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-300" />
                                            </div>
                                            <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Your wishlist is empty</h3>
                                            <p className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">Save items you love by clicking the heart icon.</p>
                                            <Link
                                                to="/"
                                                className="inline-flex items-center px-5 py-3 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm touch-manipulation"
                                            >
                                                Browse Products
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                            <AnimatePresence>
                                                {wishlistItems.map((item) => (
                                                <ProductCard
                                                    key={item.id}
                                                    item={item}
                                                    isFavorite={true} // It's in the wishlist, so always true here
                                                    onToggleFavorite={toggleFavorite} // Still allow removal
                                                    onAddToCart={handleAddToCart}
                                                />
                                            ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Recently Viewed Tab */}
                             {activeTab === TAB_RECENT && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-colors duration-300">
                                     {/* ... (Recently Viewed Tab JSX - same as before) ... */}
                                     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                            <FiRefreshCw className="mr-3 text-blue-500" />
                                            Recently Viewed Items
                                        </h2>
                                         <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {recentlyViewedItems.length} item(s)
                                        </p>
                                    </div>

                                    {/* {recentLoading && <Loader />} */}

                                    {recentlyViewedItems.length === 0 ? (
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 sm:p-8 text-center shadow-inner transition-colors duration-300 my-4 sm:my-6 border border-gray-200 dark:border-gray-600">
                                            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                                                <BsQuestionCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-300" />
                                            </div>
                                            <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No recently viewed items</h3>
                                            <p className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">Your recently viewed products will appear here as you browse.</p>
                                            <Link
                                                to="/"
                                                className="inline-flex items-center px-5 py-3 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm touch-manipulation"
                                            >
                                                Browse Products
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                             <AnimatePresence>
                                                {recentlyViewedItems.map((item) => (
                                                    <ProductCard
                                                        key={item.id}
                                                        item={item}
                                                        isFavorite={favorites.includes(item.id)}
                                                        onToggleFavorite={toggleFavorite}
                                                        onAddToCart={handleAddToCart}
                                                    />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            )}


                            {/* Reviews Tab */}
                            {activeTab === TAB_REVIEWS && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-colors duration-300">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 sm:mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                                <FaStar className="text-yellow-400" />
                                                My Reviews
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                Manage and track your product reviews
                                            </p>
                                        </div>

                                        {/* Filter Reviews */}
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={reviewsFilter}
                                                onChange={(e) => setReviewsFilter(e.target.value)}
                                                className="px-4 py-3 sm:py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 text-sm"
                                            >
                                                <option value="all">All Reviews</option>
                                                <option value="pending">Pending Approval</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Reviews List */}
                                    {loadingReviews ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : userReviews.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FaStar className="mx-auto text-4xl text-gray-400 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                No reviews yet
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Start reviewing products you've purchased to help others make informed decisions.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <AnimatePresence>
                                                {userReviews
                                                    .filter(review => {
                                                        if (reviewsFilter === 'all') return true;
                                                        if (reviewsFilter === 'pending') return review.approved === undefined;
                                                        if (reviewsFilter === 'approved') return review.approved === true;
                                                        if (reviewsFilter === 'rejected') return review.approved === false;
                                                        return true;
                                                    })
                                                    .map((review) => (
                                                        <motion.div
                                                            key={review.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6"
                                                        >
                                                            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                                                {/* Review Status */}
                                                                <div className="flex items-center gap-2">
                                                                    {review.approved === true ? (
                                                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                                                                            Approved
                                                                        </span>
                                                                    ) : review.approved === false ? (
                                                                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                                                                            Rejected
                                                                        </span>
                                                                    ) : (
                                                                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
                                                                            Pending
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Review Content */}
                                                                <div className="flex-1">
                                                                    {/* Product Title */}
                                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                                        {review.productTitle || "Product"}
                                                                    </h4>

                                                                    {/* Rating */}
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <div className="flex">
                                                                            {[...Array(5)].map((_, i) => (
                                                                                <FaStar
                                                                                    key={i}
                                                                                    className={`w-4 h-4 ${
                                                                                        i < review.rating
                                                                                            ? 'text-yellow-400'
                                                                                            : 'text-gray-300 dark:text-gray-600'
                                                                                    }`}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                            {new Date(review.timestamp?.seconds * 1000).toLocaleDateString()}
                                                                        </span>
                                                                    </div>

                                                                    {/* Review Text */}
                                                                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                                                                        {review.review}
                                                                    </p>

                                                                    {/* Pros & Cons */}
                                                                    {(review.pros || review.cons) && (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                                            {review.pros && (
                                                                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                                                                    <h5 className="font-medium text-green-800 dark:text-green-400 mb-2">
                                                                                        👍 Pros
                                                                                    </h5>
                                                                                    <p className="text-green-700 dark:text-green-300 text-sm">
                                                                                        {review.pros}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                            {review.cons && (
                                                                                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                                                                    <h5 className="font-medium text-red-800 dark:text-red-400 mb-2">
                                                                                        👎 Cons
                                                                                    </h5>
                                                                                    <p className="text-red-700 dark:text-red-300 text-sm">
                                                                                        {review.cons}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {/* Helpful Count */}
                                                                    {review.helpfulCount > 0 && (
                                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                                            <FaThumbsUp className="w-4 h-4" />
                                                                            <span>{review.helpfulCount} found this helpful</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Edit Profile Tab */}
                             {activeTab === TAB_SECURITY && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-colors duration-300">
                                    <div className="max-w-4xl mx-auto">
                                        <div className="mb-8">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                                                <FiEdit3 className="mr-3 text-blue-500" />
                                                Edit Profile
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Update your personal information and account details
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Profile Information Form */}
                                            <div className="space-y-6">
                                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                        <FiUser className="mr-2 text-blue-500" />
                                                        Personal Information
                                                    </h3>
                                                    
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Full Name <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={editFormData.name}
                                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                                                                    formErrors.name 
                                                                        ? 'border-red-500 dark:border-red-500' 
                                                                        : 'border-gray-300 dark:border-gray-600'
                                                                }`}
                                                                placeholder="Enter your full name"
                                                            />
                                                            {formErrors.name && (
                                                                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                                            )}
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Email Address <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="email"
                                                                value={editFormData.email}
                                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                                                                    formErrors.email 
                                                                        ? 'border-red-500 dark:border-red-500' 
                                                                        : 'border-gray-300 dark:border-gray-600'
                                                                }`}
                                                                placeholder="Enter your email"
                                                            />
                                                            {formErrors.email && (
                                                                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                                            )}
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Phone Number
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                value={editFormData.phone}
                                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                                                                    formErrors.phone 
                                                                        ? 'border-red-500 dark:border-red-500' 
                                                                        : 'border-gray-300 dark:border-gray-600'
                                                                }`}
                                                                placeholder="Enter your phone number"
                                                            />
                                                            {formErrors.phone && (
                                                                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                                                            )}
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Date of Birth
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={editFormData.dob}
                                                                onChange={(e) => handleInputChange('dob', e.target.value)}
                                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                                                                    formErrors.dob 
                                                                        ? 'border-red-500 dark:border-red-500' 
                                                                        : 'border-gray-300 dark:border-gray-600'
                                                                }`}
                                                />
                                                            {formErrors.dob && (
                                                                <p className="text-red-500 text-sm mt-1">{formErrors.dob}</p>
                                                            )}
                                                        </div>
                                            </div>
                                        </div>

                                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                        <FiMapPin className="mr-2 text-blue-500" />
                                                        Address Information
                                                </h3>
                                                    
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Street Address
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={editFormData.address.street}
                                                                onChange={(e) => handleInputChange('address.street', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                                placeholder="Enter your street address"
                                                            />
                                            </div>
                                                        
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    City
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={editFormData.address.city}
                                                                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                                                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                                    placeholder="City"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                    Postal Code
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={editFormData.address.postalCode}
                                                                    onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                                                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                                    placeholder="Postal code"
                                                                />
                                                            </div>
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Country
                                                            </label>
                                                            <select
                                                                value={editFormData.address.country}
                                                                onChange={(e) => handleInputChange('address.country', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                            >
                                                                <option value="Nepal">Nepal</option>
                                                                <option value="India">India</option>
                                                                <option value="Bangladesh">Bangladesh</option>
                                                                <option value="Pakistan">Pakistan</option>
                                                                <option value="Sri Lanka">Sri Lanka</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                            </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Profile Picture & Preferences */}
                                            <div className="space-y-6">
                                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                        <FiCamera className="mr-2 text-blue-500" />
                                                        Profile Picture
                                                    </h3>
                                                    
                                                    <div className="text-center">
                                                        <div className="relative inline-block">
                                                            <motion.img
                                                                src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                                                alt="Profile Picture"
                                                                className="w-32 h-32 rounded-full border-4 border-gray-200 dark:border-gray-600 object-cover"
                                                                whileHover={{ scale: 1.05 }}
                                                                transition={{ duration: 0.2 }}
                                                            />
                                                            <motion.button
                                                                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <FiCamera className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                                                            Click the camera icon to upload a new photo
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                        <FiSettings className="mr-2 text-blue-500" />
                                                        Preferences
                                                    </h3>
                                                    
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">Receive order updates via email</p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={editFormData.preferences.emailNotifications}
                                                                    onChange={(e) => handleInputChange('preferences.emailNotifications', e.target.checked)}
                                                                    className="sr-only peer" 
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                            </label>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white">SMS Notifications</h4>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">Receive order updates via SMS</p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={editFormData.preferences.smsNotifications}
                                                                    onChange={(e) => handleInputChange('preferences.smsNotifications', e.target.checked)}
                                                                    className="sr-only peer" 
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                            </label>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white">Marketing Communications</h4>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">Receive promotional offers and updates</p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={editFormData.preferences.marketingCommunications}
                                                                    onChange={(e) => handleInputChange('preferences.marketingCommunications', e.target.checked)}
                                                                    className="sr-only peer" 
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                                                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center text-lg">
                                                        <FiInfo className="mr-2 w-5 h-5" />
                                                        Account Information
                                                </h3>
                                                    <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
                                                        <div className="flex justify-between">
                                                            <span>Member since:</span>
                                                            <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                                        <div className="flex justify-between">
                                                            <span>Last login:</span>
                                                            <span className="font-medium">{user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Account status:</span>
                                                            <span className="font-medium text-green-600 dark:text-green-400">Active</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                                            <motion.button
                                                onClick={handleSaveProfile}
                                                disabled={!isEditing}
                                                className={`flex-1 px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center ${
                                                    isEditing 
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                }`}
                                                whileHover={isEditing ? { scale: 1.02 } : {}}
                                                whileTap={isEditing ? { scale: 0.98 } : {}}
                                            >
                                                <FiSave className="mr-2" />
                                                {isEditing ? 'Save Changes' : 'No Changes'}
                                            </motion.button>
                                            <motion.button
                                                onClick={handleResetForm}
                                                disabled={!isEditing}
                                                className={`flex-1 px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center ${
                                                    isEditing 
                                                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500' 
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                }`}
                                                whileHover={isEditing ? { scale: 1.02 } : {}}
                                                whileTap={isEditing ? { scale: 0.98 } : {}}
                                            >
                                                <FiRotateCcw className="mr-2" />
                                                Reset Form
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Tracking Modal */}
            <AnimatePresence>
                {trackingModal.isOpen && trackingModal.order && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setTrackingModal({ isOpen: false, order: null })}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FaShippingFast className="w-6 h-6" />
                                        <div>
                                            <h2 className="text-xl font-bold">Digital Delivery Tracking</h2>
                                            <p className="text-blue-100 text-sm">
                                                Order #{trackingModal.order.id?.substring(0, 8)}
                                            </p>
                                        </div>
                                    </div>
                                                <button
                                        onClick={() => setTrackingModal({ isOpen: false, order: null })}
                                        className="text-white/80 hover:text-white transition-colors"
                                                >
                                        <FiX className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>

                            {/* Modal Content */}
                            <div className="p-4 space-y-4">
                                {/* Current Status */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Delivery Status</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Last updated: {trackingModal.order.date ? new Date(trackingModal.order.date).toLocaleString() : 'N/A'}
                                            </p>
                                    </div>
                                        <div className={`px-6 py-3 rounded-full text-sm font-bold ${getStatusClasses(trackingModal.order.status)} border-2 border-current`}>
                                            {getStatusIcon(trackingModal.order.status)}
                                            {trackingModal.order.status?.charAt(0).toUpperCase() + trackingModal.order.status?.slice(1)}
                                </div>
                                    </div>
                                </div>

                                {/* Tracking Timeline */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Digital Delivery Progress</h3>
                                    <div className="space-y-3">
                                        {/* Order Placed */}
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    ['placed', 'pending', 'processing', 'shipped', 'delivered'].includes(trackingModal.order.status) 
                                                        ? 'bg-green-500' 
                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                }`}>
                                                    {['placed', 'pending', 'processing', 'shipped', 'delivered'].includes(trackingModal.order.status) ? (
                                                        <FaCheck className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <FiClock className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white">Order Placed</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {trackingModal.order.date ? new Date(trackingModal.order.date).toLocaleString() : 'N/A'}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    Your {getProductNames(trackingModal.order)} order has been successfully placed and confirmed. We're preparing to process your order.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Processing */}
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    ['pending', 'processing', 'shipped', 'delivered'].includes(trackingModal.order.status) 
                                                        ? 'bg-blue-500' 
                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                }`}>
                                                    {['pending', 'processing', 'shipped', 'delivered'].includes(trackingModal.order.status) ? (
                                                        <FiRefreshCw className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <FiClock className="w-4 h-4 text-gray-400" />
                                                    )}
                </div>
            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white">Processing</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {['pending', 'processing', 'shipped', 'delivered'].includes(trackingModal.order.status) 
                                                        ? 'In Progress' 
                                                        : 'Pending'
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    Your {getProductNames(trackingModal.order)} is being prepared and processed. This usually takes 1-2 minutes.
                                                </p>
                                            </div>
                                        </div>

                                                                                {/* Shipped */}
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    ['shipped', 'delivered'].includes(trackingModal.order.status) 
                                                        ? 'bg-indigo-500' 
                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                }`}>
                                                    {['shipped', 'delivered'].includes(trackingModal.order.status) ? (
                                                        <FaShippingFast className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <FiBox className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white">Delivering</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {['shipped', 'delivered'].includes(trackingModal.order.status) 
                                                        ? 'Completed' 
                                                        : 'Pending'
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    Your {getProductNames(trackingModal.order)} has been processed and is being delivered to your email/WhatsApp. You'll receive it within 1 minute to 1 hour!
                                                </p>
                                            </div>
                                        </div>

                                        {/* Delivered */}
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    trackingModal.order.status === 'delivered' 
                                                        ? 'bg-green-500' 
                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                }`}>
                                                    {trackingModal.order.status === 'delivered' ? (
                                                        <FaCheckCircle className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <FiHome className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white">Delivered</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {trackingModal.order.status === 'delivered' 
                                                        ? 'Completed' 
                                                        : 'Pending'
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    Your {getProductNames(trackingModal.order)} has been successfully delivered to your email/WhatsApp. Thank you for your purchase!
                                                </p>
                                            </div>
                                        </div>

                                        {/* Cancelled/Refunded Status */}
                                        {(trackingModal.order.status === 'cancelled' || trackingModal.order.status === 'refunded') && (
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                                        {trackingModal.order.status === 'cancelled' ? (
                                                            <FaTimesCircle className="w-4 h-4 text-white" />
                                                        ) : (
                                                            <RiRefund2Line className="w-4 h-4 text-white" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {trackingModal.order.status === 'cancelled' ? 'Cancelled' : 'Refunded'}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {trackingModal.order.status === 'cancelled' ? 'Order Cancelled' : 'Refund Processed'}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {trackingModal.order.status === 'cancelled' 
                                                            ? 'This order has been cancelled.' 
                                                            : 'Your refund has been processed.'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Order Total</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                ₹ {calculateTotalAmount(trackingModal.order).toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Payment Method</p>
                                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                                                {trackingModal.order.paymentMethod || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Delivery Method</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                Email/WhatsApp
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400">Phone Number</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {trackingModal.order.phoneNumber || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Support Contact */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                                    <div className="flex items-center space-x-3">
                                        <FiMessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <h4 className="font-medium text-blue-800 dark:text-blue-200">Need Help?</h4>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                Contact our support team for any questions about your order delivery.
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={`https://wa.me/${WHATSAPP_SUPPORT_NUMBER.replace('+', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                        <FiMessageCircle className="mr-2" />
                                        WhatsApp Support
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default UserDashboard; // Export the component for use in your app