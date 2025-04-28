import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const largeScreenImages = [
  "https://cap.img.pmdstatic.net/fit/https.3A.2F.2Fi.2Epmdstatic.2Enet.2Fcap.2F2022.2F11.2F03.2F09cc07e8-23ec-424e-b895-d3ddd84bb652.2Ejpeg/1200x630/cr/wqkgcGljdHVyYW5jZS9HZXR0eUltYWdlcyAvIENBUElUQUw%3D/netflix-spotify-amazon-faire-des-economies-en-partageant-son-abonnement-avec-des-inconnus-une-solution-perenne-1450950.jpg",
  "../img/head.jpg.jpg",
  "../img/tools.png.jpg",
  "../img/111.webp",
  "../img/12.png",
  "https://pbs.twimg.com/media/F1zNhWXWwAA_Y6E.png",
  "../img/13.png",
];

const smallScreenImages = [
  "https://cap.img.pmdstatic.net/fit/https.3A.2F.2Fi.2Epmdstatic.2Enet.2Fcap.2F2022.2F11.2F03.2F09cc07e8-23ec-424e-b895-d3ddd84bb652.2Ejpeg/1200x630/cr/wqkgcGljdHVyYW5jZS9HZXR0eUltYWdlcyAvIENBUElUQUw%3D/netflix-spotify-amazon-faire-des-economies-en-partageant-son-abonnement-avec-des-inconnus-une-solution-perenne-1450950.jpg",
  "../img/n.jpg",
  "../img/np.jpg",
  "../img/111.webp",
  "../img/12.png",
  "https://pbs.twimg.com/media/F1zNhWXWwAA_Y6E.png",
  "../img/13.png",
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 640);
  const [showAd, setShowAd] = useState(!(window.innerWidth < 640));
  const [adPosition, setAdPosition] = useState("bottom-right");
  
  useEffect(() => {
    const handleResize = () => {
      const smallDevice = window.innerWidth < 640;
      setIsSmallDevice(smallDevice);
      setShowAd(!smallDevice);
      
      // Change ad position periodically for large devices
      if (!smallDevice) {
        const positions = ["bottom-right", "bottom-left", "top-center"];
        const timer = setInterval(() => {
          setAdPosition(positions[Math.floor(Math.random() * positions.length)]);
        }, 8000);
        return () => clearInterval(timer);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isSmallDevice]);

  useEffect(() => {
    if (!isSmallDevice) {
      const adTimer = setTimeout(() => {
        setShowAd(false);
      }, 10000); // Show for 10 seconds on large devices

      return () => clearTimeout(adTimer);
    }
  }, [isSmallDevice, adPosition]);

  const images = isSmallDevice ? smallScreenImages : largeScreenImages;

  // Animation variants
  const adVariants = {
    hidden: { 
      opacity: 0,
      y: adPosition.includes("bottom") ? 20 : -20,
      x: adPosition.includes("left") ? -20 : 
         adPosition.includes("right") ? 20 : 0,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    exit: {
      opacity: 0,
      y: adPosition.includes("bottom") ? 20 : -20,
      x: adPosition.includes("left") ? -20 : 
         adPosition.includes("right") ? 20 : 0,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  const getAdPositionClasses = () => {
    switch(adPosition) {
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-center":
        return "top-20 left-1/2 transform -translate-x-1/2";
      default:
        return "bottom-4 right-4";
    }
  };

  const getAdStyle = () => {
    switch(adPosition) {
      case "top-center":
        return "min-w-[300px] bg-gradient-to-br from-blue-600 to-purple-600";
      case "bottom-left":
        return "bg-gradient-to-br from-green-600 to-teal-600";
      default:
        return "bg-gradient-to-br from-purple-600 to-blue-600";
    }
  };

  const getAdContent = () => {
    switch(adPosition) {
      case "top-center":
        return (
          <>
            <div className="flex flex-col items-center">
              <div className="bg-yellow-400 rounded-full p-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white text-center">
                Premium Music Offer!
              </h2>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-2">
              <p className="text-white text-center font-medium">
                Get 2 Months Spotify Premium for just ₹299
              </p>
              <div className="flex justify-center mt-3">
                <a 
                  href="https://wa.me/9779807677391" 
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow-lg flex items-center space-x-2 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Order Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </>
        );
      case "bottom-left":
        return (
          <>
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Special Deal!</h2>
                <p className="text-sm text-white/90">Spotify Premium ₹299/2mo</p>
              </div>
            </div>
            <a 
              href="https://wa.me/9779807677391" 
              className="absolute -right-2 -top-2 bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>→</span>
            </a>
          </>
        );
      default: // bottom-right
        return (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Music Lovers!</h2>
                <p className="text-sm text-white/90 mt-1">Get Spotify Premium</p>
                <p className="text-xl font-bold text-yellow-300 mt-1">₹299/2mo</p>
              </div>
              <div className="bg-yellow-400 rounded-full p-2 ml-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <a 
                href="https://wa.me/9779807677391" 
                className="bg-white text-green-600 text-sm font-bold py-1 px-4 rounded-full shadow hover:bg-gray-100 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Offer
              </a>
            </div>
          </>
        );
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-black to-blue-700">
      {/* Image Slider */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img 
              className="w-full h-60 md:h-80 lg:h-96 object-cover" 
              src={image} 
              alt={`Slide ${index}`} 
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Advertisement Box - Only shown on large devices */}
      {!isSmallDevice && (
        <AnimatePresence>
          {showAd && (
            <motion.div
              className={`fixed ${getAdPositionClasses()} w-auto max-w-xs rounded-xl shadow-2xl z-50 border-2 border-white/20 p-4 ${getAdStyle()}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={adVariants}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setShowAd(false)}
                className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-gray-800 text-sm font-bold">✕</span>
              </motion.button>

              {getAdContent()}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Navigation Buttons */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full shadow-lg focus:outline-none hover:bg-black/70 transition-colors backdrop-blur-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % images.length)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full shadow-lg focus:outline-none hover:bg-black/70 transition-colors backdrop-blur-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroSection;