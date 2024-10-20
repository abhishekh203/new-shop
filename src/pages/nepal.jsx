import { useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import myContext from "../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, deleteFromCart } from "../redux/cartSlice";
import { TextField } from "@mui/material";

const Nepal = () => {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { getAllProduct } = context;
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart");
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Removed from cart");
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <div className="py-12 bg-gradient-to-br from-black via-blue-900 to-blue-800 min-h-screen">
            <div className="mb-2">
    <h1 className="text-center text-4xl font-bold text-white tracking-wide">Check below!</h1>
    <p className="text-center text-gray-300 mt-2 text-sm">Add any subscription to your Cart to proceed with the purchase.</p>
</div>


            <section className="text-gray-600 body-font">
                <div className="container mx-auto px-5 lg:px-0 py-10">
                    {/* 1-column layout for small screens, 2-column for larger screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {getAllProduct.map((item, index) => {
                            const { id, title, price, productImageUrl, description } = item;
                            return (
                                <div key={index} className="border border-gray-700 rounded-lg overflow-hidden shadow-lg bg-gray-900 hover:bg-gray-800 transition-all duration-300">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Left Column: Product Image */}
                                        <div className="lg:h-full relative">
                                            <img
                                                onClick={() => navigate(`/productinfo/${id}`)}
                                                className="h-64 lg:h-full w-full object-cover cursor-pointer transition-opacity duration-300 hover:opacity-75"
                                                src={productImageUrl}
                                                alt={title}
                                            />
                                            <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1 text-xs font-medium text-white rounded">Click on the image to view in Details.</div>
                                        </div>

                                        {/* Right Column: Product Details */}
                                        <div className="p-6 flex flex-col justify-between">
                                            <div>
                                                <h2 className="tracking-widest text-xs title-font font-medium text-blue-400 mb-1">Digital Shop Nepal</h2>
                                                <h1 className="title-font text-xl font-semibold text-white mb-3">
                                                    {title.length > 25 ? `${title.substring(0, 25)}...` : title}
                                                </h1>
                                                <h1 className="title-font text-2xl font-bold text-white mb-3">₹{price}</h1>

                                                {/* Product Description */}
                                                <div className="mb-6">
                                                    <h3 className="text-lg font-semibold text-white mb-2">Description:</h3>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        value={description || "No description available."}
                                                        variant="outlined"
                                                        inputProps={{
                                                            readOnly: true,
                                                            style: {
                                                                fontFamily: 'monospace',
                                                                whiteSpace: 'pre-line',
                                                                color: 'gray',
                                                            },
                                                        }}
                                                        rows={4}
                                                        className="bg-gray-800 rounded-lg p-3 shadow-lg text-gray-400"
                                                    />
                                                </div>
                                            </div>
                                     
                                            {/* Add to Cart / Remove from Cart Button */}
                                            <div className="mt-4">
                                                {cartItems.some((p) => p.id === item.id) ? (
                                                    <button
                                                        onClick={() => deleteCart(item)}
                                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold transition-colors duration-300">
                                                        Remove from Cart
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => addCart(item)}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition-colors duration-300">
                                                        Add to Cart
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Nepal;
