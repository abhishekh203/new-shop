import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import myContext from "../../context/myContext"; // Assuming context path is correct
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast"; // Using react-hot-toast
import { addToCart, deleteFromCart } from "../../redux/cartSlice"; // Assuming cartSlice path is correct
import { FaStar } from "react-icons/fa"; // Using FaStar for rating
import { FiLoader, FiXCircle, FiSliders, FiChevronDown, FiSearch, FiFilter, FiRefreshCw, FiShoppingCart, FiCheck } from "react-icons/fi"; // Consolidated icons
import { motion, AnimatePresence } from "framer-motion";

// Assuming Layout component path is correct
import Layout from "../../components/layout/Layout";
// Removed Loader import if LoadingCard is sufficient

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

// --- Loading Skeleton Card ---
const LoadingCard = ({ index }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.5, ease: "easeOut" }} // Staggered fade-in
        className="relative group bg-gray-800/40 backdrop-blur-sm border border-gray-700/40 rounded-xl overflow-hidden shadow-md h-[420px]" // Fixed height, slightly less intense bg
    >
        {/* Improved Shimmer Effect */}
        <div className="absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gray-700/20 to-transparent" // Softer shimmer
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }} // Slightly slower
            />
        </div>
        {/* Image Placeholder */}
        <div className="h-60 w-full bg-gray-700/30"></div> {/* Adjusted height */}
        {/* Content Placeholder */}
        <div className="p-4 space-y-3">
            <div className="h-4 w-1/3 bg-gray-700/30 rounded"></div> {/* Category placeholder */}
            <div className="h-5 w-4/5 bg-gray-700/30 rounded"></div> {/* Title placeholder */}
             <div className="h-5 w-3/5 bg-gray-700/30 rounded mt-1"></div> {/* Second line title placeholder */}
            <div className="flex justify-between items-center pt-6"> {/* Adjusted spacing */}
                <div className="h-6 w-1/4 bg-gray-700/30 rounded"></div> {/* Price placeholder */}
                <div className="h-9 w-1/3 bg-gray-700/30 rounded-lg"></div> {/* Button placeholder */}
            </div>
        </div>
    </motion.div>
);

// --- Product Card Component ---
const ProductCard = ({ item, isInCart, onAddToCart, onDeleteFromCart, onNavigate }) => {
    const { id, title, price, productImageUrl, rating = 4.5, category } = item; // Default rating

    const formatPrice = useCallback((priceValue) => {
        return `₹${Number(priceValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }, []);

    const handleCartClick = (e) => {
        e.stopPropagation(); // Prevent card click when clicking button
        if (isInCart) {
            onDeleteFromCart(item);
        } else {
            onAddToCart(item);
        }
    };

    return (
        <motion.div
            layout // Animate layout changes (reordering)
            variants={itemVariants}
            exit="exit" // Use exit variant defined above
            whileHover="hover" // Define hover state (can be used with variants or direct style)
            className="relative group bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-400/20 transition-all duration-300 hover:border-blue-500/60 hover:-translate-y-1.5 flex flex-col h-[420px] cursor-pointer" // Enhanced hover, fixed height
            onClick={() => onNavigate(`/productinfo/${id}`)}
        >
            {/* Category Badge - Enhanced Style */}
            <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 uppercase tracking-wider shadow-sm">
                {category || 'General'}
            </span>

            {/* Image */}
            <div className="relative h-60 w-full overflow-hidden"> {/* Fixed image height */}
                <motion.img
                    className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    src={productImageUrl || 'https://placehold.co/300x240/1a202c/718096?text=N/A'} // Darker placeholder
                    alt={title || 'Product Image'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x240/1a202c/718096?text=Error'; }} // Darker error placeholder
                />
                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow"> {/* Use flex-grow to push button down */}
                {/* Title and Rating */}
                <div className="flex justify-between items-start mb-1.5">
                    <h3 className="text-base font-semibold text-gray-100 group-hover:text-blue-300 transition-colors line-clamp-2 flex-grow mr-2" title={title}>
                        {title || 'Untitled Product'}
                    </h3>
                    {/* Rating - Slightly improved style */}
                    <div className="flex-shrink-0 flex items-center bg-gray-700/60 px-2 py-0.5 rounded text-xs mt-0.5">
                        <FaStar className="text-yellow-400 mr-1" size={12} />
                        <span className="text-gray-200 font-medium">{Number(rating).toFixed(1)}</span>
                    </div>
                </div>

                 {/* Spacer to push price and button down */}
                 <div className="flex-grow"></div>

                {/* Price */}
                <p className="text-xl font-bold text-blue-400 mb-3">{formatPrice(price)}</p>

                {/* Add to Cart Button - Enhanced Animation */}
                <motion.button
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-250 ease-out flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                        isInCart
                            ? "bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600/30 focus:ring-red-500"
                            : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg focus:ring-cyan-500"
                    }`}
                    onClick={handleCartClick}
                    whileHover={{ scale: 1.03, y: -1 }} // Subtle lift on hover
                    whileTap={{ scale: 0.97 }}
                    // Animate presence for icon change
                    initial={false} // Prevent initial animation on load
                    animate={{ backgroundColor: isInCart ? 'rgba(220, 38, 38, 0.2)' : 'linear-gradient(to right, #2563EB, #0891B2)' }} // Approximate gradient as target - Framer Motion might struggle with direct gradient animation
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={isInCart ? "remove" : "add"}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center justify-center gap-2"
                        >
                           {isInCart ? <FiXCircle size={15} /> : <FiShoppingCart size={15}/>}
                           {isInCart ? "Remove" : "Add to Cart"}
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
                className="py-10 bg-gradient-to-br from-gray-900 via-black to-gray-950 min-h-screen text-gray-200" // Adjusted padding
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="mb-12 text-center" // Increased margin bottom
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 pb-1"> {/* Added via color */}
                            Explore Our Collection
                        </h1>
                        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto"> {/* Adjusted text color */}
                            Discover premium digital products tailored for your needs.
                        </p>
                    </motion.div>

                    {/* Search and Filter Bar - Enhanced Style */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                        className="sticky top-4 z-30 mb-8 " // Adjust top offset if needed, increased z-index
                    >
                       <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-900/60 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 shadow-xl">
                            {/* Search Input */}
                            <div className="relative w-full md:w-auto md:flex-grow md:max-w-md"> {/* Allow search to grow */}
                                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                                <input
                                    type="text" placeholder="Search products, categories..."
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-600 rounded-lg bg-gray-800/70 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/0 transition duration-200 placeholder-gray-500 text-gray-100 shadow-inner" // Enhanced styling
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <motion.button
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setSearchTerm("")}
                                        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                        aria-label="Clear search"
                                    > <FiXCircle className="text-gray-500 hover:text-gray-300 h-4 w-4" /> </motion.button>
                                )}
                            </div>

                            {/* Filter Toggle & Sort Dropdown */}
                            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-shrink-0"> {/* Prevent shrinking */}
                                <motion.button
                                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-gray-900" // Added focus state
                                    onClick={() => setShowFilters(!showFilters)}
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    aria-expanded={showFilters}
                                > <FiSliders className="h-4 w-4" /> Filters <FiChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} /> </motion.button>

                                {/* Sort Dropdown */}
                                <div className="relative flex items-center">
                                    {/* <label htmlFor="sort-select" className="text-sm text-gray-400 whitespace-nowrap mr-2 sr-only">Sort by:</label> */}
                                    <select id="sort-select"
                                        className="appearance-none w-full md:w-44 pl-3 pr-8 py-2 border border-gray-600 rounded-lg bg-gray-800/70 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition duration-200 cursor-pointer" // Removed custom background image, using default arrow via appearance-none + custom arrow below
                                        value={sortOption} onChange={(e) => setSortOption(e.target.value)}
                                    >
                                        <option value="default" className="bg-gray-800">Newest</option>
                                        <option value="price-low" className="bg-gray-800">Price: Low to High</option>
                                        <option value="price-high" className="bg-gray-800">Price: High to Low</option>
                                        <option value="name" className="bg-gray-800">Name (A-Z)</option>
                                        {/* <option value="rating" className="bg-gray-800">Rating</option> */}
                                    </select>
                                     <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"/>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Collapsible Filter Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                variants={filterPanelVariants} initial="hidden" animate="show" exit="exit"
                                className="mb-8 bg-gray-800/60 backdrop-blur-md p-5 rounded-xl border border-gray-700/50 overflow-hidden shadow-lg" // Increased padding
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 items-start"> {/* Adjusted grid layout */}
                                    {/* Category Filter */}
                                    <div className="lg:col-span-2"> {/* Span categories across more space */}
                                        <h3 className="text-base font-semibold text-gray-100 mb-3">Category</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map(category => (
                                                <motion.button
                                                    key={category}
                                                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${activeFilter === category
                                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-blue-500/0 shadow-md' // Gradient active state
                                                        : 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500 hover:text-gray-100'
                                                        }`}
                                                    onClick={() => setActiveFilter(category)}
                                                    whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                                                > {category.charAt(0).toUpperCase() + category.slice(1)} </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range Filter */}
                                    {isClient && ( // Render slider only on client-side
                                        <div>
                                             <h3 className="text-base font-semibold text-gray-100 mb-3 flex justify-between items-center">
                                                <span>Price Range</span>
                                                 {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && ( // Show reset only if not default
                                                      <button
                                                        onClick={() => setPriceRange([0, maxPrice])} // Reset to dynamic max
                                                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                                                     >Reset</button>
                                                 )}
                                             </h3>
                                            <input
                                                type="range"
                                                min="0"
                                                max={maxPrice} // Use dynamic max price
                                                step="100" // Or adjust step based on maxPrice
                                                value={priceRange[1]} // Control the upper thumb
                                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-800" // Style the slider
                                            />
                                            <div className="flex justify-between mt-2 text-gray-400 text-sm font-medium">
                                                <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                                                <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Add a general Reset Filters button for convenience */}
                                <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-end">
                                     <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={handleResetFilters}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-2 focus:ring-offset-gray-800"
                                     > <FiRefreshCw size={14}/> Reset All Filters </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Products Grid */}
                    <motion.div
                        layout // Animate layout changes within the grid container itself
                        variants={containerVariants} initial="hidden" animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" // Responsive columns
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
                                // Empty State: Render when no products match filters
                                <motion.div
                                     key="empty"
                                     initial={{ opacity: 0, y: 20 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     exit={{ opacity: 0, y: -10 }}
                                     transition={{ duration: 0.4, ease:"easeInOut" }}
                                     className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-20 px-6 bg-gray-800/40 rounded-xl border border-dashed border-gray-700 flex flex-col items-center justify-center min-h-[350px]" // Increased min-height and padding
                                >
                                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}>
                                        <FiSearch size={48} className="mx-auto text-gray-600 mb-5" strokeWidth={1}/> {/* Thinner icon stroke */}
                                    </motion.div>
                                    <p className="text-xl font-semibold text-gray-300 mb-2">No Products Found</p>
                                    <p className="text-base text-gray-400 mb-6">Your search or filter combination yielded no results.</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                                        onClick={handleResetFilters} // Use the reset handler
                                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all shadow-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-2 focus:ring-offset-gray-800" // Gradient button
                                    > <FiRefreshCw size={15}/> Clear Filters & Search </motion.button>
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