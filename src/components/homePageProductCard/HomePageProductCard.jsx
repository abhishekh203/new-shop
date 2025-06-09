import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import myContext from "../../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import { 
  FaShoppingCart, 
  FaTrash, 
  FaEye, 
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSortAmountDown,
  FaSortAmountUpAlt
} from "react-icons/fa";
import { BsStars, BsLightningChargeFill, BsGrid3X3Gap } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";

const HomePageProductCard = () => {
  const navigate = useNavigate();
  const context = useContext(myContext);
  const { getAllProduct, loading: contextLoading } = context;

  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [sortOrder, setSortOrder] = useState("default");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const controls = useAnimation();

  // Define categories
  const categories = [
    { id: "all", name: "All Products", icon: <BsGrid3X3Gap /> },
    { id: "netflix", name: "Netflix", icon: <span className="text-red-500">N</span> },
    { id: "streaming", name: "Streaming", icon: <span className="text-green-500">S</span> },
    { id: "ott", name: "Platforms", icon: <span className="text-blue-400">OTT</span> },
    { id: "music", name: "Music", icon: <span className="text-purple-400">M</span> },
    { id: "software", name: "Software", icon: <span className="text-green-400">S</span> },
    { id: "games", name: "Games", icon: <span className="text-yellow-400">G</span> },
    { id: "education", name: "Education", icon: <span className="text-gray-400">E</span> },
    { id: "vpn", name: "VPN", icon: <span className="text-pink-400">V</span> },
    { id: "ai", name: "AI", icon: <span className="text-purple-400">A</span> }
  ];

  // Sort options
  const sortOptions = [
    { id: "default", name: "Recommended", icon: <BsGrid3X3Gap /> },
    { id: "price-low", name: "Price: Low to High", icon: <FaSortAmountDown /> },
    { id: "price-high", name: "Price: High to Low", icon: <FaSortAmountUpAlt /> },
    { id: "newest", name: "Newest First", icon: <BsLightningChargeFill /> }
  ];

  // Categorize and sort products
  const categorizeAndSortProducts = useCallback((products, sortType = "default") => {
    // First categorize
    const categorized = products.reduce((acc, product) => {
      const category = product.category?.toLowerCase() || "other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    // Then sort each category
    Object.keys(categorized).forEach(cat => {
      categorized[cat] = sortProducts(categorized[cat], sortType);
    });

    return categorized;
  }, []);

  // Sort products based on sort type
  const sortProducts = useCallback((products, sortType) => {
    switch(sortType) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price);
      case "newest":
        return [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      default:
        return [...products]; // Default order (as they come from API)
    }
  }, []);

  // Initialize products
  useEffect(() => {
    if (getAllProduct.length > 0) {
      const sortedAndCategorized = categorizeAndSortProducts(getAllProduct, sortOrder);
      setDisplayProducts(sortedAndCategorized);
      
      // Initialize expanded categories state
      const initialExpanded = {};
      Object.keys(sortedAndCategorized).forEach(cat => {
        initialExpanded[cat] = true;
      });
      setExpandedCategories(initialExpanded);
    }
  }, [getAllProduct, sortOrder, categorizeAndSortProducts]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Filter products based on search term
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = getAllProduct.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      if (searchTerm) {
        const categorized = categorizeAndSortProducts(filtered, sortOrder);
        setFilteredProducts(categorized);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, getAllProduct, sortOrder, categorizeAndSortProducts]);

  // Handle sort change
  const handleSortChange = (sortType) => {
    setSortOrder(sortType);
    setShowSortOptions(false);
    setShowMobileFilters(false);
    
    toast.success(`Sorted by ${sortOptions.find(o => o.id === sortType)?.name || 'default'}`, {
      icon: sortType === "price-high" ? <FaSortAmountUpAlt /> : 
            sortType === "price-low" ? <FaSortAmountDown /> : 
            sortType === "newest" ? <BsLightningChargeFill /> : <BsGrid3X3Gap />,
      style: {
        background: '#0a0a0a',
        color: '#fff',
        border: '1px solid #262626'
      },
      position: 'bottom-right'
    });
  };

  // Toggle sort options dropdown
  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  // Close sort options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortOptions && !event.target.closest('.sort-container')) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortOptions]);

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Toggle wishlist item with animation
  const toggleWishlist = async (productId) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId];
      
      // Show toast notification
      toast[prev.includes(productId) ? "error" : "success"](
        prev.includes(productId) ? "Removed from wishlist" : "Added to wishlist",
        {
          icon: prev.includes(productId) ? (
            <FaRegHeart className="text-red-400" />
          ) : (
            <FaHeart className="text-red-500" />
          ),
          style: {
            background: '#0a0a0a',
            color: '#fff',
            border: '1px solid #262626'
          },
          position: 'bottom-right'
        }
      );
      
      return newWishlist;
    });

    // Heart pulse animation
    if (!wishlist.includes(productId)) {
      await controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5 }
      });
    }
  };

  // Add to cart with animation
  const addCart = (item) => {
    dispatch(addToCart(item));
    toast.success("Added to cart", {
      icon: <FaShoppingCart className="text-green-400" />,
      style: {
        background: '#0a0a0a',
        color: '#fff',
        border: '1px solid #262626'
      },
      position: 'bottom-right'
    });
  };

  // Remove from cart with animation
  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Removed from cart", {
      icon: <FaTrash className="text-red-400" />,
      style: {
        background: '#0a0a0a',
        color: '#fff',
        border: '1px solid #262626'
      },
      position: 'bottom-right'
    });
  };

  // Clear search term
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        when: "beforeChildren",
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };



  const imageHoverVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 }
  };

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    }
  };

  const categoryVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const categoryHeaderVariants = {
    rest: { backgroundColor: "rgba(17, 24, 39, 0.8)" },
    hover: { backgroundColor: "rgba(31, 41, 55, 0.8)" }
  };

  const mobileFilterVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const filterItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  // Determine which products to show based on search
  const productsToShow = searchTerm ? filteredProducts : displayProducts;
  const visibleCategories = Object.keys(productsToShow).filter(cat => 
    activeCategory === "all" || cat === activeCategory
  );

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-8">
      {[1, 2, 3].map((_, index) => (
        <div key={index} className="bg-gray-900/50 rounded-xl overflow-hidden">
          <div className="p-4 bg-gray-800/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gray-700 p-2 rounded-lg w-10 h-10 animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-5 w-16 bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="h-5 w-5 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {[1, 2, 3, 4].map((_, idx) => (
              <div key={idx} className="border border-gray-800 rounded-xl overflow-hidden shadow-xl bg-gray-900">
                <div className="h-64 bg-gray-800 animate-pulse"></div>
                <div className="p-5">
                  <div className="h-4 w-24 bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-5 w-full bg-gray-700 rounded mb-3 animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-10 w-24 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-black min-h-screen px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #1f2937 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #374151 0%, transparent 50%)`,
          backgroundSize: '150px 150px'
        }}></div>
      </div>

      {/* Enhanced Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mb-16"
      >


        {/* Search and Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Enhanced Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <FaSearch className="h-5 w-5 text-gray-400" />
                <div className="h-4 w-px bg-gray-600"></div>
              </div>
              <input
                type="text"
                placeholder="Search products, categories, or keywords..."
                className="w-full pl-12 pr-12 py-4 border border-gray-600/50 rounded-xl bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <motion.button
                  onClick={clearSearch}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-700/50 transition-colors"
                >
                  <FaTimes className="text-gray-400 hover:text-gray-200 h-4 w-4" />
                </motion.button>
              )}
            </div>
            {/* Filter and Sort Controls */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              {/* Mobile Filter Button */}
              {isMobile && (
                <motion.button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 text-gray-300 hover:text-white transition-all duration-300"
                >
                  <FiFilter className="h-4 w-4" />
                  <span>Filters</span>
                </motion.button>
              )}

              {/* Enhanced Sort Dropdown */}
              {!isMobile && (
                <div className="sort-container relative">
                  <motion.button
                    onClick={toggleSortOptions}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-5 py-3 border border-gray-600/50 rounded-xl bg-gray-700/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm min-w-[200px]"
                  >
                    {sortOrder === "price-high" ? (
                      <FaSortAmountUpAlt className="text-blue-400" />
                    ) : sortOrder === "price-low" ? (
                      <FaSortAmountDown className="text-green-400" />
                    ) : sortOrder === "newest" ? (
                      <BsLightningChargeFill className="text-yellow-400" />
                    ) : (
                      <BsGrid3X3Gap className="text-purple-400" />
                    )}
                    <span className="flex-1 text-left">
                      {sortOrder === "price-high" ? "💎 Price: High to Low" :
                       sortOrder === "price-low" ? "💰 Price: Low to High" :
                       sortOrder === "newest" ? "🆕 Newest First" : "🌟 Recommended"}
                    </span>
                    <motion.div
                      animate={{ rotate: showSortOptions ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown className="h-4 w-4 text-gray-400" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {showSortOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-full bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-2xl z-20 overflow-hidden border border-gray-700/50"
                      >
                        {sortOptions.map(option => (
                          <motion.button
                            key={option.id}
                            onClick={() => handleSortChange(option.id)}
                            whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.8)" }}
                            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-all duration-200 ${
                              sortOrder === option.id
                                ? "bg-blue-600/20 text-blue-300 border-l-2 border-blue-500"
                                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                            }`}
                          >
                            <span className={sortOrder === option.id ? "text-blue-400" : "text-gray-400"}>
                              {option.icon}
                            </span>
                            {option.name}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Mobile Filters Panel */}
      <AnimatePresence>
        {isMobile && showMobileFilters && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileFilterVariants}
            className="relative z-10 bg-gradient-to-br from-gray-900/90 to-gray-800/70 backdrop-blur-xl rounded-2xl p-6 mb-8 shadow-2xl border border-gray-700/30"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
                  <FiFilter className="text-white text-lg" />
                </div>
                <h3 className="text-xl font-bold text-white">Filters</h3>
              </div>
              <motion.button
                onClick={() => setShowMobileFilters(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </motion.button>
            </div>

            <div className="space-y-6">
              {/* Categories Section */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BsGrid3X3Gap className="text-blue-400" />
                  Categories
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(category => (
                    <motion.button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setShowMobileFilters(false);
                      }}
                      variants={filterItemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        activeCategory === category.id
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="truncate">{category.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sort Section */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FaSortAmountDown className="text-green-400" />
                  Sort By
                </h4>
                <div className="space-y-3">
                  {sortOptions.map(option => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleSortChange(option.id)}
                      variants={filterItemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-4 py-3 text-sm rounded-xl flex items-center gap-3 transition-all duration-300 ${
                        sortOrder === option.id
                          ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70 hover:text-white"
                      }`}
                    >
                      <span className={`text-lg ${sortOrder === option.id ? "text-white" : "text-gray-400"}`}>
                        {option.icon}
                      </span>
                      <span className="font-medium">{option.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Category Tabs - Desktop */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="relative z-10 mb-12"
        >
          <div className="bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg">
                <BsGrid3X3Gap className="text-white text-lg" />
              </div>
              <h3 className="text-xl font-bold text-white">Browse Categories</h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70 hover:text-white hover:shadow-md"
                  }`}
                >
                  {/* Background Glow Effect */}
                  {activeCategory === category.id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <span className={`relative z-10 text-lg ${
                    activeCategory === category.id ? "text-white" : "text-gray-400 group-hover:text-white"
                  }`}>
                    {category.icon}
                  </span>
                  <span className="relative z-10">{category.name}</span>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:to-cyan-600/10 rounded-xl transition-all duration-300"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {contextLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <AnimatePresence>
              {visibleCategories.map(category => {
                const categoryProducts = productsToShow[category] || [];
                const isExpanded = expandedCategories[category] !== false;
                const categoryData = categories.find(c => c.id === category) || categories[0];

                return (
                  <motion.div 
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-900/50 rounded-xl overflow-hidden"
                  >
                    {/* Enhanced Category Header */}
                    <motion.div
                      variants={categoryHeaderVariants}
                      initial="rest"
                      whileHover="hover"
                      className="p-6 cursor-pointer flex justify-between items-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm"
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 rounded-xl shadow-lg"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <span className="text-xl">{categoryData.icon}</span>
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-white capitalize mb-1">
                            {category.replace(/-/g, " ")}
                          </h3>
                          <motion.span
                            className="inline-flex items-center gap-2 text-sm bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            {categoryProducts.length} {categoryProducts.length === 1 ? "product" : "products"}
                          </motion.span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                        className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                      >
                        <FaChevronDown className="text-gray-300 text-lg" />
                      </motion.div>
                    </motion.div>

                    {/* Category Products */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          variants={categoryVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={isMobile ? "flex flex-wrap gap-4 p-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"}
                        >
                          {categoryProducts.map((item) => {
                            const { id, title, price, productImageUrl, discount, isNew } = item;
                            const isInCart = cartItems.some(p => p?.id === id);
                            const isInWishlist = wishlist.includes(id);

                            return (
                              <motion.div
                                key={id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                exit="exit"
                                layout
                                className={`group relative ${isMobile ? "w-[calc(50%-8px)]" : "w-full"}`}
                              >
                                <div className="h-full bg-gradient-to-br from-gray-900/90 to-gray-800/70 border border-gray-700/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:border-blue-400/40 hover:-translate-y-2 backdrop-blur-sm relative">
                                  {/* Enhanced Badges */}
                                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                    {discount && (
                                      <motion.div
                                        variants={badgeVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ scale: 1.1 }}
                                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg backdrop-blur-sm"
                                      >
                                        <BsStars className="mr-1.5" /> {discount}% OFF
                                      </motion.div>
                                    )}
                                    {isNew && (
                                      <motion.div
                                        variants={badgeVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ scale: 1.1 }}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg backdrop-blur-sm"
                                      >
                                        <BsLightningChargeFill className="mr-1.5" /> NEW
                                      </motion.div>
                                    )}
                                  </div>

                                  {/* Enhanced Wishlist Button */}
                                  <motion.button
                                    variants={badgeVariants}
                                    initial="hidden"
                                    animate="visible"
                                    onClick={() => toggleWishlist(id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute top-4 right-4 z-10 p-3 rounded-full bg-gray-900/80 backdrop-blur-md hover:bg-gray-800/80 transition-all duration-300 border border-gray-600/50 shadow-lg"
                                  >
                                    {isInWishlist ? (
                                      <motion.div
                                        animate={controls}
                                        className="relative"
                                      >
                                        <FaHeart className="text-red-500 text-lg" />
                                        <motion.div
                                          className="absolute inset-0 bg-red-500/20 rounded-full"
                                          animate={{ scale: [1, 1.5, 1] }}
                                          transition={{ duration: 0.6, repeat: Infinity }}
                                        />
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        whileHover={{ scale: 1.2 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <FaRegHeart className="text-gray-300 hover:text-red-400 text-lg" />
                                      </motion.div>
                                    )}
                                  </motion.button>

                                  {/* Enhanced Product Image */}
                                  <motion.div
                                    className="relative w-full overflow-hidden group/image"
                                    style={{ height: isMobile ? "180px" : "280px" }}
                                    variants={imageHoverVariants}
                                    initial="rest"
                                    whileHover="hover"
                                  >
                                    <img
                                      onClick={() => navigate(`/productinfo/${id}`)}
                                      className="h-full w-full object-cover cursor-pointer transition-all duration-700 ease-out group-hover:scale-110"
                                      src={productImageUrl}
                                      alt={title}
                                      loading="lazy"
                                    />

                                    {/* Gradient Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:to-cyan-600/10 transition-all duration-500"></div>

                                    {/* Quick View Overlay */}
                                    <div
                                      onClick={() => navigate(`/productinfo/${id}`)}
                                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                                    >
                                      <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileHover={{ scale: 1, opacity: 1 }}
                                        className="bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/20 shadow-xl"
                                      >
                                        <FaEye className="text-white text-xl" />
                                      </motion.div>
                                    </div>
                                  </motion.div>

                                  {/* Enhanced Product Info */}
                                  <div className={isMobile ? "p-4" : "p-6"}>
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start mb-3">
                                      <span className="text-xs font-semibold text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
                                        Digital Shop Nepal
                                      </span>
                                      {isInCart && (
                                        <motion.span
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full font-semibold shadow-lg"
                                        >
                                          <FaShoppingCart size={10} />
                                          In Cart
                                        </motion.span>
                                      )}
                                    </div>

                                    {/* Product Title */}
                                    <motion.h1
                                      onClick={() => navigate(`/productinfo/${id}`)}
                                      className={`${isMobile ? "text-base" : "text-xl"} font-bold text-white mb-3 cursor-pointer hover:text-transparent hover:bg-gradient-to-r hover:bg-clip-text hover:from-blue-400 hover:to-cyan-400 transition-all duration-300 line-clamp-2 leading-tight`}
                                      title={title}
                                      whileHover={{ x: 3 }}
                                    >
                                      {title}
                                    </motion.h1>

                                    {/* Price and Action Section */}
                                    <div className="flex justify-between items-end mt-4">
                                      <div className="flex-1">
                                        <motion.p
                                          className={`${isMobile ? "text-lg" : "text-2xl"} font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1`}
                                          whileHover={{ scale: 1.05 }}
                                        >
                                          रु {price.toLocaleString()}
                                        </motion.p>
                                        {discount && (
                                          <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500 line-through`}>
                                            रु {Math.round(price * (1 + discount/100)).toLocaleString()}
                                          </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">Digital Product</p>
                                      </div>

                                      {/* Enhanced Action Button */}
                                      <motion.button
                                        onClick={() => isInCart ? deleteCart(item) : addCart(item)}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`${isMobile ? "py-2 px-3 text-sm" : "py-3 px-4 text-sm"} rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg relative overflow-hidden ${
                                          isInCart
                                            ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-red-500/25"
                                            : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-blue-500/25"
                                        }`}
                                      >
                                        {/* Button Background Effect */}
                                        <motion.div
                                          className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10"
                                          initial={{ x: '-100%' }}
                                          whileHover={{ x: '100%' }}
                                          transition={{ duration: 0.6 }}
                                        />

                                        <span className="relative z-10 flex items-center gap-2">
                                          {isInCart ? (
                                            <>
                                              <FaTrash size={isMobile ? 12 : 14} />
                                              {!isMobile && <span>Remove</span>}
                                            </>
                                          ) : (
                                            <>
                                              <FaShoppingCart size={isMobile ? 12 : 14} />
                                              {!isMobile && <span>Add to Cart</span>}
                                            </>
                                          )}
                                        </span>
                                      </motion.button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Enhanced Empty State */}
            {!isSearching && visibleCategories.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-24 relative z-10"
              >
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl p-12 border border-gray-700/30 shadow-2xl max-w-2xl mx-auto">
                  {/* Animated Icon */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative mb-8"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-xl"></div>
                    <div className="relative bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-full border border-gray-600/50">
                      <FaSearch className="text-gray-400 text-6xl" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="space-y-4 mb-8"
                  >
                    <h3 className="text-3xl font-bold text-white">No Products Found</h3>
                    <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
                      We couldn't find any products matching your criteria.
                      Try adjusting your search or explore different categories.
                    </p>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <motion.button
                      onClick={clearSearch}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <FaTimes size={16} />
                      <span>Clear Search</span>
                    </motion.button>

                    <motion.button
                      onClick={() => setActiveCategory("all")}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white font-bold rounded-xl border border-gray-600/50 hover:border-gray-500/70 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <BsGrid3X3Gap size={16} />
                      <span>Show All Categories</span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default HomePageProductCard;