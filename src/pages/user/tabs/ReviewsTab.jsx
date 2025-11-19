import React from 'react';
import { FaStar, FaThumbsUp } from 'react-icons/fa';
import { serifTheme } from '../../../design-system/themes';

/**
 * Reviews Tab Component
 * Displays user's product reviews with filtering
 */
const ReviewsTab = ({ userReviews, loadingReviews, reviewsFilter, setReviewsFilter }) => {
    return (
        <div className={`${serifTheme.colors.background.card} ${serifTheme.radius.card} ${serifTheme.colors.shadow.card} ${serifTheme.spacing.cardPadding} ${serifTheme.transitions.default}`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 sm:mb-6">
                <div>
                    <h2 className={`text-xl font-bold ${serifTheme.colors.text.primary} flex items-center gap-3`}>
                        <FaStar className="text-yellow-500" />
                        My Reviews
                    </h2>
                    <p className={`${serifTheme.colors.text.secondary} mt-1`}>
                        Manage and track your product reviews
                    </p>
                </div>

                {/* Filter Reviews */}
                <div className="flex items-center gap-3">
                    <select
                        value={reviewsFilter}
                        onChange={(e) => setReviewsFilter(e.target.value)}
                        className={`px-4 py-3 sm:py-2 ${serifTheme.colors.background.secondary} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.input} focus:ring-2 focus:ring-amber-500 ${serifTheme.colors.text.secondary} text-sm`}
                        style={{ fontFamily: serifTheme.fontFamily.serif }}
                    >
                        <option value="all">All Reviews</option>
                        <option value="pending">Pending Approval</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            {loadingReviews ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : userReviews.length === 0 ? (
                <div className="text-center py-12">
                    <FaStar className={`mx-auto text-4xl ${serifTheme.colors.text.muted} mb-4`} />
                    <h3 className={`text-lg font-medium ${serifTheme.colors.text.primary} mb-2`}>
                        No reviews yet
                    </h3>
                    <p className={serifTheme.colors.text.secondary}>
                        Start reviewing products you've purchased to help others make informed decisions.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {userReviews
                        .filter(review => {
                            if (reviewsFilter === 'all') return true;
                            if (reviewsFilter === 'pending') return review.approved === undefined;
                            if (reviewsFilter === 'approved') return review.approved === true;
                            if (reviewsFilter === 'rejected') return review.approved === false;
                            return true;
                        })
                        .map((review) => (
                            <div
                                key={review.id}
                                className={`${serifTheme.colors.background.secondary} ${serifTheme.radius.card} p-6`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                    {/* Review Status */}
                                    <div className="flex items-center gap-2">
                                        {review.approved === true ? (
                                            <span className={`px-3 py-1 bg-green-100 text-green-700 ${serifTheme.radius.badge} text-sm font-medium`}>
                                                Approved
                                            </span>
                                        ) : review.approved === false ? (
                                            <span className={`px-3 py-1 bg-red-100 text-red-700 ${serifTheme.radius.badge} text-sm font-medium`}>
                                                Rejected
                                            </span>
                                        ) : (
                                            <span className={`px-3 py-1 bg-yellow-100 text-yellow-700 ${serifTheme.radius.badge} text-sm font-medium`}>
                                                Pending
                                            </span>
                                        )}
                                    </div>

                                    {/* Review Content */}
                                    <div className="flex-1">
                                        {/* Product Title */}
                                        <h4 className={`text-lg font-semibold ${serifTheme.colors.text.primary} mb-2`}>
                                            {review.productTitle || "Product"}
                                        </h4>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < review.rating
                                                                ? 'text-yellow-500'
                                                                : serifTheme.colors.text.muted
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className={`text-sm ${serifTheme.colors.text.secondary}`}>
                                                {new Date(review.timestamp?.seconds * 1000).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Review Text */}
                                        <p className={`${serifTheme.colors.text.secondary} mb-4`}>
                                            {review.review}
                                        </p>

                                        {/* Pros & Cons */}
                                        {(review.pros || review.cons) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                {review.pros && (
                                                    <div className={`bg-green-50 p-3 ${serifTheme.radius.input}`}>
                                                        <h5 className={`font-medium text-green-800 mb-2`}>
                                                            👍 Pros
                                                        </h5>
                                                        <p className={`text-green-700 text-sm`}>
                                                            {review.pros}
                                                        </p>
                                                    </div>
                                                )}
                                                {review.cons && (
                                                    <div className={`bg-red-50 p-3 ${serifTheme.radius.input}`}>
                                                        <h5 className={`font-medium text-red-800 mb-2`}>
                                                            👎 Cons
                                                        </h5>
                                                        <p className={`text-red-700 text-sm`}>
                                                            {review.cons}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Helpful Count */}
                                        {review.helpfulCount > 0 && (
                                            <div className={`flex items-center gap-2 text-sm ${serifTheme.colors.text.secondary}`}>
                                                <FaThumbsUp className="w-4 h-4" />
                                                <span>{review.helpfulCount} found this helpful</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsTab;

