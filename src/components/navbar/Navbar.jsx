import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
// Assuming SearchBar and TopBar are available as separate components in your project.
// If they are not, you would need to implement placeholder components or remove their usage.
import SearchBar from "../searchBar/SearchBar";
import TopBar from "../Topbar";

// Assuming react-redux is installed and configured in your project.
// If not, you might need to manage cart state locally or set up Redux.
import { useSelector } from "react-redux";

// Assuming react-icons/fa is installed in your project.
// If not, you might need to use inline SVG or unicode characters for icons.
import {
    FaShoppingCart, FaPhoneAlt, FaUser, FaUserShield, FaSignInAlt,
    FaUserPlus, FaHome, FaBoxes, FaBars, FaTimes,
    FaQuestionCircle, FaInfoCircle, FaShoppingBag, FaEnvelope,
    FaChevronRight, FaSpinner, FaStar, FaSearch
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
            className="group relative flex items-center px-3 py-2 text-gray-200 hover:text-teal-400 transition-all duration-300 text-sm font-medium focus:outline-none focus-visible:text-teal-400 rounded-xl hover:bg-white/5 backdrop-blur-sm border border-transparent hover:border-teal-400/20"
        >
            <span className="mr-1.5 text-base group-hover:scale-110 transition-transform duration-200">{icon}</span>
            <span className="relative">
                {text}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
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
    const commonClasses = "flex items-center text-gray-200 hover:text-teal-400 transition-colors duration-200 relative focus:outline-none focus-visible:text-teal-400";
    const mobileWrapperClasses = "flex items-center justify-center w-12 h-12 text-gray-300 hover:text-teal-400 focus:outline-none focus-visible:bg-gray-700 rounded-xl bg-gray-700/70 hover:bg-gray-600/90 border border-gray-600/90 hover:border-teal-500/60 transition-all duration-200 shadow-sm active:scale-95";
    const desktopClasses = "text-sm font-medium";

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
                <FaShoppingCart className={`${isMobile ? 'text-xl' : 'text-xl mr-1.5'}`} />
                {!isMobile && <span>Cart</span>}
                <AnimatePresence>
                    {count > 0 && (
                        <motion.span
                            key={count}
                            initial={{ scale: 0, y: -5 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                            className={`absolute ${isMobile ? '-top-1 -right-1' : '-top-1.5 -right-2'} bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-gray-800 shadow-lg`}
                        >
                            {count > 9 ? '9+' : count}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>
        </motion.div>
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

    // Ref for mobile menu to allow scrolling to bottom
    const menuRef = useRef(null);

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

    // Logout function: clears user from localStorage and navigates to login
    const logout = () => {
        localStorage.removeItem("users");
        navigate("/login");
    };

    // Helper to close mobile menu and form
    const closeMobileElements = () => {
        setIsMenuOpen(false);
        setShowComplaintForm(false); // Ensure form is also closed
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
        <header className="sticky top-0 z-50">
            {/* Top Bar for contact info and social links */}
            <TopBar />
            <nav className={`bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all duration-300 ease-out ${scrolled ? "py-2" : "py-3"}`}>
                <div className="container mx-auto px-4 sm:px-6">
                    {/* --- Modern Desktop Navigation (Hidden on small screens) --- */}
                    <div className="hidden md:flex items-center justify-between h-14">
                        {/* Brand/Logo Section (Left side of desktop nav) */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group">
                            <Link
                                to="/"
                                onClick={handleHomeClick}
                                className="flex items-center space-x-3 px-4 py-2 rounded-2xl hover:bg-white/5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 backdrop-blur-sm border border-transparent hover:border-teal-400/20"
                            >
                                <div className="relative">
                                    <img
                                        src="/img/digital.jpg"
                                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/48x48/1A202C/A0AEC0?text=DSN"; }}
                                        alt="Digital Shop Nepal Logo"
                                        className="h-10 w-10 lg:h-12 lg:w-12 rounded-2xl object-cover border-2 border-teal-400/40 group-hover:border-teal-400/60 transition-all duration-300 shadow-lg group-hover:shadow-teal-400/20"
                                    />
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-teal-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-xl lg:text-2xl bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent group-hover:from-teal-300 group-hover:to-blue-400 transition-all duration-300">
                                        Digital Shop Nepal
                                    </span>
                                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium">
                                        Your Digital Store
                                    </span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Search Bar Section (Center of desktop nav) */}
                        <div className="flex-1 max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-4 lg:mx-6 xl:mx-8"> {/* Adjusted max-width classes here */}
                            <div className="relative">
                                <SearchBar />
                            </div>
                        </div>

                        {/* Navigation Links and User Actions (Right side of desktop nav) */}
                        <div className="flex items-center space-x-4">
                            {/* Added Home Link for desktop */}
                            <NavLink to="/" icon={<FaHome />} text="Home" delay={0.1} onClick={handleHomeClick} />
                            <NavLink to="/allproduct" icon={<FaBoxes />} text="All Products" delay={0.2} onClick={closeMobileElements} />
                            <NavLink to="/ContactUs" icon={<FaPhoneAlt />} text="Contact" delay={0.3} onClick={closeMobileElements} />

                            {/* Consolidated Account/Admin/Login/Signup logic for desktop */}
                            {user ? (
                                <>
                                    {user.role === 'admin' ? (
                                        <NavLink to="/admin-dashboard" icon={<FaUserShield />} text="Admin" delay={0.4} onClick={closeMobileElements} />
                                    ) : (
                                        <NavLink to="/user-dashboard" icon={<FaUser />} text="My Account" delay={0.4} onClick={closeMobileElements} />
                                    )}
                                    <motion.button
                                        onClick={logout}
                                        whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                                        className="group relative flex items-center px-3 py-2 text-gray-200 hover:text-red-400 transition-all duration-300 text-sm font-medium focus:outline-none focus-visible:text-red-400 rounded-xl hover:bg-red-500/10 backdrop-blur-sm border border-transparent hover:border-red-400/20"
                                        initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
                                    >
                                        <FaSignInAlt className="mr-1.5 rotate-180 group-hover:scale-110 transition-transform duration-200" />
                                        <span className="relative">Logout
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-red-500 group-hover:w-full transition-all duration-300"></span>
                                        </span>
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/login" icon={<FaSignInAlt />} text="Login" delay={0.4} onClick={closeMobileElements} />
                                    <NavLink to="/signup" icon={<FaUserPlus />} text="Sign Up" delay={0.5} onClick={closeMobileElements} />
                                </>
                            )}
                            <CartLink count={cartItems.length} isMobile={false} delay={0.6} />
                            {/* Moved Reviews Link after Cart */}
                            <NavLink to="/reviews" icon={<FaStar />} text="Reviews" delay={0.7} onClick={closeMobileElements} />
                        </div>
                    </div>

                    {/* --- Enhanced Mobile Navigation (Visible on small screens) --- */}
                    <div className="md:hidden flex items-center justify-between h-16 sm:h-18">
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
                            <div className="relative">
                                <CartLink count={cartItems.length} isMobile={true} />
                            </div>
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
                                <div className="flex-1 overflow-y-auto py-4 space-y-2 px-4">
                                    {/* Main Links */}
                                    <motion.div variants={mobileNavMenuItemVariants}>
                                        <MobileNavLink to="/" icon={<FaHome />} text="Home" onClick={toggleMenu} />
                                    </motion.div>
                                    <motion.div variants={mobileNavMenuItemVariants}>
                                        <MobileNavLink to="/allproduct" icon={<FaBoxes />} text="All Products" onClick={toggleMenu} />
                                    </motion.div>
                                    <motion.div variants={mobileNavMenuItemVariants}>
                                        <MobileNavLink to="/reviews" icon={<FaStar />} text="Reviews" onClick={toggleMenu} />
                                    </motion.div>
                                    <motion.div variants={mobileNavMenuItemVariants}>
                                        <MobileNavLink to="/ContactUs" icon={<FaEnvelope />} text="Contact Us" onClick={toggleMenu} />
                                    </motion.div>

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
                                            className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-3 ml-3"
                                        >
                                            Account
                                        </motion.h4>
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
                                            className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4 ml-3"
                                        >
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
    );
};

export default Navbar;
