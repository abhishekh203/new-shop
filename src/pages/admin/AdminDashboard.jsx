import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductDetail from '../../components/admin/ProductDetail';
import OrderDetail from '../../components/admin/OrderDetail';
import UserDetail from '../../components/admin/UserDetail';
import ReviewDetail from '../../components/admin/ReviewDetail';
import myContext from '../../context/myContext';
import { 
  FiShoppingBag, 
  FiList, 
  FiUsers, 
  FiPlus, 
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiMessageSquare,
  FiTrendingUp,
  FiDollarSign,
  FiActivity,
  FiSettings,
  FiBell,
  FiSearch
} from 'react-icons/fi';
import { BsBoxSeam, BsPersonLinesFill } from 'react-icons/bs';
import { RiDashboardFill } from 'react-icons/ri';
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const context = useContext(myContext);
    const { getAllProduct, getAllOrder, getAllUser, getAllReview, loading, setLoading } = context;
    const navigate = useNavigate();
    
    // State management
    const [activeTab, setActiveTab] = useState(0);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [notifications, setNotifications] = useState([]);
    
    // Dark mode with system preference detection
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) return JSON.parse(savedMode);
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Product form state
    const [product, setProduct] = useState({
        title: "",
        price: "",
        productImageUrl: "",
        category: "",
        description: "",
        quantity: 1,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
    });

    // Category list with icons
    const categoryList = [
        { name: 'netflix', icon: '🎬', color: 'bg-red-500' },
        { name: 'OTT', icon: '📺', color: 'bg-blue-500' },
        { name: 'streaming', icon: '📡', color: 'bg-green-500' },
        { name: 'music', icon: '🎵', color: 'bg-purple-500' },
        { name: 'Software', icon: '💻', color: 'bg-indigo-500' },
        { name: 'games', icon: '🎮', color: 'bg-pink-500' },
        { name: 'movies', icon: '🎥', color: 'bg-yellow-500' },
        { name: 'bundle', icon: '🎁', color: 'bg-teal-500' },
        { name: 'education', icon: '📚', color: 'bg-orange-500' },
        { name: 'vpn', icon: '🔒', color: 'bg-gray-500' },
        { name: 'AI', icon: '🤖', color: 'bg-cyan-500' },
        { name: 'special offer', icon: '🔥', color: 'bg-red-600' },
        { name: 'antivirus', icon: '🛡️', color: 'bg-green-600' },
        { name: 'gift card', icon: '💳', color: 'bg-purple-600' }
    ];

    // Computed stats with better calculations
    const stats = useMemo(() => {
        const totalRevenue = getAllOrder.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);
        const pendingOrders = getAllOrder.filter(order => order.status === 'pending').length;
        const activeUsers = getAllUser.filter(user => user.status === 'active').length;
        const avgRating = getAllReview.length > 0 
            ? (getAllReview.reduce((sum, review) => sum + (review.rating || 0), 0) / getAllReview.length).toFixed(1)
            : 0;

        return [
            {
                title: 'Total Products',
                value: getAllProduct.length,
                change: '+12%',
                icon: <FiShoppingBag size={24} />,
                color: 'bg-gradient-to-r from-amber-500 to-orange-500',
                textColor: 'text-white',
                tabIndex: 0
            },
            {
                title: 'Total Revenue',
                value: `रु ${totalRevenue.toFixed(2)}`,
                change: '+8.2%',
                icon: <FiDollarSign size={24} />,
                color: 'bg-gradient-to-r from-green-500 to-emerald-500',
                textColor: 'text-white',
                tabIndex: 1
            },
            {
                title: 'Active Users',
                value: activeUsers,
                change: '+5.1%',
                icon: <FiUsers size={24} />,
                color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
                textColor: 'text-white',
                tabIndex: 2
            },
            {
                title: 'Avg Rating',
                value: avgRating,
                change: '+2.3%',
                icon: <FiTrendingUp size={24} />,
                color: 'bg-gradient-to-r from-purple-500 to-pink-500',
                textColor: 'text-white',
                tabIndex: 3
            }
        ];
    }, [getAllProduct, getAllOrder, getAllUser, getAllReview]);

    // Navigation items
    const navigationItems = [
        { id: 0, name: 'Products', icon: <BsBoxSeam />, component: <ProductDetail /> },
        { id: 1, name: 'Orders', icon: <FiList />, component: <OrderDetail /> },
        { id: 2, name: 'Users', icon: <BsPersonLinesFill />, component: <UserDetail /> },
        { id: 3, name: 'Reviews', icon: <FiMessageSquare />, component: <ReviewDetail /> }
    ];

    // Dark mode toggle
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    // Apply dark mode class
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('users');
        localStorage.removeItem('auth');
        navigate('/');
        toast.success('Logged out successfully');
    };

    // Add product function with better validation
    const addProductFunction = async () => {
        // Validation
        const errors = [];
        if (!product.title.trim()) errors.push("Product title is required");
        if (!product.price || isNaN(product.price) || Number(product.price) <= 0) errors.push("Valid price is required");
        if (!product.productImageUrl.trim()) errors.push("Product image URL is required");
        if (!product.category) errors.push("Please select a category");
        if (!product.description.trim()) errors.push("Product description is required");

        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        setLoading(true);
        try {
            const productRef = collection(fireDB, 'products');
            await addDoc(productRef, product);
            toast.success("Product added successfully");
            setShowAddProductModal(false);
            setProduct({
                title: "",
                price: "",
                productImageUrl: "",
                category: "",
                description: "",
                quantity: 1,
                time: Timestamp.now(),
                date: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                })
            });
        } catch (error) {
            console.error("Add product error:", error);
            toast.error(`Failed to add product: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Reset product form
    const resetProductForm = () => {
        setProduct({
            title: "",
            price: "",
            productImageUrl: "",
            category: "",
            description: "",
            quantity: 1,
            time: Timestamp.now(),
            date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            })
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-3">
                <button 
                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                        {mobileSidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                </button>
                    <h1 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                        <RiDashboardFill className="mr-2 text-blue-600" size={20} />
                        Admin
                </h1>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={toggleDarkMode}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        >
                            {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
                        </button>
                        <button
                            onClick={() => setShowAddProductModal(true)}
                            className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            <FiPlus size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileSidebarOpen && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="lg:hidden fixed inset-0 z-30"
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileSidebarOpen(false)} />
                        <div className="absolute left-0 top-0 w-72 lg:w-80 h-full bg-white dark:bg-gray-800 shadow-xl">
                            <div className="flex flex-col h-full">
                        {/* User Profile */}
                                <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center space-x-3 lg:space-x-4">
                            <img 
                                src={user?.photoURL || './img/ak.jpg'} 
                                alt="Admin" 
                                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                                        />
                                        <div>
                                            <h2 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white">{user?.name}</h2>
                                            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                                            <span className="inline-block mt-1 px-2 py-0.5 lg:py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                    {user?.role}
                                </span>
                                        </div>
                            </div>
                        </div>

                        {/* Navigation */}
                                <nav className="flex-1 p-3 lg:p-4">
                                    <div className="space-y-1 lg:space-y-2">
                                        {navigationItems.map((item) => (
                                    <button
                                                key={item.id}
                                        onClick={() => {
                                                    setActiveTab(item.id);
                                            setMobileSidebarOpen(false);
                                        }}
                                                className={`w-full flex items-center px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-200 text-sm lg:text-base ${
                                                    activeTab === item.id 
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' 
                                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                <span className="mr-2 lg:mr-3">{item.icon}</span>
                                                {item.name}
                                    </button>
                                        ))}
                                    </div>
                                </nav>

                                {/* Footer */}
                                <div className="p-3 lg:p-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg lg:rounded-xl transition"
                                    >
                                        <FiLogOut className="mr-2" size={16} />
                                        Logout
                            </button>
                        </div>
                    </div>
                </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                            <RiDashboardFill className="mr-3 text-blue-600" />
                            Admin Panel
                        </h1>
                    </div>

                    {/* User Profile */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                        <img 
                            src={user?.photoURL || './img/ak.jpg'} 
                            alt="Admin" 
                                className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                        />
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{user?.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                                <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                {user?.role}
                            </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <div className="space-y-2">
                            {navigationItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                                        activeTab === item.id 
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' 
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
                        >
                            <FiLogOut className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-80 pt-14 lg:pt-0">
                <div className="p-3 lg:p-6">
                {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-1 lg:mb-2">
                                Dashboard Overview
                            </h1>
                            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                                Welcome back, {user?.name}. Here's what's happening with your store today.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0">
                            {/* Search - Hidden on very small screens */}
                            <div className="relative w-full sm:w-auto">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-48 pl-8 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                                {/* Notifications */}
                                <button className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                                    <FiBell size={16} />
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>

                                {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                                    {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
                            </button>

                                {/* Add Product Button */}
                            <button
                                    onClick={() => setShowAddProductModal(true)}
                                    className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
                            >
                                    <FiPlus className="mr-1" size={14} />
                                Add Product
                            </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setActiveTab(stat.tabIndex)}
                                className={`${stat.color} ${stat.textColor} p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs lg:text-sm font-medium opacity-90">{stat.title}</p>
                                        <h3 className="text-lg lg:text-3xl font-bold mt-1 lg:mt-2">{stat.value}</h3>
                                        <p className="text-xs opacity-75 mt-1 hidden sm:block">{stat.change} from last month</p>
                                    </div>
                                    <div className="p-2 lg:p-3 rounded-lg lg:rounded-xl bg-white bg-opacity-20">
                                        <div className="text-sm lg:text-base">
                                        {stat.icon}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-4 lg:p-6">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4 lg:mb-6">
                                {navigationItems[activeTab].name} Management
                            </h2>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {navigationItems[activeTab].component}
                                </motion.div>
                            </AnimatePresence>
                                </div>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
            {showAddProductModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 lg:p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                        <div className="p-4 lg:p-6">
                                <div className="flex justify-between items-center mb-4 lg:mb-6">
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Add New Product</h2>
                                <button 
                                        onClick={() => {
                                            setShowAddProductModal(false);
                                            resetProductForm();
                                        }}
                                        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        <FiX size={20} />
                                </button>
                            </div>

                                <div className="space-y-4 lg:space-y-6">
                                {/* Product Title */}
                                <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Product Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={product.title}
                                        onChange={(e) => setProduct({ ...product, title: e.target.value })}
                                        placeholder="Enter product title"
                                            className="w-full px-3 lg:px-4 py-2.5 lg:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
                                        required
                                    />
                                </div>

                                {/* Price and Category */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                    <div>
                                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Price (रु) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            value={product.price}
                                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
                                            required
                                        />
                                    </div>

                                    <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="category"
                                            value={product.category}
                                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
                                            required
                                        >
                                            <option value="" disabled>Select a category</option>
                                            {categoryList.map((item, index) => (
                                                <option key={index} value={item.name} className="capitalize">
                                                    {item.icon} {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Image URL */}
                                <div>
                                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Image URL <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        id="imageUrl"
                                        value={product.productImageUrl}
                                        onChange={(e) => setProduct({ ...product, productImageUrl: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                            className="w-full px-3 lg:px-4 py-2.5 lg:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
                                        required
                                    />
                                    {product.productImageUrl && (
                                            <div className="mt-3">
                                                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mb-2">Image Preview:</p>
                                            <img 
                                                src={product.productImageUrl} 
                                                alt="Preview" 
                                                    className="max-w-full h-24 lg:h-32 object-contain border border-gray-300 dark:border-gray-600 rounded-lg"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        value={product.description}
                                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                        placeholder="Enter detailed product description..."
                                        rows="3"
                                            className="w-full px-3 lg:px-4 py-2.5 lg:py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition resize-none"
                                        required
                                    />
                                </div>

                                {/* Buttons */}
                                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                                    <button
                                        type="button"
                                            onClick={() => {
                                                setShowAddProductModal(false);
                                                resetProductForm();
                                            }}
                                            className="w-full sm:w-auto px-4 lg:px-6 py-2.5 lg:py-3 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg lg:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addProductFunction}
                                        disabled={loading}
                                            className="w-full sm:w-auto px-4 lg:px-6 py-2.5 lg:py-3 text-sm bg-blue-600 text-white rounded-lg lg:rounded-xl hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
                                    >
                                        {loading ? 'Adding...' : 'Add Product'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        </motion.div>
                    </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;