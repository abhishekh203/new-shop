import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaShoppingCart, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { SerifButton } from '../../design-system/components';
import { serifTheme } from '../../design-system/themes';

const LoginPopup = ({ isOpen, onClose, productTitle = "this item" }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleSignup = () => {
    onClose();
    navigate('/signup');
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-md lg:max-w-lg w-full mx-4 overflow-hidden max-h-[85vh] flex flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 px-4 sm:px-5 py-3.5 sm:py-4">
              <button
                onClick={onClose}
                className="absolute top-3.5 sm:top-4 right-3.5 sm:right-4 text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-full"
              >
                <FaTimes size={20} />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="p-1.5 sm:p-2 bg-white/20 rounded-full">
                  <FaShoppingCart className="text-white" size={20} />
                </div>
                <div>
                  <h2
                    className="text-base sm:text-xl font-bold text-white"
                    style={{ fontFamily: serifTheme.fontFamily.serif }}
                  >
                    Login Required
                  </h2>
                  <p className="text-white/90 text-xs sm:text-sm">
                    Please sign in to add items to cart
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 sm:px-6 py-5 sm:py-7 overflow-y-auto">
              <div className="text-center space-y-3 mb-4 sm:mb-5">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-amber-100 rounded-full">
                  <FaShoppingCart className="text-amber-600" size={20} />
                </div>
                <h3
                  className="text-sm sm:text-lg font-semibold text-gray-800"
                  style={{ fontFamily: serifTheme.fontFamily.serif }}
                >
                  Want to add {productTitle} to your cart?
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Sign in to save items to your cart and get a smoother checkout experience.
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 mb-4 sm:mb-5">
                <h4 className="font-medium text-gray-800 mb-2 text-xs sm:text-sm">
                  With an account you get:
                </h4>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    Save items to cart across devices
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    Faster checkout process
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    Order history and tracking
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-3">
                <SerifButton
                  onClick={handleLogin}
                  variant="primary"
                  size="large"
                  className="w-full sm:flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  icon={<FaSignInAlt />}
                >
                  Sign In
                </SerifButton>
                
                <SerifButton
                  onClick={handleSignup}
                  variant="outline"
                  size="large"
                  className="w-full sm:flex-1 py-2.5 sm:py-3 border-amber-300 text-amber-700 hover:bg-amber-50"
                  icon={<FaUserPlus />}
                >
                  Create Account
                </SerifButton>
              </div>

              {/* Footer */}
              <div className="mt-4 text-center">
                <button
                  onClick={onClose}
                  className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  Continue browsing without account
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPopup;
