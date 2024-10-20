import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import myContext from "../../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";

const HomePageProductCard = () => {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { getAllProduct } = context;

    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    // State to handle the number of products displayed
    const [productsToShow, setProductsToShow] = useState(32);

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart");
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Removed from cart");
    };

    useEffect(() => {
        // Optionally filter out nulls before saving to localStorage
        const filteredCart = cartItems.filter(item => item !== null);
        localStorage.setItem("cart", JSON.stringify(filteredCart));
    }, [cartItems]);

    // Function to load more products
    const handleShowMore = () => {
        setProductsToShow(productsToShow + 16); // Load 16 more products
    };

    // Function to show less products
    const handleShowLess = () => {
        setProductsToShow(32); // Reset to initial 20 products
    };

    return (
        <div className=" bg-gradient-to-br from-black to-blue-800 min-h-screen">
            {/* Main section */}
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-5 mx-auto">
                    {/* Responsive Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 -m-5">
                        {getAllProduct.slice(0, productsToShow).map((item, index) => {
                            const { id, title, price, productImageUrl } = item;
                            return (
                                <div key={index} className="p-2 w-full">
                                    <div className="h-full border border-gray-300 rounded-xl overflow-hidden shadow-lg transition-transform transform hover:scale-100 hover:shadow-xl cursor-pointer bg-gradient-to-br from-blue-900 via-black to-blue-700">
                                        <img
                                            onClick={() => navigate(`/productinfo/${id}`)}
                                            className="lg:h-72 h-60 w-full object-cover transition-transform transform hover:scale-105"
                                            src={productImageUrl}
                                            alt={title}
                                        />
                                        <div className="p-4">
                                            <h2 className="tracking-widest text-xs sm:text-sm title-font font-medium text-gray-400 mb-1">
                                                Digital Shop Nepal
                                            </h2>
                                            <h1 className="title-font text-sm sm:text-base font-medium text-gray-100 mb-2">
                                                {title.substring(0, 40)}
                                            </h1>
                                            <h1 className="title-font text-sm sm:text-base font-medium text-gray-100 mb-2">
                                                ₹{price}
                                            </h1>

                                            <div className="flex justify-center">
                                                {cartItems.some((p) => p && p.id === item.id) ? (
                                                    <button
                                                        onClick={() => deleteCart(item)}
                                                        className="bg-red-500 hover:bg-red-600 w-full text-white py-1 sm:py-2 rounded-lg font-bold transition duration-300"
                                                    >
                                                        Remove from Cart
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => addCart(item)}
                                                        className="bg-blue-500 hover:bg-blue-600 w-full text-white py-1 sm:py-2 rounded-lg font-bold transition duration-300"
                                                    >
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

                    {/* Conditional Rendering for See More and See Less */}
                    <div className="flex justify-center mt-6">
                        {productsToShow < getAllProduct.length ? (
                            <button
                                onClick={handleShowMore}
                                className="bg-red-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg font-bold transition duration-300"
                            >
                                See More
                            </button>
                        ) : (
                            <button
                                onClick={handleShowLess}
                                className="bg-red-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg font-bold transition duration-300"
                            >
                                See Less
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePageProductCard;
