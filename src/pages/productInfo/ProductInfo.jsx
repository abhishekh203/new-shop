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
            {/* Main Section with Background Gradient and Animations */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-200 py-16 px-4 md:px-8 lg:px-16"
            >
                {/* Back Button */}
                <motion.button
                    variants={itemVariants}
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label="Go back"
                >
                    <ArrowBack fontSize="small" /> Back
                </motion.button>

                {/* Main Content Grid: Image and Info Columns */}
                <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-10 lg:mt-0">

                    {/* --- Image Column --- */}
                    <motion.div variants={imageVariants} className="relative group">
                        {/* Image container with shadow and rounded corners */}
                        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
                            <motion.img
                                src={product.productImageUrl}
                                alt={product.title}
                                className="block w-full h-full object-contain bg-gradient-to-br from-slate-800 to-slate-900"
                            />
                            {/* Subtle overlay on hover for visual feedback */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-300" />
                        </div>
                        {/* Action Icons (Favorite, Share) positioned absolutely */}
                        <div className="absolute top-5 right-5 flex flex-col gap-3">
                            <motion.button
                                onClick={toggleFavorite}
                                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                className={clsx(
                                    "p-2.5 rounded-full backdrop-blur-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/30",
                                    isFavorite ? 'bg-red-500/70 text-white focus:ring-red-400' : 'bg-white/10 hover:bg-white/20 text-white focus:ring-purple-500'
                                )}
                                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                {/* Animate presence for smooth icon change */}
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={isFavorite ? 'fav' : 'nofav'}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.button>
                            <motion.button
                                onClick={handleShare}
                                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/30 focus:ring-purple-500"
                                aria-label="Share product"
                            >
                                <Share fontSize="small" />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* --- Info Column --- */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-6 md:gap-8">

                        {/* Category Chip */}
                        <motion.span variants={itemVariants}>
                            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase bg-purple-500/20 text-purple-300 rounded-full">
                                {product.category}
                            </span>
                        </motion.span>

                        {/* Product Title */}
                        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            {product.title}
                        </motion.h1>

                        {/* Rating & Price Row */}
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <StyledRating value={ratingValue} precision={0.5} readOnly size="medium" />
                                <span className="text-sm text-gray-400 mt-0.5">({reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                {/* Old Price (if applicable) */}
                                {product.oldPrice && (
                                    <span className="text-lg text-gray-500 line-through">
                                        रु{product.oldPrice}
                                    </span>
                                )}
                                {/* Current Price with accent color */}
                                <span className="text-3xl font-semibold text-cyan-400">
                                    रु{product.price}
                                </span>
                            </div>
                        </motion.div>

                        {/* Product Description */}
                        <motion.div variants={itemVariants} className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-300">Details</h3>
                            <div className={clsx(
                                "text-gray-400 leading-relaxed text-sm pr-2",
                                {
                                    "max-h-32 overflow-y-auto custom-scrollbar": !showFullDescription && isLongDescription
                                }
                            )}>
                                <p>{displayedDescription}</p>
                            </div>
                            {isLongDescription && (
                                <button
                                    onClick={() => setShowFullDescription(prev => !prev)}
                                    className="text-purple-400 hover:text-purple-300 text-sm font-medium mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md px-2 py-1 -ml-2"
                                >
                                    {showFullDescription ? "Show Less" : "Read More"}
                                </button>
                            )}
                        </motion.div>

                        {/* Quantity Selector */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="quantity" className="block text-lg font-semibold text-gray-300 mb-3">Quantity</label>
                            <div className="flex items-center gap-3 p-1.5 bg-slate-700/50 rounded-xl w-fit">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 text-white hover:from-slate-500 hover:to-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    aria-label="Decrease quantity"
                                >
                                    <Remove fontSize="small" />
                                </button>
                                {/* Animate quantity change */}
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={quantity}
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 10, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-xl font-semibold text-white w-10 text-center"
                                    >
                                        {quantity}
                                    </motion.span>
                                </AnimatePresence>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 text-white hover:from-slate-500 hover:to-slate-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    aria-label="Increase quantity"
                                >
                                    <Add fontSize="small" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Action Buttons: Add to Cart / Remove from Cart & Buy Now */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-4">
                            <motion.button
                                onClick={() => isInCart ? deleteCart(product) : addCart(product)}
                                whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                className={clsx(
                                    "flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900",
                                    isInCart
                                        ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 focus:ring-red-500'
                                        : 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 focus:ring-green-500'
                                )}
                            >
                                {isInCart ? <RemoveShoppingCart fontSize="small" /> : <AddShoppingCart fontSize="small" />}
                                {isInCart ? 'Remove from Cart' : `Add (${quantity})`}
                            </motion.button>
                            <motion.button
                                onClick={() => handleBuyNow(product)}
                                whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 px-6 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
                            >
                                Buy Now
                            </motion.button>
                        </motion.div>

                    </motion.div>
                </div>

                {/* Additional Info Section - Animates on Scroll */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }} // Trigger when 30% of element is visible
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-7xl mx-auto mt-16 lg:mt-24 p-8 bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">More Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-300 uppercase tracking-wider">Specifications</h3>
                            <p><strong className="text-gray-400 w-20 inline-block">Category:</strong> {product.category}</p>
                            <p><strong className="text-gray-400 w-20 inline-block">Brand:</strong> {product.brand || "N/A"}</p>
                            <p>
                                <strong className="text-gray-400 w-20 inline-block">Stock:</strong>
                                <span className={clsx("ml-2 px-2 py-0.5 rounded-full text-xs", product.quantity > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300')}>
                                    {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                                </span>
                            </p>
                            {/* Add more relevant specs here based on your product data */}
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-300 uppercase tracking-wider">Shipping & Support</h3>
                            <p><strong className="text-gray-400 w-20 inline-block">Delivery:</strong> Instant - 30 mins</p>
                            <p><strong className="text-gray-400 w-20 inline-block">Returns:</strong> Replacement Only</p>
                            <p><strong className="text-gray-400 w-20 inline-block">Support:</strong> 24/7 Available</p>
                        </div>
                    </div>
                </motion.div>

            </motion.section>

            {/* --- Share Dialog (MUI Dialog styled with Tailwind) --- */}
            <Dialog
                open={openShareDialog}
                onClose={closeShareDialog}
                PaperProps={{
                    // Apply Tailwind classes directly to the Paper component of the Dialog
                    className: 'bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl shadow-xl border border-white/10 backdrop-blur-md !max-w-md'
                }}
            >
                <div className="p-6 relative">
                    {/* Close button for the dialog */}
                    <button
                        onClick={closeShareDialog}
                        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition"
                        aria-label="Close share dialog"
                    >
                        <Close fontSize="small" />
                    </button>
                    <h3 className="text-lg font-semibold mb-4">Share this Product</h3>
                    <div className="relative">
                        {/* Input field for the share link */}
                        <input
                            type="text"
                            readOnly
                            value={shareLink}
                            className="w-full px-4 py-2 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {/* Copy to clipboard button */}
                        <button
                            onClick={copyToClipboard}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-purple-400 hover:text-purple-300 transition"
                            aria-label="Copy link"
                        >
                            <ContentCopy fontSize="small" />
                        </button>
                    </div>
                </div>
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
