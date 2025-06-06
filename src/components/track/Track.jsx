import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight, FaCheckCircle, FaLock, FaStar, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Service Icons (keeping these as they are external resources)
const serviceIcons = {
    netflix: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    prime: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
    spotify: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    youtube: "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png",
    disney: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg"
};

// --- Improved Data Structure with Accent Colors ---
const services = [
    {
        id: 1,
        name: "Netflix Premium",
        icon: serviceIcons.netflix,
        description: "Private 4K quality on 1 screen with full access.",
        plans: [
            { duration: "1 Month", price: "Rs. 399", original: "Rs. 649" },
            { duration: "3 Months", price: "Rs. 1169", discount: "Save ~5%" }, // Adjusted discount text for consistency
            { duration: "6 Months", price: "Rs. 2300", discount: "Save ~8%" },
            { duration: "1 Year", price: "Rs. 4499", discount: "Save ~13%" }
        ],
        features: [
            "Use only the provided profile",
            "Don't change account credentials",
            "No mobile number linking",
            "Single device login"
        ],
        accentColor: "red-500", // Tailwind color name
        rating: 4.8
    },
    {
        id: 2,
        name: "Prime Video",
        icon: serviceIcons.prime,
        description: "HD streaming including Amazon Originals.",
        plans: [
            { duration: "1 Month", price: "Rs. 199", original: "Rs. 299" },
            { duration: "3 Months", price: "Rs. 449", discount: "Save ~16%" },
            { duration: "6 Months", price: "Rs. 699", discount: "Save ~22%" },
            { duration: "1 Year", price: "Rs. 1299", discount: "Save ~27%" }
        ],
        features: [
            "Assigned profile only",
            "No credential changes",
            "No mobile linking",
            "Single device access"
        ],
        accentColor: "blue-500",
        rating: 4.6
    },
    {
        id: 3,
        name: "Spotify Premium",
        icon: serviceIcons.spotify,
        description: "Ad-free music streaming with offline playback.",
        plans: [
            { duration: "1 Month", price: "Rs. 199", original: "Rs. 299" }, // Assuming original price
            { duration: "3 Months", price: "Rs. 579", discount: "Save ~2%" },
            { duration: "6 Months", price: "Rs. 1149", discount: "Save ~3%" },
            { duration: "1 Year", price: "Rs. 1799", discount: "Save ~16%" }
        ],
        features: [
            "Personal email access",
            "Password change allowed",
            "Mobile number optional",
            "Single device streaming"
        ],
        accentColor: "green-500",
        rating: 4.9
    },
    {
        id: 4,
        name: "YouTube Premium",
        icon: serviceIcons.youtube,
        description: "Ad-free videos with background play & music.",
        plans: [
            { duration: "1 Month", price: "Rs. 299", original: "Rs. 399" },
            { duration: "3 Months", price: "Rs. 849", discount: "Save ~5%" },
            { duration: "6 Months", price: "Rs. 1699", discount: "Save ~9%" },
            { duration: "1 Year", price: "Rs. 2999", discount: "Save ~16%" }
        ],
        features: [
            "Personal email access",
            "Full account control",
            "Mobile linking allowed",
            "Multiple device access"
        ],
        accentColor: "red-600", // Slightly different red for YouTube
        rating: 4.7
    },
    {
        id: 5,
        name: "Disney+ Hotstar",
        icon: serviceIcons.disney,
        description: "Premium content including Marvel, Star Wars & Live Sports.",
        plans: [
            { duration: "1 Month", price: "Rs. 349", original: "Rs. 499" },
            { duration: "3 Months", price: "Rs. 999", discount: "Save ~5%" },
            { duration: "6 Months", price: "Rs. 1899", discount: "Save ~7%" },
            { duration: "1 Year", price: "Rs. 3499", discount: "Save ~12%" }
        ],
        features: [
            "Dedicated profile",
            "Limited credential changes",
            "No mobile verification needed",
            "Two simultaneous streams"
        ],
        accentColor: "blue-600", // Slightly different blue for Disney
        rating: 4.5
    }
];

// --- Framer Motion Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Stagger animation for children
            when: "beforeChildren"
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05, // Faster stagger on exit
            staggerDirection: -1, // Reverse stagger direction
            when: "afterChildren"
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};


const Track = () => {
    const sliderRef = useRef(null);
    const [expandedCard, setExpandedCard] = useState(null);

    // --- Slider Settings (Slightly Adjusted) ---
    const settings = {
        dots: true,
        infinite: true,
        speed: 600, // Slightly slower for smoother feel
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '10px', // Add slight padding
        arrows: false,
        responsive: [
            {
                breakpoint: 1280, // Added XL breakpoint
                settings: {
                    slidesToShow: 3,
                    centerPadding: '0px',
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    centerPadding: '20px', // Adjust padding for 2 slides
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: '40px', // More padding for single slide view
                    dots: false // Hide dots on mobile for cleaner look
                }
            },
             {
                breakpoint: 480, // Smaller mobile
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: '20px',
                    dots: false
                }
            }
        ],
        // Custom Paging for dots styling
        customPaging: i => (
            <div className="w-2 h-2 rounded-full bg-gray-600 transition-colors duration-300 slick-dot-inactive"></div>
        ),
        appendDots: dots => (
          <div style={{ bottom: "-40px" }}> {/* Position dots below */}
            <ul style={{ margin: "0px" }}> {dots} </ul>
          </div>
        ),
    };

    const nextSlide = () => sliderRef.current?.slickNext();
    const prevSlide = () => sliderRef.current?.slickPrev();

    // --- Card Click Handler (Simplified - Removed isAnimating) ---
    const handleCardClick = (id) => {
        setExpandedCard(prevId => (prevId === id ? null : id));
    };

    return (
        // --- Main Section - Darker Theme ---
        <section className="bg-gradient-to-b from-gray-900 to-black py-16 md:py-24 px-4 overflow-hidden">
            <style>{`
              /* Style active slick dot */
              .slick-dots li.slick-active div {
                background-color: #e5e7eb; /* gray-200 */
              }
              .slick-slide > div { /* Ensure padding works with slick */
                 margin: 0 10px; /* Add horizontal margin between slides */
              }
               .slick-list { /* Counteract the margin for edge slides */
                 margin: 0 -10px;
               }
            `}</style>
            <div className="max-w-7xl mx-auto">
                {/* --- Section Header --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }} // Trigger animation once when 50% visible
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 mb-4">
                        Your Entertainment Hub
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                        Explore premium streaming subscriptions tailored for you.
                    </p>
                </motion.div>

                {/* --- Slider Container --- */}
                <div className="relative">
                    <Slider ref={sliderRef} {...settings}>
                        {services.map((service) => (
                            <div key={service.id} className="px-1 outline-none h-full"> {/* Reduced px slightly */}
                                {/* --- Service Card --- */}
                                <motion.div
                                    layout // Enables smooth layout changes
                                    onClick={() => handleCardClick(service.id)}
                                    // --- Card Styling (Darker, Accent Border) ---
                                    className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl cursor-pointer border border-gray-700/50 transition-shadow duration-300 hover:shadow-2xl min-h-[420px] flex flex-col border-t-4 border-${service.accentColor}`}
                                    whileHover={{ y: -5, scale: expandedCard ? 1 : 1.02 }} // Subtle lift on hover unless expanded
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    {/* --- Card Inner Content --- */}
                                    <motion.div
                                        layout="position" // Animate position changes
                                        className="p-5 md:p-6 flex flex-col flex-grow" // Use flex-grow
                                    >
                                        {/* Card Header */}
                                        <motion.div layout className="flex justify-between items-center mb-4">
                                            <img
                                                src={service.icon}
                                                alt={`${service.name} logo`}
                                                // Adjusted size and background for better visibility on dark bg
                                                className="h-10 md:h-12 w-auto object-contain bg-white/10 p-1 rounded"
                                            />
                                            {/* Rating Badge - Refined Look */}
                                            <div className="flex items-center bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                                                <FaStar className={`text-${service.accentColor} mr-1.5`} />
                                                <span className="text-gray-200 font-medium">{service.rating.toFixed(1)}</span>
                                            </div>
                                        </motion.div>

                                        {/* Card Main Content */}
                                        <motion.div layout="position">
                                            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">{service.name}</h3>
                                            <p className="text-gray-400 text-sm md:text-base mb-4 flex-grow">{service.description}</p> {/* Added flex-grow */}
                                        </motion.div>

                                        {/* --- Expanded Content Area --- */}
                                        <AnimatePresence initial={false}>
                                            {expandedCard === service.id && (
                                                <motion.div
                                                    // Variants for container animation
                                                    variants={containerVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    className="overflow-hidden" // Prevents content spill during animation
                                                >
                                                    {/* Plans Section */}
                                                    <motion.div variants={itemVariants} className="my-4 space-y-2">
                                                        {service.plans.map((plan, index) => (
                                                            <motion.div
                                                                key={index}
                                                                variants={itemVariants} // Animate each plan item
                                                                className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg text-sm"
                                                            >
                                                                <span className="text-gray-300 font-medium">{plan.duration}</span>
                                                                <div className="text-right">
                                                                    <span className={`text-white font-semibold mr-2`}>{plan.price}</span>
                                                                    {plan.original && (
                                                                        <span className="text-gray-500 text-xs line-through mr-2">{plan.original}</span>
                                                                    )}
                                                                    {plan.discount && (
                                                                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded bg-${service.accentColor}/30 text-${service.accentColor}`}>{plan.discount}</span>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>

                                                    {/* Features Section */}
                                                    <motion.div variants={itemVariants} className="mb-4">
                                                        <div className="flex items-center text-gray-400 mb-2 text-sm font-medium">
                                                            <FaLock className="mr-2" />
                                                            <span>Usage Guidelines</span>
                                                        </div>
                                                        <ul className="space-y-1.5">
                                                            {service.features.map((feature, index) => (
                                                                <motion.li
                                                                    key={index}
                                                                    variants={itemVariants} // Animate each feature item
                                                                    className="flex items-start text-sm"
                                                                >
                                                                    <FaCheckCircle className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                                                    <span className="text-gray-300">{feature}</span>
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Separator for visual spacing when expanded */}
                                        <motion.div layout className={`mt-auto pt-4 ${expandedCard === service.id ? 'border-t border-gray-700/50' : ''}`}>
                                          {/* Action Button */}
                                          <motion.button
                                              layout // Animate layout changes
                                              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-${service.accentColor} ${
                                                  expandedCard === service.id
                                                      ? `bg-${service.accentColor} hover:bg-opacity-90` // Accent color when expanded
                                                      : 'bg-gray-700 hover:bg-gray-600' // Neutral color when collapsed
                                              }`}
                                              whileTap={{ scale: 0.97 }}
                                          >
                                              {expandedCard === service.id ? "Select Plan" : "View Details"}
                                          </motion.button>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        ))}
                    </Slider>

                    {/* --- Navigation Arrows - Refined Styling --- */}
                    <button
                        onClick={prevSlide}
                        aria-label="Previous Slide"
                        className="hidden xl:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 rounded-full bg-gray-800/70 hover:bg-gray-700/90 backdrop-blur-sm transition-all duration-300 items-center justify-center text-white shadow-lg group"
                    >
                        <FaChevronLeft className="transform transition-transform duration-300 group-hover:-translate-x-1" />
                    </button>
                    <button
                        onClick={nextSlide}
                        aria-label="Next Slide"
                        className="hidden xl:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 z-10 w-12 h-12 rounded-full bg-gray-800/70 hover:bg-gray-700/90 backdrop-blur-sm transition-all duration-300 items-center justify-center text-white shadow-lg group"
                    >
                        <FaChevronRight className="transform transition-transform duration-300 group-hover:translate-x-1"/>
                    </button>
                </div>

                {/* --- Close button for expanded card (Mobile) --- */}
                <AnimatePresence>
                    {expandedCard && (
                        <motion.button
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            onClick={() => setExpandedCard(null)}
                            aria-label="Close Details"
                            // Adjusted styling for mobile close button
                            className="md:hidden fixed bottom-5 left-1/2 transform -translate-x-1/2 z-30 px-5 py-3 bg-gray-200 text-gray-900 rounded-full flex items-center shadow-xl font-medium"
                        >
                            <FaTimes className="mr-2 text-lg" />
                            <span>Close</span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

export default Track;