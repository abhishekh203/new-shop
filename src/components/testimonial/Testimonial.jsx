import React, { useState, useRef } from "react";
import Slider from "react-slick";
import { FaQuoteLeft, FaStar, FaRegStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { motion } from "framer-motion";

const Testimonial = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const sliderRef = useRef(null);
    
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 8000,
        arrows: false,
        pauseOnHover: true,
        beforeChange: (current, next) => setActiveSlide(next),
        appendDots: dots => (
            <div className="mt-6 md:mt-10">
                <ul className="flex justify-center gap-2">{dots}</ul>
            </div>
        ),
        customPaging: i => (
            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${i === activeSlide ? 'bg-orange-500 md:w-6' : 'bg-gray-600'}`}></div>
        )
    };

    const testimonials = [
        // ... (keep your existing testimonials array)
        {
            name: "Kamal Sharma",
            role: "Premium Member",
            content: "The instant delivery and premium quality accounts exceeded my expectations. I've purchased multiple times and never been disappointed. Their service is consistently reliable and the accounts work perfectly every time.",
            rating: 5,
            verified: true,
            purchaseTime: "2 minutes delivery",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Sita Basnet",
            role: "First-time Buyer",
            content: "As a first-time buyer, I was skeptical, but the seamless process and immediate access to my account won me over completely. The step-by-step guide made setup effortless, and I was up and running in minutes.",
            rating: 4,
            verified: false,
            purchaseTime: "5 minutes delivery",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: "Prakash Thapa",
            role: "Business User",
            content: "The value for money is unmatched. I've compared multiple providers and none offer this combination of speed, reliability and price. We've saved thousands on our software budget without compromising quality.",
            rating: 5,
            verified: true,
            purchaseTime: "Instant delivery",
            avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
            name: "Bishal Rai",
            role: "Frequent Buyer",
            content: "Customer support is responsive 24/7. They resolved my query within minutes, even at 2AM! That's service excellence. I've made over 20 purchases and each experience has been flawless.",
            rating: 5,
            verified: true,
            purchaseTime: "3 minutes delivery",
            avatar: "https://randomuser.me/api/portraits/men/75.jpg"
        },
        {
            name: "Aayush Khatri",
            role: "Enterprise Client",
            content: "For bulk purchases, their corporate solutions are perfect. We've integrated their API for automatic provisioning across our team. The dashboard makes managing hundreds of licenses simple and efficient.",
            rating: 5,
            verified: true,
            purchaseTime: "Bulk delivery in 15 mins",
            avatar: "https://randomuser.me/api/portraits/men/81.jpg"
        },
        {
            name: "Shreya Maharjan",
            role: "Student User",
            content: "As a student, their affordable pricing makes premium services accessible. The educational discount was a pleasant surprise! I can now use professional tools that were previously out of my budget.",
            rating: 4,
            verified: false,
            purchaseTime: "7 minutes delivery",
            avatar: "https://randomuser.me/api/portraits/women/63.jpg"
        },
        {
            name: "Rajesh Gurung",
            role: "Developer",
            content: "The API integration was seamless with excellent documentation. Our automated systems now handle all purchases and the webhooks keep everything in sync. Technical support is knowledgeable and helpful.",
            rating: 5,
            verified: true,
            purchaseTime: "API response in 30s",
            avatar: "https://randomuser.me/api/portraits/men/45.jpg"
        },
        {
            name: "Anita Limbu",
            role: "Digital Marketer",
            content: "I manage multiple client accounts and need reliable service. This provider never lets me down. The multi-login feature saves me hours of work each week. Highly recommended for agencies!",
            rating: 5,
            verified: true,
            purchaseTime: "4 minutes delivery",
            avatar: "https://randomuser.me/api/portraits/women/72.jpg"
        }
    ];

    // Custom arrow components with touch-friendly sizing
    const NextArrow = () => (
        <button 
            onClick={() => sliderRef.current.slickNext()}
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-800 bg-opacity-70 hover:bg-orange-500 flex items-center justify-center text-white transition-all shadow-lg hover:shadow-orange-500/30"
            aria-label="Next testimonial"
        >
            <FaChevronRight className="text-sm md:text-xl" />
        </button>
    );

    const PrevArrow = () => (
        <button 
            onClick={() => sliderRef.current.slickPrev()}
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-800 bg-opacity-70 hover:bg-orange-500 flex items-center justify-center text-white transition-all shadow-lg hover:shadow-orange-500/30"
            aria-label="Previous testimonial"
        >
            <FaChevronLeft className="text-sm md:text-xl" />
        </button>
    );

    return (
        <section className="relative bg-gradient-to-br from-gray-900 via-black to-blue-900 py-12 md:py-20 overflow-hidden">
            {/* Simplified animated background for mobile */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
                <motion.div 
                    className="absolute top-20 left-10 md:left-20 w-20 h-20 md:w-40 md:h-40 bg-blue-500 rounded-full filter blur-xl md:blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 0.5, 0.8]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                ></motion.div>
                <motion.div 
                    className="absolute bottom-10 right-10 md:right-20 w-20 h-20 md:w-60 md:h-60 bg-orange-500 rounded-full filter blur-xl md:blur-3xl"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 0.4, 0.7]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                ></motion.div>
            </div>

            <div className="container px-4 sm:px-6 mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-16">
                    <motion.h2 
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Thousands</span>
                    </motion.h2>
                    <motion.p 
                        className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Join our community of satisfied customers
                    </motion.p>
                </div>

                {/* Testimonials Slider */}
                <div className="max-w-3xl mx-auto relative px-2">
                    <Slider ref={sliderRef} {...settings}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="px-1 sm:px-2 outline-none">
                                <motion.div 
                                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-700 shadow-lg hover:shadow-orange-500/10"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="flex flex-col sm:flex-row items-start">
                                        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4 md:mr-6">
                                            <img 
                                                src={testimonial.avatar} 
                                                alt={testimonial.name}
                                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-orange-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <FaQuoteLeft className="text-2xl md:text-3xl text-orange-500 opacity-20 mb-3 -mt-1" />
                                            
                                            <p className="text-sm sm:text-base md:text-lg text-gray-100 font-light leading-relaxed mb-4 md:mb-6">
                                                {testimonial.content}
                                            </p>
                                            
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white flex items-center">
                                                        {testimonial.name}
                                                        {testimonial.verified && (
                                                            <RiVerifiedBadgeFill className="ml-1 md:ml-2 text-blue-400 text-sm md:text-base" />
                                                        )}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-400">{testimonial.role}</p>
                                                </div>
                                                
                                                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                                                    <div className="flex items-center space-x-0.5 sm:space-x-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            i < testimonial.rating ? 
                                                            <FaStar key={i} className="text-sm sm:text-base md:text-lg text-orange-400" /> : 
                                                            <FaRegStar key={i} className="text-sm sm:text-base md:text-lg text-gray-600" />
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="flex items-center text-xs sm:text-sm text-gray-400">
                                                        <IoMdTime className="mr-1" />
                                                        <span>{testimonial.purchaseTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </Slider>

                    {/* Custom Arrows - Always visible but smaller on mobile */}
                    <div className="hidden sm:block">
                        <NextArrow />
                        <PrevArrow />
                    </div>
                </div>

                {/* Stats - Stack on mobile */}
                <motion.div 
                    className="mt-10 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    {[
                        { value: "10K+", label: "Happy Customers" },
                        { value: "99.8%", label: "Success Rate" },
                        { value: "24/7", label: "Support Available" },
                        { value: "2min", label: "Avg Delivery" }
                    ].map((stat, index) => (
                        <div key={index} className="bg-gray-800 bg-opacity-50 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-700 hover:border-orange-500 transition-all hover:-translate-y-1">
                            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-400 mb-1 sm:mb-2">{stat.value}</div>
                            <div className="text-xs sm:text-sm md:text-base text-gray-300">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonial;