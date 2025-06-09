import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import {
  FaStar, FaUsers, FaShieldAlt, FaQuoteLeft, FaCheckCircle,
  FaHeart, FaThumbsUp, FaAward, FaCrown, FaFire
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { BsStars } from 'react-icons/bs';

// Scrolling Image Column Component
const ScrollingImageColumn = ({ images, durationMultiplier, columnId, initialY = "0%" }) => {
    const scrollAnimation = {
        animate: {
            y: [initialY, initialY === "0%" ? "-50%" : "0%"],
        },
        transition: {
            y: {
                duration: images.length * durationMultiplier,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
            },
        },
    };

    return (
        <div
            key={`column-container-${columnId}`}
            className="h-[550px] sm:h-[600px] md:h-[700px] overflow-hidden relative w-full rounded-2xl border border-gray-700/30 shadow-2xl bg-gray-900/30 backdrop-blur-sm"
        >
            {/* Gradient overlay for smooth top fade */}
            <div className="absolute top-0 left-0 w-full h-16 md:h-24 bg-gradient-to-b from-gray-950/90 via-gray-950/60 to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex flex-col"
                animate={scrollAnimation.animate}
                transition={scrollAnimation.transition}
            >
                {/* Render images twice for seamless loop */}
                {[...images, ...images].map((imageUrl, index) => (
                    <motion.div
                        key={`col-${columnId}-img-${index}`}
                        className="w-full p-2 md:p-3"
                        whileHover={{ scale: 1.03, zIndex: 10 }}
                        transition={{ type: "spring", stiffness: 300, duration: 0.2 }}
                    >
                        <img
                            src={imageUrl}
                            alt={`Customer review ${index % images.length + 1} in column ${columnId}`}
                            className="w-full h-auto object-cover rounded-xl shadow-lg border border-gray-600/40 hover:border-teal-400/50 transition-all duration-300"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://placehold.co/400x500/2D3748/A0AEC0?text=Review+Image&font=montserrat`;
                            }}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Gradient overlay for smooth bottom fade */}
            <div className="absolute bottom-0 left-0 w-full h-16 md:h-24 bg-gradient-to-t from-gray-950/90 via-gray-950/60 to-transparent z-10 pointer-events-none" />
        </div>
    );
};


const ReviewsPage = () => {
    // Image data for scrolling testimonials
    const allTestimonialImages = [
        "/img/w_image/r1.jpg", "/img/p_proof/p1.jpg", "/img/w_image/r2.jpg",
        "/img/w_image/r3.jpg", "/img/p_proof/p2.jpg", "/img/w_image/r4.jpg",
        "/img/w_image/r5.jpg", "/img/p_proof/p3.jpg", "/img/w_image/r6.jpg",
        "/img/w_image/r7.jpg", "/img/p_proof/p4.jpg", "/img/w_image/r8.jpg",
        "/img/w_image/r1.jpg", "/img/p_proof/p1.jpg", "/img/w_image/r2.jpg",
    ];

    // Split images into columns
    const column1Images = allTestimonialImages.filter((_, i) => i % 3 === 0);
    const column2Images = allTestimonialImages.filter((_, i) => i % 3 === 1);
    const column3Images = allTestimonialImages.filter((_, i) => i % 3 === 2);

    // Customer reviews data
    const reviews = [
        {
            id: 1,
            name: "Rajesh K.",
            status: "VIP Member",
            avatar: "https://i.pravatar.cc/150?u=rajeshk",
            rating: 5,
            review: "Digital Shop Nepal is my go-to! Been buying Netflix and SonyLIV for over a year. Support on WhatsApp is super fast if anything goes wrong. Always get a replacement quickly. Best price in Nepal!",
            date: "2 weeks ago",
            verified: true
        },
        {
            id: 2,
            name: "Sunita G.",
            status: "Verified Buyer",
            avatar: "https://i.pravatar.cc/150?u=sunitag",
            rating: 5,
            review: "First time buying a Netflix account online, was a bit nervous. But delivery was instant after payment via Esewa. Account works perfectly. Very happy with the service and price!",
            date: "1 month ago",
            verified: true
        },
        {
            id: 3,
            name: "Aarav P.",
            status: "Verified Buyer",
            avatar: "https://i.pravatar.cc/150?u=aaravp",
            rating: 5,
            review: "Needed Hotstar for the cricket season. Got it here much cheaper than the official site. Smooth process, received login details within minutes. Highly recommend!",
            date: "3 weeks ago",
            verified: true
        },
        {
            id: 4,
            name: "Priya S.",
            status: "Verified Buyer",
            avatar: "https://i.pravatar.cc/150?u=priyas",
            rating: 4,
            review: "Bought a shared Netflix plan. Works great on my TV and phone. Good value for money compared to other options. Reliable service so far.",
            date: "1 week ago",
            verified: true
        },
        {
            id: 5,
            name: "Bikash T.",
            status: "Repeat Customer",
            avatar: "https://i.pravatar.cc/150?u=bikasht",
            rating: 5,
            review: "Always reliable for premium accounts. Fair prices and excellent customer care. They even helped me troubleshoot a login issue late at night. Trustworthy seller.",
            date: "4 days ago",
            verified: true
        },
        {
            id: 6,
            name: "Maya L.",
            status: "New Customer",
            avatar: "https://i.pravatar.cc/150?u=mayal",
            rating: 5,
            review: "Amazing service! Got my Spotify Premium instantly. The quality is excellent and customer support is very responsive. Will definitely buy again!",
            date: "5 days ago",
            verified: true
        }
    ];

    // Stats data
    const stats = [
        {
            icon: <FaStar className="text-yellow-400" />,
            value: "4.9",
            label: "Average Rating",
            description: "From 1000+ reviews"
        },
        {
            icon: <FaUsers className="text-teal-400" />,
            value: "5000+",
            label: "Happy Customers",
            description: "Across Nepal"
        },
        {
            icon: <FaShieldAlt className="text-green-400" />,
            value: "99.8%",
            label: "Success Rate",
            description: "Delivery guarantee"
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100 }
        }
    };


    return (
        <Layout>
            <div className="min-h-screen bg-black relative overflow-hidden">
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
                {/* Enhanced Hero Section */}
                <section className="relative py-20 md:py-32 overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-20"
                        >
                            {/* Enhanced Badge */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-8"
                            >
                                <BsStars className="text-yellow-400" />
                                Trusted by 5000+ customers
                                <FaCheckCircle className="text-green-400" />
                            </motion.div>

                            {/* Enhanced Title */}
                            <motion.h1
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-6xl md:text-8xl font-black mb-8 leading-tight"
                            >
                                <span className="text-white">Customer </span>
                                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                                    Reviews
                                </span>
                            </motion.h1>

                            {/* Enhanced Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
                            >
                                Real experiences from thousands of satisfied customers across Nepal who trust our
                                <span className="text-cyan-400 font-semibold"> premium digital services</span>
                            </motion.p>

                            {/* Enhanced Rating Display */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="flex flex-wrap justify-center items-center gap-8 mb-12"
                            >
                                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm px-6 py-3 rounded-full border border-yellow-500/30">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className="text-xl text-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="text-white text-xl font-bold ml-2">4.9/5</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm px-6 py-3 rounded-full border border-green-500/30">
                                    <FaThumbsUp className="text-green-400" />
                                    <span className="text-green-300 font-medium">1000+ reviews</span>
                                </div>
                            </motion.div>

                            {/* Trust Indicators */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1 }}
                                className="flex flex-wrap justify-center gap-6"
                            >
                                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/30">
                                    <FaCrown className="text-yellow-400" />
                                    <span className="text-purple-300 font-medium text-sm">VIP Members</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-red-500/30">
                                    <FaFire className="text-red-400" />
                                    <span className="text-red-300 font-medium text-sm">Trending</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-500/30">
                                    <FaAward className="text-teal-400" />
                                    <span className="text-teal-300 font-medium text-sm">Best Service</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Modern Scrolling Reviews Gallery */}
                <section className="relative bg-black py-20 md:py-32 overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none">
                        <motion.div
                            className="absolute top-[-10%] left-[-5%] w-72 h-72 md:w-96 md:h-96 bg-purple-600 rounded-full filter blur-3xl opacity-50"
                            animate={{
                                x: [0, 50, 0, -50, 0],
                                y: [0, -30, 0, 30, 0],
                                scale: [1, 1.1, 1, 0.9, 1]
                            }}
                            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute bottom-[-15%] right-[-10%] w-80 h-80 md:w-[500px] md:h-[500px] bg-orange-500 rounded-full filter blur-3xl opacity-40"
                            animate={{
                                x: [0, -40, 0, 40, 0],
                                y: [0, 20, 0, -20, 0],
                                rotate: [0, 10, 0, -10, 0]
                            }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute top-[30%] right-[40%] w-40 h-40 md:w-60 md:h-60 bg-teal-500 rounded-full filter blur-2xl opacity-30"
                            animate={{
                                x: [0, 20, 0, -20, 0],
                                y: [0, -15, 0, 15, 0]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "circInOut" }}
                        />
                    </div>

                    <div className="container px-4 sm:px-6 mx-auto relative z-10">
                        {/* Section Header */}
                        <div className="text-center mb-12 md:mb-16">
                            <motion.h2
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                            >
                                Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">Everyone</span>
                            </motion.h2>
                            <motion.p
                                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                            >
                                Real customer testimonials and proof of our excellent service
                            </motion.p>
                        </div>

                        {/* Floating indicator */}
                        <div className="relative flex flex-col items-center mb-10 md:mb-16 z-20">
                            <motion.div
                                className="h-12 sm:h-16 w-0.5 bg-gray-500/70"
                                initial={{ scaleY: 0, originY: 0 }}
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                            />
                            <motion.div
                                className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white py-3 px-6 sm:py-4 sm:px-8 rounded-2xl shadow-2xl transform origin-top"
                                initial={{ opacity: 0, y: -20, scale: 0.7, rotate: -10 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    rotate: [-5, 5, -5],
                                    x: [0, 10, -10, 0]
                                }}
                                transition={{
                                    default: { type: "spring", stiffness: 100, damping: 10, delay: 0.9 },
                                    rotate: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: 1.5 },
                                    x: { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: 1.5 }
                                }}
                                whileHover={{ scale: 1.05, rotate: 0, boxShadow: "0px 10px 30px rgba(245, 158, 11, 0.5)" }}
                            >
                                <span className="font-semibold text-md sm:text-lg md:text-xl tracking-tight flex items-center">
                                    <FaQuoteLeft className="mr-2" />
                                    What users say about us
                                </span>
                            </motion.div>
                        </div>

                        {/* Scrolling Images Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 max-w-7xl mx-auto">
                            <ScrollingImageColumn
                                images={column1Images}
                                durationMultiplier={6}
                                columnId="1"
                            />
                            <div className="mt-0 sm:mt-8 md:-mt-16">
                                <ScrollingImageColumn
                                    images={column2Images}
                                    durationMultiplier={7.5}
                                    columnId="2"
                                    initialY="-25%"
                                />
                            </div>
                            <div className="mt-0 sm:mt-0 md:mt-8">
                                <ScrollingImageColumn
                                    images={column3Images}
                                    durationMultiplier={6.5}
                                    columnId="3"
                                />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <motion.div
                            className="mt-16 md:mt-24 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8, staggerChildren: 0.1 }}
                        >
                            {[
                                { value: "10K+", label: "Happy Customers" },
                                { value: "99.8%", label: "Success Rate" },
                                { value: "24/7", label: "Support Available" },
                                { value: "2min", label: "Avg Delivery" },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-700/50 transition-all duration-300 cursor-pointer hover:bg-gray-700/60 hover:border-orange-400/50 hover:scale-105"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                    whileHover={{
                                        y: -5,
                                        boxShadow: "0px 10px 20px rgba(234, 88, 12, 0.3)",
                                        borderColor: "rgba(234, 88, 12, 0.7)"
                                    }}
                                >
                                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400 mb-1.5 sm:mb-2.5">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs sm:text-sm md:text-base text-gray-300">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Modern Stats Section */}
                <section className="py-16 bg-gray-800/30 backdrop-blur-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                    whileHover={{ scale: 1.05, y: -10 }}
                                    className="group text-center p-8 bg-gradient-to-br from-gray-800/80 to-gray-700/60 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl hover:shadow-teal-500/20 transition-all duration-300"
                                >
                                    <div className="flex justify-center mb-6 text-5xl group-hover:scale-110 transition-transform duration-300">
                                        {stat.icon}
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors duration-300">
                                        {stat.value}
                                    </h3>
                                    <p className="text-xl font-semibold text-gray-300 mb-2">{stat.label}</p>
                                    <p className="text-gray-400">{stat.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Enhanced Reviews Section */}
                <section className="py-20 bg-gradient-to-br from-gray-900/50 to-black relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 20% 20%, #1f2937 0%, transparent 50%),
                                             radial-gradient(circle at 80% 80%, #374151 0%, transparent 50%)`,
                            backgroundSize: '200px 200px'
                        }}></div>
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-20"
                        >
                            {/* Enhanced Section Header */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium mb-8"
                            >
                                <HiSparkles className="text-yellow-400" />
                                Customer Testimonials
                                <HiLightningBolt className="text-blue-400" />
                            </motion.div>

                            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                                What Our <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Customers</span> Say
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                                Real experiences from real customers who trust Digital Shop Nepal for their
                                <span className="text-cyan-400 font-semibold"> premium digital services</span>
                            </p>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {reviews.map((review) => (
                                <motion.div
                                    key={review.id}
                                    variants={itemVariants}
                                    whileHover={{
                                        y: -15,
                                        scale: 1.03,
                                        rotateY: 5,
                                        boxShadow: "0 25px 50px rgba(6, 182, 212, 0.15)"
                                    }}
                                    className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/30 hover:border-cyan-400/40 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Background Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-blue-600/0 group-hover:from-cyan-600/5 group-hover:to-blue-600/5 transition-all duration-500 rounded-2xl"></div>

                                    {/* Quote Icon */}
                                    <div className="absolute top-6 right-6 text-cyan-400/20 group-hover:text-cyan-400/40 transition-colors duration-300">
                                        <FaQuoteLeft className="text-3xl" />
                                    </div>

                                    {/* Header */}
                                    <div className="relative z-10 flex items-center mb-6">
                                        <motion.img
                                            src={review.avatar}
                                            alt={review.name}
                                            className="w-16 h-16 rounded-full border-2 border-cyan-400/50 mr-4 object-cover"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                                                {review.name}
                                            </h3>
                                            <p className="text-sm text-cyan-400 font-medium">{review.status}</p>
                                            <p className="text-xs text-gray-400">{review.date}</p>
                                        </div>
                                        {review.verified && (
                                            <motion.div
                                                className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <FaCheckCircle className="text-xs" />
                                                Verified
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Enhanced Rating */}
                                    <div className="relative z-10 flex items-center mb-6">
                                        <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: i * 0.1, duration: 0.3 }}
                                                >
                                                    <FaStar
                                                        className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                        <span className="ml-3 text-gray-400 text-sm font-medium">({review.rating}/5)</span>
                                    </div>

                                    {/* Enhanced Review Text */}
                                    <blockquote className="relative z-10 text-gray-300 leading-relaxed text-sm group-hover:text-gray-200 transition-colors duration-300">
                                        "{review.review}"
                                    </blockquote>

                                    {/* Hover Shine Effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                        style={{ transform: 'skewX(-20deg)' }}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>



                {/* Enhanced Call to Action Section */}
                <section className="py-20 bg-black relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 30% 30%, #1f2937 0%, transparent 50%),
                                             radial-gradient(circle at 70% 70%, #374151 0%, transparent 50%)`,
                            backgroundSize: '200px 200px'
                        }}></div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            className="absolute top-20 left-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"
                            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute bottom-20 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"
                            animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-5xl mx-auto"
                        >
                            {/* Enhanced CTA Badge */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-8"
                            >
                                <FaHeart className="text-red-400" />
                                Join the community
                                <HiSparkles className="text-yellow-400" />
                            </motion.div>

                            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                                Ready to Join Our <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Happy</span> Customers?
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                                Experience premium digital services at unbeatable prices. Join thousands of satisfied customers across Nepal and discover why we're the
                                <span className="text-cyan-400 font-semibold"> #1 choice for digital subscriptions!</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                                <motion.a
                                    href="/allproduct"
                                    whileHover={{
                                        scale: 1.05,
                                        y: -5,
                                        boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl border border-cyan-400/20 text-lg"
                                >
                                    <FaFire className="text-orange-400" />
                                    Shop Now
                                    <HiLightningBolt className="text-yellow-400" />
                                </motion.a>

                                <motion.a
                                    href="/ContactUs"
                                    whileHover={{
                                        scale: 1.05,
                                        y: -5,
                                        backgroundColor: "rgba(6, 182, 212, 0.1)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-gray-600/50 hover:border-cyan-400/50 text-white font-bold rounded-2xl transition-all duration-300 text-lg"
                                >
                                    <FaUsers className="text-cyan-400" />
                                    Contact Support
                                </motion.a>
                            </div>

                            {/* Enhanced Trust Indicators */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex flex-wrap justify-center items-center gap-8"
                            >
                                <div className="flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
                                    <FaShieldAlt className="text-green-400" />
                                    <span className="text-green-300 font-medium">100% Secure</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-500/30">
                                    <FaStar className="text-yellow-400" />
                                    <span className="text-yellow-300 font-medium">4.9/5 Rating</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-500/30">
                                    <FaUsers className="text-cyan-400" />
                                    <span className="text-cyan-300 font-medium">5000+ Customers</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default ReviewsPage;