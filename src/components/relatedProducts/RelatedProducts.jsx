import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, deleteFromCart } from '../../redux/cartSlice';
import toast from 'react-hot-toast';
import { 
    FaHeart, 
    FaRegHeart, 
    FaShoppingCart, 
    FaTimes, 
    FaEye,
    FaStar,
    FaArrowLeft,
    FaArrowRight
} from 'react-icons/fa';

const RelatedProducts = ({ currentProduct, allProducts, maxItems = 8 }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    const user = JSON.parse(localStorage.getItem('users'));
    
    const [currentSlide, setCurrentSlide] = useState(0);
    const [favorites, setFavorites] = useState(new Set());

    // Load favorites from localStorage
    useEffect(() => {
        if (user?.uid) {
            const savedFavorites = localStorage.getItem(`favorites_${user.uid}`);
            if (savedFavorites) {
                try {
                    const favoritesArray = JSON.parse(savedFavorites);
                    setFavorites(new Set(favoritesArray));
                } catch (e) {
                    console.error("Failed to parse favorites from localStorage");
                }
            }
        }
    }, [user?.uid]);

    // Get related products based on category, excluding current product
    const relatedProducts = useMemo(() => {
        if (!currentProduct || !allProducts) return [];
        
        return allProducts
            .filter(product => 
                product.id !== currentProduct.id && 
                product.category === currentProduct.category
            )
            .slice(0, maxItems);
    }, [currentProduct, allProducts, maxItems]);

    // Carousel navigation
    const itemsPerView = 4; // Show 4 items at a time on desktop
    const maxSlides = Math.max(0, Math.ceil(relatedProducts.length / itemsPerView) - 1);

    const nextSlide = () => {
        setCurrentSlide(prev => (prev >= maxSlides ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev <= 0 ? maxSlides : prev - 1));
    };

    // Handle cart actions
    const handleAddToCart = (product) => {
        dispatch(addToCart({ ...product, quantity: 1 }));
        toast.success(`Added ${product.title} to cart`);
    };

    const handleRemoveFromCart = (product) => {
        dispatch(deleteFromCart(product));
        toast.success(`Removed ${product.title} from cart`);
    };

    // Handle favorites
    const toggleFavorite = (productId) => {
        if (!user?.uid) {
            toast.error("Please log in to save items to your wishlist");
            return;
        }

        const newFavorites = new Set(favorites);
        if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
            toast.success("Removed from favorites");
        } else {
            newFavorites.add(productId);
            toast.success("Added to favorites");
        }
        
        setFavorites(newFavorites);
        localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(Array.from(newFavorites)));
    };

    const isInCart = (productId) => {
        return cartItems.some(item => item.id === productId);
    };

    const formatPrice = (price) => {
        return `रु${Number(price || 0).toLocaleString()}`;
    };

    if (!relatedProducts.length) {
        return null;
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 md:px-8 py-12"
        >
            {/* Section Header */}
            <div className="text-center mb-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-4"
                >
                    Related Products
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-gray-400 text-lg"
                >
                    You might also like these products from the same category
                </motion.p>
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-24 h-1 bg-gradient-to-r from-teal-400 to-purple-500 mx-auto rounded-full mt-4"
                />
            </div>

            {/* Products Carousel */}
            <div className="relative">
                {/* Navigation Buttons */}
                {relatedProducts.length > itemsPerView && (
                    <>
                        <motion.button
                            onClick={prevSlide}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-lg text-white rounded-full border border-gray-600/50 hover:border-teal-400/50 transition-all duration-300 shadow-lg"
                        >
                            <FaArrowLeft size={16} />
                        </motion.button>
                        <motion.button
                            onClick={nextSlide}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-lg text-white rounded-full border border-gray-600/50 hover:border-teal-400/50 transition-all duration-300 shadow-lg"
                        >
                            <FaArrowRight size={16} />
                        </motion.button>
                    </>
                )}

                {/* Products Grid */}
                <div className="overflow-hidden px-12">
                    <motion.div
                        animate={{ x: `-${currentSlide * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex gap-6"
                        style={{ width: `${Math.ceil(relatedProducts.length / itemsPerView) * 100}%` }}
                    >
                        {relatedProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex-shrink-0 w-1/4 group cursor-pointer"
                                onClick={() => navigate(`/productinfo/${product.id}`)}
                            >
                                <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/70 border border-gray-700/30 rounded-2xl overflow-hidden hover:border-teal-400/50 transition-all duration-300 hover:-translate-y-2">
                                    {/* Product Image */}
                                    <div className="relative aspect-square overflow-hidden">
                                        <motion.img
                                            src={product.productImageUrl}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            whileHover={{ scale: 1.1 }}
                                        />
                                        
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        
                                        {/* Action Buttons */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <motion.button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(product.id);
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
                                                    favorites.has(product.id)
                                                        ? 'bg-red-500/20 border-red-400/50 text-red-400'
                                                        : 'bg-gray-800/60 border-gray-600/50 text-gray-300 hover:text-red-400'
                                                }`}
                                            >
                                                {favorites.has(product.id) ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                                            </motion.button>
                                            
                                            <motion.button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/productinfo/${product.id}`);
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 rounded-full bg-gray-800/60 backdrop-blur-md border border-gray-600/50 text-gray-300 hover:text-teal-400 transition-all duration-200"
                                            >
                                                <FaEye size={12} />
                                            </motion.button>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3 className="text-sm font-bold text-gray-100 group-hover:text-white transition-colors line-clamp-2 mb-2">
                                            {product.title}
                                        </h3>
                                        
                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-2">
                                            <FaStar className="text-yellow-400" size={12} />
                                            <span className="text-yellow-200 font-semibold text-xs">4.5</span>
                                        </div>

                                        {/* Price */}
                                        <div className="mb-3">
                                            <p className="text-lg font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                                {formatPrice(product.price)}
                                            </p>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <motion.button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isInCart(product.id)) {
                                                    handleRemoveFromCart(product);
                                                } else {
                                                    handleAddToCart(product);
                                                }
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                                                isInCart(product.id)
                                                    ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/40"
                                                    : "bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white"
                                            }`}
                                        >
                                            {isInCart(product.id) ? (
                                                <><FaTimes size={12} />Remove</>
                                            ) : (
                                                <><FaShoppingCart size={12} />Add to Cart</>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Dots Indicator */}
                {relatedProducts.length > itemsPerView && (
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: maxSlides + 1 }).map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                whileHover={{ scale: 1.2 }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    currentSlide === index
                                        ? 'bg-teal-400 w-6'
                                        : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.section>
    );
};

export default RelatedProducts;
