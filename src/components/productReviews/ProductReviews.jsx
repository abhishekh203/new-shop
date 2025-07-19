import React, { useState, useEffect, useMemo, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
    FaStar, FaUser, FaClock, FaThumbsUp, FaThumbsDown, FaFlag, 
    FaFilter, FaSort, FaSearch, FaEdit, FaTrash, FaCheck, FaTimes,
    FaHeart, FaRegHeart, FaQuoteLeft, FaQuoteRight
} from 'react-icons/fa';
import { 
    FiMessageSquare, FiStar, FiUser, FiClock, FiChevronDown, 
    FiChevronUp, FiFilter, FiSearch, FiThumbsUp, FiThumbsDown,
    FiFlag, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle,
    FiZap, FiAward, FiX
} from 'react-icons/fi';
import { collection, addDoc, query, where, getDocs, orderBy, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import toast from 'react-hot-toast';
import myContext from '../../context/myContext';
import { format } from 'date-fns';

// Enhanced animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { 
            staggerChildren: 0.1, 
            delayChildren: 0.2,
            duration: 0.6
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { 
            duration: 0.6, 
            ease: [0.25, 0.1, 0.25, 1],
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    },
    hover: {
        y: -8,
        scale: 1.02,
        transition: { 
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

const floatingVariants = {
    animate: {
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

const pulseVariants = {
    animate: {
        scale: [1, 1.05, 1],
        opacity: [0.7, 1, 0.7],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

const ProductReviews = ({ productId, productTitle, showReviewForm = true, maxDisplayed = null }) => {
    const context = useContext(myContext);
    const { getAllReview, getAllUser } = context;
    
    // State management
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filterRating, setFilterRating] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedReview, setExpandedReview] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);
    
    // Review form state
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        title: '',
        review: '',
        // Anonymous user fields
        anonymousName: '',
        anonymousEmail: '',
        pros: '',
        cons: '',
        recommend: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // User data
    const user = JSON.parse(localStorage.getItem('users'));
    
    // Fetch product-specific reviews with real-time listener
    useEffect(() => {
        if (!productId) return;

        setLoading(true);
        const reviewsRef = collection(fireDB, 'reviews');
        const q = query(
            reviewsRef, 
            where('productId', '==', productId)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productReviews = [];
            querySnapshot.forEach((doc) => {
                productReviews.push({ id: doc.id, ...doc.data() });
            });
    
            setReviews(productReviews);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
            setLoading(false);
        });

        return () => unsubscribe();
    }, [productId]);

    // Get user info
    const getUserInfo = (userId) => {
        const userInfo = getAllUser.find(u => u.uid === userId || u.id === userId);
        return userInfo || { name: 'Anonymous User', email: 'N/A' };
    };

    // Check if user can review (now allows anonymous reviews)
    const canUserReview = useMemo(() => {
        if (user) {
            // For logged-in users, check if they already reviewed
            const hasReviewed = reviews.some(review => review.userId === user.uid);
            return !hasReviewed;
        }
        // Anonymous users can always review (admin will moderate)
        return true;
    }, [user, reviews]);

    // Filter and sort reviews
    const filteredAndSortedReviews = useMemo(() => {
        let filtered = [...reviews];
        

        
        // Show all reviews by default, not just approved ones
        // filtered = filtered.filter(review => review.approved === true);

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(review =>
                review.review?.toLowerCase().includes(search) ||
                review.title?.toLowerCase().includes(search) ||
                review.userName?.toLowerCase().includes(search) ||
                getUserInfo(review.userId)?.name?.toLowerCase().includes(search)
            );
        }

        if (filterRating !== 'all') {
            filtered = filtered.filter(review => review.rating === parseInt(filterRating));
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.timestamp?.seconds ? b.timestamp.seconds * 1000 : b.timestamp) - 
                           new Date(a.timestamp?.seconds ? a.timestamp.seconds * 1000 : a.timestamp);
                case 'oldest':
                    return new Date(a.timestamp?.seconds ? a.timestamp.seconds * 1000 : a.timestamp) - 
                           new Date(b.timestamp?.seconds ? b.timestamp.seconds * 1000 : b.timestamp);
                case 'rating-high':
                    return (b.rating || 0) - (a.rating || 0);
                case 'rating-low':
                    return (a.rating || 0) - (b.rating || 0);
                case 'helpful':
                    return (b.helpfulCount || 0) - (a.helpfulCount || 0);
                default:
                    return 0;
            }
        });

        if (maxDisplayed) {
            filtered = filtered.slice(0, maxDisplayed);
        }


        
        return filtered;
    }, [reviews, searchTerm, filterRating, sortBy, maxDisplayed, getAllUser]);

    // Calculate review statistics
    const reviewStats = useMemo(() => {
        // Use all reviews, not just approved ones
        const allReviews = reviews;
        const totalReviews = allReviews.length;
        const averageRating = totalReviews > 0 
            ? (allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
            : 0;

        const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
            const star = 5 - i;
            const count = allReviews.filter(r => r.rating === star).length;
            const percentage = totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(1) : 0;
            return { star, count, percentage };
        });

        return {
            totalReviews,
            averageRating,
            ratingDistribution
        };
    }, [reviews]);

    // Submit review
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!reviewForm.review.trim()) {
            toast.error('Please write a review');
            return;
        }

        // For anonymous users, require name
        if (!user && !reviewForm.anonymousName.trim()) {
            toast.error('Please enter your name');
            return;
        }

        setIsSubmitting(true);
        try {
            const reviewData = {
                productId,
                productTitle,
                // User identification
                userId: user ? user.uid : null,
                userName: user ? user.name : reviewForm.anonymousName.trim(),
                userEmail: user ? user.email : reviewForm.anonymousEmail.trim() || null,
                isAnonymousReview: !user,
                // Review content
                rating: reviewForm.rating,
                title: reviewForm.title.trim(),
                review: reviewForm.review.trim(),
                pros: reviewForm.pros.trim(),
                cons: reviewForm.cons.trim(),
                recommend: reviewForm.recommend,
                timestamp: new Date(),
                approved: false,
                reviewType: 'product',
                helpfulCount: 0,
                reported: false
            };

            await addDoc(collection(fireDB, 'reviews'), reviewData);
            toast.success('Review submitted successfully! It will be visible after admin approval.');
            
            setReviewForm({
                rating: 5,
                title: '',
                review: '',
                pros: '',
                cons: '',
                recommend: true,
                anonymousName: '',
                anonymousEmail: ''
            });
            setShowReviewModal(false);
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Mark review as helpful
    const markHelpful = async (reviewId) => {
        if (!user) {
            toast.error('Please login to mark reviews as helpful');
            return;
        }

        try {
            const reviewRef = doc(fireDB, 'reviews', reviewId);
            const review = reviews.find(r => r.id === reviewId);
            
            if (!review) return;
            
            // Check if user already voted
            const helpfulVoters = review.helpfulVoters || [];
            const hasVoted = helpfulVoters.includes(user.uid);
            
            if (hasVoted) {
                toast.info('You already marked this review as helpful');
                return;
            }
            
            // Add user to voters and increment count
            const updatedVoters = [...helpfulVoters, user.uid];
            const newHelpfulCount = (review.helpfulCount || 0) + 1;
            
            await updateDoc(reviewRef, { 
                helpfulCount: newHelpfulCount,
                helpfulVoters: updatedVoters
            });
            
            toast.success('Marked as helpful!');
        } catch (error) {
            console.error('Error marking helpful:', error);
            toast.error('Failed to mark as helpful');
        }
    };

    // Report review
    const reportReview = async (reviewId) => {
        if (!user) {
            toast.error('Please login to report reviews');
            return;
        }

        try {
            const reviewRef = doc(fireDB, 'reviews', reviewId);
            await updateDoc(reviewRef, { reported: true });
            toast.success('Review reported successfully');
        } catch (error) {
            console.error('Error reporting review:', error);
            toast.error('Failed to report review');
        }
    };

    // Enhanced star rating renderer
    const renderStars = (rating, interactive = false, size = 'text-lg') => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <motion.button
                    key={i}
                    type={interactive ? 'button' : undefined}
                    onClick={interactive ? () => setReviewForm({...reviewForm, rating: i}) : undefined}
                    whileHover={interactive ? { scale: 1.2, rotate: 5 } : {}}
                    whileTap={interactive ? { scale: 0.9 } : {}}
                    className={`${interactive ? 'cursor-pointer' : ''} ${size} ${
                        i <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } transition-all duration-200`}
                >
                    ★
                </motion.button>
            );
        }
        return stars;
    };

    // Format date
    const formatDate = (timestamp) => {
        try {
            const date = timestamp?.seconds 
                ? new Date(timestamp.seconds * 1000) 
                : new Date(timestamp);
            return format(date, 'MMM d, yyyy');
        } catch {
            return 'Invalid Date';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
                    variants={floatingVariants}
                    animate="animate"
                />
                <motion.div
                    className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl"
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: '2s' }}
                />
                <motion.div
                    className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-full blur-3xl"
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: '4s' }}
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 space-y-8"
            >
                {/* Enhanced Reviews Header & Stats */}
                <motion.div 
                    variants={itemVariants}
                    whileHover="hover"
                    className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50"
                >
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 25% 25%, #6366f1 0%, transparent 50%),
                                             radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
                            backgroundSize: '100px 100px'
                        }}></div>
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-3 mb-6"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiMessageSquare className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        Customer Reviews
                                    </h3>
                                    <p className="text-gray-400 text-sm">({reviewStats.totalReviews} reviews)</p>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                        {renderStars(Math.round(reviewStats.averageRating))}
                                    </div>
                                    <div>
                                        <span className="text-3xl font-bold text-white">
                                            {reviewStats.averageRating}
                                        </span>
                                        <span className="text-gray-400 ml-2">/ 5</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Enhanced Rating Distribution */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-6 space-y-3"
                            >
                                {reviewStats.ratingDistribution.map(({ star, count, percentage }, index) => (
                                    <motion.div 
                                        key={star} 
                                        className="flex items-center gap-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                    >
                                        <span className="text-sm font-medium text-gray-400 w-8">
                                            {star}★
                                        </span>
                                        <div className="flex-1 bg-gray-700/50 rounded-full h-3 overflow-hidden">
                                            <motion.div 
                                                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-400 w-12 text-right">
                                            {count}
                                        </span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Enhanced Write Review Button */}
                        {showReviewForm && canUserReview && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <motion.button
                                    onClick={() => setShowReviewModal(true)}
                                    whileHover={{ 
                                        scale: 1.05,
                                        boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl"
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                    <span className="relative flex items-center gap-2">
                                        <FiEdit2 className="text-lg" />
                                        Write a Review
                                    </span>
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Enhanced Filters & Search */}
                {reviewStats.totalReviews > 0 && (
                    <motion.div 
                        variants={itemVariants}
                        whileHover="hover"
                        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-700/50"
                    >
                        {/* Search Bar */}
                        <div className="mb-4">
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search reviews by content, title, or reviewer name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Quick Star Filters */}
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-300 mb-3">Filter by Rating:</p>
                            <div className="flex flex-wrap gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFilterRating('all')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        filterRating === 'all'
                                            ? 'bg-purple-600 text-white shadow-lg'
                                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                                    }`}
                                >
                                    All Reviews ({reviewStats.totalReviews})
                                </motion.button>
                                
                                {/* Star Rating Filters */}
                                {[
                                    { label: '5★', value: '5', exact: true },
                                    { label: '4★', value: '4', exact: true },
                                    { label: '3★', value: '3', exact: true },
                                    { label: '2★', value: '2', exact: true },
                                    { label: '1★', value: '1', exact: true }
                                ].map((filter) => {
                                    // Calculate exact count for this rating
                                    const count = reviews.filter(r => r.rating === parseInt(filter.value)).length;
                                    
                                    const stars = parseInt(filter.value);
                                    return (
                                        <motion.button
                                            key={filter.value}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setFilterRating(filter.value)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                                filterRating === filter.value
                                                    ? 'bg-yellow-600 text-white shadow-lg'
                                                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                                            }`}
                                        >
                                            <span className="flex items-center">
                                                {[...Array(stars)].map((_, i) => (
                                                    <FiStar key={i} className="w-3 h-3 fill-current" />
                                                ))}
                                            </span>
                                            <span className="text-xs">({count})</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sort Options & Active Filters */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-3">
                                <FiFilter className="text-gray-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="newest">📅 Newest First</option>
                                    <option value="oldest">📅 Oldest First</option>
                                    <option value="helpful">👍 Most Helpful</option>
                                    <option value="rating-high">⭐ Highest Rating</option>
                                    <option value="rating-low">⭐ Lowest Rating</option>
                                </select>
                            </div>

                            {/* Active Filters & Results */}
                            <div className="flex items-center gap-4 text-sm">
                                {(searchTerm || filterRating !== 'all') && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Active filters:</span>
                                        {searchTerm && (
                                            <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-md border border-blue-500/30">
                                                Search: "{searchTerm}"
                                            </span>
                                        )}
                                        {filterRating !== 'all' && (
                                            <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded-md border border-yellow-500/30 flex items-center gap-1">
                                                {[...Array(parseInt(filterRating))].map((_, i) => (
                                                    <FiStar key={i} className="w-3 h-3 fill-current" />
                                                ))}
                                            </span>
                                        )}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSearchTerm('');
                                                setFilterRating('all');
                                            }}
                                            className="px-2 py-1 bg-red-600/20 text-red-300 rounded-md border border-red-500/30 hover:bg-red-600/30 transition-all"
                                        >
                                            Clear All
                                        </motion.button>
                                    </div>
                                )}
                                <span className="text-gray-400">
                                    Showing {filteredAndSortedReviews.length} of {reviewStats.totalReviews} reviews
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Enhanced Reviews List */}
                <motion.div variants={itemVariants} className="space-y-6">
            
                    {filteredAndSortedReviews.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700/50"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <FiMessageSquare className="mx-auto text-6xl text-gray-400 mb-6" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {reviewStats.totalReviews === 0 ? 'No reviews yet' : 'No reviews match your criteria'}
                            </h3>
                            <p className="text-gray-400 text-lg">
                                {reviewStats.totalReviews === 0 
                                    ? 'Be the first to share your experience!' 
                                    : 'Try adjusting your search or filters.'
                                }
                            </p>
                        </motion.div>
                    ) : (
                        filteredAndSortedReviews.map((review, index) => {
                            const userInfo = getUserInfo(review.userId);
                            
                            return (
                                <motion.div
                                    key={review.id}
                                    variants={itemVariants}
                                    whileHover="hover"
                                    className="relative overflow-hidden bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                                >
                                    {/* Animated Background */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: `radial-gradient(circle at 20% 80%, #8b5cf6 0%, transparent 50%)`,
                                            backgroundSize: '200px 200px'
                                        }}></div>
                                    </div>

                                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-start gap-6">
                                        {/* Enhanced User Avatar & Info */}
                                        <div className="flex items-center gap-4 lg:flex-col lg:items-center lg:text-center lg:min-w-[140px]">
                                            <motion.div 
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                                            >
                                                <span>{(review.userName || userInfo.name || 'A').charAt(0).toUpperCase()}</span>
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"
                                                    animate={{ x: ['-100%', '100%'] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                />
                                            </motion.div>
                                            <div>
                                                <p className="font-semibold text-white text-lg">
                                                    {review.userName || userInfo.name || 'Anonymous'}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    {formatDate(review.timestamp)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Enhanced Review Content */}
                                        <div className="flex-1">
                                            {/* Rating & Title */}
                                            <div className="flex items-center gap-4 mb-4">
                                                <motion.div 
                                                    className="flex items-center"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    {renderStars(review.rating)}
                                                </motion.div>
                                                {review.title && (
                                                    <h4 className="font-bold text-white text-lg">
                                                        {review.title}
                                                    </h4>
                                                )}
                                            </div>

                                            {/* Review Text */}
                                            <motion.p 
                                                className="text-gray-300 mb-6 leading-relaxed text-lg"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                {review.review}
                                            </motion.p>

                                            {/* Admin Response */}
                                            {review.hasAdminResponse && review.adminResponse && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="mb-6 p-4 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl border border-blue-500/20 backdrop-blur-sm"
                                                >
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                            <FiMessageSquare className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-semibold text-blue-400 text-sm">
                                                                Response from {review.adminResponse.respondedBy || 'Digital Shop Nepal'}
                                                            </h5>
                                                            <p className="text-xs text-blue-300/70">
                                                                {formatDate(review.adminResponse.respondedAt)}
                                                            </p>
                                                        </div>
                                                        <div className="ml-auto">
                                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                                                                Official Response
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-blue-200 leading-relaxed">
                                                        {review.adminResponse.text}
                                                    </p>
                                                </motion.div>
                                            )}

                                            {/* Enhanced Pros & Cons */}
                                            {(review.pros || review.cons) && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                    {review.pros && (
                                                        <motion.div 
                                                            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-500/20"
                                                            whileHover={{ scale: 1.02 }}
                                                        >
                                                            <h5 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                                                                <FiCheckCircle />
                                                                Pros
                                                            </h5>
                                                            <p className="text-green-300 text-sm">
                                                                {review.pros}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                    {review.cons && (
                                                        <motion.div 
                                                            className="bg-gradient-to-br from-red-500/10 to-pink-500/10 p-4 rounded-xl border border-red-500/20"
                                                            whileHover={{ scale: 1.02 }}
                                                        >
                                                            <h5 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                                                                <FiXCircle />
                                                                Cons
                                                            </h5>
                                                            <p className="text-red-300 text-sm">
                                                                {review.cons}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Enhanced Recommendation */}
                                            {review.recommend !== undefined && (
                                                <motion.div 
                                                    className="flex items-center gap-3 mb-6 p-3 bg-gray-700/30 rounded-xl"
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    {review.recommend ? (
                                                        <>
                                                            <FiCheckCircle className="text-green-400 text-xl" />
                                                            <span className="text-green-400 font-semibold">
                                                                Recommends this product
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiXCircle className="text-red-400 text-xl" />
                                                            <span className="text-red-400 font-semibold">
                                                                Does not recommend this product
                                                            </span>
                                                        </>
                                                    )}
                                                </motion.div>
                                            )}

                                            {/* Enhanced Actions */}
                                            <div className="flex items-center gap-6">
                                                <motion.button
                                                    onClick={() => markHelpful(review.id)}
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
                                                >
                                                    <FiThumbsUp className="w-5 h-5" />
                                                    <span>Helpful ({review.helpfulCount || 0})</span>
                                                </motion.button>
                                                
                                                <motion.button
                                                    onClick={() => reportReview(review.id)}
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                                                >
                                                    <FiFlag className="w-5 h-5" />
                                                    <span>Report</span>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>

                {/* Enhanced Review Modal */}
                <AnimatePresence>
                    {showReviewModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setShowReviewModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                                className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-xl max-h-[75vh] overflow-y-auto border border-gray-700/50 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Animated Background */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `radial-gradient(circle at 25% 25%, #8b5cf6 0%, transparent 50%)`,
                                        backgroundSize: '150px 150px'
                                    }}></div>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                                <FiEdit2 className="text-white text-lg" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">
                                                Write a Review
                                            </h3>
                                        </div>
                                        <motion.button
                                            onClick={() => setShowReviewModal(false)}
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-2 rounded-xl transition-all duration-200"
                                        >
                                            <FaTimes className="w-5 h-5" />
                                        </motion.button>
                                    </div>

                                    <form onSubmit={handleSubmitReview} className="space-y-4">
                                        {/* Enhanced Rating */}
                                        <div>
                                            <label className="block text-lg font-semibold text-white mb-3">
                                                Overall Rating *
                                            </label>
                                            <div className="flex items-center gap-2 mb-4">
                                                {renderStars(reviewForm.rating, true, 'text-3xl')}
                                            </div>
                                        </div>

                                        {/* Anonymous User Information */}
                                        {!user && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-4 rounded-xl border border-blue-500/20"
                                            >
                                                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                                    <FiUser className="w-4 h-4" />
                                                    Your Information
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={reviewForm.anonymousName}
                                                            onChange={(e) => setReviewForm({...reviewForm, anonymousName: e.target.value})}
                                                            placeholder="Enter your name"
                                                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            Email (Optional)
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={reviewForm.anonymousEmail}
                                                            onChange={(e) => setReviewForm({...reviewForm, anonymousEmail: e.target.value})}
                                                            placeholder="your@email.com"
                                                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    💡 Your review will be moderated before appearing publicly. 
                                                    {user ? '' : ' Consider creating an account for faster approval!'}
                                                </p>
                                            </motion.div>
                                        )}

                                        {/* Logged-in User Notice */}
                                        {user && (
                                            <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 p-3 rounded-xl border border-green-500/20">
                                                <p className="text-green-300 text-sm flex items-center gap-2">
                                                    <FiCheckCircle className="w-4 h-4" />
                                                    Reviewing as <strong>{user.name}</strong> - Your review will be processed faster!
                                                </p>
                                            </div>
                                        )}

                                        {/* Enhanced Title */}
                                        <div>
                                            <label className="block text-lg font-semibold text-white mb-2">
                                                Review Title
                                            </label>
                                            <input
                                                type="text"
                                                value={reviewForm.title}
                                                onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                                                placeholder="Summarize your experience"
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        {/* Enhanced Review Text */}
                                        <div>
                                            <label className="block text-lg font-semibold text-white mb-2">
                                                Your Review *
                                            </label>
                                            <textarea
                                                value={reviewForm.review}
                                                onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                                                placeholder="Share your detailed experience with this product..."
                                                rows={3}
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                                required
                                            />
                                        </div>

                                        {/* Enhanced Pros & Cons */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-lg font-semibold text-white mb-2">
                                                    Pros (Optional)
                                                </label>
                                                <textarea
                                                    value={reviewForm.pros}
                                                    onChange={(e) => setReviewForm({...reviewForm, pros: e.target.value})}
                                                    placeholder="What did you like?"
                                                    rows={2}
                                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-lg font-semibold text-white mb-2">
                                                    Cons (Optional)
                                                </label>
                                                <textarea
                                                    value={reviewForm.cons}
                                                    onChange={(e) => setReviewForm({...reviewForm, cons: e.target.value})}
                                                    placeholder="What could be improved?"
                                                    rows={2}
                                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Enhanced Recommendation */}
                                        <div>
                                            <label className="block text-lg font-semibold text-white mb-2">
                                                Would you recommend this product?
                                            </label>
                                            <div className="flex gap-6">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="recommend"
                                                        checked={reviewForm.recommend === true}
                                                        onChange={() => setReviewForm({...reviewForm, recommend: true})}
                                                        className="mr-3 w-4 h-4 text-purple-500"
                                                    />
                                                    <span className="text-green-400 font-semibold">Yes, I recommend it</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="recommend"
                                                        checked={reviewForm.recommend === false}
                                                        onChange={() => setReviewForm({...reviewForm, recommend: false})}
                                                        className="mr-3 w-4 h-4 text-purple-500"
                                                    />
                                                    <span className="text-red-400 font-semibold">No, I don't recommend it</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Enhanced Submit Buttons */}
                                        <div className="flex gap-4 pt-2">
                                                                                         <motion.button
                                                 type="submit"
                                                 disabled={isSubmitting}
                                                 whileHover={{ scale: 1.02 }}
                                                 whileTap={{ scale: 0.98 }}
                                                 className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                                             >
                                                 {isSubmitting ? (
                                                     <>
                                                         <motion.div
                                                             animate={{ rotate: 360 }}
                                                             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                             className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                         />
                                                         Submitting...
                                                     </>
                                                 ) : (
                                                     <>
                                                         <FiZap className="text-base" />
                                                         Submit Review
                                                     </>
                                                 )}
                                             </motion.button>
                                             <motion.button
                                                 type="button"
                                                 onClick={() => setShowReviewModal(false)}
                                                 whileHover={{ scale: 1.02 }}
                                                 whileTap={{ scale: 0.98 }}
                                                 className="px-6 py-3 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-200"
                                             >
                                                 Cancel
                                             </motion.button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ProductReviews; 