import React, { useState, useEffect, useRef, useCallback } from "react"; // Import React and hooks from 'react'
import { Link, useNavigate } from "react-router-dom";        // Import routing components/hooks from 'react-router-dom'

// ... rest of your imports ...
import SearchBar from "../searchBar/SearchBar"; // Desktop search bar remains
import { useSelector } from "react-redux";
// Removed duplicated useState, useEffect, useRef imports
import {
    FaShoppingCart, FaPhoneAlt, FaUser, FaUserShield, FaSignInAlt,
    FaUserPlus, FaHome, FaBoxes, FaBars, FaTimes, // FaSearch removed as it's no longer used in mobile top bar
    FaQuestionCircle, FaInfoCircle, FaShoppingBag, FaEnvelope,
    FaChevronRight, FaSpinner
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "../Topbar";

// --- Reusable Components ---

// Desktop NavLink (No changes)
const NavLink = ({ to, icon, text, delay = 0, onClick = () => {} }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 200, damping: 15 }}
    >
        <Link
            to={to}
            onClick={onClick}
            className="flex items-center text-gray-200 hover:text-teal-400 transition-colors duration-200 text-sm font-medium focus:outline-none focus-visible:text-teal-400 focus-visible:underline"
        >
            <span className="mr-1.5 text-base">{icon}</span>
            {text}
        </Link>
    </motion.div>
);

// Mobile NavLink (No changes)
const MobileNavLink = ({ to, icon, text, onClick }) => (
    <Link
        to={to}
        onClick={onClick} // Close menu on click
        className="flex items-center justify-between w-full px-4 py-3.5 text-left text-gray-200 hover:bg-gray-800 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:bg-gray-800 focus-visible:ring-2 focus-visible:ring-teal-500"
    >
        <div className="flex items-center">
            <span className="text-teal-400 text-lg mr-4 w-5 text-center">{icon}</span>
            <span className="font-medium text-sm">{text}</span>
        </div>
        <FaChevronRight className="text-gray-500 text-xs" />
    </Link>
);

// Cart Link (No changes)
const CartLink = ({ count, delay = 0, isMobile = false }) => {
    const commonClasses = "flex items-center text-gray-200 hover:text-teal-400 transition-colors duration-200 relative focus:outline-none focus-visible:text-teal-400";
    // Adjusted mobile classes slightly for better alignment with new account icon if needed
    const mobileClasses = "p-2"; // Keep as just icon for mobile top bar
    const desktopClasses = "text-sm font-medium"; // Icon + Text for desktop

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, type: 'spring', stiffness: 200, damping: 15 }}
        >
            <Link
                to="/cart"
                aria-label={`Cart with ${count} items`}
                className={`${commonClasses} ${isMobile ? mobileClasses : desktopClasses}`}
            >
                <FaShoppingCart className={`text-xl ${!isMobile ? 'mr-1.5' : ''}`} />
                {!isMobile && <span>Cart</span>}
                <AnimatePresence>
                    {count > 0 && (
                        <motion.span
                            key={count} // Animate when count changes
                            initial={{ scale: 0, y: -5 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                            className={`absolute -top-1.5 ${isMobile ? 'right-0' : '-right-2'} bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-gray-900`}
                        >
                            {count > 9 ? '9+' : count}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>
        </motion.div>
    );
};

// --- Complaint Form Component --- (No changes)
const ComplaintFormSection = ({ user, isVisible, onSubmit, isSubmitting, onClose }) => {
    const [complaintData, setComplaintData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        whatsappNumber: "",
        productPurchased: "",
        dateOfPurchase: "",
        problemDescription: ""
    });

    // Update form if user data becomes available after mount
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
        onSubmit(complaintData); // Pass data up to parent handler
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
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-inner" // Removed margin-top here, added in variant
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
                            {/* Form fields using map for brevity */}
                            {[
                                { id: 'name', label: 'Full Name', type: 'text', required: true },
                                { id: 'email', label: 'Email Address', type: 'email', required: true },
                                { id: 'whatsappNumber', label: 'WhatsApp Number', type: 'tel', placeholder: '+977 98XXXXXXXX', required: true },
                                { id: 'productPurchased', label: 'Product Name / Order ID', type: 'text', required: true },
                                { id: 'dateOfPurchase', label: 'Approx. Purchase Date', type: 'date', required: true },
                            ].map(field => (
                                <div key={field.id}>
                                    <label htmlFor={field.id} className="block text-xs font-medium text-gray-300 mb-1">
                                        {field.label} {field.required && '*'}
                                    </label>
                                    <input
                                        type={field.type}
                                        id={field.id}
                                        name={field.id}
                                        value={complaintData[field.id]}
                                        onChange={handleChange}
                                        required={field.required}
                                        placeholder={field.placeholder || ''}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                                    />
                                </div>
                            ))}

                            <div>
                                <label htmlFor="problemDescription" className="block text-xs font-medium text-gray-300 mb-1">
                                    Describe Your Issue *
                                </label>
                                <textarea
                                    id="problemDescription"
                                    name="problemDescription"
                                    value={complaintData.problemDescription}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                                    placeholder="Please describe your problem in detail..."
                                />
                            </div>

                            <div className="pt-2">
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                    className={`w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-teal-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-teal-600 hover:to-blue-700'}`}
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
    const userString = localStorage.getItem("users");
    const user = userString ? JSON.parse(userString) : null; // Handle null case
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart);
    const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 768);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Removed searchOpen and searchQuery state as mobile search bar is removed
    const [scrolled, setScrolled] = useState(false);
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false); // Loading state for form

    // Removed searchInputRef as mobile search bar is removed
    const menuRef = useRef(null); // Ref for the mobile menu drawer itself

    // Effects for resize, scroll, and click outside
    useEffect(() => {
        const handleResize = () => {
            const smallDevice = window.innerWidth < 768;
            setIsSmallDevice(smallDevice);
            // Close mobile elements if screen becomes large
            if (!smallDevice) {
                setIsMenuOpen(false);
                // Removed setSearchOpen(false);
                setShowComplaintForm(false); // Also close form
            }
        };

        const handleScroll = () => {
            setScrolled(window.scrollY > 5); // Trigger slightly earlier
        };

        const handleClickOutside = (event) => {
            // Close menu if clicking outside the menu drawer
            if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
        handleResize(); // Initial check

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]); // Dependency only on isMenuOpen for click outside logic

    // Removed effect to focus search input

    // Effect to handle body scroll lock when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        // Cleanup function to reset overflow when component unmounts
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const logout = () => {
        localStorage.removeItem("users");
        // Optionally clear Redux state here if needed
        navigate("/login");
    };

    const handleHomeClick = (e) => {
        // If already on home page, just scroll up, otherwise navigate
        if (window.location.pathname === '/') {
            e.preventDefault(); // Prevent full page reload if it's just a link click
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            navigate("/");
            // Ensure scroll to top happens after navigation potentially
            setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
        }
        closeMobileElements(); // Close menu if open
    };

    const closeMobileElements = () => {
        setIsMenuOpen(false);
        // Removed setSearchOpen(false);
        // Keep complaint form state managed separately unless explicitly closing menu
    };

    const toggleMenu = () => {
        const opening = !isMenuOpen;
        setIsMenuOpen(opening);
        if (opening) {
            // Removed setSearchOpen(false);
            setShowComplaintForm(false); // Close form when opening menu initially
        }
    };

    // Removed toggleSearch function
    // Removed handleMobileSearchSubmit function

    const toggleComplaintFormVisibility = () => {
        const willBeVisible = !showComplaintForm;
        setShowComplaintForm(willBeVisible);

        // Scroll the menu smoothly when form toggles
        if (willBeVisible && menuRef.current) {
            // Scroll towards the bottom after a delay to allow animation
            setTimeout(() => {
                menuRef.current.scrollTo({
                    top: menuRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 350); // Adjust delay based on animation duration
        } else if (!willBeVisible && menuRef.current) {
            // Optional: Scroll slightly up if form closes
            // menuRef.current.scrollTo({ top: menuRef.current.scrollTop - 100, behavior: 'smooth' });
        }
    };

    const handleComplaintSubmit = async (formData) => {
        setIsSubmittingComplaint(true);
        console.log("Submitting complaint:", formData); // Log data being sent

        // **********************************************************************
        // IMPORTANT: Replace this placeholder URL with your actual Getform.io endpoint!
        const FORM_ENDPOINT = "https://getform.io/f/bejrwvna";
        // **********************************************************************

        if (FORM_ENDPOINT === "https://getform.io/f/YOUR_UNIQUE_GETFORM_ENDPOINT") {
            console.error("Complaint form endpoint is not configured!");
            alert("Form submission is currently disabled. Please contact support directly.");
            setIsSubmittingComplaint(false);
            return;
        }


        try {
            const response = await fetch(FORM_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json", // Recommended by Getform
                },
                body: JSON.stringify({
                    ...formData,
                    userRole: user?.role || "guest",
                    submittedAt: new Date().toISOString()
                }),
            });

            if (response.ok) {
                alert("Thank you! We've received your complaint and will contact you via WhatsApp/Email soon.");
                // Resetting form state is now handled within ComplaintFormSection via its own state
                setShowComplaintForm(false); // Close the form section
            } else {
                // Try to get error message from response
                const errorData = await response.json().catch(() => ({})); // Handle non-JSON error response
                console.error("Form submission failed:", response.status, errorData);
                throw new Error(`Failed to submit complaint. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error submitting complaint:", error);
            alert(`Oops! Something went wrong submitting your complaint. Please try again later or contact support directly. Error: ${error.message}`);
        } finally {
            setIsSubmittingComplaint(false);
        }
    };


    // Animation Variants
    const menuVariants = {
        open: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 35, staggerChildren: 0.07, delayChildren: 0.1 }
        },
        closed: {
            x: "100%",
            opacity: 0.8,
            transition: { type: "spring", stiffness: 400, damping: 35, when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 }
        }
    };

    const mobileNavMenuItemVariants = {
        open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
        closed: { opacity: 0, x: 40, transition: { duration: 0.2 } }
    };


    // Removed searchVariants

    // --- Helper Function for Mobile Account Link ---
    const getAccountLinkProps = () => {
        if (user) {
            const isAdmin = user.role === 'admin';
            return {
                to: isAdmin ? '/admin-dashboard' : '/user-dashboard',
                icon: isAdmin ? <FaUserShield className="text-lg" /> : <FaUser className="text-lg" />,
                label: "Account Dashboard"
            };
        } else {
            return {
                to: '/login',
                icon: <FaUser className="text-lg" />, // Icon for logged out state
                label: "Login or Sign Up"
            };
        }
    };

    const accountLinkProps = getAccountLinkProps();
    // --- End Helper ---


    return (
        // Use header for semantic grouping of TopBar and Nav
        <header className="sticky top-0 z-50">
            <TopBar />

            {/* Main Navigation Bar */}
            <nav className={`bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg transition-all duration-300 ease-out ${scrolled ? "py-1.5" : "py-2.5"} transition-padding`}>
                <div className="container mx-auto px-4">
                    {/* Desktop Navigation (No changes here) */}
                    <div className="hidden md:flex items-center justify-between h-12"> {/* Fixed height */}
                        {/* Logo */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/"
                                onClick={handleHomeClick}
                                className="text-white font-bold text-xl lg:text-2xl hover:text-teal-300 transition duration-300 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-sm"
                            >
                                <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                                    Digital Shop Nepal
                                </span>
                            </Link>
                        </motion.div>

                        {/* Search Bar - Assuming it's self-contained */}
                        <div className="flex-1 max-w-md lg:max-w-lg mx-6">
                            <SearchBar />
                        </div>

                        {/* Navigation Links */}
                        <div className="flex items-center space-x-5 lg:space-x-6">
                            <NavLink to="/" icon={<FaHome />} text="Home" delay={0.1} onClick={handleHomeClick} />
                            <NavLink to="/allproduct" icon={<FaBoxes />} text="Products" delay={0.2} onClick={closeMobileElements} />

                            {!user ? (
                                <>
                                    <NavLink to="/login" icon={<FaSignInAlt />} text="Login" delay={0.3} onClick={closeMobileElements} />
                                    <NavLink to="/signup" icon={<FaUserPlus />} text="Signup" delay={0.4} onClick={closeMobileElements} />
                                </>
                            ) : (
                                <>
                                    {user?.role === "user" && (
                                        <NavLink to="/user-dashboard" icon={<FaUser />} text="Account" delay={0.3} onClick={closeMobileElements} />
                                    )}
                                    {user?.role === "admin" && (
                                        <NavLink to="/admin-dashboard" icon={<FaUserShield />} text="Admin" delay={0.3} onClick={closeMobileElements} />
                                    )}
                                    <motion.button
                                        onClick={logout}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center text-gray-200 hover:text-red-400 transition-colors duration-200 text-sm font-medium focus:outline-none focus-visible:text-red-400 focus-visible:underline"
                                        initial={{ opacity: 0, y: -15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
                                    >
                                        <FaSignInAlt className="mr-1.5 rotate-180" /> {/* Logout icon */}
                                        Logout
                                    </motion.button>
                                </>
                            )}
                            <CartLink count={cartItems.length} delay={user ? 0.6 : 0.5} />
                            <NavLink to="/ContactUs" icon={<FaPhoneAlt />} text="Contact" delay={user ? 0.7 : 0.6} onClick={closeMobileElements} />
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center justify-between h-12"> {/* Fixed height */}
                        {/* Mobile Menu Button */}
                        <motion.button
                            onClick={toggleMenu}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-200 p-2 -ml-2 focus:outline-none focus-visible:bg-gray-700 rounded-md"
                            aria-label="Toggle menu"
                            aria-controls="mobile-menu-drawer"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                        </motion.button>

                        {/* Logo - Centered (adjust flex properties if needed) */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Link
                                to="/"
                                onClick={handleHomeClick}
                                className="text-white font-bold hover:text-teal-300 transition duration-300 inline-block text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-sm"
                            >
                                <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent whitespace-nowrap">
                                    DIGITAL SHOP NEPAL
                                </span>
                            </Link>
                        </div>

                        {/* Right Icons: Account and Cart */}
                        <div className="flex items-center space-x-1">
                            {/* --- MODIFIED: Account Icon Link --- */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Link
                                    to={accountLinkProps.to}
                                    onClick={closeMobileElements} // Close menu/other elements if open
                                    className="text-gray-200 p-2 focus:outline-none focus-visible:bg-gray-700 rounded-md"
                                    aria-label={accountLinkProps.label}
                                >
                                    {accountLinkProps.icon}
                                </Link>
                            </motion.div>
                            {/* --- END MODIFICATION --- */}

                            <CartLink count={cartItems.length} isMobile={true} />
                        </div>
                    </div>

                    {/* Removed Mobile Search Bar */}

                </div>

                {/* Mobile Menu Drawer (Animated) */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            {/* Overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={toggleMenu} // Close menu when overlay is clicked
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                                aria-hidden="true"
                            />

                            {/* Menu Content */}
                            <motion.div
                                id="mobile-menu-drawer"
                                ref={menuRef} // Assign ref here
                                variants={menuVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-gray-900 shadow-2xl z-50 flex flex-col md:hidden" // Ensure hidden on md+
                                style={{ boxShadow: "-10px 0 30px -15px rgba(0, 0, 0, 0.3)" }}
                            >
                                {/* Menu Header */}
                                <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                                    <h3 className="text-teal-400 font-semibold text-base">Menu</h3>
                                    <button
                                        onClick={toggleMenu}
                                        className="text-gray-400 hover:text-white p-1 rounded-full focus:outline-none focus-visible:bg-gray-700"
                                        aria-label="Close menu"
                                    >
                                        <FaTimes className="text-xl" />
                                    </button>
                                </div>

                                {/* User Profile Section (if logged in) */}
                                {user && (
                                    <motion.div variants={mobileNavMenuItemVariants} className="px-4 py-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-800/80 flex-shrink-0">
                                        <div className="flex items-center">
                                            <div className="bg-teal-600 rounded-full p-2.5 mr-3 shadow-md">
                                                {user.role === 'admin' ? <FaUserShield className="text-white text-lg" /> : <FaUser className="text-white text-lg" />}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold text-sm truncate">{user.name}</h4>
                                                <p className="text-gray-300 text-xs truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Scrollable Content Area */}
                                <div className="flex-1 overflow-y-auto py-3 space-y-1 px-2">
                                    {/* Main Links */}
                                    <motion.div variants={mobileNavMenuItemVariants}>
                                        <MobileNavLink to="/" icon={<FaHome />} text="Home" onClick={toggleMenu} />
                                    </motion.div>
                                    <motion.div variants={mobileNavMenuItemVariants}>
                                        <MobileNavLink to="/allproduct" icon={<FaBoxes />} text="All Products" onClick={toggleMenu} />
                                    </motion.div>
                                    <motion.div variants={mobileNavMenuItemVariants}>
                                        <MobileNavLink to="/ContactUs" icon={<FaEnvelope />} text="Contact Us" onClick={toggleMenu} />
                                    </motion.div>

                                    {/* Divider */}
                                    <div className="pt-3 pb-1 px-2">
                                        <hr className="border-t border-gray-700" />
                                    </div>

                                    {/* Account Section */}
                                    <div className="px-2 pb-2 pt-2">
                                        <h4 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-2 ml-2">Account</h4>
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
                                                        className="flex items-center justify-between w-full px-4 py-3.5 text-left text-gray-200 hover:bg-gray-800 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:bg-gray-800 focus-visible:ring-2 focus-visible:ring-teal-500"
                                                    >
                                                        <div className="flex items-center">
                                                            <span className="text-teal-400 text-lg mr-4 w-5 text-center"><FaSignInAlt className="rotate-180" /></span>
                                                            <span className="font-medium text-sm">Logout</span>
                                                        </div>
                                                        <FaChevronRight className="text-gray-500 text-xs" />
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="pt-3 pb-1 px-2">
                                        <hr className="border-t border-gray-700" />
                                    </div>

                                    {/* Help Section */}
                                    <div className="px-2 pt-2 pb-4">
                                        <h4 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-3 ml-2">Help & Support</h4>
                                        <motion.div variants={mobileNavMenuItemVariants} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                            <div className="flex items-start mb-3">
                                                <FaQuestionCircle className="text-teal-400 mr-2.5 mt-0.5 text-lg flex-shrink-0" />
                                                <div>
                                                    <h3 className="text-white font-medium text-sm">Need Help?</h3>
                                                    <p className="text-gray-300 text-xs mt-1">
                                                        Having issues with a product or order? Report it here.
                                                    </p>
                                                </div>
                                            </div>
                                            <motion.button
                                                onClick={toggleComplaintFormVisibility}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                className="w-full bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg text-xs font-semibold transition-all shadow-md flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-teal-500"
                                                aria-expanded={showComplaintForm}
                                                aria-controls="complaint-form-section"
                                            >
                                                <FaInfoCircle className="mr-1.5" />
                                                {showComplaintForm ? 'Close Support Form' : 'Report an Issue'}
                                            </motion.button>

                                            {/* Complaint Form (Conditionally Rendered) */}
                                            <div id="complaint-form-section"> {/* ID for aria-controls */}
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

                                {/* Menu Footer (Optional) */}
                                <div className="px-4 py-3 border-t border-gray-700 text-center text-gray-500 text-xs flex-shrink-0">
                                    © {new Date().getFullYear()} Digital Shop Nepal
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default Navbar;

// Add this CSS transition for the padding if not using inline style transition
// (e.g., in your global CSS file like index.css)
/*
nav {
  transition-property: padding, background-color, box-shadow;
  transition-timing-function: ease-out;
  transition-duration: 300ms;
}
*/