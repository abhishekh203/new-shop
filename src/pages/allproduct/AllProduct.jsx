import { useNavigate } from "react-router";
import Layout from "../../components/layout/Layout";
import { useContext, useEffect } from "react";
import myContext from "../../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";

const AllProduct = () => {
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
        <Layout>
            <div className="py-8 bg-gradient-to-r from-black to-blue-800 min-h-screen">
                <div className="mb-8">
                    <h1 className="text-center text-3xl font-semibold text-white">All Products</h1>
                </div>

                <section className="text-gray-600 body-font">
                    <div className="container px-5 lg:px-0 py-5 mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getAllProduct.map((item, index) => {
                                const { id, title, price, productImageUrl } = item;
                                return (
                                    <div key={index} className="border border-gray-300 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 bg-white">
                                        <img
                                            onClick={() => navigate(`/productinfo/${id}`)}
                                            className="h-64 w-full object-cover cursor-pointer transition-opacity duration-300 hover:opacity-80"
                                            src={productImageUrl}
                                            alt={title}
                                        />
                                        <div className="p-6">
                                            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">Digital Shop Nepal</h2>
                                            <h1 className="title-font text-lg font-medium text-gray-900 mb-3">{title.length > 50 ? `${title.substring(0, 25)}...` : title}</h1>
                                            <h1 className="title-font text-lg font-medium text-gray-900 mb-3">₹{price}</h1>
                                            <div className="flex justify-center">
                                                {cartItems.some((p) => p.id === item.id) ? (
                                                    <button
                                                        onClick={() => deleteCart(item)}
                                                        className="bg-red-600 hover:bg-red-700 w-full text-white py-2 rounded-lg font-bold transition-colors duration-300">
                                                        Remove from Cart
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => addCart(item)}
                                                        className="bg-blue-600 hover:bg-blue-700 w-full text-white py-2 rounded-lg font-bold transition-colors duration-300">
                                                        Add to Cart
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default AllProduct;
