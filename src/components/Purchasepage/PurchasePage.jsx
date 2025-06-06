import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCircle, Download, ArrowLeft, Upload, X, MessageCircle, Smartphone, Mail, Send, HelpCircle, Image as ImageIcon, Info } from "lucide-react"; // Added Info
// Using Material UI components for form elements
import { TextField, Button as MuiButton, CircularProgress } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles'; // For theming MUI components
import emailjs from "@emailjs/browser";
import { toast, ToastContainer } from "react-toastify"; // Using react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

// --- Payment Methods Configuration ---
// Ensure image paths are correct relative to the public folder or served correctly
const paymentMethods = {
  esewa: {
    qr: "/img/esewa.jpg", // Assuming images are in public/img
    number: "9807677391",
    color: "#5e35b1", // Purple
    name: "eSewa",
    icon: "🇳🇵", // Using emoji for simplicity
    bgColor: "bg-[#5e35b1]",
    textColor: "text-white",
    borderColor: "border-[#5e35b1]"
  },
  khalti: {
    qr: "/img/khalti.jpg",
    number: "9807677391",
    color: "#5c2d91", // Darker Purple
    name: "Khalti",
    icon: "🇳🇵",
    bgColor: "bg-[#5c2d91]",
    textColor: "text-white",
    borderColor: "border-[#5c2d91]"
  },
  ime: {
    qr: "/img/imepay.jpg",
    number: "9807677391",
    color: "#0066cc", // Blue
    name: "IME Pay",
    icon: "🇳🇵",
    bgColor: "bg-[#0066cc]",
    textColor: "text-white",
    borderColor: "border-[#0066cc]"
  },
};

// --- MUI Theme for Dark Mode ---
// Customizes Material UI components to fit the dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#60a5fa' }, // Tailwind blue-400
    secondary: { main: '#9ca3af' }, // Tailwind gray-400
    background: { paper: '#1f2937', default: '#111827' }, // Tailwind gray-800, gray-900
    text: { primary: '#e5e7eb', secondary: '#9ca3af' }, // Tailwind gray-200, gray-400
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px', // Slightly less rounded
          backgroundColor: 'rgba(55, 65, 81, 0.6)', // Tailwind gray-700 with alpha
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#60a5fa', // blue-400 on hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#60a5fa', // blue-400 when focused
          },
           '&.Mui-disabled': { // Style for disabled state
            backgroundColor: 'rgba(55, 65, 81, 0.3)', // More faded background
            color: '#9ca3af', // gray-400 text
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(75, 85, 99, 0.3)', // Faded border
            },
          },
        },
        notchedOutline: {
          borderColor: 'rgba(75, 85, 99, 0.5)', // Tailwind gray-600 with less alpha
        },
        input: {
          color: '#e5e7eb', // gray-200
           fontSize: '0.95rem', // Slightly smaller font
           '&.Mui-disabled': { // Ensure disabled input text color is correct
             WebkitTextFillColor: '#9ca3af', // For Chrome/Safari
             color: '#9ca3af',
           },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#9ca3af', // gray-400
          fontSize: '0.95rem',
          '&.Mui-focused': {
            color: '#60a5fa', // blue-400 when focused
          },
          '&.Mui-disabled': { // Style for disabled label
            color: '#9ca3af', // gray-400
          },
        },
      },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: '10px',
                textTransform: 'none',
                padding: '10px 18px', // Adjusted padding
                fontWeight: 600,
                transition: 'background-color 0.3s ease, transform 0.1s ease', // Smooth transitions
                 '&:active': {
                    transform: 'scale(0.98)', // Add slight scale down on click
                }
            }
        }
    },
     MuiFormHelperText: { // Style helper text
      styleOverrides: {
        root: {
          color: '#9ca3af', // gray-400
          fontSize: '0.75rem',
          marginLeft: '10px', // Add some margin
        },
      },
    },
     MuiCircularProgress: { // Style spinner
        styleOverrides: {
            root: {
                color: '#e5e7eb', // gray-200
            }
        }
     }
  },
});

// --- Animation Variants ---
const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } },
};

const columnVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } }, // Stagger children animation
};

const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } } // Added exit variant
};

const modalOverlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
};

const modalContentVariants = {
    initial: { scale: 0.9, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", damping: 15, stiffness: 200, delay: 0.1 } },
    exit: { scale: 0.9, opacity: 0, y: 20, transition: { duration: 0.2 } },
};

// --- Component ---
const PurchasePage = () => {
  // --- Hooks ---
  const location = useLocation();
  const navigate = useNavigate();

  // --- State ---
  const { totalAmount = 0, discountApplied = 0, orderId = null } = location.state || {}; // Get orderId if passed
  const user = JSON.parse(localStorage.getItem('users')); // Get user info

  const [selectedMethod, setSelectedMethod] = useState("esewa"); // Default payment method
  const [paymentConfirmed, setPaymentConfirmed] = useState(false); // Checkbox state
  const [copied, setCopied] = useState(false); // Copy button state
  const [screenshot, setScreenshot] = useState(null); // Screenshot file object
  const [previewImage, setPreviewImage] = useState(null); // Screenshot preview (base64)
  const [userMessage, setUserMessage] = useState(""); // Optional message from user
  const [error, setError] = useState(null); // Screenshot upload/validation error
  const [showHelp, setShowHelp] = useState(false); // Help tooltip visibility
  const [showForm, setShowForm] = useState(false); // Email details form visibility
  const [formData, setFormData] = useState({ // State for email form
    name: user?.name || "",
    email: user?.email || "",
    message: "", // Purchased items description (required in form)
    orderId: orderId || "N/A",
    paymentMethod: paymentMethods[selectedMethod].name,
    paymentAmount: totalAmount.toFixed(2),
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission/email sending
  const [isMobile, setIsMobile] = useState(false); // Detect mobile device
  const [showEmailNotice, setShowEmailNotice] = useState(false); // Email notice popup visibility
  const [countdown, setCountdown] = useState(10); // Countdown for redirect

  // --- Effects ---

  // Check if mobile on mount/resize
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768); // Use 768px as breakpoint for md
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Countdown timer for email notice redirect
  useEffect(() => {
    let timer;
    if (showEmailNotice && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showEmailNotice && countdown === 0) {
      navigate("/user-dashboard"); // Redirect after countdown
    }
    return () => clearTimeout(timer); // Cleanup timer on unmount or state change
  }, [showEmailNotice, countdown, navigate]);

  // Update formData's paymentMethod when selectedMethod changes
  useEffect(() => {
      setFormData(prev => ({...prev, paymentMethod: paymentMethods[selectedMethod].name}));
  }, [selectedMethod]);

  // --- Helper Functions ---

  // Copy payment number to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentMethods[selectedMethod].number)
        .then(() => {
            setCopied(true);
            toast.info("Payment number copied!", { autoClose: 2000 });
            setTimeout(() => setCopied(false), 2500); // Reset copied state after 2.5s
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            toast.error("Failed to copy number.");
        });
  };

  // Download QR code image
  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = paymentMethods[selectedMethod].qr; // Path to the QR image
    link.download = `${selectedMethod}-QR.jpg`; // Filename for download
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link); // Clean up the link element
    toast.info("QR Code download started.", { autoClose: 2000 });
  };

  // Handle screenshot file selection and validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return; // Exit if no file selected

    setError(null); // Clear previous errors

    // Validation: Size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }
    // Validation: Type (JPEG, PNG, GIF)
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
      setError("Invalid file type. Please upload JPG, PNG, or GIF.");
      return;
    }

    setScreenshot(file); // Store the file object

    // Generate base64 preview for display
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  // Remove selected/previewed screenshot
  const removeScreenshot = () => {
    setScreenshot(null);
    setPreviewImage(null);
    // Reset the file input value so the same file can be selected again if needed
    const fileInput = document.getElementById('screenshot-upload');
    if (fileInput) fileInput.value = '';
  };

  // Update form data state on input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- EmailJS Form Submission ---
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Require purchased items description
    if (!formData.message.trim()) {
        toast.error("Please specify the purchased item(s).");
        return;
    }
    setIsLoading(true); // Show loading indicator

    // EmailJS Configuration (Replace with your actual IDs/Key - consider environment variables)
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_dgntc8y";
    const adminTemplateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID || "template_7zskxuh";
    const autoReplyTemplateId = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID || "template_ycui5a3";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "xXLe-IsfnrrGoajcY";

    // Prepare template parameters for EmailJS
    const templateParams = {
      ...formData, // Includes name, email, message, orderId, paymentMethod, paymentAmount
      to_name: formData.name, // Specific field for auto-reply template greeting
      reply_to: formData.email, // Standard field for easy reply
      paymentScreenshotStatus: previewImage ? "Screenshot Attached (via WhatsApp)" : "Screenshot Not Provided",
      additionalMessage: userMessage || "None", // Include optional user message
    };

    // Send email to Admin, then send auto-reply to User
    emailjs.send(serviceId, adminTemplateId, templateParams, publicKey)
      .then(() => {
        console.log('Admin email SUCCESS!');
        return emailjs.send(serviceId, autoReplyTemplateId, templateParams, publicKey); // Chain the auto-reply
      })
      .then(() => {
        console.log('Auto-reply email SUCCESS!');
        toast.success("Details submitted! Proceeding to WhatsApp confirmation.");
        setShowForm(false); // Close the form modal
        sendViaWhatsApp(); // Trigger WhatsApp confirmation
      })
      .catch((err) => {
        console.error('EmailJS FAILED...', err);
        toast.error("Email submission failed. Please try WhatsApp directly or contact support.");
      })
      .finally(() => {
        setIsLoading(false); // Hide loading indicator
      });
  };

  // --- WhatsApp Confirmation ---
  const sendViaWhatsApp = () => {
    // Prerequisite checks
    if (!paymentConfirmed) {
      toast.error("Please confirm you've completed the payment first.");
      setError("Please confirm you've completed the payment.");
      return;
    }
    if (!isMobile && !screenshot) {
      toast.error("Please upload your payment screenshot before confirming.");
      setError("Please upload your payment screenshot.");
      return;
    }

    // Construct the WhatsApp message body
    const message = `*Payment Confirmation*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      (formData.orderId !== "N/A" ? `*Order ID:* ${formData.orderId}\n` : '') +
      `*Method:* ${paymentMethods[selectedMethod].name} ${paymentMethods[selectedMethod].icon}\n` +
      `*Amount:* ₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n` +
      `*Paid To:* ${paymentMethods[selectedMethod].number}\n` +
      `*Purchased Items:* ${formData.message}\n` + // Items description from form
      (userMessage ? `*Additional Message:* ${userMessage}\n` : '') +
      `\n` +
      `Please verify this payment. ${!isMobile ? 'Screenshot has been uploaded.' : 'Screenshot will be sent directly.'}`;

    const whatsappNumber = "+9779807677391"; // Replace with your actual WhatsApp number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp link (opens app on mobile, web on desktop)
    window.open(whatsappUrl, '_blank');

    // Show the email notice popup after initiating WhatsApp
    setShowEmailNotice(true);
  };

  // Handle click on the main "Confirm via WhatsApp" button
  const handleWhatsAppClick = () => {
    // If the required item description isn't filled and the form isn't already open, show the form
    if (!formData.message.trim() && !showForm) {
      setShowForm(true);
      toast.info("Please specify the item(s) purchased before confirming.");
    }
    // If the form is already open but the message is still empty, remind the user
    else if (!formData.message.trim() && showForm) {
        toast.error("Please specify the item(s) purchased in the form.");
    }
    // Otherwise (message is filled or form not needed), proceed to WhatsApp
     else {
      sendViaWhatsApp();
    }
  };

  // --- Calculated Values for Display ---
  const subtotal = totalAmount + discountApplied;
  const formattedAmount = totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedDiscount = discountApplied.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedSubtotal = subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const currentMethod = paymentMethods[selectedMethod]; // Get current payment method details

  // --- JSX Structure ---
  return (
    <ThemeProvider theme={darkTheme}>
      <ToastContainer theme="dark" position="top-center" autoClose={3000} />
      {/* Page Container with Black/Grey Gradient Background */}
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 sm:p-6 font-sans text-gray-200">
        {/* Main Card - Wider for two columns */}
        <motion.div
          className="w-full max-w-4xl bg-gray-950/60 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Header with Dynamic Background */}
          <div
            className={`p-5 border-b border-gray-800/50 relative transition-colors duration-300 ${currentMethod.bgColor}`} // Dynamic BG color
          >
             <div className="flex items-center justify-between">
               {/* Back Button */}
               <motion.button onClick={() => navigate(-1)} className="p-2 rounded-full bg-black/25 hover:bg-black/40 transition-colors text-white" aria-label="Go back" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}> <ArrowLeft size={20} /> </motion.button>
               {/* Title */}
               <h1 className="text-xl font-bold text-white"> Complete Payment </h1>
               {/* Help Button */}
               <motion.button onClick={() => setShowHelp(!showHelp)} className="p-2 rounded-full bg-black/25 hover:bg-black/40 transition-colors text-white" aria-label="Help" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}> <HelpCircle size={20} /> </motion.button>
             </div>
             {/* Help Tooltip */}
             <AnimatePresence>
                {showHelp && (
                    <motion.div
                        className="absolute right-4 top-[calc(100%+8px)] bg-white text-gray-900 p-4 rounded-lg shadow-lg z-20 w-64"
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                    >
                        <button onClick={() => setShowHelp(false)} className="absolute top-1 right-1 p-1 text-gray-500 hover:text-gray-800"> <X size={16}/> </button>
                        <p className="text-sm font-semibold mb-2">Payment Steps:</p>
                        <ul className="text-xs space-y-1 list-decimal list-inside">
                            <li>Select payment method.</li>
                            <li>Scan QR or copy number to pay <strong className="font-semibold">₹{formattedAmount}</strong>.</li>
                            <li>Check "Payment Completed".</li>
                            {!isMobile && <li>Upload screenshot.</li>}
                            <li>Click "Confirm via WhatsApp".</li>
                            <li>Send message (and screenshot if mobile).</li>
                        </ul>
                        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-blue-600 flex items-center gap-1">
                            <Smartphone size={14}/> Mobile users send screenshot in WhatsApp.
                        </div>
                    </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Two-Column Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-5 md:p-8">

            {/* Left Column: Summary & Method Selection */}
            <motion.div
                className="space-y-5 md:space-y-6"
                variants={columnVariants} // Apply column animation
                initial="initial"
                animate="animate"
            >
                {/* Order Summary Card */}
                <motion.div variants={itemVariants} className="bg-gray-800/70 rounded-xl p-4 border border-gray-700/70">
                   <h2 className="text-base font-semibold text-blue-300 mb-3 flex justify-between items-center">
                      <span>Order Summary</span>
                      {/* Display Order ID if available */}
                      {orderId && <span className="text-xs font-mono text-gray-400">ID: {orderId}</span>}
                   </h2>
                   <div className="space-y-1.5 text-sm">
                      {/* Subtotal */}
                      <div className="flex justify-between text-gray-300"> <span>Subtotal:</span> <span className="font-medium">₹{formattedSubtotal}</span> </div>
                      {/* Discount (Conditional) */}
                      {discountApplied > 0 && ( <div className="flex justify-between text-green-400"> <span>Discount:</span> <span className="font-medium">- ₹{formattedDiscount}</span> </div> )}
                      {/* Total Amount */}
                      <div className="border-t border-gray-700 !mt-3 pt-3 flex justify-between font-bold text-lg text-white">
                        <span>Total Amount:</span>
                        {/* Animate total price */}
                        <motion.span key={totalAmount} initial={{ scale: 1.1, color: "#4ade80" }} animate={{ scale: 1, color: "#ffffff" }} transition={{ duration: 0.5, type: "spring" }} className="text-emerald-400"> ₹{formattedAmount} </motion.span>
                      </div>
                   </div>
                </motion.div>

                {/* Payment Method Selector Card */}
                <motion.div variants={itemVariants} className="bg-gray-800/70 rounded-xl p-4 border border-gray-700/70">
                    <h3 className="text-base font-semibold text-blue-300 mb-4">Select Payment Method</h3>
                    <div className="flex justify-center gap-3 flex-wrap">
                        {/* Map through payment methods to create buttons */}
                        {Object.keys(paymentMethods).map((method) => (
                            <motion.button
                                key={method} onClick={() => setSelectedMethod(method)}
                                // Dynamic classes based on selection
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 border ${ selectedMethod === method ? `${paymentMethods[method].bgColor} ${paymentMethods[method].textColor} border-transparent shadow-lg scale-105` : "bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500" }`}
                                whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                            > <span className="text-base">{paymentMethods[method].icon}</span> {paymentMethods[method].name} </motion.button>
                        ))}
                    </div>
                </motion.div>

            </motion.div> {/* End Left Column */}

            {/* Right Column: Payment Details & Actions */}
            <motion.div
                className="space-y-5 md:space-y-6"
                 variants={columnVariants} // Apply column animation
                 initial="initial"
                 animate="animate"
            >
                {/* QR Code Card */}
                <motion.div variants={itemVariants} className="bg-gray-800/70 rounded-xl p-4 border border-gray-700/70 text-center">
                    <div className="flex justify-between items-center mb-3 text-left">
                        <h3 className="text-sm font-medium text-gray-300"> Scan QR <span className="text-xs text-gray-400">({currentMethod.name})</span> </h3>
                        {/* Download QR Button */}
                        <motion.button onClick={downloadQR} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}> <Download size={14} /> Save QR </motion.button>
                    </div>
                    {/* Animate QR code change */}
                    <motion.div className="flex justify-center mb-2" key={selectedMethod + "-qr"} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                        <img src={currentMethod.qr} alt={`${currentMethod.name} QR Code`} className="w-36 h-36 md:w-40 md:h-40 object-contain rounded-lg border-2 border-gray-600 bg-white p-1.5" />
                    </motion.div>
                    <p className="text-xs text-gray-500">Scan using your {currentMethod.name} app.</p>
                </motion.div>

                {/* Payment Number Card */}
                <motion.div variants={itemVariants} className="bg-gray-800/70 rounded-xl p-4 border border-gray-700/70">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Or send payment to:</h3>
                    <div className="flex items-center justify-between bg-gray-700/60 p-3 rounded-lg">
                        {/* Display Payment Number */}
                        <span className="font-mono text-base sm:text-lg font-semibold text-gray-100 tracking-wider"> {currentMethod.number} </span>
                        {/* Copy Button */}
                        <motion.button onClick={copyToClipboard} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${ copied ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/50" : "bg-gray-600 hover:bg-blue-600 text-gray-200 border border-transparent" }`} whileTap={{ scale: 0.95 }} whileHover={{ scale: copied ? 1 : 1.03 }}> {copied ? <CheckCircle size={14} /> : <Copy size={14} />} {copied ? "Copied!" : "Copy"} </motion.button>
                    </div>
                </motion.div>

                {/* Payment Confirmation Checkbox Card */}
                <motion.div variants={itemVariants} className="flex items-start p-3 rounded-lg bg-gray-800/60 border border-gray-700/70">
                   <input type="checkbox" id="paymentConfirmation" checked={paymentConfirmed} onChange={(e) => setPaymentConfirmed(e.target.checked)} className="h-5 w-5 rounded border-gray-600 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 bg-gray-700 mt-0.5 cursor-pointer accent-blue-500" />
                   <label htmlFor="paymentConfirmation" className="ml-3 text-sm text-gray-200 cursor-pointer">
                      <span className="block font-medium">I have completed the payment of ₹{formattedAmount}</span>
                      <span className="text-xs text-gray-400"> {isMobile ? "Confirm via WhatsApp (send screenshot there)." : "Upload screenshot below before confirming."} </span>
                   </label>
                </motion.div>

                {/* Screenshot Upload Section (Desktop Only, Conditional) */}
                <AnimatePresence>
                    {!isMobile && paymentConfirmed && (
                        <motion.div
                            variants={itemVariants} // Use item variant for animation
                            className="space-y-3"
                            initial="initial" // Explicitly set initial/animate for variants
                            animate="animate"
                            exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }} // Add overflow hidden on exit
                            transition={{ duration: 0.3 }}
                        >
                            <label className="block text-sm font-medium text-blue-300"> Upload Payment Screenshot (Required) </label>
                            {/* Upload Box or Preview */}
                            {!previewImage ? (
                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}> <Upload className="mb-2 text-gray-500" size={28} /> </motion.div>
                                            <p className="text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag & drop</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (Max 5MB)</p>
                                        </div>
                                        <input id="screenshot-upload" type="file" className="hidden" accept="image/jpeg, image/png, image/gif" onChange={handleFileChange} />
                                    </label>
                                </motion.div>
                            ) : (
                                <motion.div className="relative border border-gray-600 rounded-lg overflow-hidden" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                    <img src={previewImage} alt="Screenshot Preview" className="w-full h-auto max-h-48 object-contain bg-black/20" />
                                    <motion.button onClick={removeScreenshot} className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full text-white hover:bg-red-600/80 transition-colors" aria-label="Remove screenshot" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}> <X size={16} /> </motion.button>
                                </motion.div>
                            )}
                             {/* Error Message Display */}
                             {error && ( <motion.p className="mt-2 text-xs text-red-400 flex items-center gap-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}> <Info size={14}/> {error} </motion.p> )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Button: Confirm via WhatsApp */}
                <motion.div variants={itemVariants} className="mt-6">
                    <motion.button
                        onClick={handleWhatsAppClick}
                        disabled={!paymentConfirmed || (!isMobile && !screenshot)} // Disable logic
                        className={`w-full py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${ paymentConfirmed && (isMobile || screenshot) ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white" : "bg-gray-700 text-gray-500 cursor-not-allowed" }`}
                        whileHover={paymentConfirmed && (isMobile || screenshot) ? { scale: 1.03, y: -1, filter: 'brightness(1.1)' } : {}}
                        whileTap={paymentConfirmed && (isMobile || screenshot) ? { scale: 0.97 } : {}}
                    >
                        {/* WhatsApp Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29-3.588c.545 1.422 1.663 2.43 2.98 2.453.386.006.772-.05 1.144-.15.525-.141 1.191-.471 1.715-.896.524-.426.936-.936 1.224-1.496.315-.615.473-1.289.473-1.97 0-.55-.107-1.1-.322-1.618-.213-.521-.663-.69-1.001-.575-.315.111-.853.38-1.177.65-.324.27-.744.715-.893 1.1-.149.386-.171.8-.057 1.213.115.413.173.686.057.896-.111.213-.396.27-.733.162-.338-.107-1.186-.396-1.694-1.263-.508-.866-.508-1.793-.396-1.981.111-.189.396-.27.632-.324.236-.054.396-.027.545.027.149.054.297.161.396.27.099.108.198.216.248.324.05.107.099.161.148.27.05.108.025.162-.025.27-.05.108-.149.27-.248.432-.099.162-.198.324-.149.432.05.108.297.54.644 1.003.346.462.793.893 1.157 1.157.364.264.644.35.744.35.099 0 .149-.027.198-.054.05-.027.099-.081.149-.189.05-.108.027-.216-.025-.324-.05-.107-.396-.853-.545-1.166-.149-.312-.297-.27-.396-.27-.099 0-.198-.027-.347-.081-.149-.054-.297-.108-.396-.162-.099-.054-.173-.081-.248-.027-.074.054-.05.27-.05.415 0 .144.025.754.322 1.263z"/> </svg>
                        Confirm via WhatsApp
                    </motion.button>
                </motion.div>

            </motion.div> {/* End Right Column */}

          </div> {/* End Two-Column Grid */}

        </motion.div> {/* End Main Card */}

        {/* Form Popup Modal */}
        <AnimatePresence>
            {showForm && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    variants={modalOverlayVariants} initial="initial" animate="animate" exit="exit"
                >
                    <motion.div
                        className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-xl"
                        variants={modalContentVariants} initial="initial" animate="animate" exit="exit"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-semibold text-white">Confirm Purchase Details</h3>
                            <motion.button onClick={() => setShowForm(false)} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}> <X size={18} /> </motion.button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {/* Pre-filled, Disabled Fields */}
                            <TextField fullWidth label="Your Name" name="name" value={formData.name} variant="outlined" disabled InputLabelProps={{ shrink: true }} />
                            <TextField fullWidth label="Email Address" name="email" value={formData.email} variant="outlined" disabled InputLabelProps={{ shrink: true }} />
                            {/* Required Purchased Items Field */}
                            <TextField fullWidth label="Purchased Item(s)" name="message" value={formData.message} onChange={handleInputChange} variant="outlined" required multiline rows={3} placeholder="e.g., Netflix 6 Month Plan, Spotify Premium" helperText="Please list the item(s) this payment is for." InputLabelProps={{ shrink: true }} />
                            {/* Optional Message Field */}
                            <TextField fullWidth label="Additional Message (Optional)" name="userMessage" value={userMessage} onChange={(e) => setUserMessage(e.target.value)} variant="outlined" multiline rows={2} placeholder="Any special instructions or notes?" InputLabelProps={{ shrink: true }} />
                            {/* Submit Button */}
                            <div className="pt-2">
                                <MuiButton type="submit" variant="contained" color="primary" fullWidth disabled={isLoading} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Send size={18}/>} sx={{ py: 1.5, bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}> {isLoading ? "Submitting..." : "Submit & Confirm via WhatsApp"} </MuiButton>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Email Notice Popup Modal */}
        <AnimatePresence>
            {showEmailNotice && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    variants={modalOverlayVariants} initial="initial" animate="animate" exit="exit"
                >
                    <motion.div
                        className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center border border-gray-700 shadow-xl"
                        variants={modalContentVariants} initial="initial" animate="animate" exit="exit"
                    >
                        {/* Animated Mail Icon */}
                        <motion.div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror" }}> <Mail className="text-blue-400" size={36} /> </motion.div>
                        <h3 className="text-xl font-bold text-white mb-2">Check Your Email</h3>
                        <p className="text-sm text-gray-300 mb-5"> We've sent confirmation to <strong className="text-white">{formData.email}</strong>. Check your inbox (and spam folder). </p>
                        {/* Countdown Timer */}
                        <div className="bg-gray-800/50 p-3 rounded-lg mb-5 border border-gray-700">
                            <p className="text-xs text-gray-400 mb-1">Redirecting to dashboard in:</p>
                            <p className="text-2xl font-bold text-white tabular-nums"> {countdown} </p>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <MuiButton variant="contained" color="primary" onClick={() => navigate("/user-dashboard")} sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}> Go Now </MuiButton>
                            <MuiButton variant="outlined" color="secondary" onClick={() => { setShowEmailNotice(false); setCountdown(10); }} sx={{ borderColor: '#4b5563', color: '#d1d5db', '&:hover': { borderColor: '#6b7280', bgcolor: 'rgba(55, 65, 81, 0.3)' } }}> Stay Here </MuiButton>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </ThemeProvider>
  );
};

export default PurchasePage;
