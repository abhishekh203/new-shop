import React, { useContext, useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useNavigate } from 'react-router-dom';
import ProductDetail from '../../components/admin/ProductDetail';
import OrderDetail from '../../components/admin/OrderDetail';
import UserDetail from '../../components/admin/UserDetail';
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
  FiX
} from 'react-icons/fi';
import { BsBoxSeam, BsPersonLinesFill } from 'react-icons/bs';
import { RiDashboardFill } from 'react-icons/ri';
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const context = useContext(myContext);
    const { getAllProduct, getAllOrder, getAllUser, loading, setLoading } = context;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) return JSON.parse(savedMode);
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

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

    const categoryList = [
        { name: 'netflix', icon: '🎬' },
        { name: 'OTT', icon: '📺' },
        { name: 'streaming', icon: '📡' },
        { name: 'music', icon: '🎵' },
        { name: 'Software', icon: '💻' },
        { name: 'games', icon: '🎮' },
        { name: 'movies', icon: '🎥' },
        { name: 'bundle', icon: '🎁' },
        { name: 'education', icon: '📚' },
        { name: 'vpn', icon: '🔒' },
        { name: 'AI', icon: '🤖' },
        { name: 'special offer', icon: '🔥' },
        { name: 'antivirus', icon: '🛡️' },
        { name: 'gift card', icon: '💳' }
    ];

    // Toggle dark mode and save preference
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    // Apply dark mode class to document element
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const handleLogout = () => {
        localStorage.removeItem('users');
        localStorage.removeItem('auth');
        navigate('/');
    };

    const handleAddProduct = () => {
        setShowAddProductModal(true);
    };

    const addProductFunction = async () => {
        if (!product.title.trim()) {
            return toast.error("Product title is required");
        }
        if (!product.price) {
            return toast.error("Product price is required");
        }
        if (isNaN(product.price) || Number(product.price) <= 0) {
            return toast.error("Please enter a valid price");
        }
        if (!product.productImageUrl.trim()) {
            return toast.error("Product image URL is required");
        }
        if (!product.category) {
            return toast.error("Please select a category");
        }
        if (!product.description.trim()) {
            return toast.error("Product description is required");
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

    // Stats data for the dashboard cards
    const stats = [
        {
            title: 'Total Products',
            value: getAllProduct.length,
            icon: <FiShoppingBag size={24} />,
            color: 'bg-amber-100 dark:bg-amber-800 border border-amber-200 dark:border-amber-700',
            textColor: 'text-amber-800 dark:text-amber-100',
            tabIndex: 0
        },
        {
            title: 'Total Orders',
            value: getAllOrder.length,
            icon: <FiList size={24} />,
            color: 'bg-blue-500 dark:bg-blue-700',
            textColor: 'text-white',
            tabIndex: 1
        },
        {
            title: 'Total Users',
            value: getAllUser.length,
            icon: <FiUsers size={24} />,
            color: 'bg-purple-500 dark:bg-purple-700',
            textColor: 'text-white',
            tabIndex: 2
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
                <button 
                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    className="text-white"
                >
                    {mobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
                <h1 className="text-xl font-bold text-white flex items-center">
                    <RiDashboardFill className="mr-2" />
                    Admin Panel
                </h1>
                <div className="w-8"></div> {/* Spacer for alignment */}
            </div>

            {/* Sidebar - Mobile */}
            <div className={`lg:hidden fixed inset-0 z-30 transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="w-64 h-full bg-gray-900 dark:bg-gray-800 text-white shadow-lg overflow-y-auto">
                    <div className="flex flex-col h-full pt-16">
                        {/* User Profile */}
                        <div className="p-6 flex flex-col items-center border-b border-gray-700">
                            <img 
                                src={user?.photoURL || './img/ak.jpg'} 
                                alt="Admin" 
                                className="w-20 h-20 rounded-full border-4 border-gray-600 dark:border-gray-500 object-cover"
                            />
                            <div className="mt-4 text-center">
                                <h2 className="text-lg font-semibold">{user?.name}</h2>
                                <p className="text-gray-400 text-sm">{user?.email}</p>
                                <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-600 rounded-full">
                                    {user?.role}
                                </span>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 overflow-y-auto">
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => {
                                            setActiveTab(0);
                                            setMobileSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === 0 ? 'bg-gray-700 dark:bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700'}`}
                                    >
                                        <BsBoxSeam className="mr-3" />
                                        Products
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            setActiveTab(1);
                                            setMobileSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === 1 ? 'bg-gray-700 dark:bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700'}`}
                                    >
                                        <FiList className="mr-3" />
                                        Orders
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            setActiveTab(2);
                                            setMobileSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === 2 ? 'bg-gray-700 dark:bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700'}`}
                                    >
                                        <BsPersonLinesFill className="mr-3" />
                                        Users
                                    </button>
                                </li>
                            </ul>
                        </nav>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-700 flex flex-col space-y-2">
                            <button
                                onClick={toggleDarkMode}
                                className="w-full flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-900 rounded-lg transition"
                            >
                                {darkMode ? (
                                    <>
                                        <FiSun className="mr-2" />
                                        Light Mode
                                    </>
                                ) : (
                                    <>
                                        <FiMoon className="mr-2" />
                                        Dark Mode
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                <FiLogOut className="mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-gray-900 dark:bg-gray-800 text-white shadow-lg transition-colors duration-200">
                <div className="flex flex-col h-full">
                    {/* Logo/Brand */}
                    <div className="p-6 border-b border-gray-700">
                        <h1 className="text-2xl font-bold flex items-center">
                            <RiDashboardFill className="mr-2" />
                            Admin Panel
                        </h1>
                    </div>

                    {/* User Profile */}
                    <div className="p-6 flex flex-col items-center border-b border-gray-700">
                        <img 
                            src={user?.photoURL || './img/ak.jpg'} 
                            alt="Admin" 
                            className="w-20 h-20 rounded-full border-4 border-gray-600 dark:border-gray-500 object-cover"
                        />
                        <div className="mt-4 text-center">
                            <h2 className="text-lg font-semibold">{user?.name}</h2>
                            <p className="text-gray-400 text-sm">{user?.email}</p>
                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-600 rounded-full">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => setActiveTab(0)}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === 0 ? 'bg-gray-700 dark:bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700'}`}
                                >
                                    <BsBoxSeam className="mr-3" />
                                    Products
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab(1)}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === 1 ? 'bg-gray-700 dark:bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700'}`}
                                >
                                    <FiList className="mr-3" />
                                    Orders
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab(2)}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === 2 ? 'bg-gray-700 dark:bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700'}`}
                                >
                                    <BsPersonLinesFill className="mr-3" />
                                    Users
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700 flex flex-col space-y-2">
                        <button
                            onClick={toggleDarkMode}
                            className="w-full flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-900 rounded-lg transition"
                        >
                            {darkMode ? (
                                <>
                                    <FiSun className="mr-2" />
                                    Light Mode
                                </>
                            ) : (
                                <>
                                    <FiMoon className="mr-2" />
                                    Dark Mode
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition"
                        >
                            <FiLogOut className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64 pt-16 lg:pt-0 transition-all duration-200">
                {/* Header */}
                <div className="p-4 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-4 lg:mb-0">Dashboard Overview</h1>
                        <div className="flex space-x-3 lg:space-x-4">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                            >
                                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                            </button>
                            <button
                                onClick={handleAddProduct}
                                className="flex items-center px-3 py-1 lg:px-4 lg:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm lg:text-base"
                            >
                                <FiPlus className="mr-1 lg:mr-2" />
                                Add Product
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
                        {stats.map((stat, index) => (
                            <div 
                                key={index}
                                onClick={() => setActiveTab(stat.tabIndex)}
                                className={`${stat.color} ${stat.textColor} p-4 lg:p-6 rounded-xl shadow-md cursor-pointer transition transform hover:scale-[1.02]`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs lg:text-sm font-medium">{stat.title}</p>
                                        <h3 className="text-2xl lg:text-3xl font-bold mt-1 lg:mt-2">{stat.value}</h3>
                                    </div>
                                    <div className={`p-2 lg:p-3 rounded-full ${stat.textColor === 'text-white' ? 'bg-white bg-opacity-20' : 'bg-amber-200 dark:bg-amber-700 bg-opacity-50'}`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
                        <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
                            <TabList className="hidden">
                                {stats.map((stat, index) => (
                                    <Tab key={index}></Tab>
                                ))}
                            </TabList>

                            <TabPanel>
                                <div className="p-4 lg:p-6">
                                    <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4 text-gray-800 dark:text-white">Product Management</h2>
                                    <ProductDetail />
                                </div>
                            </TabPanel>

                            <TabPanel>
                                <div className="p-4 lg:p-6">
                                    <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4 text-gray-800 dark:text-white">Order Management</h2>
                                    <OrderDetail />
                                </div>
                            </TabPanel>

                            <TabPanel>
                                <div className="p-4 lg:p-6">
                                    <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4 text-gray-800 dark:text-white">User Management</h2>
                                    <UserDetail />
                                </div>
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddProductModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-200">
                        <div className="p-4 lg:p-6">
                            <div className="flex justify-between items-center mb-3 lg:mb-4">
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">Add New Product</h2>
                                <button 
                                    onClick={() => setShowAddProductModal(false)}
                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-3 lg:space-y-4">
                                {/* Product Title */}
                                <div>
                                    <label htmlFor="title" className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Product Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={product.title}
                                        onChange={(e) => setProduct({ ...product, title: e.target.value })}
                                        placeholder="Enter product title"
                                        className="w-full px-3 lg:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm lg:text-base"
                                        required
                                    />
                                </div>

                                {/* Price and Category */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div>
                                        <label htmlFor="price" className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Price ($) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={product.price}
                                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 lg:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm lg:text-base"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="category"
                                            value={product.category}
                                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                            className="w-full px-3 lg:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm lg:text-base"
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
                                    <label htmlFor="imageUrl" className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Image URL <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        id="imageUrl"
                                        name="productImageUrl"
                                        value={product.productImageUrl}
                                        onChange={(e) => setProduct({ ...product, productImageUrl: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-3 lg:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm lg:text-base"
                                        required
                                    />
                                    {product.productImageUrl && (
                                        <div className="mt-2">
                                            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mb-1">Image Preview:</p>
                                            <img 
                                                src={product.productImageUrl} 
                                                alt="Preview" 
                                                className="max-w-full h-24 lg:h-32 object-contain border rounded dark:border-gray-600"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={product.description}
                                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                        placeholder="Enter detailed product description..."
                                        rows="3"
                                        className="w-full px-3 lg:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm lg:text-base"
                                        required
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end space-x-2 lg:space-x-3 pt-3 lg:pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddProductModal(false)}
                                        className="px-3 lg:px-4 py-1 lg:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-sm lg:text-base"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addProductFunction}
                                        disabled={loading}
                                        className="px-3 lg:px-4 py-1 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-sm lg:text-base"
                                    >
                                        {loading ? 'Adding...' : 'Add Product'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;