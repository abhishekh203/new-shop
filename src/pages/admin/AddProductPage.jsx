import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { fireDB } from "../../firebase/FirebaseConfig";
import { useNavigate } from "react-router";
import Loader from "../../components/loader/Loader";
import { FiImage, FiDollarSign, FiTag, FiAlignLeft, FiStar, FiTrendingUp } from "react-icons/fi";

const categoryList = [
  { 
    id: 'netflix',
    name: 'Netflix', 
    icon: '🎬',
    color: '#E50914'
  },
  { 
    id: 'ott',
    name: 'OTT', 
    icon: '📺',
    color: '#00A859'
  },
  { 
    id: 'streaming',
    name: 'Streaming', 
    icon: '📡',
    color: '#1DA1F2'
  },
  { 
    id: 'music',
    name: 'Music', 
    icon: '🎵',
    color: '#1DB954'
  },
  { 
    id: 'software',
    name: 'Software', 
    icon: '💻',
    color: '#6E5494'
  },
  { 
    id: 'games',
    name: 'Games', 
    icon: '🎮',
    color: '#FF73FA'
  },
  { 
    id: 'movies',
    name: 'Movies', 
    icon: '🎥',
    color: '#FFC107'
  },
  { 
    id: 'bundle',
    name: 'Bundle', 
    icon: '🎁',
    color: '#FF7043'
  },
  { 
    id: 'education',
    name: 'Education', 
    icon: '📚',
    color: '#2196F3'
  },
  { 
    id: 'vpn',
    name: 'VPN', 
    icon: '🔒',
    color: '#607D8B'
  },
  { 
    id: 'ai-tools',
    name: 'AI Tools', 
    icon: '🤖',
    color: '#00BFA5'
  },
  { 
    id: 'special-offers',
    name: 'Special Offers', 
    icon: '🔥',
    color: '#FFD600'
  },
  { 
    id: 'antivirus',
    name: 'Antivirus', 
    icon: '🛡️',
    color: '#F44336'
  },
  { 
    id: 'gift-cards',
    name: 'Gift Cards', 
    icon: '💳',
    color: '#64B5F6'
  }
];

const AddProductPage = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        title: "",
        price: "",
        productImageUrl: "",
        category: "",
        categoryId: "",
        categoryColor: "",
        description: "",
        quantity: 1,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
        featured: false,
        trending: false
    });

    const [imagePreview, setImagePreview] = useState("");

    const handleImageChange = (e) => {
        const url = e.target.value;
        setProduct({ ...product, productImageUrl: url });
        setImagePreview(url);
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = categoryList.find(cat => cat.id === e.target.value);
        if (!selectedCategory) {
            toast.error("Invalid category selected");
            return;
        }
        setProduct({ 
            ...product, 
            category: selectedCategory.name,
            categoryId: selectedCategory.id,
            categoryColor: selectedCategory.color
        });
    };

    const validateForm = () => {
        if (!product.title.trim()) {
            toast.error("Product title is required");
            return false;
        }
        if (!product.price) {
            toast.error("Product price is required");
            return false;
        }
        if (isNaN(product.price) || Number(product.price) <= 0) {
            toast.error("Please enter a valid price");
            return false;
        }
        if (!product.productImageUrl.trim()) {
            toast.error("Product image URL is required");
            return false;
        }
        if (!product.categoryId) {
            toast.error("Please select a category");
            return false;
        }
        if (!product.description.trim()) {
            toast.error("Product description is required");
            return false;
        }
        return true;
    };

    const addProductFunction = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const productRef = collection(fireDB, 'products');
            await addDoc(productRef, product);
            toast.success("Product added successfully");
            navigate('/admin-dashboard');
        } catch (error) {
            console.error("Add product error:", error);
            toast.error(`Failed to add product: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {loading && <Loader />}
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-6 px-6">
                        <h2 className="text-3xl font-bold text-white text-center">
                            Add New Product
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Product Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Title <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiTag className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={product.title}
                                    onChange={(e) => setProduct({ ...product, title: e.target.value })}
                                    placeholder="Enter product title"
                                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Price and Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price ($) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiDollarSign className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        value={product.price}
                                        onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={product.categoryId}
                                    onChange={handleCategoryChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categoryList.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.icon} {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Featured/Trending Toggles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={product.featured}
                                    onChange={(e) => setProduct({ ...product, featured: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    <FiStar className="inline mr-1 text-yellow-500" />
                                    Featured Product
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={product.trending}
                                    onChange={(e) => setProduct({ ...product, trending: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    <FiTrendingUp className="inline mr-1 text-green-500" />
                                    Trending Product
                                </label>
                            </div>
                        </div>

                        {/* Image URL and Preview */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image URL <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiImage className="text-gray-400" />
                                </div>
                                <input
                                    type="url"
                                    value={product.productImageUrl}
                                    onChange={handleImageChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            {imagePreview && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                                    <div className="border rounded-lg overflow-hidden max-w-xs">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-full h-auto object-cover"
                                            onError={() => setImagePreview("")}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                    <FiAlignLeft className="text-gray-400" />
                                </div>
                                <textarea
                                    value={product.description}
                                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                    placeholder="Enter detailed product description..."
                                    rows="5"
                                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                            <button
                                onClick={() => navigate('/admin-dashboard')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addProductFunction}
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Adding...' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;