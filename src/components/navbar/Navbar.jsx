import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
// Assuming SearchBar is available as a separate component in your project.
// If it is not, you would need to implement a placeholder component or remove its usage.
import SearchBar from "../searchBar/SearchBar";

// Assuming react-redux is installed and configured in your project.
// If not, you might need to manage cart state locally or set up Redux.
import { useSelector } from "react-redux";

// Assuming react-icons/fa is installed in your project.
// If not, you might need to use inline SVG or unicode characters for icons.
import {
    FaShoppingCart, FaPhoneAlt, FaUser, FaUserShield, FaSignInAlt,
    FaUserPlus, FaHome, FaBoxes, FaBars, FaTimes,
    FaQuestionCircle, FaInfoCircle, FaShoppingBag, FaEnvelope,
    FaChevronRight, FaSpinner, FaStar, FaSearch, FaChevronDown,
    FaCompass, FaHeadset
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

// --- Reusable Components ---

// Modern Desktop NavLink
const NavLink = ({ to, icon, text, delay = 0, onClick = () => {} }) => (
    <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 200, damping: 15 }}
    >
        <Link
            to={to}
            onClick={onClick}
            className="group relative flex items-center px-2 md:px-3 lg:px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-300 text-xs md:text-sm font-medium focus:outline-none focus-visible:text-gray-900 rounded-xl hover:bg-white/20"
        >
            <span className="mr-1 md:mr-2 text-sm md:text-base group-hover:scale-110 transition-transform duration-200">{icon}</span>
            <span className="relative font-medium">
                {text}
            </span>
        </Link>
    </motion.div>
);

// Enhanced Mobile NavLink with better touch targets
const MobileNavLink = ({ to, icon, text, onClick }) => (
    <Link
        to={to}
        onClick={onClick} // Close menu on click
        className="group flex items-center justify-between w-full px-6 py-5 text-left text-gray-200 hover:bg-gradient-to-r hover:from-gray-800/90 hover:to-gray-700/70 rounded-2xl transition-all duration-300 focus:outline-none focus-visible:bg-gray-800 focus-visible:ring-2 focus-visible:ring-teal-500 border border-transparent hover:border-teal-400/20 backdrop-blur-sm active:scale-95"
    >
        <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-400/10 group-hover:bg-teal-400/20 transition-colors duration-300 mr-4 shadow-sm">
                <span className="text-teal-400 text-xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
            </div>
            <span className="font-medium text-base group-hover:text-white transition-colors duration-200">{text}</span>
        </div>
        <FaChevronRight className="text-gray-500 text-sm group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-200" />
    </Link>
);

// Enhanced Cart Link with better mobile touch targets
const CartLink = ({ count, delay = 0, isMobile = false }) => {
    const commonClasses = "flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 relative focus:outline-none focus-visible:text-gray-900";
    const mobileWrapperClasses = "flex items-center justify-center w-12 h-12 text-gray-700 hover:text-gray-900 focus:outline-none rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 shadow-sm active:scale-95";
    const desktopClasses = "text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/20";

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, type: 'spring', stiffness: 200, damping: 15 }}
            className={isMobile ? mobileWrapperClasses : ""}
        >
            <Link
                to="/cart"
                aria-label={`Cart with ${count} items`}
                className={`${commonClasses} ${isMobile ? 'p-0' : desktopClasses}`}
            >
                <FaShoppingCart className={`${isMobile ? 'text-xl' : 'text-xl mr-2'}`} />
                {!isMobile && <span className="font-medium">Cart</span>}
                <AnimatePresence>
                    {count > 0 && (
                        <motion.span
                            key={count}
                            initial={{ scale: 0, y: -5 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                            className={`absolute ${isMobile ? '-top-1 -right-1' : '-top-1.5 -right-2'} bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg`}
                        >
                            {count > 9 ? '9+' : count}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>
        </motion.div>
    );
};

// --- Account Dropdown Component ---
const AccountDropdown = ({ user, logout, isOpen, onToggle, onClose }) => {
    const navigate = useNavigate();
    
    const handleDashboardClick = () => {
        const dashboardPath = user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
        navigate(dashboardPath);
        onClose();
    };

    const handleLogoutClick = () => {
        logout();
        onClose();
    };

    return (
        <div className="relative">
            {/* Dropdown Trigger */}
            <motion.button
                onClick={onToggle}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-300 text-sm font-medium focus:outline-none focus-visible:text-gray-900 rounded-xl hover:bg-white/20"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
            >
                <FaUser className="mr-2 text-base group-hover:scale-110 transition-transform duration-200" />
                <span className="relative font-medium">
                    My Account
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2"
                >
                    <FaChevronDown className="text-xs" />
                </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="py-2">
                            {/* Dashboard Link */}
                            <motion.button
                                onClick={handleDashboardClick}
                                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                                className="w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 transition-all duration-200 flex items-center text-sm font-medium"
                            >
                                {user?.role === 'admin' ? (
                                    <FaUserShield className="mr-3 text-base" />
                                ) : (
                                    <FaUser className="mr-3 text-base" />
                                )}
                                <span>
                                    {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                                </span>
                            </motion.button>

                            {/* Divider */}
                            <div className="h-px bg-gray-200 mx-2 my-1"></div>

                            {/* Logout Button */}
                            <motion.button
                                onClick={handleLogoutClick}
                                whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                                className="w-full text-left px-4 py-3 text-gray-700 hover:text-red-600 transition-all duration-200 flex items-center text-sm font-medium"
                            >
                                <FaSignInAlt className="mr-3 text-base rotate-180" />
                                <span>Logout</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Complaint Form Component ---
const ComplaintFormSection = ({ user, isVisible, onSubmit, isSubmitting, onClose }) => {
    const [complaintData, setComplaintData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        whatsappNumber: "",
        productPurchased: "",
        dateOfPurchase: "",
        problemDescription: ""
    });

    useEffect(() => {
        if (user) {
            setComplaintData(prev => ({
                ...prev,
                name: prev.name || user.name,
                email: prev.email || user.email
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setComplaintData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(complaintData);
    };

    const formVariants = {
        open: {
            height: "auto",
            opacity: 1,
            marginTop: '12px',
            transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.4 }
        },
        closed: {
            height: 0,
            opacity: 0,
            marginTop: '0px',
            transition: { duration: 0.3 }
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    variants={formVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-inner"
                >
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-teal-400 font-semibold flex items-center text-sm">
                                <FaInfoCircle className="mr-2" />
                                Product Support Form
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white p-1 transition-colors rounded-full focus:outline-none focus-visible:bg-gray-700"
                                aria-label="Close complaint form"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-1 gap-3">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={complaintData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={complaintData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                                <input
                                    type="tel"
                                    name="whatsappNumber"
                                    placeholder="WhatsApp Number"
                                    value={complaintData.whatsappNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    name="productPurchased"
                                    placeholder="Product Purchased"
                                    value={complaintData.productPurchased}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                                <input
                                    type="date"
                                    name="dateOfPurchase"
                                    placeholder="Date of Purchase"
                                    value={complaintData.dateOfPurchase}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                                <textarea
                                    name="problemDescription"
                                    placeholder="Describe your problem..."
                                    value={complaintData.problemDescription}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                />
                            </div>
                            <div className="pt-2">
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                    className={`w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center justify-center focus:outline-none focus-visible:ring-2 focus:focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-teal-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-teal-600 hover:to-blue-700'}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" /> Submitting...
                                        </>
                                    ) : (
                                        'Submit Complaint'
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// --- Enhanced Bottom Navigation Bar Component ---
const BottomNavigationBar = ({ user, cartCount }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [isPressed, setIsPressed] = useState(null);
    const [isHidden, setIsHidden] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(false);
    
    // Update active tab based on current location
    useEffect(() => {
        const path = window.location.pathname;
        if (path === '/') setActiveTab('home');
        else if (path === '/allproduct') setActiveTab('products');
        else if (path === '/cart') setActiveTab('cart');
        else if (path === '/ContactUs') setActiveTab('contact');
        else if (path.includes('dashboard') || path === '/login') setActiveTab('account');
    }, []);

    // Show close button after a delay when navigation appears
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCloseButton(true);
        }, 3000); // Show close button after 3 seconds

        return () => clearTimeout(timer);
    }, []);

    // Auto-show navigation if user navigates to cart page
    useEffect(() => {
        if (activeTab === 'cart') {
            setIsHidden(false);
        }
    }, [activeTab]);

    const navItems = [
        { 
            id: 'home', 
            icon: <FaHome />, 
            label: 'Home', 
            path: '/',
            color: 'from-blue-500 to-blue-600'
        },
        { 
            id: 'products', 
            icon: <FaBoxes />, 
            label: 'Products', 
            path: '/allproduct',
            color: 'from-purple-500 to-purple-600'
        },
        { 
            id: 'cart', 
            icon: <FaShoppingCart />, 
            label: 'Cart', 
            path: '/cart', 
            badge: cartCount,
            color: 'from-green-500 to-green-600',
            isSpecial: true // Mark cart as special for enhanced styling
        },
        { 
            id: 'contact', 
            icon: <FaEnvelope />, 
            label: 'Contact', 
            path: '/ContactUs',
            color: 'from-orange-500 to-orange-600'
        },
        { 
            id: 'account', 
            icon: user ? (user.role === 'admin' ? <FaUserShield /> : <FaUser />) : <FaUser />, 
            label: user ? 'Account' : 'Login', 
            path: user ? (user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard') : '/login',
            color: 'from-indigo-500 to-indigo-600'
        },
    ];

    const handleNavClick = (item) => {
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
        
        setActiveTab(item.id);
        navigate(item.path);
    };

    const handlePressStart = (itemId) => {
        setIsPressed(itemId);
    };

    const handlePressEnd = () => {
        setIsPressed(null);
    };

    const handleHideNavigation = () => {
        setIsHidden(true);
        // Add haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    const handleShowNavigation = () => {
        setIsHidden(false);
        setShowCloseButton(true);
    };

    // Don't render if hidden
    if (isHidden) {
        return (
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="fixed bottom-4 right-4 z-50 md:hidden"
            >
                <motion.button
                    onClick={handleShowNavigation}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white focus:outline-none"
                    style={{
                        boxShadow: "0 8px 32px rgba(20, 184, 166, 0.4)"
                    }}
                >
                    <FaBars className="text-lg" />
                </motion.button>
                {cartCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-lg border-2 border-white"
                    >
                        {cartCount > 99 ? '99+' : cartCount}
                    </motion.div>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ 
                y: 0, 
                opacity: 1, 
                scale: 1
            }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                duration: 0.4
            }}
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            {/* Enhanced background with gradient and blur */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/98 to-white/95 backdrop-blur-2xl border-t border-gray-200/80 shadow-2xl" />
            
            {/* Close button */}
            <AnimatePresence>
                {showCloseButton && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 180 }}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleHideNavigation}
                        className="absolute top-2 right-2 w-6 h-6 bg-gray-400/80 hover:bg-red-500/80 rounded-full flex items-center justify-center text-white text-xs transition-colors duration-200 z-10 shadow-lg"
                        style={{ backdropFilter: 'blur(10px)' }}
                    >
                        <FaTimes />
                    </motion.button>
                )}
            </AnimatePresence>
            
            {/* Navigation items container */}
            <div className="relative flex items-center justify-around px-2 py-3">
                {navItems.map((item, index) => {
                    const isActive = activeTab === item.id;
                    const isCartWithItems = item.id === 'cart' && item.badge > 0;
                    const isPressedItem = isPressed === item.id;
                    
                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => handleNavClick(item)}
                            onTouchStart={() => handlePressStart(item.id)}
                            onTouchEnd={handlePressEnd}
                            onMouseDown={() => handlePressStart(item.id)}
                            onMouseUp={handlePressEnd}
                            onMouseLeave={handlePressEnd}
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 500,
                                damping: 25
                            }}
                            className={`relative flex flex-col items-center justify-center min-w-[60px] h-16 rounded-2xl transition-all duration-300 ${
                                isActive 
                                    ? `bg-gradient-to-br ${item.color} text-white shadow-lg transform scale-105` 
                                    : isPressedItem
                                    ? 'bg-gray-200 text-gray-700 scale-95'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/80'
                            } ${isCartWithItems ? 'ring-2 ring-green-400/50 ring-offset-2' : ''}`}
                            style={{
                                boxShadow: isActive 
                                    ? `0 8px 25px -8px ${item.color.includes('green') ? 'rgba(34, 197, 94, 0.4)' : 
                                         item.color.includes('blue') ? 'rgba(59, 130, 246, 0.4)' :
                                         item.color.includes('purple') ? 'rgba(147, 51, 234, 0.4)' :
                                         item.color.includes('orange') ? 'rgba(249, 115, 22, 0.4)' :
                                         'rgba(99, 102, 241, 0.4)'}` 
                                    : 'none'
                            }}
                        >
                            {/* Icon container with enhanced animations */}
                            <motion.div 
                                className="relative mb-1"
                                animate={{ 
                                    scale: isActive ? 1.1 : 1,
                                    rotate: isCartWithItems && item.id === 'cart' ? [0, -10, 10, -5, 0] : 0
                                }}
                                transition={{ 
                                    scale: { duration: 0.2 },
                                    rotate: { duration: 0.6, repeat: isCartWithItems ? Infinity : 0, repeatDelay: 3 }
                                }}
                            >
                                <span className={`text-xl ${isActive ? 'text-white' : ''} transition-colors duration-200`}>
                                    {item.icon}
                                </span>
                                
                                {/* Enhanced badge for cart */}
                                {item.badge && item.badge > 0 && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: 0 }}
                                        animate={{ 
                                            scale: 1, 
                                            rotate: [0, -12, 12, -6, 0]
                                        }}
                                        transition={{
                                            scale: { type: "spring", stiffness: 500, damping: 15 },
                                            rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
                                        }}
                                        className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-lg border-2 border-white"
                                        style={{
                                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                                        }}
                                    >
                                        <motion.span
                                            key={item.badge}
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 600, damping: 20 }}
                                        >
                                            {item.badge > 99 ? '99+' : item.badge}
                                        </motion.span>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Label with better typography */}
                            <motion.span 
                                className={`text-xs font-semibold leading-tight ${
                                    isActive ? 'text-white' : 'text-gray-600'
                                } transition-colors duration-200`}
                                animate={{ 
                                    scale: isActive ? 1.05 : 1,
                                    fontWeight: isActive ? 700 : 600
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                {item.label}
                            </motion.span>

                            {/* Enhanced active indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-md"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 500, 
                                        damping: 20,
                                        delay: 0.1
                                    }}
                                />
                            )}

                            {/* Special glow effect for cart when it has items */}
                            {isCartWithItems && item.id === 'cart' && (
                                <motion.div
                                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/20 to-green-600/20"
                                    animate={{ 
                                        opacity: [0.3, 0.6, 0.3],
                                        scale: [1, 1.02, 1]
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Subtle bottom accent line */}
            <motion.div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            />
        </motion.div>
    );
};


// --- Main Navbar Component ---

const Navbar = () => {
    // Retrieve user data from localStorage
    const userString = localStorage.getItem("users");
    const user = userString ? JSON.parse(userString) : null;
    const navigate = useNavigate();
    // Get cart items from Redux store
    const cartItems = useSelector((state) => state.cart);
    // State for mobile menu visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // State for sticky navbar styling
    const [scrolled, setScrolled] = useState(false);
    // State for complaint form visibility
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    // State for complaint form submission status
    const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
    // State for account dropdown visibility
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    // State for navigation mode - automatically determined based on cart items
    const [navMode, setNavMode] = useState('hamburger');
    
    // Automatically show bottom nav when cart has items
    useEffect(() => {
        if (cartItems.length > 0) {
            setNavMode('bottom');
        } else {
            setNavMode('hamburger');
        }
    }, [cartItems.length]);

    // Ref for mobile menu to allow scrolling to bottom
    const menuRef = useRef(null);
    // Ref for account dropdown to handle outside clicks
    const accountDropdownRef = useRef(null);

    // Effect for managing scroll and resize events
    useEffect(() => {
        const handleResize = () => {
            // Close mobile menu and complaint form on desktop screens
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
                setShowComplaintForm(false);
            }
        };

        const handleScroll = () => {
            // Apply scrolled style if window is scrolled down
            setScrolled(window.scrollY > 5);
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);
        handleResize(); // Initial check on component mount

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Effect for blocking body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = ''; // Restore scrolling
        }
        // Cleanup body style on component unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Effect for handling clicks outside account dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
                setIsAccountDropdownOpen(false);
            }
        };

        if (isAccountDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAccountDropdownOpen]);

    // Logout function: clears user from localStorage and navigates to login
    const logout = () => {
        localStorage.removeItem("users");
        navigate("/login");
    };

    // Helper to close mobile menu and form
    const closeMobileElements = () => {
        setIsMenuOpen(false);
        setShowComplaintForm(false); // Ensure form is also closed
        setIsAccountDropdownOpen(false); // Close account dropdown as well
    };

    // Account dropdown handlers
    const toggleAccountDropdown = () => {
        setIsAccountDropdownOpen(!isAccountDropdownOpen);
    };

    const closeAccountDropdown = () => {
        setIsAccountDropdownOpen(false);
    };

    // Handle home link click: scrolls to top if already on homepage, else navigates
    const handleHomeClick = (e) => {
        if (window.location.pathname === '/') {
            e.preventDefault(); // Prevent full page reload
            window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
        } else {
            navigate("/"); // Navigate to homepage
            setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0); // Scroll to top after navigation
        }
        closeMobileElements(); // Close mobile menu after click
    };

    // Toggle mobile menu open/close
    const toggleMenu = () => {
        const opening = !isMenuOpen;
        setIsMenuOpen(opening);
        if (opening) {
            setShowComplaintForm(false); // Close complaint form if opening menu
        }
    };

    // Toggle complaint form visibility and scroll into view if opening
    const toggleComplaintFormVisibility = () => {
        const willBeVisible = !showComplaintForm;
        setShowComplaintForm(willBeVisible);
        
        if (willBeVisible && menuRef.current) {
            // Scroll the menu to the bottom to show the form
            setTimeout(() => {
                menuRef.current.scrollTo({
                    top: menuRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 300); // Wait for form animation
        }
    };

    // Handle complaint form submission
    const handleComplaintSubmit = useCallback((complaintData) => {
        setIsSubmittingComplaint(true);
        
        // Prepare WhatsApp message
        const message = `*COMPLAINT REPORT*\n\n` +
                       `*Name:* ${complaintData.name}\n` +
                       `*Email:* ${complaintData.email}\n` +
                       `*WhatsApp:* ${complaintData.whatsappNumber || 'Not provided'}\n` +
                       `*Product:* ${complaintData.productPurchased || 'Not specified'}\n` +
                       `*Purchase Date:* ${complaintData.dateOfPurchase || 'Not specified'}\n\n` +
                       `*Problem Description:*\n${complaintData.problemDescription}`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/9779860637648?text=${encodedMessage}`;
        
        // Simulate form processing delay
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            setIsSubmittingComplaint(false);
            setShowComplaintForm(false);
            // Optional: Show success message
        }, 1000);
    }, []);

    // Animation variants for a partial-screen menu drawer
    const menuVariants = {
        open: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30, 
                duration: 0.5, 
                staggerChildren: 0.08, 
                delayChildren: 0.15 
            }
        },
        closed: {
            y: "-100%",
            opacity: 0,
            scale: 0.95,
            transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 30, 
                duration: 0.3, 
                when: "afterChildren", 
                staggerChildren: 0.04, 
                staggerDirection: -1 
            }
        }
    };

    // Backdrop variant for overlay effect
    const backdropVariants = {
        open: { opacity: 1, transition: { duration: 0.3 } },
        closed: { opacity: 0, transition: { duration: 0.2 } }
    };

    // Animation variants for individual mobile menu items
    const mobileNavMenuItemVariants = {
        open: { 
            opacity: 1, 
            x: 0, 
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 } 
        },
        closed: { 
            opacity: 0, 
            x: 30, 
            y: -10,
            transition: { duration: 0.2 } 
        }
    };

    // Determine account link props based on user role
    const getAccountLinkProps = () => {
        if (user) {
            const isAdmin = user.role === 'admin';
            return {
                to: isAdmin ? '/admin-dashboard' : '/user-dashboard',
                icon: isAdmin ? <FaUserShield className="text-xl" /> : <FaUser className="text-xl" />,
                label: "Account Dashboard",
                text: isAdmin ? "Admin" : "My Account"
            };
        } else {
            return {
                to: '/login',
                icon: <FaUser className="text-xl" />,
                label: "Login or Sign Up",
                text: "Login"
            };
        }
    };

    const accountLinkProps = getAccountLinkProps();

    return (
        <>
            {/* Detached Floating Navbar */}
            <header className="fixed top-4 md:top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[82rem] px-3 md:px-4">
                <nav className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 ease-out hover:shadow-3xl">
                    <div className="px-3 md:px-4 lg:px-5 py-2 md:py-3">
                    {/* --- Modern Desktop Navigation (Visible on large screens and above) --- */}
                    <div className="hidden lg:flex items-center justify-between h-14">
                        {/* Brand/Logo Section (Left side of desktop nav) */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group">
                            <Link
                                to="/"
                                onClick={handleHomeClick}
                                className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                            >
                                <div className="relative">
                                    <img
                                        src="/img/digital.jpg"
                                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/1A202C/A0AEC0?text=DSN"; }}
                                        alt="Digital Shop Nepal Logo"
                                        className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-lg object-cover transition-all duration-300 shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-900 font-bold text-base md:text-lg lg:text-xl group-hover:text-gray-700 transition-all duration-300">
                                        Digital Shop Nepal
                                    </span>
                                    <span className="text-xs text-gray-600 group-hover:text-gray-500 transition-colors duration-300 font-medium">
                                        Your Digital Store
                                    </span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Search Bar Section (Center of desktop nav) */}
                        <div className="flex-1 max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-3 md:mx-4 lg:mx-6 xl:mx-8"> {/* Tablet optimized max-width */}
                            <div className="relative">
                                <SearchBar />
                            </div>
                        </div>

                        {/* Navigation Links and User Actions (Right side of desktop nav) */}
                        <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
                            {/* Added Home Link for desktop */}
                            <NavLink to="/" icon={<FaHome />} text="Home" delay={0.1} onClick={handleHomeClick} />
                            <NavLink to="/allproduct" icon={<FaBoxes />} text="All Products" delay={0.2} onClick={closeMobileElements} />
                            <NavLink to="/ContactUs" icon={<FaPhoneAlt />} text="Contact" delay={0.3} onClick={closeMobileElements} />

                            {/* Login/Signup for non-authenticated users */}
                            {!user && (
                                <>
                                    <NavLink to="/login" icon={<FaSignInAlt />} text="Login" delay={0.4} onClick={closeMobileElements} />
                                    <NavLink to="/signup" icon={<FaUserPlus />} text="Sign Up" delay={0.5} onClick={closeMobileElements} />
                                </>
                            )}
                            
                            <CartLink count={cartItems.length} isMobile={false} delay={0.6} />
                            
                            {/* Account dropdown after cart for authenticated users */}
                            {user && (
                                <div ref={accountDropdownRef}>
                                    <AccountDropdown 
                                        user={user}
                                        logout={logout}
                                        isOpen={isAccountDropdownOpen}
                                        onToggle={toggleAccountDropdown}
                                        onClose={closeAccountDropdown}
                                    />
                                </div>
                            )}
                            {/* Reviews link removed per request */}
                        </div>
                    </div>

                    {/* --- Tablet Navigation (Visible on medium screens only) --- */}
                    <div className="hidden md:flex lg:hidden items-center justify-between h-12">
                        {/* Brand/Logo Section (Left side of tablet nav) */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group">
                            <Link
                                to="/"
                                onClick={handleHomeClick}
                                className="flex items-center space-x-2 px-2 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                            >
                                <div className="relative">
                                    <img
                                        src="/img/digital.jpg"
                                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/1A202C/A0AEC0?text=DSN"; }}
                                        alt="Digital Shop Nepal Logo"
                                        className="h-8 w-8 rounded-lg object-cover transition-all duration-300 shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-900 font-bold text-sm group-hover:text-gray-700 transition-all duration-300">
                                        Digital Shop Nepal
                                    </span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Search Bar Section (Center of tablet nav) */}
                        <div className="flex-1 max-w-md mx-3">
                            <div className="relative">
                                <SearchBar />
                            </div>
                        </div>

                        {/* Navigation Links and User Actions (Right side of tablet nav) */}
                        <div className="flex items-center space-x-1">
                            {/* Compact navigation for tablet */}
                            <NavLink to="/" icon={<FaHome />} text="Home" delay={0.1} onClick={handleHomeClick} />
                            <NavLink to="/allproduct" icon={<FaBoxes />} text="Products" delay={0.2} onClick={closeMobileElements} />
                            <NavLink to="/ContactUs" icon={<FaPhoneAlt />} text="Contact" delay={0.3} onClick={closeMobileElements} />
                            
                            {/* Login/Signup for non-authenticated users */}
                            {!user && (
                                <>
                                    <NavLink to="/login" icon={<FaSignInAlt />} text="Login" delay={0.4} onClick={closeMobileElements} />
                                    <NavLink to="/signup" icon={<FaUserPlus />} text="Sign Up" delay={0.5} onClick={closeMobileElements} />
                                </>
                            )}
                            
                            <CartLink count={cartItems.length} isMobile={false} delay={0.6} />
                            
                            {/* Account dropdown after cart for authenticated users */}
                            {user && (
                                <div ref={accountDropdownRef}>
                                    <AccountDropdown 
                                        user={user}
                                        logout={logout}
                                        isOpen={isAccountDropdownOpen}
                                        onToggle={toggleAccountDropdown}
                                        onClose={closeAccountDropdown}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Enhanced Mobile Navigation (Visible on small screens only) --- */}
                    <div className="md:hidden flex items-center justify-between h-14 sm:h-16">
                        {/* Left: Enhanced Mobile Menu Button */}
                        <div className="flex-shrink-0">
                            <motion.button
                                id="mobile-menu-button"
                                onClick={toggleMenu}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 text-gray-300 hover:text-teal-400 focus:outline-none focus-visible:bg-gray-700 rounded-xl bg-gray-700/80 hover:bg-gray-600/90 border border-gray-600/90 hover:border-teal-500/70 transition-all duration-300 z-[60] shadow-lg active:scale-90"
                                aria-label="Toggle menu"
                                aria-controls="mobile-menu-drawer"
                                aria-expanded={isMenuOpen}
                            >
                                <motion.div 
                                    animate={isMenuOpen ? { rotate: 180 } : { rotate: 0 }} 
                                    transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                                >
                                    {isMenuOpen ? <FaTimes className="text-xl sm:text-2xl" /> : <FaBars className="text-xl sm:text-2xl" />}
                                </motion.div>
                                {/* Menu button glow effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-xl bg-teal-400/20 opacity-0"
                                    animate={isMenuOpen ? { opacity: 1, scale: 1.1 } : { opacity: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.button>
                        </div>

                        {/* Center: Enhanced Mobile Logo */}
                        <div className="flex-grow flex justify-center items-center overflow-hidden mx-3">
                            <Link
                                to="/"
                                onClick={handleHomeClick}
                                className="group flex items-center space-x-2 sm:space-x-3 p-2 rounded-xl hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-all duration-200 active:scale-95"
                            >
                                <div className="relative">
                                    <img
                                        src="/img/digital.jpg"
                                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/36x36/1A202C/A0AEC0?text=D"; }}
                                        alt="Logo"
                                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-cover border-2 border-teal-600/60 shadow-lg group-hover:border-teal-500/80 transition-all duration-300 flex-shrink-0"
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-teal-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="font-bold text-xs sm:text-sm text-teal-400 group-hover:text-teal-300 transition-colors whitespace-nowrap">DIGITAL SHOP</span>
                                    <span className="text-[10px] sm:text-xs text-gray-400 group-hover:text-gray-300 transition-colors whitespace-nowrap">NEPAL</span>
                                </div>
                            </Link>
                        </div>

                        {/* Right: Enhanced Account and Cart Icons */}
                        <div className="flex-shrink-0 flex items-center space-x-2 sm:space-x-3">
                            {/* Search icon for mobile */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/allproduct"
                                    onClick={closeMobileElements}
                                    className="flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 text-gray-300 hover:text-teal-400 focus:outline-none focus-visible:bg-gray-700 rounded-xl bg-gray-700/80 hover:bg-gray-600/90 border border-gray-600/90 hover:border-teal-500/70 transition-all duration-300 shadow-lg active:scale-90"
                                    aria-label="Search products"
                                >
                                    <FaSearch className="text-lg sm:text-xl" />
                                </Link>
                            </motion.div>
                            
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to={accountLinkProps.to}
                                    onClick={closeMobileElements}
                                    className="flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 text-gray-300 hover:text-teal-400 focus:outline-none focus-visible:bg-gray-700 rounded-xl bg-gray-700/80 hover:bg-gray-600/90 border border-gray-600/90 hover:border-teal-500/70 transition-all duration-300 shadow-lg active:scale-90"
                                    aria-label={accountLinkProps.label}
                                >
                                    {React.cloneElement(accountLinkProps.icon, { className: "text-lg sm:text-xl" })}
                                </Link>
                            </motion.div>
                            {/* Cart icon removed for mobile - now handled by bottom navigation */}
                            {/* <div className="relative">
                                <CartLink count={cartItems.length} isMobile={true} />
                            </div> */}
                        </div>
                    </div>
                    </div>
                    {/* Enhanced Mobile Menu Drawer */}
                    <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            {/* Enhanced Backdrop Overlay */}
                            <motion.div
                                variants={backdropVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                onClick={toggleMenu}
                                className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
                            />

                            {/* Enhanced Menu Drawer */}
                            <motion.div
                                id="mobile-menu-drawer"
                                ref={menuRef}
                                variants={menuVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                className="fixed top-32 sm:top-36 left-4 right-4 max-h-[75vh] bg-gray-900/95 backdrop-blur-xl border border-teal-400/30 shadow-2xl rounded-3xl z-50 flex flex-col md:hidden overflow-hidden"
                                style={{
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(20, 184, 166, 0.1)"
                                }}
                            >
                                {/* Enhanced Grab Handle */}
                                <div className="p-3 flex-shrink-0">
                                    <motion.div 
                                        className="w-12 h-2 bg-gray-600 rounded-full mx-auto"
                                        initial={{ scaleX: 0.5, opacity: 0.5 }}
                                        animate={{ scaleX: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.3 }}
                                    />
                                </div>

                                {/* Enhanced User Profile Section (if user is logged in) */}
                                {user && (
                                    <motion.div 
                                        variants={mobileNavMenuItemVariants} 
                                        className="px-6 pt-3 pb-5 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/30 to-gray-800/20 flex-shrink-0 mx-4 rounded-2xl mb-2"
                                    >
                                        <div className="flex items-center">
                                            <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-3 mr-4 shadow-lg">
                                                {user.role === 'admin' ? <FaUserShield className="text-white text-xl" /> : <FaUser className="text-white text-xl" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-bold text-base truncate">{user.name}</h4>
                                                <p className="text-gray-300 text-sm truncate">{user.email}</p>
                                                <span className="inline-block px-2 py-1 mt-1 text-xs font-medium text-teal-400 bg-teal-400/10 rounded-lg border border-teal-400/20">
                                                    {user.role === 'admin' ? 'Administrator' : 'Member'}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Enhanced Scrollable Content Area */}
                                <div className="flex-1 overflow-y-auto py-4 space-y-3 px-4">
                                    {/* Quick Navigation Section */}
                                    <div className="px-3 pb-2">
                                        <motion.h4 
                                            variants={mobileNavMenuItemVariants}
                                            className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-3 ml-3 flex items-center"
                                        >
                                            <FaCompass className="mr-2 text-teal-400" />
                                            Navigate
                                        </motion.h4>
                                        <div className="space-y-2">
                                            <motion.div variants={mobileNavMenuItemVariants}>
                                                <MobileNavLink to="/" icon={<FaHome />} text="Home" onClick={toggleMenu} />
                                            </motion.div>
                                            <motion.div variants={mobileNavMenuItemVariants}>
                                                <MobileNavLink to="/allproduct" icon={<FaBoxes />} text="All Products" onClick={toggleMenu} />
                                            </motion.div>
                                            <motion.div variants={mobileNavMenuItemVariants}>
                                                <MobileNavLink to="/cart" icon={<FaShoppingCart />} text={`Shopping Cart ${cartItems.length > 0 ? `(${cartItems.length})` : ''}`} onClick={toggleMenu} />
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Enhanced Divider */}
                                    <motion.div 
                                        variants={mobileNavMenuItemVariants}
                                        className="pt-2 pb-2 px-3"
                                    >
                                        <div className="border-t border-gray-700/60"></div>
                                    </motion.div>

                                    {/* Support Section */}
                                    <div className="px-3 pb-2">
                                        <motion.h4 
                                            variants={mobileNavMenuItemVariants}
                                            className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-3 ml-3 flex items-center"
                                        >
                                            <FaHeadset className="mr-2 text-teal-400" />
                                            Support
                                        </motion.h4>
                                        <div className="space-y-2">
                                            <motion.div variants={mobileNavMenuItemVariants}>
                                                <MobileNavLink to="/ContactUs" icon={<FaEnvelope />} text="Contact Us" onClick={toggleMenu} />
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Enhanced Divider */}
                                    <motion.div 
                                        variants={mobileNavMenuItemVariants}
                                        className="pt-4 pb-2 px-3"
                                    >
                                        <div className="border-t border-gray-700/60"></div>
                                    </motion.div>

                                    {/* Enhanced Account Section */}
                                    <div className="px-3 pb-3 pt-2">
                                        <motion.h4 
                                            variants={mobileNavMenuItemVariants}
                                            className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-3 ml-3 flex items-center"
                                        >
                                            <FaUser className="mr-2 text-teal-400" />
                                            Account
                                        </motion.h4>
                                        <div className="space-y-2">
                                        {!user ? (
                                            <>

                                                <motion.div variants={mobileNavMenuItemVariants}>
                                                    <MobileNavLink to="/login" icon={<FaSignInAlt />} text="Login" onClick={toggleMenu} />
                                                </motion.div>
                                                <motion.div variants={mobileNavMenuItemVariants}>
                                                    <MobileNavLink to="/signup" icon={<FaUserPlus />} text="Sign Up" onClick={toggleMenu} />
                                                </motion.div>
                                            </>
                                        ) : (
                                            <>
                                                {user?.role === "user" && (
                                                    <motion.div variants={mobileNavMenuItemVariants}>
                                                        <MobileNavLink to="/user-dashboard" icon={<FaUser />} text="My Account" onClick={toggleMenu} />
                                                    </motion.div>
                                                )}
                                                {user?.role === "admin" && (
                                                    <motion.div variants={mobileNavMenuItemVariants}>
                                                        <MobileNavLink to="/admin-dashboard" icon={<FaUserShield />} text="Admin Panel" onClick={toggleMenu} />
                                                    </motion.div>
                                                )}
                                                <motion.div variants={mobileNavMenuItemVariants}>
                                                    <button
                                                        onClick={() => { logout(); toggleMenu(); }}
                                                        className="group flex items-center justify-between w-full px-6 py-5 text-left text-gray-200 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 rounded-2xl transition-all duration-300 focus:outline-none focus-visible:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-500 border border-transparent hover:border-red-400/20 backdrop-blur-sm active:scale-95"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-400/10 group-hover:bg-red-400/20 transition-colors duration-300 mr-4 shadow-sm">
                                                                <span className="text-red-400 text-xl group-hover:scale-110 transition-transform duration-200"><FaSignInAlt className="rotate-180" /></span>
                                                            </div>
                                                            <span className="font-medium text-base group-hover:text-white transition-colors duration-200">Logout</span>
                                                        </div>
                                                        <FaChevronRight className="text-gray-500 text-sm group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-200" />
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                        </div>
                                    </div>

                                    {/* Enhanced Divider */}
                                    <motion.div 
                                        variants={mobileNavMenuItemVariants}
                                        className="pt-4 pb-2 px-3"
                                    >
                                        <div className="border-t border-gray-700/60"></div>
                                    </motion.div>

                                    {/* Enhanced Help Section */}
                                    <div className="px-3 pt-2 pb-6">
                                        <motion.h4 
                                            variants={mobileNavMenuItemVariants}
                                            className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4 ml-3 flex items-center"
                                        >
                                            <FaQuestionCircle className="mr-2 text-teal-400" />
                                            Help & Support
                                        </motion.h4>
                                        <motion.div 
                                            variants={mobileNavMenuItemVariants} 
                                            className="bg-gradient-to-br from-gray-800/60 to-gray-800/40 rounded-2xl p-5 border border-gray-700/50 shadow-lg"
                                        >
                                            <div className="flex items-start mb-4">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-400/10 mr-3 flex-shrink-0">
                                                    <FaQuestionCircle className="text-teal-400 text-lg" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-white font-semibold text-base mb-1">Need Help?</h3>
                                                    <p className="text-gray-300 text-sm leading-relaxed">
                                                        Having issues with a product or order? Report it here and we'll help you.
                                                    </p>
                                                </div>
                                            </div>
                                            <motion.button
                                                onClick={toggleComplaintFormVisibility}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white py-3 px-5 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-teal-500 active:scale-95"
                                                aria-expanded={showComplaintForm}
                                                aria-controls="complaint-form-section"
                                            >
                                                <FaInfoCircle className="mr-2" />
                                                {showComplaintForm ? 'Close Support Form' : 'Report an Issue'}
                                            </motion.button>

                                            {/* Complaint Form (Conditionally Rendered) */}
                                            <div id="complaint-form-section">
                                                <ComplaintFormSection
                                                    user={user}
                                                    isVisible={showComplaintForm}
                                                    onSubmit={handleComplaintSubmit}
                                                    isSubmitting={isSubmittingComplaint}
                                                    onClose={toggleComplaintFormVisibility}
                                                />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Enhanced Menu Footer */}
                                <motion.div 
                                    variants={mobileNavMenuItemVariants}
                                    className="px-6 py-4 border-t border-gray-700/50 text-center text-gray-400 text-xs flex-shrink-0 bg-gray-800/20"
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <span>© {new Date().getFullYear()}</span>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                        <span className="font-medium text-teal-400">Digital Shop Nepal</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                </nav>
            </header>

            {/* Mobile Navigation Options */}
            <AnimatePresence>
                {navMode === 'bottom' && (
                    <BottomNavigationBar 
                        user={user} 
                        cartCount={cartItems.length} 
                    />
                )}
            </AnimatePresence>


        </>
    );
};

export default Navbar;
