import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaPlay, 
  FaStar, 
  FaShieldAlt, 
  FaRocket, 
  FaHeadphones,
  FaTv,
  FaMobile,
  FaLaptop,
  FaCheckCircle,
  FaEnvelope,
  FaUsers,
  FaAward,
  FaFire,
  FaCrown,
  FaArrowRight,
  FaGift,
  FaHeart,
  FaMagic
} from "react-icons/fa";
import { BsLightningCharge, BsGlobe, BsCurrencyExchange, BsStarFill } from "react-icons/bs";
import { floatingProducts, heroContent } from "../../config/homepageConfig";
import { serifTheme } from "../../design-system/themes";
import SerifButton from "../../design-system/components/SerifButton";

// Floating Product Card Component with Sequential Loading
const FloatingProductCard = ({ product, index }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(product.url);
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 80, 
        scale: 0.3,
        rotate: -20,
        filter: "blur(10px)"
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
        x: [0, 10, 0],
      }}
      transition={{ 
        duration: 1.2, 
        delay: 0.3 + (index * 0.3), // Reduced delay: 0.3s, 0.6s, 0.9s, 1.2s - images load immediately
        ease: [0.25, 0.1, 0.25, 1],
        x: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1 + (index * 0.3) // Start floating sooner
        }
      }}
      whileHover={{ 
        scale: 1.08, 
        rotate: 8,
        y: -5,
        transition: { 
          duration: 0.3,
          type: "spring",
          stiffness: 300
        }
      }}
      onClick={handleCardClick}
      className="absolute z-20 cursor-pointer"
      style={product.position}
    >
      <div className={`${serifTheme.gradients.card} backdrop-blur-xl ${serifTheme.radius.card} p-4 shadow-lg hover:shadow-xl border ${serifTheme.colors.border.primary} w-64 ${serifTheme.transitions.default}`}>
        {/* Badge with optimized animation */}
        <motion.div 
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${product.color} mb-3`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 0.2 + (index * 0.2),
            duration: 0.4,
            type: "spring",
            stiffness: 200
          }}
        >
          <FaMagic className="mr-1" />
          {product.badge}
        </motion.div>
        
        {/* Product Image with optimized loading - Image loads immediately */}
        <div className="flex items-center justify-center h-16 mb-3 bg-gray-50 rounded-xl overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title}
            className="h-12 w-12 object-contain"
            loading={index < 2 ? "eager" : "lazy"}
            fetchpriority={index < 2 ? "high" : "auto"}
            decoding="async"
            style={{ 
              opacity: index < 2 ? 1 : 0,
              transition: 'opacity 0.3s ease-in'
            }}
            onLoad={(e) => {
              e.target.style.opacity = 1;
            }}
            onError={(e) => {
              e.target.src = "/img/hero.png";
              e.target.style.opacity = 1;
            }}
          />
        </div>
        
        {/* Product Info with optimized animation */}
        <motion.h3 
          className={`font-bold ${serifTheme.colors.text.primary} text-sm mb-2`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.5 + (index * 0.2),
            duration: 0.4
          }}
        >
          {product.title}
        </motion.h3>
        
        <motion.div 
          className="flex items-center justify-between"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.6 + (index * 0.2),
            duration: 0.4
          }}
        >
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-black ${serifTheme.colors.text.primary}`}>{product.price}</span>
            <span className={`text-sm ${serifTheme.colors.text.muted} line-through`}>{product.originalPrice}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`${serifTheme.colors.button.primary} ${serifTheme.colors.button.textPrimary} p-2 ${serifTheme.radius.button} ${serifTheme.colors.shadow.button} ${serifTheme.transitions.default}`}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.7 + (index * 0.2),
              duration: 0.4,
              type: "spring",
              stiffness: 200
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <FaArrowRight className="text-xs" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const HeroSection = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Preload critical images immediately
  useEffect(() => {
    const preloadImages = () => {
      // Preload first two hero images for faster initial load
      if (floatingProducts[0]?.image) {
        const img1 = new Image();
        img1.src = floatingProducts[0].image;
      }
      if (floatingProducts[1]?.image) {
        const img2 = new Image();
        img2.src = floatingProducts[1].image;
      }
    };
    preloadImages();
  }, []);

  // Optimize scroll detection - only check once, not continuously
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className={`relative min-h-screen ${serifTheme.gradients.background} overflow-hidden`} style={{ fontFamily: serifTheme.fontFamily.serif }}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Mesh - Warm tones */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/10 via-transparent to-orange-200/10"></div>
        
        {/* Animated Grid - Reduced animation for performance */}
        <motion.div 
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(139,69,19,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,19,0.1)_1px,transparent_1px)] bg-[length:60px_60px]"
          style={{ willChange: 'background-position' }}
        />
        
        {/* Floating Orbs - Reduced animation frequency */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"
          style={{ willChange: 'transform, opacity' }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-yellow-400/15 to-amber-400/15 rounded-full blur-3xl"
          style={{ willChange: 'transform, opacity' }}
        />
      </div>

      {/* Main Content - Removed parallax for better performance */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: isScrolled ? 0.7 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 container mx-auto px-6 py-20 lg:py-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className={`${serifTheme.colors.text.primary} space-y-8`}>
            {/* Badge - Hidden */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden"
            >
              <FaMagic className="mr-2" />
              {heroContent.badge}
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl lg:text-7xl font-black leading-tight"
            >
              <span className={`${serifTheme.colors.text.primary}`}>
                {heroContent.title.split(' ').slice(0, 2).join(' ')}
              </span>
              <br />
              <span className={serifTheme.gradients.accent}>
                {heroContent.title.split(' ').slice(2).join(' ')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-xl ${serifTheme.colors.text.secondary} leading-relaxed max-w-lg`}
            >
              {heroContent.subtitle}
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3"
            >
              {heroContent.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`flex items-center ${serifTheme.colors.text.secondary} text-sm`}
                >
                  <FaCheckCircle className={`mr-2 ${serifTheme.colors.text.accent}`} />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link to="/allproduct" className="inline-block">
                <SerifButton
                  variant="primary"
                  size="large"
                  icon={<FaRocket />}
                  iconPosition="left"
                  className="inline-flex items-center w-full"
                >
                  Start with Digital
                  <FaArrowRight className="ml-3" />
                </SerifButton>
              </Link>
              
              <Link to="/Contactus" className="inline-block">
                <SerifButton
                  variant="secondary"
                  size="large"
                  icon={<FaEnvelope />}
                  iconPosition="left"
                  className="inline-flex items-center w-full"
                >
                  Contact us
                </SerifButton>
              </Link>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`${serifTheme.colors.text.tertiary} text-sm`}
            >
              {heroContent.description}
            </motion.p>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="relative hidden lg:block">
            {/* Main Visual Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative h-[600px] w-full"
            >
              {/* Central Glow Effect - Warm tones */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
              
              {/* Floating Product Cards */}
              {floatingProducts.map((product, index) => (
                <FloatingProductCard key={product.id} product={product} index={index} />
              ))}
              
              {/* Central Logo/Icon - Removed */}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;