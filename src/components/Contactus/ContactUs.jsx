import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Send as SendIcon, WhatsApp, Telegram, Email, Chat, ExpandMore } from "@mui/icons-material";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

// Improved glass card effect styles
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'relative'
};

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

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


  const contactMethods = [
    { 
      title: "WhatsApp Support", 
      description: "Instant messaging support", 
      icon: <WhatsApp className="text-3xl" />, 
      btnText: "Message Us", 
      href: "https://wa.me/9779807677391", 
      color: "from-emerald-500 to-teal-600",
      hoverColor: "hover:from-emerald-600 hover:to-teal-700",
      bgColor: "rgba(16, 185, 129, 0.1)",
      borderColor: "rgba(16, 185, 129, 0.3)"
    },
    { 
      title: "Telegram Support", 
      description: "Join our community", 
      icon: <Telegram className="text-3xl" />, 
      btnText: "Join Group", 
      href: "https://t.me/netflixnepalseller", 
      color: "from-blue-500 to-indigo-600",
      hoverColor: "hover:from-blue-600 hover:to-indigo-700",
      bgColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgba(59, 130, 246, 0.3)"
    },
    { 
      title: "Email Support", 
      description: "For detailed inquiries", 
      icon: <Email className="text-3xl" />, 
      btnText: "Send Email", 
      href: "mailto:digitalshopnepalstore@gmail.com", 
      color: "from-rose-500 to-pink-600",
      hoverColor: "hover:from-rose-600 hover:to-pink-700",
      bgColor: "rgba(244, 63, 94, 0.1)",
      borderColor: "rgba(244, 63, 94, 0.3)"
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 60,
              },
              opacity: {
                value: 0.3,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-12 px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-75"></div>
              <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Contact Us
              </h1>
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            We're here to help with any questions about our services. Reach out through any channel below.
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-6 pb-20">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column - Contact Options */}
            <div className="lg:w-1/2 space-y-8">
              {/* Improved Quick Contact Cards */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-1 gap-6"
              >
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setHoveredCard(index)}
                    onHoverEnd={() => setHoveredCard(null)}
                    className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${glassStyle}`}
                    style={{
                      borderColor: method.borderColor,
                      background: method.bgColor
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 hover:opacity-20 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(45deg, ${method.color.replace('from-', '').replace('to-', '').replace(' ', ', ')})`
                      }}
                    />
                    
                    <div className="p-6 flex items-center relative z-10">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${method.color} shadow-lg`}>
                        {method.icon}
                      </div>
                      <div className="ml-6 flex-1">
                        <h3 className="text-xl font-bold text-white">{method.title}</h3>
                        <p className="text-gray-300 mt-1">{method.description}</p>
                      </div>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={method.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`ml-4 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-br ${method.color} ${method.hoverColor} transition-all shadow-md`}
                      >
                        {method.btnText}
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className={`p-6 rounded-2xl ${glassStyle}`}
              >
                <h3 className="text-xl font-bold text-white mb-4">Join Our Communities</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.a
                    whileHover={{ y: -3 }}
                    href="https://wa.me/9779807677391"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all"
                  >
                    <WhatsApp />
                    WhatsApp
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -3 }}
                    href="https://t.me/netflixnepalseller"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
                  >
                    <Telegram />
                    Telegram
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -3 }}
                    href="https://chat.whatsapp.com/IXl6YmkAZgEJkveJgbatAP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-all"
                  >
                    <Chat />
                    WhatsApp Group
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -3 }}
                    href="mailto:digitalshopnepalstore@gmail.com"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium transition-all"
                  >
                    <Email />
                    Email
                  </motion.a>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:w-1/2"
            >
              <div className={`p-8 rounded-2xl ${glassStyle}`}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Send Us a Message</h3>
                  <p className="text-gray-300">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                      InputProps={{
                        sx: {
                          color: 'white',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                      InputProps={{
                        sx: {
                          color: 'white',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      variant="outlined"
                      multiline
                      rows={4}
                      required
                      InputProps={{
                        sx: {
                          color: 'white',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      size="large"
                      fullWidth
                      startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                      disabled={isLoading}
                      sx={{
                        background: 'linear-gradient(135deg, #7B61FF 0%, #9B4DFF 100%)',
                        borderRadius: '12px',
                        padding: '14px',
                        fontSize: '16px',
                        fontWeight: '600',
                        textTransform: 'none',
                        boxShadow: '0 4px 6px rgba(123, 97, 255, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #6B51EE 0%, #8B3DEE 100%)',
                          boxShadow: '0 6px 8px rgba(123, 97, 255, 0.4)',
                        },
                      }}
                    >
                      {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>

          
            {/* FAQ content remains the same */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className={`mt-20 rounded-2xl p-8 ${glassStyle}`}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Find answers to common questions about our services
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                >
                  <Accordion 
                    expanded={activeAccordion === index}
                    onChange={() => setActiveAccordion(activeAccordion === index ? null : index)}
                    className="bg-gray-800 rounded-xl overflow-hidden transition-all"
                    sx={{
                      '&:before': { display: 'none' },
                      background: 'rgba(39, 39, 42, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <motion.div
                          animate={{ rotate: activeAccordion === index ? 180 : 0 }}
                        >
                          <ExpandMore className="text-white" />
                        </motion.div>
                      }
                      aria-controls={`panel${index}-content`}
                      id={`panel${index}-header`}
                      className="hover:bg-gray-700 transition-all min-h-[72px]"
                    >
                      <Typography className="font-bold text-white text-lg">
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AccordionDetails className="bg-gray-700 p-6">
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
                    </motion.div>
                  </Accordion>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

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
        theme="dark"
        toastStyle={{
          background: '#1F2937',
          color: '#F3F4F6',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      />
    </div>
  );
};

export default ContactUs;