import React, { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import myContext from "../../context/myContext"; // Assuming context path is correct
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig"; // Assuming Firebase config path is correct
import toast, { Toaster } from "react-hot-toast"; // Using react-hot-toast
import Loader from "../../components/loader/Loader"; // Assuming Loader path is correct
import { FiArrowLeft, FiImage, FiDollarSign, FiTag, FiAlignLeft, FiStar, FiTrendingUp, FiPackage, FiSave, FiXCircle, FiLoader, FiChevronDown } from "react-icons/fi"; // Added FiChevronDown
import { motion, AnimatePresence } from "framer-motion";

// --- Category List (Consider moving to a shared config file) ---
const categoryList = [
    { id: 'netflix', name: 'Netflix', icon: '🎬', color: '#E50914' },
    { id: 'ott', name: 'OTT', icon: '📺', color: '#00A859' },
    { id: 'streaming', name: 'Streaming', icon: '📡', color: '#1DA1F2' },
    { id: 'music', name: 'Music', icon: '🎵', color: '#1DB954' },
    { id: 'software', name: 'Software', icon: '💻', color: '#6E5494' },
    { id: 'games', name: 'Games', icon: '🎮', color: '#FF73FA' },
    { id: 'movies', name: 'Movies', icon: '🎥', color: '#FFC107' },
    { id: 'bundle', name: 'Bundle', icon: '🎁', color: '#FF7043' },
    { id: 'education', name: 'Education', icon: '📚', color: '#2196F3' },
    { id: 'vpn', name: 'VPN', icon: '🔒', color: '#607D8B' },
    { id: 'ai-tools', name: 'AI Tools', icon: '🤖', color: '#00BFA5' },
    { id: 'special-offers', name: 'Special Offers', icon: '🔥', color: '#FFD600' },
    { id: 'antivirus', name: 'Antivirus', icon: '🛡️', color: '#F44336' },
    { id: 'gift-cards', name: 'Gift Cards', icon: '💳', color: '#64B5F6' }
];

// --- Animation Variants ---
const pageContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
};

const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.98 },
    visible: {
        y: 0, opacity: 1, scale: 1,
        transition: { delay: 0.1, duration: 0.5, type: "spring", stiffness: 100, damping: 15 }
    },
};

// Variant for staggering form items inside the card
const formContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2, // Start staggering after card animation
            staggerChildren: 0.07
        }
    }
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const errorVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 2, height: 0, transition: { duration: 0.2, ease: 'easeIn' } }
};

// --- Component ---
const UpdateProductPage = () => {
    const context = useContext(myContext);
    const { loading: pageLoading, setLoading: setPageLoading, getAllProductFunction } = context;
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState({
        title: "", price: "", productImageUrl: "", category: "", categoryId: "",
        categoryColor: "", description: "", quantity: 1, featured: false, trending: false,
        time: Timestamp.now(), date: new Date().toISOString(),
    });
    const [imagePreview, setImagePreview] = useState("");
    const [formErrors, setFormErrors] = useState({});

    // --- Fetch Product Data ---
    useEffect(() => {
        const getSingleProductFunction = async () => {
            setPageLoading(true);
            try {
                const productDocRef = doc(fireDB, "products", id);
                const productSnap = await getDoc(productDocRef);

                if (productSnap.exists()) {
                    const productData = productSnap.data();
                    const categoryData = categoryList.find(cat =>
                        cat.id === productData.categoryId ||
                        cat.name.toLowerCase() === productData.category?.toLowerCase()
                    );

                    setProduct({
                        title: productData.title || "",
                        price: productData.price || "",
                        productImageUrl: productData.productImageUrl || "",
                        category: categoryData?.name || productData.category || "",
                        categoryId: categoryData?.id || productData.categoryId || "",
                        categoryColor: categoryData?.color || productData.categoryColor || "#6b7280",
                        description: productData.description || "",
                        quantity: productData.quantity !== undefined ? productData.quantity : 1,
                        featured: productData.featured || false,
                        trending: productData.trending || false,
                        time: productData.time || Timestamp.now(),
                        date: productData.date || new Date().toISOString(),
                    });
                    setImagePreview(productData.productImageUrl || "");
                } else {
                    toast.error("Product not found.");
                    navigate('/admin-dashboard');
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product details.");
                navigate('/admin-dashboard');
            } finally {
                setPageLoading(false);
            }
        };

        if (id) {
            getSingleProductFunction();
        } else {
            toast.error("No product ID provided.");
            navigate('/admin-dashboard');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, setPageLoading, navigate]);

    // --- Input Handlers ---
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : (name === 'quantity' ? parseInt(value, 10) || 0 : value);
        setProduct(prev => ({ ...prev, [name]: val }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleImageChange = (e) => {
        const url = e.target.value;
        setProduct({ ...product, productImageUrl: url });
        setImagePreview(url);
        if (formErrors.productImageUrl) setFormErrors(prev => ({ ...prev, productImageUrl: null }));
    };

    const handleCategoryChange = (e) => {
        const selectedId = e.target.value;
        const selectedCategory = categoryList.find(cat => cat.id === selectedId);
        if (selectedCategory) {
            setProduct({ ...product, category: selectedCategory.name, categoryId: selectedCategory.id, categoryColor: selectedCategory.color });
            if (formErrors.categoryId) setFormErrors(prev => ({ ...prev, categoryId: null }));
        }
    };

    // --- Form Validation ---
    const validateForm = () => {
        const errors = {};
        if (!product.title.trim()) errors.title = "Product title is required";
        if (product.price === "" || product.price === null) errors.price = "Product price is required";
        else if (isNaN(product.price) || Number(product.price) < 0) errors.price = "Please enter a valid positive price";
        if (!product.productImageUrl.trim()) errors.productImageUrl = "Image URL is required";
        else if (!/^(https?:\/\/).*/i.test(product.productImageUrl)) errors.productImageUrl = "Please enter a valid URL starting with http:// or https://";
        if (!product.categoryId) errors.categoryId = "Please select a category";
        if (!product.description.trim()) errors.description = "Product description is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // --- Update Product Function ---
    const updateProduct = async () => {
        if (!validateForm()) {
            toast.error("Please fix the errors in the form.");
            return;
        }
        setIsUpdating(true);
        setPageLoading(true);

        const productDataToUpdate = {
            ...product,
            price: Number(product.price),
            quantity: Number(product.quantity),
            time: Timestamp.now(),
        };

        try {
            await setDoc(doc(fireDB, 'products', id), productDataToUpdate);
            toast.success("Product updated successfully!");
            await getAllProductFunction();
            navigate('/admin-dashboard');
        } catch (error) {
            console.error("Update error:", error);
            toast.error(`Failed to update product: ${error.message}`);
        } finally {
            setIsUpdating(false);
            setPageLoading(false);
        }
    };

    // Memoize selected category details
    const selectedCategoryDetails = useMemo(() => {
        return categoryList.find(cat => cat.id === product.categoryId);
    }, [product.categoryId]);

    // --- JSX Structure ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-4 md:p-8 text-gray-200 font-sans">
            {/* Loading Overlay */}
            <AnimatePresence>
                {pageLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"> <Loader /> </motion.div>
                )}
            </AnimatePresence>
            {/* Toast Container */}
             <Toaster position="top-center" reverseOrder={false} toastOptions={{
                 className: '', style: { background: '#333', color: '#fff' },
             }}/>

            <motion.div
                className="max-w-3xl mx-auto"
                variants={pageContainerVariants} initial="hidden" animate="visible"
            >
                <motion.div
                    variants={cardVariants}
                    className="bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-5 px-6">
                        <div className="flex items-center justify-between">
                            <motion.button
                                onClick={() => navigate('/admin-dashboard')}
                                className="flex items-center text-indigo-100 hover:text-white transition-colors duration-200 text-sm"
                                whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}
                            > <FiArrowLeft className="mr-1.5 h-4 w-4" /> Back </motion.button>
                            <h2 className="text-xl font-bold text-white"> Update Product </h2>
                            <div className="w-16"></div> {/* Spacer */}
                        </div>
                    </div>

                    {/* Form */}
                    <motion.div className="p-6 md:p-8 space-y-6" variants={formContainerVariants} initial="hidden" animate="visible">

                        {/* Product Title */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1.5"> Product Title <span className="text-red-400">*</span> </label>
                            <div className="relative">
                                <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                <input type="text" id="title" name="title" value={product.title} onChange={handleInputChange} placeholder="Enter product title" required
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out placeholder-gray-500 bg-gray-800/50 text-gray-100 ${ formErrors.title ? 'border-red-500/50 ring-1 ring-red-500/50' : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50' }`}
                                    aria-invalid={!!formErrors.title} aria-describedby={formErrors.title ? "title-error" : undefined}
                                />
                            </div>
                            <AnimatePresence> {formErrors.title && <motion.p id="title-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="hidden">{formErrors.title}</motion.p>} </AnimatePresence>
                        </motion.div>

                        {/* Price, Category, Quantity Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Price */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1.5"> Price (₹) <span className="text-red-400">*</span> </label>
                                <div className="relative">
                                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <input type="number" id="price" name="price" value={product.price} onChange={handleInputChange} placeholder="0.00" min="0" step="0.01" required
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out placeholder-gray-500 bg-gray-800/50 text-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${ formErrors.price ? 'border-red-500/50 ring-1 ring-red-500/50' : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50' }`}
                                        aria-invalid={!!formErrors.price} aria-describedby={formErrors.price ? "price-error" : undefined}
                                    />
                                </div>
                                <AnimatePresence> {formErrors.price && <motion.p id="price-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="hidden">{formErrors.price}</motion.p>} </AnimatePresence>
                            </motion.div>
                            {/* Category */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1.5"> Category <span className="text-red-400">*</span> </label>
                                <div className="relative">
                                    {selectedCategoryDetails?.icon && ( <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none">{selectedCategoryDetails.icon}</span> )}
                                    <select id="category" value={product.categoryId} onChange={handleCategoryChange} required
                                        className={`w-full ${selectedCategoryDetails?.icon ? 'pl-10' : 'pl-4'} pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out bg-gray-800/50 text-gray-100 appearance-none cursor-pointer ${ formErrors.categoryId ? 'border-red-500/50 ring-1 ring-red-500/50' : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50' }`}
                                        aria-invalid={!!formErrors.categoryId} aria-describedby={formErrors.categoryId ? "category-error" : undefined}
                                    >
                                        <option value="" disabled className="text-gray-500">Select category...</option>
                                        {categoryList.map((item) => ( <option key={item.id} value={item.id} className="bg-gray-900"> {item.icon} {item.name} </option> ))}
                                    </select>
                                     <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                                 <AnimatePresence> {formErrors.categoryId && <motion.p id="category-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="hidden">{formErrors.categoryId}</motion.p>} </AnimatePresence>
                            </motion.div>
                             {/* Quantity */}
                             <motion.div variants={itemVariants}>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1.5"> Quantity <span className="text-red-400">*</span> </label>
                                <div className="relative">
                                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <input type="number" id="quantity" name="quantity" value={product.quantity} onChange={handleInputChange} placeholder="0" min="0" step="1" required
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out placeholder-gray-500 bg-gray-800/50 text-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${ formErrors.quantity ? 'border-red-500/50 ring-1 ring-red-500/50' : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50' }`}
                                        aria-invalid={!!formErrors.quantity} aria-describedby={formErrors.quantity ? "quantity-error" : undefined}
                                    />
                                </div>
                                <AnimatePresence> {formErrors.quantity && <motion.p id="quantity-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="hidden">{formErrors.quantity}</motion.p>} </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* Featured/Trending Toggles */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-2">
                             <div className="flex items-center">
                                <input type="checkbox" id="featured" name="featured" checked={product.featured} onChange={handleInputChange} className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-500 rounded bg-gray-700 cursor-pointer accent-indigo-500" />
                                <label htmlFor="featured" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                                    <FiStar className="inline mr-1 text-yellow-400 mb-0.5" size={14}/> Featured Product
                                </label>
                             </div>
                             <div className="flex items-center">
                                <input type="checkbox" id="trending" name="trending" checked={product.trending} onChange={handleInputChange} className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-500 rounded bg-gray-700 cursor-pointer accent-indigo-500" />
                                <label htmlFor="trending" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                                    <FiTrendingUp className="inline mr-1 text-green-400 mb-0.5" size={14}/> Trending Product
                                </label>
                             </div>
                        </motion.div>

                        {/* Image URL & Preview */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="productImageUrl" className="block text-sm font-medium text-gray-300 mb-1.5"> Image URL <span className="text-red-400">*</span> </label>
                            <div className="relative">
                                <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                <input type="url" id="productImageUrl" name="productImageUrl" value={product.productImageUrl} onChange={handleImageChange} placeholder="https://example.com/image.jpg" required
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out placeholder-gray-500 bg-gray-800/50 text-gray-100 ${ formErrors.productImageUrl ? 'border-red-500/50 ring-1 ring-red-500/50' : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50' }`}
                                    aria-invalid={!!formErrors.productImageUrl} aria-describedby={formErrors.productImageUrl ? "imageUrl-error" : undefined}
                                />
                            </div>
                             <AnimatePresence> {formErrors.productImageUrl && <motion.p id="imageUrl-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="hidden">{formErrors.productImageUrl}</motion.p>} </AnimatePresence>
                            {/* Image Preview */}
                            <AnimatePresence>
                            {imagePreview && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 overflow-hidden"
                                >
                                    <p className="text-xs text-gray-400 mb-1">Preview:</p>
                                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-600 bg-gray-700" onError={() => setImagePreview("")} />
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Description */}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1.5"> Description <span className="text-red-400">*</span> </label>
                            <div className="relative">
                                <FiAlignLeft className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                <textarea id="description" name="description" value={product.description} onChange={handleInputChange} placeholder="Enter detailed product description..." rows="5" required
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out placeholder-gray-500 bg-gray-800/50 text-gray-100 ${ formErrors.description ? 'border-red-500/50 ring-1 ring-red-500/50' : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50' }`}
                                    aria-invalid={!!formErrors.description} aria-describedby={formErrors.description ? "description-error" : undefined}
                                />
                            </div>
                             <AnimatePresence> {formErrors.description && <motion.p id="description-error" className="mt-1.5 text-xs text-red-400" variants={errorVariants} initial="hidden" animate="visible" exit="hidden">{formErrors.description}</motion.p>} </AnimatePresence>
                        </motion.div>

                        {/* Buttons */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                             <motion.button
                                type="button" onClick={() => navigate('/admin-dashboard')}
                                className="px-6 py-2.5 border border-gray-600 text-gray-300 bg-gray-700/50 rounded-lg font-medium hover:bg-gray-700 transition duration-200 text-sm"
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                disabled={isUpdating}
                            > Cancel </motion.button>
                            <motion.button
                                type="button" onClick={updateProduct} disabled={isUpdating || pageLoading}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 text-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                whileHover={!isUpdating ? { scale: 1.03, filter: 'brightness(1.1)' } : {}}
                                whileTap={!isUpdating ? { scale: 0.97 } : {}}
                            >
                                {isUpdating ? (
                                    <> <FiLoader className="animate-spin mr-2 h-4 w-4" /> Updating... </>
                                ) : (
                                    <> <FiSave className="mr-2 h-4 w-4" /> Update Product </>
                                )}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default UpdateProductPage;