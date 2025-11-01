import React, { useContext, useState, useEffect, useMemo } from "react";
import myContext from "../../context/myContext";
import Loader from "../loader/Loader";
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";
import { 
    FiTrash2, FiCheck, FiX, FiSearch, FiFilter, FiChevronDown, FiChevronUp, 
    FiStar, FiUser, FiClock, FiEye, FiEyeOff, FiMessageSquare, FiTrendingUp,
    FiBarChart, FiCalendar, FiShoppingBag, FiAlertCircle, FiCheckCircle,
    FiXCircle, FiMail, FiThumbsUp, FiThumbsDown, FiMessageCircle
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

// Animation variants
const pageContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
};

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } }
};

const filterVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
};

// Helper functions
const formatDate = (dateInput) => {
    try {
        const date = dateInput?.seconds 
            ? new Date(dateInput.seconds * 1000) 
            : new Date(dateInput);
        return isNaN(date) ? "Invalid Date" : format(date, 'MMM d, yyyy • h:mm a');
    } catch {
        return "Invalid Date";
    }
};

const getStatusBadge = (approved, status) => {
    if (status === 'deleted') return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Deleted' };
    if (approved === true) return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', label: 'Approved' };
    if (approved === false) return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Rejected' };
    return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Pending' };
};

const getReviewTypeIcon = (reviewType) => {
    switch(reviewType) {
        case 'verified': return <FiCheckCircle className="text-green-400" />;
        case 'anonymous': return <FiUser className="text-gray-400" />;
        case 'product': return <FiShoppingBag className="text-blue-400" />;
        default: return <FiMessageSquare className="text-gray-400" />;
    }
};

const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
        <FiStar
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
        />
    ));
};

const ReviewDetail = ({ globalSearchTerm = "" }) => {
    const context = useContext(myContext);
    const { loading, getAllReview, reviewDelete, getAllProduct, getAllUser, getAllOrder } = context;

    // State management
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [responseFilter, setResponseFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
    const [showFilters, setShowFilters] = useState(false);
    const [expandedReview, setExpandedReview] = useState(null);
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [bulkAction, setBulkAction] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "timestamp", direction: "desc" });
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [respondingToReview, setRespondingToReview] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [submittingResponse, setSubmittingResponse] = useState(false);

    // Analytics calculations
    const analytics = useMemo(() => {
        const total = getAllReview.length;
        const approved = getAllReview.filter(r => r.approved === true).length;
        const pending = getAllReview.filter(r => r.approved !== true && r.approved !== false).length;
        const rejected = getAllReview.filter(r => r.approved === false).length;
        const avgRating = total > 0 ? (getAllReview.reduce((sum, r) => sum + (r.rating || 0), 0) / total).toFixed(1) : 0;
        
        const ratingDistribution = Array.from({ length: 5 }, (_, i) => ({
            stars: i + 1,
            count: getAllReview.filter(r => r.rating === i + 1).length
        }));

        const recentReviews = getAllReview.filter(r => {
            const reviewDate = r.timestamp?.seconds ? new Date(r.timestamp.seconds * 1000) : new Date(r.timestamp);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return reviewDate >= weekAgo;
        }).length;

        return {
            total,
            approved,
            pending,
            rejected,
            avgRating,
            ratingDistribution,
            recentReviews,
            approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0
        };
    }, [getAllReview]);

    // Enhanced product and user data lookup
    const getProductInfo = (productId) => {
        return getAllProduct.find(p => p.id === productId) || { title: 'Unknown Product', category: 'Unknown' };
    };

    const getUserInfo = (userId) => {
        return getAllUser.find(u => u.uid === userId || u.id === userId) || { name: 'Anonymous User', email: 'N/A' };
    };

    const getUserOrderHistory = async (userId) => {
        try {
            const userOrders = getAllOrder.filter(order => order.userid === userId);
            return userOrders.length;
        } catch (error) {
            console.error("Error getting user order history:", error);
            return 0;
        }
    };

    // Filtered and sorted reviews
    const filteredReviews = useMemo(() => {
        let filtered = [...getAllReview];

        // Search filter (combine local and global search)
        const combinedSearchQuery = globalSearchTerm || searchQuery;
        if (combinedSearchQuery.trim()) {
            const query = combinedSearchQuery.toLowerCase();
            filtered = filtered.filter(review =>
                review.review?.toLowerCase().includes(query) ||
                review.userName?.toLowerCase().includes(query) ||
                review.userEmail?.toLowerCase().includes(query) ||
                review.service?.toLowerCase().includes(query) ||
                getProductInfo(review.productId)?.title?.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            if (statusFilter === "approved") filtered = filtered.filter(r => r.approved === true);
            else if (statusFilter === "pending") filtered = filtered.filter(r => r.approved !== true && r.approved !== false);
            else if (statusFilter === "rejected") filtered = filtered.filter(r => r.approved === false);
        }

        // Rating filter
        if (ratingFilter !== "all") {
            filtered = filtered.filter(r => r.rating === parseInt(ratingFilter));
        }

        // User type filter
        if (typeFilter !== "all") {
            if (typeFilter === "anonymous") {
                filtered = filtered.filter(r => r.isAnonymousReview === true);
            } else if (typeFilter === "registered") {
                filtered = filtered.filter(r => !r.isAnonymousReview);
            }
        }

        // Response filter
        if (responseFilter !== "all") {
            if (responseFilter === "responded") {
                filtered = filtered.filter(r => r.hasAdminResponse === true);
            } else if (responseFilter === "not_responded") {
                filtered = filtered.filter(r => !r.hasAdminResponse);
            }
        }

        // Date filter
        if (dateFilter.startDate && dateFilter.endDate) {
            const start = new Date(dateFilter.startDate).setHours(0, 0, 0, 0);
            const end = new Date(dateFilter.endDate).setHours(23, 59, 59, 999);
            filtered = filtered.filter(review => {
                const reviewDate = review.timestamp?.seconds 
                    ? new Date(review.timestamp.seconds * 1000) 
                    : new Date(review.timestamp);
                return reviewDate >= start && reviewDate <= end;
            });
        }

        // Sorting
        filtered.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            if (sortConfig.key === 'timestamp') {
                aVal = a.timestamp?.seconds ? a.timestamp.seconds : new Date(a.timestamp).getTime() / 1000;
                bVal = b.timestamp?.seconds ? b.timestamp.seconds : new Date(b.timestamp).getTime() / 1000;
            }

            if (sortConfig.direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            }
            return aVal < bVal ? 1 : -1;
        });

        return filtered;
    }, [getAllReview, searchQuery, statusFilter, ratingFilter, typeFilter, responseFilter, dateFilter, sortConfig, getAllProduct, globalSearchTerm]);

    // Review actions
    const approveReview = async (reviewId) => {
        try {
            await updateDoc(doc(fireDB, "reviews", reviewId), {
                approved: true,
                moderatedAt: new Date(),
                moderatedBy: JSON.parse(localStorage.getItem('users'))?.uid || 'admin'
            });
            toast.success("Review approved successfully");
        } catch (error) {
            console.error("Error approving review:", error);
            toast.error("Failed to approve review");
        }
    };

    const rejectReview = async (reviewId) => {
        try {
            await updateDoc(doc(fireDB, "reviews", reviewId), {
                approved: false,
                moderatedAt: new Date(),
                moderatedBy: JSON.parse(localStorage.getItem('users'))?.uid || 'admin'
            });
            toast.success("Review rejected successfully");
        } catch (error) {
            console.error("Error rejecting review:", error);
            toast.error("Failed to reject review");
        }
    };

    const deleteReview = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
            try {
                await reviewDelete(reviewId);
            } catch (error) {
                console.error("Error deleting review:", error);
                toast.error("Failed to delete review");
            }
        }
    };

    // Bulk actions
    const handleBulkAction = async () => {
        if (selectedReviews.length === 0) {
            toast.error("Please select reviews first");
            return;
        }

        if (!bulkAction) {
            toast.error("Please select an action");
            return;
        }

        try {
            const promises = selectedReviews.map(async (reviewId) => {
                if (bulkAction === "approve") {
                    return updateDoc(doc(fireDB, "reviews", reviewId), {
                        approved: true,
                        moderatedAt: new Date(),
                        moderatedBy: JSON.parse(localStorage.getItem('users'))?.uid || 'admin'
                    });
                } else if (bulkAction === "reject") {
                    return updateDoc(doc(fireDB, "reviews", reviewId), {
                        approved: false,
                        moderatedAt: new Date(),
                        moderatedBy: JSON.parse(localStorage.getItem('users'))?.uid || 'admin'
                    });
                } else if (bulkAction === "delete") {
                    return deleteDoc(doc(fireDB, "reviews", reviewId));
                }
            });

            await Promise.all(promises);
            toast.success(`Bulk ${bulkAction} completed successfully`);
            setSelectedReviews([]);
            setBulkAction("");
        } catch (error) {
            console.error("Bulk action error:", error);
            toast.error(`Failed to perform bulk ${bulkAction}`);
        }
    };

    const toggleReviewSelection = (reviewId) => {
        setSelectedReviews(prev =>
            prev.includes(reviewId)
                ? prev.filter(id => id !== reviewId)
                : [...prev, reviewId]
        );
    };

    const selectAllReviews = () => {
        if (selectedReviews.length === filteredReviews.length) {
            setSelectedReviews([]);
        } else {
            setSelectedReviews(filteredReviews.map(r => r.id));
        }
    };

    // Admin Response Functions
    const startResponse = (reviewId) => {
        setRespondingToReview(reviewId);
        setResponseText('');
    };

    const cancelResponse = () => {
        setRespondingToReview(null);
        setResponseText('');
    };

    const submitResponse = async (reviewId) => {
        if (!responseText.trim()) {
            toast.error("Please enter a response");
            return;
        }

        setSubmittingResponse(true);
        try {
            const responseData = {
                adminResponse: {
                    text: responseText.trim(),
                    respondedAt: new Date(),
                    respondedBy: "Digital Shop Nepal", // You can make this dynamic
                },
                hasAdminResponse: true
            };

            await updateDoc(doc(fireDB, "reviews", reviewId), responseData);
            
            // Find the review object for notification
            const review = getAllReview.find(r => r.id === reviewId);
            
            toast.success("Response added successfully!");
            setRespondingToReview(null);
            setResponseText('');
            
            // Email notifications removed for now
            
        } catch (error) {
            console.error("Error submitting response:", error);
            toast.error("Failed to submit response");
        } finally {
            setSubmittingResponse(false);
        }
    };



    if (loading) {
        return <Loader />;
    }

    return (
        <motion.div
            variants={pageContainerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-6"
        >
            {/* Header with Analytics Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Review Management</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage customer reviews, ratings, and feedback
                    </p>
                </div>
                <button
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                                                    <FiBarChart />
                    {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                </button>
            </div>

            {/* Analytics Dashboard */}
            <AnimatePresence>
                {showAnalytics && (
                    <motion.div
                        variants={filterVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    >
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FiMessageSquare className="text-blue-500 text-xl" />
                                <div>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{analytics.total}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FiStar className="text-yellow-500 text-xl" />
                                <div>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{analytics.avgRating}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FiCheckCircle className="text-green-500 text-xl" />
                                <div>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{analytics.approvalRate}%</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FiTrendingUp className="text-purple-500 text-xl" />
                                <div>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{analytics.recentReviews}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Breakdown */}
                        <div className="md:col-span-2 lg:col-span-4 bg-white dark:bg-gray-700 p-4 rounded-lg border">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Review Status Breakdown</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-green-500">{analytics.approved}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-yellow-500">{analytics.pending}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-red-500">{analytics.rejected}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search and Filters */}
            <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reviews, users, products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Quick Filters */}
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>

                        <select
                            value={responseFilter}
                            onChange={(e) => setResponseFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            <option value="all">All Reviews</option>
                            <option value="responded">Responded</option>
                            <option value="not_responded">Need Response</option>
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            <option value="all">All Users</option>
                            <option value="anonymous">Anonymous</option>
                            <option value="registered">Registered</option>
                        </select>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <FiFilter />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            variants={filterVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Review Type
                                    </label>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="verified">Verified Purchase</option>
                                        <option value="anonymous">Anonymous</option>
                                        <option value="product">Product Review</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Date From
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFilter.startDate}
                                        onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Date To
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFilter.endDate}
                                        onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bulk Actions */}
            {selectedReviews.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                >
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {selectedReviews.length} review(s) selected
                    </span>
                    <select
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                        className="px-3 py-1 border border-blue-300 dark:border-blue-600 rounded dark:bg-blue-800 dark:text-white"
                    >
                        <option value="">Select Action</option>
                        <option value="approve">Approve</option>
                        <option value="reject">Reject</option>
                        <option value="delete">Delete</option>
                    </select>
                    <button
                        onClick={handleBulkAction}
                        className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                        Apply
                    </button>
                    <button
                        onClick={() => setSelectedReviews([])}
                        className="px-4 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Clear Selection
                    </button>
                </motion.div>
            )}

            {/* Reviews List Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Reviews ({filteredReviews.length})
                    </h3>
                    <button
                        onClick={selectAllReviews}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                        {selectedReviews.length === filteredReviews.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>
                
                <select
                    value={`${sortConfig.key}-${sortConfig.direction}`}
                    onChange={(e) => {
                        const [key, direction] = e.target.value.split('-');
                        setSortConfig({ key, direction });
                    }}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                    <option value="timestamp-desc">Newest First</option>
                    <option value="timestamp-asc">Oldest First</option>
                    <option value="rating-desc">Highest Rating</option>
                    <option value="rating-asc">Lowest Rating</option>
                </select>
            </div>

            {/* Reviews List */}
            <AnimatePresence>
                <motion.div
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {filteredReviews.length === 0 ? (
                        <div className="text-center py-12">
                            <FiMessageSquare className="mx-auto text-4xl text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reviews found</h3>
                            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : (
                        filteredReviews.map((review, index) => {
                            const status = getStatusBadge(review.approved, review.status);
                            const productInfo = getProductInfo(review.productId);
                            const userInfo = getUserInfo(review.userId);
                            const isExpanded = expandedReview === review.id;
                            
                            return (
                                <motion.div
                                    key={review.id}
                                    variants={itemVariants}
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Selection Checkbox */}
                                        <input
                                            type="checkbox"
                                            checked={selectedReviews.includes(review.id)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleReviewSelection(review.id);
                                            }}
                                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />

                                        {/* Review Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(review.rating || 0)}
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${status.bg} ${status.text} ${status.border}`}>
                                                        {status.label}
                                                    </span>
                                                    {review.hasAdminResponse && (
                                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700">
                                                            <FiMessageCircle className="w-3 h-3 inline mr-1" />
                                                            Responded
                                                        </span>
                                                    )}
                                                    {review.isAnonymousReview && (
                                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700">
                                                            <FiUser className="w-3 h-3 inline mr-1" />
                                                            Anonymous
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        {getReviewTypeIcon(review.reviewType)}
                                                        <span>{review.reviewType || 'Standard'}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setExpandedReview(isExpanded ? null : review.id);
                                                        }}
                                                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Review Text */}
                                            <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                                                {review.review || review.comment}
                                            </p>

                                            {/* Meta Info */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <FiUser className="w-4 h-4" />
                                                    <span>{review.userName || userInfo.name || 'Anonymous'}</span>
                                                </div>
                                                {review.service && (
                                                    <div className="flex items-center gap-1">
                                                        <FiShoppingBag className="w-4 h-4" />
                                                        <span>{review.service}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <FiClock className="w-4 h-4" />
                                                    <span>{formatDate(review.timestamp)}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {review.approved !== true && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            approveReview(review.id);
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-200 rounded-lg transition-colors"
                                                    >
                                                        <FiCheck className="w-4 h-4" />
                                                        Approve
                                                    </button>
                                                )}
                                                {review.approved !== false && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            rejectReview(review.id);
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/50 dark:text-red-200 rounded-lg transition-colors"
                                                    >
                                                        <FiX className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                )}
                                                
                                                {/* Reply Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        startResponse(review.id);
                                                    }}
                                                    className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg transition-colors ${
                                                        review.hasAdminResponse
                                                            ? 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                                                            : 'bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:text-purple-200'
                                                    }`}
                                                    disabled={respondingToReview === review.id}
                                                >
                                                    <FiMessageCircle className="w-4 h-4" />
                                                    {review.hasAdminResponse ? 'Edit Reply' : 'Reply'}
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (window.confirm('Are you sure you want to delete this review?')) {
                                                            deleteReview(review.id);
                                                        }
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>

                                            {/* Expanded Details */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Review Details</h5>
                                                                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                                                                    <p><span className="font-medium">ID:</span> {review.id}</p>
                                                                    <p><span className="font-medium">Email:</span> {review.userEmail || userInfo.email}</p>
                                                                    <p><span className="font-medium">Type:</span> {review.reviewType || 'Standard'}</p>
                                                                    {review.productId && (
                                                                        <p><span className="font-medium">Product:</span> {productInfo.title}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            {review.moderatedAt && (
                                                                <div>
                                                                    <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Moderation Info</h5>
                                                                    <div className="space-y-1 text-gray-600 dark:text-gray-400">
                                                                        <p><span className="font-medium">Moderated:</span> {formatDate(review.moderatedAt)}</p>
                                                                        <p><span className="font-medium">By:</span> {review.moderatedBy || 'Admin'}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Admin Response Section */}
                                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                            {/* Existing Admin Response */}
                                                            {review.hasAdminResponse && review.adminResponse && (
                                                                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <FiMessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                                        <h6 className="font-medium text-blue-800 dark:text-blue-200">
                                                                            Response from {review.adminResponse.respondedBy || 'Digital Shop Nepal'}
                                                                        </h6>
                                                                        <span className="text-xs text-blue-600 dark:text-blue-400">
                                                                            {formatDate(review.adminResponse.respondedAt)}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-blue-700 dark:text-blue-300">
                                                                        {review.adminResponse.text}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Response Form */}
                                                            {respondingToReview === review.id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                                                                >
                                                                    <h6 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                                                                        <FiMessageCircle className="w-4 h-4" />
                                                                        {review.hasAdminResponse ? 'Edit Response' : 'Write Response'}
                                                                    </h6>
                                                                    <textarea
                                                                        value={responseText}
                                                                        onChange={(e) => setResponseText(e.target.value)}
                                                                        placeholder="Write your response to this customer review..."
                                                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                                                        rows={4}
                                                                        disabled={submittingResponse}
                                                                    />
                                                                    <div className="flex items-center gap-2 mt-3">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                submitResponse(review.id);
                                                                            }}
                                                                            disabled={submittingResponse || !responseText.trim()}
                                                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                                                                        >
                                                                            {submittingResponse ? (
                                                                                <>
                                                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                                    Submitting...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <FiCheck className="w-4 h-4" />
                                                                                    Submit Response
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                cancelResponse();
                                                                            }}
                                                                            disabled={submittingResponse}
                                                                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default ReviewDetail; 