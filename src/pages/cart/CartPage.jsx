import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/layout/Layout";
import { Trash, X, Check, Info, ShoppingCart, Minus, Plus, Sparkles, Star, Package } from "lucide-react";
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

// Manual coupon system only
const validCoupons = {
  "WELCOME": { discount: 1, minAmount: 0, maxUses: 1, description: "Welcome discount" },
  "SAVE20": { discount: 1.5, minAmount: 1000, maxUses: 3, description: "1.5% off on orders above ₹1000" },
  "MEGA30": { discount: 2, minAmount: 2000, maxUses: 1, description: "2% off on orders above ₹2000" },
  "FLASH50": { discount: 3, minAmount: 5000, maxUses: 1, description: "3% off on orders above ₹5000" },
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

  // Calculate estimated delivery time (1 minute to 1 hour)
  const getEstimatedDelivery = () => {
    const now = new Date();
    const deliveryDate = new Date(now.getTime() + (Math.random() * 59 + 1) * 60 * 1000); // 1-60 minutes
    const minutes = Math.floor((deliveryDate - now) / (1000 * 60));
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const user = JSON.parse(localStorage.getItem("users"));

  const [addressInfo, setAddressInfo] = useState({
    name: "",
    address: "",
    whatsappNumber: "",
    mobileNumber: "",
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", { 
      month: "short", 
      day: "2-digit", 
      year: "numeric" 
    }),
  });

  // Manual coupon state only
  const [couponState, setCouponState] = useState({
    code: localStorage.getItem("couponCode") || "",
    discount: parseFloat(localStorage.getItem("discount")) || 0,
    applied: Boolean(localStorage.getItem("couponCode")),
    discountPercentage: 0,
    description: ""
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
        discountPercentage: coupon.discount,
        description: coupon.description
      });
      
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="text-green-400" />
          <span>Coupon applied! {coupon.discount}% OFF - {coupon.description}</span>
        </div>,
        { duration: 3000 }
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
      discountPercentage: 0,
      description: ""
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
    if (!addressInfo.name || !addressInfo.address || !addressInfo.whatsappNumber || !addressInfo.mobileNumber) {
      return toast.error("All fields are required");
    }

    const orderInfo = {
      cartItems,
      addressInfo,
      email: user.email,
      userid: user.uid,
      status: "placed",
      totalAmount: finalPrice,
      discountApplied: couponState.discount,
      discountPercentage: couponState.discountPercentage,
      discountType: "Manual Coupon",
      couponUsed: couponState.code || "None",
      paymentScreenshot: null, // Will be updated by PurchasePage
      paymentMethod: null, // Will be updated by PurchasePage
      time: Timestamp.now(),
      date: new Date().toLocaleString("en-US", { 
        month: "short", 
        day: "2-digit", 
        year: "numeric" 
      }),
    };

    try {
      const orderRef = collection(fireDB, "order");
      const docRef = await addDoc(orderRef, orderInfo);
      
      // Navigate to purchase page with the total, discount info, and order ID
      navigate("/purchase", {
        state: {
          totalAmount: finalPrice,
          discountApplied: couponState.discount,
          cartSubtotal: cartSubtotal,
          orderId: docRef.id // Pass the order ID
        }
      });
      
      setAddressInfo({ 
        name: "", 
        address: "", 
        whatsappNumber: "", 
        mobileNumber: "" 
      });
      
      // Clear coupon state
      setCouponState({
        code: "",
        discount: 0,
        applied: false,
        discountPercentage: 0,
        description: ""
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

      {/* Dark Background with Neon Effects */}
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Neon Grid Background */}
        <div className="absolute inset-0">
          {/* Animated Neon Lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 98%, rgba(0, 255, 255, 0.3) 100%),
              linear-gradient(0deg, transparent 98%, rgba(255, 0, 255, 0.3) 100%)
            `,
            backgroundSize: '50px 50px'
          }}></div>

          {/* Floating Neon Orbs */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-32 left-40 w-40 h-40 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-yellow-400/20 rounded-full blur-xl animate-bounce"></div>

          {/* Scanning Lines Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl lg:px-0 relative z-10 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl lg:max-w-7xl"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              {/* Neon Cart Icon */}
              <motion.div
                className="relative inline-flex items-center justify-center w-24 h-24 mb-6"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(0, 255, 255, 0.5)",
                    "0 0 40px rgba(255, 0, 255, 0.5)",
                    "0 0 20px rgba(0, 255, 255, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-pink-400 rounded-2xl blur-sm opacity-75"></div>
                <div className="relative bg-black/80 backdrop-blur-sm rounded-2xl w-full h-full flex items-center justify-center border border-cyan-400/50">
                  <ShoppingCart size={40} className="text-cyan-400" />
                </div>
              </motion.div>

              {/* Title */}
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4 relative">
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent blur-sm">
                    Shopping Cart
                  </span>
                  <span className="relative bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                    Shopping Cart
                  </span>
                </span>
              </h1>

              {/* Subtitle */}
              <motion.p
                className="text-green-400 text-lg max-w-2xl mx-auto"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Review your items and proceed to checkout
              </motion.p>
            </motion.div>

            {/* Modern Cart Layout */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items Section */}
              <section aria-labelledby="cart-heading" className="flex-grow lg:w-2/3">
                {cartItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 p-6 bg-black/60 rounded-2xl border border-cyan-400/30 backdrop-blur-sm relative overflow-hidden"
                  >
                    {/* Neon Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-pink-400/10 rounded-2xl"></div>

                    <div className="relative flex items-center gap-3">
                      <motion.div
                        className="p-2 bg-black border border-green-400 rounded-lg"
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(34, 197, 94, 0.5)",
                            "0 0 20px rgba(34, 197, 94, 0.8)",
                            "0 0 10px rgba(34, 197, 94, 0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Package size={20} className="text-green-400" />
                      </motion.div>
                      <h2 className="text-xl font-bold text-cyan-400">Cart Items</h2>
                      <span className="text-sm bg-black border border-yellow-400 text-yellow-400 px-3 py-1 rounded">
                        {cartItemTotal} {cartItemTotal === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </motion.div>
                )}

                <div ref={parent} role="list" className="space-y-4">
                  <AnimatePresence>
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => {
                        const { id, title, price, productImageUrl, quantity, category } = item;
                        return (
                          <motion.div
                            key={id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            whileHover={{
                              y: -2,
                              boxShadow: "0 0 30px rgba(0, 255, 255, 0.3), 0 0 60px rgba(255, 0, 255, 0.2)"
                            }}
                            className={`flex flex-col sm:flex-row items-center py-6 px-6 bg-black/80 backdrop-blur-xl rounded-2xl border border-cyan-400/30 shadow-xl relative overflow-hidden ${
                              isRemovingItem === id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                            } transition-all duration-300`}
                          >
                            {/* Neon Accent Line */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-pink-400"></div>
                            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                              <motion.div
                                whileHover={{ scale: 1.05, rotateZ: 1 }}
                                className="relative group"
                              >
                                {/* Holographic Effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-yellow-400 rounded-xl blur-sm opacity-30 group-hover:opacity-60 transition duration-500"></div>
                                <img
                                  src={productImageUrl}
                                  alt="Product"
                                  className="relative h-24 w-24 rounded-xl object-contain bg-black/80 border border-cyan-400/50 shadow-lg"
                                />
                                {/* Scanning Line Effect */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent h-1"
                                  animate={{ y: [0, 96, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                              </motion.div>
                            </div>
                            <div className="flex-1 flex flex-col text-center sm:text-left mr-4">
                              <h3 className="text-lg font-bold text-cyan-400 mb-1">{title}</h3>
                              <p className="text-sm text-green-400 mb-2 uppercase tracking-wider">{category}</p>
                              <p className="text-2xl font-bold">
                                <span className="text-yellow-400">₹</span>
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                  {price}
                                </span>
                              </p>
                            </div>
                            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                              {/* Decrease Button */}
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                whileHover={{
                                  scale: 1.1,
                                  boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)"
                                }}
                                onClick={() => dispatch(decrementQuantity(id))}
                                className={`h-10 w-10 bg-black border border-red-400 hover:bg-red-400/20 text-red-400 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                  quantity <= 1 ? 'opacity-50 cursor-not-allowed border-gray-600 text-gray-600' : ''
                                }`}
                                disabled={quantity <= 1}
                              >
                                <Minus size={18} />
                              </motion.button>

                              {/* Digital Display */}
                              <div className="w-16 text-center border border-cyan-400 rounded-lg bg-black text-cyan-400 px-3 py-2 text-lg font-bold shadow-lg">
                                <motion.span
                                  key={quantity}
                                  initial={{ scale: 1.2, color: "#00ff00" }}
                                  animate={{ scale: 1, color: "#00ffff" }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {quantity.toString().padStart(2, '0')}
                                </motion.span>
                              </div>

                              {/* Increase Button */}
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                whileHover={{
                                  scale: 1.1,
                                  boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)"
                                }}
                                onClick={() => dispatch(incrementQuantity(id))}
                                className="h-10 w-10 bg-black border border-green-400 hover:bg-green-400/20 text-green-400 rounded-lg flex items-center justify-center transition-all duration-200"
                              >
                                <Plus size={18} />
                              </motion.button>

                              {/* Delete Button */}
                              <motion.button
                                whileHover={{
                                  scale: 1.1,
                                  rotateZ: -5,
                                  boxShadow: "0 0 30px rgba(255, 0, 0, 0.6)"
                                }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemoveItem(item)}
                                className="ml-2 p-3 bg-black border border-red-500 hover:bg-red-500/20 text-red-500 rounded-lg flex items-center justify-center transition-all duration-200"
                              >
                                <Trash size={18} />
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 text-gray-400 flex flex-col items-center bg-black/80 backdrop-blur-xl rounded-2xl border border-red-400/30 relative overflow-hidden"
                      >
                        {/* Error/Warning Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-yellow-500/10 rounded-2xl"></div>

                        <motion.div
                          animate={{
                            y: [0, -10, 0],
                            boxShadow: [
                              "0 0 20px rgba(239, 68, 68, 0.5)",
                              "0 0 40px rgba(239, 68, 68, 0.8)",
                              "0 0 20px rgba(239, 68, 68, 0.5)"
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="relative w-24 h-24 bg-black border border-red-400 rounded-2xl flex items-center justify-center mb-6"
                        >
                          <ShoppingCart size={48} className="text-red-400" strokeWidth={1.5} />
                        </motion.div>

                        <h3 className="text-2xl font-bold text-red-400 mb-2">Your cart is empty</h3>
                        <p className="text-green-400 mb-6">
                          Add some items to get started
                        </p>

                        <motion.button
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 30px rgba(34, 197, 94, 0.6)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/')}
                          className="px-6 py-3 bg-black border border-green-400 hover:bg-green-400/20 text-green-400 font-bold rounded-xl transition-all duration-200"
                        >
                          Start Shopping
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* Price Summary Section */}
              {cartItems.length > 0 && (
                <motion.aside
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  layout
                  className="lg:w-1/3 rounded-2xl bg-black/80 backdrop-blur-xl p-6 shadow-2xl border border-cyan-400/30 h-fit sticky top-10 relative overflow-hidden"
                >
                  {/* Neon Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-pink-400/10 rounded-2xl"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cyan-400/30">
                      <motion.div
                        className="p-2 bg-black border border-yellow-400 rounded-lg"
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(234, 179, 8, 0.5)",
                            "0 0 20px rgba(234, 179, 8, 0.8)",
                            "0 0 10px rgba(234, 179, 8, 0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Star size={20} className="text-yellow-400" />
                      </motion.div>
                      <h2 className="text-xl font-bold text-cyan-400">Order Summary</h2>
                    </div>

                    <div className="space-y-4">
                    <div className="flex justify-between items-center text-green-400 bg-black/50 p-3 rounded-lg border border-green-400/30">
                      <span className="flex items-center gap-2">
                        <Package size={16} />
                        Subtotal ({cartItemTotal} {cartItemTotal === 1 ? "item" : "items"})
                      </span>
                      <span className="font-bold text-lg">₹{cartSubtotal.toFixed(2)}</span>
                    </div>

                    {/* Estimated Delivery */}
                    <div className="flex justify-between items-center text-blue-400 bg-black/50 p-3 rounded-lg border border-blue-400/30">
                      <span className="flex items-center gap-2">
                        <Package size={16} />
                        Estimated Delivery
                      </span>
                      <span className="font-bold text-sm">{getEstimatedDelivery()}</span>
                    </div>

                    {/* Manual Coupon Section */}
                    <div className="mt-6 pt-6 border-t border-cyan-400/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-yellow-400" />
                          <p className="text-yellow-400 font-bold">Coupon Discount</p>
                        </div>
                        {couponState.applied && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={removeCoupon}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all duration-200"
                          >
                            <X size={14} /> Remove Coupon
                          </motion.button>
                        )}
                      </div>

                      {/* Manual Coupon Display */}
                      {couponState.applied && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-600/50 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm mb-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1 bg-purple-500 rounded-full">
                              <Check className="text-white" size={16} />
                            </div>
                            <div>
                              <span className="font-semibold text-white">{couponState.code}</span>
                              <p className="text-xs text-purple-300 mt-1">{couponState.description}</p>
                            </div>
                            <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full font-semibold">
                              {couponState.discountPercentage}% OFF
                            </span>
                          </div>
                          <span className="text-purple-400 font-bold text-lg">- ₹{couponState.discount.toFixed(2)}</span>
                        </motion.div>
                      )}

                      {/* Manual Coupon Input */}
                      {!couponState.applied && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            {Object.keys(validCoupons).map((code) => (
                              <motion.button
                                key={code}
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => applyCoupon(code)}
                                disabled={isApplyingCoupon}
                                className={`px-3 py-3 text-xs rounded-xl transition-all ${
                                  isApplyingCoupon ? "bg-gray-700/50 cursor-not-allowed" : "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                                } text-white border border-gray-600/50 backdrop-blur-sm`}
                              >
                                <div className="font-semibold">{code}</div>
                                <div className="text-yellow-400 text-[0.6rem] mt-1 font-medium">
                                  {validCoupons[code].discount}% OFF
                                </div>
                                <div className="text-gray-400 text-[0.5rem] mt-1">
                                  Min ₹{validCoupons[code].minAmount}
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
                              className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm transition-all duration-200"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => applyCoupon(customCoupon)}
                              disabled={isApplyingCoupon || !customCoupon}
                              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-xs rounded-lg font-semibold transition-all duration-200 ${
                                isApplyingCoupon || !customCoupon
                                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                                  : "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg"
                              }`}
                            >
                              {isApplyingCoupon ? "Applying..." : "Apply"}
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {couponError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 text-red-400 text-sm flex items-center gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                        >
                          <Info size={14} />
                          <span>{couponError}</span>
                        </motion.div>
                      )}
                    </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {couponState.discount > 0 && (
                        <div className="flex justify-between text-green-400 bg-black/50 p-3 rounded-lg border border-green-400/30">
                          <span className="flex items-center gap-2">
                            <Sparkles size={16} />
                            Coupon Discount
                          </span>
                          <span className="font-bold">- ₹{couponState.discount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between border-t border-cyan-400/30 pt-4 font-bold text-xl bg-black/50 p-4 rounded-lg border border-cyan-400/30">
                        <span className="text-cyan-400">Total Amount</span>
                        <motion.span
                          key={finalPrice}
                          initial={{ scale: 1.2, color: "#00ff00" }}
                          animate={{ scale: 1, color: "#fbbf24" }}
                          transition={{ duration: 0.5, type: "spring" }}
                          className="font-bold text-2xl text-yellow-400"
                        >
                          ₹{finalPrice.toFixed(2)}
                        </motion.span>
                      </div>

                      {couponState.discount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center text-green-400 text-sm p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                        >
                          🎉 You saved ₹{couponState.discount.toFixed(2)} with coupon {couponState.code}!
                        </motion.div>
                      )}

                      {/* Order Summary */}
                      <div className="bg-black/30 p-4 rounded-lg border border-gray-600/30">
                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Order Summary:</h4>
                        <div className="space-y-2 text-xs">
                          {cartItems.map((item, index) => (
                            <div key={index} className="flex justify-between text-gray-400">
                              <span className="truncate">{item.title} x{item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t border-gray-600/30 pt-2 mt-2">
                            <div className="flex justify-between text-gray-300 font-semibold">
                              <span>Subtotal:</span>
                              <span>₹{cartSubtotal.toFixed(2)}</span>
                            </div>
                            {couponState.discount > 0 && (
                              <div className="flex justify-between text-green-400">
                                <span>Coupon Discount:</span>
                                <span>- ₹{couponState.discount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-yellow-400 font-bold">
                              <span>Total:</span>
                              <span>₹{finalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
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
                </motion.aside>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;