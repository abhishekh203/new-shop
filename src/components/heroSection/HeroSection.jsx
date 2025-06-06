import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Keep framer-motion for potential future animations or if used elsewhere

// Define image arrays for different screen sizes
const largeScreenImages = [
    "https://cap.img.pmdstatic.net/fit/https.3A.2F.2Fi.2Epmdstatic.2Enet.2Fcap.2F2022.2F11.2F03.2F09cc07e8-23ec-424e-b895-d3ddd84bb652.2Ejpeg/1200x630/cr/wqkgcGljdHVyYW5jZS9HZXR0eUltYWdlcyAvIENBUElUQUw%3D/netflix-spotify-amazon-faire-des-economies-en-partageant-son-abonnement-avec-des-inconnus-une-solution-perenne-1450950.jpg",
    // Assuming these local paths are correct relative to the public folder or served correctly
    "/img/head.jpg.jpg", // Use absolute paths from public folder if not using module imports
    "/img/tools.png.jpg",
    "/img/111.webp",
    "/img/12.png",
    "https://pbs.twimg.com/media/F1zNhWXWwAA_Y6E.png",
    "/img/13.png",
];

const smallScreenImages = [
    "https://cap.img.pmdstatic.net/fit/https.3A.2F.2Fi.2Epmdstatic.2Enet.2Fcap.2F2022.2F11.2F03.2F09cc07e8-23ec-424e-b895-d3ddd84bb652.2Ejpeg/1200x630/cr/wqkgcGljdHVyYW5jZS9HZXR0eUltYWdlcyAvIENBUElUQUw%3D/netflix-spotify-amazon-faire-des-economies-en-partageant-son-abonnement-avec-des-inconnus-une-solution-perenne-1450950.jpg",
    // Assuming these local paths are correct relative to the public folder or served correctly
    "/img/n.jpg", // Use absolute paths from public folder if not using module imports
    "/img/np.jpg",
    "/img/111.webp",
    "/img/12.png",
    "https://pbs.twimg.com/media/F1zNhWXWwAA_Y6E.png",
    "/img/13.png",
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    // State to track screen size for selecting image array
    const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 640);

    // Determine which image array to use based on screen size
    const images = isSmallDevice ? smallScreenImages : largeScreenImages;

    // Effect to handle window resize and update the image array choice
    useEffect(() => {
        const handleResize = () => {
            const smallDevice = window.innerWidth < 640;
            setIsSmallDevice(smallDevice);
        };

        // Add resize listener
        window.addEventListener("resize", handleResize);
        handleResize(); // Call initially to set the correct state

        // Cleanup listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty dependency array ensures this runs only once on mount and cleanup on unmount

    // Effect to handle the automatic sliding interval
    useEffect(() => {
        // Set up the interval to advance the slide
        const intervalId = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }, 5000); // Change slide every 5 seconds

        // Clear the interval on component unmount or when images array changes (due to resize)
        return () => clearInterval(intervalId);
    }, [images.length]); // Rerun effect if the number of images changes

    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900">
            {/* Image Slider Container */}
            {/* AnimatePresence can be useful here for smoother slide transitions if desired */}
            <div
                className="flex transition-transform duration-700 ease-in-out" // Increased duration for smoother slide
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {/* Map through the selected image array */}
                {images.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative">
                        <img
                            className="w-full h-60 sm:h-72 md:h-80 lg:h-96 object-cover" // Adjusted heights for responsiveness
                            src={image}
                            alt={`Slide ${index + 1}`}
                            loading={index === 0 ? "eager" : "lazy"} // Load first image eagerly, others lazily
                            // Add error handling for images
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop if fallback fails
                                e.target.src="/img/placeholder.png"; // Replace with a path to a placeholder image
                                console.warn(`Failed to load image: ${image}`);
                            }}
                        />
                         {/* Optional: Add a subtle overlay for text contrast if needed */}
                         {/* <div className="absolute inset-0 bg-black opacity-20"></div> */}
                    </div>
                ))}
            </div>

            {/* Navigation Buttons (Previous/Next) */}
            <button
                aria-label="Previous Slide"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-black/60 transition-all duration-200 backdrop-blur-sm z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                 aria-label="Next Slide"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % images.length)}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-black/60 transition-all duration-200 backdrop-blur-sm z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>

             {/* Optional: Slide Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {images.map((_, index) => (
                    <button
                        key={index}
                        aria-label={`Go to slide ${index + 1}`}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors duration-300 ${
                            currentSlide === index ? 'bg-white shadow-md' : 'bg-white/50 hover:bg-white/75'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSection;