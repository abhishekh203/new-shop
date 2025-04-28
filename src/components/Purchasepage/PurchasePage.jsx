import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCircle, Download, ArrowLeft, Upload, X, MessageCircle, Smartphone, Mail } from "lucide-react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const paymentMethods = {
  esewa: { 
    qr: "../img/esewa.jpg", 
    number: "9807677391",
    color: "#5e35b1",
    name: "eSewa",
    icon: "💳"
  },
  khalti: { 
    qr: "../img/khalti.jpg", 
    number: "9807677391",
    color: "#5c2d91",
    name: "Khalti",
    icon: "💸"
  },
  ime: { 
    qr: "../img/imepay.jpg", 
    number: "9807677391",
    color: "#0066cc",
    name: "IME Pay",
    icon: "🏦"
  },
};

const PurchasePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { totalAmount = 0, discountApplied = 0 } = location.state || {};
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('users'));
  
  const [selectedMethod, setSelectedMethod] = useState("esewa");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [error, setError] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    name: user?.name || "", 
    email: user?.email || "", 
    message: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showEmailNotice, setShowEmailNotice] = useState(false);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    // Check if device is mobile on component mount and window resize
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    let timer;
    if (showEmailNotice && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showEmailNotice && countdown === 0) {
      navigate("/user-dashboard");
    }
    return () => clearTimeout(timer);
  }, [showEmailNotice, countdown, navigate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentMethods[selectedMethod].number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = paymentMethods[selectedMethod].qr;
    link.download = `${selectedMethod}-QR.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size too large (max 5MB)");
      return;
    }

    if (!file.type.match(/image.(jpeg|jpg|png)/)) {
      setError("Only JPG/PNG images are allowed");
      return;
    }

    setError(null);
    setScreenshot(file);
    
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setPreviewImage(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // EmailJS Configuration
    const serviceId = "service_dgntc8y";
    const adminTemplateId = "template_7zskxuh";
    const autoReplyTemplateId = "template_ycui5a3";
    const publicKey = "xXLe-IsfnrrGoajcY";

    const completeFormData = {
      ...formData,
      paymentMethod: paymentMethods[selectedMethod].name,
      paymentAmount: totalAmount.toFixed(2),
      paymentScreenshot: previewImage ? "Attached" : "Not provided"
    };

    emailjs
      .send(serviceId, adminTemplateId, completeFormData, publicKey)
      .then(() => {
        return emailjs.send(serviceId, autoReplyTemplateId, completeFormData, publicKey);
      })
      .then(() => {
        toast.success("Details submitted successfully!");
        setShowForm(false);
        // Proceed with WhatsApp confirmation
        sendViaWhatsApp();
      })
      .catch(() => {
        toast.error("Failed to submit details");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const sendViaWhatsApp = () => {
    if (!paymentConfirmed) {
      setError("Please confirm you've completed the payment");
      return;
    }

    if (!isMobile && !screenshot) {
      setError("Please upload your payment screenshot");
      return;
    }

    const message = `*Payment Confirmation*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Method:* ${paymentMethods[selectedMethod].name} ${paymentMethods[selectedMethod].icon}\n` +
      `*Amount:* ₹${totalAmount.toFixed(2)}\n` +
      `*To:* ${paymentMethods[selectedMethod].number}\n` +
      `*Items:* ${formData.message}\n` +
      `*Additional Message:* ${userMessage || "None"}\n\n` +
      `Please verify this payment.`;

    const whatsappUrl = `https://wa.me/+9779807677391?text=${encodeURIComponent(message)}`;
    
    if (isMobile) {
      window.location.href = whatsappUrl;
      setShowEmailNotice(true);
    } else {
      window.open(whatsappUrl, '_blank');
      setShowEmailNotice(true);
    }
  };

  const handleWhatsAppClick = () => {
    if (!formData.message) {
      setShowForm(true);
    } else {
      sendViaWhatsApp();
    }
  };

  const subtotal = totalAmount + discountApplied;
  const formattedAmount = totalAmount.toFixed(2);
  const formattedDiscount = discountApplied.toFixed(2);
  const formattedSubtotal = subtotal.toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md bg-gray-900/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <div 
          className="p-6 pb-4 border-b border-gray-800 relative"
          style={{ backgroundColor: paymentMethods[selectedMethod].color }}
        >
          <div className="flex items-center justify-between">
            <motion.button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
              aria-label="Go back"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="text-white" size={20} />
            </motion.button>
            <motion.h1 
              className="text-xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Complete Payment
            </motion.h1>
            <motion.button 
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
              aria-label="Help"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle className="text-white" size={20} />
            </motion.button>
          </div>
          
          {/* Help Tooltip */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                className="absolute right-6 top-16 bg-white text-gray-900 p-3 rounded-lg shadow-lg z-10 max-w-xs"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <p className="text-sm mb-2">Need help with payment?</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Select your payment method</li>
                  <li>Scan QR or send to the number</li>
                  {!isMobile && <li>Upload screenshot after payment</li>}
                  <li>Confirm via WhatsApp</li>
                </ul>
                <div className="mt-2 flex items-center text-xs text-blue-600">
                  <Smartphone size={14} className="mr-1" />
                  <span>Mobile users can send screenshot directly</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <motion.div 
            className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-white mb-3 flex justify-between items-center">
              <span>Order Summary</span>
              <span className="text-sm font-normal text-gray-400">
                #{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
              </span>
            </h2>
            
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal:</span>
                <span>₹{formattedSubtotal}</span>
              </div>
              
              {discountApplied > 0 && (
                <>
                  <div className="flex justify-between text-green-400">
                    <span>Discount:</span>
                    <span>- ₹{formattedDiscount}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2"></div>
                </>
              )}
              
              <div className="flex justify-between font-bold text-lg text-white">
                <span>Total Amount:</span>
                <motion.span 
                  key={totalAmount}
                  initial={{ scale: 1.2, color: "#4ade80" }}
                  animate={{ scale: 1, color: "#ffffff" }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  ₹{formattedAmount}
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Payment Method Selector */}
          <motion.div 
            className="flex justify-center gap-3 mb-6 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Object.keys(paymentMethods).map((method) => (
              <motion.button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedMethod === method 
                    ? "bg-white text-gray-900 shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-lg">{paymentMethods[method].icon}</span>
                {paymentMethods[method].name}
              </motion.button>
            ))}
          </motion.div>

          {/* QR Code Section */}
          <motion.div 
            className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-medium text-gray-400">
                Scan QR Code <span className="text-xs">({paymentMethods[selectedMethod].name})</span>
              </h2>
              <div className="flex gap-2">
                <motion.button 
                  onClick={downloadQR}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={16} />
                  Save
                </motion.button>
              </div>
            </div>
            
            <motion.div
              className="flex justify-center mb-3"
              key={selectedMethod}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <img
                src={paymentMethods[selectedMethod].qr}
                alt={`${paymentMethods[selectedMethod].name} QR Code`}
                className="w-48 h-48 object-contain rounded-lg border-2 border-white/10 bg-white p-2"
              />
            </motion.div>
            <p className="text-center text-xs text-gray-500 mt-2">
              Scan this QR code using your {paymentMethods[selectedMethod].name} app
            </p>
          </motion.div>

          {/* Payment Number Section */}
          <motion.div 
            className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-sm font-medium text-gray-400 mb-2">Or send payment to:</h2>
            <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <span className="font-mono text-lg font-bold">
                    {paymentMethods[selectedMethod].number}
                  </span>
                </div>
              </div>
              <motion.button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  copied ? "bg-green-600/20 text-green-400" : "bg-gray-700 hover:bg-gray-600"
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: copied ? 1 : 1.05 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {copied ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy</span>
                  </>
                )}
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Paste this number in your {paymentMethods[selectedMethod].name} app when sending payment
            </p>
          </motion.div>

          {/* Payment Confirmation */}
          <motion.div 
            className="flex items-start mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.input
              type="checkbox"
              id="paymentConfirmation"
              checked={paymentConfirmed}
              onChange={(e) => setPaymentConfirmed(e.target.checked)}
              className="h-5 w-5 rounded border-gray-600 focus:ring-2 focus:ring-blue-500 bg-gray-700 mt-1"
              whileTap={{ scale: 0.9 }}
            />
            <label htmlFor="paymentConfirmation" className="ml-3 text-sm text-gray-300">
              <span className="block font-medium">I have completed my payment</span>
              <span className="text-xs text-gray-500">
                {isMobile ? "You can send the screenshot directly via WhatsApp" : "You'll need to upload proof below"}
              </span>
            </label>
          </motion.div>

          {/* Screenshot Upload - Only for desktop */}
          {!isMobile && paymentConfirmed && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Upload Payment Screenshot (Required)
              </label>
              
              {!previewImage ? (
                <motion.div 
                  className="flex items-center justify-center w-full"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Upload className="mb-2 text-gray-400" size={24} />
                      </motion.div>
                      <p className="text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/jpeg, image/png"
                      onChange={handleFileChange}
                    />
                  </label>
                </motion.div>
              ) : (
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <img 
                    src={previewImage} 
                    alt="Payment screenshot preview" 
                    className="w-full h-auto rounded-lg border border-gray-700 max-h-64 object-contain"
                  />
                  <motion.button
                    onClick={removeScreenshot}
                    className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-black/90 transition-colors"
                    aria-label="Remove screenshot"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="text-white" size={18} />
                  </motion.button>
                </motion.div>
              )}
              
              {/* Additional Message */}
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="userMessage" className="block text-sm font-medium text-gray-400 mb-1">
                  Additional Message (Optional)
                </label>
                <textarea
                  id="userMessage"
                  rows={3}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Please mention any special instructions..."
                />
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div 
                  className="mt-3 p-2 bg-red-900/50 text-red-300 text-sm rounded-lg flex items-start gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <X size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={handleWhatsAppClick}
              disabled={!paymentConfirmed || (!isMobile && !screenshot)}
              className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                paymentConfirmed && (isMobile || screenshot)
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              } transition-colors`}
              whileHover={paymentConfirmed && (isMobile || screenshot) ? { scale: 1.02 } : {}}
              whileTap={paymentConfirmed && (isMobile || screenshot) ? { scale: 0.98 } : {}}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="mr-1"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29-3.588c.545 1.422 1.663 2.43 2.98 2.453.386.006.772-.05 1.144-.15.525-.141 1.191-.471 1.715-.896.524-.426.936-.936 1.224-1.496.315-.615.473-1.289.473-1.97 0-.55-.107-1.1-.322-1.618-.213-.521-.663-.69-1.001-.575-.315.111-.853.38-1.177.65-.324.27-.744.715-.893 1.1-.149.386-.171.8-.057 1.213.115.413.173.686.057.896-.111.213-.396.27-.733.162-.338-.107-1.186-.396-1.694-1.263-.508-.866-.508-1.793-.396-1.981.111-.189.396-.27.632-.324.236-.054.396-.027.545.027.149.054.297.161.396.27.099.108.198.216.248.324.05.107.099.161.148.27.05.108.025.162-.025.27-.05.108-.149.27-.248.432-.099.162-.198.324-.149.432.05.108.297.54.644 1.003.346.462.793.893 1.157 1.157.364.264.644.35.744.35.099 0 .149-.027.198-.054.05-.027.099-.081.149-.189.05-.108.027-.216-.025-.324-.05-.107-.396-.853-.545-1.166-.149-.312-.297-.27-.396-.27-.099 0-.198-.027-.347-.081-.149-.054-.297-.108-.396-.162-.099-.054-.173-.081-.248-.027-.074.054-.05.27-.05.415 0 .144.025.754.322 1.263z"/>
              </motion.svg>
              Confirm via WhatsApp
            </motion.button>

            <motion.button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Back to Home
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Form Popup */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-800 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Complete Your Details</h3>
                <motion.button 
                  onClick={() => setShowForm(false)}
                  className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="text-gray-400" size={20} />
                </motion.button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgb(156, 163, 175)',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    },
                    '& .Mui-disabled': {
                      color: 'rgb(209, 213, 219)',
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgb(156, 163, 175)',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    },
                    '& .Mui-disabled': {
                      color: 'rgb(209, 213, 219)',
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Purchased Items"
                  name="message"
                  type="text"
                  value={formData.message}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  multiline
                  rows={4}
                  helperText="Please specify the item(s) you've purchased"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgb(156, 163, 175)',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'rgb(156, 163, 175)',
                    },
                  }}
                />
                
                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={20} color="inherit" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <SendIcon />
                        Submit & Continue
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Notice Popup */}
      <AnimatePresence>
        {showEmailNotice && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center border border-gray-800 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="mb-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <Mail className="mx-auto text-blue-500" size={48} />
                </motion.div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Check Your Email</h3>
              
              <p className="text-gray-400 mb-4">
                We've sent a confirmation to <span className="font-medium text-white">{formData.email}</span>. 
                Please check your inbox <span className="font-medium">(and spam folder)</span> for further instructions.
              </p>
              
              <div className="bg-gray-800/50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-400 mb-1">You'll be redirected in:</p>
                <p className="text-xl font-bold text-white">
                  {countdown} second{countdown !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={() => navigate("/user-dashboard")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Dashboard Now
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowEmailNotice(false);
                    setCountdown(15);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Stay Here
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PurchasePage;