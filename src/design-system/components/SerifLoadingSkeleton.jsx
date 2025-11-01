import React from "react";
import { motion } from "framer-motion";
import { serifTheme } from "../themes/serifTheme";

/**
 * Serif-Themed Loading Skeleton Component
 * A reusable loading skeleton for product cards with the warm serif-friendly theme
 */
const SerifLoadingSkeleton = ({ 
  count = 1, 
  variant = "productCard", 
  className = "" 
}) => {
  const ProductCardSkeleton = ({ index }) => (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`
        relative group 
        ${serifTheme.gradients.card}
        border ${serifTheme.colors.border.primary}
        ${serifTheme.radius.card}
        overflow-hidden 
        ${serifTheme.colors.shadow.card}
        h-[420px]
        ${className}
      `}
    >
      {/* Enhanced Shimmer Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-amber-300/20 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      </div>

      {/* Image Placeholder with Gradient */}
      <div className="h-60 w-full bg-gradient-to-br from-amber-100/50 to-orange-100/50 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-200/30 to-transparent"></div>
        {/* Floating Elements */}
        <div className="absolute top-4 left-4 w-16 h-6 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-full"></div>
      </div>

      {/* Content Placeholder */}
      <div className={`${serifTheme.spacing.cardPadding} space-y-4`}>
        {/* Category & Badge Row */}
        <div className="flex justify-between items-center">
          <div className="h-3 w-20 bg-gradient-to-r from-amber-200/50 to-orange-200/50 rounded-full"></div>
          <div className="h-5 w-12 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-full"></div>
        </div>

        {/* Title Lines */}
        <div className="space-y-2">
          <div className="h-5 w-4/5 bg-gradient-to-r from-amber-200/50 to-orange-200/50 rounded-lg"></div>
          <div className="h-5 w-3/5 bg-gradient-to-r from-amber-200/50 to-orange-200/50 rounded-lg"></div>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Price & Button Row */}
        <div className="flex justify-between items-center pt-4">
          <div className="h-7 w-24 bg-gradient-to-r from-amber-600/30 to-orange-600/30 rounded-lg"></div>
          <div className="h-10 w-28 bg-gradient-to-r from-amber-600/30 to-orange-600/30 rounded-xl"></div>
        </div>
      </div>
    </motion.div>
  );

  if (variant === "productCard") {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} index={index} />
        ))}
      </>
    );
  }

  // Default generic skeleton
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={`skeleton-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
          className={`
            ${serifTheme.gradients.card}
            border ${serifTheme.colors.border.primary}
            ${serifTheme.radius.card}
            ${serifTheme.colors.shadow.card}
            ${className}
          `}
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-amber-300/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>
          <div className="h-32 bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-lg"></div>
        </motion.div>
      ))}
    </>
  );
};

export default SerifLoadingSkeleton;

