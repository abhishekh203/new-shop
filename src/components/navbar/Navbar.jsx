import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
// Assuming SearchBar is available as a separate component in your project.
// If it is not, you would need to implement a placeholder component or remove its usage.
import SearchBar from "../search-bar/SearchBar";
import { serifTheme } from "../../design-system/themes";

// Assuming react-redux is installed and configured in your project.
// If not, you might need to manage cart state locally or set up Redux.
import { useSelector } from "react-redux";
import useLocalStorage from "../../hooks/storage/useLocalStorage";

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

// Enhanced Mobile NavLink - Simple Serif Style
const MobileNavLink = ({ to, icon, text, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center w-full px-6 py-4 text-left ${serifTheme.colors.text.secondary} hover:text-gray-800 hover:bg-amber-50 focus:outline-none border-b ${serifTheme.colors.border.secondary} last:border-b-0`}
        style={{ fontFamily: serifTheme.fontFamily.serif }}
    >
        <span className="mr-4 text-lg">{icon}</span>
        <span className="text-base font-medium">{text}</span>
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
        navigate('/user-dashboard');
        onClose();
    };

    const handleLogoutClick = () => {
        logout();
        onClose();
    };

    return (
        <div className="relative" style={{ fontFamily: serifTheme.fontFamily.serif }}>
            {/* Dropdown Trigger */}
            <motion.button
                onClick={onToggle}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative flex items-center px-4 py-2 ${serifTheme.colors.text.secondary} hover:text-gray-800 ${serifTheme.transitions.default} text-sm font-medium focus:outline-none focus-visible:text-gray-800 ${serifTheme.radius.button} hover:bg-orange-50`}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
            >
                <FaUser className={`mr-2 text-base group-hover:scale-110 ${serifTheme.transitions.default}`} />
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
                        className={`absolute right-0 mt-2 w-48 ${serifTheme.colors.background.overlay} backdrop-blur-xl border ${serifTheme.colors.border.primary} ${serifTheme.radius.card} ${serifTheme.colors.shadow.cardHover} z-50 overflow-hidden`}
                    >
                        <div className="py-2">
                            {/* Dashboard Link */}
                            <motion.button
                                onClick={handleDashboardClick}
                                whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.1)" }}
                                className={`w-full text-left px-4 py-3 ${serifTheme.colors.text.secondary} hover:text-amber-700 ${serifTheme.transitions.default} flex items-center text-sm font-medium`}
                            >
                                <FaUser className="mr-3 text-base" />
                                <span>Dashboard</span>
                            </motion.button>

                            {/* Divider */}
                            <div className={`h-px ${serifTheme.colors.border.secondary} mx-2 my-1`}></div>

                            {/* Logout Button */}
                            <motion.button
                                onClick={handleLogoutClick}
                                whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                                className={`w-full text-left px-4 py-3 ${serifTheme.colors.text.secondary} hover:text-red-600 ${serifTheme.transitions.default} flex items-center text-sm font-medium`}
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
    
    // Update active tab based on current location
    useEffect(() => {
        const path = window.location.pathname;
        if (path === '/') setActiveTab('home');
        else if (path === '/allproduct') setActiveTab('products');
        else if (path === '/cart') setActiveTab('cart');
        else if (path === '/ContactUs') setActiveTab('contact');
        else if (path.includes('dashboard') || path === '/login') setActiveTab('account');
    }, []);

    const navItems = [
        { 
            id: 'home', 
            icon: <FaHome />, 
            label: 'Home', 
            path: '/',
            color: 'from-amber-600 to-orange-600'
        },
        { 
            id: 'products', 
            icon: <FaBoxes />, 
            label: 'Products', 
            path: '/allproduct',
            color: 'from-amber-600 to-orange-600'
        },
        { 
            id: 'cart', 
            icon: <FaShoppingCart />, 
            label: 'Cart', 
            path: '/cart', 
            badge: cartCount,
            color: 'from-amber-600 to-orange-600',
            isSpecial: true // Mark cart as special for enhanced styling
        },
        { 
            id: 'contact', 
            icon: <FaEnvelope />, 
            label: 'Contact', 
            path: '/ContactUs',
            color: 'from-amber-600 to-orange-600'
        },
        { 
            id: 'account', 
            icon: user ? <FaUser /> : <FaUser />, 
            label: user ? 'Account' : 'Login', 
            path: user ? '/user-dashboard' : '/login',
            color: 'from-amber-600 to-orange-600'
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
            style={{ 
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                fontFamily: serifTheme.fontFamily.serif
            }}
        >
            {/* Enhanced background with serif theme */}
            <div className={`absolute inset-0 ${serifTheme.gradients.card} backdrop-blur-xl border-t ${serifTheme.colors.border.primary} ${serifTheme.colors.shadow.card}`} />
            
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
                            className={`relative flex flex-col items-center justify-center min-w-[60px] h-16 ${serifTheme.radius.card} transition-all duration-300 ${
                                isActive 
                                    ? `bg-gradient-to-br ${item.color} text-white shadow-lg transform scale-105` 
                                    : isPressedItem
                                    ? `${serifTheme.colors.background.secondary} ${serifTheme.colors.text.secondary} scale-95`
                                    : `${serifTheme.colors.text.tertiary} hover:${serifTheme.colors.text.primary} hover:${serifTheme.colors.background.secondary}`
                            } ${isCartWithItems ? `ring-2 ${serifTheme.colors.border.accent} ring-offset-2` : ''}`}
                            style={{
                                boxShadow: isActive 
                                    ? `0 8px 25px -8px rgba(217, 119, 6, 0.4)` 
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
                                    isActive ? 'text-white' : serifTheme.colors.text.tertiary
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
    // Retrieve user data from localStorage using hook
    const [user, setUser, removeUser] = useLocalStorage("users", null);
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
        removeUser();
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
            return {
                to: '/user-dashboard',
                icon: <FaUser className="text-xl" />,
                label: "Account Dashboard",
                text: "My Account"
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
                            
                            {/* Cart link only for authenticated users on desktop */}
                            {user && <CartLink count={cartItems.length} isMobile={false} delay={0.6} />}
                            
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
                            
                            {/* Cart link only for authenticated users on desktop */}
                            {user && <CartLink count={cartItems.length} isMobile={false} delay={0.6} />}
                            
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
                                className={`relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 ${serifTheme.colors.text.accent} hover:text-amber-800 focus:outline-none focus-visible:bg-orange-50 ${serifTheme.radius.button} ${serifTheme.colors.background.card} hover:bg-white border ${serifTheme.colors.border.primary} hover:border-amber-300/80 ${serifTheme.transitions.default} z-[60] ${serifTheme.colors.shadow.button} active:scale-90`}
                                style={{ fontFamily: serifTheme.fontFamily.serif }}
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
                                    className={`absolute inset-0 ${serifTheme.radius.button} bg-amber-400/20 opacity-0`}
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
                                    className={`flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 ${serifTheme.colors.text.accent} hover:text-amber-800 focus:outline-none focus-visible:bg-orange-50 ${serifTheme.radius.button} ${serifTheme.colors.background.card} hover:bg-white border ${serifTheme.colors.border.primary} hover:border-amber-300/80 ${serifTheme.transitions.default} ${serifTheme.colors.shadow.button} active:scale-90`}
                                    style={{ fontFamily: serifTheme.fontFamily.serif }}
                                    aria-label="Search products"
                                >
                                    <FaSearch className="text-lg sm:text-xl" />
                                </Link>
                            </motion.div>
                            
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to={accountLinkProps.to}
                                    onClick={closeMobileElements}
                                    className={`flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 ${serifTheme.colors.text.accent} hover:text-amber-800 focus:outline-none focus-visible:bg-orange-50 ${serifTheme.radius.button} ${serifTheme.colors.background.card} hover:bg-white border ${serifTheme.colors.border.primary} hover:border-amber-300/80 ${serifTheme.transitions.default} ${serifTheme.colors.shadow.button} active:scale-90`}
                                    style={{ fontFamily: serifTheme.fontFamily.serif }}
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
                    {/* Simple Mobile Menu Drawer - No Animations */}
                    {isMenuOpen && (
                        <>
                            {/* Simple Backdrop Overlay */}
                            <div
                                onClick={toggleMenu}
                                className="fixed inset-0 bg-black/40 z-40 md:hidden"
                            />

                            {/* Simple Menu Drawer */}
                            <div
                                id="mobile-menu-drawer"
                                ref={menuRef}
                                className={`fixed top-40 sm:top-44 left-4 right-4 max-h-[75vh] bg-white border ${serifTheme.colors.border.primary} ${serifTheme.colors.shadow.card} ${serifTheme.radius.card} z-50 flex flex-col md:hidden overflow-hidden`}
                                style={{
                                    fontFamily: serifTheme.fontFamily.serif,
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                                }}
                            >
                                {/* Simple Grab Handle */}
                                <div className="p-3 flex-shrink-0">
                                    <div className={`w-12 h-2 bg-gray-400 ${serifTheme.radius.badge} mx-auto opacity-50`} />
                                </div>

                                {/* Simple User Profile Section (if user is logged in) */}
                                {user && (
                                    <div className={`px-6 pt-4 pb-4 border-b ${serifTheme.colors.border.secondary} flex-shrink-0`}>
                                        <div className="flex items-center">
                                            <div className={`${serifTheme.colors.accent.primary} ${serifTheme.radius.button} p-3 mr-4`}>
                                                <FaUser className="text-white text-xl" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`${serifTheme.colors.text.primary} font-bold text-base`}>{user.name}</h4>
                                                <p className={`${serifTheme.colors.text.tertiary} text-sm`}>{user.email}</p>
                                                <span className={`inline-block px-2 py-1 mt-1 text-xs font-medium ${serifTheme.colors.text.accent} bg-amber-100 ${serifTheme.radius.input} border ${serifTheme.colors.border.secondary}`}>
                                                    Member
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Simple Scrollable Content Area */}
                                <div className="flex-1 overflow-y-auto py-4">
                                    {/* Navigation Section */}
                                    <div className="mb-4">
                                        <h4 className={`${serifTheme.colors.text.tertiary} uppercase text-xs font-bold mb-3 px-6`} style={{ fontFamily: serifTheme.fontFamily.serif }}>
                                            Navigate
                                        </h4>
                                        <div>
                                            <MobileNavLink to="/" icon={<FaHome />} text="Home" onClick={toggleMenu} />
                                            <MobileNavLink to="/allproduct" icon={<FaBoxes />} text="All Products" onClick={toggleMenu} />
                                            <MobileNavLink to="/cart" icon={<FaShoppingCart />} text={`Shopping Cart ${cartItems.length > 0 ? `(${cartItems.length})` : ''}`} onClick={toggleMenu} />
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className={`border-t ${serifTheme.colors.border.secondary} my-4`}></div>

                                    {/* Support Section */}
                                    <div className="mb-4">
                                        <h4 className={`${serifTheme.colors.text.tertiary} uppercase text-xs font-bold mb-3 px-6`} style={{ fontFamily: serifTheme.fontFamily.serif }}>
                                            Support
                                        </h4>
                                        <div>
                                            <MobileNavLink to="/ContactUs" icon={<FaEnvelope />} text="Contact Us" onClick={toggleMenu} />
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className={`border-t ${serifTheme.colors.border.secondary} my-4`}></div>

                                    {/* Account Section */}
                                    <div className="mb-4">
                                        <h4 className={`${serifTheme.colors.text.tertiary} uppercase text-xs font-bold mb-3 px-6`} style={{ fontFamily: serifTheme.fontFamily.serif }}>
                                            Account
                                        </h4>
                                        <div>
                                        {!user ? (
                                            <>
                                                <MobileNavLink to="/login" icon={<FaSignInAlt />} text="Login" onClick={toggleMenu} />
                                                <MobileNavLink to="/signup" icon={<FaUserPlus />} text="Sign Up" onClick={toggleMenu} />
                                            </>
                                        ) : (
                                            <>
                                                <MobileNavLink to="/user-dashboard" icon={<FaUser />} text="My Account" onClick={toggleMenu} />
                                                <button
                                                    onClick={() => { logout(); toggleMenu(); }}
                                                    className={`flex items-center w-full px-6 py-4 text-left ${serifTheme.colors.text.secondary} hover:text-red-600 hover:bg-red-50 focus:outline-none border-b ${serifTheme.colors.border.secondary} last:border-b-0`}
                                                    style={{ fontFamily: serifTheme.fontFamily.serif }}
                                                >
                                                    <span className="mr-4 text-lg"><FaSignInAlt className="rotate-180" /></span>
                                                    <span className="text-base font-medium">Logout</span>
                                                </button>
                                            </>
                                        )}
                                        </div>
                                    </div>
                                </div>

                                {/* Simple Menu Footer */}
                                <div className={`px-6 py-4 border-t ${serifTheme.colors.border.secondary} text-center ${serifTheme.colors.text.tertiary} text-xs flex-shrink-0`}
                                     style={{ fontFamily: serifTheme.fontFamily.serif }}>
                                    <div className="flex items-center justify-center space-x-2">
                                        <span>© {new Date().getFullYear()}</span>
                                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        <span className={`font-medium ${serifTheme.colors.text.accent}`}>Digital Shop Nepal</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
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
