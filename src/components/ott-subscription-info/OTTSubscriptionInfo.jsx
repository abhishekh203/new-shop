import React from 'react';
import { motion } from 'framer-motion';
import {
  FaStar, FaCheckCircle, FaShippingFast, FaWhatsapp,
  FaGlobe, FaAward, FaCrown, FaFire, FaHeart, FaUsers, FaShieldAlt,
  FaRocket, FaTrophy, FaGem
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { BsStars } from 'react-icons/bs';
import { companyStats, ottInfo, companyInfo } from '../../config/homepageConfig';
import { serifTheme } from '../../design-system/themes';
import SerifButton from '../../design-system/components/SerifButton';

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
            value: companyStats.ott.ordersDelivered,
            label: "Orders Delivered",
            icon: <FaShippingFast className="text-2xl" />,
            color: "from-blue-600/20 to-cyan-600/20",
            border: "border-blue-500/30",
            iconColor: "text-blue-400"
        },
        {
            value: companyStats.ott.happyCustomers,
            label: "Happy Customers",
            icon: <FaUsers className="text-2xl" />,
            color: "from-green-600/20 to-emerald-600/20",
            border: "border-green-500/30",
            iconColor: "text-green-400"
        },
        {
            value: companyStats.ott.averageRating,
            label: "Average Rating",
            icon: <FaStar className="text-2xl" />,
            color: "from-yellow-600/20 to-orange-600/20",
            border: "border-yellow-500/30",
            iconColor: "text-yellow-400"
        },
        {
            value: companyStats.ott.establishedYear,
            label: "Established Since",
            icon: <FaTrophy className="text-2xl" />,
            color: "from-purple-600/20 to-pink-600/20",
            border: "border-purple-500/30",
            iconColor: "text-purple-400"
        }
    ];

    // WhatsApp redirect function
    const handleJoinProgram = () => {
        window.open(ottInfo.partnership.whatsappUrl, '_blank');
    };

    return (
        <section className={`${serifTheme.gradients.background} py-16 px-4 relative overflow-hidden`} style={{ fontFamily: serifTheme.fontFamily.serif }}>
            {/* Background Elements - Serif Theme */}
            <div className="absolute inset-0">
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 ${serifTheme.gradients.overlay}`}></div>
                
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(180,83,9,0.2)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                </div>
                
                {/* Floating Orbs - Warm Amber/Orange Tones */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
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
                        className={`inline-flex items-center gap-2 px-6 py-3 ${serifTheme.gradients.accent} backdrop-blur-sm border ${serifTheme.colors.border.accent} ${serifTheme.radius.button} ${serifTheme.colors.text.primary} text-sm font-medium mb-8`}
                    >
                        <BsStars className="text-amber-400" />
                        {ottInfo.badge}
                        <FaCrown className="text-amber-400" />
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className={`text-5xl md:text-6xl lg:text-7xl font-black ${serifTheme.colors.text.primary} mb-8 tracking-tight`}
                    >
                        {ottInfo.title.split('?')[0]} <span className={`${serifTheme.gradients.accent} bg-clip-text text-transparent`}>{ottInfo.title.split('?')[1]}</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className={`text-xl md:text-2xl ${serifTheme.colors.text.secondary} max-w-4xl mx-auto leading-relaxed mb-8`}
                    >
                        {ottInfo.subtitle} <span className={`${serifTheme.colors.text.accent} font-semibold`}>{companyInfo.tagline}</span>, {ottInfo.fullDescription}
                    </motion.p>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        {ottInfo.trustIndicators.map((indicator, idx) => {
                            const IconComponent = indicator.icon === "shield" ? FaShieldAlt : 
                                                 indicator.icon === "globe" ? FaGlobe : FaRocket;
                            const colorMap = {
                                green: { bg: "bg-gradient-to-r from-green-600/20 to-emerald-600/20", border: "border-green-500/30", icon: "text-green-600", text: serifTheme.colors.text.accent },
                                blue: { bg: serifTheme.gradients.button, border: serifTheme.colors.border.accent, icon: "text-amber-600", text: serifTheme.colors.text.accent },
                                purple: { bg: serifTheme.gradients.accent, border: serifTheme.colors.border.accent, icon: "text-orange-600", text: serifTheme.colors.text.accent }
                            };
                            const colors = colorMap[indicator.color] || colorMap.blue;
                            return (
                                <div key={idx} className={`flex items-center gap-2 ${colors.bg} backdrop-blur-sm px-4 py-2 ${serifTheme.radius.button} border ${colors.border}`}>
                                    <IconComponent className={colors.icon} />
                                    <span className={`${colors.text} font-medium text-sm`}>{indicator.text}</span>
                                </div>
                            );
                        })}
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
                            className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 ${serifTheme.radius.button} ${serifTheme.colors.text.accent} text-sm font-medium mb-6`}
                        >
                            <FaAward className="text-amber-500" />
                            {ottInfo.achievements.badge}
                            <FaFire className="text-orange-500" />
                        </motion.div>

                        <h3 className={`text-3xl md:text-4xl font-bold ${serifTheme.colors.text.primary} mb-4`}>
                            {ottInfo.achievements.title.split(' ').slice(0, 3).join(' ')} <span className={`${serifTheme.gradients.accent} bg-clip-text text-transparent`}>{ottInfo.achievements.title.split(' ').slice(3).join(' ')}</span>
                        </h3>
                        <p className={`${serifTheme.colors.text.secondary} text-lg max-w-2xl mx-auto`}>
                            {ottInfo.achievements.subtitle}
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
                                }}
                                className={`group relative ${serifTheme.gradients.card} backdrop-blur-xl p-6 md:p-8 ${serifTheme.radius.card} border ${serifTheme.colors.border.primary} ${serifTheme.transitions.default} cursor-pointer overflow-hidden ${serifTheme.colors.shadow.card} hover:shadow-xl`}
                            >
                                {/* Background Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    {/* Icon Container */}
                                    <motion.div
                                        className={`mb-4 p-3 ${serifTheme.gradients.card} ${serifTheme.radius.button} border ${serifTheme.colors.border.primary} group-hover:border-amber-300/60 ${serifTheme.transitions.default}`}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="text-amber-600">
                                            {stat.icon}
                                        </div>
                                    </motion.div>

                                    {/* Value */}
                                    <h3 className={`text-3xl md:text-4xl font-black ${serifTheme.colors.text.primary} mb-2 group-hover:text-amber-800 ${serifTheme.transitions.default}`}>
                                        {stat.value}
                                    </h3>

                                    {/* Label */}
                                    <p className={`${serifTheme.colors.text.muted} group-hover:text-gray-700 ${serifTheme.transitions.default} font-medium text-sm md:text-base`}>
                                        {stat.label}
                                    </p>
                                </div>

                                {/* Hover Shine Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
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
                    className={`relative ${serifTheme.gradients.card} backdrop-blur-xl ${serifTheme.radius.card} p-8 md:p-12 border ${serifTheme.colors.border.primary} mb-8 ${serifTheme.colors.shadow.card} overflow-hidden`}
                >
                    {/* Background Glow */}
                    <div className={`absolute inset-0 ${serifTheme.gradients.overlay} ${serifTheme.radius.card}`}></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-full">
                            {/* Section Badge */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className={`inline-flex items-center gap-2 px-4 py-2 ${serifTheme.gradients.accent} backdrop-blur-sm border ${serifTheme.colors.border.accent} ${serifTheme.radius.button} ${serifTheme.colors.text.accent} text-sm font-medium mb-6`}
                            >
                                <FaGem className="text-amber-500" />
                                {ottInfo.achievements.journey.badge}
                            </motion.div>

                            <h2 className={`text-4xl md:text-5xl font-black ${serifTheme.colors.text.primary} mb-8 leading-tight`}>
                                {ottInfo.achievements.journey.title.split(' ')[0]} <span className={`${serifTheme.gradients.accent} bg-clip-text text-transparent`}>{ottInfo.achievements.journey.title.split(' ').slice(1).join(' ')}</span>
                            </h2>

                            <div className="space-y-6">
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className={`${serifTheme.colors.text.secondary} text-lg leading-relaxed`}
                                >
                                    {ottInfo.achievements.journey.description1.replace('{countries}', ottInfo.achievements.journey.countries).replace('{successRate}', ottInfo.achievements.journey.successRate)}
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className={`${serifTheme.colors.text.secondary} text-lg leading-relaxed`}
                                >
                                    {ottInfo.achievements.journey.description2.replace('{established}', ottInfo.achievements.journey.established)}
                                </motion.p>

                                {/* Achievement Highlights */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    className="flex flex-wrap gap-4 mt-8"
                                >
                                    {ottInfo.highlights.map((highlight, idx) => {
                                        const IconComponent = highlight.icon === "heart" ? FaHeart : HiLightningBolt;
                                        const colorMap = {
                                            green: { bg: "bg-gradient-to-r from-green-600/20 to-emerald-600/20", border: "border-green-500/30", icon: "text-red-600", text: serifTheme.colors.text.accent },
                                            blue: { bg: serifTheme.gradients.button, border: serifTheme.colors.border.accent, icon: "text-amber-600", text: serifTheme.colors.text.accent }
                                        };
                                        const colors = colorMap[highlight.color] || colorMap.blue;
                                        return (
                                            <div key={idx} className={`flex items-center gap-2 ${colors.bg} backdrop-blur-sm px-4 py-2 ${serifTheme.radius.button} border ${colors.border}`}>
                                                <IconComponent className={colors.icon} />
                                                <span className={`${colors.text} font-medium text-sm`}>{highlight.text}</span>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 hidden">
                            {/* Rotating image removed */}
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 text-amber-400/10">
                        <HiSparkles className="text-6xl" />
                    </div>
                    <div className="absolute bottom-10 left-10 text-orange-400/10">
                        <FaAward className="text-5xl" />
                    </div>
                </motion.div>

                {/* Enhanced CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className={`relative ${serifTheme.gradients.card} backdrop-blur-xl ${serifTheme.radius.card} p-8 md:p-12 border ${serifTheme.colors.border.primary} ${serifTheme.colors.shadow.card} overflow-hidden`}
                >
                    {/* Enhanced Background Effects */}
                    <div className={`absolute inset-0 ${serifTheme.gradients.overlay} ${serifTheme.radius.card}`}></div>
                    <div className="absolute top-10 right-10 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-400/10 rounded-full blur-xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/3 hidden">
                            {/* Rotating image removed */}
                        </div>

                        <div className="lg:w-full">
                            {/* Section Badge */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className={`inline-flex items-center gap-2 px-4 py-2 ${serifTheme.gradients.accent} backdrop-blur-sm border ${serifTheme.colors.border.accent} ${serifTheme.radius.button} ${serifTheme.colors.text.accent} text-sm font-medium mb-6`}
                            >
                                <FaRocket className="text-amber-600" />
                                {ottInfo.partnership.badge}
                                <HiSparkles className="text-orange-500" />
                            </motion.div>

                            <h2 className={`text-4xl md:text-5xl font-black ${serifTheme.colors.text.primary} mb-8 leading-tight`}>
                                <span className={`${serifTheme.gradients.accent} bg-clip-text text-transparent`}>{ottInfo.partnership.title.split(' ')[0]}</span> {ottInfo.partnership.title.split(' ').slice(1).join(' ')}
                            </h2>

                            <div className="space-y-6 mb-8">
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className={`${serifTheme.colors.text.secondary} text-lg leading-relaxed`}
                                >
                                    {ottInfo.partnership.description1}
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className={`${serifTheme.colors.text.secondary} text-lg leading-relaxed`}
                                >
                                    {ottInfo.partnership.description2}
                                </motion.p>
                            </div>

                            {/* Enhanced Button */}
                            <SerifButton
                                onClick={handleJoinProgram}
                                variant="primary"
                                size="large"
                                icon={<FaWhatsapp />}
                                iconPosition="left"
                                className="group"
                            >
                                {ottInfo.partnership.buttonText}
                                <HiLightningBolt className="ml-2" />
                            </SerifButton>

                            {/* Benefits */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="flex flex-wrap gap-4 mt-6"
                            >
                                {ottInfo.partnership.benefits.map((benefit, idx) => {
                                    const IconComponent = benefit.icon === "check" ? FaCheckCircle : 
                                                         benefit.icon === "shield" ? FaShieldAlt : FaUsers;
                                    const colorMap = {
                                        check: { icon: "text-green-600", text: serifTheme.colors.text.accent },
                                        shield: { icon: "text-amber-600", text: serifTheme.colors.text.accent },
                                        users: { icon: "text-orange-600", text: serifTheme.colors.text.accent }
                                    };
                                    const colors = colorMap[benefit.icon] || colorMap.check;
                                    return (
                                        <div key={idx} className={`flex items-center gap-2 ${colors.text} text-sm`}>
                                            <IconComponent className={colors.icon} />
                                            <span>{benefit.text}</span>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-6 right-6 text-orange-400/10">
                        <FaFire className="text-4xl" />
                    </div>
                    <div className="absolute bottom-6 left-6 text-amber-400/10">
                        <FaGem className="text-3xl" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default OTTSubscriptionInfo;