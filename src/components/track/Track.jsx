import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight, FaCheck, FaLock, FaStar, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const serviceIcons = {
    netflix: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    prime: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
    spotify: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    youtube: "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png",
    disney: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg"
};

const Track = () => {
    const sliderRef = useRef(null);
    const [expandedCard, setExpandedCard] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0',
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };
const services = [
            {
                id: 1,
                name: "Netflix Premium",
                icon: serviceIcons.netflix,
                description: "Private 4K quality on 1 screen with full access",
                plans: [
                    { duration: "1 Month", price: "Rs. 399", original: "Rs. 649" },
                    { duration: "3 Months", price: "Rs. 1169", discount: "10% OFF" },
                    { duration: "6 Months", price: "Rs. 2300", discount: "15% OFF" },
                    { duration: "1 Year", price: "Rs. 4499", discount: "25% OFF" }
                ],
                features: [
                    "Use only the provided profile",
                    "Don't change account credentials",
                    "No mobile number linking",
                    "Single device login"
                ],
                color: "from-red-600 to-red-900",
                highlight: "bg-red-500",
                rating: 4.8
            },
            {
                id: 2,
                name: "Prime Video",
                icon: serviceIcons.prime,
                description: "HD streaming including Amazon Originals",
                plans: [
                    { duration: "1 Month", price: "Rs. 199", original: "Rs. 299" },
                    { duration: "3 Months", price: "Rs. 449", discount: "15% OFF" },
                    { duration: "6 Months", price: "Rs. 699", discount: "20% OFF" },
                    { duration: "1 Year", price: "Rs. 1299", discount: "30% OFF" }
                ],
                features: [
                    "Assigned profile only",
                    "No credential changes",
                    "No mobile linking",
                    "Single device access"
                ],
                color: "from-blue-600 to-blue-900",
                highlight: "bg-blue-500",
                rating: 4.6
            },
            {
                id: 3,
                name: "Spotify Premium",
                icon: serviceIcons.spotify,
                description: "Ad-free music streaming with offline playback",
                plans: [
                    { duration: "1 Month", price: "Rs. 199", original: "Rs. 299" },
                    { duration: "3 Months", price: "Rs. 579", discount: "10% OFF" },
                    { duration: "6 Months", price: "Rs. 1149", discount: "15% OFF" },
                    { duration: "1 Year", price: "Rs. 1799", discount: "25% OFF" }
                ],
                features: [
                    "Personal email access",
                    "Password change allowed",
                    "Mobile number optional",
                    "Single device streaming"
                ],
                color: "from-green-600 to-green-900",
                highlight: "bg-green-500",
                rating: 4.9
            },
            {
                id: 4,
                name: "YouTube Premium",
                icon: serviceIcons.youtube,
                description: "Ad-free videos with background play",
                plans: [
                    { duration: "1 Month", price: "Rs. 299", original: "Rs. 399" },
                    { duration: "3 Months", price: "Rs. 849", discount: "10% OFF" },
                    { duration: "6 Months", price: "Rs. 1699", discount: "15% OFF" },
                    { duration: "1 Year", price: "Rs. 2999", discount: "20% OFF" }
                ],
                features: [
                    "Personal email access",
                    "Full account control",
                    "Mobile linking allowed",
                    "Multiple device access"
                ],
                color: "from-red-500 to-red-800",
                highlight: "bg-red-400",
                rating: 4.7
            },
            {
                id: 5,
                name: "Disney+ Hotstar",
                icon: serviceIcons.disney,
                description: "Premium content including Marvel and Star Wars",
                plans: [
                    { duration: "1 Month", price: "Rs. 349", original: "Rs. 499" },
                    { duration: "3 Months", price: "Rs. 999", discount: "15% OFF" },
                    { duration: "6 Months", price: "Rs. 1899", discount: "20% OFF" },
                    { duration: "1 Year", price: "Rs. 3499", discount: "30% OFF" }
                ],
                features: [
                    "Dedicated profile",
                    "Limited credential changes",
                    "No mobile verification",
                    "Two simultaneous streams"
                ],
                color: "from-blue-400 to-blue-800",
                highlight: "bg-blue-400",
                rating: 4.5
            }
        ];

    const nextSlide = () => sliderRef.current.slickNext();
    const prevSlide = () => sliderRef.current.slickPrev();

    const handleCardClick = (id) => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        if (expandedCard === id) {
            setExpandedCard(null);
        } else {
            setExpandedCard(id);
        }
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <section className="bg-gray-900 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Streaming Services
                    </h2>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Choose your perfect entertainment package
                    </p>
                </motion.div>

                <div className="relative">
                    <Slider ref={sliderRef} {...settings}>
                        {services.map((service) => (
                            <div key={service.id} className="px-2 outline-none">
                                <motion.div
                                    layout
                                    onClick={() => handleCardClick(service.id)}
                                    className={`${service.color} rounded-lg overflow-hidden shadow-lg cursor-pointer`}
                                    whileHover={{ scale: expandedCard ? 1 : 1.03 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <motion.div 
                                        layout
                                        className="p-5 h-full"
                                        animate={{
                                            height: expandedCard === service.id ? "auto" : "400px"
                                        }}
                                    >
                                        {/* Card Header */}
                                        <motion.div layout className="flex justify-between items-start mb-4">
                                            <img 
                                                src={service.icon} 
                                                alt={service.name} 
                                                className="h-12 w-auto object-contain"
                                            />
                                            <div className="flex items-center bg-black/20 px-2 py-1 rounded-full">
                                                <FaStar className="text-yellow-400 mr-1 text-sm" />
                                                <span className="text-white text-sm">{service.rating.toFixed(1)}</span>
                                            </div>
                                        </motion.div>

                                        {/* Card Content */}
                                        <motion.div layout>
                                            <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                                            <p className="text-gray-200 mb-4">{service.description}</p>

                                            <AnimatePresence>
                                                {expandedCard === service.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        {/* Plans */}
                                                        <div className="mb-5 space-y-3">
                                                            {service.plans.map((plan, index) => (
                                                                <div key={index} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                                                    <span className="text-gray-200">{plan.duration}</span>
                                                                    <div className="text-right">
                                                                        <span className="text-white font-medium">{plan.price}</span>
                                                                        {plan.original && (
                                                                            <span className="text-gray-400 text-xs line-through ml-2">{plan.original}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Features */}
                                                        <div className="mb-5">
                                                            <div className="flex items-center text-gray-300 mb-3">
                                                                <FaLock className="mr-2" />
                                                                <span>Usage Guidelines</span>
                                                            </div>
                                                            <ul className="space-y-2">
                                                                {service.features.map((feature, index) => (
                                                                    <li key={index} className="flex items-start">
                                                                        <FaCheck className="text-green-400 mt-1 mr-2 flex-shrink-0" />
                                                                        <span className="text-gray-300 text-sm">{feature}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        {/* Get Started Button */}
                                        <motion.button
                                            layout
                                            className={`w-full mt-4 py-2 rounded-lg font-medium text-white ${expandedCard === service.id ? 'bg-black/30' : 'bg-black/20'} hover:bg-black/40 transition-colors`}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {expandedCard === service.id ? "Select Plan" : "View Details"}
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            </div>
                        ))}
                    </Slider>

                    {/* Navigation Arrows */}
                    <button 
                        onClick={prevSlide}
                        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 z-10 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white shadow-lg"
                    >
                        <FaChevronLeft />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 z-10 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white shadow-lg"
                    >
                        <FaChevronRight />
                    </button>
                </div>

                {/* Close button for expanded card (mobile) */}
                <AnimatePresence>
                    {expandedCard && (
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            onClick={() => setExpandedCard(null)}
                            className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-gray-800 text-white rounded-full flex items-center shadow-xl"
                        >
                            <FaTimes className="mr-2" />
                            Close
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

export default Track;