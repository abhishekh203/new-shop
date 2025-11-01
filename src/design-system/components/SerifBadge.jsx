import React from "react";
import { motion } from "framer-motion";
import { serifTheme } from "../themes/serifTheme";

/**
 * Serif-Themed Badge Component
 * A reusable badge component with the warm serif-friendly theme
 */
const SerifBadge = ({
  children,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  className = "",
  onClick,
  ...props
}) => {
  const sizeClasses = {
    small: "text-[10px] px-2 py-0.5",
    medium: "text-[10px] px-3 py-1.5",
    large: "text-xs px-4 py-2",
  };

  const variantClasses = {
    primary: `${serifTheme.colors.accent.primary} text-white`,
    secondary: `${serifTheme.colors.accent.secondary} text-white`,
    success: "bg-gradient-to-r from-green-600 to-emerald-600 text-white",
    warning: "bg-gradient-to-r from-yellow-500 to-amber-500 text-white",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
    info: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
    outline: `bg-transparent border ${serifTheme.colors.border.secondary} ${serifTheme.colors.text.secondary}`,
  };

  const Component = onClick ? motion.button : motion.span;

  return (
    <Component
      onClick={onClick}
      className={`
        inline-flex items-center gap-1
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${serifTheme.radius.badge}
        font-bold
        uppercase tracking-wider
        ${serifTheme.colors.shadow.button}
        backdrop-blur-sm
        ${onClick ? "cursor-pointer hover:scale-105" : ""}
        ${serifTheme.transitions.default}
        ${className}
      `}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      {...props}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </Component>
  );
};

export default SerifBadge;

