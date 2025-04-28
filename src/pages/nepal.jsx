import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import myContext from "../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, deleteFromCart } from "../redux/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiShoppingCart, 
  FiTrash2,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiSearch  // Added missing import
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const Nepal = () => {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { getAllProduct } = context;
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const toggleDescription = (id) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart", {
            position: "bottom-right",
            style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151'
            }
        });
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Removed from cart", {
            position: "bottom-right",
            style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151'
            }
        });
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const filteredProducts = getAllProduct.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="py-12 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 min-h-screen px-4 sm:px-6">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Available Subscriptions</h1>
                <p className="text-gray-300 max-w-2xl mx-auto">
                    Add any subscription to your cart to proceed with purchase
                </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 max-w-md mx-auto"
            >
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search subscriptions..."
                        className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence>
                    {filteredProducts.map((item, index) => {
                        const { id, title, price, productImageUrl, description } = item;
                        const isInCart = cartItems.some(p => p.id === id);
                        const isExpanded = expandedDescriptions[id];

                        return (
                            <motion.div
                                key={id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="border border-gray-700 rounded-xl overflow-hidden shadow-xl bg-gray-800 hover:bg-gray-700/50 transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row h-full">
                                    {/* Product Image */}
                                    <div className="lg:w-1/2 relative group">
                                        <img
                                            onClick={() => navigate(`/productinfo/${id}`)}
                                            className="w-full h-64 lg:h-full object-cover cursor-pointer transition-opacity duration-300 group-hover:opacity-90"
                                            src={productImageUrl}
                                            alt={title}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="flex items-center text-white text-sm">
                                                <FiInfo className="mr-1" />
                                                <span>Click for details</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="lg:w-1/2 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-medium text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
                                                    Digital Shop Nepal
                                                </span>
                                                <div className="flex items-center bg-gray-700/50 px-2 py-1 rounded">
                                                    <FaStar className="text-yellow-400 mr-1" />
                                                    <span className="text-white text-sm font-medium">4.8</span>
                                                </div>
                                            </div>

                                            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
                                            <p className="text-2xl font-bold text-blue-400 mb-4">₹{price}</p>

                                            {/* Description with expand/collapse */}
                                            <div className="mb-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="text-sm font-semibold text-gray-300">Description</h3>
                                                    <button 
                                                        onClick={() => toggleDescription(id)}
                                                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                                <span>Show less</span>
                                                                <FiChevronUp className="ml-1" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>Show more</span>
                                                                <FiChevronDown className="ml-1" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                <div className={`text-gray-400 transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-20'} overflow-hidden`}>
                                                    {description || "No description available."}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-4">
                                            {isInCart ? (
                                                <motion.button
                                                    onClick={() => deleteCart(item)}
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                                                >
                                                    <FiTrash2 />
                                                    Remove from Cart
                                                </motion.button>
                                            ) : (
                                                <motion.button
                                                    onClick={() => addCart(item)}
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                                                >
                                                    <FiShoppingCart />
                                                    Add to Cart
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-gray-400 text-5xl mb-4">
                        <FiSearch className="inline-block" />
                    </div>
                    <h3 className="text-xl font-medium text-white">No products found</h3>
                    <p className="mt-2 text-gray-400">
                        Try adjusting your search to find what you're looking for.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Nepal;