import React, { useState, useEffect } from "react";
import { 
  AiOutlineWechat,
  AiOutlineWhatsApp,
  AiOutlineMessage 
} from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const CombinedChat = ({ darkMode = false }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const chatLinks = {
    whatsapp: "https://wa.me/9779807677391",
    telegram: "https://t.me/digitalshopnepal",
    messenger: "https://m.me/digitalshopnepal"
  };

  // Check if mobile on component mount
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Blinking effect for large screens only
  useEffect(() => {
    if (isMobile) return;

    const interval = setInterval(() => {
      setIsVisible(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile]);

  // Show chat button when user moves mouse (for large screens)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = () => {
      setIsVisible(true);
      // Hide again after 3 seconds of inactivity
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Don't render anything on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Floating Contact Button with Animation */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-6 left-6 z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -15, 0] 
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              default: { duration: 0.3 }
            }}
            whileHover={{ scale: 1.1 }}
          >
            <button
              onClick={() => setShowPopup(!showPopup)}
              className={`w-16 h-16 ${darkMode ? 'bg-blue-600' : 'bg-orange-500'} text-white rounded-full flex flex-col items-center justify-center shadow-xl transition-all`}
            >
              <AiOutlineWechat size={28} className="mb-1" />
              <span className="text-[10px] font-medium">Need Help?</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Options Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed bottom-28 left-6 w-72 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl shadow-2xl border`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Contact Support
                </h3>
                <button 
                  onClick={() => setShowPopup(false)}
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <IoMdClose className={darkMode ? 'text-gray-300' : 'text-gray-500'} />
                </button>
              </div>

              <div className="space-y-3">
                <motion.a
                  whileHover={{ x: 5 }}
                  href={chatLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                >
                  <div className={`p-2 rounded-full ${darkMode ? 'bg-green-700/30' : 'bg-green-100'}`}>
                    <FaWhatsapp size={24} className="text-green-500" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>WhatsApp Support</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-orange-500'}`}>Instant response for sales & payments</p>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ x: 5 }}
                  href={chatLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                >
                  <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-700/30' : 'bg-blue-100'}`}>
                    <FaTelegramPlane size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Telegram Support</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-blue-500'}`}>For technical issues & replacements</p>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ x: 5 }}
                  href={chatLinks.messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                >
                  <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-600/30' : 'bg-blue-100'}`}>
                    <AiOutlineMessage size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Messenger</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-blue-400'}`}>General inquiries</p>
                  </div>
                </motion.a>
              </div>

              <p className={`text-center text-xs mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Powered by <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-orange-500'}`}>Digital Shop Nepal</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CombinedChat;