import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/SearchBar";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { 
  FaShoppingCart, 
  FaPhoneAlt, 
  FaUser,
  FaUserShield,
  FaSignInAlt,
  FaUserPlus,
  FaHome,
  FaBoxes,
  FaSearch,
  FaBars,
  FaTimes,
  FaQuestionCircle,
  FaInfoCircle,
  FaShoppingBag,
  FaEnvelope,
  FaChevronRight
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "../Topbar";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("users"));
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart);
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const searchInputRef = useRef(null);
  const menuRef = useRef(null);

  // Complaint form state
  const [complaintData, setComplaintData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    whatsappNumber: "",
    productPurchased: "",
    dateOfPurchase: "",
    problemDescription: ""
  });

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setSearchOpen(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (e) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      menuRef.current.scrollTo(0, 0);
    }
  }, [isMenuOpen, showComplaintForm]);

  const logout = () => {
    localStorage.removeItem("users");
    navigate("/login");
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (searchOpen) setSearchOpen(false);
    setShowComplaintForm(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
    
    if (!searchOpen) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const toggleComplaintForm = () => {
    setShowComplaintForm(!showComplaintForm);
    if (!showComplaintForm) {
      setTimeout(() => {
        if (menuRef.current) {
          menuRef.current.scrollTo({ 
            top: menuRef.current.scrollHeight, 
            behavior: 'smooth' 
          });
        }
      }, 300);
    }
  };

  const handleComplaintChange = (e) => {
    const { name, value } = e.target;
    setComplaintData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("https://getform.io/f/your-form-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...complaintData,
          userRole: user?.role || "guest",
          submittedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        alert("Thank you! We've received your complaint and will contact you soon.");
        setComplaintData({
          name: user?.name || "",
          email: user?.email || "",
          whatsappNumber: "",
          productPurchased: "",
          dateOfPurchase: "",
          problemDescription: ""
        });
        setShowComplaintForm(false);
      } else {
        throw new Error("Failed to submit complaint");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Oops! Something went wrong. Please try again later.");
    }
  };

  // Animation variants
  const menuVariants = {
    open: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        when: "beforeChildren"
      }
    },
    closed: { 
      x: "100%",
      opacity: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.02,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };

  const itemVariants = {
    open: { 
      opacity: 1,
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20
      }
    },
    closed: { 
      opacity: 0,
      x: 50,
      transition: { duration: 0.2 }
    }
  };

  const formVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4
      }
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.3
      }
    }
  };

  const searchVariants = {
    open: {
      height: "auto",
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    closed: {
      height: 0,
      opacity: 0,
      y: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <>
      <TopBar />

      <nav className={`bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 shadow-lg sticky top-0 z-50 transition-all duration-300 ${scrolled ? "py-1" : "py-2"}`}>
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <Link
                to="/"
                onClick={handleHomeClick}
                className="text-white font-bold text-2xl hover:text-teal-400 transition duration-300 flex items-center"
              >
                <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                  Digital Shop Nepal
                </span>
              </Link>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              className="flex-1 max-w-xl mx-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SearchBar />
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <NavLink to="/" icon={<FaHome />} text="Home" delay={0.3} />
              <NavLink to="/allproduct" icon={<FaBoxes />} text="Products" delay={0.4} />
              
              {!user ? (
                <>
                  <NavLink to="/login" icon={<FaSignInAlt />} text="Login" delay={0.5} />
                  <NavLink to="/signup" icon={<FaUserPlus />} text="Signup" delay={0.6} />
                </>
              ) : (
                <>
                  {user?.role === "user" && (
                    <NavLink to="/user-dashboard" icon={<FaUser />} text="Dashboard" delay={0.5} />
                  )}
                  {user?.role === "admin" && (
                    <NavLink to="/admin-dashboard" icon={<FaUserShield />} text="Admin" delay={0.5} />
                  )}
                  <motion.button
                    onClick={logout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white hover:text-red-400 transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    Logout
                  </motion.button>
                </>
              )}

              <CartLink count={cartItems.length} delay={0.8} />
              <NavLink to="/ContactUs" icon={<FaPhoneAlt />} text="Contact" delay={0.9} />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between">
            {/* Mobile Menu Button */}
            <motion.button
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-white p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <FaBars className="text-xl" />
            </motion.button>

            {/* Logo - Centered */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 text-center"
            >
              <Link
                to="/"
                onClick={handleHomeClick}
                className="text-white font-bold hover:text-teal-400 transition duration-300 inline-block"
              >
                <span className="text-sm bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                  DIGITAL SHOP NEPAL
                </span>
              </Link>
            </motion.div>

            {/* Right Icons */}
            <div className="flex items-center space-x-2">
              {/* Account Button */}
              <motion.button
                onClick={toggleMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white p-2 focus:outline-none"
                aria-label="Account"
              >
                <FaUser className="text-xl" />
              </motion.button>

              {/* Cart Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  to="/cart"
                  className="text-white p-2 relative focus:outline-none"
                >
                  <FaShoppingCart className="text-xl" />
                  {cartItems.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-gray-900"
                    >
                      {cartItems.length > 9 ? '9+' : cartItems.length}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                variants={searchVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="overflow-hidden bg-gray-800 rounded-lg mt-2"
              >
                <div className="p-2">
                  <div className="relative flex items-center">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white placeholder-gray-400 rounded-lg px-4 py-2 w-full outline-none text-gray-800 focus:ring-2 focus:ring-blue-500 transition duration-200 border border-gray-300 text-sm pr-10"
                    />
                    <motion.button
                      onClick={handleSearchClose}
                      className="absolute right-2 text-gray-500 hover:text-gray-700 transition-colors"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTimes size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu - Side Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={toggleMenu}
                className="fixed inset-0 bg-black z-40"
              />
              
              {/* Menu Drawer */}
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-gray-900 shadow-xl z-50 overflow-y-auto"
                ref={menuRef}
                style={{ boxShadow: "-10px 0 30px -15px rgba(0, 0, 0, 0.5)" }}
              >
                <div className="h-full flex flex-col">
                  {/* Menu Header */}
                  <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
                    <h3 className="text-teal-400 font-bold text-lg">Menu</h3>
                    <button 
                      onClick={toggleMenu}
                      className="text-gray-400 hover:text-white p-1 transition-colors"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>

                  {/* User Profile Section */}
                  {user && (
                    <div className="px-4 py-3 border-b border-gray-800 bg-gray-800">
                      <div className="flex items-center">
                        <div className="bg-teal-500 rounded-full p-2 mr-3">
                          <FaUser className="text-white text-lg" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{user.name}</h4>
                          <p className="text-gray-300 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto py-2">
                    <motion.div className="space-y-1 px-2">
                      {/* Main Links */}
                      <motion.div variants={itemVariants}>
                        <MobileNavLink 
                          to="/" 
                          icon={<FaHome className="text-teal-400" />} 
                          text="Home" 
                          onClick={toggleMenu} 
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <MobileNavLink 
                          to="/allproduct" 
                          icon={<FaBoxes className="text-teal-400" />} 
                          text="All Products" 
                          onClick={toggleMenu} 
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <MobileNavLink 
                          to="/ContactUs" 
                          icon={<FaEnvelope className="text-teal-400" />} 
                          text="Contact Us" 
                          onClick={toggleMenu} 
                        />
                      </motion.div>

                      {/* Account Section */}
                      <div className="pt-4 pb-2 px-2">
                        <h4 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Account</h4>
                        
                        {!user ? (
                          <>
                            <motion.div variants={itemVariants}>
                              <MobileNavLink 
                                to="/login" 
                                icon={<FaSignInAlt className="text-teal-400" />} 
                                text="Login" 
                                onClick={toggleMenu} 
                              />
                            </motion.div>
                            
                            <motion.div variants={itemVariants}>
                              <MobileNavLink 
                                to="/signup" 
                                icon={<FaUserPlus className="text-teal-400" />} 
                                text="Sign Up" 
                                onClick={toggleMenu} 
                              />
                            </motion.div>
                          </>
                        ) : (
                          <>
                            {user?.role === "user" && (
                              <motion.div variants={itemVariants}>
                                <MobileNavLink 
                                  to="/user-dashboard" 
                                  icon={<FaUser className="text-teal-400" />} 
                                  text="My Account" 
                                  onClick={toggleMenu} 
                                />
                              </motion.div>
                            )}
                            
                            {user?.role === "admin" && (
                              <motion.div variants={itemVariants}>
                                <MobileNavLink 
                                  to="/admin-dashboard" 
                                  icon={<FaUserShield className="text-teal-400" />} 
                                  text="Admin Panel" 
                                  onClick={toggleMenu} 
                                />
                              </motion.div>
                            )}
                            
                            <motion.div variants={itemVariants}>
                              <button
                                onClick={() => {
                                  logout();
                                  toggleMenu();
                                }}
                                className="flex items-center justify-between w-full px-4 py-3 text-left text-white hover:bg-gray-800 rounded-lg transition-colors"
                              >
                                <div className="flex items-center">
                                  <FaSignInAlt className="text-teal-400 mr-3" />
                                  <span className="font-medium">Logout</span>
                                </div>
                                <FaChevronRight className="text-gray-400 text-sm" />
                              </button>
                            </motion.div>
                          </>
                        )}
                      </div>

                      {/* Help Section */}
                      <div className="px-2 pt-2 pb-4">
                        <h4 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Help & Support</h4>
                        
                        <motion.div variants={itemVariants}>
                          <div className="bg-gray-800 rounded-xl p-4">
                            <div className="flex items-start mb-3">
                              <FaQuestionCircle className="text-teal-400 mr-2 mt-1" />
                              <div>
                                <h3 className="text-white font-medium">Need Help?</h3>
                                <p className="text-gray-300 text-sm mt-1">
                                  Having issues with a product? Our support team is here to help.
                                </p>
                              </div>
                            </div>
                            
                            <motion.button
                              onClick={toggleComplaintForm}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all shadow-md flex items-center justify-center"
                            >
                              <FaInfoCircle className="mr-2" />
                              Report an Issue
                            </motion.button>
                          </div>
                        </motion.div>

                        {/* Complaint Form */}
                        <AnimatePresence>
                          {showComplaintForm && (
                            <motion.div
                              variants={formVariants}
                              initial="closed"
                              animate="open"
                              exit="closed"
                              className="bg-gray-800 rounded-xl overflow-hidden shadow-inner mt-3"
                            >
                              <div className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-teal-400 font-medium flex items-center text-sm">
                                    <FaInfoCircle className="mr-2" />
                                    Product Support Form
                                  </h3>
                                  <button 
                                    onClick={toggleComplaintForm}
                                    className="text-gray-400 hover:text-white p-1 transition-colors"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                                
                                <form onSubmit={handleComplaintSubmit} className="space-y-3">
                                  <div>
                                    <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1">
                                      Full Name *
                                    </label>
                                    <input
                                      type="text"
                                      id="name"
                                      name="name"
                                      value={complaintData.name}
                                      onChange={handleComplaintChange}
                                      required
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
                                      Email Address *
                                    </label>
                                    <input
                                      type="email"
                                      id="email"
                                      name="email"
                                      value={complaintData.email}
                                      onChange={handleComplaintChange}
                                      required
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="whatsappNumber" className="block text-xs font-medium text-gray-300 mb-1">
                                      WhatsApp Number *
                                    </label>
                                    <input
                                      type="tel"
                                      id="whatsappNumber"
                                      name="whatsappNumber"
                                      value={complaintData.whatsappNumber}
                                      onChange={handleComplaintChange}
                                      required
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                      placeholder="+977 98XXXXXXXX"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="productPurchased" className="block text-xs font-medium text-gray-300 mb-1">
                                      Product Name *
                                    </label>
                                    <input
                                      type="text"
                                      id="productPurchased"
                                      name="productPurchased"
                                      value={complaintData.productPurchased}
                                      onChange={handleComplaintChange}
                                      required
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="dateOfPurchase" className="block text-xs font-medium text-gray-300 mb-1">
                                      Purchase Date *
                                    </label>
                                    <input
                                      type="date"
                                      id="dateOfPurchase"
                                      name="dateOfPurchase"
                                      value={complaintData.dateOfPurchase}
                                      onChange={handleComplaintChange}
                                      required
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label htmlFor="problemDescription" className="block text-xs font-medium text-gray-300 mb-1">
                                      Describe Your Issue *
                                    </label>
                                    <textarea
                                      id="problemDescription"
                                      name="problemDescription"
                                      value={complaintData.problemDescription}
                                      onChange={handleComplaintChange}
                                      required
                                      rows={3}
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                      placeholder="Please describe your problem in detail..."
                                    />
                                  </div>
                                  
                                  <div className="pt-2">
                                    <motion.button
                                      type="submit"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all shadow-md"
                                    >
                                      Submit Complaint
                                    </motion.button>
                                  </div>
                                </form>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-gray-800 text-center text-gray-400 text-xs">
                    © {new Date().getFullYear()} Digital Shop Nepal. All rights reserved.
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

// Reusable NavLink Component with animation delay
const NavLink = ({ to, icon, text, delay = 0 }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }} 
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Link
      to={to}
      className="flex items-center text-white hover:text-teal-400 transition-colors"
    >
      <span className="mr-2">{icon}</span>
      {text}
    </Link>
  </motion.div>
);

// Reusable Mobile NavLink Component
const MobileNavLink = ({ to, icon, text, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center justify-between px-4 py-3 text-white hover:bg-gray-800 rounded-lg transition-colors"
  >
    <div className="flex items-center">
      {icon}
      <span className="ml-3 font-medium">{text}</span>
    </div>
    <FaChevronRight className="text-gray-400 text-sm" />
  </Link>
);

// CartLink Component
const CartLink = ({ count, delay = 0 }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }} 
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
  >
    <Link
      to="/cart"
      className="flex items-center text-white hover:text-teal-400 transition-colors relative"
    >
      <FaShoppingCart className="mr-2 text-lg" />
      <span className="hidden md:inline">Cart</span>
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center md:-top-2 md:-right-2 border border-gray-900"
        >
          {count > 9 ? '9+' : count}
        </motion.span> 
      )}
    </Link>
  </motion.div>
);
 
export default Navbar;