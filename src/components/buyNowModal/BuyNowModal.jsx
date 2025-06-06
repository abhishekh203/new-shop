    import { Button, Dialog, DialogBody } from "@material-tailwind/react";
    import { useState } from "react";
    // Removed useNavigate from here as CartPage will handle navigation after successful order
    import { motion, AnimatePresence } from "framer-motion"; // For animations
    import { Package, CreditCard, Info, X } from "lucide-react"; // Icons
    import toast from 'react-hot-toast'; // For notifications

    const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction, cartTotal, itemCount }) => {
        const [open, setOpen] = useState(false);

        const handleOpen = () => setOpen(!open);

        // Enhanced validation from previous good version
        const validateFields = () => {
            const { name, address, country, pincode, mobileNumber } = addressInfo;
            const errors = [];
            if (!name?.trim()) errors.push("Full Name");
            if (!address?.trim()) errors.push("Full Address");
            if (!country?.trim()) errors.push("Country"); // Added country validation
            if (!pincode?.trim()) errors.push("Pincode");
            if (!mobileNumber?.trim()) errors.push("Mobile Number");
            if (mobileNumber?.trim() && !/^\+?[0-9\s-]{7,15}$/.test(mobileNumber.trim())) {
                errors.push("Valid Mobile Number (7-15 digits)");
            }

            if (errors.length > 0) {
                toast.error(
                    <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold flex items-center gap-1.5"><Info size={16}/> Please fill required fields:</span>
                        <ul className="list-disc list-inside text-xs">
                            {errors.map(field => <li key={field}>{field}</li>)}
                        </ul>
                    </div>,
                    { duration: 4000 }
                );
                return false;
            }
            return true;
        };

        const handleConfirmPurchase = () => {
            if (!validateFields()) {
                return; // Stop if validation fails
            }
            // Call the buyNowFunction passed from CartPage.jsx
            // This function in CartPage will handle Firebase interaction and navigation.
            buyNowFunction();
            
            // Optionally close the modal. Consider closing it only if buyNowFunction indicates success,
            // or let CartPage handle modal state if more complex flow is needed.
            // For now, we assume buyNowFunction will give immediate feedback (toast) and CartPage navigates.
            if (open) { // Only try to close if it's open
            handleOpen();
            }
        };

        // Generic input handler to update addressInfo state in CartPage
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setAddressInfo(prevInfo => ({
                ...prevInfo,
                [name]: value,
            }));
        };
        
        // Animation variants from previous good version
        const modalVariants = {
            hidden: { opacity: 0, scale: 0.9, y: -30 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
            exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2, ease: "easeIn" } }
        };

        return (
            <>
                {/* Button to trigger the modal - styling from previous good version */}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        type="button"
                        onClick={handleOpen}
                        disabled={itemCount === 0} // Disable if cart is empty
                        className={`w-full px-6 py-3 text-base font-bold text-white rounded-lg shadow-lg
                                    transition-all duration-300 ease-in-out transform hover:shadow-xl active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500
                                    ${itemCount === 0
                                        ? 'bg-gray-600 cursor-not-allowed opacity-70'
                                        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110' // User's preferred button style
                                    }`}
                    >
                        <span className="relative flex items-center justify-center gap-2">
                            <CreditCard size={20} /> Proceed to Checkout
                        </span>
                    </Button>
                </motion.div>

                <AnimatePresence>
                    {open && (
                        // Using Material Tailwind Dialog with Framer Motion for content
                        <Dialog
                            open={open}
                            handler={handleOpen} // Allows closing by clicking outside, ESC key
                            className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm p-0 m-0 outline-none border-none shadow-none"
                            animate={{
                                mount: { opacity: 1, y: 0, scale: 1 },
                                unmount: { opacity: 0, y: 25, scale: 0.9 },
                            }}
                        >
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
                                className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden w-full max-w-md m-4"
                            >
                                <DialogBody className="p-6 sm:p-8 text-gray-200 relative">
                                    <button
                                        onClick={handleOpen}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors z-10 p-1 rounded-full hover:bg-gray-700"
                                        aria-label="Close dialog"
                                    >
                                        <X size={20} />
                                    </button>

                                    <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-white flex items-center justify-center gap-2">
                                        <Package size={24} className="text-indigo-400"/> Shipping Details
                                    </h2>

                                    {/* Order Summary in Modal - from previous good version */}
                                    <div className="mb-6 p-4 bg-gray-900/60 rounded-lg border border-gray-700/50 text-sm">
                                        <h3 className="font-semibold text-base mb-2 text-gray-300">Order Summary</h3>
                                        <div className="flex justify-between text-gray-300 mb-1">
                                            <span>Items ({itemCount})</span>
                                            <span>₹{cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-white font-semibold text-base mt-2 pt-2 border-t border-gray-700">
                                            <span>Total Payable</span>
                                            <span>₹{cartTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Input Fields - using map like previous good version */}
                                    <div className="space-y-4">
                                        {[
                                            { id: "name", name: "name", label: "Full Name", placeholder: "Enter your full name", type: "text" },
                                            // Added Country dropdown
                                            { id: "country", name: "country", label: "Country", placeholder: "Select your country", type: "select", options: ["", "Nepal", "India", "United States", "United Kingdom", "Australia", "Canada", "Other"] },
                                            { id: "address", name: "address", label: "Full Address", placeholder: "Street, City, State", type: "text" },
                                            { id: "pincode", name: "pincode", label: "Pincode / Zip Code", placeholder: "Enter Pincode", type: "text" }, // Changed type to text for pincode
                                            { id: "mobileNumber", name: "mobileNumber", label: "Mobile Number", placeholder: "e.g., +977980...", type: "tel" },
                                        ].map(field => (
                                            <div key={field.id}>
                                                <label htmlFor={field.id} className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
                                                {field.type === 'select' ? (
                                                    <select
                                                        id={field.id}
                                                        name={field.name}
                                                        value={addressInfo[field.name] || ""}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 outline-none appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out cursor-pointer"
                                                    >
                                                        {field.options.map(opt => (
                                                            <option key={opt} value={opt} disabled={opt === ""} className={opt === "" ? "text-gray-500" : "text-white bg-gray-800"}>
                                                                {opt === "" ? field.placeholder : opt}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        id={field.id}
                                                        type={field.type}
                                                        name={field.name}
                                                        value={addressInfo[field.name] || ''}
                                                        onChange={handleInputChange}
                                                        placeholder={field.placeholder}
                                                        className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8">
                                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="button"
                                                onClick={handleConfirmPurchase}
                                                className="w-full px-6 py-3 text-base font-bold text-white rounded-lg shadow-lg
                                                            bg-gradient-to-r from-emerald-500 via-green-500 to-lime-600
                                                            transition-all duration-300 ease-in-out transform hover:shadow-xl hover:brightness-110 active:scale-[0.97]
                                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
                                            >
                                                <span className="relative flex items-center justify-center gap-2">
                                                    ✅ Confirm & Pay (₹{cartTotal.toFixed(2)})
                                                </span>
                                            </Button>
                                        </motion.div>
                                    </div>
                                </DialogBody>
                            </motion.div>
                        </Dialog>
                    )}
                </AnimatePresence>
            </>
        );
    };

    export default BuyNowModal;
