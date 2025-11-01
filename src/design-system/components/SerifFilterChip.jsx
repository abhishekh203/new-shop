import React from "react";
import { motion } from "framer-motion";
import { serifTheme } from "../themes/serifTheme";

/**
 * Serif-Themed Filter Chip Component
 * A reusable filter chip component with the warm serif-friendly theme
 */
const SerifFilterChip = ({
  label,
  isActive = false,
  icon,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        px-5 py-2.5 
        ${serifTheme.radius.button}
        text-sm font-semibold 
        border 
        ${serifTheme.transitions.default}
        ${
          isActive
            ? `${serifTheme.colors.accent.primary} text-white border-amber-500/0 ${serifTheme.colors.shadow.button}`
            : `${serifTheme.colors.background.card} ${serifTheme.colors.text.secondary} ${serifTheme.colors.border.primary} hover:${serifTheme.colors.button.secondary} hover:${serifTheme.colors.border.hover} hover:${serifTheme.colors.text.accentHover} hover:shadow-md`
        }
        ${className}
      `}
      {...props}
    >
      <span className="flex items-center gap-2 capitalize">
        {icon && <span>{icon}</span>}
        {label}
      </span>
    </motion.button>
  );
};

export default SerifFilterChip;

