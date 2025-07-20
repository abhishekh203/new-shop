import React, { useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
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
  FaSortAmountUpAlt,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";
import { BsStars, BsLightningChargeFill, BsGrid3X3Gap } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================
const CATEGORIES = [
  { id: "all", name: "All Products", icon: <BsGrid3X3Gap />, color: "from-blue-600 to-cyan-500" },
  { id: "netflix", name: "Netflix", icon: <span className="text-red-500">N</span>, color: "from-red-600 to-pink-500" },
  { id: "streaming", name: "Streaming", icon: <span className="text-green-500">S</span>, color: "from-green-600 to-emerald-500" },
  { id: "ott", name: "Platforms", icon: <span className="text-blue-400">OTT</span>, color: "from-blue-600 to-indigo-500" },
  { id: "music", name: "Music", icon: <span className="text-purple-400">M</span>, color: "from-purple-600 to-violet-500" },
  { id: "software", name: "Software", icon: <span className="text-green-400">S</span>, color: "from-green-600 to-teal-500" },
  { id: "games", name: "Games", icon: <span className="text-yellow-400">G</span>, color: "from-yellow-600 to-orange-500" },
  { id: "education", name: "Education", icon: <span className="text-gray-400">E</span>, color: "from-gray-600 to-slate-500" },
  { id: "vpn", name: "VPN", icon: <span className="text-pink-400">V</span>, color: "from-pink-600 to-rose-500" },
  { id: "ai", name: "AI", icon: <span className="text-purple-400">A</span>, color: "from-purple-600 to-indigo-500" }
];

const SORT_OPTIONS = [
  { id: "default", name: "Recommended", icon: <BsGrid3X3Gap /> },
  { id: "price-low", name: "Price: Low to High", icon: <FaSortAmountDown /> },
  { id: "price-high", name: "Price: High to Low", icon: <FaSortAmountUpAlt /> },
  { id: "newest", name: "Newest First", icon: <BsLightningChargeFill /> }
];

const ANIMATION_VARIANTS = {
  container: {
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
  },
  card: {
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
  },
  imageHover: {
    rest: { scale: 1 },
    hover: { scale: 1.05 }
  },
  badge: {
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
  },
  category: {
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
  }
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================
const useResponsiveDesign = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return { isMobile, isTablet };
};

const useHapticFeedback = () => {
  const triggerHapticFeedback = useCallback(() => {
    // Check if device supports vibration and is mobile
    if ('vibrate' in navigator && window.innerWidth < 768) {
      // Short vibration for button clicks
      navigator.vibrate(50);
    }
  }, []);

  return { triggerHapticFeedback };
};

const useWishlist = (userId) => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      try {
        const saved = localStorage.getItem(`favorites_${userId}`);
        if (saved) {
          setWishlist(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      try {
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(wishlist));
      } catch (error) {
        console.error("Failed to save wishlist:", error);
      }
    }
  }, [wishlist, userId]);

  const toggleWishlist = useCallback(async (productId) => {
    if (!userId) {
      toast.error("Please log in to save items to your wishlist");
      return;
    }

    setIsLoading(true);
    try {
      setWishlist(prev => {
        const newWishlist = prev.includes(productId) 
          ? prev.filter(id => id !== productId) 
          : [...prev, productId];
        
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
    } catch (error) {
      toast.error("Failed to update wishlist");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return { wishlist, toggleWishlist, isLoading };
};

const useProductFilters = (products) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [isSearching, setIsSearching] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products?.length) return {};

    // Filter by search term
    let filtered = products;
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = products.filter(product =>
        product.title?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === activeCategory
      );
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "newest":
          const aTime = a.time?.seconds ? a.time.seconds * 1000 : new Date(a.date || 0).getTime();
          const bTime = b.time?.seconds ? b.time.seconds * 1000 : new Date(b.date || 0).getTime();
          return bTime - aTime;
        default:
          return 0;
      }
    });

    // Categorize
    return sorted.reduce((acc, product) => {
      const category = product.category?.toLowerCase() || "other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  }, [products, searchTerm, activeCategory, sortOrder]);

  return {
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    sortOrder,
    setSortOrder,
    isSearching,
    setIsSearching,
    filteredAndSortedProducts
  };
};

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================
const SearchInput = ({ value, onChange, onClear, placeholder = "Search products...", disabled = false }) => (
  <div className="relative flex-1 w-full">
    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full pl-12 pr-4 py-3 border border-gray-600/50 rounded-xl bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Search products"
    />
    {value && (
      <button
        onClick={onClear}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-700/50 transition-colors disabled:opacity-50"
        aria-label="Clear search"
      >
        <FaTimes className="text-gray-400 hover:text-gray-200 h-4 w-4" />
      </button>
    )}
  </div>
);

const CategoryFilter = ({ categories, activeCategory, onCategoryChange, isMobile }) => {
  if (isMobile) return null;

  return (
    <div className="flex flex-wrap gap-2 lg:gap-3">
      {categories.slice(0, 8).map((category, index) => (
        <motion.button
          key={`category-${category.id}-${index}`}
          onClick={() => onCategoryChange(category.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            activeCategory === category.id
              ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/70 border border-gray-600/50'
          }`}
          aria-label={`Filter by ${category.name}`}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
};

const SortDropdown = ({ sortOrder, onSortChange, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isMobile) return null;

  return (
    <div className="relative sort-container" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-xl text-gray-300 transition-all duration-300"
        aria-label="Sort options"
        aria-expanded={isOpen}
      >
        <FiFilter className="h-4 w-4" />
        <span className="text-sm font-medium">Sort</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className="h-3 w-3" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl z-20 overflow-hidden"
          >
            {SORT_OPTIONS.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => {
                  onSortChange(option.id);
                  setIsOpen(false);
                }}
                whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.7)" }}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-200 ${
                  sortOrder === option.id ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="text-sm">{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductCard = React.memo(({ 
  product, 
  isInCart, 
  isInWishlist, 
  onAddToCart, 
  onRemoveFromCart, 
  onToggleWishlist, 
  onNavigate,
  isMobile 
}) => {
  const controls = useAnimation();
  const { triggerHapticFeedback } = useHapticFeedback();
  const {
    id,
    title,
    price,
    productImageUrl,
    category: itemCategory,
    description,
    time,
    date
  } = product;

  // Calculate badges
  const isNew = useMemo(() => {
    const createdTime = time?.seconds ? time.seconds * 1000 : new Date(date).getTime();
    const now = Date.now();
    const daysDifference = (now - createdTime) / (1000 * 60 * 60 * 24);
    return daysDifference <= 7;
  }, [time, date]);

  const discount = useMemo(() => Math.floor(Math.random() * 30) + 10, []);

  const handleWishlistToggle = useCallback(async () => {
    await onToggleWishlist(id);
    if (!isInWishlist) {
      await controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5 }
      });
    }
  }, [id, isInWishlist, onToggleWishlist, controls]);

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.card}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      exit="exit"
      layout
      className="group relative"
    >
      <div className="h-full bg-gradient-to-br from-gray-900/90 to-gray-800/70 border border-gray-700/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:border-blue-400/40 hover:-translate-y-2 backdrop-blur-sm relative">
        {/* Enhanced Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {discount && (
            <motion.div
              variants={ANIMATION_VARIANTS.badge}
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
              variants={ANIMATION_VARIANTS.badge}
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
            variants={ANIMATION_VARIANTS.badge}
            initial="hidden"
            animate="visible"
            onClick={() => {
              triggerHapticFeedback();
              handleWishlistToggle();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-gray-900/80 backdrop-blur-md hover:bg-gray-800/80 transition-all duration-300 border border-gray-600/50 shadow-lg"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
          {isInWishlist ? (
            <motion.div
              animate={controls}
              className="relative"
            >
              <FaHeart className="text-red-500 text-lg" />
              <motion.div
                className="absolute inset-0 bg-red-500 rounded-full opacity-30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          ) : (
            <FaRegHeart className="text-gray-400 text-lg hover:text-red-400 transition-colors" />
          )}
        </motion.button>

        {/* Enhanced Product Image */}
        <motion.div
          className="relative w-full overflow-hidden group/image"
          style={{ height: isMobile ? "180px" : "280px" }}
          variants={ANIMATION_VARIANTS.imageHover}
          initial="rest"
          whileHover="hover"
        >
          <img
            onClick={() => onNavigate(`/productinfo/${id}`)}
            className="h-full w-full object-cover cursor-pointer transition-all duration-700 ease-out group-hover:scale-110"
            src={productImageUrl}
            alt={title}
            loading="lazy"
            onError={(e) => {
              e.target.src = '/img/placeholder.png'; // Fallback image
            }}
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:to-cyan-600/10 transition-all duration-500"></div>

          {/* Quick View Overlay */}
          <div
            onClick={() => onNavigate(`/productinfo/${id}`)}
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
            {/* Show "In Cart" badge only on desktop */}
            {isInCart && !isMobile && (
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
          <motion.h3
            onClick={() => onNavigate(`/productinfo/${id}`)}
            className={`${isMobile ? "text-base" : "text-xl"} font-bold text-white mb-3 cursor-pointer hover:text-transparent hover:bg-gradient-to-r hover:bg-clip-text hover:from-blue-400 hover:to-cyan-400 transition-all duration-300 line-clamp-2 leading-tight`}
            title={title}
            whileHover={{ x: 3 }}
          >
            {title}
          </motion.h3>

          {/* Price and Action Section */}
          <div className="flex justify-between items-end mt-4">
            <div className="flex-1">
              <motion.p
                className={`${isMobile ? "text-lg" : "text-2xl"} font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1`}
                whileHover={{ scale: 1.05 }}
              >
                रु {price?.toLocaleString() || 0}
              </motion.p>
              <p className="text-xs text-gray-400 mt-1">Digital Product</p>
            </div>

            {/* Enhanced Action Button */}
            <motion.button
              onClick={() => {
                triggerHapticFeedback();
                isInCart ? onRemoveFromCart(product) : onAddToCart(product);
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`${isMobile ? "py-2 px-3 text-sm" : "py-3 px-4 text-sm"} rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg relative overflow-hidden ${
                isInCart
                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-red-500/25"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-blue-500/25"
              }`}
              aria-label={isInCart ? "Remove from cart" : "Add to cart"}
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
});

ProductCard.displayName = 'ProductCard';

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

const EmptyState = ({ isSearching, searchTerm, onClearSearch }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6 }}
    className="text-center py-24"
  >
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl p-12 border border-gray-700/30 shadow-2xl max-w-2xl mx-auto">
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

      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        {isSearching ? "No products found" : "No products available"}
      </h3>
      <p className="text-gray-400 text-lg mb-8">
        {isSearching 
          ? `Try adjusting your search for "${searchTerm}" or browse our categories`
          : "Check back soon for new arrivals and exciting deals"
        }
      </p>
      {isSearching && (
        <motion.button
          onClick={onClearSearch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
        >
          Clear Search
        </motion.button>
      )}
    </div>
  </motion.div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const HomePageProductCard = () => {
  const navigate = useNavigate();
  const context = useContext(myContext);
  const { getAllProduct, loading: contextLoading } = context;

  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const { isMobile, isTablet } = useResponsiveDesign();
  const { triggerHapticFeedback } = useHapticFeedback();
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('users'));
    } catch {
      return null;
    }
  }, []);
  
  const { wishlist, toggleWishlist, isLoading: wishlistLoading } = useWishlist(user?.uid);
  const {
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    sortOrder,
    setSortOrder,
    isSearching,
    setIsSearching,
    filteredAndSortedProducts
  } = useProductFilters(getAllProduct);

  const [expandedCategories, setExpandedCategories] = useState({});

  // Initialize expanded categories
  useEffect(() => {
    if (Object.keys(filteredAndSortedProducts).length > 0) {
      const initialExpanded = {};
      Object.keys(filteredAndSortedProducts).forEach(cat => {
        initialExpanded[cat] = true;
      });
      setExpandedCategories(initialExpanded);
    }
  }, [filteredAndSortedProducts]);

  // Handle responsive layout changes
  useEffect(() => {
    if (isMobile) {
      setActiveCategory("all");
      setSortOrder("default");
    }
  }, [isMobile, setActiveCategory, setSortOrder]);

  // Cart actions
  const addCart = useCallback((item) => {
    triggerHapticFeedback();
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
  }, [dispatch, triggerHapticFeedback]);

  const deleteCart = useCallback((item) => {
    triggerHapticFeedback();
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
  }, [dispatch, triggerHapticFeedback]);

  const handleSortChange = useCallback((sortType) => {
    setSortOrder(sortType);
    const sortOption = SORT_OPTIONS.find(o => o.id === sortType);
    toast.success(`Sorted by ${sortOption?.name || 'default'}`, {
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
  }, [setSortOrder]);

  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setIsSearching(false);
    setActiveCategory("all");
  }, [setSearchTerm, setIsSearching, setActiveCategory]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(value.length > 0);
  }, [setSearchTerm, setIsSearching]);

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  // Determine which products to show
  const productsToShow = searchTerm ? filteredAndSortedProducts : filteredAndSortedProducts;
  const visibleCategories = Object.keys(productsToShow).filter(cat => 
    activeCategory === "all" || cat === activeCategory
  );

  return (
    <section className="py-8 lg:py-16 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #06b6d4 0%, transparent 50%)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Featured{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Products
            </span>
          </motion.h2>
          <motion.p
            className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover our premium collection of digital products and subscriptions
          </motion.p>
        </motion.div>

        {/* Enhanced Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8 lg:mb-12"
        >
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <SearchInput
                value={searchTerm}
                onChange={handleSearchChange}
                onClear={handleClearSearch}
                disabled={contextLoading || wishlistLoading}
              />

              <CategoryFilter
                categories={CATEGORIES}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                isMobile={isMobile}
              />

              <SortDropdown
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                isMobile={isMobile}
              />
            </div>
          </div>
        </motion.div>

        {/* Products Display */}
        <motion.div
          variants={ANIMATION_VARIANTS.container}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          <AnimatePresence mode="wait">
            {contextLoading ? (
              // Loading State
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/50 border border-gray-700/30 rounded-2xl overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-800/50"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-800/50 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-800/50 rounded w-1/2"></div>
                      <div className="h-10 bg-gray-800/50 rounded"></div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : visibleCategories.length === 0 ? (
              // Empty State
              <EmptyState
                isSearching={isSearching}
                searchTerm={searchTerm}
                onClearSearch={handleClearSearch}
              />
            ) : (
              // Products Grid
              visibleCategories.map((category) => {
                const categoryProducts = productsToShow[category] || [];
                const isExpanded = expandedCategories[category] !== false;
                const maxProducts = isMobile ? 4 : 8;
                const visibleProducts = isExpanded 
                  ? categoryProducts 
                  : categoryProducts.slice(0, maxProducts);
                const hasMoreProducts = categoryProducts.length > maxProducts;

                return (
                  <motion.div 
                    key={`category-section-${category}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Category Header */}
                    <div className="flex items-center justify-between">
                      <motion.h3
                        className="text-2xl md:text-3xl font-bold text-white"
                        whileHover={{ x: 5 }}
                      >
                        {category}
                        <span className="ml-3 text-sm font-normal text-gray-400">
                          ({categoryProducts.length} items)
                        </span>
                      </motion.h3>
                      
                      {hasMoreProducts && (
                        <motion.button
                          onClick={() => toggleCategory(category)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 rounded-xl text-gray-300 hover:text-white transition-all duration-300 border border-gray-600/50"
                          aria-label={isExpanded ? 'Show less products' : `Show all ${categoryProducts.length} products`}
                        >
                          <span className="text-sm font-medium">
                            {isExpanded ? 'Show Less' : `Show All (${categoryProducts.length})`}
                          </span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FaChevronDown className="h-3 w-3" />
                          </motion.div>
                        </motion.button>
                      )}
                    </div>

                    {/* Products Grid */}
                    <motion.div
                      layout
                      className={`grid gap-6 ${
                        isMobile 
                          ? "grid-cols-2" 
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      }`}
                    >
                      <AnimatePresence mode="sync">
                        {visibleProducts.map((item) => {
                          const isInCart = cartItems.some((p) => p.id === item.id);
                          const isInWishlist = wishlist.includes(item.id);

                          return (
                            <ProductCard
                              key={`product-${item.id}-${category}`}
                              product={item}
                              isInCart={isInCart}
                              isInWishlist={isInWishlist}
                              onAddToCart={addCart}
                              onRemoveFromCart={deleteCart}
                              onToggleWishlist={toggleWishlist}
                              onNavigate={handleNavigate}
                              isMobile={isMobile}
                            />
                          );
                        })}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default HomePageProductCard;