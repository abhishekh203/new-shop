import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown, FiChevronUp, FiArrowRight
} from "react-icons/fi";
import {
  FaCrown, FaShieldAlt, FaRocket, FaGem, FaAward
} from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";
import { BsStars } from "react-icons/bs";
import { subscriptionServices } from "../../config/homepageConfig";
import { serifTheme } from "../../design-system/themes";

// Enhanced loading skeleton component with modern animations
const LoadingCard = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: delay * 0.1, duration: 0.5, type: "spring", stiffness: 100 }
    }}
    className={`h-full p-6 ${serifTheme.radius.card} ${serifTheme.gradients.card} backdrop-blur-xl border ${serifTheme.colors.border.primary} overflow-hidden relative`}
  >
    {/* Shimmer Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent -translate-x-full animate-pulse"></div>

    <div className="space-y-4 relative z-10">
      <motion.div
        className="h-6 bg-amber-200/30 rounded-lg"
        initial={{ width: 0 }}
        animate={{ width: "70%" }}
        transition={{ delay: delay * 0.1 + 0.1, duration: 0.6 }}
      />
      <motion.div
        className="h-4 bg-amber-200/30 rounded-lg"
        initial={{ width: 0 }}
        animate={{ width: "90%" }}
        transition={{ delay: delay * 0.1 + 0.2, duration: 0.6 }}
      />
      <motion.div
        className="h-4 bg-amber-200/30 rounded-lg"
        initial={{ width: 0 }}
        animate={{ width: "75%" }}
        transition={{ delay: delay * 0.1 + 0.3, duration: 0.6 }}
      />

      {/* Loading Icon */}
      <motion.div
        className="flex justify-end mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay * 0.1 + 0.4 }}
      >
        <div className="w-6 h-6 bg-amber-300/30 rounded-full"></div>
      </motion.div>
    </div>
  </motion.div>
);

const SubscriptionPage = () => {
  const [showAll, setShowAll] = useState(false);
  const [loadingState, setLoadingState] = useState({
    header: false,
    content: false
  });
  const scrollContainerRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left

  // Auto-scrolling functionality
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isAutoScrolling || loadingState.content) return;

    const scrollSpeed = 1; // pixels per frame
    const scrollInterval = 16; // ~60fps

    const autoScroll = () => {
      if (!container) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const currentScrollLeft = container.scrollLeft;

      // Check if we've reached the end or beginning
      if (currentScrollLeft >= maxScrollLeft && scrollDirection === 1) {
        setScrollDirection(-1); // Change direction to left
      } else if (currentScrollLeft <= 0 && scrollDirection === -1) {
        setScrollDirection(1); // Change direction to right
      }

      // Scroll based on direction
      container.scrollLeft += scrollSpeed * scrollDirection;
    };

    const intervalId = setInterval(autoScroll, scrollInterval);

    return () => clearInterval(intervalId);
  }, [isAutoScrolling, scrollDirection, loadingState.content]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  // Simulate sequential loading
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLoadingState(prev => ({ ...prev, header: false }));
    }, 100);

    const timer2 = setTimeout(() => {
      setLoadingState(prev => ({ ...prev, content: false }));
    }, 200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const visibleServices = showAll ? subscriptionServices : subscriptionServices.slice(0, 8);


  return (
    <div className={`py-16 px-6 relative overflow-hidden ${serifTheme.gradients.background}`} style={{ fontFamily: serifTheme.fontFamily.serif }}>
      {/* Subtle Background Elements - Serif Theme */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 ${serifTheme.gradients.overlay}`}></div>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(180,83,9,0.2)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        </div>
        
        {/* Floating Orbs - Warm Amber/Orange Tones */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header - Hidden */}
        <AnimatePresence>
          {loadingState.header ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mb-16 space-y-6 hidden"
            >
              <motion.div
                className="h-4 bg-gray-800/50 rounded-full mx-auto max-w-xs"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="h-12 bg-gray-800/50 rounded-lg mx-auto max-w-md"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
              <motion.div
                className="h-6 bg-gray-800/50 rounded-lg mx-auto max-w-lg"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.4, duration: 0.5 }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 hidden"
            >
              {/* Section Title - Hidden */}
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Our <span className="text-cyan-400">Services</span>
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar Removed */}

        {/* Compact Auto-Scrolling Horizontal Services */}
        <div className="relative mb-12">
          {/* Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide pb-4 cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex space-x-4 min-w-max px-4">
              <AnimatePresence>
                {loadingState.content ? (
                  // Loading state with horizontal cards
                  Array.from({ length: 8 }).map((_, index) => (
                    <motion.div
                      key={`loading-${index}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: 1,
                        x: 0,
                        transition: { delay: index * 0.05, duration: 0.3 }
                      }}
                      className="flex-shrink-0 w-72"
                    >
                      <LoadingCard delay={index} />
                    </motion.div>
                  ))
                ) : (
                  // Enhanced horizontal service cards with duplicates for seamless scrolling
                  [...subscriptionServices, ...subscriptionServices].map((service, index) => (
                    <motion.div
                      key={`${service.id}-${index}`}
                      initial={{ opacity: 0, x: 30, scale: 0.95 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        transition: {
                          delay: (index % subscriptionServices.length) * 0.05,
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          duration: 0.4
                        }
                      }}
                      className="flex-shrink-0 w-72"
                    >
                      <Link
                        to={service.path}
                        className="block h-full group"
                        onClick={() => setIsAutoScrolling(false)} // Stop auto-scroll on click
                      >
                        <motion.div
                          whileHover={{
                            y: -8,
                            scale: 1.02,
                            transition: { duration: 0.3, type: "spring", stiffness: 300 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative h-40 p-5 ${serifTheme.radius.card} ${serifTheme.colors.shadow.card} hover:shadow-xl ${serifTheme.transitions.default} overflow-hidden border ${serifTheme.colors.border.primary} backdrop-blur-sm ${serifTheme.gradients.card} ${serifTheme.colors.text.primary}`}
                        >
                          {/* Background Glow Effect */}
                          <div className={`absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 ${serifTheme.transitions.default} ${serifTheme.radius.card}`}></div>

                          {/* Content */}
                          <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                              <h3 className={`text-lg font-bold mb-2 group-hover:text-amber-800 ${serifTheme.transitions.default} line-clamp-1 ${serifTheme.colors.text.primary}`}>
                                {service.name}
                              </h3>
                              <p className={`${serifTheme.colors.text.secondary} group-hover:text-gray-900 ${serifTheme.transitions.default} text-sm leading-relaxed line-clamp-2`}>
                                {service.description}
                              </p>
                            </div>

                            {/* Bottom section with badges and arrow */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <motion.div
                                  className={`flex items-center gap-1 ${serifTheme.gradients.button} px-2 py-1 ${serifTheme.radius.button} text-xs font-medium ${serifTheme.colors.button.textPrimary}`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <FaGem className="text-amber-200 text-xs" />
                                  <span>Premium</span>
                                </motion.div>
                              </div>

                              {/* Enhanced Arrow Icon */}
                              <motion.div
                                className={`p-2 ${serifTheme.gradients.button} ${serifTheme.radius.button} opacity-70 group-hover:opacity-100 ${serifTheme.transitions.default} ${serifTheme.colors.button.textPrimary}`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                <FiArrowRight className="text-sm" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Hover Shine Effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                            style={{ transform: 'skewX(-20deg)' }}
                          />
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Auto-Scroll Indicator - Hidden */}
          <div className="hidden">
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <motion.div
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  isAutoScrolling ? 'bg-green-400' : 'bg-gray-500'
                }`}
                animate={isAutoScrolling ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              <span>
                {isAutoScrolling ? 'Auto-scrolling • Hover to pause' : 'Auto-scroll paused • Move away to resume'}
              </span>
              <motion.div
                animate={{ 
                  x: isAutoScrolling ? [0, 5, 0] : 0,
                  opacity: isAutoScrolling ? 1 : 0.5 
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <FiArrowRight />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Enhanced Empty State - Hidden for now */}
        {false && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-20"
          >
            {/* Empty State Container */}
            <div className="max-w-md mx-auto bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-2xl">
              {/* Animated Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-gray-400 text-8xl mb-6 inline-block"
              >
                �
              </motion.div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-4">No results found</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                We couldn't find any subscriptions matching "<span className="text-cyan-400 font-semibold">{searchTerm}</span>".
                Try a different search term or browse all services.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => {
                    setLoadingState(prev => ({ ...prev, content: true }));
                    setSearchTerm("");
                    setTimeout(() => {
                      setLoadingState(prev => ({ ...prev, content: false }));
                    }, 300);
                  }}
                  className="group relative px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-all duration-300 overflow-hidden"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(6, 182, 212, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FiSearch />
                    Clear Search
                  </span>

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    style={{ transform: 'skewX(-20deg)' }}
                  />
                </motion.button>

                <motion.button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-3 bg-transparent border border-gray-600 hover:border-cyan-400 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse All Services
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;