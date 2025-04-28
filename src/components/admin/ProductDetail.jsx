import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import Loader from "../loader/Loader";
import { deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2, FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";

const ProductDetail = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllProduct, getAllProductFunction } = context;
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [showFilters, setShowFilters] = useState(false);

    const navigate = useNavigate();

    const toggleExpand = (productId) => {
        setExpandedProduct(expandedProduct === productId ? null : productId);
    };

    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;
        
        setLoading(true);
        try {
            await deleteDoc(doc(fireDB, 'products', id));
            toast.success('Product deleted successfully');
            getAllProductFunction();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete product');
        } finally {
            setLoading(false);
        }
    };

    const filterProductsBySearch = (products) => {
        if (!searchQuery) return products;
        const query = searchQuery.toLowerCase();
        return products.filter(product => 
            product.title.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.id.toLowerCase().includes(query)
        );
    };

    const filterProductsByCategory = (products) => {
        if (categoryFilter === "all") return products;
        return products.filter(product => product.category === categoryFilter);
    };

    const filterProductsByPrice = (products) => {
        if (!priceRange.min && !priceRange.max) return products;
        
        const min = priceRange.min ? Number(priceRange.min) : 0;
        const max = priceRange.max ? Number(priceRange.max) : Infinity;
        
        return products.filter(product => product.price >= min && product.price <= max);
    };

    const filteredProducts = filterProductsByPrice(
        filterProductsByCategory(
            filterProductsBySearch(getAllProduct)
        )
    );

    const uniqueCategories = [...new Set(getAllProduct.map(product => product.category))];

    return (
        <div className="min-h-screen bg-gray-50 p-2 md:p-8">
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <Loader />
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-800">Products</h1>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-2 bg-white rounded-lg shadow"
                    >
                        <FiSearch className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                        Products
                    </h1>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full md:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        
                        <select
                            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full md:w-48"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {uniqueCategories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        
                        <div className="flex items-center space-x-2 w-full md:w-auto">
                            <input
                                type="number"
                                placeholder="Min ₹"
                                className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-20"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="number"
                                placeholder="Max ₹"
                                className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-20"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Mobile Filters */}
                {showFilters && (
                    <div className="md:hidden bg-white p-4 rounded-lg shadow-md mb-4">
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            
                            <select
                                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {uniqueCategories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    placeholder="Min ₹"
                                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex-1"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="number"
                                    placeholder="Max ₹"
                                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex-1"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((item, index) => {
                                        const { id, title, price, category, date, productImageUrl, description } = item;
                                        return (
                                            <>
                                                <tr 
                                                    key={id} 
                                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                    onClick={() => toggleExpand(id)}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img 
                                                                className="h-10 w-10 rounded-md object-cover" 
                                                                src={productImageUrl || '/placeholder-product.png'} 
                                                                alt={title} 
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/placeholder-product.png';
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                                            {title}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        ₹{price.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                        {category}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/updateproduct/${id}`);
                                                                }}
                                                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <FiEdit className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteProduct(id);
                                                                }}
                                                                className="text-red-600 hover:text-red-900 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <FiTrash2 className="h-5 w-5" />
                                                            </button>
                                                            <span className="text-gray-400">
                                                                {expandedProduct === id ? (
                                                                    <FiChevronUp className="h-5 w-5" />
                                                                ) : (
                                                                    <FiChevronDown className="h-5 w-5" />
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                
                                                {expandedProduct === id && (
                                                    <tr className="bg-gray-50">
                                                        <td colSpan="7" className="px-6 py-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                <div className="col-span-1">
                                                                    <div className="flex justify-center">
                                                                        <img 
                                                                            className="h-48 w-48 rounded-lg object-cover border border-gray-200" 
                                                                            src={productImageUrl || '/placeholder-product.png'} 
                                                                            alt={title}
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = '/placeholder-product.png';
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-span-1 md:col-span-2">
                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <h4 className="text-sm font-medium text-gray-500">Product ID</h4>
                                                                            <p className="text-sm text-gray-900">{id}</p>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="text-sm font-medium text-gray-500">Description</h4>
                                                                            <p className="text-sm text-gray-900">{description || "No description available"}</p>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div>
                                                                                <h4 className="text-sm font-medium text-gray-500">Created Date</h4>
                                                                                <p className="text-sm text-gray-900">{new Date(date).toLocaleString()}</p>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="text-sm font-medium text-gray-500">Stock Status</h4>
                                                                                <p className="text-sm text-gray-900">{item.quantity > 0 ? "In Stock" : "Out of Stock"}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="pt-4 border-t border-gray-200">
                                                                            <button
                                                                                onClick={() => navigate(`/updateproduct/${id}`)}
                                                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                            >
                                                                                <FiEdit className="mr-2 h-4 w-4" />
                                                                                Edit Product Details
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No products found matching your filters
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Product List */}
                <div className="md:hidden space-y-3">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item, index) => {
                            const { id, title, price, category, date, productImageUrl } = item;
                            return (
                                <div 
                                    key={id} 
                                    className="bg-white p-3 rounded-lg shadow-md"
                                    onClick={() => toggleExpand(id)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 h-16 w-16">
                                            <img 
                                                className="h-16 w-16 rounded-md object-cover" 
                                                src={productImageUrl || '/placeholder-product.png'} 
                                                alt={title} 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder-product.png';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                                            <p className="text-sm text-gray-500">₹{price.toLocaleString()}</p>
                                            <p className="text-xs text-gray-400 capitalize">{category}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="text-xs text-gray-500">
                                                {new Date(date).toLocaleDateString()}
                                            </div>
                                            <div className="flex space-x-2 mt-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/updateproduct/${id}`);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteProduct(id);
                                                    }}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {expandedProduct === id && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500">Description</p>
                                                    <p className="text-xs text-gray-900">{item.description || "No description available"}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">Product ID</p>
                                                        <p className="text-xs text-gray-900 truncate">{id}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">Stock</p>
                                                        <p className="text-xs text-gray-900">{item.quantity > 0 ? "In Stock" : "Out of Stock"}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/updateproduct/${id}`)}
                                                    className="w-full mt-2 flex items-center justify-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    <FiEdit className="mr-1 h-3 w-3" />
                                                    Edit Product
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white p-4 rounded-lg shadow-md text-center text-sm text-gray-500">
                            No products found matching your filters
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;