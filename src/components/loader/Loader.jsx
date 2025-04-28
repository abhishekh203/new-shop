import { motion } from 'framer-motion';

const Loader = ({ size = 'md', color = 'primary', fullScreen = false }) => {
  // Size variants
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Color variants
  const colorClasses = {
    primary: 'text-blue-500 fill-blue-200',
    secondary: 'text-purple-500 fill-purple-200',
    success: 'text-green-500 fill-green-200',
    danger: 'text-red-500 fill-red-200',
    warning: 'text-yellow-500 fill-yellow-200'
  };

  // Animation variants
  const spinnerVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 bg-black bg-opacity-50 z-50' : 'relative'}`}
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={spinnerVariants}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeDasharray="1, 200"
            strokeDashoffset="0"
            strokeLinecap="round"
            className="opacity-75"
          />
        </svg>
      </motion.div>
      
      {/* Optional loading text */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-3 text-sm font-medium text-gray-300"
      >
        Loading...
      </motion.p>
      
      {/* Accessibility text */}
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
};

export default Loader;