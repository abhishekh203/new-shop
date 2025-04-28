import { useNavigate } from "react-router";
import Layout from "../../components/layout/Layout";
import { useContext, useEffect, useState } from "react";
import myContext from "../../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import { FaSearch, FaFilter, FaShoppingCart, FaStar, FaRegStar, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AllProduct = () => {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { getAllProduct } = context;
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState("default");
    const [isSearching, setIsSearching] = useState(false);

    // Loading skeleton component
    const LoadingCard = ({ delay = 0 }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
                opacity: 1,
                y: 0,
                transition: { delay: delay * 0.1, duration: 0.3 }
            }}
            className="relative group bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-lg"
        >
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"
                    animate={{
                        x: ["-100%", "100%"],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear"
                    }}
                />
            </div>
            
            {/* Image placeholder */}
            <div className="h-64 w-full bg-gray-700"></div>
            
            {/* Content placeholder */}
            <div className="p-4 space-y-3">
                <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
                <div className="h-6 w-3/4 bg-gray-700 rounded"></div>
                <div className="flex justify-between mt-4">
                    <div className="h-6 w-1/4 bg-gray-700 rounded"></div>
                    <div className="h-8 w-1/3 bg-gray-700 rounded"></div>
                </div>
            </div>
        </motion.div>
    );

    // Filter and sort products
    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            let results = getAllProduct.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Sorting logic
            switch (sortOption) {
                case "price-low":
                    results.sort((a, b) => a.price - b.price);
                    break;
                case "price-high":
                    results.sort((a, b) => b.price - a.price);
                    break;
                case "name":
                    results.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                default:
                    // Default sorting (newest first or whatever your original order is)
                    break;
            }

            setFilteredProducts(results);
            setIsSearching(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [getAllProduct, searchTerm, sortOption]);

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart", {
            position: "bottom-right",
            style: {
                background: "#1f2937",
                color: "#fff",
                border: "1px solid #374151"
            }
        });
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Removed from cart", {
            position: "bottom-right",
            style: {
                background: "#1f2937",
                color: "#fff",
                border: "1px solid #374151"
            }
        });
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Product card animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <Layout>
            <div className="py-8 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 min-h-screen">
                {/* Header Section */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-10 text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                            Explore Our Collection
                        </h1>
                        <p className="mt-3 text-lg text-gray-300 max-w-2xl mx-auto">
                            Discover premium digital products tailored for your needs
                        </p>
                    </motion.div>

                    {/* Search and Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
                    >
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <motion.input
                                type="text"
                                placeholder="Search products..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                whileFocus={{ 
                                    scale: 1.02,
                                    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="text-gray-300 whitespace-nowrap">Sort by:</span>
                            <motion.select
                                className="block w-full md:w-48 px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                whileHover={{ scale: 1.02 }}
                            >
                                <option value="default">Default</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name (A-Z)</option>
                            </motion.select>
                        </div>
                    </motion.div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {isSearching ? (
                                // Loading state
                                Array.from({ length: 8 }).map((_, index) => (
                                    <LoadingCard key={`loading-${index}`} delay={index} />
                                ))
                            ) : (
                                // Loaded content
                                filteredProducts.map((item, index) => {
                                    const { id, title, price, productImageUrl, rating } = item;
                                    const isInCart = cartItems.some((p) => p.id === item.id);

                                    return (
                                        <motion.div
                                            key={id}
                                            layout
                                            variants={cardVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ 
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 20,
                                                duration: 0.5,
                                                delay: index * 0.05
                                            }}
                                            className="relative group bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                        >
                                            {/* Product Image */}
                                            <div 
                                                className="relative h-64 w-full overflow-hidden cursor-pointer"
                                                onClick={() => navigate(`/productinfo/${id}`)}
                                            >
                                                <motion.img
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    src={productImageUrl}
                                                    alt={title}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                    <motion.button 
                                                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            isInCart ? deleteCart(item) : addCart(item);
                                                        }}
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        {isInCart ? "Remove from Cart" : "Add to Cart"}
                                                        <motion.span
                                                            className="ml-2"
                                                            animate={{ x: [0, 5, 0] }}
                                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                                        >
                                                            <FaArrowRight />
                                                        </motion.span>
                                                    </motion.button>
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                                            Digital Shop Nepal
                                                        </h2>
                                                        <h3 
                                                            className="text-lg font-semibold text-white mt-1 cursor-pointer hover:text-blue-400 transition-colors"
                                                            onClick={() => navigate(`/productinfo/${id}`)}
                                                        >
                                                            {title.length > 30 ? `${title.substring(0, 30)}...` : title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center bg-gray-700/50 px-2 py-1 rounded">
                                                        <FaStar className="text-yellow-400 mr-1" />
                                                        <span className="text-white text-sm font-medium">
                                                            {rating || "4.5"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex justify-between items-center">
                                                    <span className="text-xl font-bold text-blue-400">रु{price}</span>
                                                    <motion.button
                                                        className={`py-1 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${isInCart ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"} text-white flex items-center`}
                                                        onClick={() => isInCart ? deleteCart(item) : addCart(item)}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        {isInCart ? (
                                                            <>
                                                                <FaShoppingCart className="inline mr-1" />
                                                                Added
                                                            </>
                                                        ) : (
                                                            "Add to Cart"
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </div>

                                            {/* Badge for items in cart */}
                                            {isInCart && (
                                                <motion.div 
                                                    className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring" }}
                                                >
                                                    In Cart
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Empty state */}
                    {!isSearching && filteredProducts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="text-gray-400 text-5xl mb-4 inline-block"
                            >
                                <FaSearch />
                            </motion.div>
                            <h3 className="text-xl font-medium text-white">No products found</h3>
                            <p className="mt-2 text-gray-400">
                                Try adjusting your search or filter to find what you're looking for.
                            </p>
                            <motion.button
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSortOption("default");
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Clear filters
                                <FaArrowRight className="ml-2" />
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AllProduct;