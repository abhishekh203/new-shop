import React from "react";
import { motion } from "framer-motion";
import { 
  FaShieldAlt, 
  FaRocket, 
  FaGlobe, 
  FaHeadset,
  FaCreditCard,
  FaMobile,
  FaTv,
  FaLaptop,
  FaCheckCircle,
  FaStar,
  FaClock,
  FaUsers
} from "react-icons/fa";
import { BsLightningCharge, BsCurrencyExchange, BsGlobe } from "react-icons/bs";

const Services = () => {
  const services = [
    {
      id: 1,
      icon: <FaRocket className="text-3xl" />,
      title: "Instant Delivery",
      description: "Get your digital subscriptions delivered instantly via email or WhatsApp. No waiting time!",
      color: "from-blue-500 to-cyan-500",
      features: ["Email Delivery", "WhatsApp Delivery", "Instant Activation"]
    },
    {
      id: 2,
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Secure Payments",
      description: "Pay securely with eSewa, Khalti, or bank transfer. All transactions are encrypted and safe.",
      color: "from-green-500 to-emerald-500",
      features: ["eSewa Payment", "Khalti Payment", "Bank Transfer"]
    },
    {
      id: 3,
      icon: <BsGlobe className="text-3xl" />,
      title: "No VPN Required",
      description: "All our subscriptions work perfectly in Nepal without any VPN or proxy setup needed.",
      color: "from-purple-500 to-violet-500",
      features: ["Works in Nepal", "No VPN Setup", "Direct Access"]
    },
    {
      id: 4,
      icon: <FaHeadset className="text-3xl" />,
      title: "24/7 Support",
      description: "Get help anytime with our dedicated customer support team via WhatsApp or phone.",
      color: "from-orange-500 to-red-500",
      features: ["WhatsApp Support", "Phone Support", "Live Chat"]
    },
    {
      id: 5,
      icon: <BsCurrencyExchange className="text-3xl" />,
      title: "NPR Pricing",
      description: "All prices in Nepalese Rupees with no hidden fees or currency conversion charges.",
      color: "from-yellow-500 to-orange-500",
      features: ["NPR Only", "No Hidden Fees", "Transparent Pricing"]
    },
    {
      id: 6,
      icon: <FaUsers className="text-3xl" />,
      title: "Local Support",
      description: "Nepal-based customer support team who understand your needs and speak your language.",
      color: "from-pink-500 to-rose-500",
      features: ["Nepali Support", "Local Team", "Quick Response"]
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers", icon: <FaUsers /> },
    { number: "50+", label: "Digital Products", icon: <FaTv /> },
    { number: "4.9★", label: "Average Rating", icon: <FaStar /> },
    { number: "< 5min", label: "Delivery Time", icon: <FaClock /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-sm font-medium text-white mb-6">
            <BsLightningCharge className="mr-2" />
            Why Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The Best Digital Shop in Nepal
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We provide premium digital subscriptions with the best prices, instant delivery, 
            and local support - all designed for Nepal.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              className="group relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl mb-6 text-white`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-300">
                      <FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Get Your Premium Subscriptions?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers and get instant access to premium digital services at the best prices in Nepal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <FaRocket className="mr-2" />
                Start Shopping Now
              </button>
              <button className="inline-flex items-center px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm">
                <FaHeadset className="mr-2" />
                Contact Support
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
