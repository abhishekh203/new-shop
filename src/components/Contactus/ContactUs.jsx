import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  FaPaperPlane, FaWhatsapp, FaTelegram, FaEnvelope, FaComments,
  FaChevronDown, FaShieldAlt, FaRocket, FaStar, FaCheckCircle,
  FaQuestionCircle, FaPhone, FaClock, FaUsers, FaHeadset,
  FaMapMarkerAlt, FaGlobe, FaMobile, FaLaptop
} from "react-icons/fa";
import { BsLightningCharge, BsCurrencyExchange } from "react-icons/bs";
import Layout from "../layout/Layout";
import { serifTheme } from "../../design-system/themes/serifTheme";
import { SerifButton, SerifBadge, SerifPageWrapper } from "../../design-system/components";
import { useNotification } from "../../context/NotificationContext";

const ContactUs = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

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

      notification.success("Message sent successfully! We'll get back to you soon.", {
        icon: <FaPaperPlane />,
        duration: 4000
      });

      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        navigate("/user-dashboard");
      }, 2000);

    } catch (error) {
      notification.error("Failed to send message. Please try again.", {
        icon: <FaPaperPlane />,
        duration: 4000
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
          <p className={`${serifTheme.colors.text.primary} font-medium`}>Follow these simple steps to purchase your subscription:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li className={serifTheme.colors.text.secondary}>Choose your favorite subscription from our store</li>
            <li className={serifTheme.colors.text.secondary}>Add the subscription to your cart and proceed to checkout</li>
            <li className={serifTheme.colors.text.secondary}>Fill in your details to create a new username and password</li>
            <li className={serifTheme.colors.text.secondary}>Select your preferred payment gateway and complete your payment</li>
            <li className={serifTheme.colors.text.secondary}>
              Your subscription will be delivered to your registered email within 30-180 minutes 
              <span className={`${serifTheme.colors.text.accent} font-medium`}> (up to 8 hours in rare cases)</span>
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
      <SerifPageWrapper>
        <section className="relative min-h-screen py-12 md:py-20" style={{ fontFamily: serifTheme.fontFamily.serif }}>
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Header Section */}
            <div className="text-center mb-12 md:mb-16">
              {/* Badge */}
              <div className="inline-flex items-center mb-6">
                <SerifBadge variant="primary" size="medium" className="text-sm md:text-base">
                  <BsLightningCharge className="mr-2" />
                  #1 Digital Shop in Nepal
                </SerifBadge>
              </div>

              {/* Title */}
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${serifTheme.gradients.accent} mb-6`}>
                Get in Touch
              </h1>

              {/* Subtitle */}
              <p className={`text-xl md:text-2xl ${serifTheme.colors.text.secondary} font-medium mb-6`}>
                Have questions about our digital products? Need support?
              </p>

              {/* Description */}
              <p className={`${serifTheme.colors.text.tertiary} text-lg leading-relaxed max-w-3xl mx-auto mb-8`}>
                We're here to help 24/7 • Instant response • Local support • Secure communication
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <SerifBadge variant="secondary" size="small" className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-600" />
                  Secure Communication
                </SerifBadge>
                <SerifBadge variant="secondary" size="small" className="flex items-center gap-2">
                  <FaGlobe className="text-blue-600" />
                  Local Support
                </SerifBadge>
                <SerifBadge variant="secondary" size="small" className="flex items-center gap-2">
                  <BsCurrencyExchange className="text-yellow-600" />
                  NPR Pricing
                </SerifBadge>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
              
              {/* Left Column - Contact Methods */}
              <div className="space-y-6">
                {/* Contact Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {contactMethods.map((method, index) => (
                    <div
                      key={index}
                      className={`group relative ${serifTheme.gradients.card} ${serifTheme.radius.card} p-5 border ${serifTheme.colors.border.primary} hover:border-amber-400/60 ${serifTheme.transitions.default} hover:-translate-y-1 ${serifTheme.colors.shadow.card} hover:shadow-lg`}
                    >
                      {/* Icon and Stats */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 ${serifTheme.radius.card} ${serifTheme.gradients.button} ${serifTheme.colors.shadow.button}`}>
                          <div className="text-white text-xl">
                            {method.icon}
                          </div>
                        </div>
                        <SerifBadge variant="secondary" size="small">
                          {method.stats}
                        </SerifBadge>
                      </div>

                      {/* Content */}
                      <div className="mb-4">
                        <h3 className={`text-lg font-bold ${serifTheme.colors.text.primary} mb-2`}>
                          {method.title}
                        </h3>
                        <p className={`${serifTheme.colors.text.secondary} text-sm leading-relaxed`}>
                          {method.description}
                        </p>
                      </div>

                      {/* Action Button */}
                      <a
                        href={method.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <SerifButton
                          variant="primary"
                          size="small"
                          className="w-full"
                          icon={<FaPaperPlane />}
                        >
                          {method.btnText} →
                        </SerifButton>
                      </a>
                    </div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className={`${serifTheme.gradients.card} ${serifTheme.radius.card} p-6 border ${serifTheme.colors.border.primary} ${serifTheme.colors.shadow.card}`}>
                  <h3 className={`text-xl font-bold ${serifTheme.colors.text.primary} mb-6 flex items-center gap-3`}>
                    <FaStar className="text-yellow-500 text-xl" />
                    Why Choose Us?
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${serifTheme.gradients.accent} mb-1`}>10K+</div>
                      <div className={`${serifTheme.colors.text.secondary} text-sm font-medium`}>Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${serifTheme.gradients.accent} mb-1`}>24/7</div>
                      <div className={`${serifTheme.colors.text.secondary} text-sm font-medium`}>Support Available</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${serifTheme.gradients.accent} mb-1`}>&lt; 2hr</div>
                      <div className={`${serifTheme.colors.text.secondary} text-sm font-medium`}>Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${serifTheme.gradients.accent} mb-1`}>100%</div>
                      <div className={`${serifTheme.colors.text.secondary} text-sm font-medium`}>Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="space-y-6">
                <div className={`${serifTheme.gradients.card} ${serifTheme.radius.card} p-6 md:p-8 border ${serifTheme.colors.border.primary} ${serifTheme.colors.shadow.card}`}>
                  {/* Form Header */}
                  <div className="mb-6 md:mb-8 text-center">
                    <div className="inline-flex items-center gap-4 mb-4">
                      <div className={`p-3 ${serifTheme.gradients.button} ${serifTheme.radius.card} ${serifTheme.colors.shadow.button}`}>
                        <FaPaperPlane className="text-white text-xl" />
                      </div>
                      <h3 className={`text-2xl font-bold ${serifTheme.colors.text.primary}`}>Send Message</h3>
                    </div>
                    <p className={`${serifTheme.colors.text.secondary} text-base font-medium`}>
                      Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                  </div>

                  {/* Contact Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-bold ${serifTheme.colors.text.primary} mb-2`}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} ${serifTheme.colors.text.primary} placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${serifTheme.transitions.default}`}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-bold ${serifTheme.colors.text.primary} mb-2`}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email address"
                        className={`w-full px-4 py-3 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} ${serifTheme.colors.text.primary} placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${serifTheme.transitions.default}`}
                      />
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-bold ${serifTheme.colors.text.primary} mb-2`}>
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        className={`w-full px-4 py-3 ${serifTheme.colors.background.card} border ${serifTheme.colors.border.secondary} ${serifTheme.radius.button} ${serifTheme.colors.text.primary} placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${serifTheme.transitions.default} resize-none`}
                      />
                    </div>

                    {/* Submit Button */}
                    <div>
                      <SerifButton
                        type="submit"
                        disabled={isLoading}
                        variant="primary"
                        size="large"
                        fullWidth
                        loading={isLoading}
                        icon={!isLoading ? <FaPaperPlane /> : undefined}
                      >
                        {isLoading ? 'Sending Message...' : 'Send Message'}
                      </SerifButton>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className={`mt-16 md:mt-20 ${serifTheme.gradients.card} ${serifTheme.radius.card} p-6 md:p-8 border ${serifTheme.colors.border.primary} ${serifTheme.colors.shadow.card}`}>
              {/* FAQ Header */}
              <div className="text-center mb-10 md:mb-12">
                <div className="inline-flex items-center gap-4 mb-6">
                  <div className={`p-3 ${serifTheme.gradients.button} ${serifTheme.radius.card} ${serifTheme.colors.shadow.button}`}>
                    <FaQuestionCircle className="text-white text-xl" />
                  </div>
                  <h2 className={`text-3xl md:text-4xl font-bold ${serifTheme.colors.text.primary}`}>
                    Frequently Asked Questions
                  </h2>
                </div>
                <p className={`text-lg ${serifTheme.colors.text.secondary} max-w-3xl mx-auto leading-relaxed font-medium`}>
                  Get instant answers to the most common questions about our digital products and services
                </p>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4 max-w-4xl mx-auto">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`${serifTheme.colors.background.card} ${serifTheme.radius.button} border ${serifTheme.colors.border.secondary} overflow-hidden hover:border-amber-400/60 ${serifTheme.transitions.default}`}
                  >
                    <button
                      onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                      className={`w-full p-4 text-left flex items-center justify-between hover:bg-amber-50/30 ${serifTheme.transitions.default}`}
                    >
                      <h3 className={`text-base font-bold ${serifTheme.colors.text.primary} pr-4`}>
                        {faq.question}
                      </h3>
                      <div className={`flex-shrink-0 transition-transform duration-300 ${activeAccordion === index ? 'rotate-180' : ''}`}>
                        <FaChevronDown className={`${serifTheme.colors.text.tertiary}`} />
                      </div>
                    </button>

                    {activeAccordion === index && (
                      <div className="px-4 pb-4 pt-0 border-t border-amber-200/30">
                        <div className={`${serifTheme.colors.text.secondary} leading-relaxed font-medium text-sm pt-4`}>
                          {typeof faq.answer === 'string' ? (
                            <p>{faq.answer}</p>
                          ) : (
                            faq.answer
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </SerifPageWrapper>
    </Layout>
  );
};

export default ContactUs;