import { useContext, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { 
  FiUser, FiMail, FiCalendar, FiShoppingBag, 
  FiClock, FiDownload, FiChevronDown, FiChevronUp,
  FiSearch, FiFilter, FiSun, FiMoon, FiCreditCard,
  FiMapPin, FiPhone, FiPackage, FiRefreshCw
} from "react-icons/fi";
import { 
  BsBoxSeam, BsCurrencyRupee, BsGraphUp, 
  BsShieldCheck, BsQuestionCircle 
} from "react-icons/bs";
import { 
  FaCheckCircle, FaTimesCircle, FaShippingFast,
  FaRegStar, FaStar, FaRegHeart, FaHeart
} from "react-icons/fa";
import { RiRefund2Line, RiCustomerService2Line } from "react-icons/ri";
import { MdOutlineLocalOffer, MdOutlineSecurity } from "react-icons/md";
import { toast } from "react-hot-toast";
import Chart from 'react-apexcharts';
import { motion, AnimatePresence } from "framer-motion";

const UserDashboard = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const context = useContext(myContext);
    const { loading, getAllOrder } = context;
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [activeTab, setActiveTab] = useState("orders");
    const [favorites, setFavorites] = useState([]);
    
    // Dark mode state management
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) return JSON.parse(savedMode);
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Apply dark mode class to document element
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Calculate order total
    const calculateTotalAmount = (order) => {
        return order.cartItems.reduce((total, item) => {
            return total + (Number(item.price) * Number(item.quantity));
        }, 0);
    };

    // Filter and sort orders
    const userOrders = useMemo(() => {
        return getAllOrder
            .filter((obj) => obj.userid === user?.uid)
            .filter((order) => {
                const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    order.cartItems.some((item) => 
                        item.title.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                const matchesStatus = filterStatus === "all" || order.status === filterStatus;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
                if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
                if (sortBy === "highest") return calculateTotalAmount(b) - calculateTotalAmount(a);
                if (sortBy === "lowest") return calculateTotalAmount(a) - calculateTotalAmount(b);
                return 0;
            });
    }, [getAllOrder, user?.uid, searchTerm, filterStatus, sortBy]);

    // Order statistics for chart
    const statusStats = useMemo(() => ({
        delivered: userOrders.filter(o => o.status === 'delivered').length,
        pending: userOrders.filter(o => o.status === 'pending').length,
        cancelled: userOrders.filter(o => o.status === 'cancelled').length,
        refunded: userOrders.filter(o => o.status === 'refunded').length
    }), [userOrders]);

    // Chart configuration
    const chartOptions = useMemo(() => ({
        series: [{
            name: 'Orders',
            data: Object.values(statusStats)
        }],
        options: {
            chart: {
                type: 'donut',
                height: 350,
                toolbar: { show: false },
                foreColor: darkMode ? '#e5e7eb' : '#374151'
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: 'Total Orders',
                                color: darkMode ? '#e5e7eb' : '#374151',
                                formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                            }
                        }
                    }
                }
            },
            dataLabels: { enabled: false },
            colors: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
            labels: Object.keys(statusStats).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
            tooltip: { 
                theme: darkMode ? 'dark' : 'light',
                y: {
                    formatter: (value) => `${value} orders`
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    colors: darkMode ? '#e5e7eb' : '#374151'
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    }), [statusStats, darkMode]);

    // Toggle order details
    const toggleOrderExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    // Generate invoice
    const generateInvoice = (order) => {
        try {
            toast.loading("Generating invoice...");
            
            const invoiceHTML = `
                <html>
                <head>
                    <title>Invoice #${order.id.substring(0, 8)}</title>
                    <style>
                        body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 20px; color: #111827; }
                        .container { max-width: 800px; margin: 0 auto; }
                        .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
                        .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
                        .invoice-title { font-size: 28px; font-weight: bold; color: #111827; margin-bottom: 5px; }
                        .invoice-meta { text-align: right; }
                        .invoice-details { margin-bottom: 40px; }
                        .customer-info, .shipping-info { margin-bottom: 25px; }
                        .section-title { font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        th { background-color: #f3f4f6; text-align: left; padding: 12px 8px; font-weight: 600; }
                        td { padding: 12px 8px; border-bottom: 1px solid #e5e7eb; }
                        .total-row { font-weight: bold; }
                        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
                        .whatsapp-support { 
                            margin: 20px 0; 
                            padding: 15px;
                            background-color: #f8f9fa;
                            border-radius: 8px;
                            text-align: center;
                        }
                        .whatsapp-link {
                            display: inline-block;
                            color: #25D366;
                            font-weight: bold;
                            text-decoration: none;
                            margin-top: 10px;
                            padding: 8px 15px;
                            border: 1px solid #25D366;
                            border-radius: 6px;
                            transition: all 0.3s;
                        }
                        .whatsapp-link:hover {
                            background-color: #25D366;
                            color: white;
                        }
                        .badge {
                            display: inline-block;
                            padding: 4px 8px;
                            border-radius: 12px;
                            font-size: 12px;
                            font-weight: 600;
                        }
                        .status-delivered { background-color: #D1FAE5; color: #065F46; }
                        .status-pending { background-color: #FEF3C7; color: #92400E; }
                        .status-cancelled { background-color: #FEE2E2; color: #991B1B; }
                        .text-right { text-align: right; }
                        .text-center { text-align: center; }
                        .summary-box { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
                        .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                        .summary-total { font-size: 18px; font-weight: 600; padding-top: 10px; margin-top: 10px; border-top: 1px solid #e5e7eb; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="invoice-header">
                            <div>
                                <div class="logo">Digital Shop Nepal</div>
                                <p>Kathmandu, Nepal</p>
                            </div>
                            <div class="invoice-meta">
                                <h1 class="invoice-title">INVOICE</h1>
                                <p><strong>Order #:</strong> ${order.id.substring(0, 8)}</p>
                                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                                <p><strong>Status:</strong> <span class="badge status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
                            </div>
                        </div>
                        
                        <div class="invoice-details">
                            <div style="display: flex; gap: 30px; margin-bottom: 30px;">
                                <div class="customer-info" style="flex: 1;">
                                    <h3 class="section-title">Customer Details</h3>
                                    <p><strong>Name:</strong> ${user?.name}</p>
                                    <p><strong>Email:</strong> ${user?.email}</p>
                                </div>
                                
                                <div class="shipping-info" style="flex: 1;">
                                    <h3 class="section-title">Shipping Details</h3>
                                    <p><strong>Address:</strong> ${order.shippingAddress || 'Not specified'}</p>
                                    <p><strong>Phone:</strong> ${order.phoneNumber || 'Not specified'}</p>
                                    <p><strong>Payment:</strong> ${order.paymentMethod || 'Not specified'}</p>
                                </div>
                            </div>
                            
                            <h3 class="section-title">Order Items</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th class="text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${order.cartItems.map(item => `
                                        <tr>
                                            <td>${item.title}</td>
                                            <td>${item.category}</td>
                                            <td>₹${item.price}</td>
                                            <td>${item.quantity}</td>
                                            <td class="text-right">₹${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            
                            <div class="summary-box">
                                <div class="summary-row">
                                    <span>Subtotal:</span>
                                    <span>₹${calculateTotalAmount(order).toFixed(2)}</span>
                                </div>
                                <div class="summary-row">
                                    <span>Shipping:</span>
                                    <span>₹0.00</span>
                                </div>
                                <div class="summary-row">
                                    <span>Tax (0%):</span>
                                    <span>₹0.00</span>
                                </div>
                                <div class="summary-row summary-total">
                                    <span>Total:</span>
                                    <span>₹${calculateTotalAmount(order).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <div class="whatsapp-support">
                                <p>Thank you for your purchase! We appreciate your business ❤️</p>
                                <p>If you have any questions about your order or don't receive updates within 30 minutes, our support team is happy to help:</p>
                                <a href="https://wa.me/9779807677391" class="whatsapp-link">
                                    WhatsApp Support: +977 980-7677391
                                </a>
                            </div>
                            <p>© ${new Date().getFullYear()} Digital Shop Nepal. All rights reserved.</p>
                            <p style="margin-top: 10px;">This is a computer-generated invoice. No signature required.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
            
            // Create a Blob with the invoice HTML
            const blob = new Blob([invoiceHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            // Create a temporary anchor element to trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice_${order.id.substring(0, 8)}.html`;
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast.dismiss();
            toast.success("Invoice downloaded!");
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to generate invoice");
            console.error("Invoice generation error:", error);
        }
    };

    const requestRefund = (orderId) => {
        toast.success(`Refund requested for order #${orderId.substring(0, 8)}`);
    };

    const trackShipping = (orderId) => {
        toast(`Tracking order #${orderId.substring(0, 8)}`, { 
            icon: '🚚',
            duration: 4000,
            style: {
                background: darkMode ? '#1F2937' : '#FFFFFF',
                color: darkMode ? '#F3F4F6' : '#1F2937',
            }
        });
    };

    const toggleFavorite = (productId) => {
        setFavorites(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId) 
                : [...prev, productId]
        );
    };

    const recentProducts = useMemo(() => {
        const allProducts = userOrders.flatMap(order => order.cartItems);
        return [...new Map(allProducts.map(item => [item.id, item])).values()]
            .slice(0, 4);
    }, [userOrders]);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
                {/* Dark Mode Toggle Button (Top Right) */}
                <div className="fixed top-4 right-4 z-50">
                    <motion.button
                        onClick={toggleDarkMode}
                        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {darkMode ? (
                            <FiSun className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <FiMoon className="w-5 h-5 text-gray-700" />
                        )}
                    </motion.button>
                </div>

                <div className="max-w-7xl mx-auto">
                    {/* User Profile Header */}
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 w-full transition-colors duration-300">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative">
                                    <img 
                                        src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                                        alt="User" 
                                        className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover shadow-md"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-md">
                                        <FiUser className="text-white text-lg" />
                                    </div>
                                </div>
                                <div className="text-center sm:text-left flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user?.name}</h1>
                                    <div className="space-y-1 text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center justify-center sm:justify-start">
                                            <FiMail className="mr-2 text-blue-500" />
                                            <span>{user?.email}</span>
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-start">
                                            <FiCalendar className="mr-2 text-blue-500" />
                                            <span>Member since: {new Date(user?.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-start">
                                            <FiShoppingBag className="mr-2 text-blue-500" />
                                            <span className="capitalize">{user?.role}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link 
                                        to="/account/edit" 
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center"
                                    >
                                        Edit Profile
                                    </Link>
                                    <Link 
                                        to="/account/security" 
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                                    >
                                        Security
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Tabs */}
                    <div className="mb-8">
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="-mb-px flex space-x-8 overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === "orders" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                                >
                                    <BsBoxSeam className="mr-2" />
                                    My Orders
                                    {userOrders.length > 0 && (
                                        <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            {userOrders.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("wishlist")}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === "wishlist" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                                >
                                    <FaRegHeart className="mr-2" />
                                    Wishlist
                                    {favorites.length > 0 && (
                                        <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            {favorites.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("recent")}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === "recent" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                                >
                                    <FiRefreshCw className="mr-2" />
                                    Recently Viewed
                                </button>
                                <button
                                    onClick={() => setActiveTab("security")}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === "security" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                                >
                                    <MdOutlineSecurity className="mr-2" />
                                    Security
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === "orders" && (
                                <div>
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors duration-300">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
                                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{userOrders.length}</p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                    <BsBoxSeam className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <FiCalendar className="mr-1.5" />
                                                <span>Last order: {userOrders[0] ? new Date(userOrders[0].date).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors duration-300">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
                                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                                        ₹{userOrders.reduce((total, order) => total + calculateTotalAmount(order), 0).toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                                    <BsCurrencyRupee className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <FiCreditCard className="mr-1.5" />
                                                <span>Average: ₹{(userOrders.reduce((total, order) => total + calculateTotalAmount(order), 0) / (userOrders.length || 1)).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors duration-300">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivered</p>
                                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{statusStats.delivered}</p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                                    <FaCheckCircle className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span className="text-green-500 dark:text-green-400">{userOrders.length ? Math.round((statusStats.delivered / userOrders.length) * 100) : 0}% success rate</span>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors duration-300">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{statusStats.pending}</p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                                    <FiClock className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span className="text-amber-500 dark:text-amber-400">
                                                    {statusStats.pending} active {statusStats.pending === 1 ? 'order' : 'orders'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Orders Section */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                                <BsBoxSeam className="mr-3 text-blue-500" />
                                                Order History
                                            </h2>

                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <div className="relative flex-1 min-w-[200px]">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FiSearch className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Search orders..."
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>

                                                <div className="flex gap-2">
                                                    <select
                                                        className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        value={filterStatus}
                                                        onChange={(e) => setFilterStatus(e.target.value)}
                                                    >
                                                        <option value="all">All Status</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>

                                                    <select
                                                        className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                                        {loading && (
                                            <div className="flex justify-center my-12">
                                                <Loader />
                                            </div>
                                        )}

                                        {userOrders.length === 0 && !loading && (
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center shadow-sm transition-colors duration-300">
                                                <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-6">
                                                    <BsBoxSeam className="w-12 h-12 text-gray-400 dark:text-gray-300" />
                                                </div>
                                                <h3 className="text-xl text-gray-700 dark:text-gray-300 mb-2">No orders yet</h3>
                                                <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
                                                <Link 
                                                    to="/" 
                                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                >
                                                    Start Shopping
                                                </Link>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            {userOrders.map((order) => (
                                                <motion.div 
                                                    key={order.id} 
                                                    className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm transition-all duration-300 border border-gray-200 dark:border-gray-600"
                                                    whileHover={{ y: -2 }}
                                                >
                                                    {/* Order Summary */}
                                                    <div 
                                                        className="p-6 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                                        onClick={() => toggleOrderExpand(order.id)}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center text-gray-900 dark:text-white mb-1">
                                                                <FiShoppingBag className="mr-2 text-blue-500" />
                                                                <span className="font-medium truncate">Order #{order.id.substring(0, 8)}</span>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
                                                                <div className="flex items-center">
                                                                    <FiClock className="mr-1.5" />
                                                                    <span>{new Date(order.date).toLocaleString()}</span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <FiCreditCard className="mr-1.5" />
                                                                    <span className="capitalize">{order.paymentMethod || 'Not specified'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                            <div className="flex items-center">
                                                                <BsCurrencyRupee className="mr-2 text-green-500" />
                                                                <span className="font-bold text-gray-900 dark:text-white">
                                                                    ₹{calculateTotalAmount(order).toFixed(2)}
                                                                </span>
                                                            </div>
                                                            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                                                                order.status === 'delivered' 
                                                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                                                                    : order.status === 'pending'
                                                                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                            }`}>
                                                                {order.status === 'delivered' ? (
                                                                    <FaCheckCircle className="mr-2" />
                                                                ) : (
                                                                    <FaTimesCircle className="mr-2" />
                                                                )}
                                                                <span className="capitalize">{order.status}</span>
                                                            </div>
                                                            <button 
                                                                className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition flex items-center text-sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleOrderExpand(order.id);
                                                                }}
                                                            >
                                                                {expandedOrder === order.id ? (
                                                                    <FiChevronUp className="ml-1" />
                                                                ) : (
                                                                    <FiChevronDown className="ml-1" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Order Details (Collapsible) */}
                                                    <AnimatePresence>
                                                        {expandedOrder === order.id && (
                                                            <motion.div 
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="border-t border-gray-200 dark:border-gray-600 overflow-hidden"
                                                            >
                                                                <div className="p-6">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                                                        <div>
                                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                                                <FiMapPin className="mr-2 text-blue-500" />
                                                                                Shipping Information
                                                                            </h3>
                                                                            <div className="bg-gray-100 dark:bg-gray-600/30 rounded-lg p-4">
                                                                                <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                                                    <strong>Address:</strong> {order.shippingAddress || 'Not specified'}
                                                                                </p>
                                                                                <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                                                    <strong>Phone:</strong> {order.phoneNumber || 'Not specified'}
                                                                                </p>
                                                                                <p className="text-gray-700 dark:text-gray-300">
                                                                                    <strong>Payment Method:</strong> {order.paymentMethod || 'Not specified'}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                                                <FiPackage className="mr-2 text-blue-500" />
                                                                                Order Summary
                                                                            </h3>
                                                                            <div className="bg-gray-100 dark:bg-gray-600/30 rounded-lg p-4">
                                                                                <div className="flex justify-between items-center mb-2">
                                                                                    <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
                                                                                    <span className="text-gray-900 dark:text-white">
                                                                                        ₹{calculateTotalAmount(order).toFixed(2)}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex justify-between items-center mb-2">
                                                                                    <span className="text-gray-700 dark:text-gray-300">Shipping:</span>
                                                                                    <span className="text-gray-900 dark:text-white">₹0.00</span>
                                                                                </div>
                                                                                <div className="flex justify-between items-center mb-2">
                                                                                    <span className="text-gray-700 dark:text-gray-300">Tax:</span>
                                                                                    <span className="text-gray-900 dark:text-white">₹0.00</span>
                                                                                </div>
                                                                                <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200 dark:border-gray-600">
                                                                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                                                                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                                                        ₹{calculateTotalAmount(order).toFixed(2)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
                                                                    <div className="space-y-4 mb-8">
                                                                        {order.cartItems.map((item, index) => (
                                                                            <div key={index} className="flex flex-col md:flex-row items-start md:items-center bg-white dark:bg-gray-600 rounded-lg p-4 gap-4 shadow-sm">
                                                                                <div className="flex-shrink-0 relative">
                                                                                    <img
                                                                                        className="w-20 h-20 object-contain rounded-lg border border-gray-200 dark:border-gray-500"
                                                                                        src={item.productImageUrl}
                                                                                        alt={item.title}
                                                                                        onError={(e) => {
                                                                                            e.target.src = "https://via.placeholder.com/100?text=No+Image";
                                                                                        }}
                                                                                    />
                                                                                    <button 
                                                                                        className="absolute -top-2 -right-2 bg-white dark:bg-gray-700 p-1 rounded-full shadow-md"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            toggleFavorite(item.id);
                                                                                        }}
                                                                                    >
                                                                                        {favorites.includes(item.id) ? (
                                                                                            <FaHeart className="text-red-500 w-4 h-4" />
                                                                                        ) : (
                                                                                            <FaRegHeart className="text-gray-400 w-4 h-4" />
                                                                                        )}
                                                                                    </button>
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                                                                                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{item.category}</p>
                                                                                    <div className="flex items-center mt-2">
                                                                                        {[...Array(5)].map((_, i) => (
                                                                                            i < 4 ? (
                                                                                                <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                                                                                            ) : (
                                                                                                <FaRegStar key={i} className="w-4 h-4 text-yellow-400" />
                                                                                            )
                                                                                        ))}
                                                                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(24)</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="md:text-right">
                                                                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                                                    </p>
                                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price} × {item.quantity}</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                                        {order.status === 'pending' && (
                                                                            <button 
                                                                                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center justify-center"
                                                                                onClick={() => trackShipping(order.id)}
                                                                            >
                                                                                <FaShippingFast className="mr-2" />
                                                                                Track Shipping
                                                                            </button>
                                                                        )}
                                                                        {order.status === 'delivered' && (
                                                                            <button 
                                                                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center justify-center"
                                                                                onClick={() => requestRefund(order.id)}
                                                                            >
                                                                                <RiRefund2Line className="mr-2" />
                                                                                Request Refund
                                                                            </button>
                                                                        )}
                                                                        <button 
                                                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                                                                            onClick={() => generateInvoice(order)}
                                                                        >
                                                                            <FiDownload className="mr-2" />
                                                                            Download Invoice
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "wishlist" && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                            <FaRegHeart className="mr-3 text-red-500" />
                                            Your Wishlist
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
                                        </p>
                                    </div>

                                    {favorites.length === 0 ? (
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center shadow-sm transition-colors duration-300">
                                            <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-6">
                                                <FaRegHeart className="w-12 h-12 text-gray-400 dark:text-gray-300" />
                                            </div>
                                            <h3 className="text-xl text-gray-700 dark:text-gray-300 mb-2">Your wishlist is empty</h3>
                                            <p className="text-gray-500 dark:text-gray-400 mb-6">Save items you love by clicking the heart icon.</p>
                                            <Link 
                                                to="/" 
                                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Browse Products
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {recentProducts.filter(item => favorites.includes(item.id)).map((item) => (
                                                <motion.div 
                                                    key={item.id}
                                                    className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:shadow-md"
                                                    whileHover={{ y: -5 }}
                                                >
                                                    <div className="relative">
                                                        <img
                                                            src={item.productImageUrl}
                                                            alt={item.title}
                                                            className="w-full h-48 object-cover"
                                                            onError={(e) => {
                                                                e.target.src = "https://via.placeholder.com/300?text=No+Image";
                                                            }}
                                                        />
                                                        <button 
                                                            className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
                                                            onClick={() => toggleFavorite(item.id)}
                                                        >
                                                            <FaHeart className="text-red-500 w-4 h-4" />
                                                        </button>
                                                        <div className="absolute bottom-3 left-3">
                                                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
                                                                {item.category}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">{item.title}</h3>
                                                        <div className="flex items-center mb-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                i < 4 ? (
                                                                    <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                                                                ) : (
                                                                    <FaRegStar key={i} className="w-4 h-4 text-yellow-400" />
                                                                )
                                                            ))}
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(24)</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-lg font-bold text-gray-900 dark:text-white">₹{item.price}</span>
                                                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                                                Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "recent" && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                            <FiRefreshCw className="mr-3 text-blue-500" />
                                            Recently Viewed
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {recentProducts.length} {recentProducts.length === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>

                                    {recentProducts.length === 0 ? (
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center shadow-sm transition-colors duration-300">
                                            <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mb-6">
                                                <BsQuestionCircle className="w-12 h-12 text-gray-400 dark:text-gray-300" />
                                            </div>
                                            <h3 className="text-xl text-gray-700 dark:text-gray-300 mb-2">No recently viewed items</h3>
                                            <p className="text-gray-500 dark:text-gray-400 mb-6">Browse products to see them here.</p>
                                            <Link 
                                                to="/" 
                                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Browse Products
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {recentProducts.map((item) => (
                                                <motion.div 
                                                    key={item.id}
                                                    className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:shadow-md"
                                                    whileHover={{ y: -5 }}
                                                >
                                                    <div className="relative">
                                                        <img
                                                            src={item.productImageUrl}
                                                            alt={item.title}
                                                            className="w-full h-48 object-cover"
                                                            onError={(e) => {
                                                                e.target.src = "https://via.placeholder.com/300?text=No+Image";
                                                            }}
                                                        />
                                                        <button 
                                                            className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
                                                            onClick={() => toggleFavorite(item.id)}
                                                        >
                                                            {favorites.includes(item.id) ? (
                                                                <FaHeart className="text-red-500 w-4 h-4" />
                                                            ) : (
                                                                <FaRegHeart className="text-gray-400 w-4 h-4" />
                                                            )}
                                                        </button>
                                                        <div className="absolute bottom-3 left-3">
                                                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
                                                                {item.category}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">{item.title}</h3>
                                                        <div className="flex items-center mb-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                i < 4 ? (
                                                                    <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                                                                ) : (
                                                                    <FaRegStar key={i} className="w-4 h-4 text-yellow-400" />
                                                                )
                                                            ))}
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(24)</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-lg font-bold text-gray-900 dark:text-white">₹{item.price}</span>
                                                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                                                Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-2/3">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                                <MdOutlineSecurity className="mr-3 text-blue-500" />
                                                Account Security
                                            </h2>

                                            <div className="space-y-6">
                                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Password</h3>
                                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                                Last changed: 3 months ago
                                                            </p>
                                                        </div>
                                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                                                            Change Password
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Two-Factor Authentication</h3>
                                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                                Add an extra layer of security to your account
                                                            </p>
                                                        </div>
                                                        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition text-sm">
                                                            Set Up 2FA
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Connected Devices</h3>
                                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                                3 devices currently signed in
                                                            </p>
                                                        </div>
                                                        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition text-sm">
                                                            Manage Devices
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:w-1/3">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                                                    <BsShieldCheck className="mr-2" />
                                                    Security Tips
                                                </h3>
                                                <ul className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
                                                    <li className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        <span>Use a strong, unique password</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        <span>Enable two-factor authentication</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        <span>Don't share your login details</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        <span>Log out from shared devices</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        <span>Be wary of phishing attempts</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Need Help?</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                                    Contact our support team if you have any security concerns.
                                                </p>
                                                <button className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition text-sm flex items-center justify-center">
                                                    <RiCustomerService2Line className="mr-2" />
                                                    Contact Support
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </Layout>
    );
};

export default UserDashboard;