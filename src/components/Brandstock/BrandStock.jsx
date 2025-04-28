import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaHeadset, FaShieldAlt, FaCreditCard, FaWhatsapp, FaTimes } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

const BrandsStock = () => {
  // Form state management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Brand data
  const brands = [
    { name: "LinkedIn", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" },
    { name: "Disney+ Hotstar", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg" },
    { name: "YouTube Premium", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" },
    { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Prime Video", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png" },
    { name: "HBO Max", logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg" },
    { name: "Apple Music", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Crunchyroll", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.png" },
    { name: "Hulu", logo: "https://upload.wikimedia.org/wikipedia/commons/0/03/Hulu_logo_%282014%29.svg" },
    { name: "Peacock", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/NBCUniversal_Peacock_Logo.svg" },
    { name: "Paramount+", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg" },
    { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
    { name: "Zoom", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg" },
    { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
    { name: "Notion", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" },
    { name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
    { name: "JetBrains", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/JetBrains_Logo_2016.svg" },
    { name: "Unity", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Unity_Technologies_logo.svg" },
  ];

  // Features data
  const features = [
    { 
      icon: <FaGlobe className="text-blue-400 text-3xl" />, 
      title: "Free Worldwide Delivery", 
      description: "Instant delivery via Email",
      color: "from-blue-500 to-blue-700",
      animation: { rotate: [0, 5, -5, 0] }
    },
    { 
      icon: <FaHeadset className="text-green-400 text-3xl" />, 
      title: "24/7 Support", 
      description: "Free human chat support",
      color: "from-green-500 to-green-700",
      animation: { scale: [1, 1.03, 1] }
    },
    { 
      icon: <FaShieldAlt className="text-orange-400 text-3xl" />, 
      title: "Safe & Stable", 
      description: "Hassle-free replacements",
      color: "from-orange-500 to-orange-700",
      animation: { y: [0, -3, 0] }
    },
    { 
      icon: <FaCreditCard className="text-purple-400 text-3xl" />, 
      title: "Secure Checkout", 
      description: "Esewa/Khalti/ImePay/Bank Transfer",
      color: "from-purple-500 to-purple-700",
      animation: { x: [0, 3, -3, 0] }
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.6
      }
    }
  };

  // WhatsApp integration
  const openWhatsApp = () => {
    const phoneNumber = "+9779807677391";
    const message = "Hello! I'd like to request a custom subscription for:";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Form handlers
  const openCustomOrderForm = () => setIsFormOpen(true);

  const closeForm = () => {
    setIsFormOpen(false);
    setSubmitStatus(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://getform.io/f/aqokwdxa", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-blue-900 py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            whileHover={{ scale: 1.02 }}
          >
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Brands</span> We Offer
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Our rigorous selection process ensures only the highest quality options. We understand that security and stability are non-negotiable.
          </motion.p>
        </motion.div>

        {/* Brands Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mb-16"
        >
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.03, y: -3, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center h-28 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer"
            >
              <motion.img 
                src={brand.logo} 
                alt={brand.name} 
                className="h-10 object-contain mb-2"
                whileHover={{ scale: 1.05 }}
              />
              <p className="text-gray-300 text-xs md:text-sm text-center">{brand.name}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -3, transition: { type: "spring", stiffness: 300 } }}
              animate={feature.animation}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 3, delay: index * 0.2 }}
              className={`bg-gradient-to-br ${feature.color} p-5 rounded-xl shadow-lg hover:shadow-xl transition-all h-full`}
            >
              <div className="flex flex-col items-center text-center h-full">
                <motion.div className="mb-3" whileHover={{ scale: 1.1 }}>
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-200 text-xs md:text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <motion.p 
            className="text-gray-400 mb-4 text-sm md:text-base"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            NEED SOMETHING NOT LISTED HERE?
          </motion.p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(245, 158, 11, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium md:font-bold py-2 md:py-3 px-6 md:px-8 rounded-full shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              onClick={openWhatsApp}
            >
              <FaWhatsapp className="text-lg md:text-xl" />
              Request via WhatsApp
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium md:font-bold py-2 md:py-3 px-6 md:px-8 rounded-full shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              onClick={openCustomOrderForm}
            >
              <FiExternalLink className="text-lg md:text-xl" />
              Custom Order Form
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Custom Order Form Modal */}
      {isFormOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 max-w-md w-full p-6 relative"
          >
            <button 
              onClick={closeForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes className="text-xl" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Custom Order Request
            </h3>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="text-green-400 text-5xl mb-4">✓</div>
                <h4 className="text-xl font-bold text-white mb-2">Thank You!</h4>
                <p className="text-gray-300">Your request has been submitted successfully.</p>
                <p className="text-gray-400 text-sm mt-4">We'll contact you shortly.</p>
                <button
                  onClick={closeForm}
                  className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : submitStatus === 'error' ? (
              <div className="text-center py-8">
                <div className="text-red-400 text-5xl mb-4">✕</div>
                <h4 className="text-xl font-bold text-white mb-2">Submission Failed</h4>
                <p className="text-gray-300">Please try again or contact us via WhatsApp.</p>
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => setSubmitStatus(null)}
                    className="bg-gray-700 text-white py-2 px-6 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={openWhatsApp}
                    className="bg-green-600 text-white py-2 px-6 rounded-full hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <FaWhatsapp /> WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+977XXXXXXXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-gray-300 mb-2">Service You Need</label>
                    <input
                      type="text"
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Netflix Premium, Spotify Family, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-gray-300 mb-2">Additional Details</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-full font-bold transition-colors flex items-center justify-center gap-2 ${
                      isSubmitting 
                        ? 'bg-blue-700 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BrandsStock;