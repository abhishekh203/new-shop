import React, { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Removed Link as navigate is used
import myContext from "../../context/myContext";
import Loader from "../loader/Loader"; // Assuming Loader path is correct
import { deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig"; // Assuming Firebase config path is correct
import toast from "react-hot-toast"; // Using react-hot-toast
import { FiEdit, FiTrash2, FiChevronDown, FiChevronUp, FiSearch, FiFilter, FiX, FiPlus, FiImage, FiPackage, FiDollarSign, FiCalendar, FiTag, FiAlertCircle } from "react-icons/fi"; // Added more icons
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
        transition: {
            staggerChildren: 0.08, // Stagger animation for list items
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } } // Added exit animation
};

const expandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
        opacity: 1,
        height: "auto",
        transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] } // Smoother ease
    },
    exit: {
        opacity: 0,
        height: 0,
        transition: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }
    }
};

const filterVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
};

// --- Helper Functions ---
const formatPrice = (price) => {
    // Ensure price is a number, default to 0 if not
    const numericPrice = Number(price || 0);
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0, // Show whole rupees if possible
        maximumFractionDigits: 2
    }).format(numericPrice).replace('₹', '₹ '); // Add space after symbol
};

// --- Component ---
const ProductDetail = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllProduct, getAllProductFunction } = context;

    const [expandedProduct, setExpandedProduct] = useState(null); // ID of the expanded product
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [showFilters, setShowFilters] = useState(false); // Toggle filter visibility
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" }); // Default sort

    const navigate = useNavigate();

    // Toggle expanded product view
    const toggleExpand = (productId) => {
        setExpandedProduct(expandedProduct === productId ? null : productId);
    };

    // Delete product function
    const deleteProduct = async (id) => {
        // Use toast for confirmation instead of window.confirm for better UX
        toast((t) => (
            <div className="flex flex-col items-center p-2">
                <FiAlertCircle className="text-red-500 h-8 w-8 mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-2">Delete Product?</p>
                <p className="text-xs text-gray-600 mb-3">This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id); // Dismiss the confirmation toast
                            setLoading(true);
                            try {
                                await deleteDoc(doc(fireDB, 'products', id));
                                toast.success('Product deleted successfully');
                                getAllProductFunction(); // Refresh product list
                            } catch (error) {
                                console.error("Delete error:", error);
                                toast.error('Failed to delete product');
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity, // Keep open until user interacts
        });
    };

    // Handle column header click for sorting
    const requestSort = (key) => {
        let direction = 'asc';
        // If same key, toggle direction, otherwise set to 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get appropriate sort icon for table headers
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FiChevronDown className="ml-1 h-3 w-3 text-gray-400 opacity-30" />; // Show default direction
        return sortConfig.direction === 'asc'
            ? <FiChevronUp className="ml-1 h-3 w-3 text-blue-500" />
            : <FiChevronDown className="ml-1 h-3 w-3 text-blue-500" />;
    };

    // Memoized filtering and sorting logic
    const filteredAndSortedProducts = useMemo(() => {
        let products = [...getAllProduct]; // Start with all products

        // 1. Filter by Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            products = products.filter(product =>
                product.title?.toLowerCase().includes(query) ||
                product.category?.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                product.id?.toLowerCase().includes(query)
            );
        }

        // 2. Filter by Category
        if (categoryFilter !== "all") {
            products = products.filter(product => product.category === categoryFilter);
        }

        // 3. Filter by Price Range
        const min = priceRange.min ? Number(priceRange.min) : 0;
        const max = priceRange.max ? Number(priceRange.max) : Infinity;
        if (priceRange.min || priceRange.max) {
             products = products.filter(product => {
                const price = Number(product.price || 0);
                return price >= min && price <= max;
             });
        }

        // 4. Sort Products
        if (sortConfig.key) {
            products.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle specific types for sorting
                if (sortConfig.key === 'price') {
                    aValue = Number(aValue || 0);
                    bValue = Number(bValue || 0);
                } else if (sortConfig.key === 'date') {
                    // Assuming date is stored in a format sortable directly or as Timestamp
                     aValue = aValue?.seconds ? aValue.seconds : new Date(aValue).getTime();
                     bValue = bValue?.seconds ? bValue.seconds : new Date(bValue).getTime();
                } else {
                    // Default to string comparison (case-insensitive)
                    aValue = String(aValue || '').toLowerCase();
                    bValue = String(bValue || '').toLowerCase();
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return products;
    }, [getAllProduct, searchQuery, categoryFilter, priceRange, sortConfig]);

    // Get unique categories for the filter dropdown
    const uniqueCategories = useMemo(() => {
        return ["all", ...new Set(getAllProduct.map(product => product.category).filter(Boolean))];
    }, [getAllProduct]);

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery("");
        setCategoryFilter("all");
        setPriceRange({ min: "", max: "" });
        setSortConfig({ key: "date", direction: "desc" }); // Reset sort as well
        setShowFilters(false); // Close filter section
    };

    // --- JSX Structure ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-4 md:p-8 text-gray-200">
            {/* Loading Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                    > <Loader /> </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <motion.div
                className="max-w-7xl mx-auto"
                variants={pageContainerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1">
                            Product Inventory
                        </h1>
                        <p className="text-sm text-gray-400">
                            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} found
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Filter Toggle Button */}
                        <motion.button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm transition duration-150"
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        >
                            <FiFilter className="h-4 w-4" />
                            Filters
                            <FiChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                        </motion.button>
                         {/* Add Product Button */}
                        <motion.button
                            onClick={() => navigate('/addproduct')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg shadow-md text-sm font-semibold transition duration-150"
                            whileHover={{ scale: 1.03, filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
                        >
                            <FiPlus className="h-4 w-4" />
                            Add Product
                        </motion.button>
                    </div>
                </div>

                {/* Collapsible Filter Section */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            variants={filterVariants} initial="hidden" animate="visible" exit="exit"
                            className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 mb-6 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Search Input */}
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text" placeholder="Search..."
                                        className="w-full pl-9 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700/60 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400"
                                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                {/* Category Select */}
                                <select
                                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700/60 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150 appearance-none pr-8 bg-no-repeat bg-right"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em 1.2em' }}
                                    value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    {uniqueCategories.map((category, index) => (
                                        <option key={index} value={category} className="capitalize bg-gray-800">
                                            {category === 'all' ? 'All Categories' : category}
                                        </option>
                                    ))}
                                </select>
                                {/* Price Range Inputs */}
                                <div className="flex items-center gap-2 col-span-1 sm:col-span-2 md:col-span-1">
                                    <input
                                        type="number" placeholder="Min ₹" min="0"
                                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700/60 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                    />
                                    <span className="text-gray-500">-</span>
                                    <input
                                        type="number" placeholder="Max ₹" min={priceRange.min || "0"}
                                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700/60 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                    />
                                </div>
                                {/* Reset Button */}
                                <button
                                    onClick={resetFilters}
                                    className="col-span-1 sm:col-span-2 md:col-span-1 px-3 py-2 text-sm text-indigo-400 hover:text-indigo-300 transition duration-150 text-center border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Product Display Area */}
                <div className="bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <motion.table
                            className="min-w-full divide-y divide-gray-700"
                            variants={listVariants} // Use list variant for table body stagger
                            initial="hidden"
                            animate="visible"
                        >
                            <thead className="bg-gray-800/50 sticky top-0 z-10">
                                <tr>
                                    {/* Define Table Headers */}
                                    {['#', 'Image', 'Title', 'Price', 'Category', 'Date', 'Actions'].map((header, index) => {
                                        const sortKey = header === '#' ? 'id' : header.toLowerCase();
                                        const canSort = ['#', 'Title', 'Price', 'Category', 'Date'].includes(header);
                                        return (
                                            <th
                                                key={header}
                                                scope="col"
                                                className={`px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${canSort ? 'cursor-pointer hover:bg-gray-700/50 transition-colors' : ''}`}
                                                onClick={canSort ? () => requestSort(sortKey) : undefined}
                                            >
                                                <div className="flex items-center">
                                                    {header}
                                                    {canSort && getSortIcon(sortKey)}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/70">
                                <AnimatePresence initial={false}>
                                    {filteredAndSortedProducts.length > 0 ? (
                                        filteredAndSortedProducts.map((item, index) => {
                                            const { id, title, price, category, date, productImageUrl, description, quantity } = item;
                                            const isExpanded = expandedProduct === id;
                                            return (
                                                <React.Fragment key={id}>
                                                    {/* Main Table Row */}
                                                    <motion.tr
                                                        className="hover:bg-gray-800/40 transition-colors cursor-pointer"
                                                        onClick={() => toggleExpand(id)}
                                                        variants={itemVariants} // Apply item animation
                                                        layout // Animate layout changes
                                                    >
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-400">{index + 1}</td>
                                                        <td className="px-5 py-4 whitespace-nowrap">
                                                            <img
                                                                className="h-10 w-10 rounded-md object-cover border border-gray-600"
                                                                src={productImageUrl || 'https://placehold.co/40x40/27272a/a1a1aa?text=N/A'}
                                                                alt={title || 'Product'}
                                                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/27272a/a1a1aa?text=N/A'; }}
                                                            />
                                                        </td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-200 max-w-xs truncate" title={title}>{title}</td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-emerald-400">{formatPrice(price)}</td>
                                                        <td className="px-5 py-4 whitespace-nowrap">
                                                            <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-900/50 text-indigo-300 capitalize border border-indigo-700/50">
                                                                {category}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-400">
                                                            {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center space-x-3">
                                                                {/* Edit Button */}
                                                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); navigate(`/updateproduct/${id}`); }} className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded-full hover:bg-blue-500/10" title="Edit"> <FiEdit className="h-4 w-4" /> </motion.button>
                                                                {/* Delete Button */}
                                                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); deleteProduct(id); }} className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-500/10" title="Delete"> <FiTrash2 className="h-4 w-4" /> </motion.button>
                                                                {/* Expand Icon */}
                                                                <span className={`text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}> <FiChevronDown className="h-5 w-5" /> </span>
                                                            </div>
                                                        </td>
                                                    </motion.tr>

                                                    {/* Expanded Row Content */}
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.tr key={`expanded-${id}`} className="bg-gray-800/30">
                                                                <td colSpan="7" className="p-0">
                                                                    <motion.div
                                                                        variants={expandVariants} initial="hidden" animate="visible" exit="exit"
                                                                        className="px-5 py-4 overflow-hidden" // Added overflow hidden
                                                                    >
                                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                                                            {/* Expanded Image */}
                                                                            <div className="flex justify-center items-center">
                                                                                <img
                                                                                    className="h-32 w-32 rounded-lg object-cover border border-gray-600 shadow-md"
                                                                                    src={productImageUrl || 'https://placehold.co/128x128/27272a/a1a1aa?text=N/A'}
                                                                                    alt={title || 'Product'}
                                                                                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x128/27272a/a1a1aa?text=N/A'; }}
                                                                                />
                                                                            </div>
                                                                            {/* Expanded Details */}
                                                                            <div className="sm:col-span-2 space-y-2">
                                                                                <div>
                                                                                    <p className="font-semibold text-gray-400 uppercase tracking-wider">Description</p>
                                                                                    <p className="text-gray-300 mt-0.5">{description || "No description."}</p>
                                                                                </div>
                                                                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                                                    <div><p className="font-semibold text-gray-400 uppercase">ID:</p> <p className="text-gray-300 font-mono break-all">{id}</p></div>
                                                                                    <div><p className="font-semibold text-gray-400 uppercase">Stock:</p> <p className="text-gray-300">{quantity > 0 ? `${quantity} available` : "Out of Stock"}</p></div>
                                                                                    <div><p className="font-semibold text-gray-400 uppercase">Created:</p> <p className="text-gray-300">{new Date(date).toLocaleString('en-GB')}</p></div>
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
                                                    <FiSearch className="h-10 w-10 text-gray-500 mb-2" />
                                                    No products found matching your criteria.
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
                            {filteredAndSortedProducts.length > 0 ? (
                                filteredAndSortedProducts.map((item) => {
                                    const { id, title, price, category, date, productImageUrl, description, quantity } = item;
                                    const isExpanded = expandedProduct === id;
                                    return (
                                        <motion.div
                                            key={id} layout
                                            variants={itemVariants} initial="hidden" animate="visible" exit="exit"
                                            className="bg-gray-800/60 rounded-lg shadow-md border border-gray-700/60 overflow-hidden"
                                        >
                                            <div className="p-4 flex space-x-4 cursor-pointer" onClick={() => toggleExpand(id)}>
                                                <img
                                                    className="h-16 w-16 rounded-md object-cover border border-gray-600 flex-shrink-0"
                                                    src={productImageUrl || 'https://placehold.co/64x64/27272a/a1a1aa?text=N/A'}
                                                    alt={title || 'Product'}
                                                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/64x64/27272a/a1a1aa?text=N/A'; }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-100 truncate">{title}</p>
                                                    <p className="text-sm font-medium text-emerald-400">{formatPrice(price)}</p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className="px-2 py-0.5 inline-flex text-[10px] leading-4 font-semibold rounded-full bg-indigo-900/50 text-indigo-300 capitalize border border-indigo-700/50"> {category} </span>
                                                        <span className={`px-2 py-0.5 inline-flex text-[10px] leading-4 font-semibold rounded-full ${ quantity > 0 ? 'bg-green-900/50 text-green-300 border border-green-700/50' : 'bg-red-900/50 text-red-300 border border-red-700/50' }`}> {quantity > 0 ? 'In stock' : 'Out of stock'} </span>
                                                    </div>
                                                </div>
                                                <div className={`text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                    <FiChevronDown className="h-5 w-5" />
                                                </div>
                                            </div>
                                             {/* Expanded Mobile Content */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        variants={expandVariants} initial="hidden" animate="visible" exit="exit"
                                                        className="px-4 pb-4 pt-2 border-t border-gray-700/60 overflow-hidden" // Added overflow hidden
                                                    >
                                                        <p className="text-xs text-gray-400 mb-2">{description || "No description available."}</p>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-3">
                                                             <div><p className="font-semibold text-gray-500 uppercase text-[10px]">ID:</p> <p className="text-gray-300 font-mono break-all">{id}</p></div>
                                                             <div><p className="font-semibold text-gray-500 uppercase text-[10px]">Stock:</p> <p className="text-gray-300">{quantity}</p></div>
                                                             <div><p className="font-semibold text-gray-500 uppercase text-[10px]">Created:</p> <p className="text-gray-300">{new Date(date).toLocaleDateString('en-GB')}</p></div>
                                                        </div>
                                                        <div className="flex justify-end space-x-3">
                                                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); navigate(`/updateproduct/${id}`); }} className="text-blue-400 hover:text-blue-300 transition-colors p-1.5 rounded-full hover:bg-blue-500/10" title="Edit"> <FiEdit className="h-4 w-4" /> </motion.button>
                                                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); deleteProduct(id); }} className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-full hover:bg-red-500/10" title="Delete"> <FiTrash2 className="h-4 w-4" /> </motion.button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                // No Results Card (Mobile)
                                <motion.div
                                    variants={itemVariants} initial="hidden" animate="visible"
                                    className="bg-gray-800/60 p-6 rounded-lg shadow-md text-center border border-gray-700/60"
                                >
                                    <FiSearch className="mx-auto h-10 w-10 text-gray-500 mb-3" />
                                    <h3 className="text-sm font-medium text-gray-200">No products found</h3>
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
}

export default ProductDetail;
