import React from "react";
import { motion } from "framer-motion";

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
      className="h-[550px] sm:h-[600px] md:h-[700px] overflow-hidden relative w-full rounded-xl border border-gray-700/30 shadow-2xl bg-gray-900/30 backdrop-blur-sm"
    >
      {/* Gradient overlay for smooth top fade */}
      <div className="absolute top-0 left-0 w-full h-16 md:h-24 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex flex-col" // Stacks images vertically
        animate={scrollAnimation.animate}
        transition={scrollAnimation.transition}
      >
        {/* Render images twice for a seamless loop */}
        {[...images, ...images].map((imageUrl, index) => (
          <motion.div
            key={`col-${columnId}-img-${index}`}
            className="w-full p-2 md:p-3" // Padding around each image container
            whileHover={{ scale: 1.03, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 300, duration: 0.2 }}
          >
            <img
              src={imageUrl}
              alt={`Testimonial review ${index % images.length + 1
                } in column ${columnId}`}
              className="w-full h-auto object-cover rounded-lg shadow-lg border border-gray-600/40"
              loading="lazy" // Lazy load images
              onError={(e) => {
                e.target.onerror = null; // Prevents infinite loop if placeholder also fails
                e.target.src = `https://placehold.co/400x500/2D3748/A0AEC0?text=Image+Not+Found&font=montserrat`; // Darker placeholder
              }}
            />
          </motion.div>
        ))}
      </motion.div>
      {/* Gradient overlay for smooth bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-16 md:h-24 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-transparent z-10 pointer-events-none" />
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
    <section className="relative bg-gradient-to-br from-gray-950 via-black to-blue-950 py-16 md:py-24 overflow-hidden font-sans">
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-10%] left-[-5%] w-72 h-72 md:w-96 md:h-96 bg-purple-600 rounded-full filter blur-3xl opacity-50"
          animate={{
            x: [0, 50, 0, -50, 0],
            y: [0, -30, 0, 30, 0],
            scale: [1, 1.1, 1, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-15%] right-[-10%] w-80 h-80 md:w-[500px] md:h-[500px] bg-orange-500 rounded-full filter blur-3xl opacity-40"
          animate={{
            x: [0, -40, 0, 40, 0],
            y: [0, 20, 0, -20, 0],
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
         <motion.div
          className="absolute top-[30%] right-[40%] w-40 h-40 md:w-60 md:h-60 bg-teal-500 rounded-full filter blur-2xl opacity-30"
          animate={{
            x: [0, 20, 0, -20, 0],
            y: [0, -15, 0, 15, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "circInOut" }}
        />
      </div>

      <div className="container px-4 sm:px-6 mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16"> {/* Reduced bottom margin slightly */}
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-5 tracking-tight"
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">Everyone</span>
          </motion.h2>
         
        </div>

        {/* --- HANGING TEXT ELEMENT --- */}
        <div className="relative flex flex-col items-center mb-10 md:mb-16 z-20">
          {/* The "string" */}
          <motion.div 
            className="h-12 sm:h-16 w-0.5 bg-gray-500/70"
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          />
          {/* The text block */}
          <motion.div
            className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white py-3 px-6 sm:py-4 sm:px-8 rounded-lg shadow-2xl transform origin-top" // Changed origin to top for better swing
            initial={{ opacity: 0, y: -20, scale: 0.7, rotate: -10 }} // Adjusted initial y and rotate
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              rotate: [-5, 5, -5], // Initial rotation, swing right, swing left
              x: [0, 10, -10, 0] // Added x for left-right swing
            }}
            transition={{
              default: { type: "spring", stiffness: 100, damping: 10, delay: 0.9 }, // Spring for main entrance
              rotate: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: 1.5 }, // Slower, smoother rotation swing
              x: { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: 1.5 } // Added x transition
            }}
            whileHover={{ scale: 1.05, rotate: 0, boxShadow: "0px 10px 30px rgba(245, 158, 11, 0.5)"}}
          >
            <span className="font-semibold text-md sm:text-lg md:text-xl tracking-tight">What users say about us</span>
          </motion.div>
        </div>
        {/* --- END OF HANGING TEXT ELEMENT --- */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 max-w-7xl mx-auto">
          <ScrollingImageColumn images={column1Images} durationMultiplier={6} columnId="1" />
          <div className="mt-0 sm:mt-8 md:-mt-16"> 
            <ScrollingImageColumn images={column2Images} durationMultiplier={7.5} columnId="2" initialY="-25%" />
          </div>
          <div className="mt-0 sm:mt-0 md:mt-8"> 
             <ScrollingImageColumn images={column3Images} durationMultiplier={6.5} columnId="3" />
          </div>
        </div>

        <motion.div
          className="mt-16 md:mt-24 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center"
          initial="hidden" 
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }} 
        >
          {[
            { value: "10K+", label: "Happy Customers" },
            { value: "99.8%", label: "Success Rate" },
            { value: "24/7", label: "Support Available" },
            { value: "2min", label: "Avg Delivery" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/60 backdrop-blur-md rounded-xl p-4 sm:p-5 md:p-6 border border-gray-700/50 transition-all duration-300 cursor-pointer"
              variants={statItemVariants}
              custom={index} 
              whileHover="hover" 
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400 mb-1.5 sm:mb-2.5">{stat.value}</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
