import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

// MUI Components (kept for specific functionalities, styled heavily)
import { Rating, Dialog } from "@mui/material";
import { styled } from '@mui/material/styles';

// MUI Icons (or use another icon library if preferred)
import {
    AddShoppingCart,
    RemoveShoppingCart,
    Favorite,
    FavoriteBorder,
    Share,
    ArrowBack,
    Add,
    Remove,
    ContentCopy,
    Close,
} from "@mui/icons-material";

// Local Components & Config (Assuming these paths are correct in the user's project)
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import { fireDB } from "../../firebase/FirebaseConfig"; // Assuming fireDB is exported from here
import { addToCart, deleteFromCart } from "../../redux/cartSlice"; // Assuming Redux slices are defined here

// --- Framer Motion Variants ---

// Variants for page-level transitions
const pageTransition = {
    type: "spring",
    damping: 20,
    stiffness: 100
};

// Variants for the main content container
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Stagger animation for child elements
            delayChildren: 0.2,   // Delay before child animations start
            ...pageTransition
        }
    }
};

// Variants for individual items within the container
const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { ...pageTransition }
    }
};

// Variants for the product image
const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 120, damping: 15, delay: 0.1 }
    }
};

// --- Styled MUI Components (Override default styles with Tailwind-compatible colors) ---

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconFilled': {
        color: '#ffc107', // Brighter gold for filled stars
        filter: 'drop-shadow(0 0 3px rgba(255, 193, 7, 0.7))', // Subtle glow effect
    },
    '& .MuiRating-iconEmpty': {
        color: 'rgba(255, 255, 255, 0.3)', // Lighter color for empty stars
    },
}));

// --- ProductInfo Component ---

const ProductInfo = () => {
    // Access context for global state (e.g., user info)
    const context = useContext(myContext);
    const { user } = context; // Assuming user info might be needed for future features

    // State variables for product data, loading, quantity, and UI interactions
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [shareLink, setShareLink] = useState("");
    const [showFullDescription, setShowFullDescription] = useState(false); // New state for description visibility

    // Hook for getting URL parameters (product ID)
    const { id } = useParams();
    // Hook for programmatic navigation
    const navigate = useNavigate();
    // Redux selector to get cart items from the store
    const cartItems = useSelector((state) => state.cart);
    // Redux dispatch hook
    const dispatch = useDispatch();

    // Placeholder values for reviews and rating (can be replaced by actual product data)
    const [reviewCount, setReviewCount] = useState(107);
    const [ratingValue, setRatingValue] = useState(4.5);

    // --- Data Fetching Function ---
    const getProductData = useCallback(async () => {
        // Check if product ID is available
        if (!id) {
            toast.error("Product ID missing.");
            navigate("/"); // Redirect to home if ID is missing
            return;
        }
        setIsLoading(true); // Set loading state to true
        try {
            // Reference to the product document in Firestore
            const productDocRef = doc(fireDB, "products", id);
            // Fetch the product document
            const productDoc = await getDoc(productDocRef);

            if (productDoc.exists()) {
                // If product exists, set product data and generate share link
                const productData = { id: productDoc.id, ...productDoc.data() };
                setProduct(productData);
                setShareLink(`${window.location.origin}/productinfo/${id}`);

                // Update review count and rating if available in product data
                setReviewCount(productData.reviewCount || 107);
                setRatingValue(productData.rating || 4.5);

                // Increment view count (non-critical, fire-and-forget)
                updateDoc(productDocRef, { views: increment(1) }).catch(err => console.warn("Failed to update views", err));

            } else {
                // If product not found, show error and redirect
                toast.error("Product not found");
                navigate("/");
            }
        } catch (error) {
            // Log and show error if fetching fails
            console.error("Error fetching product:", error);
            toast.error("Failed to load product details.");
            navigate("/");
        } finally {
            // Add a small delay to ensure loading animation is visible for fast loads
            setTimeout(() => setIsLoading(false), 300);
        }
    }, [id, navigate]); // Dependencies for useCallback

    // Effect hook to fetch product data on component mount or ID change
    useEffect(() => {
        getProductData();
    }, [getProductData]); // Dependency array includes the memoized function

    // --- Action Handlers ---

    // Adds product to cart
    const addCart = useCallback((item) => {
        if (!item) return;
        dispatch(addToCart({ ...item, quantity })); // Dispatch action with item and selected quantity
        toast.success(`Added ${quantity} x ${item.title} to cart`);
    }, [dispatch, quantity]);

    // Removes product from cart
    const deleteCart = useCallback((item) => {
        if (!item) return;
        dispatch(deleteFromCart(item)); // Dispatch action to remove item
        toast.success("Removed from cart");
    }, [dispatch]);

    // Toggles favorite status
    const toggleFavorite = useCallback(() => {
        setIsFavorite(prev => !prev);
        toast.success(!isFavorite ? "Added to favorites" : "Removed from favorites");
        // TODO: Add persistence logic here if needed (e.g., update user's favorites in Firestore)
    }, [isFavorite]);

    // Opens the share dialog
    const handleShare = useCallback(() => setOpenShareDialog(true), []);
    // Closes the share dialog
    const closeShareDialog = useCallback(() => setOpenShareDialog(false), []);

    // Copies the share link to clipboard
    const copyToClipboard = useCallback(() => {
        // Using navigator.clipboard.writeText for modern browsers
        navigator.clipboard.writeText(shareLink)
            .then(() => {
                toast.success("Link copied!");
                closeShareDialog(); // Close dialog after copying
            })
            .catch(err => {
                console.error("Clipboard copy failed:", err);
                toast.error("Could not copy link.");
            });
    }, [shareLink, closeShareDialog]);

    // Handles "Buy Now" action: adds to cart and navigates to cart page
    const handleBuyNow = useCallback((item) => {
        if (!item) return;
        dispatch(addToCart({ ...item, quantity })); // Add item to cart with selected quantity
        navigate("/cart"); // Navigate to cart page
    }, [dispatch, quantity, navigate]);

    // Handles quantity change for the product
    const handleQuantityChange = useCallback((amount) => {
        setQuantity(prev => Math.max(1, prev + amount)); // Ensure quantity doesn't go below 1
    }, []);

    // Memoized value to check if the product is already in the cart
    const isInCart = useMemo(() =>
        product ? cartItems.some((p) => p.id === product.id) : false,
        [cartItems, product] // Recalculate if cartItems or product changes
    );

    // Logic for "Read More" functionality
    const descriptionText = product?.description || "No description available.";
    const DESCRIPTION_LIMIT = 200; // Character limit for truncation
    const isLongDescription = descriptionText.length > DESCRIPTION_LIMIT;
    const displayedDescription = showFullDescription || !isLongDescription
        ? descriptionText
        : `${descriptionText.substring(0, DESCRIPTION_LIMIT)}...`;

    // --- Render Logic ---

    // Loading state UI
    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 via-black to-gray-800">
                    {/* Simple loading spinner with Framer Motion animation */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-t-4 border-b-4 border-purple-500 rounded-full"
                    />
                </div>
            </Layout>
        );
    }

    // Product not found state UI
    if (!product) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-900 text-white p-6">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-semibold mb-4"
                    >
                        Product Not Found
                    </motion.h2>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md transition duration-300"
                    >
                        Go Home
                    </motion.button>
                </div>
            </Layout>
        );
    }

    // Main Product Display UI
    return (
        <Layout>
            {/* Modern Hero Section with Enhanced Background */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-black to-blue-950 text-gray-100"
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-[-10%] left-[-5%] w-72 h-72 md:w-96 md:h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"
                        animate={{
                            x: [0, 50, 0, -50, 0],
                            y: [0, -30, 0, 30, 0],
                            scale: [1, 1.1, 1, 0.9, 1]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute bottom-[-15%] right-[-10%] w-80 h-80 md:w-[500px] md:h-[500px] bg-orange-500 rounded-full filter blur-3xl opacity-30"
                        animate={{
                            x: [0, -40, 0, 40, 0],
                            y: [0, 20, 0, -20, 0],
                            rotate: [0, 10, 0, -10, 0]
                        }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute top-[30%] right-[40%] w-40 h-40 md:w-60 md:h-60 bg-teal-500 rounded-full filter blur-2xl opacity-25"
                        animate={{
                            x: [0, 20, 0, -20, 0],
                            y: [0, -15, 0, 15, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "circInOut" }}
                    />
                </div>

                {/* Enhanced Back Button */}
                <motion.button
                    variants={itemVariants}
                    onClick={() => navigate(-1)}
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2.5 text-sm bg-gray-800/60 hover:bg-gray-700/80 backdrop-blur-lg rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 border border-gray-700/50 hover:border-teal-400/50 text-gray-200 hover:text-white shadow-lg"
                    aria-label="Go back"
                >
                    <ArrowBack fontSize="small" />
                    <span className="font-medium">Back</span>
                </motion.button>

                {/* Main Content Grid: Image and Info Columns */}
                <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mt-16 lg:mt-20 px-4 md:px-8">

                    {/* --- Enhanced Image Column --- */}
                    <motion.div variants={imageVariants} className="relative group">
                        {/* Modern Image Container with Glass Morphism */}
                        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/60 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/30">
                            {/* Gradient Overlay for Better Image Contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 z-10" />

                            <motion.img
                                src={product.productImageUrl}
                                alt={product.title}
                                className="block w-full h-full object-contain p-6 relative z-20"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            />

                            {/* Animated Border Glow */}
                            <motion.div
                                className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-teal-400/50 via-purple-500/50 to-orange-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: 'linear-gradient(45deg, rgba(20, 184, 166, 0.3), rgba(168, 85, 247, 0.3), rgba(251, 146, 60, 0.3))',
                                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                    maskComposite: 'xor'
                                }}
                            />
                        </div>

                        {/* Enhanced Action Icons */}
                        <div className="absolute top-6 right-6 flex flex-col gap-3">
                            <motion.button
                                onClick={toggleFavorite}
                                whileHover={{ scale: 1.15, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                className={clsx(
                                    "p-3 rounded-2xl backdrop-blur-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg border",
                                    isFavorite
                                        ? 'bg-red-500/80 text-white focus:ring-red-400 border-red-400/50 shadow-red-500/25'
                                        : 'bg-gray-800/60 hover:bg-gray-700/80 text-gray-200 hover:text-white focus:ring-teal-400 border-gray-600/50 hover:border-teal-400/50'
                                )}
                                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={isFavorite ? 'fav' : 'nofav'}
                                        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.button>

                            <motion.button
                                onClick={handleShare}
                                whileHover={{ scale: 1.15, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 bg-gray-800/60 hover:bg-gray-700/80 backdrop-blur-lg text-gray-200 hover:text-white rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-teal-400 shadow-lg border border-gray-600/50 hover:border-teal-400/50"
                                aria-label="Share product"
                            >
                                <Share fontSize="small" />
                            </motion.button>
                        </div>

                        {/* Floating Badge for Stock Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-6 left-6"
                        >
                            <div className={clsx(
                                "px-4 py-2 rounded-2xl backdrop-blur-lg text-sm font-semibold border shadow-lg",
                                product.quantity > 0
                                    ? 'bg-green-500/20 text-green-300 border-green-400/30'
                                    : 'bg-red-500/20 text-red-300 border-red-400/30'
                            )}>
                                {product.quantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* --- Enhanced Info Column --- */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-6 md:gap-8 lg:pl-8">

                        {/* Modern Category Badge */}
                        <motion.div variants={itemVariants}>
                            <motion.span
                                className="inline-flex items-center px-4 py-2 text-sm font-semibold tracking-wide uppercase bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 rounded-2xl border border-purple-400/30 backdrop-blur-sm"
                                whileHover={{ scale: 1.05, y: -2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                                {product.category}
                            </motion.span>
                        </motion.div>

                        {/* Enhanced Product Title */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300 leading-tight tracking-tight"
                        >
                            {product.title}
                        </motion.h1>

                        {/* Enhanced Rating & Price Section */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            {/* Rating Section */}
                            <div className="flex items-center gap-3 p-4 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                                <StyledRating value={ratingValue} precision={0.5} readOnly size="medium" />
                                <span className="text-sm text-gray-300 font-medium">({reviewCount} reviews)</span>
                                <div className="ml-auto flex items-center gap-2">
                                    <span className="text-2xl font-bold text-yellow-400">{ratingValue}</span>
                                    <span className="text-sm text-gray-400">/5</span>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-700/50">
                                <div className="flex items-baseline gap-3">
                                    {product.oldPrice && (
                                        <span className="text-lg text-gray-500 line-through font-medium">
                                            रु{product.oldPrice}
                                        </span>
                                    )}
                                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                                        रु{product.price}
                                    </span>
                                </div>
                                {product.oldPrice && (
                                    <div className="text-right">
                                        <div className="text-sm text-gray-400">You save</div>
                                        <div className="text-lg font-semibold text-green-400">
                                            रु{product.oldPrice - product.price}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Enhanced Product Description */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-xl font-bold text-white">Product Details</h3>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent"></div>
                            </div>
                            <div className="p-6 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                                <div className={clsx(
                                    "text-gray-300 leading-relaxed text-base",
                                    {
                                        "max-h-32 overflow-y-auto custom-scrollbar": !showFullDescription && isLongDescription
                                    }
                                )}>
                                    <p className="whitespace-pre-line">{displayedDescription}</p>
                                </div>
                                {isLongDescription && (
                                    <motion.button
                                        onClick={() => setShowFullDescription(prev => !prev)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="mt-4 px-4 py-2 text-teal-400 hover:text-teal-300 text-sm font-semibold bg-teal-500/10 hover:bg-teal-500/20 rounded-xl border border-teal-400/30 hover:border-teal-400/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    >
                                        {showFullDescription ? "Show Less ↑" : "Read More ↓"}
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>

                        {/* Enhanced Quantity Selector */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <label htmlFor="quantity" className="text-xl font-bold text-white">Quantity</label>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent"></div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 w-fit">
                                <motion.button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 border border-gray-600/50 hover:border-teal-400/50"
                                    aria-label="Decrease quantity"
                                >
                                    <Remove fontSize="medium" />
                                </motion.button>

                                <div className="px-6 py-3 bg-gray-700/50 rounded-xl border border-gray-600/50 min-w-[80px] text-center">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={quantity}
                                            initial={{ y: -20, opacity: 0, scale: 0.8 }}
                                            animate={{ y: 0, opacity: 1, scale: 1 }}
                                            exit={{ y: 20, opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                                            className="text-2xl font-bold text-white"
                                        >
                                            {quantity}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>

                                <motion.button
                                    onClick={() => handleQuantityChange(1)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 border border-gray-600/50 hover:border-teal-400/50"
                                    aria-label="Increase quantity"
                                >
                                    <Add fontSize="medium" />
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Enhanced Action Buttons */}
                        <motion.div variants={itemVariants} className="space-y-4 mt-8">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-xl font-bold text-white">Actions</h3>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent"></div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.button
                                    onClick={() => isInCart ? deleteCart(product) : addCart(product)}
                                    whileHover={{
                                        scale: 1.02,
                                        y: -3,
                                        boxShadow: isInCart
                                            ? "0 20px 40px rgba(239, 68, 68, 0.3)"
                                            : "0 20px 40px rgba(34, 197, 94, 0.3)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className={clsx(
                                        "flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent border-2 backdrop-blur-sm",
                                        isInCart
                                            ? 'bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-400/90 hover:to-red-500/90 focus:ring-red-400 border-red-400/50 hover:border-red-300/70'
                                            : 'bg-gradient-to-r from-green-500/80 to-emerald-600/80 hover:from-green-400/90 hover:to-emerald-500/90 focus:ring-green-400 border-green-400/50 hover:border-green-300/70'
                                    )}
                                >
                                    <motion.span
                                        animate={{ rotate: isInCart ? 0 : 360 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {isInCart ? <RemoveShoppingCart fontSize="medium" /> : <AddShoppingCart fontSize="medium" />}
                                    </motion.span>
                                    <span>
                                        {isInCart ? 'Remove from Cart' : `Add ${quantity} to Cart`}
                                    </span>
                                </motion.button>

                                <motion.button
                                    onClick={() => handleBuyNow(product)}
                                    whileHover={{
                                        scale: 1.02,
                                        y: -3,
                                        boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold bg-gradient-to-r from-purple-500/80 to-indigo-600/80 hover:from-purple-400/90 hover:to-indigo-500/90 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-purple-400 border-2 border-purple-400/50 hover:border-purple-300/70 backdrop-blur-sm"
                                >
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        ⚡
                                    </motion.span>
                                    <span>Buy Now</span>
                                </motion.button>
                            </div>

                            {/* Trust Indicators */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-center justify-center gap-6 mt-6 p-4 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30"
                            >
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <span className="text-green-400">✓</span>
                                    <span>Instant Delivery</span>
                                </div>
                                <div className="w-px h-4 bg-gray-600"></div>
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <span className="text-blue-400">🔒</span>
                                    <span>Secure Payment</span>
                                </div>
                                <div className="w-px h-4 bg-gray-600"></div>
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <span className="text-purple-400">💬</span>
                                    <span>24/7 Support</span>
                                </div>
                            </motion.div>
                        </motion.div>

                    </motion.div>
                </div>

                {/* Enhanced Additional Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-7xl mx-auto mt-20 lg:mt-32 px-4 md:px-8"
                >
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-4"
                        >
                            Product Information
                        </motion.h2>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="w-24 h-1 bg-gradient-to-r from-teal-400 to-purple-500 mx-auto rounded-full"
                        />
                    </div>

                    {/* Info Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Specifications Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="p-6 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 hover:border-teal-400/50 transition-all duration-300"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold">📋</span>
                                </div>
                                <h3 className="text-lg font-bold text-white">Specifications</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                    <span className="text-gray-400">Category</span>
                                    <span className="text-white font-medium">{product.category}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                    <span className="text-gray-400">Brand</span>
                                    <span className="text-white font-medium">{product.brand || "Digital Shop Nepal"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Stock Status</span>
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-xs font-semibold",
                                        product.quantity > 0
                                            ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                                            : 'bg-red-500/20 text-red-300 border border-red-400/30'
                                    )}>
                                        {product.quantity > 0 ? "✓ In Stock" : "✗ Out of Stock"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Delivery & Support Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="p-6 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold">🚀</span>
                                </div>
                                <h3 className="text-lg font-bold text-white">Delivery & Support</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                    <span className="text-gray-400">Delivery Time</span>
                                    <span className="text-green-400 font-medium">⚡ Instant - 2 mins</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                    <span className="text-gray-400">Returns</span>
                                    <span className="text-white font-medium">Replacement Only</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Support</span>
                                    <span className="text-blue-400 font-medium">🔵 24/7 Available</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Security & Trust Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="p-6 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 hover:border-orange-400/50 transition-all duration-300 md:col-span-2 lg:col-span-1"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold">🔒</span>
                                </div>
                                <h3 className="text-lg font-bold text-white">Security & Trust</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                    <span className="text-gray-400">Payment</span>
                                    <span className="text-green-400 font-medium">🔐 100% Secure</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                    <span className="text-gray-400">Verification</span>
                                    <span className="text-blue-400 font-medium">✓ Verified Seller</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Guarantee</span>
                                    <span className="text-purple-400 font-medium">💎 Quality Assured</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

            </motion.section>

            {/* --- Enhanced Share Dialog --- */}
            <Dialog
                open={openShareDialog}
                onClose={closeShareDialog}
                PaperProps={{
                    className: 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 text-white rounded-3xl shadow-2xl border border-gray-600/50 backdrop-blur-xl !max-w-lg'
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                    className="p-8 relative"
                >
                    {/* Enhanced Close Button */}
                    <motion.button
                        onClick={closeShareDialog}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200"
                        aria-label="Close share dialog"
                    >
                        <Close fontSize="medium" />
                    </motion.button>

                    {/* Dialog Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Share fontSize="large" className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Share this Product</h3>
                        <p className="text-gray-400 text-sm">Share with friends and family</p>
                    </div>

                    {/* Product Preview */}
                    <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30 mb-6">
                        <img
                            src={product.productImageUrl}
                            alt={product.title}
                            className="w-16 h-16 object-contain bg-gray-800 rounded-xl"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold truncate">{product.title}</h4>
                            <p className="text-teal-400 font-bold">रु{product.price}</p>
                        </div>
                    </div>

                    {/* Share Link Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-300">Product Link</label>
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value={shareLink}
                                className="w-full px-4 py-3 pr-14 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
                                onClick={(e) => e.target.select()}
                            />
                            <motion.button
                                onClick={copyToClipboard}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 rounded-r-2xl transition-all duration-200"
                                aria-label="Copy link"
                            >
                                <ContentCopy fontSize="small" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Quick Share Options */}
                    <div className="mt-6">
                        <p className="text-sm font-medium text-gray-300 mb-3">Quick Share</p>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this product: ${product.title} - रु${product.price}\n${shareLink}`)}`)}
                                className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-xl border border-green-500/30 transition-all duration-200"
                            >
                                <span className="text-lg">📱</span>
                                <span className="text-sm font-medium">WhatsApp</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`)}
                                className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl border border-blue-500/30 transition-all duration-200"
                            >
                                <span className="text-lg">📘</span>
                                <span className="text-sm font-medium">Facebook</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this product: ${product.title}`)}&url=${encodeURIComponent(shareLink)}`)}
                                className="flex-1 flex items-center justify-center gap-2 p-3 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 rounded-xl border border-sky-500/30 transition-all duration-200"
                            >
                                <span className="text-lg">🐦</span>
                                <span className="text-sm font-medium">Twitter</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </Dialog>

            {/* Custom Scrollbar CSS for the description overflow */}
            {/* This CSS can be placed in a global stylesheet or directly here for demonstration */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(167, 139, 250, 0.6); /* Purple accent */
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(167, 139, 250, 0.8);
                }
            `}</style>
        </Layout>
    );
};

export default ProductInfo;
