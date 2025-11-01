import React, { useContext, useState, useEffect, useMemo } from "react";
import myContext from "../../context/myContext"; // Assuming context path is correct
import Loader from "../loader/Loader"; // Assuming Loader path is correct
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig"; // Assuming Firebase config path is correct
import { useNotification } from "../../context/NotificationContext";
import { serifTheme } from "../../design-system/themes/serifTheme";
import { SerifButton, SerifBadge } from "../../design-system/components";
import { FiTrash2, FiEdit, FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiX, FiPackage, FiUser, FiMapPin, FiCalendar, FiHash, FiDollarSign, FiAlertCircle, FiInfo, FiMaximize2, FiUpload, FiCamera } from "react-icons/fi"; // Added FiUpload, FiCamera
import { format } from "date-fns"; // For date formatting
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants ---
const pageContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
};

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07 }, // Stagger animation for list items
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } }
};

const expandVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 },
    visible: {
        opacity: 1, height: "auto", marginTop: '1rem', marginBottom: '1rem', paddingTop: '1rem', paddingBottom: '1rem', // Adjust padding/margin as needed
        transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }
    },
    exit: {
        opacity: 0, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0,
        transition: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }
    }
};

const filterVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
};

// --- Helper Functions ---
const formatDate = (dateInput) => {
    // Handles both Firestore Timestamps and standard Date objects/strings
    const date = dateInput?.seconds ? new Date(dateInput.seconds * 1000) : new Date(dateInput);
    if (isNaN(date)) { // Check if date is valid
        return "Invalid Date";
    }
    return format(date, 'MMM d, yyyy'); // Example format: Jan 5, 2024
};

const formatPrice = (price) => {
    const numericPrice = Number(price || 0);
    return new Intl.NumberFormat('en-NP', {
        style: 'currency', currency: 'NPR', minimumFractionDigits: 0, maximumFractionDigits: 2
    }).format(numericPrice).replace('रु', 'रु ');
};

const getStatusColorClasses = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
        case 'processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        case 'shipped': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
        case 'delivered': return 'bg-green-500/10 text-green-400 border-green-500/30';
        case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/30';
        default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
};


// --- Component ---
const OrderDetail = ({ globalSearchTerm = "" }) => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllOrder, orderDelete } = context; // Assuming orderDelete exists
    const notification = useNotification();

    // State management
    const [expandedOrder, setExpandedOrder] = useState(null); // ID of expanded order
    const [selectedStatus, setSelectedStatus] = useState({}); // For potential status updates (UI only for now)
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false); // Unified filter toggle
    const [imageViewer, setImageViewer] = useState({ isOpen: false, imageSrc: null, imageAlt: "" }); // Image viewer modal

    // Toggle order details expansion
    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    // Handle image enlargement
    const handleImageEnlarge = (imageSrc, imageAlt) => {
        setImageViewer({ isOpen: true, imageSrc, imageAlt });
    };

    // Close image viewer
    const closeImageViewer = () => {
        setImageViewer({ isOpen: false, imageSrc: null, imageAlt: "" });
    };

    // Handle status change with Firebase update
    const handleStatusChange = async (orderId, status) => {
        try {
            setLoading(true);
            
            // Update in Firebase
            const orderRef = doc(fireDB, "order", orderId);
            await updateDoc(orderRef, { status: status });
            
            // Update local state
            setSelectedStatus(prev => ({ ...prev, [orderId]: status }));
            
            // Show success message
            notification.success(`Order status updated to ${status}`);
            
            // Refresh orders from context (if needed)
            // You might need to call a refresh function from context here
            
        } catch (error) {
            console.error("Error updating order status:", error);
            notification.error("Failed to update order status");
        } finally {
            setLoading(false);
        }
    };

    // Delete order function with confirmation
    const handleDeleteOrder = async (id) => {
        if (window.confirm(`Are you sure you want to delete order ${id.slice(0, 8)}? This action cannot be undone.`)) {
            setLoading(true);
            try {
                await orderDelete(id); // Use context function for delete
                notification.success('Order deleted successfully');
            } catch (error) {
                console.error("Delete error:", error);
                notification.error('Failed to delete order');
            } finally {
                setLoading(false);
            }
        }
    };

    // Memoized filtering logic
    const filteredOrders = useMemo(() => {
        let orders = [...getAllOrder];

        // 1. Filter by Status
        if (statusFilter !== "all") {
            orders = orders.filter(order => order.status === statusFilter);
        }

        // 2. Filter by Date Range
        if (dateFilter.startDate && dateFilter.endDate) {
            try {
                // Add 1 day to end date to include the whole day
                const start = new Date(dateFilter.startDate).setHours(0, 0, 0, 0);
                const end = new Date(dateFilter.endDate).setHours(23, 59, 59, 999);
                orders = orders.filter(order => {
                    const orderDate = order.time?.seconds ? new Date(order.time.seconds * 1000) : new Date(order.date);
                    return !isNaN(orderDate) && orderDate >= start && orderDate <= end;
                });
            } catch (e) { console.error("Date filtering error:", e)} // Handle potential date parsing errors
        }

        // 3. Filter by Search Query (combine local and global search)
        const combinedSearchQuery = globalSearchTerm || searchQuery;
        if (combinedSearchQuery) {
            const query = combinedSearchQuery.toLowerCase().trim();
            orders = orders.filter(order =>
                order.id?.toLowerCase().includes(query) ||
                order.addressInfo?.name?.toLowerCase().includes(query) ||
                order.email?.toLowerCase().includes(query) ||
                order.addressInfo?.mobileNumber?.includes(query) ||
                // Search within cart items (title)
                order.cartItems?.some(item => item.title?.toLowerCase().includes(query))
            );
        }

        // Default sort by date descending (newest first)
        orders.sort((a, b) => {
             const dateA = a.time?.seconds ? a.time.seconds : new Date(a.date).getTime();
             const dateB = b.time?.seconds ? b.time.seconds : new Date(b.date).getTime();
             return dateB - dateA; // Descending
        });


        return orders;
    }, [getAllOrder, statusFilter, dateFilter, searchQuery, globalSearchTerm]);

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setDateFilter({ startDate: "", endDate: "" });
        setShowFilters(false); // Optionally close filter section on reset
    };

    // --- JSX Structure ---
    return (
        <div className="min-h-full bg-transparent relative" style={{ fontFamily: serifTheme.fontFamily.serif }}>
            {/* Loading Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"> <Loader /> </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="max-w-7xl mx-auto"
                variants={pageContainerVariants} initial="hidden" animate="visible"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className={`text-2xl md:text-3xl font-bold ${serifTheme.gradients.accent} mb-1`}>
                            Order Management
                        </h1>
                        <p className={`text-sm ${serifTheme.colors.text.tertiary}`}>
                            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <SerifButton
                            onClick={() => setShowFilters(!showFilters)}
                            variant="secondary"
                            size="small"
                            icon={<FiFilter />}
                        >
                            Filters
                            <FiChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                        </SerifButton>
                    </div>
                </div>

                {/* Collapsible Filter Section */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            variants={filterVariants} initial="hidden" animate="visible" exit="exit"
                            className={`${serifTheme.gradients.card} ${serifTheme.radius.card} p-4 border ${serifTheme.colors.border.primary} mb-6 overflow-hidden`}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                {/* Search Input */}
                                <div className="relative">
                                    <label htmlFor="order-search" className={`block text-xs font-medium ${serifTheme.colors.text.tertiary} mb-1`}>Search</label>
                                    <FiSearch className={`absolute left-3 bottom-2.5 h-4 w-4 ${serifTheme.colors.text.tertiary} pointer-events-none`} />
                                    <input id="order-search" type="text" placeholder="ID, Name, Email, Phone..."
                                        className={`w-full pl-9 pr-3 py-2 border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} ${serifTheme.colors.background.card} ${serifTheme.colors.text.primary} text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 ${serifTheme.transitions.default} placeholder-amber-400/50`}
                                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                {/* Status Select */}
                                <div>
                                    <label htmlFor="status-filter" className={`block text-xs font-medium ${serifTheme.colors.text.tertiary} mb-1`}>Status</label>
                                    <select id="status-filter"
                                        className={`w-full px-3 py-2 border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} ${serifTheme.colors.background.card} ${serifTheme.colors.text.primary} text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 ${serifTheme.transitions.default} appearance-none pr-8 bg-no-repeat bg-right cursor-pointer`}
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23d97706' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em 1.2em' }}
                                        value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                {/* Date Range Inputs */}
                                <div className="lg:col-span-1">
                                    <label className={`block text-xs font-medium ${serifTheme.colors.text.tertiary} mb-1`}>Date Range</label>
                                    <div className="flex items-center gap-2">
                                        <input type="date" value={dateFilter.startDate} onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})} className={`w-full px-3 py-2 border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} ${serifTheme.colors.background.card} ${serifTheme.colors.text.primary} text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 ${serifTheme.transitions.default}`} />
                                        <span className={`${serifTheme.colors.text.muted} text-sm`}>to</span>
                                        <input type="date" value={dateFilter.endDate} onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})} className={`w-full px-3 py-2 border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} ${serifTheme.colors.background.card} ${serifTheme.colors.text.primary} text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 ${serifTheme.transitions.default}`} min={dateFilter.startDate || undefined} />
                                    </div>
                                </div>
                                {/* Reset Button */}
                                <SerifButton
                                    onClick={resetFilters}
                                    variant="secondary"
                                    size="small"
                                >
                                    Reset
                                </SerifButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Order Display Area */}
                <div className={`${serifTheme.gradients.card} ${serifTheme.radius.card} ${serifTheme.colors.shadow.card} border ${serifTheme.colors.border.primary} overflow-hidden`}>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <motion.table className={`min-w-full divide-y ${serifTheme.colors.border.secondary}`} variants={listVariants} initial="hidden" animate="visible">
                            <thead className={serifTheme.colors.background.secondary}>
                                <tr>
                                    <th className={`px-5 py-3 text-left text-xs font-medium ${serifTheme.colors.text.tertiary} uppercase tracking-wider`}>Order ID</th>
                                    <th className={`px-5 py-3 text-left text-xs font-medium ${serifTheme.colors.text.tertiary} uppercase tracking-wider`}>Customer</th>
                                    <th className={`px-5 py-3 text-left text-xs font-medium ${serifTheme.colors.text.tertiary} uppercase tracking-wider`}>Date</th>
                                    <th className={`px-5 py-3 text-left text-xs font-medium ${serifTheme.colors.text.tertiary} uppercase tracking-wider`}>Items</th>
                                    <th className={`px-5 py-3 text-left text-xs font-medium ${serifTheme.colors.text.tertiary} uppercase tracking-wider`}>Total</th>
                                    <th className={`px-5 py-3 text-left text-xs font-medium ${serifTheme.colors.text.tertiary} uppercase tracking-wider`}>Status</th>
                                    <th className={`px-5 py-3 text-left text-xs font-medium ${serifTheme.colors.text.tertiary} uppercase tracking-wider`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${serifTheme.colors.border.secondary}`}>
                                <AnimatePresence initial={false}>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => {
                                            const isExpanded = expandedOrder === order.id;
                                            const totalOrderAmount = order.cartItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
                                            return (
                                                <React.Fragment key={order.id}>
                                                    <motion.tr
                                                        className={`hover:bg-amber-50/50 ${serifTheme.transitions.default} cursor-pointer`}
                                                        onClick={() => toggleExpand(order.id)}
                                                        variants={itemVariants} layout
                                                    >
                                                        <td className={`px-5 py-4 whitespace-nowrap text-sm font-mono ${serifTheme.colors.text.tertiary}`}>{order.id.slice(0, 8).toUpperCase()}</td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm">
                                                            <p className={`font-medium ${serifTheme.colors.text.primary} truncate max-w-[150px]`} title={order.addressInfo.name}>{order.addressInfo.name}</p>
                                                            <p className={`${serifTheme.colors.text.tertiary} text-xs truncate max-w-[150px]`} title={order.email}>{order.email}</p>
                                                        </td>
                                                        <td className={`px-5 py-4 whitespace-nowrap text-sm ${serifTheme.colors.text.tertiary}`}>{formatDate(order.date)}</td>
                                                        <td className={`px-5 py-4 whitespace-nowrap text-sm ${serifTheme.colors.text.tertiary} text-center`}>{order.cartItems.length}</td>
                                                        <td className={`px-5 py-4 whitespace-nowrap text-sm font-medium text-emerald-600`}>{formatPrice(totalOrderAmount)}</td>
                                                        <td className="px-5 py-4 whitespace-nowrap">
                                                            <SerifBadge variant="secondary" size="small" className="capitalize">
                                                                {order.status}
                                                            </SerifBadge>
                                                        </td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center space-x-2">
                                                                {/* Delete Button */}
                                                                <SerifButton
                                                                    onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }}
                                                                    variant="danger"
                                                                    size="small"
                                                                    icon={<FiTrash2 />}
                                                                />
                                                                {/* Expand Icon */}
                                                                <span className={`${serifTheme.colors.text.muted} ${serifTheme.transitions.default} ${isExpanded ? 'rotate-180' : ''}`}> <FiChevronDown className="h-5 w-5" /> </span>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                    {/* Expanded Row */}
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.tr key={`expanded-${order.id}`} className={serifTheme.colors.background.secondary}>
                                                                <td colSpan="7" className="p-0">
                                                                    <motion.div variants={expandVariants} initial="hidden" animate="visible" exit="exit" className="px-5 py-4 overflow-hidden">
                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                                            {/* Customer & Address */}
                                                                            <div className="space-y-2">
                                                                                <p className={`font-semibold ${serifTheme.colors.text.tertiary} uppercase tracking-wider flex items-center gap-1.5`}><FiUser size={12}/>Customer</p>
                                                                                <p className={serifTheme.colors.text.primary}>{order.addressInfo.name}</p>
                                                                                <p className={serifTheme.colors.text.primary}>{order.email}</p>
                                                                                <p className={serifTheme.colors.text.primary}>{order.addressInfo.mobileNumber}</p>
                                                                                <p className={serifTheme.colors.text.primary}>{order.addressInfo.whatsappNumber}</p>
                                                                                <p className={`font-semibold ${serifTheme.colors.text.tertiary} uppercase tracking-wider mt-2 flex items-center gap-1.5`}><FiMapPin size={12}/>Address</p>
                                                                                <p className={serifTheme.colors.text.primary}>{order.addressInfo.address}, {order.addressInfo.country}</p>
                                                                            </div>
                                                                            {/* Order Items */}
                                                                            <div className="space-y-2 md:col-span-2">
                                                                                <p className="font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><FiPackage size={12}/>Items</p>
                                                                                <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
                                                                                    {order.cartItems.map((item, idx) => (
                                                                                        <div key={idx} className="flex justify-between items-center text-xs bg-gray-700/50 p-1.5 rounded">
                                                                                            <div className="flex items-center gap-2">
                                                                                                 <img src={item.productImageUrl || 'https://placehold.co/24x24/27272a/a1a1aa?text=N/A'} alt="" className="h-6 w-6 rounded object-cover"/>
                                                                                                 <span className="text-gray-300 truncate max-w-[150px]">{item.title}</span>
                                                                                                 <span className="text-gray-400">(x{item.quantity})</span>
                                                                                            </div>
                                                                                            <span className="text-gray-300 font-medium">{formatPrice(item.price * item.quantity)}</span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                
                                                                                {/* Payment Information */}
                                                                                {(order.paymentMethod || order.paymentStatus || order.paymentScreenshot) ? (
                                                                                    <div className="mt-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                                                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment Information</p>
                                                                                        <div className="space-y-2">
                                                                                            {order.paymentMethod && (
                                                                                                <div className="flex justify-between items-center text-xs">
                                                                                                    <span className="text-gray-400">Method:</span>
                                                                                                    <span className="text-gray-300 font-medium">{order.paymentMethod}</span>
                                                                                                </div>
                                                                                            )}
                                                                                            {order.paymentStatus && (
                                                                                                <div className="flex justify-between items-center text-xs">
                                                                                                    <span className="text-gray-400">Status:</span>
                                                                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                                                                        order.paymentStatus === 'completed' 
                                                                                                            ? 'bg-green-500/20 text-green-400' 
                                                                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                                                                    }`}>
                                                                                                        {order.paymentStatus}
                                                                                                    </span>
                                                                                                </div>
                                                                                            )}
                                                                                            {order.paymentScreenshot && (
                                                                                                <div className="mt-3">
                                                                                                    <p className="text-xs text-gray-400 mb-2">Payment Screenshot:</p>
                                                                                                    <div className="relative">
                                                                                                        <img 
                                                                                                            src={order.paymentScreenshot} 
                                                                                                            alt="Payment Screenshot" 
                                                                                                            className="max-w-full h-auto max-h-32 rounded border border-gray-600 cursor-pointer hover:opacity-90 transition-opacity"
                                                                                                            onClick={() => handleImageEnlarge(order.paymentScreenshot, "Payment Screenshot")}
                                                                                                        />
                                                                                                        <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded text-[10px] flex items-center gap-1">
                                                                                                            <FiMaximize2 size={10} />
                                                                                                            Click to enlarge
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="mt-3 p-3 bg-gray-700/20 rounded-lg border border-gray-600/30">
                                                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Information</p>
                                                                                        <p className="text-xs text-gray-500 italic">No payment information available</p>
                                                                                    </div>
                                                                                )}
                                                                                
                                                                                {/* Status Update Dropdown */}
                                                                                <div className="pt-2 border-t border-gray-700/50">
                                                                                    <label htmlFor={`status-${order.id}`} className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Update Status</label>
                                                                                    <select
                                                                                        id={`status-${order.id}`}
                                                                                        value={selectedStatus[order.id] || order.status}
                                                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                                                        onClick={(e) => e.stopPropagation()} // Prevent row collapse when clicking select
                                                                                        className="w-full px-3 py-1.5 border border-gray-600 rounded-md bg-gray-700/60 text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-150 appearance-none pr-8 bg-no-repeat bg-right cursor-pointer"
                                                                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em' }}
                                                                                    >
                                                                                         <option value="pending" className="bg-gray-800">Pending</option>
                                                                                         <option value="processing" className="bg-gray-800">Processing</option>
                                                                                         <option value="shipped" className="bg-gray-800">Shipped</option>
                                                                                         <option value="delivered" className="bg-gray-800">Delivered</option>
                                                                                         <option value="cancelled" className="bg-gray-800">Cancelled</option>
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                </td>
                                                            </motion.tr>
                                                        )}
                                                    </AnimatePresence>
                                                </React.Fragment>
                                            );
                                        })
                                    ) : (
                                        // No Results Row
                                        <motion.tr variants={itemVariants}>
                                            <td colSpan="7" className={`px-6 py-10 text-center text-sm ${serifTheme.colors.text.tertiary}`}>
                                                <div className="flex flex-col items-center justify-center">
                                                    <FiSearch className={`h-10 w-10 ${serifTheme.colors.text.muted} mb-2`} /> No orders found matching your criteria.
                                                    <SerifButton onClick={resetFilters} variant="secondary" size="small" className="mt-2">
                                                        Reset filters
                                                    </SerifButton>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </motion.table>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden p-4 space-y-4">
                        <AnimatePresence initial={false}>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => {
                                    const isExpanded = expandedOrder === order.id;
                                    const totalOrderAmount = order.cartItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
                                    return (
                                        <motion.div
                                            key={order.id} layout
                                            variants={itemVariants} initial="hidden" animate="visible" exit="exit"
                                            className="bg-gray-800/60 rounded-lg shadow-md border border-gray-700/60 overflow-hidden"
                                        >
                                            <div className="p-4 flex justify-between items-start cursor-pointer" onClick={() => toggleExpand(order.id)}>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-mono text-gray-400 mb-0.5">ID: {order.id.slice(0, 8).toUpperCase()}</p>
                                                    <p className="text-sm font-semibold text-gray-100 truncate">{order.addressInfo.name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.date)} • {order.cartItems.length} items</p>
                                                    <span className={`mt-1.5 px-2 py-0.5 inline-flex text-[10px] leading-4 font-semibold rounded-full border ${getStatusColorClasses(order.status)} capitalize`}> {order.status} </span>
                                                </div>
                                                <div className="flex flex-col items-end ml-2">
                                                    <p className="text-base font-medium text-emerald-400">{formatPrice(totalOrderAmount)}</p>
                                                    <div className={`text-gray-500 transition-transform duration-300 mt-1 ${isExpanded ? 'rotate-180' : ''}`}>
                                                        <FiChevronDown className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Expanded Mobile Content */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                     <motion.div
                                                        variants={expandVariants} initial="hidden" animate="visible" exit="exit"
                                                        className="px-4 pb-4 pt-3 border-t border-gray-700/60 overflow-hidden text-xs" // Added overflow hidden
                                                    >
                                                        {/* Items List */}
                                                        <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1 text-[10px]">Items</p>
                                                        <div className="max-h-28 overflow-y-auto space-y-1 pr-1 mb-3">
                                                            {order.cartItems.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between items-center text-xs bg-gray-700/50 p-1 rounded">
                                                                    <span className="text-gray-300 truncate max-w-[120px]">{item.title} (x{item.quantity})</span>
                                                                    <span className="text-gray-300 font-medium">{formatPrice(item.price * item.quantity)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {/* Customer & Address */}
                                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3">
                                                            <div><p className="font-semibold text-gray-500 uppercase text-[10px]">Customer</p> <p className="text-gray-300 truncate">{order.addressInfo.name}</p></div>
                                                            <div><p className="font-semibold text-gray-500 uppercase text-[10px]">Phone</p> <p className="text-gray-300">{order.addressInfo.mobileNumber}</p></div>
                                                            <div><p className="font-semibold text-gray-500 uppercase text-[10px]">WhatsApp</p> <p className="text-gray-300">{order.addressInfo.whatsappNumber}</p></div>
                                                            <div className="col-span-2"><p className="font-semibold text-gray-500 uppercase text-[10px]">Address</p> <p className="text-gray-300">{order.addressInfo.address}, {order.addressInfo.country}</p></div>
                                                        </div>
                                                        
                                                        {/* Payment Information - Mobile */}
                                                        <div className="mb-3">
                                                            <p className="font-semibold text-gray-500 uppercase text-[10px] mb-1">Payment</p>
                                                            <div className="bg-gray-700/50 p-2 rounded space-y-1">
                                                                <div className="flex justify-between items-center text-xs">
                                                                    <span className="text-gray-400">Method:</span>
                                                                    <span className="text-gray-300 font-medium">
                                                                        {order.paymentMethod || 'Not specified'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-xs">
                                                                    <span className="text-gray-400">Status:</span>
                                                                    <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                                                                        order.paymentStatus === 'completed' 
                                                                            ? 'bg-green-500/20 text-green-400' 
                                                                            : order.paymentStatus
                                                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                                                : 'bg-gray-500/20 text-gray-400'
                                                                    }`}>
                                                                        {order.paymentStatus || 'Not specified'}
                                                                    </span>
                                                                </div>
                                                                {order.paymentScreenshot ? (
                                                                    <div className="mt-2">
                                                                        <p className="text-xs text-gray-400 mb-1">Screenshot:</p>
                                                                        <div className="relative">
                                                                            <img 
                                                                                src={order.paymentScreenshot} 
                                                                                alt="Payment Screenshot" 
                                                                                className="max-w-full h-auto max-h-24 rounded border border-gray-600 cursor-pointer hover:opacity-90 transition-opacity"
                                                                                onClick={() => handleImageEnlarge(order.paymentScreenshot, "Payment Screenshot")}
                                                                            />
                                                                            <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded text-[10px] flex items-center gap-1">
                                                                                <FiMaximize2 size={10} />
                                                                                Tap to enlarge
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-2">
                                                                        <p className="text-xs text-gray-400 mb-1">Screenshot:</p>
                                                                        <p className="text-xs text-gray-500 italic">No screenshot uploaded</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Status Update */}
                                                         <div>
                                                            <label htmlFor={`status-mob-${order.id}`} className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Update Status</label>
                                                            <select
                                                                id={`status-mob-${order.id}`}
                                                                value={selectedStatus[order.id] || order.status}
                                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="w-full px-3 py-1.5 border border-gray-600 rounded-md bg-gray-700/60 text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-150 appearance-none pr-8 bg-no-repeat bg-right cursor-pointer"
                                                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em' }}
                                                            >
                                                                 <option value="pending" className="bg-gray-800">Pending</option>
                                                                 <option value="processing" className="bg-gray-800">Processing</option>
                                                                 <option value="shipped" className="bg-gray-800">Shipped</option>
                                                                 <option value="delivered" className="bg-gray-800">Delivered</option>
                                                                 <option value="cancelled" className="bg-gray-800">Cancelled</option>
                                                            </select>
                                                        </div>
                                                        {/* Delete Button */}
                                                        <div className="mt-3 flex justify-end">
                                                             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }} className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-full text-xs flex items-center gap-1 hover:bg-red-500/10" title="Delete"> <FiTrash2 className="h-3.5 w-3.5" /> Delete Order </motion.button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                // No Results Card (Mobile)
                                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="bg-gray-800/60 p-6 rounded-lg shadow-md text-center border border-gray-700/60">
                                    <FiSearch className="mx-auto h-10 w-10 text-gray-500 mb-3" />
                                    <h3 className="text-sm font-medium text-gray-200">No orders found</h3>
                                    <p className="mt-1 text-xs text-gray-400"> Try adjusting your search or filter. </p>
                                    <button onClick={resetFilters} className="mt-3 text-xs text-indigo-400 hover:text-indigo-300"> Reset filters </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* Image Viewer Modal */}
            <AnimatePresence>
                {imageViewer.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                        onClick={closeImageViewer}
                    >
                        <motion.img
                            src={imageViewer.imageSrc}
                            alt={imageViewer.imageAlt}
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderDetail;
