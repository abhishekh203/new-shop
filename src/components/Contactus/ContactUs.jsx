import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane, FaWhatsapp, FaTelegram, FaEnvelope, FaComments,
  FaChevronDown, FaShieldAlt, FaRocket, FaStar, FaCheckCircle,
  FaQuestionCircle, FaPhone, FaClock, FaUsers, FaHeadset
} from "react-icons/fa";

import Layout from "../layout/Layout";

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // EmailJS Configuration
      const serviceId = "service_dgntc8y";
      const adminTemplateId = "template_7zskxuh";
      const autoReplyTemplateId = "template_ycui5a3";
      const publicKey = "xXLe-IsfnrrGoajcY";

      // Send admin notification
      await emailjs.send(serviceId, adminTemplateId, formData, publicKey);

      // Send auto-reply to user
      await emailjs.send(serviceId, autoReplyTemplateId, formData, publicKey);

      toast.success("Message sent successfully! We'll get back to you soon.", {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500'
        }
      });

      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        navigate("/user-dashboard");
      }, 2000);

    } catch (error) {
      toast.error("Failed to send message. Please try again.", {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const faqs = [
    {
      question: "I AM NEW HERE AND CAN'T BELIEVE THESE OFFERS AND DISCOUNTS!",
      answer: "We understand if you have any skepticism regarding our generous discounts. Allow us to provide some reassuring facts. Our company has proudly served over 10500+ satisfied users since 2019, with an impressive average customer satisfaction rating of 4.8/5."
    },
    {
      question: "HOW TO BUY A SUBSCRIPTION?",
      answer: (
        <div className="space-y-3">
          <p className="text-white font-medium">Follow these simple steps to purchase your subscription:</p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-200">
            <li>Choose your favorite subscription from our store</li>
            <li>Add the subscription to your cart and proceed to checkout</li>
            <li>Fill in your details to create a new username and password</li>
            <li>Select your preferred payment gateway and complete your payment</li>
            <li>
              Your subscription will be delivered to your registered email within 30-180 minutes 
              <span className="text-blue-300 font-medium"> (up to 8 hours in rare cases)</span>
            </li>
          </ol>
        </div>
      )
    },
    {
      question: "ARE THESE SUBSCRIPTIONS REAL AND SAFE TO USE?",
      answer: "Yes, all our subscriptions are 100% genuine and safe to use. We source them directly from official providers and ensure complete security for all transactions."
    },
    {
      question: "HOW MY DATA IS PROTECTED?",
      answer: "We've got you covered! Your name, email, phone number and everything else are completely secure and encrypted with 128bit SSL technology. Rest easy knowing that no one, not even us, can access your personal information!"
    },
    {
      question: "HOW DO I RECEIVE CUSTOMER SUPPORT?",
      answer: "We offer 24/7 support through WhatsApp, Telegram, and email. You can contact us through any of the channels above and expect a response within 2 hours."
    },
    {
      question: "WHAT IF MY SUBSCRIPTION STOPS WORKING?",
      answer: "Each subscription comes with a replacement warranty period during which it can be replaced without any complications. Please contact us with your Order ID, and we will take care of the rest immediately."
    },
    {
      question: "WHAT IF I DON'T GET MY SUBSCRIPTION AFTER CHECKOUT?",
      answer: "We strive to process all orders in a timely manner, with most orders being fulfilled within 1-180 minutes. In rare cases, it may take up to 8 hours to process an order. If you experience any issues with your subscription, please do not hesitate to contact us."
    },
    {
      question: "SUBSCRIPTION I AM LOOKING FOR IS OUT OF STOCK! WHAT TO DO?",
      answer: "We restock frequently. Please join our Telegram group or WhatsApp group to get notified when it's available again. You can also contact us directly for priority notifications."
    }
  ];

  const contactMethods = [
    {
      title: "WhatsApp Support",
      description: "Get instant help via WhatsApp - Fastest response time",
      icon: <FaWhatsapp className="text-2xl" />,
      btnText: "Chat Now",
      href: "https://wa.me/9779807677391",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-500/10 to-emerald-600/10",
      borderColor: "border-green-500/30",
      stats: "24/7 Available",
      color: "text-green-400"
    },
    {
      title: "Telegram Community",
      description: "Join our active community of 10K+ members",
      icon: <FaTelegram className="text-2xl" />,
      btnText: "Join Now",
      href: "https://t.me/netflixnepalseller",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-600/10",
      borderColor: "border-blue-500/30",
      stats: "10K+ Members",
      color: "text-blue-400"
    },
    {
      title: "Email Support",
      description: "Send detailed inquiries - Professional support",
      icon: <FaEnvelope className="text-2xl" />,
      btnText: "Send Email",
      href: "mailto:digitalshopnepalstore@gmail.com",
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/10 to-pink-600/10",
      borderColor: "border-purple-500/30",
      stats: "< 2hr Response",
      color: "text-purple-400"
    },
    {
      title: "WhatsApp Group",
      description: "Connect with other users and get updates",
      icon: <FaComments className="text-2xl" />,
      btnText: "Join Group",
      href: "https://chat.whatsapp.com/IXl6YmkAZgEJkveJgbatAP",
      gradient: "from-teal-500 to-green-600",
      bgGradient: "from-teal-500/10 to-green-600/10",
      borderColor: "border-teal-500/30",
      stats: "Active Community",
      color: "text-teal-400"
    }
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)`,
            backgroundSize: '200px 200px'
          }}></div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 2 }}
            className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 4 }}
            className="absolute bottom-32 left-1/4 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 1 }}
            className="absolute top-1/2 right-1/3 w-20 h-20 bg-green-500/10 rounded-full blur-2xl"
          />
        </div>

        <div className="relative z-10">
          {/* Enhanced Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="pt-24 pb-16 px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative z-10 mb-8"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                  Get in
                </span>
                <br />
                <span className="text-white">Touch</span>
              </h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "120px" }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 mx-auto rounded-full shadow-lg"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-xl md:text-2xl text-gray-100 max-w-4xl mx-auto leading-relaxed mb-8 font-medium"
            >
              Have questions about our digital products? Need support?
              <span className="text-cyan-300 font-bold"> We're here to help 24/7</span>
            </motion.p>

            {/* Enhanced Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex flex-wrap justify-center gap-8 text-sm text-gray-200"
            >
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <FaCheckCircle className="text-green-400 text-lg" />
                <span className="font-medium">10K+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <FaRocket className="text-blue-400 text-lg" />
                <span className="font-medium">Fast Response Time</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <FaShieldAlt className="text-purple-400 text-lg" />
                <span className="font-medium">Secure & Trusted</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <div className="container mx-auto px-6 pb-20">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
              {/* Left Column - Contact Methods */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {/* Contact Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                  {contactMethods.map((method, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ y: -10, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onHoverStart={() => setHoveredCard(index)}
                      onHoverEnd={() => setHoveredCard(null)}
                      className={`group relative bg-gradient-to-br from-gray-900/90 to-black/95 backdrop-blur-xl rounded-2xl overflow-hidden border ${method.borderColor} hover:border-opacity-80 transition-all duration-500 shadow-2xl hover:shadow-3xl`}
                    >
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${method.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                      {/* Glow Effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-30 blur transition-opacity duration-500"
                           style={{ background: `linear-gradient(45deg, ${method.gradient.replace('from-', '').replace('to-', '').replace(' ', ', ')})` }} />

                      <div className="relative p-8">
                        {/* Icon and Stats */}
                        <div className="flex items-start justify-between mb-6">
                          <div className={`p-4 rounded-2xl bg-gradient-to-br ${method.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {method.icon}
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-bold ${method.color} bg-gray-800/70 px-3 py-1 rounded-full border border-gray-600/50`}>
                              {method.stats}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                              style={{ backgroundImage: `linear-gradient(45deg, ${method.gradient.replace('from-', '').replace('to-', '').replace(' ', ', ')})` }}>
                            {method.title}
                          </h3>
                          <p className="text-gray-200 text-lg leading-relaxed font-medium">{method.description}</p>
                        </div>

                        {/* Action Button */}
                        <motion.a
                          href={method.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${method.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:shadow-2xl`}
                        >
                          <span>{method.btnText}</span>
                          <motion.div
                            animate={{ x: hoveredCard === index ? 5 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            →
                          </motion.div>
                        </motion.a>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced Quick Stats */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-gray-900/90 to-black/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl"
                >
                  <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <FaStar className="text-yellow-400 text-2xl" />
                    Why Choose Us?
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center group">
                      <div className="text-3xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">10K+</div>
                      <div className="text-gray-200 text-sm font-medium">Happy Customers</div>
                    </div>
                    <div className="text-center group">
                      <div className="text-3xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors">24/7</div>
                      <div className="text-gray-200 text-sm font-medium">Support Available</div>
                    </div>
                    <div className="text-center group">
                      <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors">&lt; 2hr</div>
                      <div className="text-gray-200 text-sm font-medium">Response Time</div>
                    </div>
                    <div className="text-center group">
                      <div className="text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors">100%</div>
                      <div className="text-gray-200 text-sm font-medium">Satisfaction</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column - Contact Form */}
              <motion.div
                variants={itemVariants}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-gray-900/90 to-black/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                  {/* Form Header */}
                  <div className="mb-8 text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="inline-flex items-center gap-4 mb-6"
                    >
                      <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-lg">
                        <FaPaperPlane className="text-white text-2xl" />
                      </div>
                      <h3 className="text-3xl font-bold text-white">Send Message</h3>
                    </motion.div>
                    <p className="text-gray-200 text-lg font-medium">
                      Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                  </div>

                  {/* Contact Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm font-bold text-gray-200 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full px-5 py-4 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm font-medium"
                      />
                    </motion.div>

                    {/* Email Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm font-bold text-gray-200 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email address"
                        className="w-full px-5 py-4 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm font-medium"
                      />
                    </motion.div>

                    {/* Message Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm font-bold text-gray-200 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="Tell us how we can help you..."
                        className="w-full px-5 py-4 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm resize-none font-medium"
                      />
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="text-lg" />
                            <span>Send Message</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </div>

            {/* Enhanced FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-20 bg-gradient-to-br from-gray-900/90 to-black/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl"
            >
              {/* FAQ Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.7 }}
                  className="inline-flex items-center gap-4 mb-8"
                >
                  <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl shadow-lg">
                    <FaQuestionCircle className="text-white text-2xl" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white">
                    Frequently Asked Questions
                  </h2>
                </motion.div>
                <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium">
                  Get instant answers to the most common questions about our digital products and services
                </p>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4 max-w-4xl mx-auto">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/70 transition-all duration-300 shadow-lg">
                      <motion.button
                        onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <h3 className="text-lg font-bold text-white pr-4 group-hover:text-blue-300 transition-colors">
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: activeAccordion === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <FaChevronDown className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </motion.div>
                      </motion.button>

                      <AnimatePresence>
                        {activeAccordion === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 border-t border-gray-700/50">
                              <div className="text-gray-200 leading-relaxed font-medium">
                                {typeof faq.answer === 'string' ? (
                                  <p>{faq.answer}</p>
                                ) : (
                                  faq.answer
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;