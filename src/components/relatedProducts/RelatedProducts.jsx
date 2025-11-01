import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, deleteFromCart } from '../../redux/cartSlice';
import { useNotification } from '../../context/NotificationContext';
import { createProductUrl } from '../../utils/slugUtils';
import { serifTheme } from '../../design-system/themes/serifTheme';
import { SerifButton, SerifBadge } from '../../design-system/components';
import { 
    FaHeart, 
    FaRegHeart, 
    FaShoppingCart, 
    FaTimes, 
    FaEye,
    FaCheck,
    FaTag,
    FaFire
} from 'react-icons/fa';

const RelatedProducts = ({ currentProduct, allProducts, maxItems = 8 }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    const user = JSON.parse(localStorage.getItem('users'));
    const notification = useNotification();
    
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

    // Handle cart actions
    const handleAddToCart = (product) => {
        dispatch(addToCart({ ...product, quantity: 1 }));
        notification.success(`Added ${product.title} to cart`, {
            icon: <FaShoppingCart />
        });
    };

    const handleRemoveFromCart = (product) => {
        dispatch(deleteFromCart(product));
        notification.success(`Removed ${product.title} from cart`, {
            icon: <FaTimes />
        });
    };

    // Handle favorites
    const toggleFavorite = (productId) => {
        if (!user?.uid) {
            notification.error("Please log in to save items to your wishlist");
            return;
        }

        const newFavorites = new Set(favorites);
        if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
            notification.success("Removed from favorites", {
                icon: <FaRegHeart />
            });
        } else {
            newFavorites.add(productId);
            notification.success("Added to favorites", {
                icon: <FaHeart />
            });
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
        <section 
            className="max-w-7xl mx-auto px-4 md:px-8 py-12"
            style={{ fontFamily: serifTheme.fontFamily.serif }}
        >
            {/* Section Header */}
            <div className="text-center mb-10">
                <h2 className={`text-3xl md:text-4xl font-bold ${serifTheme.gradients.accent} mb-4`}>
                    Related Products
                </h2>
                <p className={`${serifTheme.colors.text.tertiary} text-lg`}>
                    You might also like these products from the same category
                </p>
                <div className={`w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full mt-4`} />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {relatedProducts.map((product, index) => (
                    <div
                        key={product.id}
                        className={`group cursor-pointer ${serifTheme.transitions.default}`}
                        onClick={() => navigate(createProductUrl(product))}
                    >
                        <div className={`relative ${serifTheme.gradients.card} border ${serifTheme.colors.border.primary} ${serifTheme.radius.card} overflow-hidden hover:border-amber-400/60 ${serifTheme.transitions.default} hover:-translate-y-1 ${serifTheme.colors.shadow.card} hover:shadow-lg backdrop-blur-sm`}>
                            {/* Product Image */}
                            <div className={`relative aspect-square overflow-hidden ${serifTheme.radius.card}`}>
                                <img
                                    src={product.productImageUrl}
                                    alt={product.title}
                                    className={`w-full h-full object-cover ${serifTheme.transitions.default} group-hover:scale-105 group-hover:brightness-110`}
                                />
                                
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                                
                                {/* Action Buttons */}
                                <div className={`absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 ${serifTheme.transitions.default} transform translate-x-2 group-hover:translate-x-0`}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(product.id);
                                        }}
                                        className={`p-2 ${serifTheme.radius.button} backdrop-blur-xl border-2 ${serifTheme.transitions.default} ${serifTheme.colors.shadow.button} ${
                                            favorites.has(product.id)
                                                ? 'bg-red-500/30 border-red-400/60 text-red-300'
                                                : `${serifTheme.colors.button.secondary} ${serifTheme.colors.border.secondary} ${serifTheme.colors.text.primary} hover:text-red-400 hover:bg-red-500/20 hover:border-red-400/40`
                                        }`}
                                    >
                                        {favorites.has(product.id) ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                                    </button>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(createProductUrl(product));
                                        }}
                                        className={`p-2 ${serifTheme.radius.button} ${serifTheme.colors.button.secondary} backdrop-blur-xl border-2 ${serifTheme.colors.border.secondary} ${serifTheme.colors.text.primary} hover:text-amber-600 hover:bg-amber-500/20 hover:border-amber-400/40 ${serifTheme.transitions.default} ${serifTheme.colors.shadow.button}`}
                                    >
                                        <FaEye size={12} />
                                    </button>
                                </div>

                                {/* Category Badge */}
                                <div className="absolute top-2 left-2">
                                    <SerifBadge variant="primary" size="small">
                                        <FaTag size={8} className="mr-1" />
                                        <span className="text-xs">{product.category}</span>
                                    </SerifBadge>
                                </div>

                                {/* Hot/Popular Badge */}
                                {index < 2 && (
                                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                                        <SerifBadge variant="danger" size="small">
                                            <FaFire size={8} className="mr-1" />
                                            HOT
                                        </SerifBadge>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-3 space-y-2">
                                <h3 className={`text-xs sm:text-sm font-bold ${serifTheme.colors.text.primary} group-hover:text-amber-800 ${serifTheme.transitions.default} line-clamp-2 leading-tight`}>
                                    {product.title}
                                </h3>

                                {/* Price Section */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm md:text-base font-bold ${serifTheme.gradients.accent}`}>
                                            {formatPrice(product.price)}
                                        </p>
                                        {product.oldPrice && (
                                            <p className={`text-xs ${serifTheme.colors.text.tertiary} line-through`}>
                                                {formatPrice(product.oldPrice)}
                                            </p>
                                        )}
                                    </div>
                                    {product.oldPrice && (
                                        <div className="text-right">
                                            <SerifBadge variant="success" size="small">
                                                <span className="text-xs">{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF</span>
                                            </SerifBadge>
                                        </div>
                                    )}
                                </div>

                                {/* Add to Cart Button */}
                                <SerifButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isInCart(product.id)) {
                                            handleRemoveFromCart(product);
                                        } else {
                                            handleAddToCart(product);
                                        }
                                    }}
                                    variant={isInCart(product.id) ? "danger" : "primary"}
                                    size="small"
                                    fullWidth
                                    icon={isInCart(product.id) ? <FaCheck /> : <FaShoppingCart />}
                                    className="text-xs"
                                >
                                    {isInCart(product.id) ? "In Cart" : "Add to Cart"}
                                </SerifButton>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts;
