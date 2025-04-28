import { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import { useParams, useNavigate } from "react-router-dom";
import { fireDB } from "../../firebase/FirebaseConfig";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { 
  TextField, 
  Rating, 
  Button, 
  Chip, 
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { 
  AddShoppingCart, 
  RemoveShoppingCart, 
  Favorite, 
  FavoriteBorder,
  Share,
  ArrowBack
} from "@mui/icons-material";

const ProductInfo = () => {
    const context = useContext(myContext);
    const { loading, setLoading, user } = context;
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [shareLink, setShareLink] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [reviewCount, setReviewCount] = useState(107); // Changed from hardcoded 24 to 107

    const getProductData = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const productDoc = await getDoc(doc(fireDB, "products", id));
            if (productDoc.exists()) {
                setProduct({ id: productDoc.id, ...productDoc.data() });
                setShareLink(`${window.location.origin}/productinfo/${id}`);
            } else {
                toast.error("Product not found");
                navigate("/");
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Failed to load product");
        }
        setLoading(false);
    };

    const addCart = async (item) => {
        dispatch(addToCart({...item, quantity}));
        toast.success(`Added ${quantity} ${item.title} to cart`);
        
        // Update view count in Firebase
        try {
            await updateDoc(doc(fireDB, "products", id), {
                views: increment(1)
            });
        } catch (error) {
            console.error("Error updating view count:", error);
        }
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Removed from cart");
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast.success(!isFavorite ? "Added to favorites" : "Removed from favorites");
    };

    const handleShare = () => {
        setOpenShareDialog(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        toast.success("Link copied to clipboard!");
        setOpenShareDialog(false);
    };

    const handleBuyNow = (item) => {
        dispatch(addToCart({...item, quantity}));
        toast.success(`Added ${quantity} ${item.title} to cart`);
        navigate("/cart"); // Redirect to cart page
    };

    useEffect(() => {
        getProductData();
    }, [id]);

    return (
        <Layout>
            <section className="py-8 lg:py-16 bg-gradient-to-b from-gray-900 to-black min-h-screen">
                {loading ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <Loader />
                    </div>
                ) : product ? (
                    <div className="max-w-7xl px-4 mx-auto">
                        <Button 
                            startIcon={<ArrowBack />}
                            onClick={() => navigate(-1)}
                            className="mb-6 text-white"
                        >
                            Back to Products
                        </Button>

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Product Image Gallery */}
                            <div className="w-full lg:w-1/2">
                                <div className="relative bg-gray-800 rounded-2xl shadow-2xl p-6">
                                    <img
                                        className="w-full h-auto max-h-[60vh] object-contain rounded-xl"
                                        src={product?.productImageUrl}
                                        alt={product?.title}
                                    />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <IconButton 
                                            onClick={toggleFavorite}
                                            className="bg-gray-700 hover:bg-gray-600"
                                        >
                                            {isFavorite ? 
                                                <Favorite className="text-red-500" /> : 
                                                <FavoriteBorder className="text-white" />
                                            }
                                        </IconButton>
                                        <IconButton 
                                            onClick={handleShare}
                                            className="bg-gray-700 hover:bg-gray-600"
                                        >
                                            <Share className="text-white" />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Product Info */}
                            <div className="w-full lg:w-1/2">
                                <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h1 className="text-3xl font-bold text-white">
                                            {product?.title}
                                        </h1>
                                        <Chip 
                                            label={`${product?.category}`}
                                            color="primary"
                                            className="bg-blue-600 text-white"
                                        />
                                    </div>

                                    {/* Rating & Price */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center">
                                            <Rating 
                                                value={4.5} 
                                                precision={0.5} 
                                                readOnly 
                                                className="mr-2"
                                            />
                                            <span className="text-gray-300">({reviewCount} reviews)</span> {/* Updated to use reviewCount state */}
                                        </div>
                                        <div className="text-right">
                                            {product?.oldPrice && (
                                                <span className="text-gray-400 line-through mr-2">
                                                    रु{product.oldPrice}
                                                </span>
                                            )}
                                            <span className="text-2xl font-bold text-white">
                                                रु{product?.price}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Quantity Selector */}
                                    <div className="mb-6">
                                        <label className="block text-gray-300 mb-2">Quantity:</label>
                                        <div className="flex items-center gap-4">
                                            <Button 
                                                variant="contained" 
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                                className="min-w-0 w-10 h-10"
                                            >
                                                -
                                            </Button>
                                            <span className="text-xl text-white px-4">{quantity}</span>
                                            <Button 
                                                variant="contained" 
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="min-w-0 w-10 h-10"
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Product Description */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-white mb-4">
                                            Product Details
                                        </h3>
                                        <TextField
                                            fullWidth
                                            multiline
                                            value={product?.description}
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: true,
                                                style: {
                                                    color: 'lightgray',
                                                    backgroundColor: 'rgba(31, 41, 55, 0.5)',
                                                    borderRadius: '12px',
                                                    padding: '16px'
                                                },
                                            }}
                                            rows={6}
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {cartItems.some((p) => p.id === product?.id) ? (
                                            <Button
                                                startIcon={<RemoveShoppingCart />}
                                                onClick={() => deleteCart(product)}
                                                variant="contained"
                                                color="error"
                                                className="w-full py-3 rounded-xl"
                                            >
                                                Remove from Cart
                                            </Button>
                                        ) : (
                                            <Button
                                                startIcon={<AddShoppingCart />}
                                                onClick={() => addCart(product)}
                                                variant="contained"
                                                color="success"
                                                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-700"
                                            >
                                                Add to Cart ({quantity})
                                            </Button>
                                        )}
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            className="w-full py-3 rounded-xl text-white border-white hover:border-blue-400"
                                            onClick={() => handleBuyNow(product)} // Added onClick handler
                                        >
                                            Buy Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Section */}
                        <div className="mt-12 bg-gray-800 rounded-2xl shadow-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Additional Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Specifications</h3>
                                    <ul className="space-y-2 text-gray-400">
                                        <li><strong>Category:</strong> {product?.category}</li>
                                        <li><strong>Brand:</strong> {product?.brand || "Generic"}</li>
                                        <li><strong>Stock:</strong> {product?.quantity > 0 ? "In Stock" : "Out of Stock"}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Shipping Info</h3>
                                    <ul className="space-y-2 text-gray-400">
                                        <li><strong>Delivery:</strong> 1-30 minutes</li>
                                        <li><strong>Returns:</strong> Replacement policy only</li>
                                        <li><strong>Support:</strong> 24/7 customer service</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center min-h-screen text-white">
                        <p>Product not found.</p>
                    </div>
                )}

                {/* Share Dialog */}
                <Dialog open={openShareDialog} onClose={() => setOpenShareDialog(false)}>
                    <DialogTitle className="bg-gray-800 text-white">Share Product</DialogTitle>
                    <DialogContent className="bg-gray-800">
                        <TextField
                            fullWidth
                            value={shareLink}
                            InputProps={{
                                readOnly: true,
                                className: "text-white bg-gray-700"
                            }}
                            className="mt-4"
                        />
                    </DialogContent>
                    <DialogActions className="bg-gray-800">
                        <Button onClick={() => setOpenShareDialog(false)} className="text-white">
                            Cancel
                        </Button>
                        <Button 
                            onClick={copyToClipboard}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Copy Link
                        </Button>
                    </DialogActions>
                </Dialog>
            </section>
        </Layout>
    );
};

export default ProductInfo;