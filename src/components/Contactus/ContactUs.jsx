import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Send as SendIcon, WhatsApp, Telegram, Email, Chat, ExpandMore } from "@mui/icons-material";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80
    }
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Sending your message...");

    // EmailJS Configuration
    const serviceId = "service_dgntc8y";
    const adminTemplateId = "template_7zskxuh";
    const autoReplyTemplateId = "template_ycui5a3";
    const publicKey = "xXLe-IsfnrrGoajcY";

    emailjs
      .send(serviceId, adminTemplateId, formData, publicKey)
      .then(() => {
        return emailjs.send(serviceId, autoReplyTemplateId, formData, publicKey);
      })
      .then(() => {
        toast.update(toastId, {
          render: "Message sent! Redirecting to dashboard...",
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
        setFormData({ name: "", email: "", message: "" });
        
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 3000);
      })
      .catch(() => {
        toast.update(toastId, {
          render: "Failed to send message",
          type: "error",
          isLoading: false,
          autoClose: 3000
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const faqs = [
    {
      question: "I AM NEW HERE AND CAN'T BELIEVE THESE OFFERS AND DISCOUNTS!",
      answer: "We understand if you have any skepticism regarding our generous discounts. Allow us to provide some reassuring facts. Our company has proudly served over 10500+ satisfied users since 2019, with an impressive average customer satisfaction rating of 4.8/5.."
    },
    {
      question: "HOW TO BUY A SUBSCRIPTION?",
      answer: (
        <div className="space-y-2">
          <p>Follow these simple steps to purchase your subscription:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Choose your favorite subscription from our store</li>
            <li>Add the subscription to your cart and proceed to checkout</li>
            <li>Fill in your details to create a new username and password</li>
            <li>Select your preferred payment gateway and complete your payment</li>
            <li>
              Your subscription will be delivered to your registered email within 30-180 minutes 
              <span className="text-gray-300"> (up to 8 hours in rare cases)</span>
            </li>
          </ol>
        </div>
      )
    },
    {
      question: "ARE THESE SUBSCRIPTIONS REAL AND SAFE TO USE?",
      answer: "Yes, all our subscriptions are 100% genuine and safe to use. We source them directly from official providers."
    },
    {
      question: "HOW MY DATA IS PROTECTED?",
      answer: "We've got you covered! Your name, email, phone number and everything else are completely secure and encrypted with 128bit SSL technology. Rest easy knowing that no one, not even us, can access your personal information!."
    },
    {
      question: "HOW DO I RECEIVE CUSTOMER SUPPORT?",
      answer: "We offer 24/7 support through WhatsApp, Telegram, and email. You can contact us through any of the channels above."
    },
    {
      question: "WHAT IF MY SUBSCRIPTION STOPS WORKING?",
      answer: "Each subscription comes with a replacement warranty period during which it can be replaced without any complications. Please contact us with your Order ID, and we will take care of the rest. Thank you."
    },
    {
      question: "WHAT IF I DON'T GET MY SUBSCRIPTION AFTER CHECKOUT?",
      answer: "We strive to process all orders in a timely manner, with most orders being fulfilled within 1-180 minutes. In rare cases, it may take up to 8 hours to process an order. If you experience any issues with your subscription, please do not hesitate to contact us.."
    },
    {
      question: "SUBSCRIPTION I AM LOOKING FOR IS OUT OF STOCK! WHAT TO DO?",
      answer: "We restock frequently. Please join our Telegram group or WhatsApp group to get notified when it's available again."
    }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-br from-gray-900 to-black p-6 md:p-10 lg:p-14 rounded-1xl shadow-2xl max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <motion.div 
        variants={itemVariants}
        className="text-center mb-12"
      >
        <motion.h2 
          whileHover={{ scale: 1.02 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400"
        >
          Contact Us
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-300 max-w-2xl mx-auto"
        >
          Questions, concerns, or comments? We're here to help. Reach out through any channel below.
        </motion.p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-10 mb-16">
        {/* Left Column - Contact Options */}
        <motion.div 
          variants={containerVariants}
          className="lg:w-1/2 space-y-8"
        >
          {/* Quick Action Buttons */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              { text: "WhatsApp Message", href: "https://wa.me/9779807677391", icon: <WhatsApp />, bg: "bg-green-600 hover:bg-green-700" },
              { text: "WhatsApp Group", href: "https://chat.whatsapp.com/IXl6YmkAZgEJkveJgbatAP", icon: <Chat />, bg: "bg-green-500 hover:bg-green-600" },
              { text: "Telegram Group", href: "https://t.me/netflixnepalseller", icon: <Telegram />, bg: "bg-blue-500 hover:bg-blue-600" },
              { text: "Viber Support", href: "https://invite.viber.com/?g2=AQBrGVKdTtA4tVRdx%2BTJrt0PQl5UeP6GdiUj98pJWDxymojm1eCCv%2B8NWXUkD%2F3z", icon: <Chat />, bg: "bg-purple-600 hover:bg-purple-700" },
            ].map((item, index) => (
              <motion.a
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium transition-all ${item.bg} shadow-md hover:shadow-lg`}
              >
                {item.icon}
                {item.text}
              </motion.a>
            ))}
          </motion.div>

          {/* Support Cards */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { 
                title: "Payment Support", 
                description: "After payment assistance", 
                icon: <WhatsApp className="text-3xl" />, 
                btnText: "WhatsApp", 
                href: "https://wa.me/9779807677391", 
                bg: "bg-gradient-to-br from-green-500 to-green-600" 
              },
              { 
                title: "Technical Help", 
                description: "Setup and troubleshooting", 
                icon: <Telegram className="text-3xl" />, 
                btnText: "Telegram", 
                href: "https://t.me/digitalshopnepalstore", 
                bg: "bg-gradient-to-br from-blue-500 to-blue-600" 
              },
              { 
                title: "Email Us", 
                description: "General inquiries", 
                icon: <Email className="text-3xl" />, 
                btnText: "Send Email", 
                href: "mailto:digitalshopnepalstore@gmail.com", 
                bg: "bg-gradient-to-br from-red-500 to-red-600" 
              },
            ].map((card, index) => (
              <motion.div 
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div 
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className={`w-14 h-14 flex items-center justify-center rounded-full ${card.bg} mb-4`}
                  >
                    {card.icon}
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{card.description}</p>
                  <motion.a 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    href={card.href} 
                    className={`w-full py-2 px-4 rounded-lg text-white font-medium text-center ${card.bg} hover:opacity-90 transition-opacity`}
                  >
                    {card.btnText}
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column - Contact Form */}
        <motion.div 
          variants={itemVariants}
          className="lg:w-1/2"
        >
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Get Your Account Details</h3>
              <p className="text-gray-600">
                Fill this form to receive your ID & password after purchase.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Your Name", name: "name", type: "text" },
                { label: "Email Address", name: "email", type: "email" },
                { 
                  label: "Purchased Items", 
                  name: "message", 
                  type: "text",
                  multiline: true, 
                  rows: 4,
                  helperText: "Please specify the item(s) you've purchased" 
                },
              ].map((field, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  custom={index}
                >
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    variant="outlined"
                    required
                    multiline={field.multiline}
                    rows={field.rows}
                    helperText={field.helperText}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />
                </motion.div>
              ))}

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                  disabled={isLoading}
                  sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                    width: '100%',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textTransform: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  {isLoading ? "Sending..." : "Send Request"}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div 
        variants={itemVariants}
        className="mt-16 bg-gray-800 rounded-2xl p-8 shadow-xl"
      >
        <motion.div 
          variants={itemVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Common queries answered
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
            >
              <Accordion 
                className="bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                sx={{
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<motion.div whileHover={{ rotate: 180 }}><ExpandMore className="text-white" /></motion.div>}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  className="hover:bg-gray-600 transition-all min-h-[72px] shadow-sm"
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0',
                      alignItems: 'center',
                    },
                  }}
                >
                  <Typography className="font-bold text-black text-lg">
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="bg-gray-600 p-6 border-t border-gray-500">
                  {typeof faq.answer === 'string' ? (
                    <Typography className="text-gray-200">
                      {faq.answer}
                    </Typography>
                  ) : (
                    <div className="text-gray-200">
                      {faq.answer}
                    </div>
                  )}
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </motion.div>
  );
};

export default ContactUs; 