import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { Helmet } from "react-helmet-async";
import { isProductId, createSlug } from "../../utils/slugUtils";
import { useNotification } from "../../context/NotificationContext";
import { serifTheme } from "../../design-system/themes";
import useLocalStorage from "../../hooks/storage/useLocalStorage";
import { SerifPageWrapper, SerifButton, SerifBadge } from "../../design-system/components";
import { FaShareAlt, FaArrowLeft, FaPlus, FaMinus, FaCopy, FaTimes, FaShoppingCart, FaTrash } from "react-icons/fa";

// MUI Components (kept for Dialog functionality only)
import { Dialog } from "@mui/material";

// Local Components & Config (Assuming these paths are correct in the user's project)
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import { addToCart, deleteFromCart } from "../../redux/cartSlice"; // Assuming Redux slices are defined here
import { useCartSync } from "../../hooks/cart/useCartSync";
import LoginPopup from "../../components/login-popup/LoginPopup";
import ProductReviews from "../../components/product-reviews/ProductReviews";
import RelatedProducts from "../../components/related-products/RelatedProducts";
// import AIChat from "../../components/aiChat/AiChat"; // Disabled AI Chat
import { supabase } from "../../supabase/supabaseConfig";
import logger from '../../utils/logger';


// --- ProductInfo Component ---

const ProductInfo = () => {
    // Access context for global state (e.g., user info)
    const context = useContext(myContext);
    // Get current user from localStorage
    const [user] = useLocalStorage('users', null);
    const userId = user?.id || user?.uid || null;
    const rawUserRole = typeof user?.role === "string" ? user.role : user?.role?.role || user?.role?.name || null;
    const normalizedUserRole = rawUserRole ? String(rawUserRole).trim().toLowerCase() : "";
    
    // State variables for product data, loading, quantity, and UI interactions
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [shareLink, setShareLink] = useState("");
    const [activeTab, setActiveTab] = useState("description"); // "description" or "reviews"
    const allProducts = Array.isArray(context?.getAllProduct) ? context.getAllProduct : [];

    // Hook for getting URL parameters (product slug or ID)
    const { slug } = useParams();
    // Hook for programmatic navigation
    const navigate = useNavigate();
    // Redux selector to get cart items from the store
    const cartItems = useSelector((state) => state.cart);
    // Redux dispatch hook
    const dispatch = useDispatch();
    // Cart sync hook with authentication
    const { 
        addToCartWithSync, 
        removeFromCartWithSync, 
        showLoginPopup, 
        closeLoginPopup, 
        pendingProduct 
    } = useCartSync();
    // Notification hook
    const notification = useNotification();


    // --- Data Fetching Function ---
    const getProductData = useCallback(async () => {
        if (!slug) {
            notification.error("Product not found.");
            navigate("/");
            return;
        }

        setIsLoading(true);

        const normalizeProduct = (data) => {
            if (!data) return null;
            return {
                ...data,
                productImageUrl:
                    data.productImageUrl ??
                    data.product_image_url ??
                    data.productimageurl ??
                    data.imageUrl ??
                    data.image_url ??
                    data.image ??
                    ""
            };
        };

        try {
            let productData = null;

            if (isProductId(slug)) {
                productData = allProducts.find((item) => item.id === slug) || null;
            } else {
                productData =
                    allProducts.find((item) => item?.title && createSlug(item.title) === slug) || null;
            }

            if (!productData) {
                if (isProductId(slug)) {
                    const { data, error } = await supabase
                        .from("products")
                        .select("*")
                        .eq("id", slug)
                        .maybeSingle();

                    if (error) {
                        throw error;
                    }

                    productData = data;
                } else {
                    const { data, error } = await supabase
                        .from("products")
                        .select("*");

                    if (error) {
                        throw error;
                    }

                    productData =
                        data?.find((item) => item?.title && createSlug(item.title) === slug) || null;
                }
            }

            if (productData) {
                const normalized = normalizeProduct(productData);
                setProduct(normalized);
                const properSlug = createSlug(normalized.title || "");
                const origin =
                    typeof window !== "undefined" && window?.location?.origin
                        ? window.location.origin
                        : "";
                setShareLink(origin ? `${origin}/productinfo/${properSlug}` : `/productinfo/${properSlug}`);
            } else {
                notification.error("Product not found");
                navigate("/");
            }
        } catch (error) {
            logger.error('Error fetching product:', { error: error.message || error });
            notification.error("Failed to load product details.");
            navigate("/");
        } finally {
            setIsLoading(false);
        }
    }, [slug, navigate, notification, allProducts]);

    // Effect hook to fetch product data on component mount or slug change only
    useEffect(() => {
        if (slug) {
            getProductData();
        }
    }, [slug, getProductData]);

    // --- Action Handlers ---

    // Adds product to cart
    const addCart = useCallback((item, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!item) return;
        
        // Add to cart with authentication check
        const added = addToCartWithSync({ ...item, quantity });
        
        // Only show success notification if item was actually added
        if (added) {
            notification.success(`Added ${quantity} x ${item.title} to cart`, {
                icon: <FaShoppingCart />,
                duration: 3000
            });
        }
        // If not added, the login popup will be shown by useCartSync
    }, [addToCartWithSync, quantity, notification]);

    // Removes product from cart
    const deleteCart = useCallback((item, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!item) return;
        
        // Remove from cart (localStorage only)
        removeFromCartWithSync(item);
        notification.success("Removed from cart", {
            icon: <FaTrash />,
            duration: 3000
        });
    }, [removeFromCartWithSync, notification]);


    // Opens the share dialog
    const handleShare = useCallback(() => {
        if (!product || !product.title) {
            notification.error("Product information not loaded yet. Please wait a moment.");
            return;
        }
        logger.debug('Opening share dialog with product:', { context: product });
        setOpenShareDialog(true);
    }, [product, notification]);
    // Closes the share dialog
    const closeShareDialog = useCallback(() => setOpenShareDialog(false), []);

    // Copies the share link to clipboard
    const copyToClipboard = useCallback(() => {
        // Using navigator.clipboard.writeText for modern browsers
        navigator.clipboard.writeText(shareLink)
            .then(() => {
                notification.success("Link copied!", {
                    icon: <FaCopy />,
                    duration: 3000
                });
                closeShareDialog(); // Close dialog after copying
            })
            .catch(err => {
                logger.error('Clipboard copy failed:', { context: err });
                notification.error("Could not copy link.");
            });
    }, [shareLink, closeShareDialog, notification]);




    // Handles "Buy Now" action: adds to cart and navigates to cart page
    const handleBuyNow = useCallback((item) => {
        if (!item) return;
        // Add to cart with authentication check
        const added = addToCartWithSync({ ...item, quantity });
        
        // Only navigate to cart if item was actually added
        if (added) {
            navigate("/cart");
        }
        // If not added, the login popup will be shown by useCartSync
    }, [addToCartWithSync, quantity, navigate]);

    // Handles quantity change for the product
    const handleQuantityChange = useCallback((amount) => {
        setQuantity(prev => Math.max(1, prev + amount)); // Ensure quantity doesn't go below 1
    }, []);

    // Memoized value to check if the product is already in the cart
    const isInCart = useMemo(() =>
        product ? cartItems.some((p) => p.id === product.id) : false,
        [cartItems, product] // Recalculate if cartItems or product changes
    );

    // Product description - full text and truncated version
    const fullDescription = product?.description || "No description available.";
    const truncatedDescription = fullDescription.length > 500 
        ? fullDescription.substring(0, 500) + "..."
        : fullDescription;

    // --- Render Logic ---

    // Loading state UI
    if (isLoading) {
        return (
            <Layout>
                <SerifPageWrapper>
                    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] w-full">
                        <div className="w-16 h-16 border-t-4 border-b-4 border-amber-600 rounded-full animate-spin" />
                    </div>
                </SerifPageWrapper>
            </Layout>
        );
    }

    // Product not found state UI
    if (!product) {
        return (
            <Layout>
                <SerifPageWrapper className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
                    <h2 className={`text-2xl font-semibold mb-4 ${serifTheme.colors.text.primary}`}>
                        Product Not Found
                    </h2>
                    <SerifButton
                        onClick={() => navigate('/')}
                        variant="primary"
                    >
                        Go Home
                    </SerifButton>
                </SerifPageWrapper>
            </Layout>
        );
    }

    // Main Product Display UI
    return (
        <Layout>
            {/* Dynamic SEO and Social Media Meta Tags */}
            {product && (
                <Helmet>
                    {/* Basic Meta Tags */}
                    <title>{product.title} - Digital Shop Nepal</title>
                    <meta name="description" content={`Buy ${product.title} at best price NPR ${product.price}. ${(product.description || 'Premium digital subscription with instant delivery and 24/7 support.').substring(0, 160)}${product.description && product.description.length > 160 ? '...' : ''}`} />
                    
                    {/* Open Graph Meta Tags for Social Media (WhatsApp, Facebook) */}
                    <meta property="og:title" content={`${product.title} - Digital Shop Nepal`} />
                    <meta property="og:description" content={`Buy ${product.title} at best price NPR ${product.price}. Premium digital subscription with instant delivery. In stock now!`} />
                    <meta property="og:image" content={product.productImageUrl || 'https://digitalshopnepal.com/img/logo.png'} />
                    <meta property="og:image:secure_url" content={product.productImageUrl || 'https://digitalshopnepal.com/img/logo.png'} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:image:alt" content={`${product.title} - Digital Shop Nepal`} />
                    <meta property="og:url" content={shareLink} />
                    <meta property="og:type" content="product" />
                    <meta property="og:site_name" content="Digital Shop Nepal" />
                    <meta property="og:locale" content="en_US" />
                    <meta property="og:updated_time" content={new Date().toISOString()} />
                    
                    {/* Product Specific Open Graph */}
                    <meta property="product:price:amount" content={product.price} />
                    <meta property="product:price:currency" content="NPR" />
                    <meta property="product:availability" content={product.quantity > 0 ? "in stock" : "out of stock"} />
                    <meta property="product:condition" content="new" />
                    <meta property="product:brand" content={product.brand || "Digital Shop Nepal"} />
                    
                    {/* Twitter Card Meta Tags */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="@digitalshopnepal" />
                    <meta name="twitter:title" content={`${product.title} - Digital Shop Nepal`} />
                    <meta name="twitter:description" content={`Buy ${product.title} at best price NPR ${product.price}. Premium digital subscription with instant delivery.`} />
                    <meta name="twitter:image" content={product.productImageUrl || 'https://digitalshopnepal.com/img/logo.png'} />
                    <meta name="twitter:image:alt" content={product.title} />
                    
                    {/* Additional Meta Tags for Better Social Sharing */}
                    <meta property="article:author" content="Digital Shop Nepal" />
                    <meta property="article:publisher" content="Digital Shop Nepal" />
                    
                    {/* Canonical URL */}
                    <link rel="canonical" href={shareLink} />
                    
                    {/* Cache Control for Social Media */}
                    <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                    <meta httpEquiv="Pragma" content="no-cache" />
                    <meta httpEquiv="Expires" content="0" />
                </Helmet>
            )}
            {/* Main Product Section with Serif Theme */}
            <SerifPageWrapper className="relative min-h-screen py-8 lg:py-12">
                {/* Back Button - Arrow Only */}
                <button
                    onClick={() => navigate(-1)}
                    className={`absolute top-6 left-6 z-20 p-2 ${serifTheme.colors.text.secondary} hover:${serifTheme.colors.text.primary} ${serifTheme.transitions.default} focus:outline-none focus:ring-2 focus:ring-amber-400`}
                    aria-label="Go back"
                >
                    <FaArrowLeft size={24} />
                </button>

                {/* Main Content Grid: Image Left, Info Right */}
                <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-16 lg:mt-20 px-4 md:px-8">
                    
                    {/* Product Image Column - Left */}
                    <div className="relative group lg:sticky lg:top-24">
                        {/* Image Container - No Background */}
                        <div className={`relative w-full aspect-square ${serifTheme.radius.card} overflow-hidden flex items-center justify-center bg-transparent`}>
                            {/* Product Image */}
                            <img
                                src={product.productImageUrl}
                                alt={product.title}
                                className={`block max-w-[80%] max-h-[80%] object-contain p-4 relative z-20`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/img/hero.png";
                                    logger.warn('Failed to load main product image: ${product.productImageUrl}');
                                }}
                            />

                            {/* Action Icons */}
                            <div className="absolute top-4 right-4 flex gap-2 z-30">
                                <button
                                onClick={handleShare}
                                    className={`p-2.5 ${serifTheme.colors.button.secondary} backdrop-blur-lg ${serifTheme.colors.text.secondary} hover:text-blue-600 hover:bg-blue-50 ${serifTheme.radius.button} ${serifTheme.transitions.default} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-amber-400 ${serifTheme.colors.shadow.button} border ${serifTheme.colors.border.secondary} hover:border-amber-400/50`}
                                aria-label="Share product"
                            >
                                    <FaShareAlt size={16} />
                                </button>
                        </div>
                            </div>
                    </div>

                    {/* Product Info Column - Right */}
                    <div className="flex flex-col gap-6 md:gap-8" style={{ fontFamily: serifTheme.fontFamily.serif }}>
                        
                        {/* Category and Title Section */}
                        <div className="flex flex-col gap-4">
                            {/* Category Badge */}
                            <div>
                                <SerifBadge
                                    variant="primary"
                                    size="large"
                                    className="uppercase tracking-wide"
                                >
                                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                                {product.category}
                                </SerifBadge>
                            </div>

                            {/* Product Title */}
                            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${serifTheme.gradients.accent} leading-tight tracking-tight`}>
                            {product.title}
                            </h1>
                        </div>

                        {/* Price and Stock Section */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-4">
                            {/* Price Section */}
                                    <div className="flex flex-col gap-2">
                                        {product.oldPrice && (
                                    <span className={`text-lg ${serifTheme.colors.text.tertiary} line-through font-medium`}>
                                                NPR {product.oldPrice}
                                    </span>
                                )}
                                <div className="flex items-baseline gap-3">
                                    <span className={`text-4xl md:text-5xl font-black ${serifTheme.gradients.accent}`}>
                                                NPR {product.price}
                                            </span>
                                    <span className={`text-sm ${serifTheme.colors.text.tertiary} font-medium`}>Best Price</span>
                                    {product.oldPrice && (
                                        <SerifBadge variant="danger" size="small">
                                            {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                                        </SerifBadge>
                                    )}
                                </div>
                                    </div>
                                    
                                        {/* Stock Status */}
                            <div className="min-w-[180px]">
                                <div className={`text-xs ${serifTheme.colors.text.tertiary} mb-2 font-medium`}>Stock Status</div>
                                            <div className={clsx(
                                    "text-base font-semibold mb-1",
                                    product.quantity > 0 ? 'text-green-600' : 'text-red-600'
                                            )}>
                                                {product.quantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                                            </div>
                                            {product.quantity > 0 && (
                                    <div className={`text-xs ${serifTheme.colors.text.muted}`}>
                                                    {product.quantity} units available
                                                </div>
                                            )}
                                    </div>
                                </div>
                                
                        {/* Product Description Preview (Limited to 500 chars) */}
                        {fullDescription && (
                            <div className="py-4">
                                <h3 className={`text-xl font-bold ${serifTheme.colors.text.primary} mb-4`}>Product Details</h3>
                                <div className={`${serifTheme.colors.text.secondary} leading-relaxed text-base`}>
                                    <p className="whitespace-pre-line">{truncatedDescription}</p>
                                    </div>
                                {fullDescription.length > 500 && (
                                    <SerifButton
                                        onClick={() => {
                                            setActiveTab("description");
                                            // Scroll to description section after tab change
                                            setTimeout(() => {
                                                const descriptionSection = document.getElementById('description-reviews-section');
                                                if (descriptionSection) {
                                                    descriptionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }
                                            }, 100);
                                        }}
                                        variant="outline"
                                        size="small"
                                        className="mt-4"
                                    >
                                        Read More →
                                    </SerifButton>
                                )}
                            </div>
                        )}

                        {/* Quantity and Actions Section */}
                        <div className="py-6">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4 mb-6">
                                <label htmlFor="quantity" className={`text-base font-semibold ${serifTheme.colors.text.primary}`}>Quantity:</label>
                                <div className={`flex items-center gap-3 p-2 ${serifTheme.colors.background.tertiary} ${serifTheme.radius.button} border ${serifTheme.colors.border.secondary}`}>
                                    <SerifButton
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                        variant="secondary"
                                        size="small"
                                        icon={<FaMinus />}
                                        className="w-10 h-10"
                                    />
                                    <div className={`px-6 py-2 ${serifTheme.colors.background.card} ${serifTheme.radius.button} min-w-[60px] text-center`}>
                                        <span className={`text-xl font-bold ${serifTheme.colors.text.primary}`}>
                                            {quantity}
                                        </span>
                                </div>
                                    <SerifButton
                                    onClick={() => handleQuantityChange(1)}
                                        variant="secondary"
                                        size="small"
                                        icon={<FaPlus />}
                                        className="w-10 h-10"
                                    />
                            </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SerifButton
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (isInCart) {
                                            deleteCart(product, e);
                                        } else {
                                            addCart(product, e);
                                        }
                                    }}
                                    variant={isInCart ? "danger" : "outline"}
                                    size="large"
                                    icon={isInCart ? <FaTrash /> : <FaShoppingCart />}
                                    className={`w-full h-14 text-base font-semibold ${!isInCart ? 'bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white border-none shadow-lg' : ''}`}
                                >
                                    {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                                </SerifButton>

                                <SerifButton
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleBuyNow(product);
                                    }}
                                    variant="primary"
                                    size="large"
                                    className="w-full h-14 text-base font-semibold"
                                >
                                    Buy Now
                                </SerifButton>
                            </div>
                    </div>
                            
                </div>
                </div>
            </SerifPageWrapper>

            {/* Share Dialog */}
            <Dialog
                open={openShareDialog}
                onClose={closeShareDialog}
                PaperProps={{
                    className: `${serifTheme.gradients.card} ${serifTheme.colors.text.primary} ${serifTheme.radius.card} ${serifTheme.colors.shadow.card} border ${serifTheme.colors.border.primary} backdrop-blur-xl !max-w-lg`,
                    style: { fontFamily: serifTheme.fontFamily.serif }
                }}
            >
                <div className="p-8 relative">
                    {/* Close Button */}
                    <button
                        onClick={closeShareDialog}
                        className={`absolute top-4 right-4 p-2 ${serifTheme.colors.text.tertiary} hover:${serifTheme.colors.text.primary} hover:bg-amber-100 ${serifTheme.radius.button} ${serifTheme.transitions.default}`}
                        aria-label="Close share dialog"
                    >
                        <FaTimes size={20} />
                    </button>

                    {/* Dialog Header */}
                    <div className="text-center mb-6">
                        <div className={`w-16 h-16 ${serifTheme.gradients.button} ${serifTheme.radius.card} flex items-center justify-center mx-auto mb-4`}>
                            <FaShareAlt size={24} className="text-white" />
                        </div>
                        <h3 className={`text-2xl font-bold ${serifTheme.colors.text.primary} mb-2`}>Share this Product</h3>
                        <p className={`${serifTheme.colors.text.tertiary} text-sm`}>Share with friends and family</p>
                    </div>

                    {/* Product Preview */}
                    <div className={`flex items-center gap-4 p-4 ${serifTheme.colors.background.tertiary} ${serifTheme.radius.card} border ${serifTheme.colors.border.secondary} mb-6`}>
                        <img
                            src={product.productImageUrl}
                            alt={product.title}
                            className={`w-16 h-16 object-contain ${serifTheme.colors.background.card} ${serifTheme.radius.button}`}
                                                            onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/img/hero.png";
                                    logger.warn('Failed to load product image in share dialog: ${product.productImageUrl}');
                                }}
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className={`${serifTheme.colors.text.primary} font-semibold truncate`}>{product.title || "Product"}</h4>
                            <p className={`${serifTheme.colors.text.accent} font-bold`}>रु{product.price || "0"}</p>
                        </div>
                    </div>

                    {/* Share Link Section */}
                    <div className="space-y-4">
                        <label className={`block text-sm font-medium ${serifTheme.colors.text.secondary}`}>Product Link</label>
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value={shareLink}
                                className={`w-full px-4 py-3 pr-14 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.card} text-sm ${serifTheme.colors.text.primary} focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent ${serifTheme.transitions.default}`}
                                onClick={(e) => e.target.select()}
                            />
                            <button
                                onClick={copyToClipboard}
                                className={`absolute inset-y-0 right-0 flex items-center px-4 ${serifTheme.colors.text.accent} hover:text-amber-800 hover:bg-amber-100 rounded-r-2xl ${serifTheme.transitions.default}`}
                                aria-label="Copy link"
                            >
                                <FaCopy size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Quick Share Options */}
                    <div className="mt-6">
                        <p className={`text-sm font-medium ${serifTheme.colors.text.secondary} mb-3`}>Quick Share</p>
                        <div className="flex gap-3">
                            <SerifButton
                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this product: ${product.title || "Product"} - रु${product.price || "0"}\n${shareLink}`)}`)}
                                variant="success"
                                size="small"
                                className="flex-1"
                            >
                                📱 WhatsApp
                            </SerifButton>
                            <SerifButton
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`)}
                                variant="secondary"
                                size="small"
                                className="flex-1"
                            >
                                📘 Facebook
                            </SerifButton>
                            <SerifButton
                                onClick={() => window.open(`https://www.instagram.com/?url=${encodeURIComponent(shareLink)}`)}
                                variant="secondary"
                                size="small"
                                className="flex-1"
                            >
                                📷 Instagram
                            </SerifButton>
                        </div>
                    </div>

                </div>
            </Dialog>

            {/* Description and Reviews Tabs Section */}
            <div id="description-reviews-section" className="max-w-7xl mx-auto mt-16 lg:mt-24 px-4 md:px-8 pb-20" style={{ fontFamily: serifTheme.fontFamily.serif }}>
                {/* Tabs Navigation */}
                <div className={`flex gap-2 mb-6 border-b ${serifTheme.colors.border.primary}`}>
                    <button
                        type="button"
                        onClick={() => setActiveTab("description")}
                        className={clsx(
                            "px-6 py-3 text-base font-semibold border-b-2 transition-all",
                            activeTab === "description"
                                ? `${serifTheme.colors.text.accent} border-amber-600 bg-amber-50/50`
                                : `${serifTheme.colors.text.tertiary} border-transparent hover:text-amber-800 hover:border-amber-300`
                        )}
                    >
                        Description
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("reviews")}
                        className={clsx(
                            "px-6 py-3 text-base font-semibold border-b-2 transition-all",
                            activeTab === "reviews"
                                ? `${serifTheme.colors.text.accent} border-amber-600 bg-amber-50/50`
                                : `${serifTheme.colors.text.tertiary} border-transparent hover:text-amber-800 hover:border-amber-300`
                        )}
                    >
                        Reviews
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "description" ? (
                    <div className={`${serifTheme.radius.card} ${serifTheme.gradients.card} p-6 border ${serifTheme.colors.border.primary}`}>
                        <h3 className={`text-xl font-bold ${serifTheme.colors.text.primary} mb-4`}>Product Details</h3>
                        <div className={`${serifTheme.colors.text.secondary} leading-relaxed text-base`}>
                            <p className="whitespace-pre-line">{fullDescription}</p>
                        </div>
                    </div>
                ) : (
                    <div className={`${serifTheme.radius.card} ${serifTheme.gradients.card} p-1 border ${serifTheme.colors.border.primary}`}>
                    <ProductReviews 
                        productId={product?.id} 
                        productTitle={product?.title}
                        showReviewForm={true}
                    />
                </div>
                )}
            </div>

            {/* Related Products */}
            <RelatedProducts currentProduct={product} allProducts={context.getAllProduct} />

            {/* AI Chat with Product Context - DISABLED */}
            {/* <AIChat productContext={product} /> */}

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
            
            {/* Login Popup */}
            <LoginPopup
                isOpen={showLoginPopup}
                onClose={closeLoginPopup}
                productTitle={pendingProduct?.title || product?.title || "this item"}
            />
        </Layout>
    );
};

export default ProductInfo;
