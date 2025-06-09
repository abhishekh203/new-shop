import { motion, AnimatePresence } from 'framer-motion';

// Add custom CSS animations
const loaderStyles = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-spin-slow {
    animation: spin-slow 2s linear infinite;
  }

  .animate-dash {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = loaderStyles;
  if (!document.head.querySelector('style[data-loader-styles]')) {
    styleElement.setAttribute('data-loader-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const Loader = ({
  size = 'md',
  variant = 'modern',
  fullScreen = false,
  text = 'Loading...',
  showText = true,
  backdrop = true
}) => {
  // Size variants
  const sizeClasses = {
    sm: { width: 24, height: 24, text: 'text-xs' },
    md: { width: 32, height: 32, text: 'text-sm' },
    lg: { width: 48, height: 48, text: 'text-base' },
    xl: { width: 64, height: 64, text: 'text-lg' },
    xxl: { width: 80, height: 80, text: 'text-xl' }
  };

  const currentSize = sizeClasses[size];

  // Modern Animation Variants
  const modernSpinnerVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const dotsVariants = {
    initial: { y: 0 },
    animate: {
      y: [-8, 0, -8],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const waveVariants = {
    initial: { scaleY: 1 },
    animate: {
      scaleY: [1, 2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Render different loader variants
  const renderLoader = () => {
    switch (variant) {
      case 'modern':
        return (
          <div className="relative">
            {/* Outer ring */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={modernSpinnerVariants}
              className="relative"
              style={{ width: currentSize.width, height: currentSize.height }}
            >
              <svg
                viewBox="0 0 50 50"
                className="w-full h-full"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-dash"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Inner pulse */}
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                style={{ width: currentSize.width * 0.3, height: currentSize.height * 0.3 }}
              />
            </motion.div>
          </div>
        );

      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                variants={dotsVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                style={{
                  width: currentSize.width * 0.25,
                  height: currentSize.height * 0.25
                }}
              />
            ))}
          </div>
        );

      case 'wave':
        return (
          <div className="flex items-end space-x-1">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                variants={waveVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-sm"
                style={{
                  width: currentSize.width * 0.15,
                  height: currentSize.height * 0.6
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            className="relative"
          >
            <div
              className="bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 rounded-full"
              style={{ width: currentSize.width, height: currentSize.height }}
            />
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0.3, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 rounded-full"
            />
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial="initial"
            animate="animate"
            variants={modernSpinnerVariants}
            style={{ width: currentSize.width, height: currentSize.height }}
          >
            <svg
              viewBox="0 0 50 50"
              className="w-full h-full"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="url(#gradient2)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="31.416"
                strokeDashoffset="31.416"
              />
              <defs>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`flex flex-col items-center justify-center ${
          fullScreen
            ? `fixed inset-0 z-50 ${backdrop ? 'bg-black/80 backdrop-blur-sm' : ''}`
            : 'relative'
        }`}
        role="status"
        aria-live="polite"
      >
        {/* Modern Background Pattern for fullscreen */}
        {fullScreen && backdrop && (
          <div className="absolute inset-0 opacity-3">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #1f2937 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, #374151 0%, transparent 50%)`,
              backgroundSize: '150px 150px'
            }}></div>
          </div>
        )}

        {/* Loader Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {renderLoader()}
        </motion.div>

        {/* Enhanced loading text */}
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className={`font-semibold text-white ${currentSize.text} mb-2`}>
              {text}
            </p>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs text-gray-400"
            >
              Please wait a moment...
            </motion.div>
          </motion.div>
        )}

        {/* Accessibility text */}
        <span className="sr-only">Loading content, please wait...</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;