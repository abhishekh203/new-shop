import React from 'react';
import PropTypes from 'prop-types';
import { FaShippingFast, FaCheckCircle, FaTimesCircle, FaCheck, FaWhatsapp } from 'react-icons/fa';
import { FiX, FiClock, FiRefreshCw, FiBox, FiHome, FiMessageCircle } from 'react-icons/fi';
import { RiRefund2Line } from 'react-icons/ri';
import { serifTheme } from '../../../design-system/themes';
import { getStatusClasses, getProductNames } from '../utils/orderHelpers';
import { WHATSAPP_SUPPORT_NUMBER, STATUS_DELIVERED, STATUS_PLACED, STATUS_PENDING, STATUS_PROCESSING, STATUS_SHIPPED } from '../constants';

/**
 * Tracking Modal Component
 * Displays order tracking timeline and status
 */
const TrackingModal = ({ isOpen, order, onClose, calculateTotalAmount }) => {
    if (!isOpen || !order) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FaShippingFast className="w-6 h-6" />
                            <div>
                                <h2 className="text-xl font-bold">Digital Delivery Tracking</h2>
                                <p className="text-blue-100 text-sm">
                                    Order #{order.id?.substring(0, 8)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-4 space-y-4">
                    {/* Current Status */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Delivery Status</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Last updated: {order.date ? new Date(order.date).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                            <div className={`px-6 py-3 rounded-full text-sm font-bold ${getStatusClasses(order.status)} border-2 border-current`}>
                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                            </div>
                        </div>
                    </div>

                    {/* Tracking Timeline */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Digital Delivery Progress</h3>
                        <div className="space-y-3">
                            {/* Order Placed */}
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        ['placed', 'pending', 'processing', 'shipped', 'delivered'].includes(order.status) 
                                            ? 'bg-green-500' 
                                            : 'bg-gray-300 dark:bg-gray-600'
                                    }`}>
                                        {['placed', 'pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? (
                                            <FaCheck className="w-4 h-4 text-white" />
                                        ) : (
                                            <FiClock className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">Order Placed</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {order.date ? new Date(order.date).toLocaleString() : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Your {getProductNames(order)} order has been successfully placed and confirmed. We're preparing to process your order.
                                    </p>
                                </div>
                            </div>

                            {/* Processing */}
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        ['pending', 'processing', 'shipped', 'delivered'].includes(order.status) 
                                            ? 'bg-blue-500' 
                                            : 'bg-gray-300 dark:bg-gray-600'
                                    }`}>
                                        {['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? (
                                            <FiRefreshCw className="w-4 h-4 text-white" />
                                        ) : (
                                            <FiClock className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">Processing</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {['pending', 'processing', 'shipped', 'delivered'].includes(order.status) 
                                            ? 'In Progress' 
                                            : 'Pending'
                                        }
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Your {getProductNames(order)} is being prepared and processed. This usually takes 1-2 minutes.
                                    </p>
                                </div>
                            </div>

                            {/* Shipped */}
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        ['shipped', 'delivered'].includes(order.status) 
                                            ? 'bg-indigo-500' 
                                            : 'bg-gray-300 dark:bg-gray-600'
                                    }`}>
                                        {['shipped', 'delivered'].includes(order.status) ? (
                                            <FaShippingFast className="w-4 h-4 text-white" />
                                        ) : (
                                            <FiBox className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">Delivering</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {['shipped', 'delivered'].includes(order.status) 
                                            ? 'Completed' 
                                            : 'Pending'
                                        }
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Your {getProductNames(order)} has been processed and is being delivered to your email/WhatsApp. You'll receive it within 1 minute to 1 hour!
                                    </p>
                                </div>
                            </div>

                            {/* Delivered */}
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        order.status === 'delivered' 
                                            ? 'bg-green-500' 
                                            : 'bg-gray-300 dark:bg-gray-600'
                                    }`}>
                                        {order.status === 'delivered' ? (
                                            <FaCheckCircle className="w-4 h-4 text-white" />
                                        ) : (
                                            <FiHome className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">Delivered</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {order.status === 'delivered' 
                                            ? 'Completed' 
                                            : 'Pending'
                                        }
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Your {getProductNames(order)} has been successfully delivered to your email/WhatsApp. Thank you for your purchase!
                                    </p>
                                </div>
                            </div>

                            {/* Cancelled/Refunded Status */}
                            {(order.status === 'cancelled' || order.status === 'refunded') && (
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                            {order.status === 'cancelled' ? (
                                                <FaTimesCircle className="w-4 h-4 text-white" />
                                            ) : (
                                                <RiRefund2Line className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            {order.status === 'cancelled' ? 'Cancelled' : 'Refunded'}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {order.status === 'cancelled' ? 'Order Cancelled' : 'Refund Processed'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {order.status === 'cancelled' 
                                                ? 'This order has been cancelled.' 
                                                : 'Your refund has been processed.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">Order Total</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    रु {calculateTotalAmount(order).toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">Payment Method</p>
                                <p className="font-medium text-gray-900 dark:text-white capitalize">
                                    {order.paymentMethod || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">Delivery Method</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    Email/WhatsApp
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">Phone Number</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {order.phoneNumber || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Support Contact */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center space-x-3">
                            <FiMessageCircle className="w-5 h-5 text-secondary dark:text-secondary" />
                            <div>
                                <h4 className="font-medium text-blue-800 dark:text-blue-200">Need Help?</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    Contact our support team for any questions about your order delivery.
                                </p>
                            </div>
                        </div>
                        <a
                            href={`https://wa.me/${WHATSAPP_SUPPORT_NUMBER.replace('+', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-3 px-4 py-2 bg-success text-white rounded-lg hover:opacity-90 transition-colors text-sm"
                        >
                            <FiMessageCircle className="mr-2" />
                            WhatsApp Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingModal;

