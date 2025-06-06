import React, { useContext, useState, useEffect, useMemo } from "react";
import myContext from "../../context/myContext"; // Assuming context path is correct
import Loader from "../loader/Loader"; // Assuming Loader path is correct
import { deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig"; // Assuming Firebase config path is correct
import toast from "react-hot-toast"; // Using react-hot-toast
import { FiTrash2, FiEdit, FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiX, FiPackage, FiUser, FiMapPin, FiCalendar, FiHash, FiDollarSign, FiAlertCircle, FiInfo } from "react-icons/fi"; // Added relevant icons
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
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2
    }).format(numericPrice).replace('₹', '₹ ');
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
const OrderDetail = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllOrder, orderDelete } = context; // Assuming orderDelete exists

    // State management
    const [expandedOrder, setExpandedOrder] = useState(null); // ID of expanded order
    const [selectedStatus, setSelectedStatus] = useState({}); // For potential status updates (UI only for now)
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false); // Unified filter toggle

    // Toggle order details expansion
    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    // Handle status change (UI update only, add API call if needed)
    const handleStatusChange = (orderId, status) => {
        setSelectedStatus(prev => ({ ...prev, [orderId]: status }));
        // Placeholder: Add API call here to update order status in Firestore
        // e.g., updateOrderStatus(orderId, status).then(() => toast.success(...)).catch(() => toast.error(...))
        toast.info(`Status for order ${orderId.slice(0, 6)} changed to ${status} (UI only)`);
    };

    // Delete order function with confirmation toast
    const handleDeleteOrder = async (id) => {
        toast((t) => (
            <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-md">
                <FiAlertCircle className="text-red-500 h-8 w-8 mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-2">Delete Order?</p>
                <p className="text-xs text-gray-600 mb-3">Order <span className="font-mono bg-gray-100 px-1 rounded">{id.slice(0, 8)}</span> will be removed.</p>
                <div className="flex gap-3">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            setLoading(true);
                            try {
                                await orderDelete(id); // Use context function for delete
                                // No need to call getAllOrderFunction if orderDelete updates the context state
                            } catch (error) {
                                console.error("Delete error:", error);
                                toast.error('Failed to delete order');
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition"
                    > Delete </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded hover:bg-gray-300 transition"
                    > Cancel </button>
                </div>
            </div>
        ), { duration: Infinity });
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

        // 3. Filter by Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim();
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
    }, [getAllOrder, statusFilter, dateFilter, searchQuery]);

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setDateFilter({ startDate: "", endDate: "" });
        setShowFilters(false); // Optionally close filter section on reset
    };

    // --- JSX Structure ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-4 md:p-8 text-gray-200 font-sans">
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
                        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-1">
                            Order Management
                        </h1>
                        <p className="text-sm text-gray-400">
                            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <motion.button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm transition duration-150"
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        >
                            <FiFilter className="h-4 w-4" /> Filters
                            <FiChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                        </motion.button>
                        {/* Add Order button if needed */}
                        {/* <motion.button ... > <FiPlus/> Add Order </motion.button> */}
                    </div>
                </div>

                {/* Collapsible Filter Section */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            variants={filterVariants} initial="hidden" animate="visible" exit="exit"
                            className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 mb-6 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                {/* Search Input */}
                                <div className="relative">
                                    <label htmlFor="order-search" className="block text-xs font-medium text-gray-400 mb-1">Search</label>
                                    <FiSearch className="absolute left-3 bottom-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <input id="order-search" type="text" placeholder="ID, Name, Email, Phone..."
                                        className="w-full pl-9 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700/60 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-150 placeholder-gray-500"
                                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                {/* Status Select */}
                                <div>
                                    <label htmlFor="status-filter" className="block text-xs font-medium text-gray-400 mb-1">Status</label>
                                    <select id="status-filter"
                                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700/60 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-150 appearance-none pr-8 bg-no-repeat bg-right cursor-pointer"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em 1.2em' }}
                                        value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all" className="bg-gray-800">All Statuses</option>
                                        <option value="pending" className="bg-gray-800">Pending</option>
                                        <option value="processing" className="bg-gray-800">Processing</option>
                                        <option value="shipped" className="bg-gray-800">Shipped</option>
                                        <option value="delivered" className="bg-gray-800">Delivered</option>
                                        <option value="cancelled" className="bg-gray-800">Cancelled</option>
                                    </select>
                                </div>
                                {/* Date Range Inputs */}
                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Date Range</label>
                                    <div className="flex items-center gap-2">
                                        <input type="date" value={dateFilter.startDate} onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})} className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700/60 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-150 text-gray-400" />
                                        <span className="text-gray-500 text-sm">to</span>
                                        <input type="date" value={dateFilter.endDate} onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})} className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700/60 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-150 text-gray-400" min={dateFilter.startDate || undefined} />
                                    </div>
                                </div>
                                {/* Reset Button */}
                                <button
                                    onClick={resetFilters}
                                    className="self-end px-3 py-2 text-sm text-indigo-400 hover:text-indigo-300 transition duration-150 text-center border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 h-[42px]" // Match height
                                > Reset </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Order Display Area */}
                <div className="bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <motion.table className="min-w-full divide-y divide-gray-700" variants={listVariants} initial="hidden" animate="visible">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Items</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/70">
                                <AnimatePresence initial={false}>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => {
                                            const isExpanded = expandedOrder === order.id;
                                            const totalOrderAmount = order.cartItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
                                            return (
                                                <React.Fragment key={order.id}>
                                                    <motion.tr
                                                        className="hover:bg-gray-800/40 transition-colors cursor-pointer"
                                                        onClick={() => toggleExpand(order.id)}
                                                        variants={itemVariants} layout
                                                    >
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-mono text-gray-400">{order.id.slice(0, 8).toUpperCase()}</td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm">
                                                            <p className="font-medium text-gray-200 truncate max-w-[150px]" title={order.addressInfo.name}>{order.addressInfo.name}</p>
                                                            <p className="text-gray-400 text-xs truncate max-w-[150px]" title={order.email}>{order.email}</p>
                                                        </td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(order.date)}</td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-400 text-center">{order.cartItems.length}</td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-emerald-400">{formatPrice(totalOrderAmount)}</td>
                                                        <td className="px-5 py-4 whitespace-nowrap">
                                                            <span className={`px-2.5 py-1 inline-flex text-[11px] leading-4 font-semibold rounded-full border ${getStatusColorClasses(order.status)} capitalize`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center space-x-2">
                                                                {/* Delete Button */}
                                                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }} className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-500/10" title="Delete"> <FiTrash2 className="h-4 w-4" /> </motion.button>
                                                                {/* Expand Icon */}
                                                                <span className={`text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}> <FiChevronDown className="h-5 w-5" /> </span>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                    {/* Expanded Row */}
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.tr key={`expanded-${order.id}`} className="bg-gray-800/30">
                                                                <td colSpan="7" className="p-0">
                                                                    <motion.div variants={expandVariants} initial="hidden" animate="visible" exit="exit" className="px-5 py-4 overflow-hidden">
                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                                            {/* Customer & Address */}
                                                                            <div className="space-y-2">
                                                                                <p className="font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><FiUser size={12}/>Customer</p>
                                                                                <p className="text-gray-300">{order.addressInfo.name}</p>
                                                                                <p className="text-gray-300">{order.email}</p>
                                                                                <p className="text-gray-300">{order.addressInfo.mobileNumber}</p>
                                                                                <p className="font-semibold text-gray-400 uppercase tracking-wider mt-2 flex items-center gap-1.5"><FiMapPin size={12}/>Address</p>
                                                                                <p className="text-gray-300">{order.addressInfo.address}, {order.addressInfo.pincode}, {order.addressInfo.country}</p>
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
                                            <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-400">
                                                <div className="flex flex-col items-center justify-center">
                                                    <FiSearch className="h-10 w-10 text-gray-500 mb-2" /> No orders found matching your criteria.
                                                    <button onClick={resetFilters} className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"> Reset filters </button>
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
                                                            <div className="col-span-2"><p className="font-semibold text-gray-500 uppercase text-[10px]">Address</p> <p className="text-gray-300">{order.addressInfo.address}, {order.addressInfo.pincode}</p></div>
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
        </div>
    );
};

export default OrderDetail;
