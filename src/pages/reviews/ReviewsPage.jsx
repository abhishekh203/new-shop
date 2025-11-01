import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { FaRocket, FaGift, FaClock, FaGlobe } from "react-icons/fa";
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { FaStar, FaUsers, FaShieldAlt, FaCheckCircle, FaHeart, FaThumbsUp, FaAward, FaCrown, FaFire, FaPlay, FaPaperPlane, FaUserSecret, FaTimes } from 'react-icons/fa';
import { HiSparkles, HiLightningBolt, HiTrendingUp } from 'react-icons/hi';
import { BsStars, BsEmojiSmile } from 'react-icons/bs';
import { collection, addDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

// Dynamically import all images from /public/img/w_image
const galleryImages = [
    'r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11','r12','r13','r14','r15','r16','r17','r18','r19','r20','r21','r22','r23','r24','r25','r26','r27','r28','r29','r30','r31','r32','r33','r34','r35','r36','r37'
].map(name => `/img/w_image/${name}.jpg`);

// Get all approved reviews for display
const getApprovedReviews = async () => {
    try {
        const reviewsRef = collection(fireDB, 'reviews');
        
        // First, try to get ALL reviews to see what's in the database
        const allReviewsQuery = query(
            reviewsRef,
            orderBy('timestamp', 'desc')
        );
        
        const allReviewsSnapshot = await getDocs(allReviewsQuery);
        
        const allReviews = [];
        allReviewsSnapshot.forEach((doc) => {
            const reviewData = { id: doc.id, ...doc.data() };
            allReviews.push(reviewData);
        });
        
        // Check different approval field variations
        const approvedReviews = allReviews.filter(review => {
            const isApproved = review.approved === true || 
                              review.approved === 'true' || 
                              review.approved === 1 ||
                              review.status === 'approved' ||
                              review.status === 'Approved' ||
                              review.isApproved === true ||
                               review.isApproved === 'true';
            return isApproved;
        });
        
        // Always return all, but ensure approved reviews come first
        const ordered = [
            ...approvedReviews,
            ...allReviews.filter(r => !approvedReviews.find(a => a.id === r.id))
        ];
        return ordered;
    } catch (error) {
        console.error('Error fetching approved reviews:', error);
        return [];
    }
};

// Test function to fetch ALL reviews (for debugging)
const getAllReviewsTest = async () => {
    try {
        const reviewsRef = collection(fireDB, 'reviews');
        
        // Get ALL reviews without any filter
        const q = query(
            reviewsRef,
            orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        
        const allReviews = [];
        querySnapshot.forEach((doc) => {
            const reviewData = { id: doc.id, ...doc.data() };
            allReviews.push(reviewData);
        });
        
        return allReviews;
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        return [];
    }
};

// Horizontal Scrolling Gallery Component
const HorizontalScrollingGallery = ({ images }) => {
    const [isPaused, setIsPaused] = useState(false);
    
    // Create duplicated images for seamless infinite scroll
    const duplicatedImages = images.length > 0 ? [...images, ...images, ...images] : [];
    
    return (
        <div className="relative py-20 overflow-hidden">
            {/* Gradient fade overlays */}
            <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
                        Real Customer Moments
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                        Experience our digital excellence through real customer interactions and premium services.
                    </p>
                </div>
                {/* Show a message if no images are found */}
                {images.length === 0 && (
                  <div className="text-center text-red-400 font-bold">No images found in /img/w_image/</div>
                )}
                <div 
                    className="overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <motion.div 
                        className="flex flex-nowrap gap-8 pb-4"
                        animate={images.length > 0 ? { x: isPaused ? undefined : [0, -(320 * images.length)] } : {}}
                        transition={{
                            x: images.length > 0 ? {
                                duration: Math.max(images.length, 1) * 3,
                                ease: "linear",
                                repeat: Infinity,
                            } : undefined
                        }}
                        style={{ width: `${320 * (duplicatedImages.length || 1)}px` }}
                    >
                        {duplicatedImages.map((image, index) => (
                            <div
                                key={`${image}-${index}`}
                                className="w-72 h-80 flex-shrink-0 relative group rounded-3xl overflow-hidden border-2 border-gray-700/30 hover:border-purple-400/70 shadow-2xl bg-gray-900/60 transition-all duration-500"
                            >
                                <img
                                    src={image}
                                    alt={`Gallery image ${(index % images.length) + 1}`}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                                    loading="lazy"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="bg-black/70 backdrop-blur-md rounded-2xl p-4 border border-purple-500/30">
                                            <p className="text-white text-sm font-bold mb-1">Digital Excellence</p>
                                            <p className="text-purple-300 text-xs">Premium Service #{(index % images.length) + 1}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// Animation variants (moved outside component)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// Approved Reviews Display Component
const ApprovedReviewsSection = ({ reviews }) => {
    
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={`${index < rating ? 'text-yellow-400' : 'text-gray-400'}`}
            />
        ));
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown date';
        try {
            const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch {
            return 'Unknown date';
        }
    };

    return (
        <section className="py-20 bg-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        What Our <span className="text-teal-400">Customers Say</span>
                    </h2>
                    <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                        Real feedback from satisfied customers across Nepal
                    </p>
                </motion.div>

                {reviews.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50">
                            <FaUsers className="text-6xl text-gray-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">No Reviews Yet</h3>
                            <p className="text-gray-400">Be the first to share your experience!</p>

                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {reviews.map((review, index) => (
                                <motion.div
                                    key={review.id}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="group bg-gray-800 rounded-2xl p-6 border border-gray-600 hover:border-green-400 transition-all duration-500 shadow-2xl"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                                <FaUserSecret className="text-white text-sm" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">
                                                    {review.userName || 'Anonymous User'}
                                                </p>
                                                <p className="text-sm text-gray-400 font-medium">
                                                    {formatDate(review.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    
                                    {review.title && (
                                        <h4 className="font-bold text-white mb-2">{review.title}</h4>
                                    )}
                                    
                                    <p className="text-gray-300 mb-4 line-clamp-3 font-medium">
                                        {review.review}
                                    </p>
                                    
                                    {review.recommend !== undefined && (
                                        <div className="flex items-center gap-2 text-sm">
                                            {review.recommend ? (
                                                <>
                                                    <FaCheckCircle className="text-green-500" />
                                                    <span className="text-green-600 font-medium">Recommends this product</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FaTimes className="text-red-500" />
                                                    <span className="text-red-600 font-medium">Does not recommend</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    

                                </motion.div>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

const ReviewsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [approvedReviews, setApprovedReviews] = useState([]);

    // Calculate stats from actual reviews
    const stats = useMemo(() => {
        const totalReviews = approvedReviews.length;
        const averageRating = totalReviews > 0
            ? (approvedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
            : "0.0";
        
        const happyCustomers = approvedReviews.filter(r => r.rating >= 4).length;
        const successRate = totalReviews > 0
            ? ((happyCustomers / totalReviews) * 100).toFixed(1)
            : "0.0";

        return [
            { 
                icon: <FaStar className="text-yellow-400" />, 
                value: averageRating, 
                label: "Average Rating", 
                description: `From ${totalReviews} reviews` 
            },
            { 
                icon: <FaUsers className="text-teal-400" />, 
                value: `${happyCustomers}+`, 
                label: "Happy Customers", 
                description: "Across Nepal" 
            },
            { 
                icon: <FaShieldAlt className="text-green-400" />, 
                value: `${successRate}%`, 
                label: "Success Rate", 
                description: "Customer satisfaction" 
            }
        ];
    }, [approvedReviews]);

    // Features data
    const features = [
        { icon: <FaRocket className="text-6xl text-blue-400" />, title: "Instant Delivery", description: "Get your digital subscriptions within minutes of payment confirmation", color: "from-blue-500/20 to-cyan-500/20" },
        { icon: <FaGift className="text-6xl text-purple-400" />, title: "Premium Quality", description: "Access to the highest quality streaming and digital services", color: "from-purple-500/20 to-pink-500/20" },
        { icon: <FaClock className="text-6xl text-green-400" />, title: "24/7 Support", description: "Round-the-clock customer support via WhatsApp and email", color: "from-green-500/20 to-emerald-500/20" },
        { icon: <FaGlobe className="text-6xl text-orange-400" />, title: "Global Access", description: "Access content from anywhere in the world without restrictions", color: "from-orange-500/20 to-red-500/20" }
    ];

    // Animation variants are now defined outside the component

    // Preload critical images and fetch reviews
    useEffect(() => {
        const initialize = async () => {
            try {
                console.log('🚀 Initializing Reviews page...');
                
                // Test Firebase connection
                console.log('🔥 Testing Firebase connection...');
                try {
                    const testRef = collection(fireDB, 'reviews');
                    const testQuery = query(testRef, limit(1));
                    const testSnapshot = await getDocs(testQuery);
                    console.log('✅ Firebase connection successful, collection accessible');
                } catch (firebaseError) {
                    console.error('❌ Firebase connection failed:', firebaseError);
                    return;
                }
                
                // Preload images
                const imagePromises = [
                    "/img/digital.jpg",
                    "/img/hero.png",
                    "/img/hero1.png",
                    ...galleryImages // preload all available images
                ].map(src => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = src;
                    });
                });

                // Fetch reviews
                const reviews = await getApprovedReviews();

                // If no reviews found, try to get all reviews as fallback
                if (reviews.length === 0) {
                const allReviews = await getAllReviewsTest();
                    if (allReviews.length > 0) {
                        setApprovedReviews(allReviews);
                    } else {
                        setApprovedReviews([]);
                    }
                } else {
                    setApprovedReviews(reviews);
                }

                // Wait for images to load
                await Promise.all(imagePromises);
            } catch (error) {
                console.error('Error during initialization:', error);
            } finally {
                setIsLoading(false);
            }
        };
        initialize();
    }, []);



    return (
        <Layout>
            <div className="min-h-screen bg-black relative overflow-hidden">
                {/* Background Elements - Same as Hero Section */}
                <div className="absolute inset-0">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
                    
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                    </div>
                    
                    {/* Floating Orbs */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
                </div>

                {/* Loading indicator */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400"></div>
                    </div>
                )}



                {/* Beautiful Horizontal Scrolling Gallery Section */}
                <HorizontalScrollingGallery images={galleryImages} />

                {/* Approved Reviews Section */}
                <ApprovedReviewsSection reviews={approvedReviews} />

                {/* Features Section */}
                <section className="relative py-20 bg-black">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-20"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium mb-8"
                            >
                                <HiSparkles className="text-yellow-400" />
                                Why Choose Us
                                <HiLightningBolt className="text-blue-400" />
                            </motion.div>
                            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                                Experience <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Digital</span> Excellence
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                                Discover why thousands of customers trust us for their
                                <span className="text-cyan-400 font-semibold"> premium digital needs</span>
                            </p>
                        </motion.div>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ y: -15, scale: 1.05, boxShadow: "0 25px 50px rgba(6, 182, 212, 0.15)" }}
                                    className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/30 hover:border-cyan-400/40 transition-all duration-500 overflow-hidden text-center"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <div className="mb-6 flex justify-center">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                        <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="relative py-20 bg-black">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 backdrop-blur-sm border border-teal-500/30 rounded-full text-teal-300 text-sm font-medium mb-8">
                                <HiTrendingUp className="text-cyan-400" />
                                Performance Metrics
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                                Trusted by <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Thousands</span>
                            </h2>
                            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                                Our commitment to excellence is reflected in our performance metrics
                            </p>
                        </motion.div>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ y: -10, scale: 1.05 }}
                                    className="group bg-gradient-to-br from-gray-800/80 to-gray-700/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/30 hover:border-teal-400/40 transition-all duration-500 text-center"
                                >
                                    <div className="mb-4 flex justify-center">
                                        <div className="text-4xl">{stat.icon}</div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                                    <p className="text-lg font-semibold text-teal-400 mb-2">{stat.label}</p>
                                    <p className="text-sm text-gray-400">{stat.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default ReviewsPage;