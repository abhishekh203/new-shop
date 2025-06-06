import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/layout/Layout";
import { Trash2, X, Check, Info, Minus, Plus, ShoppingCart, Ticket, XCircle } from "lucide-react"; // Added necessary icons
import {
  decrementQuantity,
  deleteFromCart,
  incrementQuantity
} from "../../redux/cartSlice";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import BuyNowModal from "../../components/buyNowModal/BuyNowModal";
import { useNavigate } from "react-router-dom"; // Corrected import from react-router-dom
import { motion, AnimatePresence } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";

// Enhanced coupon system with better validation
const validCoupons = {
  "WELCOME": { discount: 1, minAmount: 0, description: "1% off any order" }, // Added description
  "SAVE20": { discount: 2, minAmount: 1000, description: "2% off orders over ₹1000" },
  "MEGA30": { discount: 3, minAmount: 2000, description: "3% off orders over ₹2000" },
};

// --- Animation Variants (Copied from previous enhanced version for consistency) ---
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } }
};

const itemMotionVariants = { // Renamed to avoid conflict with a component variable if any
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: {
    opacity: 0,
    x: 40,
    transition: { duration: 0.3, ease: "easeIn" }
  },
  hover: {
    scale: 1.015,
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.2 }
  }
};

const summaryVariants = {
  initial: { opacity: 0.8, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.1 } },
}

const totalPriceVariants = {
  initial: { scale: 1.05, opacity: 0.8 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.4, type: 'spring', stiffness: 120 } },
}

const couponSectionVariants = {
  initial: { opacity: 0, height: 0, y: 10 },
  animate: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } }
};

const errorMessageVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -5, transition: { duration: 0.2 } }
};


const CartPage = () => {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [listRef] = useAutoAnimate({ duration: 300 }); // Corrected to listRef for clarity if used on ul/ol
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [customCoupon, setCustomCoupon] = useState("");
  const [couponError, setCouponError] = useState(null);
  const [isRemovingItemId, setIsRemovingItemId] = useState(null); // For exit animation state

  const cartItemTotal = cartItems.reduce((total, item) => total + (Number(item.quantity || 0)), 0);
  const cartSubtotal = cartItems.reduce((total, item) => {
    const itemPrice = Number(item.price || 0);
    const itemQuantity = Number(item.quantity || 0);
    return total + (itemPrice * itemQuantity);
  }, 0);


  const getLoggedInUser = () => {
    const userString = localStorage.getItem("users");
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        return null;
      }
    }
    return null;
  };
  const user = getLoggedInUser();

  const [addressInfo, setAddressInfo] = useState({
    name: user?.name || "", // Pre-fill name if available
    address: "",
    country: "", // Added country field
    pincode: "",
    mobileNumber: "",
    // time and date for address capture are better set when the address is confirmed/used
  });

  // Enhanced coupon state management
  const [couponState, setCouponState] = useState(() => {
    const savedCode = localStorage.getItem("couponCode");
    const savedDiscount = parseFloat(localStorage.getItem("discount")) || 0;
    const couponDetails = savedCode ? validCoupons[savedCode.toUpperCase()] : null;
    const savedPercentage = couponDetails ? couponDetails.discount : 0;

    return {
      code: savedCode || "",
      discount: savedDiscount || 0,
      applied: !!savedCode,
      discountPercentage: savedPercentage,
    };
  });

  // Persist coupon state to localStorage
  useEffect(() => {
    if (couponState.applied && couponState.code) {
      localStorage.setItem("discount", couponState.discount.toString());
      localStorage.setItem("couponCode", couponState.code);
      // discountPercentage is derived, so not strictly needed in localStorage if always recalculated
    } else {
      localStorage.removeItem("discount");
      localStorage.removeItem("couponCode");
    }
  }, [couponState]);


  const validateAndApplyCoupon = (codeToApply, showSuccessToast = true) => {
    if (!codeToApply || isApplyingCoupon) return;

    setIsApplyingCoupon(true);
    setCouponError(null);
    const normalizedCode = codeToApply.toUpperCase(); // Normalize here

    setTimeout(() => {
      const coupon = validCoupons[normalizedCode];

      if (!coupon) {
        setCouponError("Invalid coupon code.");
        setIsApplyingCoupon(false);
        if (couponState.code === normalizedCode) removeCoupon(false);
        return;
      }

      if (cartSubtotal < coupon.minAmount) {
        setCouponError(`Minimum ₹${coupon.minAmount.toFixed(0)} purchase required for ${normalizedCode}.`);
        setIsApplyingCoupon(false);
        if (couponState.code === normalizedCode) removeCoupon(false);
        return;
      }

      const discountAmount = (cartSubtotal * coupon.discount) / 100;

      setCouponState({
        code: normalizedCode,
        discount: discountAmount,
        applied: true,
        discountPercentage: coupon.discount
      });

      if (showSuccessToast) {
        toast.success(
          <div className="flex items-center gap-2">
            <Check size={18} className="text-emerald-400" />
            <span>{coupon.discount}% OFF ({normalizedCode}) applied!</span>
          </div>, { duration: 2500 }
        );
      }
      setIsApplyingCoupon(false);
      setCustomCoupon("");
    }, 800); // Simulating API delay
  };

  // Re-validate coupon if cart subtotal changes (from previous good version)
  useEffect(() => {
    if (couponState.applied && couponState.code) {
      const coupon = validCoupons[couponState.code.toUpperCase()];
      if (coupon) {
        if (cartSubtotal < coupon.minAmount) {
          toast.error(
            <div className="flex items-center gap-2">
                <Info size={18} className="text-amber-400" />
                <span>Coupon {couponState.code} removed: Minimum purchase not met.</span>
            </div>, { duration: 3000 }
          );
          removeCoupon(false);
        } else {
          const newDiscountAmount = (cartSubtotal * coupon.discount) / 100;
          setCouponState(prevState => ({
            ...prevState,
            discount: newDiscountAmount,
          }));
        }
      } else {
        removeCoupon(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartSubtotal]); // Removed couponState.applied and couponState.code from deps to avoid loop, logic inside handles it.

  const removeCoupon = (showToast = true) => {
    setCouponState({ code: "", discount: 0, applied: false, discountPercentage: 0 });
    setCouponError(null); // Clear any existing coupon errors
    if (showToast) {
      toast("Coupon removed.", { icon: <Trash2 size={16} className="text-amber-500" />, duration: 2000 });
    }
  };

  const handleRemoveItem = (item) => {
    setIsRemovingItemId(item.id); // For animation
    setTimeout(() => {
      dispatch(deleteFromCart(item));
      // setIsRemovingItemId(null); // Not strictly necessary if AnimatePresence handles removal
      toast.success("Item removed from cart", { icon: <Trash2 size={16} className="text-red-500"/> });
    }, 300); // Match animation duration
  };

  const handleQuantityChange = (id, type) => {
    if (type === 'inc') {
      dispatch(incrementQuantity(id));
    } else if (type === 'dec') {
      const item = cartItems.find(cartItem => cartItem.id === id);
      if (item && item.quantity > 1) {
        dispatch(decrementQuantity(id));
      }
    }
  };


  const finalPrice = Math.max(0, cartSubtotal - couponState.discount);

  const buyNowFunction = async () => {
    console.log("buyNowFunction called in CartPage");
    const currentUser = getLoggedInUser();

    if (!currentUser) {
      toast.error("You must be logged in to place an order.", { icon: <Info size={16}/> });
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    if (!currentUser.uid || !currentUser.email) {
        console.error("User UID or Email is missing in localStorage:", currentUser);
        toast.error("User information is incomplete. Please try logging out and back in.", { icon: <Info size={16}/> });
        return;
    }

    // Validate address fields from addressInfo state
    if (!addressInfo.name || !addressInfo.address || !addressInfo.pincode || !addressInfo.mobileNumber || !addressInfo.country) {
      toast.error("Please fill all shipping details in the modal.", { icon: <Info size={16}/> });
      return; // Stop if validation fails
    }
    console.log("Current Address Info for order:", addressInfo);

    const orderInfo = {
      cartItems,
      addressInfo: { // Explicitly structure address for the order
        name: addressInfo.name,
        address: addressInfo.address,
        pincode: addressInfo.pincode,
        mobileNumber: addressInfo.mobileNumber,
        country: addressInfo.country,
        submittedAt: Timestamp.now(), // Timestamp for when address was submitted for this order
      },
      email: currentUser.email,
      userid: currentUser.uid,
      status: "confirmed", // Default status
      totalAmount: finalPrice,
      discountApplied: couponState.discount,
      couponUsed: couponState.applied && couponState.code ? couponState.code : "None",
      orderTimestamp: Timestamp.now(), // Timestamp for the order itself
      orderDate: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      }),
    };
    console.log("Order Info to be saved to Firebase:", orderInfo);

    try {
      // Note: User's code used "order". "orders" is more conventional.
      const orderRef = collection(fireDB, "order");
      console.log("Attempting to add document to Firebase collection 'order'...");
      const docRef = await addDoc(orderRef, orderInfo);
      console.log("Document written to Firebase with ID: ", docRef.id);

      toast.success("Order placed successfully!");

      // Navigate to purchase page with the total, discount info, and crucially, the orderId
      navigate("/purchase", {
        state: {
          orderId: docRef.id, // **** THIS IS CRITICAL FOR PURCHASE PAGE ****
          totalAmount: finalPrice,
          discountApplied: couponState.discount,
          cartSubtotal: cartSubtotal // Pass original subtotal for display if needed
        }
      });

      // Reset address form fields
      setAddressInfo({
        name: currentUser.name || "", // Keep pre-filled name if user has one
        address: "",
        country: "",
        pincode: "",
        mobileNumber: ""
      });
      // Reset coupon
      removeCoupon(false); // Silently remove coupon

      // Optional: Clear the cart from Redux store
      // cartItems.forEach(item => dispatch(deleteFromCart(item))); // Or a dedicated clear cart action

    } catch (error) {
      console.error("Firebase Error - Failed to place order:", error);
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle size={18} className="text-red-400" /> {/* Changed icon for clarity */}
          <span>Failed to place order. Firebase error.</span>
        </div>
      );
    }
  };


  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto px-4 max-w-7xl lg:px-0 bg-gradient-to-b from-gray-950 via-gray-900 to-black min-h-screen py-12"> {/* Theme from previous good version */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-2xl lg:max-w-6xl bg-gray-800/60 backdrop-blur-lg text-white rounded-2xl shadow-2xl border border-gray-700/40 overflow-hidden"
        >
          <div className="p-6 md:p-8 lg:p-10">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center gap-3">
              <ShoppingCart size={32} /> Your Shopping Cart
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
              <section aria-labelledby="cart-heading" className="flex-grow lg:w-2/3">
                {cartItems.length > 0 && (
                  <h2 className="text-lg font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">
                    Items ({cartItemTotal})
                  </h2>
                )}
                <div role="list" ref={listRef} className="space-y-4"> {/* Using listRef from useAutoAnimate */}
                  <AnimatePresence initial={false}>
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => {
                        const { id, title, price, productImageUrl, quantity, category } = item;
                        return (
                          <motion.div // Changed from li to div for consistency with itemMotionVariants if needed
                            key={id}
                            layout
                            variants={itemMotionVariants} // Using renamed variants
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            whileHover="hover"
                            className={`flex flex-col sm:flex-row items-center py-4 px-5 bg-gray-900/70 rounded-xl shadow-md border border-gray-700/50 transition-opacity duration-300 ${
                              isRemovingItemId === id ? 'opacity-40' : 'opacity-100'
                            }`}
                          >
                            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-5">
                              <motion.img
                                layout
                                whileHover={{ scale: 1.05, rotateZ: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                src={productImageUrl || 'https://placehold.co/80x80/374151/9ca3af?text=N/A'}
                                alt={title || 'Product Image'}
                                className="h-20 w-20 rounded-lg object-cover border border-gray-600 shadow-sm"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/374151/9ca3af?text=N/A"; }}
                              />
                            </div>
                            <div className="flex-1 flex flex-col text-center sm:text-left mr-4">
                              <h3 className="text-md font-semibold text-gray-100">{title || 'Product Title'}</h3>
                              <p className="text-sm text-gray-400 mt-1">{category || 'Category'}</p>
                              <p className="text-lg font-bold text-indigo-400 mt-1">
                                ₹{Number(price || 0).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleQuantityChange(id, 'dec')}
                                className={`h-8 w-8 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center justify-center transition-colors ${Number(quantity || 0) <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={Number(quantity || 0) <= 1}
                                aria-label="Decrease quantity"
                              > <Minus size={16} /> </motion.button>
                              <div className="w-12 text-center border border-gray-600 rounded-md bg-gray-800 text-white px-1 py-1 text-sm tabular-nums overflow-hidden">
                                <AnimatePresence mode="popLayout">
                                  <motion.span
                                    key={quantity} // Animate when quantity changes
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="inline-block"
                                  >
                                    {Number(quantity || 0)}
                                  </motion.span>
                                </AnimatePresence>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleQuantityChange(id, 'inc')}
                                className="h-8 w-8 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center justify-center transition-colors"
                                aria-label="Increase quantity"
                              > <Plus size={16} /> </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1, rotateZ: -5, backgroundColor: '#ef4444' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemoveItem(item)}
                                className="ml-3 p-2 text-gray-300 hover:text-white rounded-full transition-colors duration-200"
                                aria-label="Remove item"
                              > <Trash2 size={18} /> </motion.button>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <motion.div // Empty cart message from previous good version
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 text-gray-400 flex flex-col items-center bg-gray-900/50 rounded-xl border border-dashed border-gray-700"
                      >
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                          <ShoppingCart size={48} className="text-gray-600 mb-4 opacity-70" strokeWidth={1.5}/>
                        </motion.div>
                        <p className="text-lg font-medium mb-2">Your Cart is Empty</p>
                        <p className="text-sm text-gray-500">Looks like you haven't added anything yet.</p>
                        <motion.button
                          whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/')}
                          className="mt-6 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md"
                        > Start Shopping </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {cartItems.length > 0 && (
                <motion.aside
                  layout
                  variants={summaryVariants}
                  initial="initial"
                  animate="animate"
                  className="lg:w-1/3 rounded-xl bg-gray-900/80 p-6 shadow-lg border border-gray-700/60 h-fit sticky top-10"
                >
                  <h2 className="border-b border-gray-700 pb-3 mb-4 text-lg font-semibold text-gray-200 flex items-center gap-2">
                    Order Summary
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({cartItemTotal} {cartItemTotal === 1 ? "item" : "items"})</span>
                      <span>₹{cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-700/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300 font-medium flex items-center gap-1.5"> <Ticket size={16} className="text-amber-400"/> Coupon Code</p>
                        {couponState.applied && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => removeCoupon()}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                          > <XCircle size={14} /> Remove </motion.button>
                        )}
                      </div>
                      <div className="overflow-hidden relative min-h-[80px]">
                        <AnimatePresence mode="wait">
                          {couponState.applied ? (
                            <motion.div
                              key="coupon_applied_badge"
                              variants={couponSectionVariants} initial="initial" animate="animate" exit="exit"
                              className="bg-green-900/40 border border-green-700/60 rounded-lg p-3 flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <Check size={16} className="text-green-400 flex-shrink-0" />
                                <span className="font-medium text-gray-100">{couponState.code}</span>
                                <span className="text-xs bg-green-500/80 text-white px-2 py-0.5 rounded-full">
                                  {couponState.discountPercentage}% OFF
                                </span>
                              </div>
                              <span className="font-medium text-green-400 whitespace-nowrap ml-2">
                                - ₹{couponState.discount.toFixed(2)}
                              </span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="coupon_input_area"
                              variants={couponSectionVariants} initial="initial" animate="animate" exit="exit"
                              className="space-y-3"
                            >
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(validCoupons).map(([code, { discount, description }]) => (
                                  <motion.button
                                    key={code}
                                    whileHover={{ y: -2, filter: 'brightness(1.1)' }} whileTap={{ scale: 0.95 }}
                                    onClick={() => validateAndApplyCoupon(code)}
                                    disabled={isApplyingCoupon}
                                    title={description} // Show description on hover
                                    className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                                      isApplyingCoupon ? "bg-gray-600 cursor-not-allowed" : "bg-gray-700 hover:bg-indigo-600"
                                    } text-white font-medium`}
                                  > {code} ({discount}%) </motion.button>
                                ))}
                              </div>
                              <div className="relative flex items-center">
                                <input
                                  type="text" placeholder="Enter code" value={customCoupon}
                                  onChange={(e) => setCustomCoupon(e.target.value.toUpperCase())}
                                  className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-16"
                                  disabled={isApplyingCoupon}
                                />
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => validateAndApplyCoupon(customCoupon)}
                                  disabled={isApplyingCoupon || !customCoupon}
                                  className={`absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs rounded font-medium transition-all ${ isApplyingCoupon || !customCoupon ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 text-white" }`}
                                > {isApplyingCoupon ? "..." : "Apply"} </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <AnimatePresence>
                        {couponError && !couponState.applied && (
                          <motion.div
                            variants={errorMessageVariants} initial="initial" animate="animate" exit="exit"
                            className="text-red-400 text-xs flex items-center gap-1.5 pt-1"
                          > <Info size={14} /> <span>{couponError}</span> </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {couponState.applied && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.1 }}
                          className="flex justify-between text-green-400 pt-1"
                        >
                          <span>Discount ({couponState.discountPercentage}%)</span>
                          <span>- ₹{couponState.discount.toFixed(2)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex justify-between border-t border-gray-600 pt-4 text-lg font-bold text-white">
                      <span>Total</span>
                      <motion.span
                        key={finalPrice}
                        variants={totalPriceVariants} initial="initial" animate="animate"
                      > ₹{finalPrice.toFixed(2)} </motion.span>
                    </div>
                    {couponState.applied && finalPrice < cartSubtotal && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center text-green-400 text-xs pt-2"
                      > 🎉 You saved ₹{(cartSubtotal - finalPrice).toFixed(2)}! </motion.div>
                    )}
                  </div>
                  <div className="mt-6">
                    {user ? (
                      <BuyNowModal
                        addressInfo={addressInfo}
                        setAddressInfo={setAddressInfo}
                        buyNowFunction={buyNowFunction} // This is the function from CartPage
                        cartTotal={finalPrice} // Pass final price to modal for display
                        itemCount={cartItemTotal} // Pass item count for display or disabling button
                      />
                    ) : (
                       // If no user, redirect to login or show login button
                       <motion.button
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => navigate('/login', { state: { from: '/cart' } })}
                          className="w-full mt-4 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
                        > Login to Checkout </motion.button>
                    )}
                  </div>
                </motion.aside>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CartPage;
