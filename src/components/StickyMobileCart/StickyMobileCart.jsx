import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaChevronRight, FaRupeeSign } from 'react-icons/fa';
import { HiShoppingBag } from 'react-icons/hi';

const StickyMobileCart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldBounce, setShouldBounce] = useState(false);
  const [previousCartCount, setPreviousCartCount] = useState(0);

  // Check if device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show/hide cart based on items and current page
  useEffect(() => {
    const hasItems = cartItems && cartItems.length > 0;
    const isCartPage = location.pathname === '/cart';
    const shouldShow = isMobile && hasItems && !isCartPage;
    
    setIsVisible(shouldShow);
  }, [cartItems, isMobile, location.pathname]);

  // Bounce effect when cart items change
  useEffect(() => {
    const currentCartCount = cartItems?.length || 0;
    
    // Trigger bounce when cart count changes (item added or removed)
    if (currentCartCount !== previousCartCount && isVisible) {
      setShouldBounce(true);
      
      // Reset bounce after animation
      setTimeout(() => {
        setShouldBounce(false);
      }, 1200);
    }
    
    setPreviousCartCount(currentCartCount);
  }, [cartItems?.length, isVisible, previousCartCount]);

  // Calculate total items and price
  const totalItems = cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
  const totalPrice = cartItems?.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) || 0;

  const handleCartClick = () => {
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    navigate('/cart');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.4
        }}
        className="fixed bottom-0 left-0 right-0 z-50 px-6 py-1.5 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 6px)' }}
      >
        {/* Background blur overlay */}
        <div className="absolute inset-0 bg-black/5 backdrop-blur-sm pointer-events-none" />
        
        {/* Main cart button - slightly wider with beautiful animations */}
        <motion.button
          onClick={handleCartClick}
          whileHover={{ 
            scale: 1.03,
            y: -2,
            boxShadow: "0 12px 30px var(--color-glow-primary), 0 0 0 2px var(--color-primary-20)"
          }}
          whileTap={{ scale: 0.97 }}
          animate={{
            y: [0, -3, 0],
            boxShadow: [
              "0 6px 20px var(--color-glow-primary), 0 0 0 1px var(--color-primary-10)",
              "0 8px 25px var(--color-glow-primary), 0 0 0 1px var(--color-primary-20)",
              "0 6px 20px var(--color-glow-primary), 0 0 0 1px var(--color-primary-10)"
            ],
            // More dramatic shrink then expand effect when cart changes
            scale: shouldBounce ? [1, 0.6, 1.4, 0.9, 1.2, 1] : 1,
            rotate: shouldBounce ? [0, -5, 5, -3, 3, 0] : 0,
            // Add glow effect during bounce
            filter: shouldBounce ? ["brightness(1)", "brightness(1.3)", "brightness(1.1)", "brightness(1)"] : "brightness(1)"
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scale: shouldBounce ? { duration: 1.2, ease: "easeInOut" } : {},
            rotate: shouldBounce ? { duration: 1.2, ease: "easeInOut" } : {},
            filter: shouldBounce ? { duration: 1.2, ease: "easeInOut" } : {}
          }}
          className="relative w-full max-w-sm mx-auto bg-gradient-success text-white rounded-2xl shadow-xl transition-all duration-300 overflow-hidden"
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
            animate={{ x: ['-100%', '100%'] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 3
            }}
          />
          
          {/* Floating particles effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute top-1.5 left-4 w-1 h-1 bg-white/30 rounded-full"
              animate={{ 
                y: [0, -8, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1.5 right-6 w-0.5 h-0.5 bg-white/40 rounded-full"
              animate={{ 
                y: [0, -6, 0],
                opacity: [0.4, 0.9, 0.4]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </motion.div>
          
          {/* Content container */}
          <div className="relative z-10 flex items-center justify-between px-4 py-2">
            {/* Left section - Cart icon and items */}
            <div className="flex items-center gap-2">
              {/* Animated cart icon */}
              <motion.div
                className="relative"
                animate={{ 
                  scale: [1, 1.08, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="relative">
                  <motion.div
                    animate={{ 
                      filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <HiShoppingBag className="text-base text-white drop-shadow-lg" />
                  </motion.div>
                  
                  {/* Item count badge */}
                  <motion.div
                    key={totalItems}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -top-1 -right-1 bg-white text-primary text-[8px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center shadow-lg"
                  >
                    <motion.span
                      key={totalItems}
                      initial={{ y: -6, opacity: 0, scale: 0.5 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 25,
                        duration: 0.3
                      }}
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Cart text and items */}
              <div className="flex flex-col items-start">
                <motion.span 
                  className="text-white font-bold text-sm leading-tight drop-shadow-sm"
                  initial={{ x: -6 }}
                  animate={{ x: 0 }}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  View cart
                </motion.span>
                <motion.span 
                  className="text-custom-white opacity-80 text-[10px] font-medium leading-tight"
                  initial={{ x: -6, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </motion.span>
              </div>
            </div>

            {/* Right section - Price and arrow */}
            <div className="flex items-center gap-2">
              {/* Total price */}
              <motion.div 
                className="text-right"
                initial={{ x: 6, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center text-white font-bold text-sm leading-tight">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FaRupeeSign className="text-xs mr-0.5 drop-shadow-sm" />
                  </motion.div>
                  <motion.span
                    key={totalPrice}
                    initial={{ y: -6, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 25,
                      duration: 0.3
                    }}
                  >
                    {totalPrice.toLocaleString('en-IN')}
                  </motion.span>
                </div>
                <span className="text-custom-white opacity-80 text-[8px] leading-tight">Total</span>
              </motion.div>

              {/* Arrow icon */}
              <motion.div
                animate={{ 
                  x: [0, 4, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.2 }}
              >
                <FaChevronRight className="text-white text-xs drop-shadow-sm" />
              </motion.div>
            </div>
          </div>

          {/* Pulse effect on interaction */}
          <motion.div
            className="absolute inset-0 bg-white/20 opacity-0"
            whileTap={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          />
          
          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-transparent to-emerald-400/20 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>

        {/* Bottom safe area */}
        <div className="h-1" />
      </motion.div>
    </AnimatePresence>
  );
};

export default StickyMobileCart; 