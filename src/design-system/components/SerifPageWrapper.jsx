import React from "react";
import { motion } from "framer-motion";
import { serifTheme } from "../themes/serifTheme";

/**
 * Serif-Themed Page Wrapper Component
 * Wraps pages with the warm serif-friendly theme, background, and styling
 */
const SerifPageWrapper = ({
  children,
  className = "",
  showBackgroundElements = true,
  containerClassName = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={`
        ${serifTheme.spacing.sectionPadding}
        ${serifTheme.colors.background.primary}
        min-h-screen 
        ${serifTheme.colors.text.primary}
        relative overflow-hidden
        ${className}
      `}
      style={{ fontFamily: serifTheme.fontFamily.serif }}
    >
      {/* Background Elements */}
      {showBackgroundElements && (
        <div className="absolute inset-0">
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 ${serifTheme.gradients.background}`}></div>

          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,69,19,0.15)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          </div>

          {/* Floating Orbs - Warm Tones */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-200/30 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
      )}

      {/* Content Container */}
      <div className={`
        container mx-auto 
        ${serifTheme.spacing.containerPadding} 
        relative z-10
        ${containerClassName}
      `}>
        {children}
      </div>
    </motion.div>
  );
};

export default SerifPageWrapper;
