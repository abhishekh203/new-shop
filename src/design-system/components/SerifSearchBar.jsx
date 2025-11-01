import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiXCircle } from "react-icons/fi";
import { serifTheme } from "../themes/serifTheme";

/**
 * Serif-Themed Search Bar Component
 * A reusable search bar with the warm serif-friendly theme
 */
const SerifSearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = "Search products, categories, or keywords...",
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <FiSearch className={`h-5 w-5 ${serifTheme.colors.text.accent}`} />
          <div className={`h-4 w-px bg-amber-300`}></div>
        </div>

        <input
          type="text"
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-12 py-4 
            border ${serifTheme.colors.border.secondary}
            ${serifTheme.radius.input}
            ${serifTheme.colors.background.card}
            ${serifTheme.colors.text.primary}
            placeholder:${serifTheme.colors.text.muted}
            focus:outline-none 
            focus:ring-2 focus:ring-amber-500/50 
            focus:border-amber-500/70
            ${serifTheme.transitions.default}
            text-sm 
            backdrop-blur-sm
          `}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />

        <AnimatePresence>
          {value && (
            <motion.button
              className={`
                absolute right-4 top-1/2 -translate-y-1/2 
                p-1 rounded-full 
                hover:bg-amber-100 
                ${serifTheme.transitions.default}
              `}
              onClick={onClear}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Clear search"
            >
              <FiXCircle className={`${serifTheme.colors.text.accent} hover:text-amber-700 h-4 w-4`} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SerifSearchBar;
