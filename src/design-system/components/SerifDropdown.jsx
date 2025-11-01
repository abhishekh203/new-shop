import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { serifTheme } from "../themes/serifTheme";

/**
 * Serif-Themed Dropdown Component
 * A reusable dropdown component with the warm serif-friendly theme
 */
const SerifDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  icon,
  iconPosition = "left",
  position = "bottom", // 'top' or 'bottom'
  className = "",
  triggerClassName = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value || opt.value === value);

  const handleSelect = (option) => {
    onChange(option.id || option.value, option);
    setIsOpen(false);
  };

  return (
    <div className={`relative z-50 ${className}`} ref={dropdownRef}>
      <motion.button
        onClick={() => !disabled && setIsOpen((v) => !v)}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        className={`
          flex items-center gap-2 
          px-4 py-3 
          ${serifTheme.radius.button}
          text-sm font-medium 
          ${serifTheme.colors.background.card}
          border ${serifTheme.colors.border.primary}
          ${serifTheme.colors.text.secondary}
          hover:text-amber-800
          hover:bg-amber-100/80
          ${serifTheme.transitions.default}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${triggerClassName}
        `}
        aria-expanded={isOpen}
      >
        {icon && iconPosition === "left" && <span>{icon}</span>}
        <span>{selectedOption?.label || placeholder}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.span>
        {icon && iconPosition === "right" && <span>{icon}</span>}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: position === "top" ? 10 : -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === "top" ? 10 : -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute ${position === "top" ? "bottom-full mb-3" : "top-full mt-3"} 
              left-0 right-0
              w-full min-w-[200px]
              ${serifTheme.radius.card}
              ${serifTheme.colors.border.primary}
              ${serifTheme.colors.background.overlay}
              backdrop-blur-2xl
              ${serifTheme.colors.shadow.card}
              ring-1 ring-amber-300/30
              overflow-hidden
            `}
          >
            {/* Decorative Background Elements */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl"></div>
            <div className="pointer-events-none absolute -bottom-12 -left-10 w-36 h-36 bg-orange-200/30 rounded-full blur-2xl"></div>

            {/* Options */}
            {options.map((option) => {
              const isSelected = option.id === value || option.value === value;
              return (
                <motion.button
                  key={option.id || option.value}
                  onClick={() => handleSelect(option)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  className={`
                    relative w-full 
                    px-4 py-3 
                    text-left text-sm 
                    ${serifTheme.transitions.default}
                    ${
                      isSelected
                        ? `${serifTheme.colors.text.accent} bg-amber-100/50`
                        : `${serifTheme.colors.text.secondary} hover:text-amber-800 hover:bg-amber-50/50`
                    }
                  `}
                >
                  {option.label}
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SerifDropdown;

