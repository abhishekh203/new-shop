import React, { useState, useEffect, useMemo, useContext } from 'react';
import { 
    FaStar, FaUser, FaClock, FaThumbsUp, FaThumbsDown, FaFlag, 
    FaFilter, FaSort, FaSearch, FaEdit, FaTrash, FaCheck, FaTimes,
    FaHeart, FaRegHeart, FaQuoteLeft, FaQuoteRight, FaPlus, FaMinus
} from 'react-icons/fa';
import { 
    FiMessageSquare, FiStar, FiUser, FiClock, FiChevronDown, 
    FiChevronUp, FiFilter, FiSearch, FiThumbsUp, FiThumbsDown,
    FiFlag, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle,
    FiZap, FiAward, FiX
} from 'react-icons/fi';
import { collection, addDoc, query, where, getDocs, orderBy, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import { useNotification } from '../../context/NotificationContext';
import myContext from '../../context/myContext';
import { format } from 'date-fns';
import { serifTheme } from '../../design-system/themes/serifTheme';
import { SerifButton, SerifBadge, SerifDropdown } from '../../design-system/components';


const ProductReviews = ({ productId, productTitle, showReviewForm = true, maxDisplayed = null }) => {
    const context = useContext(myContext);
    const { getAllReview, getAllUser } = context;
    const notification = useNotification();
    
    // State management
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
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
            notification.error('Failed to load reviews');
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
            ? allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
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
            notification.error('Please write a review');
            return;
        }

        // For anonymous users, require name
        if (!user && !reviewForm.anonymousName.trim()) {
            notification.error('Please enter your name');
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
            notification.success('Review submitted successfully! It will be visible after admin approval.');
            
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
        } catch (error) {
            console.error('Error submitting review:', error);
            notification.error('Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Mark review as helpful
    const markHelpful = async (reviewId) => {
        if (!user) {
            notification.error('Please login to mark reviews as helpful');
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
                notification.info('You already marked this review as helpful');
                return;
            }
            
            // Add user to voters and increment count
            const updatedVoters = [...helpfulVoters, user.uid];
            const newHelpfulCount = (review.helpfulCount || 0) + 1;
            
            await updateDoc(reviewRef, { 
                helpfulCount: newHelpfulCount,
                helpfulVoters: updatedVoters
            });
            
            notification.success('Marked as helpful!');
        } catch (error) {
            console.error('Error marking helpful:', error);
            notification.error('Failed to mark as helpful');
        }
    };

    // Report review
    const reportReview = async (reviewId) => {
        if (!user) {
            notification.error('Please login to report reviews');
            return;
        }

        try {
            const reviewRef = doc(fireDB, 'reviews', reviewId);
            await updateDoc(reviewRef, { reported: true });
            notification.success('Review reported successfully');
        } catch (error) {
            console.error('Error reporting review:', error);
            notification.error('Failed to report review');
        }
    };

    // Star rating renderer
    const renderStars = (rating, interactive = false, size = 'text-lg') => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <button
                    key={i}
                    type={interactive ? 'button' : undefined}
                    onClick={interactive ? () => setReviewForm({...reviewForm, rating: i}) : undefined}
                    className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} ${size} ${
                        i <= rating ? 'text-yellow-500' : serifTheme.colors.text.tertiary
                    } ${serifTheme.transitions.default}`}
                >
                    ★
                </button>
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
            <div className="flex items-center justify-center py-20" style={{ fontFamily: serifTheme.fontFamily.serif }}>
                <div className={`w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin`} />
            </div>
        );
    }

    return (
        <div className="relative" style={{ fontFamily: serifTheme.fontFamily.serif }}>
            <div className="relative z-10 space-y-8">
                {/* Compact Reviews Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h3 className={`text-2xl font-bold ${serifTheme.gradients.accent}`}>
                                        Customer Reviews
                                    </h3>
                        <span className={`${serifTheme.colors.text.tertiary} text-sm`}>
                            ({reviewStats.totalReviews} reviews)
                                        </span>
                        {reviewStats.totalReviews > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {renderStars(Math.round(reviewStats.averageRating || 0), false, 'text-base')}
                            </div>
                                <span className={`text-lg font-bold ${serifTheme.colors.text.primary}`}>
                                    {typeof reviewStats.averageRating === 'number' ? reviewStats.averageRating.toFixed(1) : '0.0'}
                                            </span>
                            </div>
                        )}
                                    </div>
                            </div>

                {/* Reviews List - Show First */}
                    {filteredAndSortedReviews.length === 0 ? (
                    <div className={`text-center py-16 ${serifTheme.gradients.card} backdrop-blur-xl ${serifTheme.radius.card} ${serifTheme.colors.shadow.button} border ${serifTheme.colors.border.primary}`}>
                        <div>
                            <FiMessageSquare className={`mx-auto text-6xl ${serifTheme.colors.text.tertiary} mb-6`} />
                        </div>
                        <h3 className={`text-2xl font-bold ${serifTheme.colors.text.primary} mb-3`}>
                                {reviewStats.totalReviews === 0 ? 'No reviews yet' : 'No reviews match your criteria'}
                            </h3>
                        <p className={`${serifTheme.colors.text.tertiary} text-lg`}>
                                {reviewStats.totalReviews === 0 
                                    ? 'Be the first to share your experience!' 
                                    : 'Try adjusting your search or filters.'
                                }
                            </p>
                    </div>
                    ) : (
                    <div className="space-y-6">
                        {filteredAndSortedReviews.map((review, index) => {
                            const userInfo = getUserInfo(review.userId);
                            
                            return (
                                <div
                                    key={review.id}
                                    className={`py-6 ${index !== filteredAndSortedReviews.length - 1 ? `border-b ${serifTheme.colors.border.primary}` : ''}`}
                                    style={{ fontFamily: serifTheme.fontFamily.serif }}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                        {/* User Avatar & Info */}
                                        <div className="flex items-center gap-4 lg:flex-col lg:items-center lg:text-center lg:min-w-[140px]">
                                            <div 
                                                className={`relative w-16 h-16 ${serifTheme.gradients.button} ${serifTheme.radius.card} flex items-center justify-center ${serifTheme.colors.text.buttonPrimary} font-bold text-xl ${serifTheme.colors.shadow.button}`}
                                            >
                                                <span>{(review.userName || userInfo.name || 'A').charAt(0).toUpperCase()}</span>
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"
                                                />
                                            </div>
                                            <div>
                                                <p className={`font-semibold ${serifTheme.colors.text.primary} text-lg`}>
                                                    {review.userName || userInfo.name || 'Anonymous'}
                                                </p>
                                                <p className={`${serifTheme.colors.text.tertiary} text-sm`}>
                                                    {formatDate(review.timestamp)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Review Content */}
                                        <div className="flex-1">
                                            {/* Rating & Title */}
                                            <div className="flex items-center gap-4 mb-4">
                                                <div 
                                                    className="flex items-center"
                                                >
                                                    {renderStars(review.rating)}
                                                </div>
                                                {review.title && (
                                                    <h4 className={`font-bold ${serifTheme.colors.text.primary} text-lg`}>
                                                        {review.title}
                                                    </h4>
                                                )}
                                            </div>

                                            {/* Review Text */}
                                            <p 
                                                className={`${serifTheme.colors.text.secondary} mb-6 leading-relaxed text-lg`}
                                            >
                                                {review.review}
                                            </p>

                                            {/* Admin Response */}
                                            {review.hasAdminResponse && review.adminResponse && (
                                                <div
                                                    className={`mb-6 p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 ${serifTheme.radius.card} border border-amber-500/30 backdrop-blur-sm`}
                                                >
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className={`w-8 h-8 ${serifTheme.gradients.button} ${serifTheme.radius.button} flex items-center justify-center`}>
                                                            <FiMessageSquare className={`w-4 h-4 ${serifTheme.colors.text.buttonPrimary}`} />
                                                        </div>
                                                        <div>
                                                            <h5 className={`font-semibold ${serifTheme.colors.text.accent} text-sm`}>
                                                                Response from {review.adminResponse.respondedBy || 'Digital Shop Nepal'}
                                                            </h5>
                                                            <p className={`text-xs ${serifTheme.colors.text.tertiary}`}>
                                                                {formatDate(review.adminResponse.respondedAt)}
                                                            </p>
                                                        </div>
                                                        <div className="ml-auto">
                                                            <SerifBadge variant="primary" size="small">
                                                                Official Response
                                                            </SerifBadge>
                                                        </div>
                                                    </div>
                                                    <p className={`${serifTheme.colors.text.secondary} leading-relaxed`}>
                                                        {review.adminResponse.text}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Pros & Cons */}
                                            {(review.pros || review.cons) && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                    {review.pros && (
                                                        <div 
                                                            className={`bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 ${serifTheme.radius.card} border border-green-500/30`}
                                                        >
                                                            <h5 className={`font-semibold text-green-600 mb-2 flex items-center gap-2`}>
                                                                <FiCheckCircle />
                                                                Pros
                                                            </h5>
                                                            <p className={`${serifTheme.colors.text.secondary} text-sm`}>
                                                                {review.pros}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {review.cons && (
                                                        <div 
                                                            className={`bg-gradient-to-br from-red-500/10 to-pink-500/10 p-4 ${serifTheme.radius.card} border border-red-500/30`}
                                                        >
                                                            <h5 className={`font-semibold text-red-600 mb-2 flex items-center gap-2`}>
                                                                <FiXCircle />
                                                                Cons
                                                            </h5>
                                                            <p className={`${serifTheme.colors.text.secondary} text-sm`}>
                                                                {review.cons}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Recommendation */}
                                            {review.recommend !== undefined && (
                                                <div 
                                                    className={`flex items-center gap-3 mb-6 p-3 ${serifTheme.colors.background.tertiary} ${serifTheme.radius.card} ${serifTheme.transitions.default}`}
                                                >
                                                    {review.recommend ? (
                                                        <>
                                                            <FiCheckCircle className="text-green-600 text-xl" />
                                                            <span className="text-green-600 font-semibold">
                                                                Recommends this product
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiXCircle className="text-red-600 text-xl" />
                                                            <span className="text-red-600 font-semibold">
                                                                Does not recommend this product
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center gap-6">
                                                <button
                                                    onClick={() => markHelpful(review.id)}
                                                    className={`flex items-center gap-2 ${serifTheme.colors.text.tertiary} hover:text-amber-600 ${serifTheme.transitions.default}`}
                                                >
                                                    <FiThumbsUp className="w-5 h-5" />
                                                    <span>Helpful ({review.helpfulCount || 0})</span>
                                                </button>
                                                
                                                <button
                                                    onClick={() => reportReview(review.id)}
                                                    className={`flex items-center gap-2 ${serifTheme.colors.text.tertiary} hover:text-red-600 ${serifTheme.transitions.default}`}
                                                >
                                                    <FiFlag className="w-5 h-5" />
                                                    <span>Report</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Filters & Search */}
                {reviewStats.totalReviews > 0 && (
                    <div className={`${serifTheme.gradients.card} backdrop-blur-xl ${serifTheme.radius.card} p-6 ${serifTheme.colors.shadow.button} border ${serifTheme.colors.border.primary}`}>
                        {/* Search Bar */}
                        <div className="mb-4">
                            <div className="relative">
                                <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${serifTheme.colors.text.tertiary}`} />
                                <input
                                    type="text"
                                    placeholder="Search reviews by content, title, or reviewer name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} ${serifTheme.colors.text.primary} placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${serifTheme.transitions.default}`}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${serifTheme.colors.text.tertiary} hover:${serifTheme.colors.text.primary} ${serifTheme.transitions.default}`}
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Quick Star Filters */}
                        <div className="mb-4">
                            <p className={`text-sm font-medium ${serifTheme.colors.text.secondary} mb-3`}>Filter by Rating:</p>
                            <div className="flex flex-wrap gap-2">
                                <SerifButton
                                    onClick={() => setFilterRating('all')}
                                    variant={filterRating === 'all' ? 'primary' : 'secondary'}
                                    size="small"
                                >
                                    All Reviews ({reviewStats.totalReviews})
                                </SerifButton>
                                
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
                                        <SerifButton
                                            key={filter.value}
                                            onClick={() => setFilterRating(filter.value)}
                                            variant={filterRating === filter.value ? 'primary' : 'secondary'}
                                            size="small"
                                            className="flex items-center gap-2"
                                        >
                                            <span className="flex items-center">
                                                {[...Array(stars)].map((_, i) => (
                                                    <FiStar key={i} className="w-3 h-3 fill-current" />
                                                ))}
                                            </span>
                                            <span className="text-xs">({count})</span>
                                        </SerifButton>
                                    );
                                })}
                            </div>
                                </div>

                        {/* Sort Options & Active Filters */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            {/* Sort Dropdown */}
                                        <div className="flex items-center gap-3">
                                <FiFilter className={serifTheme.colors.text.tertiary} />
                                <SerifDropdown
                                    value={sortBy}
                                    onChange={(value) => setSortBy(value)}
                                    options={[
                                        { id: 'newest', value: 'newest', label: '📅 Newest First' },
                                        { id: 'oldest', value: 'oldest', label: '📅 Oldest First' },
                                        { id: 'helpful', value: 'helpful', label: '👍 Most Helpful' },
                                        { id: 'rating-high', value: 'rating-high', label: '⭐ Highest Rating' },
                                        { id: 'rating-low', value: 'rating-low', label: '⭐ Lowest Rating' }
                                    ]}
                                />
                                            </div>

                            {/* Active Filters & Results */}
                            <div className="flex items-center gap-4 text-sm">
                                {(searchTerm || filterRating !== 'all') && (
                                    <div className="flex items-center gap-2">
                                        <span className={serifTheme.colors.text.tertiary}>Active filters:</span>
                                        {searchTerm && (
                                            <span className={`px-2 py-1 bg-amber-500/20 ${serifTheme.colors.text.accent} ${serifTheme.radius.button} border border-amber-500/30`}>
                                                Search: "{searchTerm}"
                                            </span>
                                        )}
                                        {filterRating !== 'all' && (
                                            <span className={`px-2 py-1 bg-amber-500/20 ${serifTheme.colors.text.accent} ${serifTheme.radius.button} border border-amber-500/30 flex items-center gap-1`}>
                                                {[...Array(parseInt(filterRating))].map((_, i) => (
                                                    <FiStar key={i} className="w-3 h-3 fill-current" />
                                                ))}
                                            </span>
                                        )}
                                        <SerifButton
                                            onClick={() => {
                                                setSearchTerm('');
                                                setFilterRating('all');
                                            }}
                                            variant="danger"
                                            size="small"
                                        >
                                            Clear All
                                        </SerifButton>
                                    </div>
                                )}
                                <span className={serifTheme.colors.text.tertiary}>
                                    Showing {filteredAndSortedReviews.length} of {reviewStats.totalReviews} reviews
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Inline Review Form - Show Below Reviews */}
                {showReviewForm && canUserReview && (
                    <div className={`${serifTheme.radius.card} ${serifTheme.gradients.card} p-6 border ${serifTheme.colors.border.primary} mt-8`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-10 h-10 ${serifTheme.gradients.button} ${serifTheme.radius.card} flex items-center justify-center`}>
                                <FiEdit2 className={`${serifTheme.colors.text.buttonPrimary} text-lg`} />
                            </div>
                            <h3 className={`text-xl font-bold ${serifTheme.colors.text.primary}`}>
                                                Write a Review
                                            </h3>
                                    </div>

                                    <form onSubmit={handleSubmitReview} className="space-y-4">
                            {/* Rating */}
                                        <div>
                                <label className={`block text-lg font-semibold ${serifTheme.colors.text.primary} mb-3`}>
                                                Overall Rating *
                                            </label>
                                            <div className="flex items-center gap-2 mb-4">
                                                {renderStars(reviewForm.rating, true, 'text-3xl')}
                                            </div>
                                        </div>

                                        {/* Anonymous User Information */}
                                        {!user && (
                                <div
                                    className={`bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4 ${serifTheme.radius.card} border border-amber-500/30`}
                                >
                                    <h4 className={`${serifTheme.colors.text.primary} font-semibold mb-3 flex items-center gap-2`}>
                                                    <FiUser className="w-4 h-4" />
                                                    Your Information
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                            <label className={`block text-sm font-medium ${serifTheme.colors.text.secondary} mb-2`}>
                                                            Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={reviewForm.anonymousName}
                                                            onChange={(e) => setReviewForm({...reviewForm, anonymousName: e.target.value})}
                                                            placeholder="Enter your name"
                                                className={`w-full px-3 py-2 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} ${serifTheme.colors.text.primary} placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${serifTheme.transitions.default}`}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                            <label className={`block text-sm font-medium ${serifTheme.colors.text.secondary} mb-2`}>
                                                            Email (Optional)
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={reviewForm.anonymousEmail}
                                                            onChange={(e) => setReviewForm({...reviewForm, anonymousEmail: e.target.value})}
                                                            placeholder="your@email.com"
                                                className={`w-full px-3 py-2 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} ${serifTheme.colors.text.primary} placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${serifTheme.transitions.default}`}
                                                        />
                                                    </div>
                                                </div>
                                    <p className={`text-xs ${serifTheme.colors.text.tertiary} mt-2`}>
                                                    💡 Your review will be moderated before appearing publicly. 
                                                    {user ? '' : ' Consider creating an account for faster approval!'}
                                                </p>
                                </div>
                                        )}

                                        {/* Logged-in User Notice */}
                                        {user && (
                                <div className={`bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-3 ${serifTheme.radius.card} border border-green-500/30`}>
                                    <p className={`text-green-600 text-sm flex items-center gap-2`}>
                                                    <FiCheckCircle className="w-4 h-4" />
                                                    Reviewing as <strong>{user.name}</strong> - Your review will be processed faster!
                                                </p>
                                            </div>
                                        )}

                            {/* Title */}
                                        <div>
                                <label className={`block text-lg font-semibold ${serifTheme.colors.text.primary} mb-2`}>
                                                Review Title
                                            </label>
                                            <input
                                                type="text"
                                                value={reviewForm.title}
                                                onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                                                placeholder="Summarize your experience"
                                    className={`w-full px-4 py-3 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.card} ${serifTheme.colors.text.primary} placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${serifTheme.transitions.default}`}
                                            />
                                        </div>

                            {/* Review Text */}
                                        <div>
                                <label className={`block text-lg font-semibold ${serifTheme.colors.text.primary} mb-2`}>
                                                Your Review *
                                            </label>
                                            <textarea
                                                value={reviewForm.review}
                                                onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                                                placeholder="Share your detailed experience with this product..."
                                                rows={3}
                                    className={`w-full px-4 py-3 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.card} ${serifTheme.colors.text.primary} placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${serifTheme.transitions.default} resize-none`}
                                                required
                                            />
                                        </div>

                            {/* Pros & Cons */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                    <label className={`block text-lg font-semibold ${serifTheme.colors.text.primary} mb-2`}>
                                                    Pros (Optional)
                                                </label>
                                                <textarea
                                                    value={reviewForm.pros}
                                                    onChange={(e) => setReviewForm({...reviewForm, pros: e.target.value})}
                                                    placeholder="What did you like?"
                                                    rows={2}
                                        className={`w-full px-4 py-3 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.card} ${serifTheme.colors.text.primary} placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${serifTheme.transitions.default} resize-none`}
                                                />
                                            </div>
                                            <div>
                                    <label className={`block text-lg font-semibold ${serifTheme.colors.text.primary} mb-2`}>
                                                    Cons (Optional)
                                                </label>
                                                <textarea
                                                    value={reviewForm.cons}
                                                    onChange={(e) => setReviewForm({...reviewForm, cons: e.target.value})}
                                                    placeholder="What could be improved?"
                                                    rows={2}
                                        className={`w-full px-4 py-3 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.card} ${serifTheme.colors.text.primary} placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${serifTheme.transitions.default} resize-none`}
                                                />
                                            </div>
                                        </div>

                            {/* Recommendation */}
                                        <div>
                                <label className={`block text-lg font-semibold ${serifTheme.colors.text.primary} mb-2`}>
                                                Would you recommend this product?
                                            </label>
                                            <div className="flex gap-6">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="recommend"
                                                        checked={reviewForm.recommend === true}
                                                        onChange={() => setReviewForm({...reviewForm, recommend: true})}
                                            className={`mr-3 w-4 h-4 ${serifTheme.colors.text.accent}`}
                                                    />
                                        <span className={`text-green-600 font-semibold`}>Yes, I recommend it</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="recommend"
                                                        checked={reviewForm.recommend === false}
                                                        onChange={() => setReviewForm({...reviewForm, recommend: false})}
                                            className={`mr-3 w-4 h-4 ${serifTheme.colors.text.accent}`}
                                                    />
                                        <span className={`text-red-600 font-semibold`}>No, I don't recommend it</span>
                                                </label>
                                            </div>
                                        </div>

                            {/* Submit Button */}
                                        <div className="flex gap-4 pt-2">
                                <SerifButton
                                                 type="submit"
                                                 disabled={isSubmitting}
                                    variant="primary"
                                    size="large"
                                    loading={isSubmitting}
                                    icon={!isSubmitting ? <FiZap /> : undefined}
                                    className="flex-1"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </SerifButton>
                                        </div>
                                    </form>
                                </div>
                    )}
            </div>
        </div>
    );
};

export default ProductReviews; 