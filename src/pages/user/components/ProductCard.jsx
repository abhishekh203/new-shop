import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { serifTheme } from '../../../design-system/themes';

/**
 * Enhanced Product Card Component
 * Displays product information with add to cart functionality
 */
const ProductCard = ({ item, onAddToCart }) => {
    const rating = 4; // Static rating for example
    
    return (
        <div 
            className={`${serifTheme.colors.background.card} ${serifTheme.radius.card} overflow-hidden border ${serifTheme.colors.border.primary} ${serifTheme.colors.shadow.cardHover} ${serifTheme.transitions.default} relative`}
            style={{ fontFamily: serifTheme.fontFamily.serif }}
        >
            <div className="relative z-10">
                <div className="relative">
                    <img
                        src={item.productImageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/300/f3f4f6/6b7280?text=No+Image";
                        }}
                    />
                    {item.category && (
                        <div className="absolute bottom-3 left-3">
                            <span className={`${serifTheme.colors.accent.secondary} text-white text-xs font-medium px-3 py-1 ${serifTheme.radius.badge} border ${serifTheme.colors.border.accent} capitalize`}>
                                {item.category}
                            </span>
                        </div>
                    )}
                </div>
                <div className={`${serifTheme.spacing.cardPadding}`}>
                    <h3 className={`font-bold ${serifTheme.colors.text.primary} mb-2 line-clamp-1`} title={item.title}>
                        {item.title}
                    </h3>
                    <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                            i < rating ? (
                                <FaStar key={i} className="w-4 h-4 text-yellow-500" />
                            ) : (
                                <FaRegStar key={i} className={`w-4 h-4 ${serifTheme.colors.text.muted}`} />
                            )
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={`text-xl font-bold ${serifTheme.colors.text.primary}`}>
                            रु {Number(item.price).toFixed(2)}
                        </span>
                        <button
                            onClick={() => onAddToCart(item)}
                            className={`px-4 py-2 ${serifTheme.colors.button.primary} ${serifTheme.colors.button.textPrimary} text-sm font-medium ${serifTheme.radius.button} ${serifTheme.transitions.default} shadow-lg`}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

