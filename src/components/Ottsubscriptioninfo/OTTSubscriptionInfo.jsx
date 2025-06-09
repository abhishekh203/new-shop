import React from 'react';
import { motion } from 'framer-motion';
import {
  FaStar, FaCheckCircle, FaShippingFast, FaWhatsapp,
  FaGlobe, FaAward, FaCrown, FaFire, FaHeart, FaUsers, FaShieldAlt,
  FaRocket, FaTrophy, FaGem
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { BsStars } from 'react-icons/bs';

const OTTSubscriptionInfo = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6
            }
        }
    };

    const stats = [
        {
            value: "10,000+",
            label: "Orders Delivered",
            icon: <FaShippingFast className="text-2xl" />,
            color: "from-blue-600/20 to-cyan-600/20",
            border: "border-blue-500/30",
            iconColor: "text-blue-400"
        },
        {
            value: "9,500+",
            label: "Happy Customers",
            icon: <FaUsers className="text-2xl" />,
            color: "from-green-600/20 to-emerald-600/20",
            border: "border-green-500/30",
            iconColor: "text-green-400"
        },
        {
            value: "4.8/5",
            label: "Average Rating",
            icon: <FaStar className="text-2xl" />,
            color: "from-yellow-600/20 to-orange-600/20",
            border: "border-yellow-500/30",
            iconColor: "text-yellow-400"
        },
        {
            value: "2019",
            label: "Established Since",
            icon: <FaTrophy className="text-2xl" />,
            color: "from-purple-600/20 to-pink-600/20",
            border: "border-purple-500/30",
            iconColor: "text-purple-400"
        }
    ];

    // WhatsApp redirect function
    const handleJoinProgram = () => {
        window.open('https://chat.whatsapp.com/IXl6YmkAZgEJkveJgbatAP?text=Hi%20Netflix%20Nepal,%20I%20want%20to%20join%20your%20partner%20program', '_blank');
    };

    return (
        <section className="bg-black py-16 px-4 relative overflow-hidden">
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
                {/* Enhanced Header Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={containerVariants}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    {/* Modern Badge */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium mb-8"
                    >
                        <BsStars className="text-yellow-400" />
                        About Our Company
                        <FaCrown className="text-yellow-400" />
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight"
                    >
                        Who <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 bg-clip-text text-transparent">We Are?</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8"
                    >
                        We are proud to be Nepal's <span className="text-cyan-400 font-semibold">#1 digital subscription store</span>, dedicated to providing discounted premium subscriptions to customers worldwide with instant email delivery.
                    </motion.p>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        <div className="flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
                            <FaShieldAlt className="text-green-400" />
                            <span className="text-green-300 font-medium text-sm">Trusted Platform</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/30">
                            <FaGlobe className="text-blue-400" />
                            <span className="text-blue-300 font-medium text-sm">Global Delivery</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/30">
                            <FaRocket className="text-purple-400" />
                            <span className="text-purple-300 font-medium text-sm">Instant Access</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Enhanced Stats Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={containerVariants}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    {/* Stats Header */}
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-6"
                        >
                            <FaAward className="text-yellow-400" />
                            Our Achievements
                            <FaFire className="text-orange-400" />
                        </motion.div>

                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Numbers That <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Speak</span>
                        </h3>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Our track record of excellence and customer satisfaction
                        </p>
                    </div>

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{
                                    y: -10,
                                    scale: 1.05,
                                    boxShadow: "0 25px 50px rgba(6, 182, 212, 0.15)"
                                }}
                                className={`group relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl p-6 md:p-8 rounded-2xl border ${stat.border} transition-all duration-500 cursor-pointer overflow-hidden`}
                            >
                                {/* Background Glow Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    {/* Icon Container */}
                                    <motion.div
                                        className="mb-4 p-3 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/30 group-hover:border-cyan-400/40 transition-all duration-300"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={stat.iconColor}>
                                            {stat.icon}
                                        </div>
                                    </motion.div>

                                    {/* Value */}
                                    <h3 className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                                        {stat.value}
                                    </h3>

                                    {/* Label */}
                                    <p className="text-gray-400 group-hover:text-gray-200 transition-colors duration-300 font-medium text-sm md:text-base">
                                        {stat.label}
                                    </p>
                                </div>

                                {/* Hover Shine Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                    style={{ transform: 'skewX(-20deg)' }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Enhanced Achievements Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-gray-700/30 mb-8 shadow-2xl overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 rounded-2xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            {/* Section Badge */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium mb-6"
                            >
                                <FaGem className="text-yellow-400" />
                                Our Journey
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                                Our <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Achievements</span>
                            </h2>

                            <div className="space-y-6">
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="text-gray-300 text-lg leading-relaxed"
                                >
                                    Over the past five years, we've successfully delivered premium subscriptions to customers in over
                                    <span className="text-cyan-400 font-bold"> 15 countries</span>, maintaining an exceptional service record with
                                    <span className="text-green-400 font-bold"> 99.8% success rate</span>.
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="text-gray-300 text-lg leading-relaxed"
                                >
                                    Since our establishment in <span className="text-yellow-400 font-bold">July 2019</span>, we've consistently provided top-quality services at unbeatable prices, helping thousands save on their digital subscriptions while building lasting relationships.
                                </motion.p>

                                {/* Achievement Highlights */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    className="flex flex-wrap gap-4 mt-8"
                                >
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
                                        <FaHeart className="text-red-400" />
                                        <span className="text-green-300 font-medium text-sm">Customer First</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/30">
                                        <HiLightningBolt className="text-yellow-400" />
                                        <span className="text-blue-300 font-medium text-sm">Lightning Fast</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 flex justify-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                className="relative"
                            >
                                {/* Glow effect behind image */}
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl"></div>

                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/4359/4359963.png"
                                    alt="Global Delivery"
                                    className="relative z-10 w-72 h-72 object-contain filter drop-shadow-2xl"
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 text-cyan-400/10">
                        <HiSparkles className="text-6xl" />
                    </div>
                    <div className="absolute bottom-10 left-10 text-blue-400/10">
                        <FaAward className="text-5xl" />
                    </div>
                </motion.div>

                {/* Enhanced CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-gray-700/30 shadow-2xl overflow-hidden"
                >
                    {/* Enhanced Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-red-600/5 rounded-2xl"></div>
                    <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 left-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/3 flex justify-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="relative"
                            >
                                {/* Glow effect behind image */}
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-2xl"></div>

                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png"
                                    alt="Earn Money"
                                    className="relative z-10 w-56 h-56 object-contain filter drop-shadow-2xl"
                                />
                            </motion.div>
                        </div>

                        <div className="lg:w-2/3">
                            {/* Section Badge */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-6"
                            >
                                <FaRocket className="text-blue-400" />
                                Partnership Program
                                <HiSparkles className="text-yellow-400" />
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Earn</span> with Us!
                            </h2>

                            <div className="space-y-6 mb-8">
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="text-gray-300 text-lg leading-relaxed"
                                >
                                    Tired of overspending on subscriptions? <span className="text-cyan-400 font-bold">Save money with us, make money with us!</span> Join our exclusive partner program and start earning today.
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="text-gray-300 text-lg leading-relaxed"
                                >
                                    Not only can you save with our affordable subscriptions, but you can also <span className="text-green-400 font-bold">monetize unused profiles</span> by sharing them through our platform. It's a win-win that turns idle subscriptions into passive income!
                                </motion.p>
                            </div>

                            {/* Enhanced Button */}
                            <motion.button
                                onClick={handleJoinProgram}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold py-4 px-10 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg overflow-hidden"
                            >
                                {/* Button Background Glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 group-hover:from-orange-400/30 group-hover:to-red-400/30 transition-all duration-300"></div>

                                {/* Content */}
                                <div className="relative z-10 flex items-center gap-3">
                                    <FaWhatsapp className="text-2xl group-hover:scale-110 transition-transform duration-300" />
                                    <span>Join Our Partner Program</span>
                                    <HiLightningBolt className="text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
                                </div>

                                {/* Shine Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                                    style={{ transform: 'skewX(-20deg)' }}
                                />
                            </motion.button>

                            {/* Benefits */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="flex flex-wrap gap-4 mt-6"
                            >
                                <div className="flex items-center gap-2 text-green-300 text-sm">
                                    <FaCheckCircle className="text-green-400" />
                                    <span>Instant Payouts</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-300 text-sm">
                                    <FaShieldAlt className="text-blue-400" />
                                    <span>Secure Platform</span>
                                </div>
                                <div className="flex items-center gap-2 text-purple-300 text-sm">
                                    <FaUsers className="text-purple-400" />
                                    <span>24/7 Support</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-6 right-6 text-orange-400/10">
                        <FaFire className="text-4xl" />
                    </div>
                    <div className="absolute bottom-6 left-6 text-cyan-400/10">
                        <FaGem className="text-3xl" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default OTTSubscriptionInfo;