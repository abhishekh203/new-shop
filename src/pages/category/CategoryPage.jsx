import { useNavigate, useParams } from "react-router";
import Layout from "../../components/layout/Layout";
import { useContext, useEffect } from "react";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";

const CategoryPage = () => {
    const { categoryname } = useParams();
    const context = useContext(myContext);
    const { getAllProduct, loading } = context;

    const navigate = useNavigate();

    const filterProduct = getAllProduct.filter((obj) => obj.category.includes(categoryname))

    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart");
    }

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Removed from cart");
    }

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <Layout>
            <div className="mt-10">
                {/* Heading */}
                <div className="">
                    <h1 className="text-center mb-5 text-2xl font-semibold capitalize">{categoryname}</h1>
                </div>

                {/* Main */}
                {loading ? (
                    <div className="flex justify-center">
                        <Loader />
                    </div>
                ) : (
                    <section className="text-gray-200 body-font">
                        <div className="container px-5 py-5 mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filterProduct.length > 0 ? (
                                    filterProduct.map((item, index) => {
                                        const { id, title, price, productImageUrl } = item;
                                        return (
                                            <div key={index} className="p-4">
                                                <div className="h-full border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer">
                                                    <img
                                                        onClick={() => navigate(`/productinfo/${id}`)}
                                                        className="lg:h-80 h-60 w-full object-cover"
                                                        src={productImageUrl}
                                                        alt={title}
                                                    />
                                                    <div className="p-6">
                                                        <h2 className="tracking-widest text-xs title-font font-medium text-pink-100 mb-1">
                                                            Digital Shop Nepal
                                                        </h2>
                                                        <h1 className="title-font text-lg font-medium text-gray-300 mb-3">
                                                            {title.substring(0, 25)}
                                                        </h1>
                                                        <h1 className="title-font text-lg font-medium text-white mb-3">
                                                            ₹{price}
                                                        </h1>

                                                        <div className="flex justify-center">
                                                            {cartItems.some((p) => p.id === item.id) ? (
                                                                <button
                                                                    onClick={() => deleteCart(item)}
                                                                    className="bg-red-700 hover:bg-green-600 w-full text-white py-[4px] rounded-lg font-bold"
                                                                >
                                                                    Delete From Cart
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => addCart(item)}
                                                                    className="bg-red-500 hover:bg-green-600 w-full text-white py-[4px] rounded-lg font-bold"
                                                                >
                                                                    Add To Cart
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div>
                                        <div className="flex justify-center">
                                            <img
                                                className="mb-2"
                                                src="https://cdn-icons-png.flaticon.com/128/2748/2748614.png"
                                                alt="No products"
                                            />
                                        </div>
                                        <h1 className="text-black text-xl">No {categoryname} product found</h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
};

export default CategoryPage;
