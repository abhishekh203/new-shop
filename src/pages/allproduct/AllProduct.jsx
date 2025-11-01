import React, { useContext, useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import { useNotification } from "../../context/NotificationContext";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import { createProductUrl } from "../../utils/slugUtils";
import { FaTags, FaFire, FaHome, FaShoppingCart, FaTrash, FaHeart, FaRegHeart } from "react-icons/fa";
import {
    FiSliders, FiChevronDown,
    FiRefreshCw, FiFilter, FiSearch
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

import Layout from "../../components/layout/Layout";
import { 
  SerifPageWrapper, 
  SerifProductCard, 
  SerifSearchBar,
  SerifButton,
  SerifDropdown,
  SerifLoadingSkeleton,
  SerifEmptyState,
  SerifFilterChip
} from "../../design-system/components";
import { serifTheme } from "../../design-system/themes";

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
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.02, delayChildren: 0 } // Minimal delay for faster rendering
    }
};

// Refined item variants with faster rendering
const itemVariants = {
    hidden: { opacity: 1, y: 0, scale: 1 },
    show: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.2, ease: "easeOut" } // Faster transition
    },
    exit: {
        opacity: 0, scale: 0.90, y: -15,
        transition: { duration: 0.2, ease: "easeIn" } // Faster exit
    }
};

const filterPanelVariants = {
    hidden: { opacity: 0, height: 0, y: -15 },
    show: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }, // Smoother ease
    exit: { opacity: 0, height: 0, y: -15, transition: { duration: 0.3, ease: [0.64, 0, 0.78, 0] } } // Smoother ease
};

// Loading skeleton is now handled by SerifLoadingSkeleton component

// --- Product Card Wrapper (uses SerifProductCard) ---
const ProductCard = ({ item, isInCart, onAddToCart, onDeleteFromCart, onNavigate, index }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const user = JSON.parse(localStorage.getItem('users') || 'null');
    const notification = useNotification();

    // Load wishlist status
    useEffect(() => {
        if (user?.uid && item?.id) {
            const savedFavorites = localStorage.getItem(`favorites_${user.uid}`);
            if (savedFavorites) {
                try {
                    const favorites = JSON.parse(savedFavorites);
                    setIsWishlisted(favorites.includes(item.id));
                } catch (e) {
                    console.error("Failed to parse favorites from localStorage");
                }
            }
        }
    }, [user?.uid, item?.id]);

    const handleToggleWishlist = useCallback((productId) => {
        if (!user?.uid) {
            notification.error("Please log in to save items to your wishlist");
            return;
        }

        const newWishlisted = !isWishlisted;
        setIsWishlisted(newWishlisted);

        try {
            const savedFavorites = localStorage.getItem(`favorites_${user.uid}`);
            const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
            
            const newFavorites = newWishlisted
                ? [...favorites, productId]
                : favorites.filter(favId => favId !== productId);
            
            localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(newFavorites));
            notification.success(newWishlisted ? "Added to wishlist" : "Removed from wishlist", {
                icon: newWishlisted ? <FaHeart /> : <FaRegHeart />,
                duration: 3000
            });
        } catch (e) {
            console.error("Failed to update favorites in localStorage");
            notification.error("Failed to update wishlist");
        }
    }, [user?.uid, isWishlisted, notification]);

    const handleNavigate = useCallback((productId, productTitle) => {
        onNavigate(createProductUrl({ id: productId, title: productTitle }));
    }, [onNavigate]);

    return (
        <SerifProductCard
            product={item}
            isInCart={isInCart}
            isInWishlist={isWishlisted}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onDeleteFromCart}
            onToggleWishlist={handleToggleWishlist}
            onNavigate={handleNavigate}
            index={index}
        />
    );
};


// --- Main Component ---
const AllProduct = () => {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { loading: pageLoading, getAllProduct } = context; // Use context loading state
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const notification = useNotification();

    // Local State
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [activeFilter, setActiveFilter] = useState("all");
    const [priceRange, setPriceRange] = useState([0, 10000]); // Assuming 10000 is a reasonable max
    const [showFilters, setShowFilters] = useState(false);
    // Removed isSortOpen and sortRef - handled by SerifDropdown
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Set client state after mount
        // Optional: If getAllProduct is fetched here, do it inside useEffect
        // context.fetchProducts(); // Example if you have a fetch function in context
    }, []);

    // Sort menu closing is now handled by SerifDropdown component

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
        notification.success("Added to cart", {
            icon: <FaShoppingCart />,
            duration: 3000
        });
    }, [dispatch, notification]);

    const deleteCart = useCallback((item) => {
        dispatch(deleteFromCart(item));
        notification.success("Removed from cart", {
            icon: <FaTrash />,
            duration: 3000
        });
    }, [dispatch, notification]);

    // Navigation handler
    const handleNavigate = useCallback((url) => {
        navigate(url);
    }, [navigate]);

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
            <SerifPageWrapper>
                    {/* Enhanced Header Section */}
                    <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1 }}
                        className="mb-16 text-center relative"
                    >
                        {/* Background Decoration */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-5">
                            <BsStars className="text-blue-400 text-[200px]" />
                        </div>

                        {/** Title removed per request **/}

                        {/** Subtitle and feature texts removed per request **/}
                    </motion.div>

                    {/* Enhanced Search and Filter Bar */}
                    <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1 }}
                        className="sticky top-4 z-50 mb-12 overflow-visible"
                    >
                        <div className={`
                            ${serifTheme.gradients.overlay}
                            backdrop-blur-xl 
                            ${serifTheme.radius.card}
                            p-6 
                            border ${serifTheme.colors.border.primary}
                            ${serifTheme.colors.shadow.card}
                        `}>
                            <div className="flex flex-col lg:flex-row gap-6 items-center">
                                {/* Search Bar using SerifSearchBar component */}
                                <div className="w-full lg:flex-1 lg:max-w-lg">
                                    <SerifSearchBar
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onClear={() => setSearchTerm("")}
                                        placeholder="Search products, categories, or keywords..."
                                    />
                                </div>

                                {/* Filter and Sort Controls */}
                                <div className="flex items-center gap-4 w-full lg:w-auto">
                                    {/* Enhanced Filter Toggle using SerifButton */}
                                    <div className="relative">
                                        <SerifButton
                                            variant={showFilters ? "primary" : "secondary"}
                                            size="medium"
                                            icon={<FiSliders className="h-4 w-4" />}
                                        onClick={() => setShowFilters(!showFilters)}
                                        >
                                            Filters
                                        </SerifButton>
                                        <motion.span
                                            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                                            animate={{ rotate: showFilters ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                                <FiChevronDown className="h-4 w-4" />
                                            </motion.span>
                                    </div>

                                    {/* Enhanced Sort Dropdown using SerifDropdown */}
                                    <SerifDropdown
                                        options={[
                                                        { id: 'default', label: '🆕 Newest First' },
                                                        { id: 'price-low', label: '💰 Price: Low to High' },
                                                        { id: 'price-high', label: '💎 Price: High to Low' },
                                                        { id: 'name', label: '🔤 Name (A-Z)' }
                                        ]}
                                        value={sortOption}
                                        onChange={(value) => setSortOption(value)}
                                        placeholder="Sort by..."
                                        icon={<FiFilter className="h-4 w-4" />}
                                        position="top"
                                    />
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
                                className="mb-12 bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-xl p-8 rounded-2xl border border-amber-200/60 overflow-hidden shadow-2xl"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Enhanced Category Filter */}
                                    <div className="lg:col-span-2">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
                                                <FaTags className="text-white text-sm" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800">Categories</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {categories.map(category => (
                                                <SerifFilterChip
                                                    key={category}
                                                    label={category === 'all' ? '🌟 All Products' : `${getCategoryIcon(category)} ${category}`}
                                                    isActive={activeFilter === category}
                                                    onClick={() => setActiveFilter(category)}
                                                />
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
                                                    <h3 className="text-xl font-bold text-gray-800">Price Range</h3>
                                                    <p className="text-sm text-gray-600">Filter by budget</p>
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
                                                    className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer slider-thumb accent-gradient focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                                />

                                                <div className="flex justify-between items-center">
                                                    <div className="bg-white/90 px-3 py-2 rounded-lg border border-amber-300/60">
                                                        <span className="text-sm font-semibold text-amber-700">₹{priceRange[0].toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <div className="text-amber-600">—</div>
                                                    <div className="bg-white/90 px-3 py-2 rounded-lg border border-amber-300/60">
                                                        <span className="text-sm font-semibold text-amber-700">₹{priceRange[1].toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Enhanced Reset Button */}
                                <div className="mt-8 pt-6 border-t border-amber-200/60 flex justify-between items-center">
                                    <div className="text-sm text-gray-700">
                                        Showing {filteredAndSortedProducts.length} products
                                    </div>
                                    <SerifButton
                                        variant="danger"
                                        size="medium"
                                        icon={<FiRefreshCw size={16} />}
                                        onClick={handleResetFilters}
                                    >
                                        Reset All Filters
                                    </SerifButton>
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
                        <AnimatePresence mode="wait" initial={false}>
                            {pageLoading ? (
                                // Loading State: Render skeleton cards using SerifLoadingSkeleton
                                <SerifLoadingSkeleton count={8} variant="productCard" />
                            ) : filteredAndSortedProducts.length > 0 ? (
                                // Content State: Render product cards immediately
                                filteredAndSortedProducts.map((item, index) => {
                                        const isInCart = cartItems.some((p) => p.id === item.id);
                                        return (
                                            <ProductCard
                                            key={item.id}
                                                item={item}
                                                isInCart={isInCart}
                                                onAddToCart={addCart}
                                                onDeleteFromCart={deleteCart}
                                            onNavigate={handleNavigate}
                                            index={index}
                                        />
                                    );
                                })

                            ) : (
                                // Enhanced Empty State using SerifEmptyState
                                <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-5">
                                    <SerifEmptyState
                                        icon={FiSearch}
                                        title="No Products Found"
                                        description="We couldn't find any products matching your search criteria. Try adjusting your filters or search terms."
                                        actions={[
                                            {
                                                label: "Clear All Filters",
                                                variant: "primary",
                                                icon: <FiRefreshCw size={18} />,
                                                onClick: handleResetFilters,
                                            },
                                            {
                                                label: "Back to Home",
                                                variant: "secondary",
                                                icon: <FaHome size={16} />,
                                                onClick: () => navigate('/'),
                                            },
                                        ]}
                                    />
                                        </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
            </SerifPageWrapper>
        </Layout>
    );
};

export default AllProduct;