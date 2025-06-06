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

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
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
    <div className="bg-black min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with search and sort */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-white">
            Digital Products
          </h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-600 to-pink-600 px-3 py-1 rounded-full"
          >
            <BsStars className="text-yellow-200" />
            <span className="text-sm font-medium text-white">Premium</span>
          </motion.div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full md:w-64"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-8 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <motion.button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes className="text-gray-400 hover:text-gray-300" />
              </motion.button>
            )}
          </motion.div>

          {/* Mobile Filter Button */}
          {isMobile && (
            <motion.button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg text-gray-200 transition-colors border border-gray-800"
            >
              <FiFilter />
              <span>Filters</span>
            </motion.button>
          )}

          {/* Sort Button and Dropdown - Hidden on mobile */}
          {!isMobile && (
            <div className="sort-container relative">
              <motion.button
                onClick={toggleSortOptions}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg text-gray-200 transition-colors border border-gray-800 w-full md:w-auto"
              >
                {sortOrder === "price-high" ? (
                  <FaSortAmountUpAlt />
                ) : sortOrder === "price-low" ? (
                  <FaSortAmountDown />
                ) : sortOrder === "newest" ? (
                  <BsLightningChargeFill />
                ) : (
                  <BsGrid3X3Gap />
                )}
                <span className="hidden sm:inline">
                  {sortOrder === "price-high" ? "Price: High to Low" : 
                   sortOrder === "price-low" ? "Price: Low to High" : 
                   sortOrder === "newest" ? "Newest" : "Sort"}
                </span>
                <motion.div
                  animate={{ rotate: showSortOptions ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown className="text-xs" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {showSortOptions && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl z-20 overflow-hidden"
                  >
                    {sortOptions.map(option => (
                      <motion.button
                        key={option.id}
                        onClick={() => handleSortChange(option.id)}
                        whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.8)" }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                          sortOrder === option.id 
                            ? "bg-orange-600 text-white" 
                            : "text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {option.icon}
                        {option.name}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile Filters Panel */}
      <AnimatePresence>
        {isMobile && showMobileFilters && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileFilterVariants}
            className="bg-gray-900 rounded-xl p-4 mb-6 shadow-lg border border-gray-800"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <motion.button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setShowMobileFilters(false);
                      }}
                      variants={filterItemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeCategory === category.id
                          ? "bg-orange-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Sort By</h4>
                <div className="flex flex-col gap-2">
                  {sortOptions.map(option => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleSortChange(option.id)}
                      variants={filterItemVariants}
                      whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.8)" }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 ${
                        sortOrder === option.id 
                          ? "bg-orange-600 text-white" 
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {option.icon}
                      {option.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tabs - Desktop */}
      {!isMobile && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-orange-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category.icon}
              {category.name}
            </motion.button>
          ))}
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
                    {/* Category Header */}
                    <motion.div
                      variants={categoryHeaderVariants}
                      initial="rest"
                      whileHover="hover"
                      className="p-4 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="bg-gray-800 p-2 rounded-lg"
                          whileHover={{ rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {categoryData.icon}
                        </motion.div>
                        <h3 className="text-lg font-semibold text-white capitalize">
                          {category.replace(/-/g, " ")}
                        </h3>
                        <motion.span 
                          className="text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
                          whileHover={{ scale: 1.1 }}
                        >
                          {categoryProducts.length} {categoryProducts.length === 1 ? "item" : "items"}
                        </motion.span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaChevronDown className="text-gray-400" />
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
                                <div className="h-full border border-gray-800 rounded-xl overflow-hidden shadow-xl bg-gray-900 relative hover:border-gray-700 transition-colors">
                                  {/* Badges */}
                                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                    {discount && (
                                      <motion.div 
                                        variants={badgeVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ scale: 1.1 }}
                                        className="bg-black text-orange-400 text-xs font-bold px-2 py-1 rounded-full flex items-center border border-orange-400/30"
                                      >
                                        <BsStars className="mr-1" /> {discount}% OFF
                                      </motion.div>
                                    )}
                                    {isNew && (
                                      <motion.div 
                                        variants={badgeVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ scale: 1.1 }}
                                        className="bg-black text-blue-400 text-xs font-bold px-2 py-1 rounded-full flex items-center border border-blue-400/30"
                                      >
                                        <BsLightningChargeFill className="mr-1" /> NEW
                                      </motion.div>
                                    )}
                                  </div>

                                  {/* Wishlist button */}
                                  <motion.button
                                    variants={badgeVariants}
                                    initial="hidden"
                                    animate="visible"
                                    onClick={() => toggleWishlist(id)}
                                    whileTap={{ scale: 0.8 }}
                                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/80 hover:bg-gray-800 transition-colors border border-gray-800"
                                  >
                                    {isInWishlist ? (
                                      <motion.div
                                        animate={controls}
                                      >
                                        <FaHeart className="text-red-500 text-lg" />
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

                                  {/* Product Image */}
                                  <motion.div 
                                    className="relative w-full overflow-hidden"
                                    style={{ height: isMobile ? "160px" : "256px" }}
                                    variants={imageHoverVariants}
                                    initial="rest"
                                    whileHover="hover"
                                  >
                                    <img
                                      onClick={() => navigate(`/productinfo/${id}`)}
                                      className="h-full w-full object-cover cursor-pointer"
                                      src={productImageUrl}
                                      alt={title}
                                      loading="lazy"
                                    />
                                    <div 
                                      onClick={() => navigate(`/productinfo/${id}`)}
                                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                                    >
                                      <motion.div
                                        whileHover={{ scale: 1.2 }}
                                        className="bg-white bg-opacity-90 rounded-full p-3"
                                      >
                                        <FaEye className="text-gray-900 text-lg" />
                                      </motion.div>
                                    </div>
                                  </motion.div>

                                  {/* Product Info */}
                                  <div className={isMobile ? "p-3" : "p-5"}>
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="text-xs font-medium text-gray-400">Digital Shop</span>
                                      {isInCart && (
                                        <motion.span
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full"
                                        >
                                          In Cart
                                        </motion.span>
                                      )}
                                    </div>
                                    
                                    <motion.h1 
                                      onClick={() => navigate(`/productinfo/${id}`)}
                                      className={`${isMobile ? "text-sm" : "text-lg"} font-medium text-white mb-1 cursor-pointer hover:text-orange-400 transition-colors line-clamp-2`}
                                      title={title}
                                      whileHover={{ x: 2 }}
                                    >
                                      {title}
                                    </motion.h1>

                                    <div className="flex justify-between items-center mt-2">
                                      <div>
                                        <motion.p 
                                          className={`${isMobile ? "text-md" : "text-xl"} font-bold text-orange-400`}
                                          whileHover={{ scale: 1.03 }}
                                        >
                                          रु {price.toLocaleString()}
                                        </motion.p>
                                        {discount && (
                                          <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500 line-through`}>
                                            रु {Math.round(price * (1 + discount/100)).toLocaleString()}
                                          </p>
                                        )}
                                      </div>

                                      <motion.button
                                        onClick={() => isInCart ? deleteCart(item) : addCart(item)}
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        className={`${isMobile ? "py-1 px-2 text-sm" : "py-2 px-3"} rounded-lg font-medium transition-all flex items-center ${
                                          isInCart 
                                            ? "bg-red-700 hover:bg-red-600 border border-red-800" 
                                            : "bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white"
                                        }`}
                                      >
                                        {isInCart ? (
                                          <>
                                            <FaTrash className={isMobile ? "" : "mr-1"} /> 
                                            {!isMobile && <span>Remove</span>}
                                          </>
                                        ) : (
                                          <>
                                            <FaShoppingCart className={isMobile ? "" : "mr-1"} /> 
                                            {!isMobile && <span>Add</span>}
                                          </>
                                        )}
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

            {/* Empty state */}
            {!isSearching && visibleCategories.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-gray-400 text-5xl mb-4 inline-block"
                >
                  <FaSearch />
                </motion.div>
                <h3 className="text-xl font-medium text-white">No products found</h3>
                <p className="mt-2 text-gray-400">
                  Try adjusting your search or select a different category.
                </p>
                <div className="flex gap-3 justify-center mt-4">
                  <motion.button
                    onClick={clearSearch}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear search
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveCategory("all")}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Show all categories
                  </motion.button>
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