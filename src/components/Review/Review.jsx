import React from 'react';
import { motion } from 'framer-motion'; // Import motion
import { FaQuoteLeft } from "react-icons/fa"; // Import quote icon

// 1. Updated reviews array tailored for Nepali users
const reviews = [
    {
        id: 1,
        username: "Rajesh K.",
        status: "VIP Member",
        // Using pravatar.cc for diverse placeholder images based on username seed
        avatar: "https://i.pravatar.cc/150?u=rajeshk",
        review: "Digital Shop Nepal is my go-to! Been buying Netflix and SonyLIV for over a year. Support on WhatsApp is super fast if anything goes wrong. Always get a replacement quickly. Best price in Nepal!"
    },
    {
        id: 2,
        username: "Sunita G.",
        status: "Verified Buyer",
        avatar: "https://i.pravatar.cc/150?u=sunitag",
        review: "First time buying a Netflix account online, was a bit nervous. But delivery was instant after payment via Esewa. Account works perfectly. Very happy with the service and price!"
    },
    {
        id: 3,
        username: "Aarav P.",
        status: "Verified Buyer",
        avatar: "https://i.pravatar.cc/150?u=aaravp",
        review: "Needed Hotstar for the cricket season. Got it here much cheaper than the official site. Smooth process, received login details within minutes. Highly recommend!"
    },
    {
        id: 4,
        username: "Priya S.",
        status: "Verified Buyer",
        avatar: "https://i.pravatar.cc/150?u=priyas",
        review: "Bought a shared Netflix plan. Works great on my TV and phone. Good value for money compared to other options. Reliable service so far."
    },
     { // Added a fifth review
        id: 5,
        username: "Bikash T.",
        status: "Repeat Customer",
        avatar: "https://i.pravatar.cc/150?u=bikasht",
        review: "Always reliable for premium accounts. Fair prices and excellent customer care. They even helped me troubleshoot a login issue late at night. Trustworthy seller.",
    }
];

// 2. Animation variants for the container and items
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15, // Stagger animation for each card
            delayChildren: 0.2,
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

// 3. The CustomerReviews Component Function
const CustomerReviews = () => {
    return (
        <div className="bg-gray-900 py-12 md:py-20"> {/* Dark background, increased padding */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Animated Title */}
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="text-center text-3xl md:text-4xl font-bold text-teal-400 mb-10 md:mb-16" // Teal title, more margin
                >
                    What Our Customers Say
                </motion.h2>

                {/* Animated Container for Review Cards */}
                <motion.div
                    className="flex flex-wrap justify-center items-stretch gap-6 md:gap-8" // items-stretch for equal height, adjust gap
                    variants={containerVariants}
                    initial="hidden"
                    // Animate when component scrolls into view
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% is visible, run once
                >
                    {reviews.map(review => (
                        // Card Outer Wrapper for Responsive Sizing
                        <motion.div
                            key={review.id}
                            className="w-full sm:w-[48%] md:w-[45%] lg:w-[31%] xl:w-[23%]" // Responsive widths (adjust as needed)
                            variants={itemVariants} // Apply item animation variant
                        >
                            {/* Card Content with Hover Animation */}
                            <motion.div
                                className="bg-slate-800 p-6 rounded-xl shadow-lg h-full flex flex-col items-center text-center border border-slate-700 transition-colors duration-300 hover:border-teal-500/80" // Dark card, rounded, border, centered content, full height
                                // Hover animations
                                whileHover={{
                                    y: -8, // Lift effect
                                    scale: 1.03, // Scale effect
                                    boxShadow: "0 10px 20px rgba(0, 200, 150, 0.15)" // Subtle teal glow
                                }}
                                transition={{ type: 'spring', stiffness: 250, damping: 15 }} // Spring physics for hover
                            >
                                <img
                                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-teal-600 shadow-sm" // Teal border on avatar
                                    src={review.avatar}
                                    alt={`${review.username}'s avatar`}
                                    loading="lazy" // Lazy load images for performance
                                />
                                <h3 className="text-lg font-semibold text-gray-100">{review.username}</h3>
                                <p className="text-xs font-medium text-teal-400 uppercase tracking-wider mb-4">{review.status}</p>
                                <FaQuoteLeft className="text-slate-600 text-xl mb-2" aria-hidden="true" /> {/* Decorative Quote icon */}
                                <blockquote className="text-gray-300 text-sm leading-relaxed italic mt-auto"> {/* Italic review text, pushes down in flex col */}
                                    "{review.review}"
                                </blockquote>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

// 4. Export the component
export default CustomerReviews;