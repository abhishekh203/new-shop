import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
    FiShoppingBag, FiClock, FiDollarSign, FiChevronDown, FiChevronUp,
    FiDownload, FiRefreshCw, FiTruck, FiXCircle, FiCreditCard, FiMapPin, FiBox
} from 'react-icons/fi';
import { FaCheckCircle, FaShippingFast } from 'react-icons/fa';
import { BsCurrencyRupee } from 'react-icons/bs';
import { serifTheme } from '../../../design-system/themes';
import { getStatusClasses, getProductNames } from '../utils/orderHelpers';
import { STATUS_DELIVERED, STATUS_PLACED, STATUS_PENDING, STATUS_PROCESSING, STATUS_SHIPPED } from '../constants';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/cartSlice';
import toast from 'react-hot-toast';

/**
 * Order Card Component
 * Displays order information with expandable details
 */
const OrderCard = ({
    order,
    expandedOrder,
    onToggleExpand,
    onGenerateInvoice,
    onRequestRefund,
    onTrackShipping,
    calculateTotalAmount,
    handleAddToCart
}) => {
    const isExpanded = expandedOrder === order.id;
    const totalAmount = useMemo(() => calculateTotalAmount(order), [order, calculateTotalAmount]);

    return (
        <div
            key={order.id}
            className={`${serifTheme.colors.background.card} ${serifTheme.radius.card} overflow-hidden ${serifTheme.colors.shadow.card} ${serifTheme.transitions.default} border ${serifTheme.colors.border.primary}`}
            style={{ fontFamily: serifTheme.fontFamily.serif }}
        >
            {/* Order Summary Header */}
            <div
                className="p-4 sm:p-6 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 touch-manipulation"
                onClick={() => onToggleExpand(order.id)}
                role="button"
                aria-expanded={isExpanded}
                aria-controls={`order-details-${order.id}`}
            >
                <div className="flex-1 min-w-0">
                    <div className={`flex items-center ${serifTheme.colors.text.primary} mb-1 font-medium`}>
                        <FiShoppingBag className={`mr-2 ${serifTheme.colors.text.accent} flex-shrink-0`} />
                        <span className="truncate" title={`Order #${order.id}`}>
                            Order #{order.id.substring(0, 8)}...
                        </span>
                    </div>
                    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${serifTheme.colors.text.tertiary} text-sm`}>
                        <div className="flex items-center">
                            <FiClock className="mr-1.5 flex-shrink-0" />
                            <span>{new Date(order.date).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                            <FiCreditCard className="mr-1.5 flex-shrink-0" />
                            <span className="capitalize">{order.paymentMethod || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-2 sm:mt-0 w-full sm:w-auto">
                    <div className="flex items-center justify-between sm:justify-start">
                        <span className={`sm:hidden text-sm ${serifTheme.colors.text.tertiary}`}>Total:</span>
                        <div className="flex items-center">
                            <BsCurrencyRupee className={`mr-1 text-green-600 text-lg`} />
                            <span className={`font-bold text-lg ${serifTheme.colors.text.primary}`}>
                                रु {totalAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <span className={`px-3 py-1 ${getStatusClasses(order.status)} ${serifTheme.radius.badge} text-xs font-semibold`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                    <button
                        className={`${serifTheme.colors.text.accent} hover:text-amber-800 ${serifTheme.transitions.default} flex items-center justify-center text-sm p-2 ${serifTheme.radius.badge} sm:${serifTheme.colors.background.secondary}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(order.id);
                        }}
                        aria-label={isExpanded ? "Collapse order details" : "Expand order details"}
                    >
                        {isExpanded ? (
                            <FiChevronUp className="w-5 h-5" />
                        ) : (
                            <FiChevronDown className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Order Details (Expandable) */}
            {isExpanded && (
                <div
                    id={`order-details-${order.id}`}
                    className={`border-t ${serifTheme.colors.border.secondary} overflow-hidden`}
                >
                    <div className={`${serifTheme.spacing.cardPadding} ${serifTheme.colors.background.card}`}>
                        {/* Shipping Info & Order Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Shipping Info */}
                            <div>
                                <h3 className={`text-base font-semibold ${serifTheme.colors.text.primary} mb-3 flex items-center`}>
                                    <FiMapPin className={`mr-2 ${serifTheme.colors.text.accent}`} />
                                    Shipping Information
                                </h3>
                                <div className="p-2 text-sm space-y-2">
                                    <p className={serifTheme.colors.text.secondary}>
                                        <strong>Address:</strong> {order.shippingAddress || 'Not specified'}
                                    </p>
                                    <p className={serifTheme.colors.text.secondary}>
                                        <strong>Phone:</strong> {order.phoneNumber || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                            {/* Order Summary */}
                            <div>
                                <h3 className={`text-base font-semibold ${serifTheme.colors.text.primary} mb-3 flex items-center`}>
                                    <FiBox className={`mr-2 ${serifTheme.colors.text.accent}`} />
                                    Order Summary
                                </h3>
                                <div className="p-2 text-sm space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className={serifTheme.colors.text.secondary}>Subtotal:</span>
                                        <span className={`${serifTheme.colors.text.primary} font-medium`}>
                                            रु {totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={serifTheme.colors.text.secondary}>Shipping:</span>
                                        <span className={`${serifTheme.colors.text.primary} font-medium`}>रु 0.00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={serifTheme.colors.text.secondary}>Tax:</span>
                                        <span className={`${serifTheme.colors.text.primary} font-medium`}>रु 0.00</span>
                                    </div>
                                    <div className={`flex justify-between items-center pt-3 mt-3 border-t ${serifTheme.colors.border.secondary}`}>
                                        <span className={`text-base font-semibold ${serifTheme.colors.text.primary}`}>Total:</span>
                                        <span className={`text-lg font-bold ${serifTheme.colors.text.primary}`}>
                                            रु {totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <h3 className={`text-base font-semibold ${serifTheme.colors.text.primary} mb-4`}>
                            Order Items ({order.cartItems.length})
                        </h3>
                        <div className="space-y-4 mb-6">
                            {order.cartItems.map((item, index) => (
                                <div key={item.id || index} className="flex flex-col sm:flex-row items-start sm:items-center p-2 gap-4 border-b border-gray-100 last:border-b-0">
                                    <div className="flex-shrink-0 relative">
                                        <img
                                            className={`w-16 h-16 sm:w-20 sm:h-20 object-contain ${serifTheme.radius.input} border ${serifTheme.colors.border.secondary} ${serifTheme.colors.background.card}`}
                                            src={item.productImageUrl}
                                            alt={item.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/100/f0f0f0/cccccc?text=No+Image";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-medium ${serifTheme.colors.text.primary} text-sm sm:text-base line-clamp-2`}>
                                            {item.title}
                                        </h4>
                                        <p className={`text-xs sm:text-sm ${serifTheme.colors.text.tertiary} capitalize`}>
                                            {item.category}
                                        </p>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className={`mt-2 text-xs ${serifTheme.colors.text.accent} hover:underline`}
                                        >
                                            Buy Again
                                        </button>
                                    </div>
                                    <div className="text-left sm:text-right mt-2 sm:mt-0 w-full sm:w-auto">
                                        <p className={`text-sm sm:text-base font-semibold ${serifTheme.colors.text.primary}`}>
                                            रु {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                        </p>
                                        <p className={`text-xs sm:text-sm ${serifTheme.colors.text.tertiary}`}>
                                            रु {Number(item.price).toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className={`flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t ${serifTheme.colors.border.secondary}`}>
                            {(order.status === STATUS_PLACED || order.status === STATUS_PENDING || order.status === STATUS_PROCESSING || order.status === STATUS_SHIPPED || order.status === STATUS_DELIVERED) && (
                                <button
                                    className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition flex items-center justify-center text-sm"
                                    onClick={() => onTrackShipping(order.id)}
                                >
                                    <FaShippingFast className="mr-2" />
                                    Track Delivery
                                </button>
                            )}
                            <button
                                className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition flex items-center justify-center text-sm"
                                onClick={() => onGenerateInvoice(order)}
                            >
                                <FiDownload className="mr-2" />
                                Download Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderCard;

