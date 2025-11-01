import React from "react";
import { motion } from "framer-motion";
import { serifTheme } from "../themes/serifTheme";

/**
 * Serif-Themed Button Component
 * A reusable button component with the warm serif-friendly theme
 */
const SerifButton = ({
  children,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}) => {
  const sizeClasses = {
    small: "px-4 py-2 text-xs",
    medium: "px-6 py-3 text-sm",
    large: "px-8 py-4 text-base",
  };

  const variantClasses = {
    primary: `${serifTheme.colors.button.primary} ${serifTheme.colors.button.textPrimary} ${serifTheme.colors.shadow.button}`,
    secondary: `${serifTheme.colors.button.secondary} ${serifTheme.colors.border.primary} ${serifTheme.colors.button.text}`,
    danger: `${serifTheme.colors.button.danger} ${serifTheme.colors.button.textPrimary} ${serifTheme.colors.shadow.button}`,
    success: `${serifTheme.colors.button.success} ${serifTheme.colors.button.textPrimary} ${serifTheme.colors.shadow.button}`,
    outline: `bg-transparent border-2 ${serifTheme.colors.border.secondary} ${serifTheme.colors.text.primary} hover:${serifTheme.colors.button.secondary}`,
    ghost: `bg-transparent ${serifTheme.colors.text.secondary} hover:${serifTheme.colors.text.accent} hover:bg-amber-50`,
  };

  const baseClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${serifTheme.radius.button}
    ${serifTheme.transitions.default}
    font-bold
    flex items-center justify-center gap-2.5
    ${fullWidth ? "w-full" : ""}
    ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-amber-50
    ${className}
  `;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {/* Button Background Effect for primary variant */}
      {variant === "primary" && !disabled && !loading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {icon && iconPosition === "left" && !loading && <span>{icon}</span>}
        {children}
        {icon && iconPosition === "right" && !loading && <span>{icon}</span>}
      </span>
    </motion.button>
  );
};

export default SerifButton;

