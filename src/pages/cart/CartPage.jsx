import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/layout/Layout";
import { Trash, X, Check, Info } from "lucide-react";
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
import { Navigate, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";

// Enhanced coupon system with better validation
const validCoupons = {
  "WELCOME": { discount: 1, minAmount: 0, maxUses: 1 },
  "SAVE20": { discount: 2, minAmount: 1000, maxUses: 3 },
  "MEGA30": { discount: 3, minAmount: 2000, maxUses: 1 },
};

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [parent] = useAutoAnimate({ duration: 300 });
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [customCoupon, setCustomCoupon] = useState("");
  const [couponError, setCouponError] = useState(null);
  const [isRemovingItem, setIsRemovingItem] = useState(null);

  const cartItemTotal = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const user = JSON.parse(localStorage.getItem("users"));

  const [addressInfo, setAddressInfo] = useState({
    name: "",
    address: "",
    pincode: "",
    mobileNumber: "",
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", { 
      month: "short", 
      day: "2-digit", 
      year: "numeric" 
    }),
  });

  // Enhanced coupon state management
  const [couponState, setCouponState] = useState({
    code: localStorage.getItem("couponCode") || "",
    discount: parseFloat(localStorage.getItem("discount")) || 0,
    applied: Boolean(localStorage.getItem("couponCode")),
    discountPercentage: 0
  });

  useEffect(() => {
    localStorage.setItem("discount", couponState.discount);
    localStorage.setItem("couponCode", couponState.code);
  }, [couponState]);

  const validateCoupon = (code) => {
    if (!validCoupons[code]) {
      return { valid: false, message: "Invalid coupon code" };
    }
    
    const coupon = validCoupons[code];
    
    if (cartSubtotal < coupon.minAmount) {
      return { 
        valid: false, 
        message: `Minimum order amount of ₹${coupon.minAmount} required` 
      };
    }
    
    return { valid: true, coupon };
  };

  const applyCoupon = (code) => {
    setIsApplyingCoupon(true);
    setCouponError(null);
    
    setTimeout(() => {
      const validation = validateCoupon(code);
      
      if (!validation.valid) {
        setCouponError(validation.message);
        setIsApplyingCoupon(false);
        return;
      }
      
      const { coupon } = validation;
      const discountAmount = (cartSubtotal * coupon.discount) / 100;
      
      setCouponState({
        code,
        discount: discountAmount,
        applied: true,
        discountPercentage: coupon.discount
      });
      
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="text-green-400" />
          <span>Coupon applied! {coupon.discount}% OFF</span>
        </div>,
        { duration: 2000 }
      );
      
      setIsApplyingCoupon(false);
      setCustomCoupon("");
    }, 800);
  };

  const removeCoupon = () => {
    setCouponState({
      code: "",
      discount: 0,
      applied: false,
      discountPercentage: 0
    });
    toast("Coupon removed", { icon: "🗑️" });
  };

  const handleRemoveItem = (item) => {
    setIsRemovingItem(item.id);
    setTimeout(() => {
      dispatch(deleteFromCart(item));
      setIsRemovingItem(null);
      toast.success("Item removed from cart");
    }, 300);
  };

  const finalPrice = cartSubtotal - couponState.discount;

  // Updated buyNowFunction to navigate to purchase page with state
  const buyNowFunction = async () => {
    if (!addressInfo.name || !addressInfo.address || !addressInfo.pincode || !addressInfo.mobileNumber) {
      return toast.error("All fields are required");
    }

    const orderInfo = {
      cartItems,
      addressInfo,
      email: user.email,
      userid: user.uid,
      status: "confirmed",
      totalAmount: finalPrice,
      discountApplied: couponState.discount,
      couponUsed: couponState.code || "None",
      time: Timestamp.now(),
      date: new Date().toLocaleString("en-US", { 
        month: "short", 
        day: "2-digit", 
        year: "numeric" 
      }),
    };

    try {
      const orderRef = collection(fireDB, "order");
      await addDoc(orderRef, orderInfo);
      
      // Navigate to purchase page with the total and discount info
      navigate("/purchase", {
        state: {
          totalAmount: finalPrice,
          discountApplied: couponState.discount,
          cartSubtotal: cartSubtotal
        }
      });
      
      setAddressInfo({ 
        name: "", 
        address: "", 
        pincode: "", 
        mobileNumber: "" 
      });
      
      setCouponState({
        code: "",
        discount: 0,
        applied: false,
        discountPercentage: 0
      });
      
      localStorage.removeItem("discount");
      localStorage.removeItem("couponCode");
      
    } catch (error) {
      console.error(error);
      toast.error(
        <div className="flex items-center gap-2">
          <X className="text-red-400" />
          <span>Failed to place order. Please try again.</span>
        </div>
      );
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: 50,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Layout>
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 max-w-7xl lg:px-0 bg-gradient-to-br from-gray-900 via-black to-blue-900 min-h-screen py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl py-8 lg:max-w-7xl bg-opacity-90 backdrop-blur-xl bg-gray-800 text-white rounded-lg shadow-xl p-6"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-center mb-8 text-white">
            🛒 Your Shopping Cart
          </h1>

          {/* Cart Items Section */}
          <section aria-labelledby="cart-heading" className="lg:col-span-8 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>Your Items</span>
              {cartItems.length > 0 && (
                <span className="text-sm bg-blue-600 px-2 py-1 rounded-full">
                  {cartItemTotal} {cartItemTotal === 1 ? "item" : "items"}
                </span>
              )}
            </h2>
            
            <ul ref={parent} role="list" className="divide-y divide-gray-700">
              <AnimatePresence>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => {
                    const { id, title, price, productImageUrl, quantity, category } = item;
                    return (
                      <motion.li
                        key={id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className={`flex flex-col sm:flex-row py-6 items-center bg-gray-900 rounded-lg mb-4 shadow-md px-4 ${
                          isRemovingItem === id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                        } transition-all duration-300`}
                      >
                        <div className="flex-shrink-0">
                          <motion.img 
                            whileHover={{ scale: 1.05 }}
                            src={productImageUrl} 
                            alt="Product" 
                            className="h-20 w-20 rounded-md object-contain border border-gray-700" 
                          />
                        </div>
                        <div className="ml-4 flex-1 flex flex-col justify-between">
                          <h3 className="text-lg font-semibold text-white">{title}</h3>
                          <p className="text-sm text-gray-400">{category}</p>
                          <p className="text-xl font-bold text-green-400">₹{price}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dispatch(decrementQuantity(id))} 
                            className="h-8 w-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center"
                            disabled={quantity <= 1}
                          >
                            -
                          </motion.button>
                          <input 
                            type="text" 
                            className="w-10 text-center border border-gray-600 rounded-md bg-gray-800 text-white" 
                            value={quantity} 
                            readOnly 
                          />
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dispatch(incrementQuantity(id))} 
                            className="h-8 w-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center"
                          >
                            +
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveItem(item)} 
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center"
                          >
                            <Trash size={16} />
                          </motion.button>
                        </div>
                      </motion.li>
                    );
                  })
                ) : (
                  <motion.li 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-gray-400 flex flex-col items-center"
                  >
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <p className="text-lg mb-2">Your cart is empty</p>
                    <p className="text-sm">Add some items to get started</p>
                  </motion.li>
                )}
              </AnimatePresence>
            </ul>
          </section>

          {/* Price Summary Section */}
          <motion.section 
            layout
            className="rounded-lg bg-gray-900 p-4 shadow-lg border border-gray-700"
          >
            <h2 className="border-b border-gray-700 px-4 py-3 text-lg font-medium text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Order Summary</span>
            </h2>
            
            <div className="px-4 py-4">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({cartItemTotal} {cartItemTotal === 1 ? "item" : "items"})</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>

                {/* Coupon Section */}
                <div className="mt-4 border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-yellow-400 text-sm font-medium">Coupon Code</p>
                    {couponState.applied && (
                      <button 
                        onClick={removeCoupon}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <X size={14} /> Remove
                      </button>
                    )}
                  </div>
                  
                  {couponState.applied ? (
                    <div className="bg-green-900/30 border border-green-700 rounded-md p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="text-green-400" size={18} />
                        <span className="font-medium">{couponState.code}</span>
                        <span className="text-xs bg-green-800 px-2 py-1 rounded-full">
                          {couponState.discountPercentage}% OFF
                        </span>
                      </div>
                      <span className="text-green-400">- ₹{couponState.discount.toFixed(2)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {Object.keys(validCoupons).map((code) => (
                          <motion.button
                            key={code}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => applyCoupon(code)}
                            disabled={isApplyingCoupon}
                            className={`px-2 py-2 text-xs rounded-md transition-all ${
                              isApplyingCoupon ? "bg-gray-700" : "bg-gray-700 hover:bg-gray-600"
                            } text-white`}
                          >
                            {code}
                            <div className="text-yellow-400 text-[0.6rem] mt-1">
                              {validCoupons[code].discount}% OFF
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={customCoupon}
                          onChange={(e) => setCustomCoupon(e.target.value.toUpperCase())}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => applyCoupon(customCoupon)}
                          disabled={isApplyingCoupon || !customCoupon}
                          className={`absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded ${
                            isApplyingCoupon || !customCoupon 
                              ? "bg-gray-600 cursor-not-allowed" 
                              : "bg-blue-600 hover:bg-blue-500"
                          } text-white`}
                        >
                          {isApplyingCoupon ? "Applying..." : "Apply"}
                        </motion.button>
                      </div>
                    </>
                  )}
                  
                  {couponError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-red-400 text-sm flex items-center gap-2"
                    >
                      <Info size={14} />
                      <span>{couponError}</span>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>- ₹{couponState.discount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between border-t border-gray-600 pt-3 font-bold text-xl">
                  <span>Total Amount</span>
                  <motion.span 
                    key={finalPrice}
                    initial={{ scale: 1.2, color: "#4ade80" }}
                    animate={{ scale: 1, color: "#ffffff" }}
                    transition={{ duration: 0.5 }}
                    className="font-bold"
                  >
                    ₹{finalPrice.toFixed(2)}
                  </motion.span>
                </div>

                {finalPrice < cartSubtotal && (
                  <div className="text-center text-green-400 text-sm">
                    You saved ₹{couponState.discount.toFixed(2)} on this order!
                  </div>
                )}
              </div>

              <div className="mt-6">
                {user ? (
                  <BuyNowModal 
                    addressInfo={addressInfo} 
                    setAddressInfo={setAddressInfo} 
                    buyNowFunction={buyNowFunction} 
                    cartTotal={finalPrice} 
                    itemCount={cartItemTotal}
                  />
                ) : (
                  <Navigate to="/login" />
                )}
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CartPage;