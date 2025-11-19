import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCircle, Download, ArrowLeft, Upload, X, MessageCircle, Smartphone, Mail, Send, HelpCircle, Image as ImageIcon, Info } from "lucide-react"; // Added Info
import { FiCamera } from "react-icons/fi"; // Added FiCamera for mobile upload
// Using Material UI components for form elements
import { TextField, Button as MuiButton, CircularProgress } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles'; // For theming MUI components
import { serifTheme } from "../../design-system/themes/serifTheme";
import { SerifPageWrapper, SerifButton } from "../../design-system/components";
import { useNotification } from "../../context/NotificationContext";
import { supabase } from "../../supabase/supabaseConfig";
import logger from "../../utils/logger";
import { fetchPaymentMethods, verifyPaymentMethod } from "../../services/paymentService";

// --- MUI Theme for Serif Theme ---
// Customizes Material UI components to fit the serif theme
const serifMUITheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#d97706' }, // amber-600
    secondary: { main: '#92400e' }, // amber-800
    background: { paper: '#fffbeb', default: '#fef3c7' }, // amber-50, yellow-50
    text: { primary: '#1f2937', secondary: '#4b5563' }, // gray-800, gray-600
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d97706', // amber-600 on hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d97706', // amber-600 when focused
          },
           '&.Mui-disabled': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            color: '#9ca3af',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(251, 191, 36, 0.3)',
            },
          },
        },
        notchedOutline: {
          borderColor: 'rgba(251, 191, 36, 0.6)',
        },
        input: {
          color: '#1f2937',
           fontSize: '0.95rem',
           '&.Mui-disabled': {
             WebkitTextFillColor: '#9ca3af',
             color: '#9ca3af',
           },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#4b5563',
          fontSize: '0.95rem',
          '&.Mui-focused': {
            color: '#d97706',
          },
          '&.Mui-disabled': {
            color: '#9ca3af',
          },
        },
      },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: '12px',
                textTransform: 'none',
                padding: '10px 18px',
                fontWeight: 600,
                transition: 'background-color 0.3s ease, transform 0.1s ease',
                 '&:active': {
                    transform: 'scale(0.98)',
                }
            }
        }
    },
     MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#6b7280',
          fontSize: '0.75rem',
          marginLeft: '10px',
        },
      },
    },
     MuiCircularProgress: {
        styleOverrides: {
            root: {
                color: '#d97706',
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
  const notification = useNotification();

  // --- State ---
  const { totalAmount = 0, discountApplied = 0, orderId = null } = location.state || {}; // Get orderId if passed
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  
  // Payment methods state - loaded securely from database
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
  const [paymentMethodsError, setPaymentMethodsError] = useState(null);
  
  // All other state hooks - moved to top to fix React hooks rule
  const [selectedMethod, setSelectedMethod] = useState(null); // Will be set after loading methods
  const [paymentConfirmed, setPaymentConfirmed] = useState(false); // Checkbox state
  const [copied, setCopied] = useState(false); // Copy button state
  const [screenshot, setScreenshot] = useState(null); // Screenshot file object
  const [previewImage, setPreviewImage] = useState(null); // Screenshot preview (base64)
  const [userMessage, setUserMessage] = useState(""); // Optional message from user
  const [error, setError] = useState(null); // Screenshot upload/validation error
  const [showHelp, setShowHelp] = useState(false); // Help tooltip visibility
  const [formData, setFormData] = useState({ // State for email form
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    message: "", // Purchased items description (required in form)
    orderId: orderId || "N/A",
    paymentMethod: "",
    paymentAmount: totalAmount ? totalAmount.toFixed(2) : "0.00",
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state for WhatsApp processing
  const [isMobile, setIsMobile] = useState(false); // Detect mobile device

  // Secure user verification effect
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          notification.error('Please login to complete your purchase');
          navigate('/login');
          return;
        }

        // Get user details from database
        const { data: userRecord, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (userError || !userRecord) {
          logger.error('Error fetching user data', { error: userError?.message });
          notification.error('Failed to verify user');
          navigate('/login');
          return;
        }

        setCurrentUser({
          id: user.id,
          email: user.email,
          ...userRecord
        });
      } catch (error) {
        logger.error('Error verifying user', { error: error.message });
        notification.error('Authentication failed');
        navigate('/login');
      } finally {
        setUserLoading(false);
      }
    };

    verifyUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      } else if (event === 'SIGNED_IN') {
        verifyUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, notification]);

  // Check if mobile on mount/resize
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768); // Use 768px as breakpoint for md
    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Fetch payment methods securely from database
  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (!currentUser) {
        return;
      }

      try {
        setPaymentMethodsLoading(true);
        setPaymentMethodsError(null);
        
        const methods = await fetchPaymentMethods();
        
        if (!methods || Object.keys(methods).length === 0) {
          throw new Error('No payment methods available');
        }

        setPaymentMethods(methods);
        
        // Set default method to first available method
        const firstMethod = Object.keys(methods)[0];
        setSelectedMethod(firstMethod);
        
      } catch (error) {
        logger.error('Error loading payment methods:', { error: error.message });
        setPaymentMethodsError('Failed to load payment methods. Please refresh the page.');
        notification.error('Failed to load payment methods');
      } finally {
        setPaymentMethodsLoading(false);
      }
    };

    loadPaymentMethods();
  }, [currentUser, notification]);

  // Update form data when payment method changes
  useEffect(() => {
    if (paymentMethods && selectedMethod && paymentMethods[selectedMethod]) {
      setFormData(prev => ({...prev, paymentMethod: paymentMethods[selectedMethod].name}));
    }
  }, [selectedMethod, paymentMethods]);

  // Show loading while verifying user or loading payment methods
  if (userLoading || paymentMethodsLoading) {
    return (
      <SerifPageWrapper>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <CircularProgress />
          <p className={`text-sm ${serifTheme.colors.text.secondary}`}>
            {userLoading ? 'Verifying user...' : 'Loading secure payment methods...'}
          </p>
        </div>
      </SerifPageWrapper>
    );
  }

  // Don't render if no user
  if (!currentUser) {
    return null;
  }

  // Show error if payment methods failed to load
  if (paymentMethodsError) {
    return (
      <SerifPageWrapper>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className={`text-lg font-semibold ${serifTheme.colors.text.primary}`}>
            {paymentMethodsError}
          </p>
          <SerifButton 
            onClick={() => window.location.reload()}
            variant="primary"
          >
            Refresh Page
          </SerifButton>
        </div>
      </SerifPageWrapper>
    );
  }

  // Don't render if no payment methods loaded
  if (!paymentMethods || Object.keys(paymentMethods).length === 0) {
    return (
      <SerifPageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <p className={`text-lg ${serifTheme.colors.text.secondary}`}>
            No payment methods available at this time.
          </p>
        </div>
      </SerifPageWrapper>
    );
  }


  // --- Helper Functions ---

  // Handle payment method selection with verification
  const handleMethodSelection = async (method) => {
    if (!paymentMethods || !paymentMethods[method]) {
      notification.error('Invalid payment method');
      return;
    }

    // Verify the payment method is still valid
    const isValid = await verifyPaymentMethod(method);
    
    if (!isValid) {
      notification.error('Selected payment method is no longer available');
      logger.warn('Invalid payment method selected', { method });
      return;
    }
    
    setSelectedMethod(method);
  };

  // Copy payment number to clipboard
  const copyToClipboard = () => {
    if (!paymentMethods || !selectedMethod || !paymentMethods[selectedMethod]) {
      notification.error('Payment method not available');
      return;
    }

    navigator.clipboard.writeText(paymentMethods[selectedMethod].number)
        .then(() => {
            setCopied(true);
            notification.success("Payment number copied!", {
              icon: <CheckCircle className="text-base" />,
              duration: 2000
            });
            setTimeout(() => setCopied(false), 2500); // Reset copied state after 2.5s
        })
        .catch(err => {
            logger.error('Failed to copy text', { error: err.message });
            notification.error("Failed to copy number.");
        });
  };

  // Download QR code image
  const downloadQR = () => {
    if (!paymentMethods || !selectedMethod || !paymentMethods[selectedMethod]) {
      notification.error('Payment method not available');
      return;
    }

    const link = document.createElement("a");
    link.href = paymentMethods[selectedMethod].qr; // Path to the QR image
    link.download = `${selectedMethod}-QR.jpg`; // Filename for download
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link); // Clean up the link element
    notification.success("QR Code download started.", {
      icon: <Download className="text-base" />,
      duration: 2000
    });
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


  // Function to update order with payment screenshot and method
  const updateOrderWithPayment = async () => {
    if (!orderId) {
      notification.error("Could not save payment information - order ID missing");
      return;
    }

    if (!paymentMethods || !selectedMethod || !paymentMethods[selectedMethod]) {
      notification.error("Invalid payment method selected");
      return;
    }

    try {
      // Verify the payment method is valid before saving
      const isValidMethod = await verifyPaymentMethod(selectedMethod);
      
      if (!isValidMethod) {
        notification.error("Invalid payment method selected");
        logger.error('Attempted to use invalid payment method', { 
          selectedMethod,
          orderId 
        });
        return;
      }

      const updateData = {
        payment_screenshot: previewImage || null,
        payment_method: paymentMethods[selectedMethod].name,
        payment_method_key: selectedMethod, // Add this for tracking
        payment_status: "completed",
        payment_confirmed_at: new Date().toISOString(),
        user_message: userMessage?.trim() || null
      };

      const { data, error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId)
        .eq("user_id", currentUser.id) // Add user verification
        .select("id")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        notification.error("Order not found - cannot save payment information");
        return;
      }

      notification.success("Payment information saved successfully!", {
        icon: <CheckCircle className="text-base" />,
        duration: 3000
      });
      setPaymentConfirmed(true);
    } catch (error) {
      logger.error("Error updating order with payment", { 
        error: error.message,
        orderId,
        userId: currentUser?.id 
      });
      notification.error("Failed to save payment information.");
    }
  };


  // --- WhatsApp Confirmation ---
  const sendViaWhatsApp = async () => {
    try {
      // Prerequisite checks with better error handling
      if (!paymentConfirmed) {
        notification.error("Please confirm you've completed the payment first.");
        setError("Please confirm you've completed the payment.");
        throw new Error("Payment not confirmed");
      }
      
      // Make screenshot optional for mobile, required for desktop
      if (!isMobile && !screenshot) {
        notification.error("Please upload your payment screenshot before confirming.");
        setError("Please upload your payment screenshot.");
        throw new Error("Screenshot required for desktop");
      }

      // Update order with payment information (if screenshot is uploaded)
      if (previewImage) {
        await updateOrderWithPayment();
      }

      // Ensure formData.message is set
      const purchaseMessage = formData.message || `Order ID: ${orderId || "N/A"} - Digital product purchase`;

      // Construct the WhatsApp message body
      const message = `*Payment Confirmation*\n\n` +
        `*Name:* ${formData.name}\n` +
        `*Email:* ${formData.email}\n` +
        (formData.orderId !== "N/A" ? `*Order ID:* ${formData.orderId}\n` : '') +
        `*Method:* ${paymentMethods[selectedMethod].name} ${paymentMethods[selectedMethod].icon}\n` +
        `*Amount:* ₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n` +
        `*Paid To:* ${paymentMethods[selectedMethod].number}\n` +
        `*Purchased Items:* ${purchaseMessage}\n` +
        (userMessage ? `*Additional Message:* ${userMessage}\n` : '') +
        `\n` +
        `Please verify this payment. ${previewImage ? 'Screenshot has been uploaded to the system.' : 'Screenshot will be sent directly via WhatsApp.'}`;

      const whatsappNumber = "+9779807677391";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      logger.debug("Opening WhatsApp with URL", { url: whatsappUrl });

      // Try to open WhatsApp link with better error handling
      const newWindow = window.open(whatsappUrl, '_blank');
      
      if (!newWindow) {
        // Fallback if popup blocked
        window.location.href = whatsappUrl;
      }

      // Show success message
      notification.success("WhatsApp opened! Please send the payment confirmation message.", {
        icon: <MessageCircle className="text-base" />,
        duration: 3000
      });
      
      // Redirect to dashboard after delay
      setTimeout(() => {
        navigate("/user-dashboard");
      }, 3000);
      
    } catch (error) {
      console.error("Error in sendViaWhatsApp:", error);
      throw error; // Re-throw to be caught by handleWhatsAppClick
    }
  };

  // Handle click on the main "Confirm via WhatsApp" button
  const handleWhatsAppClick = async () => {
    logger.debug("WhatsApp button clicked", {
      paymentConfirmed,
      isMobile,
      hasScreenshot: !!screenshot,
      hasPreviewImage: !!previewImage
    });
    
    // Show loading state immediately
    setIsLoading(true);
    
    try {
      // Auto-generate purchase message from cart/order data if not already set
      if (!formData.message.trim()) {
        setFormData(prev => ({
          ...prev, 
          message: `Order ID: ${orderId || "N/A"} - Digital product purchase`
        }));
      }
      
      // Brief delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Call WhatsApp function and wait for it to complete
      await sendViaWhatsApp();
      
    } catch (error) {
      logger.error("Error opening WhatsApp", { error: error.message });
      notification.error("Failed to open WhatsApp: " + error.message);
    } finally {
      // Stop loading after WhatsApp process completes
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  // --- Calculated Values for Display ---
  const subtotal = totalAmount + discountApplied;
  const formattedAmount = totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedDiscount = discountApplied.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedSubtotal = subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const currentMethod = paymentMethods && selectedMethod ? paymentMethods[selectedMethod] : null; // Get current payment method details

  // --- JSX Structure ---
  return (
    <ThemeProvider theme={serifMUITheme}>
      <SerifPageWrapper className="flex items-center justify-center p-4 sm:p-6">
        {/* Ultra Modern Main Card */}
        <motion.div
          className={`w-full max-w-4xl ${serifTheme.gradients.card} backdrop-blur-2xl ${serifTheme.radius.card} overflow-hidden ${serifTheme.colors.shadow.card} border ${serifTheme.colors.border.secondary} relative`}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Card Glow Effect */}
          <div className={`absolute inset-0 ${serifTheme.gradients.button} opacity-10 ${serifTheme.radius.card}`}></div>
          {/* Ultra Modern Header with Gradient Background */}
          <div
            className={`p-6 border-b ${serifTheme.colors.border.primary} relative ${serifTheme.transitions.default} ${serifTheme.gradients.button} backdrop-blur-xl`}
          >
            {/* Header Glow Effect */}
            <div className={`absolute inset-0 ${serifTheme.gradients.button} opacity-20`}></div>

             <div className="flex items-center justify-between relative z-10">
               {/* Enhanced Back Button */}
               <SerifButton
                 onClick={() => navigate(-1)}
                 variant="secondary"
                 size="small"
                 icon={<ArrowLeft size={18} />}
                 className="p-3"
                 aria-label="Go back"
               />

               {/* Modern Gradient Title */}
               <motion.h1
                 className={`text-2xl font-bold ${serifTheme.gradients.accent}`}
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
               >
                 Complete Payment
               </motion.h1>

               {/* Enhanced Help Button */}
               <SerifButton
                 onClick={() => setShowHelp(!showHelp)}
                 variant="secondary"
                 size="small"
                 icon={<HelpCircle size={18} />}
                 className="p-3"
                 aria-label="Help"
               />
             </div>
             {/* Modern Help Tooltip */}
             <AnimatePresence>
                {showHelp && (
                    <motion.div
                        className={`absolute right-4 top-[calc(100%+12px)] ${serifTheme.gradients.card} backdrop-blur-xl ${serifTheme.colors.text.primary} p-5 ${serifTheme.radius.card} ${serifTheme.colors.shadow.card} z-20 w-72 border ${serifTheme.colors.border.secondary}`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    >
                        {/* Close Button */}
                        <SerifButton
                          onClick={() => setShowHelp(false)}
                          variant="ghost"
                          size="small"
                          icon={<X size={16}/>}
                          className="absolute top-2 right-2 p-2"
                        />

                        {/* Header */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-8 h-8 ${serifTheme.gradients.button} ${serifTheme.radius.button} flex items-center justify-center`}>
                            <HelpCircle size={16} className="text-white" />
                          </div>
                          <p className={`text-sm font-semibold ${serifTheme.colors.text.primary}`}>Payment Steps:</p>
                        </div>

                        {/* Steps List */}
                        <ul className={`text-xs space-y-2 list-none ${serifTheme.colors.text.secondary}`}>
                            <li className="flex items-start gap-2">
                              <span className={`w-5 h-5 ${serifTheme.colors.background.tertiary} ${serifTheme.colors.text.accent} ${serifTheme.radius.badge} flex items-center justify-center text-xs font-bold mt-0.5`}>1</span>
                              <span>Select payment method.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className={`w-5 h-5 ${serifTheme.colors.background.tertiary} ${serifTheme.colors.text.accent} ${serifTheme.radius.badge} flex items-center justify-center text-xs font-bold mt-0.5`}>2</span>
                              <span>Scan QR or copy number to pay <strong className={`font-semibold ${serifTheme.colors.text.accent}`}>₹{formattedAmount}</strong>.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className={`w-5 h-5 ${serifTheme.colors.background.tertiary} ${serifTheme.colors.text.accent} ${serifTheme.radius.badge} flex items-center justify-center text-xs font-bold mt-0.5`}>3</span>
                              <span>Check "Payment Completed".</span>
                            </li>
                            {!isMobile && (
                              <li className="flex items-start gap-2">
                                <span className={`w-5 h-5 ${serifTheme.colors.background.tertiary} ${serifTheme.colors.text.accent} ${serifTheme.radius.badge} flex items-center justify-center text-xs font-bold mt-0.5`}>4</span>
                                <span>Upload screenshot.</span>
                              </li>
                            )}
                            <li className="flex items-start gap-2">
                              <span className={`w-5 h-5 ${serifTheme.colors.background.tertiary} ${serifTheme.colors.text.accent} ${serifTheme.radius.badge} flex items-center justify-center text-xs font-bold mt-0.5`}>{!isMobile ? '5' : '4'}</span>
                              <span>Click "Confirm via WhatsApp".</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className={`w-5 h-5 ${serifTheme.colors.background.tertiary} ${serifTheme.colors.text.accent} ${serifTheme.radius.badge} flex items-center justify-center text-xs font-bold mt-0.5`}>{!isMobile ? '6' : '5'}</span>
                              <span>Send message (and screenshot if mobile).</span>
                            </li>
                        </ul>

                        {/* Mobile Notice */}
                        <div className={`mt-3 pt-3 border-t ${serifTheme.colors.border.primary} text-xs ${serifTheme.colors.text.accent} flex items-center gap-2`}>
                            <Smartphone size={14}/>
                            <span>Mobile users send screenshot in WhatsApp.</span>
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
                {/* Ultra Modern Order Summary Card */}
                <motion.div
                  variants={itemVariants}
                  className={`${serifTheme.gradients.card} backdrop-blur-xl ${serifTheme.radius.card} p-5 border ${serifTheme.colors.border.secondary} relative overflow-hidden`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                   {/* Card Glow Effect */}
                   <div className={`absolute inset-0 ${serifTheme.gradients.button} opacity-5 ${serifTheme.radius.card}`}></div>

                   <div className="relative z-10">
                     <h2 className={`text-lg font-bold ${serifTheme.gradients.accent} mb-4 flex justify-between items-center`}>
                        <span>Order Summary</span>
                        {/* Display Order ID if available */}
                        {orderId && <span className={`text-xs font-mono ${serifTheme.colors.text.tertiary} ${serifTheme.colors.background.card} px-2 py-1 ${serifTheme.radius.button}`}>ID: {orderId}</span>}
                     </h2>

                     <div className={`space-y-3 text-sm ${serifTheme.colors.text.secondary}`}>
                        {/* Subtotal */}
                        <div className={`flex justify-between p-2 ${serifTheme.radius.button} ${serifTheme.colors.background.card}`}>
                          <span>Subtotal:</span>
                          <span className={`font-semibold ${serifTheme.colors.text.primary}`}>₹{formattedSubtotal}</span>
                        </div>

                        {/* Discount (Conditional) */}
                        {discountApplied > 0 && (
                          <motion.div
                            className={`flex justify-between ${serifTheme.colors.text.accent} p-2 ${serifTheme.radius.button} ${serifTheme.colors.background.tertiary} border ${serifTheme.colors.border.accent}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <span>Discount:</span>
                            <span className="font-semibold">- ₹{formattedDiscount}</span>
                          </motion.div>
                        )}

                        {/* Total Amount */}
                        <div className={`border-t ${serifTheme.colors.border.primary} !mt-4 pt-4 flex justify-between font-bold text-lg ${serifTheme.colors.text.primary} ${serifTheme.colors.background.card} p-3 ${serifTheme.radius.button}`}>
                          <span className={serifTheme.gradients.accent}>Total Amount:</span>
                          {/* Animate total price */}
                          <motion.span
                            key={totalAmount}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.6, type: "spring" }}
                            className={`${serifTheme.colors.text.accent} font-bold`}
                          >
                            ₹{formattedAmount}
                          </motion.span>
                        </div>
                     </div>
                   </div>
                </motion.div>

                {/* Ultra Modern Payment Method Selector Card */}
                <motion.div
                  variants={itemVariants}
                  className={`${serifTheme.gradients.card} backdrop-blur-xl ${serifTheme.radius.card} p-5 border ${serifTheme.colors.border.secondary} relative overflow-hidden`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                    {/* Card Glow Effect */}
                    <div className={`absolute inset-0 ${serifTheme.gradients.button} opacity-5 ${serifTheme.radius.card}`}></div>

                    <div className="relative z-10">
                      <h3 className={`text-lg font-bold ${serifTheme.gradients.accent} mb-5`}>Select Payment Method</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Map through payment methods to create modern buttons */}
                          {Object.keys(paymentMethods).map((method) => (
                              <motion.button
                                  key={method}
                                  onClick={() => handleMethodSelection(method)}
                                  className={`p-4 ${serifTheme.radius.button} text-sm font-semibold ${serifTheme.transitions.default} flex flex-col items-center gap-2 border backdrop-blur-sm relative overflow-hidden ${
                                    selectedMethod === method
                                      ? `${paymentMethods[method].bgColor} ${paymentMethods[method].textColor} border-transparent ${serifTheme.colors.shadow.card} scale-105`
                                      : `${serifTheme.colors.background.card} ${serifTheme.colors.text.secondary} ${serifTheme.colors.border.secondary} hover:${serifTheme.colors.background.cardHover} hover:${serifTheme.colors.text.primary}`
                                  }`}
                                  whileHover={{ y: -3, scale: selectedMethod === method ? 1.05 : 1.02 }}
                                  whileTap={{ scale: 0.95 }}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 * Object.keys(paymentMethods).indexOf(method) }}
                              >
                                {/* Glow effect for selected method */}
                                {selectedMethod === method && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"></div>
                                )}
                                {method === 'esewa' ? (
                                  <div className="w-10 h-10 rounded-full bg-white p-1 relative z-10 flex items-center justify-center shadow-md">
                                    <img 
                                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRURIPRhKOlMe7cw2N9IzXTwUICDh0EVLvcCw&s" 
                                      alt="eSewa Logo" 
                                      className="w-full h-full object-contain rounded-full"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'inline';
                                      }}
                                    />
                                  </div>
                                ) : method === 'khalti' ? (
                                  <div className="w-10 h-10 rounded-full bg-white p-1 relative z-10 flex items-center justify-center shadow-md">
                                    <img 
                                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdSwyrmAz1npk5drh3dKJIh7ia_rHVYEHIwQ&s" 
                                      alt="Khalti Logo" 
                                      className="w-full h-full object-contain rounded-full"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'inline';
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-white p-1 relative z-10 flex items-center justify-center shadow-md">
                                    <span className="text-2xl">{paymentMethods[method].icon}</span>
                                  </div>
                                )}
                                <span className="text-2xl relative z-10" style={{display: 'none'}}>
                                  {method === 'esewa' ? '🟢' : method === 'khalti' ? '💜' : '🏦'}
                                </span>
                                <span className="relative z-10 font-bold">{paymentMethods[method].name}</span>
                                <span className="text-xs relative z-10 opacity-80">{paymentMethods[method].description}</span>
                              </motion.button>
                          ))}
                      </div>
                      
                      {/* Payment Method Features */}
                      {selectedMethod && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-4 p-3 ${serifTheme.colors.background.card} ${serifTheme.radius.button} border ${serifTheme.colors.border.primary}`}
                        >
                          <h4 className={`text-sm font-semibold ${serifTheme.colors.text.primary} mb-2`}>Features:</h4>
                          <div className="flex flex-wrap gap-2">
                            {paymentMethods[selectedMethod].features.map((feature, index) => (
                              <span
                                key={index}
                                className={`text-xs ${serifTheme.colors.background.tertiary} ${serifTheme.colors.text.secondary} px-2 py-1 ${serifTheme.radius.badge}`}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
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
                {/* Ultra Modern QR Code Card */}
                <motion.div
                  variants={itemVariants}
                  className={`${serifTheme.gradients.card} backdrop-blur-xl ${serifTheme.radius.card} p-5 border ${serifTheme.colors.border.secondary} text-center relative overflow-hidden`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                    {/* Card Glow Effect */}
                    <div className={`absolute inset-0 ${serifTheme.gradients.button} opacity-5 ${serifTheme.radius.card}`}></div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-4 text-left">
                          <h3 className={`text-base font-semibold ${serifTheme.gradients.accent}`}>
                            Scan QR Code
                            <span className={`text-xs ${serifTheme.colors.text.tertiary} ml-2 ${serifTheme.colors.background.card} px-2 py-1 ${serifTheme.radius.button}`}>({currentMethod.name})</span>
                          </h3>
                          {/* Enhanced Download QR Button */}
                          <SerifButton
                            onClick={downloadQR}
                            variant="secondary"
                            size="small"
                            icon={<Download size={14} />}
                            className="text-xs"
                          >
                            Save QR
                          </SerifButton>
                      </div>

                      {/* Animate QR code change with enhanced styling */}
                      <motion.div
                        className="flex justify-center mb-4"
                        key={selectedMethod + "-qr"}
                        initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                      >
                          <div className="relative">
                            <img
                              src={currentMethod.qr}
                              alt={`${currentMethod.name} QR Code`}
                              className={`w-40 h-40 md:w-44 md:h-44 object-contain ${serifTheme.radius.button} border-2 ${serifTheme.colors.border.secondary} bg-white p-2 ${serifTheme.colors.shadow.card}`}
                            />
                            {/* QR Code Glow Effect */}
                            <div className={`absolute inset-0 ${serifTheme.gradients.button} opacity-20 ${serifTheme.radius.button} blur-xl -z-10`}></div>
                            
                            {/* Scanning Animation */}
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/30 to-transparent h-1 ${serifTheme.radius.button}`}
                              animate={{ y: [0, 176, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                          </div>
                      </motion.div>

                      <p className={`text-sm ${serifTheme.colors.text.secondary} ${serifTheme.colors.background.card} px-3 py-2 ${serifTheme.radius.button}`}>
                        Scan using your <span className={`${serifTheme.colors.text.primary} font-semibold`}>{currentMethod.name}</span> app
                      </p>
                      
                      {/* Payment Instructions */}
                      <div className={`mt-3 text-xs ${serifTheme.colors.text.tertiary} space-y-1`}>
                        <p>• Open {currentMethod.name} app</p>
                        <p>• Tap "Scan QR" or "Pay"</p>
                        <p>• Scan this QR code</p>
                        <p>• Enter amount: <span className={`${serifTheme.colors.text.accent} font-bold`}>₹{formattedAmount}</span></p>
                      </div>
                    </div>
                </motion.div>

                {/* Ultra Modern Payment Number Card */}
                <motion.div
                  variants={itemVariants}
                  className={`${serifTheme.gradients.card} backdrop-blur-xl ${serifTheme.radius.card} p-5 border ${serifTheme.colors.border.secondary} relative overflow-hidden`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                    {/* Card Glow Effect */}
                    <div className={`absolute inset-0 ${serifTheme.gradients.button} opacity-5 ${serifTheme.radius.card}`}></div>

                    <div className="relative z-10">
                      <h3 className={`text-base font-semibold ${serifTheme.gradients.accent} mb-3`}>Or send payment to:</h3>
                      <div className={`flex items-center justify-between ${serifTheme.colors.background.card} p-4 ${serifTheme.radius.button} border ${serifTheme.colors.border.secondary} backdrop-blur-sm`}>
                          {/* Display Payment Number with enhanced styling */}
                          <div className="flex flex-col">
                            <span className={`font-mono text-lg sm:text-xl font-bold ${serifTheme.colors.text.primary} tracking-wider`}>
                              {currentMethod.number}
                            </span>
                            <span className={`text-xs ${serifTheme.colors.text.tertiary} mt-1`}>{currentMethod.name} Number</span>
                          </div>

                          {/* Enhanced Copy Button */}
                          <SerifButton
                            onClick={copyToClipboard}
                            variant={copied ? "success" : "primary"}
                            size="small"
                            icon={copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                          >
                            {copied ? "Copied!" : "Copy"}
                          </SerifButton>
                      </div>
                      
                      {/* Manual Transfer Instructions */}
                      <div className={`mt-3 text-xs ${serifTheme.colors.text.tertiary} space-y-1`}>
                        <p>• Open {currentMethod.name} app</p>
                        <p>• Go to "Send Money" or "Transfer"</p>
                        <p>• Enter number: <span className={`${serifTheme.colors.text.primary} font-mono`}>{currentMethod.number}</span></p>
                        <p>• Enter amount: <span className={`${serifTheme.colors.text.accent} font-bold`}>₹{formattedAmount}</span></p>
                        <p>• Add note: "Digital Services Payment"</p>
                      </div>
                    </div>
                </motion.div>

                {/* Ultra Modern Payment Confirmation Checkbox Card */}
                <motion.div
                  variants={itemVariants}
                  className={`flex items-start p-4 ${serifTheme.radius.card} ${serifTheme.gradients.card} backdrop-blur-xl border ${serifTheme.colors.border.secondary} relative overflow-hidden`}
                  whileHover={{ scale: 1.01, y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                   {/* Card Glow Effect */}
                   <div className={`absolute inset-0 ${serifTheme.gradients.button} opacity-5 ${serifTheme.radius.card}`}></div>

                   <div className="relative z-10 flex items-start w-full">
                     {/* Enhanced Checkbox */}
                     <motion.div className="relative">
                       <input
                         type="checkbox"
                         id="paymentConfirmation"
                         checked={paymentConfirmed}
                         onChange={(e) => setPaymentConfirmed(e.target.checked)}
                         className={`h-6 w-6 ${serifTheme.radius.button} border-2 ${serifTheme.colors.border.secondary} focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-50 ${serifTheme.colors.background.card} mt-1 cursor-pointer accent-amber-600 ${serifTheme.transitions.default}`}
                       />
                       {/* Custom checkmark animation */}
                       {paymentConfirmed && (
                         <motion.div
                           className="absolute inset-0 flex items-center justify-center pointer-events-none"
                           initial={{ scale: 0, rotate: -180 }}
                           animate={{ scale: 1, rotate: 0 }}
                           transition={{ duration: 0.3, type: "spring" }}
                         >
                           <CheckCircle size={24} className={serifTheme.colors.text.accent} />
                         </motion.div>
                       )}
                     </motion.div>

                     <label htmlFor="paymentConfirmation" className={`ml-4 text-sm ${serifTheme.colors.text.secondary} cursor-pointer flex-1`}>
                        <span className={`block font-semibold ${serifTheme.colors.text.primary} mb-1`}>
                          I have completed the payment of
                          <span className={`${serifTheme.colors.text.accent} font-bold ml-1`}>₹{formattedAmount}</span>
                        </span>
                        <span className={`text-xs ${serifTheme.colors.text.tertiary} ${serifTheme.colors.background.card} px-2 py-1 ${serifTheme.radius.button} inline-block`}>
                          {isMobile ? "Upload screenshot below or send via WhatsApp." : "Upload screenshot below before confirming."}
                        </span>
                     </label>
                   </div>
                </motion.div>

                {/* Screenshot Upload Section (Available on Both Mobile and Desktop) */}
                <AnimatePresence>
                    {paymentConfirmed && (
                        <motion.div
                            variants={itemVariants} // Use item variant for animation
                            className="space-y-3"
                            initial="initial" // Explicitly set initial/animate for variants
                            animate="animate"
                            exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }} // Add overflow hidden on exit
                            transition={{ duration: 0.3 }}
                        >
                            <label className={`block text-sm font-medium ${serifTheme.colors.text.accent}`}> 
                                Upload Payment Screenshot {isMobile ? "(Optional - can also send via WhatsApp)" : "(Required)"}
                            </label>
                            {/* Upload Box or Preview */}
                            {!previewImage ? (
                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                                    <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} cursor-pointer ${serifTheme.colors.background.card} hover:${serifTheme.colors.background.cardHover} ${serifTheme.transitions.default}`}>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}> 
                                                {isMobile ? <FiCamera className={`mb-2 ${serifTheme.colors.text.tertiary}`} size={28} /> : <Upload className={`mb-2 ${serifTheme.colors.text.tertiary}`} size={28} />}
                                            </motion.div>
                                            <p className={`text-sm ${serifTheme.colors.text.secondary}`}>
                                                <span className="font-semibold">Click to upload</span> or drag & drop
                                            </p>
                                            <p className={`text-xs ${serifTheme.colors.text.tertiary} mt-1`}>PNG, JPG, GIF (Max 5MB)</p>
                                            {isMobile && (
                                                <p className={`text-xs ${serifTheme.colors.text.muted} mt-1`}>Or send screenshot via WhatsApp</p>
                                            )}
                                        </div>
                                        <input id="screenshot-upload" type="file" className="hidden" accept="image/jpeg, image/png, image/gif" onChange={handleFileChange} />
                                    </label>
                                </motion.div>
                            ) : (
                                <motion.div className={`relative border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} overflow-hidden`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                    <img src={previewImage} alt="Screenshot Preview" className={`w-full h-auto max-h-48 object-contain ${serifTheme.colors.background.tertiary}`} />
                                    <SerifButton
                                      onClick={removeScreenshot}
                                      variant="danger"
                                      size="small"
                                      icon={<X size={16} />}
                                      className="absolute top-1.5 right-1.5 p-1"
                                      aria-label="Remove screenshot"
                                    />
                                </motion.div>
                            )}
                             {/* Error Message Display */}
                             {error && ( 
                                 <motion.p className={`mt-2 text-xs text-red-600 flex items-center gap-1.5`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}> 
                                     <Info size={14}/> {error} 
                                 </motion.p> 
                             )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Ultra Modern Action Button: Confirm via WhatsApp */}
                <motion.div variants={itemVariants} className="mt-8">
                    <SerifButton
                        onClick={handleWhatsAppClick}
                        disabled={!paymentConfirmed || (!isMobile && !screenshot) || isLoading}
                        variant={paymentConfirmed && (isMobile || screenshot) ? "success" : "ghost"}
                        size="large"
                        fullWidth
                        loading={isLoading}
                        icon={!isLoading && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29-3.588c.545 1.422 1.663 2.43 2.98 2.453.386.006.772-.05 1.144-.15.525-.141 1.191-.471 1.715-.896.524-.426.936-.936 1.224-1.496.315-.615.473-1.289.473-1.97 0-.55-.107-1.1-.322-1.618-.213-.521-.663-.69-1.001-.575-.315.111-.853.38-1.177.65-.324.27-.744.715-.893 1.1-.149.386-.171.8-.057 1.213.115.413.173.686.057.896-.111.213-.396.27-.733.162-.338-.107-1.186-.396-1.694-1.263-.508-.866-.508-1.793-.396-1.981.111-.189.396-.27.632-.324.236-.054.396-.027.545.027.149.054.297.161.396.27.099.108.198.216.248.324.05.107.099.161.148.27.05.108.025.162-.025.27-.05.108-.149.27-.248.432-.099.162-.198.324-.149.432.05.108.297.54.644 1.003.346.462.793.893 1.157 1.157.364.264.644.35.744.35.099 0 .149-.027.198-.054.05-.027.099-.081.149-.189.05-.108.027-.216-.025-.324-.05-.107-.396-.853-.545-1.166-.149-.312-.297-.27-.396-.27-.099 0-.198-.027-.347-.081-.149-.054-.297-.108-.396-.162-.099-.054-.173-.081-.248-.027-.074.054-.05.27-.05.415 0 .144.025.754.322 1.263z"/>
                            </svg>
                        )}
                        className="text-lg py-4"
                    >
                        {isLoading ? "Opening WhatsApp..." : "Confirm via WhatsApp"}
                    </SerifButton>
                </motion.div>

            </motion.div> {/* End Right Column */}

          </div> {/* End Two-Column Grid */}

        </motion.div> {/* End Main Card */}
      </SerifPageWrapper>
    </ThemeProvider>
  );
};

export default PurchasePage;
