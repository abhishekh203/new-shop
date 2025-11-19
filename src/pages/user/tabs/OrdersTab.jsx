import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BsBoxSeam, BsCurrencyRupee } from 'react-icons/bs';
import { FiSearch, FiCalendar, FiCreditCard, FiRefreshCw } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';
import { serifTheme } from '../../../design-system/themes';
import Loader from '../../../components/loader/Loader';
import { StatsCard, OrderCard } from '../components';

/**
 * Orders Tab Component
 * Displays user's orders with filtering and sorting
 */
const OrdersTab = ({
    userOrders,
    loading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    orderView,
    setOrderView,
    statusStats,
    totalSpent,
    lastOrderDate,
    expandedOrder,
    toggleOrderExpand,
    generateInvoice,
    requestRefund,
    trackShipping,
    calculateTotalAmount,
    handleAddToCart
}) => {
    // Filter orders based on orderView
    const filteredOrders = useMemo(() => {
        let filtered = [...userOrders];

        // Filter by view type (active, previous, or all)
        if (orderView === "active") {
            filtered = filtered.filter(order => 
                ['placed', 'pending', 'processing', 'shipped'].includes(order.status)
            );
        } else if (orderView === "previous") {
            filtered = filtered.filter(order => 
                ['delivered', 'cancelled', 'refunded'].includes(order.status)
            );
        }
        // If orderView === "all", show all orders (no filter)

        // Filter by search term
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(order => {
                const orderId = order.id?.toLowerCase() || '';
                const orderStatus = order.status?.toLowerCase() || '';
                const productNames = (order.cartItems || order.cart_items || [])
                    .map(item => item.title?.toLowerCase() || '')
                    .join(' ');
                return orderId.includes(search) || 
                       orderStatus.includes(search) || 
                       productNames.includes(search);
            });
        }

        // Sort orders
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    const dateA = new Date(a.date || a.created_at || 0);
                    const dateB = new Date(b.date || b.created_at || 0);
                    return dateB - dateA;
                case 'oldest':
                    const dateAOld = new Date(a.date || a.created_at || 0);
                    const dateBOld = new Date(b.date || b.created_at || 0);
                    return dateAOld - dateBOld;
                case 'highest':
                    return calculateTotalAmount(b) - calculateTotalAmount(a);
                case 'lowest':
                    return calculateTotalAmount(a) - calculateTotalAmount(b);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [userOrders, orderView, searchTerm, sortBy, calculateTotalAmount]);

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div onClick={() => setOrderView("all")} className="cursor-pointer touch-manipulation">
                    <StatsCard 
                        title="Total Orders" 
                        value={userOrders.length} 
                        icon={BsBoxSeam} 
                        footerText={`Last order: ${lastOrderDate}`} 
                        footerIcon={FiCalendar} 
                    />
                </div>
                <div onClick={() => setOrderView("all")} className="cursor-pointer">
                    <StatsCard 
                        title="Total Spent" 
                        value={`रु ${totalSpent.toFixed(2)}`} 
                        icon={BsCurrencyRupee} 
                        footerText={`Avg: रु ${(totalSpent / (userOrders.length || 1)).toFixed(2)}`} 
                        footerIcon={FiCreditCard} 
                    />
                </div>
                <div onClick={() => setOrderView("active")} className="cursor-pointer">
                    <StatsCard 
                        title="Active Orders" 
                        value={statusStats.active} 
                        icon={FiRefreshCw} 
                        footerText={`${statusStats.active} order${statusStats.active !== 1 ? 's' : ''} in progress`} 
                    />
                </div>
                <div onClick={() => setOrderView("previous")} className="cursor-pointer">
                    <StatsCard 
                        title="Previous Orders" 
                        value={statusStats.previous} 
                        icon={FaCheckCircle} 
                        footerText={`${statusStats.previous} completed order${statusStats.previous !== 1 ? 's' : ''}`} 
                    />
                </div>
            </div>

            {/* Orders List Section */}
            <div className={`${serifTheme.colors.background.card} ${serifTheme.radius.card} ${serifTheme.colors.shadow.card} ${serifTheme.spacing.cardPadding} ${serifTheme.transitions.default}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6 gap-4">
                    <div>
                        <h2 className={`text-xl font-bold ${serifTheme.colors.text.primary} flex items-center`}>
                            <BsBoxSeam className={`mr-3 ${serifTheme.colors.text.accent}`} />
                            Order History
                        </h2>
                        <p className={`text-sm ${serifTheme.colors.text.tertiary} mt-1`}>
                            {orderView === "active" ? "Showing active orders" : orderView === "previous" ? "Showing previous orders" : "Showing all orders"} 
                            ({filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''})
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <div className="relative flex-1 min-w-0 sm:min-w-[180px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className={`${serifTheme.colors.text.muted} w-4 h-4`} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className={`w-full pl-10 pr-4 py-3 sm:py-2 border ${serifTheme.colors.border.secondary} ${serifTheme.radius.input} ${serifTheme.colors.background.card} ${serifTheme.colors.text.primary} focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm`}
                                style={{ fontFamily: serifTheme.fontFamily.serif }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                className={`flex-1 border ${serifTheme.colors.border.secondary} ${serifTheme.radius.input} ${serifTheme.colors.background.card} ${serifTheme.colors.text.primary} px-3 py-3 sm:py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm appearance-none`}
                                style={{ fontFamily: serifTheme.fontFamily.serif, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="highest">Highest Amount</option>
                                <option value="lowest">Lowest Amount</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading && <Loader />}

                {!loading && filteredOrders.length === 0 && (
                    <div className={`${serifTheme.colors.background.secondary} ${serifTheme.radius.card} ${serifTheme.spacing.cardPadding} text-center shadow-inner ${serifTheme.transitions.default} my-4 sm:my-6 border ${serifTheme.colors.border.secondary}`}>
                        <div className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 ${serifTheme.colors.background.tertiary} ${serifTheme.radius.badge} flex items-center justify-center mb-4 sm:mb-6`}>
                            <BsBoxSeam className={`w-8 h-8 sm:w-10 sm:h-10 ${serifTheme.colors.text.muted}`} />
                        </div>
                        <h3 className={`text-base sm:text-lg lg:text-xl font-medium ${serifTheme.colors.text.secondary} mb-2`}>
                            {searchTerm ? "No orders match your search" : orderView === "active" ? "No active orders" : orderView === "previous" ? "No previous orders" : "No orders found"}
                        </h3>
                        <p className={`text-xs sm:text-sm lg:text-base ${serifTheme.colors.text.tertiary} mb-4 sm:mb-6`}>
                            {searchTerm ? "Try adjusting your search terms." : orderView === "active" ? "Click on 'All Orders' to see all your orders." : orderView === "previous" ? "Click on 'All Orders' to see all your orders." : "You haven't placed any orders yet."}
                        </p>
                        {orderView !== "all" && (
                            <div className="mb-3 sm:mb-4">
                                <button
                                    onClick={() => setOrderView("all")}
                                    className="inline-flex items-center px-4 py-3 sm:py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition text-sm font-medium mr-2 touch-manipulation"
                                >
                                    View All Orders
                                </button>
                            </div>
                        )}
                        <Link
                            to="/"
                            className="inline-flex items-center px-5 py-3 sm:py-2.5 bg-secondary text-white rounded-lg hover:opacity-90 transition text-sm font-medium shadow-sm touch-manipulation"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}

                {!loading && filteredOrders.length > 0 && (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                expandedOrder={expandedOrder}
                                onToggleExpand={toggleOrderExpand}
                                onGenerateInvoice={generateInvoice}
                                onRequestRefund={requestRefund}
                                onTrackShipping={trackShipping}
                                calculateTotalAmount={calculateTotalAmount}
                                handleAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersTab;

