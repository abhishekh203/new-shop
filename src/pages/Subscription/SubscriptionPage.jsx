import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiChevronDown, FiChevronUp, FiArrowRight } from "react-icons/fi";

const subscriptionServices = [
  {
    id: "netflix",
    name: "Netflix Nepal",
    description: "Watch your favorite shows and movies.",
    path: "/NetflixNepal",
    color: "bg-red-600 hover:bg-red-700"
  },
  {
    id: "spotify",
    name: "Spotify Nepal",
    description: "Stream unlimited music and podcasts.",
    path: "/SpotifyNepal",
    color: "bg-green-600 hover:bg-green-700"
  },
  {
    id: "prime",
    name: "Prime Video Nepal",
    description: "Enjoy movies and TV shows at your fingertips.",
    path: "/PrimeVideoNepal",
    color: "bg-blue-600 hover:bg-blue-700"
  },
  {
    id: "youtube",
    name: "YouTube Premium Nepal",
    description: "Watch ad-free videos and music.",
    path: "/YouTubePremiumNepal",
    color: "bg-red-500 hover:bg-red-600"
  },
  {
    id: "canva",
    name: "Canva Nepal",
    description: "Create stunning designs effortlessly.",
    path: "/CanvaNepal",
    color: "bg-teal-500 hover:bg-teal-600"
  },
  {
    id: "zee5",
    name: "Zee5 Nepal",
    description: "Watch regional and Bollywood content.",
    path: "/Zee5Nepal",
    color: "bg-purple-600 hover:bg-purple-700"
  },
  {
    id: "vpn",
    name: "VPN Nepal",
    description: "Secure your internet connection.",
    path: "/VpnNepal",
    color: "bg-indigo-600 hover:bg-indigo-700"
  },
  {
    id: "jiocinema",
    name: "JioCinema Nepal",
    description: "Stream Bollywood movies and shows.",
    path: "/JioCinemaNepal",
    color: "bg-blue-800 hover:bg-blue-900"
  },
  {
    id: "disney",
    name: "DisneyPlus Hotstar Nepal",
    description: "Stream Disney, Marvel, and more.",
    path: "/DisneyPlusHotstarNepal",
    color: "bg-indigo-800 hover:bg-indigo-900"
  },
  {
    id: "ullu",
    name: "Ullu Nepal",
    description: "Watch exclusive web series and movies.",
    path: "/UlluNepal",
    color: "bg-gray-800 hover:bg-gray-900"
  },
  {
    id: "altbalaji",
    name: "AltBalaji Nepal",
    description: "Stream Indian original content.",
    path: "/AltBalajiNepal",
    color: "bg-pink-600 hover:bg-pink-700"
  },
  {
    id: "googleone",
    name: "Google One Nepal",
    description: "Get cloud storage and backup solutions.",
    path: "/GoogleOneNepal",
    color: "bg-blue-500 hover:bg-blue-600"
  },
  {
    id: "software",
    name: "Software Nepal",
    description: "Find the best software solutions.",
    path: "/SoftwareNepal",
    color: "bg-gray-700 hover:bg-gray-800"
  },
  {
    id: "antivirus",
    name: "Antivirus Nepal",
    description: "Protect your devices from threats.",
    path: "/AntivirusNepal",
    color: "bg-green-700 hover:bg-green-800"
  },
  {
    id: "grammarly",
    name: "Grammarly Nepal",
    description: "Improve your writing instantly.",
    path: "/GrammarlyNepal",
    color: "bg-blue-400 hover:bg-blue-500"
  },
  {
    id: "tinder",
    name: "Tinder Nepal",
    description: "Meet new people and make connections.",
    path: "/TinderNepal",
    color: "bg-pink-500 hover:bg-pink-600"
  },
  {
    id: "netflix-guide",
    name: "Netflix Guide to Buy in Nepal",
    description: "Step-by-step guide to purchase Netflix.",
    path: "/How-to-buy-netflix-in-nepal",
    color: "bg-red-700 hover:bg-red-800",
    fullWidth: true
  }
];
// Loading skeleton component with line animations
const LoadingCard = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ 
      opacity: 1,
      y: 0,
      transition: { delay: delay * 0.1, duration: 0.3 }
    }}
    className="h-full p-6 rounded-xl bg-gray-800 overflow-hidden"
  >
    <div className="space-y-3">
      <motion.div 
        className="h-6 bg-gray-700 rounded"
        initial={{ width: 0 }}
        animate={{ width: "70%" }}
        transition={{ delay: delay * 0.1 + 0.1, duration: 0.5 }}
      />
      <motion.div 
        className="h-4 bg-gray-700 rounded"
        initial={{ width: 0 }}
        animate={{ width: "90%" }}
        transition={{ delay: delay * 0.1 + 0.2, duration: 0.5 }}
      />
      <motion.div 
        className="h-4 bg-gray-700 rounded"
        initial={{ width: 0 }}
        animate={{ width: "80%" }}
        transition={{ delay: delay * 0.1 + 0.3, duration: 0.5 }}
      />
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatePresence>
          {loadingState.header ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mb-12 space-y-4"
            >
              <motion.div
                className="h-10 bg-gray-800 rounded-lg mx-auto max-w-xs"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="h-6 bg-gray-800 rounded-lg mx-auto max-w-md"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-white mb-4">Premium Subscriptions</h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Access your favorite services with our exclusive subscriptions
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <AnimatePresence>
          {loadingState.search ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative mb-8 max-w-md mx-auto h-14 bg-gray-800 rounded-lg"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative mb-8 max-w-md mx-auto"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search subscriptions..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearch}
              />
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
              // Loaded content
              visibleServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1,
                    y: 0,
                    transition: { 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      duration: 0.5
                    }
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={service.fullWidth ? "sm:col-span-2 lg:col-span-3 xl:col-span-4" : ""}
                >
                  <Link
                    to={service.path}
                    className={`block h-full p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${service.color} text-white group`}
                  >
                    <motion.div
                      whileHover={{ 
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold mb-2">{service.name}</h2>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <FiArrowRight />
                        </motion.div>
                      </div>
                      <p className="text-gray-100">{service.description}</p>
                    </motion.div>
                  </Link>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Show More/Less Button */}
        {!loadingState.content && filteredServices.length > 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: visibleServices.length * 0.05 + 0.2 }
            }}
            className="flex justify-center mt-8"
          >
            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAll ? (
                <>
                  <motion.span
                    animate={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiChevronUp />
                  </motion.span>
                  Show Less
                </>
              ) : (
                <>
                  <motion.span
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiChevronDown />
                  </motion.span>
                  Show More ({filteredServices.length - 8})
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loadingState.content && filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-gray-400 text-6xl mb-4 inline-block"
            >
              😕
            </motion.div>
            <h3 className="text-xl text-white mb-2">No results found</h3>
            <p className="text-gray-400 mb-4">Try a different search term</p>
            <motion.button
              onClick={() => {
                setLoadingState(prev => ({ ...prev, content: true }));
                setSearchTerm("");
                setTimeout(() => {
                  setLoadingState(prev => ({ ...prev, content: false }));
                }, 300);
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Search
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;