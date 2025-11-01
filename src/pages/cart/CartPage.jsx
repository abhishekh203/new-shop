import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/layout/Layout";
import { Trash, X, Check, Info, ShoppingCart, Minus, Plus, Sparkles, Star, Package } from "lucide-react";
import { 
  decrementQuantity, 
  deleteFromCart, 
  incrementQuantity 
} from "../../redux/cartSlice";
import { useEffect, useState } from "react";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import BuyNowModal from "../../components/buyNowModal/BuyNowModal";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { serifTheme } from "../../design-system/themes/serifTheme";
import { SerifPageWrapper, SerifButton, SerifEmptyState, SerifBadge } from "../../design-system/components";
import { useNotification } from "../../context/NotificationContext";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

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
  const notification = useNotification();
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
      
      notification.success(`Coupon applied! ${coupon.discount}% OFF - ${coupon.description}`, {
        icon: <Check className="text-base" />,
        duration: 3000
      });
      
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
    notification.success("Coupon removed", {
      icon: <FaTrash className="text-base" />,
      duration: 3000
    });
  };

  const handleRemoveItem = (item) => {
    setIsRemovingItem(item.id);
    setTimeout(() => {
      dispatch(deleteFromCart(item));
      setIsRemovingItem(null);
      notification.success("Item removed from cart", {
        icon: <FaTrash className="text-base" />,
        duration: 3000
      });
    }, 300);
  };

  const finalPrice = cartSubtotal - couponState.discount;

  // Updated buyNowFunction to navigate to purchase page with state
  const buyNowFunction = async () => {
    if (!addressInfo.name || !addressInfo.address || !addressInfo.whatsappNumber || !addressInfo.mobileNumber) {
      notification.error("All fields are required");
      return;
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
      notification.error("Failed to place order. Please try again.", {
        icon: <X className="text-base" />,
        duration: 4000
      });
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
      <SerifPageWrapper>
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
              {/* Cart Icon */}
              <motion.div
                className="relative inline-flex items-center justify-center w-20 h-20 mb-6"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(251, 191, 36, 0.3)",
                    "0 0 40px rgba(251, 146, 60, 0.4)",
                    "0 0 20px rgba(251, 191, 36, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className={`absolute inset-0 ${serifTheme.gradients.button} rounded-2xl blur-sm opacity-50`}></div>
                <div className={`relative ${serifTheme.gradients.card} backdrop-blur-sm ${serifTheme.radius.card} w-full h-full flex items-center justify-center border ${serifTheme.colors.border.secondary}`}>
                  <ShoppingCart size={36} className={serifTheme.colors.text.accent} />
                </div>
              </motion.div>

              {/* Title */}
              <h1 className={`text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${serifTheme.colors.text.primary}`}>
                <span className={serifTheme.gradients.accent}>
                  Shopping Cart
                </span>
              </h1>

              {/* Subtitle */}
              <motion.p
                className={`${serifTheme.colors.text.secondary} text-lg max-w-2xl mx-auto`}
                animate={{ opacity: [1, 0.8, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
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
                    className={`mb-6 p-6 ${serifTheme.gradients.card} ${serifTheme.radius.card} border ${serifTheme.colors.border.secondary} ${serifTheme.colors.shadow.card} relative overflow-hidden`}
                  >
                    <div className="relative flex items-center gap-3">
                      <motion.div
                        className={`p-2 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button}`}
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(251, 191, 36, 0.3)",
                            "0 0 20px rgba(251, 146, 60, 0.4)",
                            "0 0 10px rgba(251, 191, 36, 0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Package size={20} className={serifTheme.colors.text.accent} />
                      </motion.div>
                      <h2 className={`text-xl font-bold ${serifTheme.colors.text.accent}`}>Cart Items</h2>
                      <SerifBadge variant="primary" size="small">
                        {cartItemTotal} {cartItemTotal === 1 ? "item" : "items"}
                      </SerifBadge>
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
                              boxShadow: "0 0 30px rgba(251, 191, 36, 0.2), 0 0 60px rgba(251, 146, 60, 0.15)"
                            }}
                            className={`flex flex-col sm:flex-row items-center py-6 px-6 ${serifTheme.gradients.card} backdrop-blur-xl ${serifTheme.radius.card} border ${serifTheme.colors.border.secondary} ${serifTheme.colors.shadow.cardHover} relative overflow-hidden ${
                              isRemovingItem === id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                            } ${serifTheme.transitions.default}`}
                          >
                            {/* Accent Line */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${serifTheme.gradients.button}`}></div>
                            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                              <motion.div
                                whileHover={{ scale: 1.05, rotateZ: 1 }}
                                className="relative group"
                              >
                                {/* Hover Effect */}
                                <div className={`absolute -inset-1 ${serifTheme.gradients.button} ${serifTheme.radius.button} blur opacity-30 group-hover:opacity-50 ${serifTheme.transitions.default}`}></div>
                                <img
                                  src={productImageUrl}
                                  alt="Product"
                                  className={`relative h-24 w-24 ${serifTheme.radius.button} object-contain ${serifTheme.colors.background.tertiary} border ${serifTheme.colors.border.secondary} ${serifTheme.colors.shadow.card}`}
                                />
                              </motion.div>
                            </div>
                            <div className="flex-1 flex flex-col text-center sm:text-left mr-4">
                              <h3 className={`text-lg font-bold ${serifTheme.colors.text.accent} mb-1`}>{title}</h3>
                              <p className={`text-sm ${serifTheme.colors.text.secondary} mb-2 uppercase tracking-wider`}>{category}</p>
                              <p className={`text-2xl font-bold ${serifTheme.colors.text.accent}`}>
                                ₹{price}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                              {/* Decrease Button */}
                              <SerifButton
                                variant={quantity <= 1 ? "ghost" : "outline"}
                                size="small"
                                onClick={() => dispatch(decrementQuantity(id))}
                                disabled={quantity <= 1}
                                icon={<Minus size={16} />}
                                className="h-10 w-10 p-0"
                              />

                              {/* Quantity Display */}
                              <div className={`w-16 text-center border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} ${serifTheme.colors.background.card} ${serifTheme.colors.text.accent} px-3 py-2 text-lg font-bold ${serifTheme.colors.shadow.card}`}>
                                <motion.span
                                  key={quantity}
                                  initial={{ scale: 1.2 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {quantity.toString().padStart(2, '0')}
                                </motion.span>
                              </div>

                              {/* Increase Button */}
                              <SerifButton
                                variant="primary"
                                size="small"
                                onClick={() => dispatch(incrementQuantity(id))}
                                icon={<Plus size={16} />}
                                className="h-10 w-10 p-0"
                              />

                              {/* Delete Button */}
                              <SerifButton
                                variant="danger"
                                size="small"
                                onClick={() => handleRemoveItem(item)}
                                icon={<Trash size={16} />}
                                className="ml-2 h-10 w-10 p-0"
                              />
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <SerifEmptyState
                        icon={<ShoppingCart size={48} />}
                        title="Your cart is empty"
                        description="Add some items to get started"
                        actionLabel="Start Shopping"
                        onAction={() => navigate('/allproduct')}
                      />
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
                  className={`lg:w-1/3 ${serifTheme.gradients.card} backdrop-blur-xl p-6 ${serifTheme.colors.shadow.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.card} h-fit sticky top-10 relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    <div className={`flex items-center gap-3 mb-6 pb-4 border-b ${serifTheme.colors.border.primary}`}>
                      <motion.div
                        className={`p-2 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.accent} ${serifTheme.radius.button}`}
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(251, 191, 36, 0.3)",
                            "0 0 20px rgba(251, 146, 60, 0.4)",
                            "0 0 10px rgba(251, 191, 36, 0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Star size={20} className={serifTheme.colors.text.accent} />
                      </motion.div>
                      <h2 className={`text-xl font-bold ${serifTheme.colors.text.accent}`}>Order Summary</h2>
                    </div>

                    <div className="space-y-4">
                    <div className={`flex justify-between items-center ${serifTheme.colors.text.secondary} p-3 ${serifTheme.radius.button} border ${serifTheme.colors.border.primary} ${serifTheme.colors.background.card}`}>
                      <span className="flex items-center gap-2">
                        <Package size={16} />
                        Subtotal ({cartItemTotal} {cartItemTotal === 1 ? "item" : "items"})
                      </span>
                      <span className={`font-bold text-lg ${serifTheme.colors.text.primary}`}>₹{cartSubtotal.toFixed(2)}</span>
                    </div>

                    {/* Estimated Delivery */}
                    <div className={`flex justify-between items-center ${serifTheme.colors.text.secondary} ${serifTheme.colors.background.card} p-3 ${serifTheme.radius.button} border ${serifTheme.colors.border.secondary}`}>
                      <span className="flex items-center gap-2">
                        <Package size={16} />
                        Estimated Delivery
                      </span>
                      <span className={`font-bold text-sm ${serifTheme.colors.text.accent}`}>{getEstimatedDelivery()}</span>
                    </div>

                    {/* Manual Coupon Section */}
                    <div className={`mt-6 pt-6 border-t ${serifTheme.colors.border.primary}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className={serifTheme.colors.text.accent} />
                          <p className={`${serifTheme.colors.text.accent} font-bold`}>Coupon Discount</p>
                        </div>
                        {couponState.applied && (
                          <SerifButton
                            variant="ghost"
                            size="small"
                            onClick={removeCoupon}
                            icon={<X size={14} />}
                            className="text-xs"
                          >
                            Remove Coupon
                          </SerifButton>
                        )}
                      </div>

                      {/* Manual Coupon Display */}
                      {couponState.applied && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`${serifTheme.gradients.card} border ${serifTheme.colors.border.accent} ${serifTheme.radius.card} p-4 flex items-center justify-between backdrop-blur-sm mb-4`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1 ${serifTheme.gradients.button} ${serifTheme.radius.badge}`}>
                              <Check className="text-white" size={16} />
                            </div>
                            <div>
                              <span className={`font-semibold ${serifTheme.colors.text.primary}`}>{couponState.code}</span>
                              <p className={`text-xs ${serifTheme.colors.text.secondary} mt-1`}>{couponState.description}</p>
                            </div>
                            <SerifBadge variant="primary" size="small">
                              {couponState.discountPercentage}% OFF
                            </SerifBadge>
                          </div>
                          <span className={`${serifTheme.colors.text.accent} font-bold text-lg`}>- ₹{couponState.discount.toFixed(2)}</span>
                        </motion.div>
                      )}

                      {/* Manual Coupon Input */}
                      {!couponState.applied && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            {Object.keys(validCoupons).map((code) => (
                              <SerifButton
                                key={code}
                                variant="secondary"
                                size="small"
                                onClick={() => applyCoupon(code)}
                                disabled={isApplyingCoupon}
                                className="text-xs py-3 flex flex-col items-center"
                              >
                                <div className="font-semibold">{code}</div>
                                <div className={`${serifTheme.colors.text.accent} text-[0.6rem] mt-1 font-medium`}>
                                  {validCoupons[code].discount}% OFF
                                </div>
                                <div className={`${serifTheme.colors.text.muted} text-[0.5rem] mt-1`}>
                                  Min ₹{validCoupons[code].minAmount}
                                </div>
                              </SerifButton>
                            ))}
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Enter coupon code"
                              value={customCoupon}
                              onChange={(e) => setCustomCoupon(e.target.value.toUpperCase())}
                              className={`w-full ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.input} px-4 py-3 text-sm ${serifTheme.colors.text.primary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400/80 backdrop-blur-sm ${serifTheme.transitions.default}`}
                            />
                            <SerifButton
                              variant="primary"
                              size="small"
                              onClick={() => applyCoupon(customCoupon)}
                              disabled={isApplyingCoupon || !customCoupon}
                              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-xs"
                            >
                              {isApplyingCoupon ? "Applying..." : "Apply"}
                            </SerifButton>
                          </div>
                        </div>
                      )}

                      {couponError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-3 text-red-600 text-sm flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200`}
                        >
                          <Info size={14} />
                          <span>{couponError}</span>
                        </motion.div>
                      )}
                    </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {couponState.discount > 0 && (
                        <div className={`flex justify-between ${serifTheme.colors.text.secondary} p-3 ${serifTheme.radius.button} border ${serifTheme.colors.border.primary} ${serifTheme.colors.background.card}`}>
                          <span className="flex items-center gap-2">
                            <Sparkles size={16} />
                            Coupon Discount
                          </span>
                          <span className="font-bold">- ₹{couponState.discount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className={`flex justify-between border-t ${serifTheme.colors.border.primary} pt-4 font-bold text-xl ${serifTheme.colors.background.card} p-4 ${serifTheme.radius.button} border ${serifTheme.colors.border.secondary}`}>
                        <span className={serifTheme.colors.text.accent}>Total Amount</span>
                        <motion.span
                          key={finalPrice}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, type: "spring" }}
                          className={`font-bold text-2xl ${serifTheme.colors.text.accent}`}
                        >
                          ₹{finalPrice.toFixed(2)}
                        </motion.span>
                      </div>

                      {couponState.discount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`text-center ${serifTheme.colors.text.secondary} text-sm p-3 ${serifTheme.radius.button} border ${serifTheme.colors.border.secondary} ${serifTheme.colors.background.tertiary}`}
                        >
                          🎉 You saved ₹{couponState.discount.toFixed(2)} with coupon {couponState.code}!
                        </motion.div>
                      )}

                      {/* Order Summary */}
                      <div className={`${serifTheme.colors.background.card} p-4 ${serifTheme.radius.button} border ${serifTheme.colors.border.primary}`}>
                        <h4 className={`text-sm font-semibold ${serifTheme.colors.text.primary} mb-3`}>Order Summary:</h4>
                        <div className="space-y-2 text-xs">
                          {cartItems.map((item, index) => (
                            <div key={index} className={`flex justify-between ${serifTheme.colors.text.tertiary}`}>
                              <span className="truncate">{item.title} x{item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className={`border-t ${serifTheme.colors.border.primary} pt-2 mt-2`}>
                            <div className={`flex justify-between ${serifTheme.colors.text.secondary} font-semibold`}>
                              <span>Subtotal:</span>
                              <span>₹{cartSubtotal.toFixed(2)}</span>
                            </div>
                            {couponState.discount > 0 && (
                              <div className={`flex justify-between ${serifTheme.colors.text.secondary}`}>
                                <span>Coupon Discount:</span>
                                <span>- ₹{couponState.discount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className={`flex justify-between ${serifTheme.colors.text.accent} font-bold`}>
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
      </SerifPageWrapper>
    </Layout>
  );
};

export default CartPage;