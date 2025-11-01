import { Dialog, DialogBody } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, CreditCard, User, Globe, MapPin, Phone, X, Sparkles, AlertCircle, CheckCircle, MessageCircle } from "lucide-react";
import { serifTheme } from "../../design-system/themes/serifTheme";
import { SerifButton, SerifDropdown } from "../../design-system/components";
import { useNotification } from "../../context/NotificationContext";

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
    // State for field validation
    const [fieldErrors, setFieldErrors] = useState({});
    // State for form completion progress
    const [formProgress, setFormProgress] = useState(0);
    const notification = useNotification();

    // Country options for the dropdown
    const countryOptions = [
        { id: "Nepal", value: "Nepal", label: "🇳🇵 Nepal" },
        { id: "India", value: "India", label: "🇮🇳 India" },
        { id: "United States", value: "United States", label: "🇺🇸 United States" },
        { id: "United Kingdom", value: "United Kingdom", label: "🇬🇧 United Kingdom" },
        { id: "Australia", value: "Australia", label: "🇦🇺 Australia" },
        { id: "Canada", value: "Canada", label: "🇨🇦 Canada" },
        { id: "Other", value: "Other", label: "🌍 Other" },
    ];

    // Toggles the modal's visibility.
    const handleOpen = () => setOpen(!open);

    // Recalculate progress when addressInfo changes
    useEffect(() => {
        const requiredFields = ['name', 'address', 'country', 'whatsappNumber', 'mobileNumber'];
        const validFields = requiredFields.filter(field => {
            return !fieldErrors[field] && addressInfo[field]?.trim();
        });
        const progress = (validFields.length / requiredFields.length) * 100;
        setFormProgress(progress);
    }, [addressInfo, fieldErrors]);

    /**
     * Validates individual field and updates progress
     */
    const validateField = (fieldName, value) => {
        const errors = { ...fieldErrors };
        
        switch (fieldName) {
            case 'name':
                if (!value?.trim()) {
                    errors.name = 'Full name is required';
                } else if (value.trim().length < 2) {
                    errors.name = 'Name must be at least 2 characters';
                } else {
                    delete errors.name;
                }
                break;
            case 'address':
                if (!value?.trim()) {
                    errors.address = 'Address is required';
                } else {
                    delete errors.address;
                }
                break;
            case 'country':
                if (!value?.trim()) {
                    errors.country = 'Country is required';
                } else {
                    delete errors.country;
                }
                break;
            case 'whatsappNumber':
                if (!value?.trim()) {
                    errors.whatsappNumber = 'WhatsApp number is required';
                } else if (!/^\+\d{1,4}\s?\d{6,15}$/.test(value.trim())) {
                    errors.whatsappNumber = 'Enter valid WhatsApp number with country code';
                } else {
                    delete errors.whatsappNumber;
                }
                break;
            case 'mobileNumber':
                if (!value?.trim()) {
                    errors.mobileNumber = 'Mobile number is required';
                } else if (!/^\+\d{1,4}\s?\d{6,15}$/.test(value.trim())) {
                    errors.mobileNumber = 'Enter valid phone number with country code';
                } else {
                    delete errors.mobileNumber;
                }
                break;
            default:
                break;
        }
        
        setFieldErrors(errors);
        
        // Calculate form progress
        const requiredFields = ['name', 'address', 'country', 'whatsappNumber', 'mobileNumber'];
        const validFields = requiredFields.filter(field => {
            // Use the current value being validated if it matches the field, otherwise use addressInfo
            const fieldValue = field === fieldName ? value : addressInfo[field];
            return !errors[field] && fieldValue?.trim();
        });
        const progress = (validFields.length / requiredFields.length) * 100;
        setFormProgress(progress);
        
        return !errors[fieldName];
    };

    /**
     * Validates that all required address fields are filled.
     * @returns {boolean} - True if all fields are valid, false otherwise.
     */
    const validateFields = () => {
        const { name, address, country, whatsappNumber, mobileNumber } = addressInfo;
        const missingFields = [];

        if (!name?.trim()) missingFields.push("Full Name");
        if (!address?.trim()) missingFields.push("Address");
        if (!country?.trim()) missingFields.push("Country");
        if (!whatsappNumber?.trim()) missingFields.push("WhatsApp Number");
        if (!mobileNumber?.trim()) missingFields.push("Mobile Number");

        if (missingFields.length > 0) {
            notification.error(`Please fill in: ${missingFields.join(", ")}`, {
                icon: <AlertCircle className="text-base" />,
                duration: 4000
            });
            return false;
        }

        // Check for validation errors
        if (Object.keys(fieldErrors).length > 0) {
            notification.error("Please fix the validation errors before proceeding", {
                icon: <AlertCircle className="text-base" />,
                duration: 3000
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

        notification.success('Order confirmed! Processing payment...', {
            icon: <CheckCircle className="text-base" />,
            duration: 2000
        });

        // Simulate processing time before closing the modal and calling the final function.
        setTimeout(() => {
            setIsProcessing(false);
            handleOpen();
            buyNowFunction();
        }, 1000);
    };


    /**
     * Handles input changes with validation
     */
    const handleInputChange = (fieldName, value) => {
        setAddressInfo({
            ...addressInfo,
            [fieldName]: value,
        });
        validateField(fieldName, value);
    };

    return (
        <>
            {/* The primary button that opens the modal */}
            <SerifButton
                onClick={handleOpen}
                variant="primary"
                size="large"
                fullWidth
                icon={<Sparkles size={20} />}
                iconPosition="left"
                className="px-8 py-4 text-lg"
            >
                Proceed to Checkout
            </SerifButton>

            {/* The Modal Dialog, rendered conditionally with AnimatePresence */}
            <AnimatePresence>
                {open && (
                    <Dialog
                        open={open}
                        handler={handleOpen}
                        className={`fixed inset-0 z-[9998] grid h-screen w-screen place-items-center bg-transparent p-0 m-0 outline-none border-none shadow-none`}
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
                            className={`relative ${serifTheme.gradients.card} backdrop-blur-2xl ${serifTheme.radius.card} ${serifTheme.colors.shadow.card} border ${serifTheme.colors.border.secondary} overflow-hidden w-full max-w-md m-4`}
                            style={{ fontFamily: serifTheme.fontFamily.serif }}
                        >
                            {/* Decorative elements */}
                            <div className={`absolute top-0 left-0 w-full h-0.5 ${serifTheme.gradients.button}`}></div>
                            <div className={`absolute top-4 right-4 w-12 h-12 ${serifTheme.gradients.button} opacity-20 ${serifTheme.radius.badge} blur-xl`}></div>
                            
                            <DialogBody className={`p-6 ${serifTheme.colors.text.primary} relative`}>
                                <SerifButton
                                    onClick={handleOpen}
                                    variant="ghost"
                                    size="small"
                                    icon={<X size={14} />}
                                    className="absolute top-3 right-3 z-10 p-1.5"
                                    aria-label="Close dialog"
                                />

                                {/* Modal Header */}
                                <div className="text-center mb-6">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                                        className={`inline-flex items-center justify-center w-16 h-16 ${serifTheme.gradients.button} ${serifTheme.radius.button} mb-3 ${serifTheme.colors.shadow.card} relative`}
                                    >
                                        <Package size={24} className="text-white relative z-10" />
                                    </motion.div>
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className={`text-2xl font-bold ${serifTheme.gradients.accent}`}
                                    >
                                        Shipping Details
                                    </motion.h2>
                                    
                                    {/* Progress Bar */}
                                    <div className="mt-4 mb-6">
                                        <div className={`flex justify-between text-xs ${serifTheme.colors.text.tertiary} mb-2`}>
                                            <span>Form Progress</span>
                                            <span>{Math.round(formProgress)}%</span>
                                        </div>
                                        <div className={`w-full ${serifTheme.colors.background.card} ${serifTheme.radius.badge} h-2`}>
                                            <motion.div
                                                className={`${serifTheme.gradients.button} h-2 ${serifTheme.radius.badge}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${formProgress}%` }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Form Input Fields */}
                                <div className="space-y-4">
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                                        <label className={`block text-xs font-semibold ${serifTheme.colors.text.secondary} mb-2 ml-1 flex items-center gap-2`}>
                                            <User size={14} className={serifTheme.colors.text.accent} /> Full Name *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text" 
                                                name="name" 
                                                value={addressInfo.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                placeholder="Enter your full name"
                                                className={`w-full px-4 py-3 ${serifTheme.colors.background.card} border ${serifTheme.radius.input} ${serifTheme.colors.text.primary} placeholder-gray-400 outline-none ${serifTheme.transitions.default} focus:ring-2 font-medium ${
                                                    fieldErrors.name 
                                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                        : `${serifTheme.colors.border.secondary} focus:${serifTheme.colors.border.accent} focus:ring-amber-500/20`
                                                }`}
                                            />
                                            {fieldErrors.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`absolute -bottom-6 left-0 text-xs text-red-600 flex items-center gap-1`}
                                                >
                                                    <AlertCircle size={12} />
                                                    {fieldErrors.name}
                                                </motion.div>
                                            )}
                                            {!fieldErrors.name && addressInfo.name?.trim() && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                >
                                                    <CheckCircle size={16} className="text-green-600" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                                        <label className={`block text-xs font-semibold ${serifTheme.colors.text.secondary} mb-2 ml-1 flex items-center gap-2`}>
                                            <Globe size={14} className={serifTheme.colors.text.accent} /> Country *
                                        </label>
                                        <div className="relative">
                                            <SerifDropdown
                                                options={countryOptions}
                                                value={addressInfo.country || ""}
                                                onChange={(value) => {
                                                    setAddressInfo({
                                                        ...addressInfo,
                                                        country: value,
                                                    });
                                                    validateField('country', value);
                                                }}
                                                placeholder="Select your country"
                                                icon={<Globe size={14} />}
                                                triggerClassName={`w-full ${fieldErrors.country ? 'border-red-500' : ''}`}
                                            />
                                            {fieldErrors.country && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`absolute -bottom-6 left-0 text-xs text-red-600 flex items-center gap-1`}
                                                >
                                                    <AlertCircle size={12} />
                                                    {fieldErrors.country}
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                                        <label className={`block text-xs font-semibold ${serifTheme.colors.text.secondary} mb-2 ml-1 flex items-center gap-2`}>
                                            <MapPin size={14} className={serifTheme.colors.text.accent} /> Full Address *
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                name="address" 
                                                value={addressInfo.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                placeholder="Street, City, State, Country"
                                                rows={3}
                                                className={`w-full px-4 py-3 ${serifTheme.colors.background.card} border ${serifTheme.radius.input} ${serifTheme.colors.text.primary} placeholder-gray-400 outline-none ${serifTheme.transitions.default} focus:ring-2 font-medium resize-none ${
                                                    fieldErrors.address 
                                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                        : `${serifTheme.colors.border.secondary} focus:${serifTheme.colors.border.accent} focus:ring-amber-500/20`
                                                }`}
                                            />
                                            {fieldErrors.address && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`absolute -bottom-6 left-0 text-xs text-red-600 flex items-center gap-1`}
                                                >
                                                    <AlertCircle size={12} />
                                                    {fieldErrors.address}
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                                            <label className={`block text-xs font-semibold ${serifTheme.colors.text.secondary} mb-2 ml-1 flex items-center gap-2`}>
                                                <MessageCircle size={14} className={serifTheme.colors.text.accent} /> WhatsApp Number *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="tel" 
                                                    name="whatsappNumber" 
                                                    value={addressInfo.whatsappNumber}
                                                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                                                    placeholder="+977980"
                                                    className={`w-full px-4 py-3 ${serifTheme.colors.background.card} border ${serifTheme.radius.input} ${serifTheme.colors.text.primary} placeholder-gray-400 outline-none ${serifTheme.transitions.default} focus:ring-2 font-medium ${
                                                        fieldErrors.whatsappNumber 
                                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                            : `${serifTheme.colors.border.secondary} focus:${serifTheme.colors.border.accent} focus:ring-amber-500/20`
                                                    }`}
                                                />
                                                {fieldErrors.whatsappNumber && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className={`absolute -bottom-6 left-0 text-xs text-red-600 flex items-center gap-1`}
                                                    >
                                                        <AlertCircle size={12} />
                                                        {fieldErrors.whatsappNumber}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
                                            <label className={`block text-xs font-semibold ${serifTheme.colors.text.secondary} mb-2 ml-1 flex items-center gap-2`}>
                                                <Phone size={14} className={serifTheme.colors.text.accent} /> Mobile *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="tel" 
                                                    name="mobileNumber" 
                                                    value={addressInfo.mobileNumber}
                                                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                                    placeholder="+977980"
                                                    className={`w-full px-4 py-3 ${serifTheme.colors.background.card} border ${serifTheme.radius.input} ${serifTheme.colors.text.primary} placeholder-gray-400 outline-none ${serifTheme.transitions.default} focus:ring-2 font-medium ${
                                                        fieldErrors.mobileNumber 
                                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                            : `${serifTheme.colors.border.secondary} focus:${serifTheme.colors.border.accent} focus:ring-amber-500/20`
                                                    }`}
                                                />
                                                {fieldErrors.mobileNumber && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className={`absolute -bottom-6 left-0 text-xs text-red-600 flex items-center gap-1`}
                                                    >
                                                        <AlertCircle size={12} />
                                                        {fieldErrors.mobileNumber}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                                
                                {/* Final Confirmation Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0 }}
                                    className="mt-8"
                                >
                                    <SerifButton
                                        type="button"
                                        onClick={handleConfirmPurchase}
                                        disabled={isProcessing || formProgress < 100}
                                        variant={formProgress >= 100 && !isProcessing ? "primary" : "secondary"}
                                        size="large"
                                        fullWidth
                                        loading={isProcessing}
                                        icon={
                                            !isProcessing && formProgress < 100 ? (
                                                <AlertCircle size={18} />
                                            ) : !isProcessing && formProgress >= 100 ? (
                                                <CreditCard size={18} />
                                            ) : null
                                        }
                                        className={`px-6 py-4 text-base ${formProgress < 100 ? 'opacity-75' : ''}`}
                                    >
                                        {isProcessing ? "Processing..." : formProgress < 100 ? `Complete Form (${Math.round(formProgress)}%)` : "Confirm & Pay"}
                                    </SerifButton>
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
