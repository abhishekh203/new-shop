import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft, FaUser, FaMapMarkerAlt } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sita Sharma",
      location: "Kathmandu",
      rating: 5,
      comment: "Amazing service! Got my Netflix subscription instantly. No VPN needed and the price is much better than official rates. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      product: "Netflix Premium"
    },
    {
      id: 2,
      name: "Rajesh Thapa",
      location: "Pokhara",
      rating: 5,
      comment: "Best digital shop in Nepal! Bought Spotify Premium and Disney+ for my family. Fast delivery and excellent customer support.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      product: "Spotify Premium"
    },
    {
      id: 3,
      name: "Priya Gurung",
      location: "Lalitpur",
      rating: 5,
      comment: "Finally found a reliable place to buy digital subscriptions in Nepal. The prices are unbeatable and service is top-notch!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      product: "Disney+ Hotstar"
    },
    {
      id: 4,
      name: "Amit Kumar",
      location: "Bhaktapur",
      rating: 5,
      comment: "Great experience! Bought Canva Pro for my business. The team helped me set it up and it works perfectly. Will buy again!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      product: "Canva Pro"
    },
    {
      id: 5,
      name: "Nisha Tamang",
      location: "Dharan",
      rating: 5,
      comment: "Excellent service! Got my Prime Video subscription within minutes. The eSewa payment was smooth and secure.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      product: "Prime Video"
    },
    {
      id: 6,
      name: "Bikash Rai",
      location: "Biratnagar",
      rating: 5,
      comment: "Best prices for digital subscriptions in Nepal! Bought multiple services and all work perfectly. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      product: "YouTube Premium"
    }
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
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-sm font-medium text-white mb-6">
            <FaQuoteLeft className="mr-2" />
            Customer Reviews
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust us for their digital subscription needs.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-4">
                <FaQuoteLeft className="text-blue-400 text-2xl" />
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 w-4 h-4" />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                "{testimonial.comment}"
              </p>

              {/* Product Badge */}
              <div className="inline-block bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium mb-4">
                {testimonial.product}
              </div>

              {/* Customer Info */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <div className="flex items-center text-gray-400 text-sm">
                    <FaMapMarkerAlt className="mr-1" />
                    {testimonial.location}
                  </div>
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
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">10,000+</div>
            <div className="text-gray-400 text-sm">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
            <div className="text-gray-400 text-sm">Digital Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.9★</div>
            <div className="text-gray-400 text-sm">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400 text-sm">Customer Support</div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers and get your premium digital subscriptions at the best prices in Nepal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <FaUser className="mr-2" />
                Start Shopping
              </button>
              <button className="inline-flex items-center px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm">
                View All Reviews
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
