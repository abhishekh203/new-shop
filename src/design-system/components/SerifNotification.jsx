import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { serifTheme } from '../themes';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaShoppingCart,
  FaTrash,
  FaHeart,
  FaTimes
} from 'react-icons/fa';

/**
 * Enhanced Serif-Themed Notification Component
 * A beautiful, polished, reusable notification component matching the serif theme
 */
const SerifNotification = ({ 
  id,
  type = 'success', 
  message, 
  title,
  icon,
  duration = 3000,
  onClose,
  position = 'bottom-right',
  index = 0
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

      // Enhanced icon and color configuration with serif theme colors
  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: icon || <FaCheckCircle className="text-base" />,
          iconBg: 'bg-gradient-to-br from-amber-50 to-orange-50',
          iconColor: 'text-amber-700',
          borderColor: 'border-amber-300',
          accentColor: 'bg-amber-200/20',
          glowColor: 'shadow-amber-400/30'
        };
      case 'error':
        return {
          icon: icon || <FaTimesCircle className="text-base" />,
          iconBg: 'bg-gradient-to-br from-red-50 to-pink-50',
          iconColor: 'text-red-700',
          borderColor: 'border-red-300',
          accentColor: 'bg-red-200/20',
          glowColor: 'shadow-red-400/30'
        };
      case 'info':
        return {
          icon: icon || <FaInfoCircle className="text-base" />,
          iconBg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          iconColor: 'text-blue-700',
          borderColor: 'border-blue-300',
          accentColor: 'bg-blue-200/20',
          glowColor: 'shadow-blue-400/30'
        };
      case 'warning':
        return {
          icon: icon || <FaExclamationTriangle className="text-base" />,
          iconBg: 'bg-gradient-to-br from-amber-50 to-orange-50',
          iconColor: 'text-amber-700',
          borderColor: 'border-amber-300',
          accentColor: 'bg-amber-200/20',
          glowColor: 'shadow-amber-400/30'
        };
      default:
        return {
          icon: icon || <FaInfoCircle className="text-base" />,
          iconBg: 'bg-gradient-to-br from-amber-50 to-orange-50',
          iconColor: 'text-amber-700',
          borderColor: serifTheme.colors.border.primary,
          accentColor: 'bg-amber-200/20',
          glowColor: 'shadow-amber-400/30'
        };
    }
  };

  const { icon: displayIcon, iconBg, iconColor, borderColor, accentColor, glowColor } = getIconAndColors();

  // Position classes with stacking support
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  // Calculate stacking offset for multiple notifications (70px per notification for compact size)
  const stackOffset = index * 70;

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: position.includes('bottom') ? 80 : -80, 
        scale: 0.9,
        x: position.includes('right') ? 50 : position.includes('left') ? -50 : 0,
      }}
      animate={{ 
        opacity: 1, 
        y: position.includes('bottom') ? -stackOffset : stackOffset,
        scale: 1,
        x: 0,
      }}
      exit={{ 
        opacity: 0, 
        y: position.includes('bottom') ? 80 : -80,
        scale: 0.9,
        x: position.includes('right') ? 50 : position.includes('left') ? -50 : 0,
        transition: { duration: 0.25 }
      }}
      transition={{ 
        duration: 0.4, 
        type: 'spring', 
        stiffness: 400, 
        damping: 25 
      }}
      className={`fixed ${positionClasses[position]} z-[9999] max-w-xs w-auto`}
      style={{ fontFamily: serifTheme.fontFamily.serif }}
      whileHover={{ scale: 1.02, y: position.includes('bottom') ? -stackOffset - 2 : stackOffset + 2 }}
    >
      <motion.div 
        className={`
          ${serifTheme.gradients.card}
          backdrop-blur-xl
          ${serifTheme.radius.button}
          border ${borderColor}
          ${serifTheme.colors.shadow.card}
          shadow-lg ${glowColor}
          px-4 py-3
          relative
          overflow-hidden
          group
        `}
        initial={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        animate={{ boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}
      >
        {/* Animated background gradient overlay */}
        <motion.div 
          className={`absolute inset-0 ${accentColor} opacity-0 group-hover:opacity-100`}
          transition={{ duration: 0.3 }}
        />
        
        {/* Decorative shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%', skewX: -20 }}
          animate={{ x: '200%', skewX: -20 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 3,
            ease: 'easeInOut'
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Compact Icon with animation */}
          <motion.div 
            className={`
              ${iconBg}
              ${iconColor}
              p-2
              ${serifTheme.radius.button}
              flex-shrink-0
              relative
              overflow-hidden
            `}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20,
              delay: 0.1
            }}
            whileHover={{ scale: 1.1 }}
          >
            {/* Icon glow effect */}
            <div className={`absolute inset-0 ${type === 'success' ? 'bg-amber-500' : 
                                                    type === 'error' ? 'bg-red-500' :
                                                    type === 'warning' ? 'bg-amber-500' :
                                                    'bg-blue-500'} opacity-20 blur-lg`}></div>
            <div className="relative z-10">
              {displayIcon}
            </div>
          </motion.div>

          {/* Text Content - Compact */}
          <div className="flex-1 min-w-0">
            <motion.p 
              className={`${serifTheme.colors.text.primary} text-sm font-medium leading-tight`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              {message}
            </motion.p>
          </div>

          {/* Compact Close Button */}
          <motion.button
            onClick={() => onClose(id)}
            className={`
              ${serifTheme.colors.text.muted}
              hover:text-gray-900
              ${serifTheme.transitions.default}
              flex-shrink-0
              p-1
              rounded-full
              hover:bg-amber-100/70
              group/close
            `}
            aria-label="Close notification"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes className="text-xs group-hover/close:text-red-500 transition-colors" />
          </motion.button>
        </div>

        {/* Compact Progress Bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-100/20 overflow-hidden rounded-b-xl">
            <motion.div
              className={`h-full ${type === 'success' ? 'bg-gradient-to-r from-amber-600 to-orange-600' : 
                                   type === 'error' ? 'bg-gradient-to-r from-red-600 to-pink-600' :
                                   type === 'warning' ? 'bg-gradient-to-r from-amber-600 to-orange-600' :
                                   'bg-gradient-to-r from-blue-600 to-cyan-600'}`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

/**
 * Enhanced Notification Container - Renders all active notifications with stacking
 */
export const NotificationContainer = ({ notifications, onClose, position = 'bottom-right' }) => {
  // Sort notifications by creation time (newest first for stacking)
  const sortedNotifications = [...notifications].sort((a, b) => b.id - a.id);

  return (
    <AnimatePresence mode="popLayout">
      {sortedNotifications.map((notification, index) => (
        <SerifNotification
          key={notification.id}
          {...notification}
          position={position}
          onClose={onClose}
          index={index}
        />
      ))}
    </AnimatePresence>
  );
};

export default SerifNotification;

