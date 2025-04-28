import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaCheckCircle, FaMoneyBillWave, FaShippingFast, FaWhatsapp } from 'react-icons/fa';

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
        { value: "10,000+", label: "Orders Delivered", icon: <FaShippingFast className="text-blue-400 text-2xl" /> },
        { value: "9,500+", label: "Happy Customers", icon: <FaCheckCircle className="text-green-400 text-2xl" /> },
        { value: "4.8/5", label: "Average Rating", icon: <FaStar className="text-yellow-400 text-2xl" /> },
        { value: "2019", label: "Established Since", icon: <FaMoneyBillWave className="text-purple-400 text-2xl" /> }
    ];

    // WhatsApp redirect function
    const handleJoinProgram = () => {
        window.open('https://chat.whatsapp.com/IXl6YmkAZgEJkveJgbatAP?text=Hi%20Netflix%20Nepal,%20I%20want%20to%20join%20your%20partner%20program', '_blank');
    };

    return (
        <section className="bg-gradient-to-br from-gray-900 via-black to-blue-900 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    variants={containerVariants}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.h1 
                        variants={itemVariants}
                        className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight"
                    >
                        Who <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">We Are?</span>
                    </motion.h1>
                    
                    <motion.p 
                        variants={itemVariants}
                        className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        We are proud to be Netflix Nepal's #1 digital subscription store, dedicated to providing discounted premium subscriptions to customers worldwide with instant email delivery.
                    </motion.p>
                </motion.div>

                {/* Stats Section */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    variants={containerVariants}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={index}
                            variants={itemVariants}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-all hover:-translate-y-1 shadow-lg"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-3">
                                    {stat.icon}
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                                <p className="text-gray-400">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Achievements Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 md:p-10 border border-gray-700 mb-16 shadow-xl"
                >
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl font-bold text-white mb-6">
                                Our <span className="text-orange-400">Achievements</span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                                Over the past five years, we've successfully delivered premium subscriptions to customers in over <span className="text-white font-semibold">15 countries</span>, maintaining an exceptional service record.
                            </p>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                Since our establishment in <span className="text-white font-semibold">July 2019</span>, we've consistently provided top-quality services at unbeatable prices, helping thousands save on their digital subscriptions.
                            </p>
                        </div>
                        <div className="lg:w-1/2 flex justify-center">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/4359/4359963.png" 
                                alt="Global Delivery" 
                                className="w-64 h-64 object-contain"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-gray-800 via-black to-blue-900 rounded-2xl p-8 md:p-10 border border-gray-700 shadow-2xl overflow-hidden relative"
                >
                    {/* Decorative elements */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500 rounded-full filter blur-3xl opacity-20"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
                    
                    <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                        <div className="lg:w-1/3 flex justify-center">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png" 
                                alt="Earn Money" 
                                className="w-48 h-48 object-contain"
                            />
                        </div>
                        <div className="lg:w-2/3">
                            <h2 className="text-3xl font-bold text-white mb-6">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Earn</span> with Us!
                            </h2>
                            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                                Tired of overspending on subscriptions? <span className="text-white font-semibold">Save money with us, make money with us!</span>
                            </p>
                            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                                Not only can you save with our affordable subscriptions, but you can also monetize unused profiles by sharing them through our platform. It's a win-win that turns idle subscriptions into passive income!
                            </p>
                            <motion.button
                                onClick={handleJoinProgram}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <FaWhatsapp className="text-xl" />
                                Join Our Partner Program
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default OTTSubscriptionInfo;