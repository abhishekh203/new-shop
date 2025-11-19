import React from "react";
import { motion } from "framer-motion";
import { serifTheme } from "../themes/serifTheme";
import { createProductUrl } from "../../utils/slugUtils";
import { FaEye, FaShoppingCart, FaTrash } from "react-icons/fa";
import { BsStars } from "react-icons/bs";

/**
 * Serif-Themed Product Card Component
 * A reusable product card component with the warm serif-friendly theme
 */
const SerifProductCard = ({
  product,
  isInCart = false,
  onAddToCart,
  onRemoveFromCart,
  onNavigate,
  onQuickView,
  showCategory = true,
  className = "",
  index = 0,
}) => {
  const {
    id,
    title,
    price,
    productImageUrl,
    category,
    description,
  } = product || {};

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (isInCart && onRemoveFromCart) {
      onRemoveFromCart(product);
    } else if (onAddToCart) {
      onAddToCart(product);
    }
  };


  const formatPrice = (priceValue) => {
    return `रु ${Number(priceValue || 0).toLocaleString('en-IN', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.90, y: -15 }}
      transition={{ 
        duration: 0.2, 
        ease: "easeOut" 
      }}
      whileHover={{ y: -2 }}
      className={`
        relative group 
        ${serifTheme.gradients.card}
        border ${serifTheme.colors.border.primary}
        ${serifTheme.radius.card}
        overflow-hidden 
        ${serifTheme.colors.shadow.cardHover}
        ${serifTheme.transitions.default}
        hover:${serifTheme.colors.border.hover}
        flex flex-col h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px]
        cursor-pointer 
        backdrop-blur-sm
        ${className}
      `}
      onClick={() => {
        if (onNavigate && id && title) {
          onNavigate(id, title);
        }
      }}
    >
      {/* Quick View Button */}
      {onQuickView && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`
                p-1.5 sm:p-2 rounded-full 
                ${serifTheme.colors.button.secondary} 
                ${serifTheme.colors.border.secondary} 
                ${serifTheme.colors.text.secondary} 
                hover:text-blue-600 hover:bg-blue-50 
                ${serifTheme.transitions.default}
              `}
            >
              <FaEye size={12} className="sm:w-3.5 sm:h-3.5" />
            </motion.button>
        </div>
      )}

      {/* Category Badge */}
      {showCategory && category && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`
              inline-flex items-center gap-0.5 sm:gap-1 
              ${serifTheme.colors.accent.primary} 
              text-white 
              text-[8px] sm:text-[10px] font-bold 
              px-2 sm:px-3 py-1 sm:py-1.5 
              ${serifTheme.radius.badge} 
              uppercase tracking-wider 
              ${serifTheme.colors.shadow.button} 
              backdrop-blur-sm
            `}
          >
            <BsStars size={8} className="sm:w-2.5 sm:h-2.5" />
            {category || 'Digital'}
          </motion.span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-36 sm:h-44 md:h-52 lg:h-60 w-full overflow-hidden group/image">
        <motion.img
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          src={productImageUrl || '/img/placeholder.png'}
          alt={title || 'Product Image'}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/img/placeholder.png';
          }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/0 to-orange-600/0 group-hover:from-amber-600/10 group-hover:to-orange-600/10 transition-all duration-500"></div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            className="bg-white/80 backdrop-blur-md rounded-full p-3 border border-amber-300/60 shadow-lg"
          >
            <FaEye className="text-amber-700 text-lg" />
          </motion.div>
        </div>
      </div>

      {/* Product Info */}
      <div className={`p-3 sm:p-4 md:p-5 flex flex-col flex-grow`}>
        {/* Title */}
        <div className="mb-2 sm:mb-3">
          <h3 className={`
            text-xs sm:text-sm md:text-base lg:text-lg font-bold 
            ${serifTheme.colors.text.primary} 
            group-hover:${serifTheme.colors.text.accent} 
            ${serifTheme.transitions.default}
            line-clamp-2 leading-tight
          `} title={title}>
            {title || 'Untitled Product'}
          </h3>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Price Section */}
        <div className="mb-2 sm:mb-3 md:mb-4">
          <motion.p
            className={`text-sm sm:text-base md:text-lg lg:text-2xl font-bold ${serifTheme.gradients.accent}`}
            whileHover={{ scale: 1.05 }}
          >
            {formatPrice(price)}
          </motion.p>
          <p className={`text-[10px] sm:text-xs ${serifTheme.colors.text.tertiary} mt-1`}>
            Digital Product
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          className={`
            w-full py-2 sm:py-2.5 md:py-3 px-3 sm:px-4
            ${serifTheme.radius.button} 
            text-xs sm:text-sm font-bold 
            ${serifTheme.transitions.default}
            flex items-center justify-center gap-2 
            ${serifTheme.colors.shadow.button}
            relative overflow-hidden
            ${isInCart
              ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-500 border border-red-500/40 hover:from-red-500/30 hover:to-pink-500/30'
              : `${serifTheme.colors.button.primary} text-white ${serifTheme.colors.button.textPrimary}`
            }
          `}
          onClick={handleCartClick}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Button Background Effect */}
          {!isInCart && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          )}

          <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            {isInCart ? (
              <>
                <FaTrash size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>Remove</span>
              </>
            ) : (
              <>
                <FaShoppingCart size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SerifProductCard;
