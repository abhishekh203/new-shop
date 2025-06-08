import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, CreditCard, User, Globe, MapPin, Phone, X, Sparkles } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

/**
 * A highly stylized and compact modal for handling the final steps of a purchase.
 * It collects user address information and triggers the final purchase function.
 *
 * @param {object} props - The component props.
 * @param {object} props.addressInfo - State object for the user's address.
 * @param {Function} props.setAddressInfo - Function to update the address state.
 * @param {Function} props.buyNowFunction - The function to call when the purchase is confirmed.
 */
const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction }) => {
    // State to manage the modal's visibility (open/closed).
    const [open, setOpen] = useState(false);
    // State to manage the processing state of the purchase button.
    const [isProcessing, setIsProcessing] = useState(false);

    // Toggles the modal's visibility.
    const handleOpen = () => setOpen(!open);

    /**
     * Validates that all required address fields are filled.
     * @returns {boolean} - True if all fields are valid, false otherwise.
     */
    const validateFields = () => {
        const { name, address, country, pincode, mobileNumber } = addressInfo;
        const missingFields = [];

        if (!name?.trim()) missingFields.push("Full Name");
        if (!address?.trim()) missingFields.push("Address");
        if (!country?.trim()) missingFields.push("Country");
        if (!pincode?.trim()) missingFields.push("Pincode");
        if (!mobileNumber?.trim()) missingFields.push("Mobile Number");

        if (missingFields.length > 0) {
            toast.error(`Please fill in: ${missingFields.join(", ")}`, {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                    color: '#fff',
                    border: '1px solid #ef4444',
                },
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                }
            });
            return false;
        }
        return true;
    };

    /**
     * Handles the final purchase confirmation.
     * Validates fields, shows processing state, and calls the parent's purchase function.
     */
    const handleConfirmPurchase = () => {
        if (!validateFields()) {
            return;
        }

        setIsProcessing(true);

        toast.success('Order confirmed! Processing payment...', {
            duration: 2000,
            position: 'top-center',
            style: {
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#fff',
                border: '1px solid #10b981',
            },
            iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
            }
        });

        // Simulate processing time before closing the modal and calling the final function.
        setTimeout(() => {
            setIsProcessing(false);
            handleOpen();
            buyNowFunction();
        }, 1000);
    };

    /**
     * Updates the country in the address information state.
     * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event from the select input.
     */
    const handleCountryChange = (e) => {
        setAddressInfo({
            ...addressInfo,
            country: e.target.value,
        });
    };

    return (
        <>
            {/* Toaster for displaying notifications above all other content */}
            <Toaster containerStyle={{ zIndex: 10000 }} />

            {/* The primary button that opens the modal */}
            <motion.div
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                className="relative group"
            >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400 rounded-2xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
                <Button
                    type="button"
                    onClick={handleOpen}
                    className="relative w-full px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 rounded-2xl shadow-xl transition-all duration-300 border border-gray-700/80"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative flex items-center justify-center gap-3">
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles size={20} className="text-amber-400" />
                        </motion.div>
                        <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent font-medium">
                            Proceed to Checkout
                        </span>
                        <CreditCard size={18} className="text-emerald-400" />
                    </span>
                </Button>
            </motion.div>

            {/* The Modal Dialog, rendered conditionally with AnimatePresence */}
            <AnimatePresence>
                {open && (
                    <Dialog
                        open={open}
                        handler={handleOpen}
                        className="fixed inset-0 z-[9998] grid h-screen w-screen place-items-center bg-slate-900/80 backdrop-blur-xl p-0 m-0 outline-none border-none shadow-none"
                        animate={{
                            mount: { opacity: 1, y: 0, scale: 1 },
                            unmount: { opacity: 0, y: 25, scale: 0.9 },
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.3, ease: "easeOut", type: "spring", stiffness: 400, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-gray-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden w-full max-w-xs m-4"
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400"></div>
                            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rounded-full blur-xl"></div>
                            
                            <DialogBody className="p-4 text-gray-200 relative">
                                <motion.button
                                    onClick={handleOpen}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-200 transition-colors z-10 p-1.5 rounded-full hover:bg-gray-700/50 group"
                                    aria-label="Close dialog"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={14} className="transition-transform duration-300" />
                                </motion.button>

                                {/* Modal Header */}
                                <div className="text-center mb-4">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                                        className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 via-pink-400 to-amber-400 rounded-xl mb-2 shadow-lg relative"
                                    >
                                        <Package size={20} className="text-white relative z-10" />
                                    </motion.div>
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent"
                                    >
                                        Shipping Details
                                    </motion.h2>
                                </div>

                                {/* Form Input Fields */}
                                <div className="space-y-3">
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 ml-1 flex items-center gap-2">
                                            <User size={14} className="text-pink-400" /> Full Name
                                        </label>
                                        <input
                                            type="text" name="name" value={addressInfo.name}
                                            onChange={(e) => setAddressInfo({ ...addressInfo, name: e.target.value })}
                                            placeholder="Enter your full name"
                                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 outline-none transition-all duration-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 font-medium"
                                        />
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 ml-1 flex items-center gap-2">
                                            <Globe size={14} className="text-cyan-400" /> Country
                                        </label>
                                        <select
                                            name="country" value={addressInfo.country || ""}
                                            onChange={handleCountryChange}
                                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-medium"
                                        >
                                            <option value="" disabled className="text-gray-500">Select your country</option>
                                            <option value="Nepal" className="text-gray-200 bg-gray-800">Nepal</option>
                                            <option value="India" className="text-gray-200 bg-gray-800">India</option>
                                            <option value="United States" className="text-gray-200 bg-gray-800">United States</option>
                                            <option value="United Kingdom" className="text-gray-200 bg-gray-800">United Kingdom</option>
                                            <option value="Australia" className="text-gray-200 bg-gray-800">Australia</option>
                                            <option value="Canada" className="text-gray-200 bg-gray-800">Canada</option>
                                            <option value="Other" className="text-gray-200 bg-gray-800">Other</option>
                                        </select>
                                    </motion.div>
                                    
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 ml-1 flex items-center gap-2">
                                            <MapPin size={14} className="text-amber-400" /> Full Address
                                        </label>
                                        <input
                                            type="text" name="address" value={addressInfo.address}
                                            onChange={(e) => setAddressInfo({ ...addressInfo, address: e.target.value })}
                                            placeholder="Street, City, State"
                                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 outline-none transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 font-medium"
                                        />
                                    </motion.div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                                            <label className="block text-xs font-semibold text-gray-400 mb-1.5 ml-1 flex items-center gap-2">
                                                <MapPin size={14} className="text-emerald-400" /> Pincode
                                            </label>
                                            <input
                                                type="text" name="pincode" value={addressInfo.pincode}
                                                onChange={(e) => setAddressInfo({ ...addressInfo, pincode: e.target.value })}
                                                placeholder="Zip Code"
                                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 font-medium"
                                            />
                                        </motion.div>
                                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
                                            <label className="block text-xs font-semibold text-gray-400 mb-1.5 ml-1 flex items-center gap-2">
                                                <Phone size={14} className="text-blue-400" /> Mobile
                                            </label>
                                            <input
                                                type="tel" name="mobileNumber" value={addressInfo.mobileNumber}
                                                onChange={(e) => setAddressInfo({ ...addressInfo, mobileNumber: e.target.value })}
                                                placeholder="+977..."
                                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 outline-none transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 font-medium"
                                            />
                                        </motion.div>
                                    </div>
                                </div>
                                
                                {/* Final Confirmation Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0 }}
                                    className="relative group mt-5"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-pink-400 rounded-2xl blur-sm opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
                                    <Button
                                        type="button"
                                        onClick={handleConfirmPurchase}
                                        disabled={isProcessing}
                                        className={`relative w-full px-6 py-3 text-base font-bold rounded-2xl shadow-xl transition-all duration-300 border ${
                                            isProcessing
                                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600'
                                                : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:to-gray-700 text-white border-gray-700/50'
                                        }`}
                                    >
                                        {!isProcessing && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                        )}
                                        <span className="relative flex items-center justify-center gap-2">
                                            {isProcessing ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="font-semibold">Processing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard size={18} className="text-emerald-400" />
                                                    <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent font-bold">
                                                        Confirm & Pay
                                                    </span>
                                                </>
                                            )}
                                        </span>
                                    </Button>
                                </motion.div>
                            </DialogBody>
                        </motion.div>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    );
};

export default BuyNowModal;
