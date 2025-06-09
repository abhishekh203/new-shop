import React from "react";
import { motion } from "framer-motion";
import {
  FaQuoteLeft, FaStar, FaHeart, FaUsers, FaShieldAlt,
  FaCheckCircle, FaFire, FaCrown, FaAward
} from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { BsStars } from "react-icons/bs";

// Reusable component for a single scrolling column
const ScrollingImageColumn = ({ images, durationMultiplier, columnId, initialY = "0%" }) => {
  // Animation configuration for this specific column
  const scrollAnimation = {
    animate: {
      y: [initialY, initialY === "0%" ? "-50%" : "0%"], // Moves the content up by half its height
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
      className="h-[550px] sm:h-[600px] md:h-[700px] overflow-hidden relative w-full rounded-2xl border border-gray-700/30 shadow-2xl bg-gray-900/30 backdrop-blur-xl"
    >
      {/* Enhanced gradient overlay for smooth top fade */}
      <div className="absolute top-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex flex-col"
        animate={scrollAnimation.animate}
        transition={scrollAnimation.transition}
      >
        {/* Render images twice for a seamless loop */}
        {[...images, ...images].map((imageUrl, index) => (
          <motion.div
            key={`col-${columnId}-img-${index}`}
            className="w-full p-2 md:p-3 group"
            whileHover={{
              scale: 1.05,
              zIndex: 10,
              rotateY: 2,
              boxShadow: "0 20px 40px rgba(6, 182, 212, 0.15)"
            }}
            transition={{ type: "spring", stiffness: 300, duration: 0.3 }}
          >
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={imageUrl}
                alt={`Testimonial review ${index % images.length + 1} in column ${columnId}`}
                className="w-full h-auto object-cover shadow-xl border border-gray-600/40 group-hover:border-cyan-400/50 transition-all duration-300 filter group-hover:brightness-110"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/400x500/1F2937/6B7280?text=Review+Image&font=montserrat`;
                }}
              />

              {/* Hover overlay effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-cyan-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />

              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{ transform: 'skewX(-20deg)' }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced gradient overlay for smooth bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

const Testimonial = () => {
  const allTestimonialImages = [
    "/img/w_image/r1.jpg", "/img/p_proof/p1.jpg", "/img/w_image/r2.jpg",
    "/img/w_image/r3.jpg", "/img/p_proof/p2.jpg", "/img/w_image/r4.jpg",
    "/img/w_image/r5.jpg", "/img/p_proof/p3.jpg", "/img/w_image/r6.jpg",
    "/img/w_image/r7.jpg", "/img/p_proof/p4.jpg", "/img/w_image/r8.jpg",
    "/img/w_image/r1.jpg", 
    "/img/p_proof/p1.jpg",
    "/img/w_image/r2.jpg",
  ];

  const column1Images = allTestimonialImages.filter((_, i) => i % 3 === 0);
  const column2Images = allTestimonialImages.filter((_, i) => i % 3 === 1);
  const column3Images = allTestimonialImages.filter((_, i) => i % 3 === 2);

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const subHeaderVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.2 },
    },
  };

  const statItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" },
    }),
    hover: {
        y: -5,
        boxShadow: "0px 10px 20px rgba(234, 88, 12, 0.3)", 
        borderColor: "rgba(234, 88, 12, 0.7)", 
        transition: { duration: 0.2, ease: "easeOut"}
    }
  };

  return (
    <section className="relative bg-black py-16 md:py-24 overflow-hidden font-sans">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #1f2937 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #374151 0%, transparent 50%)`,
          backgroundSize: '150px 150px'
        }}></div>
      </div>

      {/* Enhanced Floating Elements */}
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
        <motion.div
          className="absolute top-1/2 right-1/3 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container px-4 sm:px-6 mx-auto relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16 md:mb-20">
          {/* Modern Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium mb-8"
          >
            <BsStars className="text-yellow-400" />
            Customer Testimonials
            <FaHeart className="text-red-400" />
          </motion.div>

          {/* Enhanced Title */}
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight"
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Loved by <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 bg-clip-text text-transparent">Everyone</span>
          </motion.h2>

          {/* Enhanced Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8"
          >
            Real testimonials from thousands of satisfied customers who trust our
            <span className="text-cyan-400 font-semibold"> premium digital services</span>
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-8"
          >
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
              <FaCheckCircle className="text-green-400" />
              <span className="text-green-300 font-medium text-sm">Verified Reviews</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-500/30">
              <FaStar className="text-yellow-400" />
              <span className="text-yellow-300 font-medium text-sm">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/30">
              <FaCrown className="text-yellow-400" />
              <span className="text-purple-300 font-medium text-sm">Premium Quality</span>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Hanging Text Element */}
        <div className="relative flex flex-col items-center mb-12 md:mb-20 z-20">
          {/* Enhanced String */}
          <motion.div
            className="h-16 sm:h-20 w-0.5 bg-gradient-to-b from-cyan-400/50 to-cyan-600/80"
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          />

          {/* Enhanced Text Block */}
          <motion.div
            className="relative bg-gradient-to-br from-cyan-500 via-blue-500 to-teal-500 text-white py-4 px-8 sm:py-5 sm:px-10 rounded-2xl shadow-2xl transform origin-top border border-cyan-400/30 backdrop-blur-sm"
            initial={{ opacity: 0, y: -30, scale: 0.7, rotate: -15 }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
              rotate: [-8, 8, -8],
              x: [0, 12, -12, 0]
            }}
            viewport={{ once: true }}
            transition={{
              default: { type: "spring", stiffness: 120, damping: 12, delay: 1.1 },
              rotate: { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: 2 },
              x: { duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: 2 }
            }}
            whileHover={{
              scale: 1.08,
              rotate: 0,
              boxShadow: "0px 15px 40px rgba(6, 182, 212, 0.4)",
              y: -5
            }}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-2xl blur-xl"></div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-3">
              <FaQuoteLeft className="text-cyan-200 text-lg" />
              <span className="font-bold text-lg sm:text-xl md:text-2xl tracking-tight">
                What users say about us
              </span>
              <HiSparkles className="text-yellow-300 text-xl" />
            </div>

            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
              animate={{ translateX: ['100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              style={{ transform: 'skewX(-20deg)' }}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 max-w-7xl mx-auto">
          <ScrollingImageColumn images={column1Images} durationMultiplier={6} columnId="1" />
          <div className="mt-0 sm:mt-8 md:-mt-16"> 
            <ScrollingImageColumn images={column2Images} durationMultiplier={7.5} columnId="2" initialY="-25%" />
          </div>
          <div className="mt-0 sm:mt-0 md:mt-8"> 
             <ScrollingImageColumn images={column3Images} durationMultiplier={6.5} columnId="3" />
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <motion.div
          className="mt-20 md:mt-28"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
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
              Trusted by <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Thousands</span>
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Numbers that speak for our commitment to excellence
            </p>
          </div>

          {/* Enhanced Stats Grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.15 }}
          >
            {[
              { value: "10K+", label: "Happy Customers", icon: <FaUsers className="text-cyan-400" />, color: "from-cyan-600/20 to-blue-600/20", border: "border-cyan-500/30" },
              { value: "99.8%", label: "Success Rate", icon: <FaShieldAlt className="text-green-400" />, color: "from-green-600/20 to-emerald-600/20", border: "border-green-500/30" },
              { value: "24/7", label: "Support Available", icon: <HiLightningBolt className="text-yellow-400" />, color: "from-yellow-600/20 to-orange-600/20", border: "border-yellow-500/30" },
              { value: "2min", label: "Avg Delivery", icon: <FaFire className="text-red-400" />, color: "from-red-600/20 to-pink-600/20", border: "border-red-500/30" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`group relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl p-6 sm:p-7 md:p-8 rounded-2xl border ${stat.border} transition-all duration-500 cursor-pointer overflow-hidden`}
                variants={statItemVariants}
                custom={index}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(6, 182, 212, 0.15)"
                }}
              >
                {/* Background Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-3xl">
                      {stat.icon}
                    </div>
                  </motion.div>

                  {/* Value */}
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-sm sm:text-base md:text-lg text-gray-300 group-hover:text-gray-200 transition-colors duration-300 font-medium">
                    {stat.label}
                  </div>
                </div>

                {/* Hover Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  style={{ transform: 'skewX(-20deg)' }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
