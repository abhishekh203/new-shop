// CartPage.jsx
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/layout/Layout";
import { Trash } from 'lucide-react';
import { decrementQuantity, deleteFromCart, incrementQuantity } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import BuyNowModal from "../../components/buyNowModal/BuyNowModal";
import { Navigate } from "react-router";

const CartPage = () => {
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Item removed from cart");
    };

    const handleIncrement = (id) => {
        dispatch(incrementQuantity(id));
    };

    const handleDecrement = (id) => {
        dispatch(decrementQuantity(id));
    };

    const cartItemTotal = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const user = JSON.parse(localStorage.getItem('users'));

    const [addressInfo, setAddressInfo] = useState({
        name: "",
        address: "",
        pincode: "",
        mobileNumber: "",
        time: Timestamp.now(),
        date: new Date().toLocaleString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        )
    });

    const buyNowFunction = () => {
        if (!addressInfo.name || !addressInfo.address || !addressInfo.pincode || !addressInfo.mobileNumber) {
            return toast.error("All Fields are required");
        }

        const orderInfo = {
            cartItems,
            addressInfo,
            email: user.email,
            userid: user.uid,
            status: "confirmed",
            time: Timestamp.now(),
            date: new Date().toLocaleString(
                "en-US",
                {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }
            )
        };

        try {
            const orderRef = collection(fireDB, 'order');
            addDoc(orderRef, orderInfo);
            setAddressInfo({
                name: "",
                address: "",
                pincode: "",
                mobileNumber: "",
            });
            toast.success("Order placed successfully");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 max-w-7xl lg:px-0 bg-gradient-to-b from-black to-blue-700 min-h-screen py-8">
                <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl bg-white rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
                        Shopping Cart
                    </h1>
                    <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                        <section aria-labelledby="cart-heading" className="lg:col-span-8">
                            <h2 id="cart-heading" className="sr-only">
                                Items in your shopping cart
                            </h2>
                            <ul role="list" className="divide-y divide-gray-200">
                                {cartItems.length > 0 ? (
                                    <>
                                        {cartItems.map((item, index) => {
                                            const { id, title, price, productImageUrl, quantity, category } = item;
                                            return (
                                                <li key={index} className="flex flex-col sm:flex-row py-6 items-center bg-gray-50 rounded-lg mb-4 shadow-sm">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={productImageUrl}
                                                            alt="Product"
                                                            className="h-24 w-24 rounded-md object-contain"
                                                        />
                                                    </div>
                                                    <div className="ml-4 flex-1 flex flex-col justify-between">
                                                        <div className="relative pr-9 flex flex-col sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                            <div>
                                                                <div className="flex justify-between">
                                                                    <h3 className="text-sm font-semibold text-gray-900">
                                                                        {title}
                                                                    </h3>
                                                                </div>
                                                                <div className="mt-1 text-sm text-gray-500">
                                                                    {category}
                                                                </div>
                                                                <div className="mt-1 flex items-end">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        ₹{price}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-4 ml-4">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleDecrement(id)}
                                                                type="button"
                                                                className="h-8 w-8 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full flex items-center justify-center"
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="text"
                                                                className="w-12 text-center border border-gray-300 rounded-md"
                                                                value={quantity}
                                                                readOnly
                                                            />
                                                            <button
                                                                onClick={() => handleIncrement(id)}
                                                                type="button"
                                                                className="h-8 w-8 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full flex items-center justify-center"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteCart(item)}
                                                            type="button"
                                                            className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                                        >
                                                            <Trash size={16} />
                                                            <span className="text-xs font-medium">Remove</span>
                                                        </button>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <li className="text-center py-6 text-gray-600">Your cart is empty</li>
                                )}
                            </ul>
                        </section>
                        <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-white lg:col-span-4 lg:mt-0 lg:p-4 shadow-lg">
                            <h2 id="summary-heading" className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900">
                                Price Details
                            </h2>
                            <div className="px-4 py-4">
                                <dl className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-800">Price ({cartItemTotal} item{cartItemTotal > 1 ? 's' : ''})</dt>
                                        <dd className="text-sm font-medium text-gray-900">₹{cartTotal}</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <dt className="text-sm text-gray-800">Delivery Charges</dt>
                                        <dd className="text-sm font-medium text-green-700">Free</dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-dashed py-2">
                                        <dt className="text-base font-medium text-gray-900">Total Amount</dt>
                                        <dd className="text-base font-medium text-gray-900">₹{cartTotal}</dd>
                                    </div>
                                </dl>
                                <div className="px-2 pb-4 font-medium text-green-700">
                                    <div className="flex gap-4 mb-6">
                                        {user ? (
                                            <BuyNowModal
                                                addressInfo={addressInfo}
                                                setAddressInfo={setAddressInfo}
                                                buyNowFunction={buyNowFunction}
                                            />
                                        ) : (
                                            <Navigate to={'/login'} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default CartPage;
