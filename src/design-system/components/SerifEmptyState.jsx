import React from "react";
import { motion } from "framer-motion";
import { serifTheme } from "../themes/serifTheme";
import SerifButton from "./SerifButton";

/**
 * Serif-Themed Empty State Component
 * A reusable empty state component with the warm serif-friendly theme
 */
const SerifEmptyState = ({
  icon: Icon,
  title = "No items found",
  description = "We couldn't find any items matching your criteria.",
  actions = [],
  className = "",
  iconSize = 64,
  iconColor = "text-amber-600",
}) => {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`
        text-center py-24 px-8 
        ${serifTheme.gradients.card}
        border border-dashed ${serifTheme.colors.border.primary}
        ${serifTheme.radius.card}
        flex flex-col items-center justify-center min-h-[400px] 
        backdrop-blur-sm
        ${className}
      `}
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-xl"></div>
        <div
          className={`
            relative 
            ${serifTheme.gradients.card}
            p-6 
            ${serifTheme.radius.badge}
            border ${serifTheme.colors.border.primary}
          `}
        >
          {Icon && (
            <Icon
              size={iconSize}
              className={iconColor}
              strokeWidth={1}
            />
          )}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
        className="space-y-4 mb-8"
      >
        <h3 className={`text-2xl font-bold ${serifTheme.colors.text.primary}`}>
          {title}
        </h3>
        <p className={`text-lg ${serifTheme.colors.text.tertiary} max-w-md mx-auto leading-relaxed`}>
          {description}
        </p>
      </motion.div>

      {/* Action Buttons */}
      {actions.length > 0 && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {actions.map((action, index) => (
            <SerifButton
              key={index}
              variant={action.variant || "primary"}
              size={action.size || "large"}
              icon={action.icon}
              iconPosition={action.iconPosition || "left"}
              onClick={action.onClick}
              disabled={action.disabled}
              fullWidth={false}
            >
              {action.label}
            </SerifButton>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SerifEmptyState;

