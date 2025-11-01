import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import myContext from "../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, deleteFromCart } from "../redux/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { createProductUrl } from "../utils/slugUtils";
import { 
  FiShoppingCart, 
  FiTrash2,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiSearch  // Added missing import
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const Nepal = () => {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { getAllProduct } = context;
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const toggleDescription = (id) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart", {
            position: "bottom-right",
            style: {
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))',
                color: '#ffffff',
                border: '1px solid rgba(34, 197, 94, 0.5)',
                borderRadius: '16px',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)',
                fontSize: '14px',
                fontWeight: '600'
            },
            iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff'
            },
            duration: 3000
        });
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Removed from cart", {
            position: "bottom-right",
            style: {
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))',
                color: '#ffffff',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '16px',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)',
                fontSize: '14px',
                fontWeight: '600'
            },
            iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff'
            },
            duration: 3000
        });
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const filteredProducts = getAllProduct.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Modern Background Effects */}
            <div className="absolute inset-0">
                {/* Gradient Mesh Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black"></div>
                
                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                </div>
                
                {/* Modern Floating Elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            <div className="relative z-10 px-3 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                {/* Mobile-Optimized Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto"
                >
                    {/* Mobile-Optimized Badge */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-green-500/30 rounded-full text-green-400 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-2xl"
                    >
                        <div className="relative">
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full animate-ping absolute"></div>
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <span className="hidden sm:inline">Premium Digital Marketplace</span>
                        <span className="sm:hidden">Premium Store</span>
                        <div className="relative">
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-emerald-400 rounded-full animate-ping absolute"></div>
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-emerald-400 rounded-full"></div>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight sm:leading-none"
                    >
                        Available{" "}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                                Subscriptions
                            </span>
            <motion.div 
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1, delay: 1 }}
                                className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                            />
                        </span>
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-2"
                    >
                        Discover premium digital subscriptions at{" "}
                        <span className="text-green-400 font-semibold">unbeatable prices</span>.
                        <span className="hidden sm:inline"> Add any subscription to your cart to proceed with purchase.</span>
                    </motion.p>
            </motion.div>

                {/* Mobile-Optimized Search Section */}
            <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mb-12 sm:mb-16 lg:mb-20 max-w-2xl mx-auto px-2"
                >
                    <div className="relative group">
                        {/* Search Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/50 via-emerald-500/50 to-teal-500/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500"></div>
                        
                        <div className="relative bg-gray-900/80 backdrop-blur-2xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
                            <div className="flex items-center p-2 sm:p-2">
                                <div className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 text-green-400">
                                    <FiSearch className="w-4 sm:w-5 h-4 sm:h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search subscriptions..."
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 text-base sm:text-lg px-2 sm:px-4 py-3 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                                {searchTerm && (
                                    <motion.button
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        onClick={() => setSearchTerm("")}
                                        className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 mr-1 sm:mr-2"
                                    >
                                        <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </motion.button>
                                )}
                            </div>
                        </div>
                </div>
                    
                    {/* Search Results Counter */}
                    <AnimatePresence>
                        {searchTerm && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-4 text-center"
                            >
                                <p className="text-gray-400 text-sm">
                                    Found <span className="text-green-400 font-semibold">{filteredProducts.length}</span> results
                                    {searchTerm && (
                                        <> for "<span className="text-white font-medium">{searchTerm}</span>"</>
                                    )}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
            </motion.div>
            </div>

            {/* Mobile-Optimized Products Grid */}
            <div className="relative z-10 px-3 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
                    <AnimatePresence mode="popLayout">
                    {filteredProducts.map((item, index) => {
                        const { id, title, price, productImageUrl, description } = item;
                        const isInCart = cartItems.some(p => p.id === id);
                        const isExpanded = expandedDescriptions[id];

                        return (
                            <motion.div
                                key={id}
                                    layout
                                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                                    transition={{ 
                                        duration: 0.6, 
                                        delay: index * 0.1,
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 15
                                    }}
                                    whileHover={{ 
                                        y: -12,
                                        transition: { duration: 0.3, type: "spring", stiffness: 300 }
                                    }}
                                    className="group relative"
                                >
                                    {/* Card Glow Effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    
                                    <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-gray-700/30 shadow-2xl overflow-hidden">
                                        {/* Mobile-Optimized Card Layout */}
                                <div className="flex flex-col lg:flex-row h-full">
                                            {/* Mobile-Optimized Image Section */}
                                            <div className="lg:w-1/2 relative overflow-hidden group/image">
                                                {/* Clickable Image Container */}
                                                <div 
                                            onClick={() => navigate(createProductUrl({ id, title }))}
                                                    className="relative w-full h-48 sm:h-56 md:h-64 lg:h-full cursor-pointer"
                                                >
                                                    {/* Image Overlay Effects */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10"></div>
                                                    
                                                    <motion.img
                                                        whileHover={{ scale: 1.05 }}
                                                        transition={{ duration: 0.4 }}
                                                        className="w-full h-full object-cover"
                                            src={productImageUrl}
                                            alt={title}
                                        />
                                                    
                                                    {/* Premium Badge */}
                                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xl z-30">
                                                        PREMIUM
                                                    </div>
                                                    
                                                    {/* Enhanced Click Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-6 z-20">
                                                        {/* View Details Button */}
                                                        <div className="flex justify-end">
                                                            <motion.div
                                                                initial={{ scale: 0, opacity: 0 }}
                                                                whileHover={{ scale: 1.1 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                transition={{ delay: 0.2 }}
                                                                className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl border border-green-400/50"
                                                            >
                                                                View Details
                                                            </motion.div>
                                            </div>
                                                        
                                                        {/* Bottom Info */}
                                                        <div className="flex items-center text-white font-medium">
                                                            <FiInfo className="mr-2 text-green-400" />
                                                            <span>Click anywhere to view full details</span>
                                        </div>
                                    </div>
                                                </div>
                                            </div>

                                            {/* Mobile-Optimized Content Section */}
                                            <div className="lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
                                                <div className="space-y-4 sm:space-y-6">
                                                    {/* Mobile-Optimized Header */}
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-green-500/30">
                                                            <span className="text-green-400 text-xs font-bold">Digital Shop Nepal</span>
                                                        </div>
                                                        <div className="flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-2 sm:px-3 py-1 rounded-full border border-yellow-500/30">
                                                            <FaStar className="text-yellow-400 mr-1 w-3 h-3" />
                                                            <span className="text-white text-xs sm:text-sm font-bold">4.8</span>
                                                        </div>
                                                    </div>

                                                    {/* Mobile-Optimized Title */}
                                                    <h2 
                                                        onClick={() => navigate(createProductUrl({ id, title }))}
                                                        className="text-lg sm:text-xl lg:text-2xl font-black text-white leading-tight group-hover:text-green-400 transition-colors duration-300 cursor-pointer hover:text-green-300"
                                                    >
                                                        {title}
                                                    </h2>
                                                    
                                                    {/* Mobile-Optimized Price Display */}
                                                    <div className="space-y-2 sm:space-y-3">
                                                        <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                                                            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                                                                NPR{" "}
                                                                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                                                                    {price}
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-300 text-sm sm:text-base lg:text-lg line-through font-medium opacity-70">
                                                                NPR {Math.round(price * 1.5)}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                                            <div className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-400 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold border border-green-500/50 shadow-lg">
                                                                {Math.round(((price * 1.5 - price) / (price * 1.5)) * 100)}% OFF
                                                            </div>
                                                            <span className="text-yellow-400 text-xs sm:text-sm font-semibold">Limited Time</span>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <h3 className="text-green-400 font-bold text-sm">Description</h3>
                                                            <motion.button 
                                                        onClick={() => toggleDescription(id)}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1 font-medium transition-colors"
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                                <span>Show less</span>
                                                                        <FiChevronUp className="w-4 h-4" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>Show more</span>
                                                                        <FiChevronDown className="w-4 h-4" />
                                                            </>
                                                        )}
                                                            </motion.button>
                                                        </div>
                                                        <motion.div 
                                                            animate={{ height: isExpanded ? "auto" : "4rem" }}
                                                            transition={{ duration: 0.3 }}
                                                            className="text-gray-300 leading-relaxed overflow-hidden"
                                                        >
                                                            {description || "Premium digital subscription with instant delivery and 24/7 support. Experience the best in digital entertainment and productivity."}
                                                        </motion.div>
                                                </div>
                                                </div>

                                                {/* Mobile-Optimized Action Buttons */}
                                                <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
                                                    {/* View Details Button */}
                                                    <motion.button
                                                        onClick={() => navigate(createProductUrl({ id, title }))}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-400 hover:text-blue-300 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 text-sm sm:text-base"
                                                    >
                                                        <FiInfo className="w-3 sm:w-4 h-3 sm:h-4" />
                                                        <span>View Full Details</span>
                                                    </motion.button>

                                                    {/* Add to Cart Button */}
                                                    {isInCart ? (
                                                        <motion.button
                                                            onClick={() => deleteCart(item)}
                                                            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)" }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-xl relative overflow-hidden text-sm sm:text-base"
                                                        >
                                                            <FiTrash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                                                            <span>Remove from Cart</span>
                                                        </motion.button>
                                                    ) : (
                                                        <motion.button
                                                            onClick={() => addCart(item)}
                                                            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)" }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-xl relative overflow-hidden group/btn text-sm sm:text-base"
                                                        >
                                                            {/* Button Shimmer Effect */}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                                            <FiShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 relative z-10" />
                                                            <span className="relative z-10">Add to Cart</span>
                                                        </motion.button>
                                                    )}
                                                </div>
                                    </div>
                                        </div>

                                        {/* Decorative Elements */}
                                        <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                </div>
            </div>

            {/* Mobile-Optimized Empty State */}
            {filteredProducts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 px-3 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20"
                >
                    <div className="max-w-lg mx-auto text-center">
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-2xl opacity-50"></div>
                            
                            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-gray-700/30 shadow-2xl p-6 sm:p-8 lg:p-12">
                                {/* Animated Icon */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="text-green-400/60 text-5xl sm:text-6xl lg:text-8xl mb-6 sm:mb-8 inline-block"
                                >
                                    <FiSearch />
                                </motion.div>

                                {/* Content */}
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-3 sm:mb-4">No Results Found</h3>
                                <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg px-2">
                                    {searchTerm ? (
                                        <>
                                            We couldn't find any subscriptions matching{" "}
                                            <span className="text-green-400 font-semibold">"{searchTerm}"</span>.
                                            <br className="hidden sm:block" />
                                            <span className="sm:hidden"> </span>Try a different search term or browse all services.
                                        </>
                                    ) : (
                                        "No subscriptions available at the moment. Please check back later."
                                    )}
                                </p>

                                {/* Actions */}
                                {searchTerm && (
                                    <div className="flex flex-col gap-3 sm:gap-4 justify-center">
                                        <motion.button
                                            onClick={() => setSearchTerm("")}
                                            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)" }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-xl text-sm sm:text-base"
                                        >
                                            Clear Search
                                        </motion.button>
                                        <motion.button
                                            onClick={() => navigate('/subscription')}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-xl text-sm sm:text-base"
                                        >
                                            Browse All
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Nepal;