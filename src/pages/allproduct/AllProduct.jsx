import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import { FaStar, FaHeart, FaRegHeart, FaEye, FaShoppingBag, FaTags, FaFire, FaHome } from "react-icons/fa";
import {
    FiXCircle, FiSliders, FiChevronDown, FiSearch,
    FiRefreshCw, FiShoppingCart
} from "react-icons/fi";
import { BsStars, BsLightningChargeFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

import Layout from "../../components/layout/Layout";

// --- Helper Functions ---
const getCategoryIcon = (category) => {
    const icons = {
        'netflix': '🎬',
        'spotify': '🎵',
        'software': '💻',
        'games': '🎮',
        'education': '📚',
        'productivity': '⚡',
        'design': '🎨',
        'security': '🔒',
        'default': '📦'
    };
    return icons[category.toLowerCase()] || icons.default;
};

// --- Animation Variants ---
const pageVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.15 } // Slightly adjusted stagger/delay
    }
};

// Refined item variants with smoother cubic bezier easing
const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.95 },
    show: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } // Smooth cubic bezier
    },
    exit: {
        opacity: 0, scale: 0.90, y: -15, // Slightly different exit
        transition: { duration: 0.3, ease: [0.64, 0, 0.78, 0] } // Another cubic bezier
    }
};

const filterPanelVariants = {
    hidden: { opacity: 0, height: 0, y: -15 },
    show: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }, // Smoother ease
    exit: { opacity: 0, height: 0, y: -15, transition: { duration: 0.3, ease: [0.64, 0, 0.78, 0] } } // Smoother ease
};

// --- Enhanced Loading Skeleton Card ---
const LoadingCard = ({ index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
        className="relative group bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-gray-700/30 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm h-[420px]"
    >
        {/* Enhanced Shimmer Effect */}
        <div className="absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
        </div>

        {/* Image Placeholder with Gradient */}
        <div className="h-60 w-full bg-gradient-to-br from-gray-700/20 to-gray-600/30 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-800/50 to-transparent"></div>
            {/* Floating Elements */}
            <div className="absolute top-4 left-4 w-16 h-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full"></div>
        </div>

        {/* Content Placeholder */}
        <div className="p-5 space-y-4">
            {/* Category & Rating Row */}
            <div className="flex justify-between items-center">
                <div className="h-3 w-20 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-full"></div>
                <div className="h-5 w-12 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-full"></div>
            </div>

            {/* Title Lines */}
            <div className="space-y-2">
                <div className="h-5 w-4/5 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-lg"></div>
                <div className="h-5 w-3/5 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-lg"></div>
            </div>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* Price & Button Row */}
            <div className="flex justify-between items-center pt-4">
                <div className="h-7 w-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg"></div>
                <div className="h-10 w-28 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl"></div>
            </div>
        </div>
    </motion.div>
);

// --- Enhanced Product Card Component ---
const ProductCard = ({ item, isInCart, onAddToCart, onDeleteFromCart, onNavigate }) => {
    const { id, title, price, productImageUrl, rating = 4.5, category } = item;
    const [isWishlisted, setIsWishlisted] = useState(false);

    const formatPrice = useCallback((priceValue) => {
        return `₹${Number(priceValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }, []);

    const handleCartClick = (e) => {
        e.stopPropagation();
        if (isInCart) {
            onDeleteFromCart(item);
        } else {
            onAddToCart(item);
        }
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    const handleQuickView = (e) => {
        e.stopPropagation();
        onNavigate(`/productinfo/${id}`);
    };

    return (
        <motion.div
            layout
            variants={itemVariants}
            exit="exit"
            whileHover="hover"
            className="relative group bg-gradient-to-br from-gray-900/90 to-gray-800/70 border border-gray-700/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:border-blue-400/40 hover:-translate-y-2 flex flex-col h-[420px] cursor-pointer backdrop-blur-sm"
            onClick={() => onNavigate(`/productinfo/${id}`)}
        >
            {/* Floating Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <motion.button
                    onClick={handleWishlistClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
                        isWishlisted
                            ? 'bg-red-500/20 border-red-400/50 text-red-400'
                            : 'bg-gray-800/60 border-gray-600/50 text-gray-300 hover:text-red-400'
                    }`}
                >
                    {isWishlisted ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                </motion.button>
                <motion.button
                    onClick={handleQuickView}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-gray-800/60 backdrop-blur-md border border-gray-600/50 text-gray-300 hover:text-blue-400 transition-all duration-200"
                >
                    <FaEye size={14} />
                </motion.button>
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 left-3 z-10">
                <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg backdrop-blur-sm"
                >
                    <BsStars size={10} />
                    {category || 'Digital'}
                </motion.span>
            </div>

            {/* Enhanced Image Section */}
            <div className="relative h-60 w-full overflow-hidden group/image">
                <motion.img
                    className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                    src={productImageUrl || 'https://placehold.co/300x240/1a202c/718096?text=N/A'}
                    alt={title || 'Product Image'}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x240/1a202c/718096?text=Error'; }}
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:to-cyan-600/10 transition-all duration-500"></div>

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        className="bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20"
                    >
                        <FaEye className="text-white text-lg" />
                    </motion.div>
                </div>
            </div>

            {/* Enhanced Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Title and Rating Row */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-100 group-hover:text-white transition-colors line-clamp-2 flex-grow mr-3 leading-tight" title={title}>
                        {title || 'Untitled Product'}
                    </h3>

                    {/* Enhanced Rating Badge */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex-shrink-0 flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-yellow-500/30"
                    >
                        <FaStar className="text-yellow-400 mr-1.5" size={12} />
                        <span className="text-yellow-200 font-semibold text-xs">{Number(rating).toFixed(1)}</span>
                    </motion.div>
                </div>

                {/* Spacer */}
                <div className="flex-grow"></div>

                {/* Price Section */}
                <div className="mb-4">
                    <motion.p
                        className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                    >
                        {formatPrice(price)}
                    </motion.p>
                    <p className="text-xs text-gray-400 mt-1">Digital Product</p>
                </div>

                {/* Enhanced Action Button */}
                <motion.button
                    className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 relative overflow-hidden ${
                        isInCart
                            ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/40 hover:from-red-500/30 hover:to-pink-500/30 focus:ring-red-500"
                            : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 focus:ring-cyan-500"
                    }`}
                    onClick={handleCartClick}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Button Background Effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                    />

                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={isInCart ? "remove" : "add"}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center gap-2.5 relative z-10"
                        >
                            {isInCart ? (
                                <>
                                    <FiXCircle size={16} />
                                    <span>Remove from Cart</span>
                                </>
                            ) : (
                                <>
                                    <FiShoppingCart size={16} />
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </motion.span>
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.div>
    );
};


// --- Main Component ---
const AllProduct = () => {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { loading: pageLoading, getAllProduct } = context; // Use context loading state
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    // Local State
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [activeFilter, setActiveFilter] = useState("all");
    const [priceRange, setPriceRange] = useState([0, 10000]); // Assuming 10000 is a reasonable max
    const [showFilters, setShowFilters] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Set client state after mount
        // Optional: If getAllProduct is fetched here, do it inside useEffect
        // context.fetchProducts(); // Example if you have a fetch function in context
    }, []);

    // Memoized Filtering and Sorting (Keep existing logic, ensure robustness)
    const filteredAndSortedProducts = useMemo(() => {
        let results = getAllProduct ? [...getAllProduct] : []; // Ensure getAllProduct is array

        // 1. Filter by Category
        if (activeFilter !== "all") {
            results = results.filter(product => product?.category === activeFilter);
        }

        // 2. Filter by Price Range
        results = results.filter(product => {
            const price = Number(product?.price || 0);
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // 3. Filter by Search Term
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            if (lowerSearchTerm) {
                 results = results.filter(product =>
                    product?.title?.toLowerCase().includes(lowerSearchTerm) ||
                    product?.category?.toLowerCase().includes(lowerSearchTerm) ||
                    product?.description?.toLowerCase().includes(lowerSearchTerm)
                );
            }
        }

        // 4. Sorting Logic (Ensure robust handling of missing/invalid data)
        switch (sortOption) {
            case "price-low": results.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0)); break;
            case "price-high": results.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0)); break;
            case "name": results.sort((a, b) => (a?.title || '').localeCompare(b?.title || '')); break;
            case "rating": results.sort((a, b) => (Number(b?.rating || 0)) - (Number(a?.rating || 0))); break;
            default: // 'default' or newest
                results.sort((a, b) => {
                    const dateA = a?.time?.seconds ? a.time.seconds * 1000 : new Date(a?.date || 0).getTime();
                    const dateB = b?.time?.seconds ? b.time.seconds * 1000 : new Date(b?.date || 0).getTime();
                    // Ensure valid numbers before subtracting
                    return (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA);
                });
                break;
        }

        return results;
    }, [getAllProduct, searchTerm, sortOption, activeFilter, priceRange]);

    // Cart Handlers (Using useCallback for potential performance optimization if passed to deeply nested components)
    const addCart = useCallback((item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart", { style: { background: '#333', color: '#fff' } });
    }, [dispatch]);

    const deleteCart = useCallback((item) => {
        dispatch(deleteFromCart(item));
        toast.error("Removed from cart", { style: { background: '#333', color: '#fff' } });
    }, [dispatch]);

    // Get unique categories for filters
    const categories = useMemo(() => {
        const uniqueCategories = new Set(
            (getAllProduct || []) // Handle case where getAllProduct might be initially undefined
                .map(product => product?.category)
                .filter(Boolean) // Remove null/undefined categories
        );
        return ["all", ...Array.from(uniqueCategories)];
    }, [getAllProduct]);

    const handleResetFilters = () => {
         setSearchTerm("");
         setActiveFilter("all");
         setPriceRange([0, 10000]);
         setSortOption("default");
         setShowFilters(false); // Optionally close filters on reset
    }

    // Determine max price for slider dynamically (optional but good)
    const maxPrice = useMemo(() => {
        if (!getAllProduct || getAllProduct.length === 0) return 10000; // Default max
        const max = Math.max(...getAllProduct.map(p => Number(p?.price || 0)));
        return Math.ceil(max / 100) * 100; // Round up to nearest 100 for cleaner steps
    }, [getAllProduct]);

    // Update price range max if dynamic maxPrice changes
    useEffect(() => {
        setPriceRange(prevRange => [prevRange[0], Math.max(prevRange[1], maxPrice)]); // Ensure current range max isn't lower than new maxPrice
    }, [maxPrice]);


    return (
        <Layout>
            <motion.div
                variants={pageVariants} initial="hidden" animate="show" exit="exit"
                className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-950 min-h-screen text-gray-200 relative overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                                         radial-gradient(circle at 75% 75%, #06b6d4 0%, transparent 50%)`,
                        backgroundSize: '100px 100px'
                    }}></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Enhanced Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="mb-16 text-center relative"
                    >
                        {/* Background Decoration */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-5">
                            <BsStars className="text-blue-400 text-[200px]" />
                        </div>

                        {/* Main Title */}
                        <motion.h1
                            className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 relative z-10"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                                Digital
                            </span>
                            <br />
                            <span className="text-white">Collection</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed relative z-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            Discover premium digital products, software, and subscriptions
                            <span className="text-cyan-400 font-semibold"> tailored for your needs</span>
                        </motion.p>

                        {/* Stats or Features */}
                        <motion.div
                            className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            <div className="flex items-center gap-2">
                                <BsLightningChargeFill className="text-yellow-400" />
                                <span>Instant Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaStar className="text-yellow-400" />
                                <span>Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaShoppingBag className="text-green-400" />
                                <span>Secure Purchase</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Enhanced Search and Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="sticky top-4 z-30 mb-12"
                    >
                        <div className="bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-2xl">
                            <div className="flex flex-col lg:flex-row gap-6 items-center">
                                {/* Enhanced Search Input */}
                                <div className="relative w-full lg:flex-1 lg:max-w-lg">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <FiSearch className="h-5 w-5 text-gray-400" />
                                        <div className="h-4 w-px bg-gray-600"></div>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search products, categories, or keywords..."
                                        className="w-full pl-12 pr-12 py-4 border border-gray-600/50 rounded-xl bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm backdrop-blur-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <AnimatePresence>
                                        {searchTerm && (
                                            <motion.button
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-700/50 transition-colors"
                                                onClick={() => setSearchTerm("")}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                aria-label="Clear search"
                                            >
                                                <FiXCircle className="text-gray-400 hover:text-gray-200 h-4 w-4" />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Filter and Sort Controls */}
                                <div className="flex items-center gap-4 w-full lg:w-auto">
                                    {/* Enhanced Filter Toggle */}
                                    <motion.button
                                        className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                            showFilters
                                                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                                                : 'bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 text-gray-300 hover:text-white'
                                        }`}
                                        onClick={() => setShowFilters(!showFilters)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        aria-expanded={showFilters}
                                    >
                                        <FiSliders className="h-4 w-4" />
                                        <span>Filters</span>
                                        <motion.div
                                            animate={{ rotate: showFilters ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <FiChevronDown className="h-4 w-4" />
                                        </motion.div>
                                    </motion.button>

                                    {/* Enhanced Sort Dropdown */}
                                    <div className="relative">
                                        <select
                                            id="sort-select"
                                            className="appearance-none w-full lg:w-48 pl-4 pr-10 py-3 border border-gray-600/50 rounded-xl bg-gray-700/50 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                        >
                                            <option value="default" className="bg-gray-800">🆕 Newest First</option>
                                            <option value="price-low" className="bg-gray-800">💰 Price: Low to High</option>
                                            <option value="price-high" className="bg-gray-800">💎 Price: High to Low</option>
                                            <option value="name" className="bg-gray-800">🔤 Name (A-Z)</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Enhanced Collapsible Filter Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                variants={filterPanelVariants}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                className="mb-12 bg-gradient-to-br from-gray-900/90 to-gray-800/70 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/30 overflow-hidden shadow-2xl"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Enhanced Category Filter */}
                                    <div className="lg:col-span-2">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
                                                <FaTags className="text-white text-sm" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Categories</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {categories.map(category => (
                                                <motion.button
                                                    key={category}
                                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                                                        activeFilter === category
                                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-blue-500/0 shadow-lg shadow-blue-500/25'
                                                            : 'bg-gray-800/50 text-gray-300 border-gray-600/50 hover:bg-gray-700/70 hover:border-gray-500/70 hover:text-white hover:shadow-md'
                                                    }`}
                                                    onClick={() => setActiveFilter(category)}
                                                    whileHover={{ y: -2, scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <span className="capitalize">
                                                        {category === 'all' ? '🌟 All Products' : `${getCategoryIcon(category)} ${category}`}
                                                    </span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Enhanced Price Range Filter */}
                                    {isClient && (
                                        <div>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg">
                                                    <FaFire className="text-white text-sm" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-white">Price Range</h3>
                                                    <p className="text-sm text-gray-400">Filter by budget</p>
                                                </div>
                                                {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
                                                    <motion.button
                                                        onClick={() => setPriceRange([0, maxPrice])}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors px-2 py-1 rounded-md hover:bg-cyan-400/10"
                                                    >
                                                        Reset
                                                    </motion.button>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={maxPrice}
                                                    step="100"
                                                    value={priceRange[1]}
                                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                                    className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb accent-gradient focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                />

                                                <div className="flex justify-between items-center">
                                                    <div className="bg-gray-800/60 px-3 py-2 rounded-lg border border-gray-600/50">
                                                        <span className="text-sm font-semibold text-green-400">₹{priceRange[0].toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <div className="text-gray-500">—</div>
                                                    <div className="bg-gray-800/60 px-3 py-2 rounded-lg border border-gray-600/50">
                                                        <span className="text-sm font-semibold text-green-400">₹{priceRange[1].toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Enhanced Reset Button */}
                                <div className="mt-8 pt-6 border-t border-gray-700/30 flex justify-between items-center">
                                    <div className="text-sm text-gray-400">
                                        Showing {filteredAndSortedProducts.length} products
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleResetFilters}
                                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    >
                                        <FiRefreshCw size={16}/>
                                        <span>Reset All Filters</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Enhanced Products Grid */}
                    <motion.div
                        layout
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
                    >
                         {/* Use AnimatePresence to handle the transition between loading, content, and empty states */}
                        <AnimatePresence mode="wait">
                            {pageLoading ? (
                                // Loading State: Render skeleton cards within a motion component for smoother exit
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="contents" // Use 'contents' to avoid adding extra div affecting grid layout
                                >
                                    {Array.from({ length: 8 }).map((_, index) => <LoadingCard key={`loading-${index}`} index={index} />)}
                                </motion.div>
                            ) : filteredAndSortedProducts.length > 0 ? (
                                // Content State: Render product cards
                                // AnimatePresence around the mapping allows exit animations for individual cards when filtered out
                                <AnimatePresence>
                                     {filteredAndSortedProducts.map((item) => {
                                        const isInCart = cartItems.some((p) => p.id === item.id);
                                        return (
                                            <ProductCard
                                                key={item.id} // Ensure key is stable
                                                item={item}
                                                isInCart={isInCart}
                                                onAddToCart={addCart}
                                                onDeleteFromCart={deleteCart}
                                                onNavigate={navigate}
                                            />
                                        );
                                    })}
                                </AnimatePresence>

                            ) : (
                                // Enhanced Empty State
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="sm:col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-5 text-center py-24 px-8 bg-gradient-to-br from-gray-900/60 to-gray-800/40 rounded-2xl border border-dashed border-gray-600/50 flex flex-col items-center justify-center min-h-[400px] backdrop-blur-sm"
                                >
                                    {/* Animated Icon */}
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                                        className="relative mb-8"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-xl"></div>
                                        <div className="relative bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-full border border-gray-600/50">
                                            <FiSearch size={64} className="text-gray-400" strokeWidth={1}/>
                                        </div>
                                    </motion.div>

                                    {/* Content */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.6 }}
                                        className="space-y-4 mb-8"
                                    >
                                        <h3 className="text-2xl font-bold text-white">No Products Found</h3>
                                        <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
                                            We couldn't find any products matching your search criteria.
                                            Try adjusting your filters or search terms.
                                        </p>
                                    </motion.div>

                                    {/* Action Buttons */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.6 }}
                                        className="flex flex-col sm:flex-row gap-4"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleResetFilters}
                                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-sm font-bold rounded-xl transition-all shadow-xl flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                                        >
                                            <FiRefreshCw size={18}/>
                                            <span>Clear All Filters</span>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/')}
                                            className="px-8 py-4 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white text-sm font-bold rounded-xl transition-all border border-gray-600/50 hover:border-gray-500/70 flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                                        >
                                            <FaHome size={16}/>
                                            <span>Back to Home</span>
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.div>
        </Layout>
    );
};

export default AllProduct;