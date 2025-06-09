import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiChevronDown, FiChevronUp, FiArrowRight
} from "react-icons/fi";
import {
  FaCrown, FaShieldAlt, FaRocket, FaGem, FaAward
} from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";
import { BsStars } from "react-icons/bs";

const subscriptionServices = [
  {
    id: "netflix",
    name: "Netflix Nepal",
    description: "Watch your favorite shows and movies.",
    path: "/NetflixNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "spotify",
    name: "Spotify Nepal",
    description: "Stream unlimited music and podcasts.",
    path: "/SpotifyNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "prime",
    name: "Prime Video Nepal",
    description: "Enjoy movies and TV shows at your fingertips.",
    path: "/PrimeVideoNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "youtube",
    name: "YouTube Premium Nepal",
    description: "Watch ad-free videos and music.",
    path: "/YouTubePremiumNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "canva",
    name: "Canva Nepal",
    description: "Create stunning designs effortlessly.",
    path: "/CanvaNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "zee5",
    name: "Zee5 Nepal",
    description: "Watch regional and Bollywood content.",
    path: "/Zee5Nepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "vpn",
    name: "VPN Nepal",
    description: "Secure your internet connection.",
    path: "/VpnNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "jiocinema",
    name: "JioCinema Nepal",
    description: "Stream Bollywood movies and shows.",
    path: "/JioCinemaNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "disney",
    name: "DisneyPlus Hotstar Nepal",
    description: "Stream Disney, Marvel, and more.",
    path: "/DisneyPlusHotstarNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "ullu",
    name: "Ullu Nepal",
    description: "Watch exclusive web series and movies.",
    path: "/UlluNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "altbalaji",
    name: "AltBalaji Nepal",
    description: "Stream Indian original content.",
    path: "/AltBalajiNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "googleone",
    name: "Google One Nepal",
    description: "Get cloud storage and backup solutions.",
    path: "/GoogleOneNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "software",
    name: "Software Nepal",
    description: "Find the best software solutions.",
    path: "/SoftwareNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "antivirus",
    name: "Antivirus Nepal",
    description: "Protect your devices from threats.",
    path: "/AntivirusNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "grammarly",
    name: "Grammarly Nepal",
    description: "Improve your writing instantly.",
    path: "/GrammarlyNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "tinder",
    name: "Tinder Nepal",
    description: "Meet new people and make connections.",
    path: "/TinderNepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70"
  },
  {
    id: "netflix-guide",
    name: "Netflix Guide to Buy in Nepal",
    description: "Step-by-step guide to purchase Netflix.",
    path: "/How-to-buy-netflix-in-nepal",
    color: "bg-gradient-to-br from-gray-900/90 to-gray-800/70",
    fullWidth: true
  }
];
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
    className="h-full p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/30 overflow-hidden relative"
  >
    {/* Shimmer Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/10 to-transparent -translate-x-full animate-pulse"></div>

    <div className="space-y-4 relative z-10">
      <motion.div
        className="h-6 bg-gray-700/50 rounded-lg"
        initial={{ width: 0 }}
        animate={{ width: "70%" }}
        transition={{ delay: delay * 0.1 + 0.1, duration: 0.6 }}
      />
      <motion.div
        className="h-4 bg-gray-700/50 rounded-lg"
        initial={{ width: 0 }}
        animate={{ width: "90%" }}
        transition={{ delay: delay * 0.1 + 0.2, duration: 0.6 }}
      />
      <motion.div
        className="h-4 bg-gray-700/50 rounded-lg"
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
        <div className="w-6 h-6 bg-gray-600/50 rounded-full"></div>
      </motion.div>
    </div>
  </motion.div>
);

const SubscriptionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loadingState, setLoadingState] = useState({
    header: true,
    search: true,
    content: true
  });
  const [filteredServices, setFilteredServices] = useState([]);

  // Simulate sequential loading
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLoadingState(prev => ({ ...prev, header: false }));
    }, 300);

    const timer2 = setTimeout(() => {
      setLoadingState(prev => ({ ...prev, search: false }));
    }, 600);

    const timer3 = setTimeout(() => {
      setLoadingState(prev => ({ ...prev, content: false }));
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Filter services
  useEffect(() => {
    const filtered = subscriptionServices.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm]);

  const visibleServices = showAll ? filteredServices : filteredServices.slice(0, 8);

  // Handle search with loading state
  const handleSearch = (e) => {
    setLoadingState(prev => ({ ...prev, content: true }));
    setSearchTerm(e.target.value);
    setTimeout(() => {
      setLoadingState(prev => ({ ...prev, content: false }));
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black p-6 relative overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #1f2937 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #374151 0%, transparent 50%)`,
          backgroundSize: '150px 150px'
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-24 h-24 bg-gray-800/20 rounded-full blur-2xl"
          animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-20 h-20 bg-gray-700/20 rounded-full blur-2xl"
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-32 h-32 bg-gray-600/20 rounded-full blur-2xl"
          animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <AnimatePresence>
          {loadingState.header ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mb-16 space-y-6"
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
              className="text-center mb-16"
            >
              {/* Modern Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium mb-8"
              >
                <BsStars className="text-yellow-400" />
                Premium Services
                <FaCrown className="text-yellow-400" />
              </motion.div>

              {/* Enhanced Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
                Premium <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 bg-clip-text text-transparent">Subscriptions</span>
              </h1>

              {/* Enhanced Description */}
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                Access your favorite services with our <span className="text-cyan-400 font-semibold">exclusive subscriptions</span> at unbeatable prices
              </p>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-6"
              >
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
                  <FaShieldAlt className="text-green-400" />
                  <span className="text-green-300 font-medium text-sm">Secure & Safe</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/30">
                  <FaRocket className="text-blue-400" />
                  <span className="text-blue-300 font-medium text-sm">Instant Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/30">
                  <FaAward className="text-purple-400" />
                  <span className="text-purple-300 font-medium text-sm">Best Prices</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Search Bar */}
        <AnimatePresence>
          {loadingState.search ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative mb-12 max-w-lg mx-auto h-16 bg-gray-800/50 rounded-2xl backdrop-blur-sm"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative mb-12 max-w-lg mx-auto"
            >
              {/* Search Container */}
              <div className="relative bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/30 p-1 shadow-2xl">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FiSearch className="text-cyan-400 text-lg" />
                    </motion.div>
                  </div>
                  <input
                    type="text"
                    placeholder="Search your favorite subscriptions..."
                    className="block w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent rounded-xl text-lg"
                    value={searchTerm}
                    onChange={handleSearch}
                  />

                  {/* Search Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 via-cyan-600/5 to-cyan-600/0 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Search Stats */}
              {searchTerm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-4"
                >
                  <span className="text-gray-400 text-sm">
                    Found <span className="text-cyan-400 font-semibold">{filteredServices.length}</span> results
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subscription Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {loadingState.content ? (
              // Loading state with sequential cards
              Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={`loading-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1, duration: 0.3 }
                  }}
                >
                  <LoadingCard delay={index} />
                </motion.div>
              ))
            ) : (
              // Enhanced loaded content
              visibleServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      duration: 0.6
                    }
                  }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className={service.fullWidth ? "sm:col-span-2 lg:col-span-3 xl:col-span-4" : ""}
                >
                  <Link
                    to={service.path}
                    className="block h-full group"
                  >
                    <motion.div
                      whileHover={{
                        y: -10,
                        scale: 1.02,
                        rotateY: 2,
                        transition: { duration: 0.3, type: "spring", stiffness: 300 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative h-full p-6 md:p-8 rounded-2xl shadow-xl transition-all duration-500 overflow-hidden border border-gray-700/30 backdrop-blur-sm ${service.color} text-white`}
                    >
                      {/* Background Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-cyan-100 transition-colors duration-300">
                              {service.name}
                            </h2>
                            <p className="text-gray-100 group-hover:text-white transition-colors duration-300 leading-relaxed">
                              {service.description}
                            </p>
                          </div>

                          {/* Enhanced Arrow Icon */}
                          <motion.div
                            className="ml-4 p-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-white/20"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            animate={{
                              x: [0, 3, 0],
                              transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                            }}
                          >
                            <FiArrowRight className="text-lg" />
                          </motion.div>
                        </div>

                        {/* Service Badge */}
                        <div className="flex items-center gap-2 mt-6">
                          <motion.div
                            className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs font-medium"
                            whileHover={{ scale: 1.05 }}
                          >
                            <FaGem className="text-yellow-300" />
                            <span>Premium</span>
                          </motion.div>

                          <motion.div
                            className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs font-medium"
                            whileHover={{ scale: 1.05 }}
                          >
                            <HiLightningBolt className="text-blue-300" />
                            <span>Instant</span>
                          </motion.div>
                        </div>
                      </div>

                      {/* Hover Shine Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                        style={{ transform: 'skewX(-20deg)' }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Show More/Less Button */}
        {!loadingState.content && filteredServices.length > 8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: visibleServices.length * 0.08 + 0.3, duration: 0.6 }
            }}
            className="flex justify-center mt-12"
          >
            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-xl hover:from-cyan-600/20 hover:to-blue-600/20 text-white rounded-2xl border border-gray-700/30 hover:border-cyan-400/40 transition-all duration-500 shadow-xl overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(6, 182, 212, 0.15)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 to-blue-600/0 group-hover:from-cyan-600/10 group-hover:to-blue-600/10 transition-all duration-500 rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10 flex items-center gap-3">
                {showAll ? (
                  <>
                    <motion.span
                      animate={{ rotate: 180 }}
                      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                      className="p-1 bg-white/10 rounded-full group-hover:bg-cyan-400/20 transition-colors duration-300"
                    >
                      <FiChevronUp className="text-lg" />
                    </motion.span>
                    <span className="font-semibold">Show Less</span>
                  </>
                ) : (
                  <>
                    <motion.span
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                      className="p-1 bg-white/10 rounded-full group-hover:bg-cyan-400/20 transition-colors duration-300"
                    >
                      <FiChevronDown className="text-lg" />
                    </motion.span>
                    <span className="font-semibold">Show More</span>
                    <div className="flex items-center gap-1 bg-cyan-600/20 px-2 py-1 rounded-full text-xs font-medium border border-cyan-500/30">
                      <span>{filteredServices.length - 8}</span>
                      <span>more</span>
                    </div>
                  </>
                )}
              </div>

              {/* Hover Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                style={{ transform: 'skewX(-20deg)' }}
              />
            </motion.button>
          </motion.div>
        )}

        {/* Enhanced Empty State */}
        {!loadingState.content && filteredServices.length === 0 && (
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