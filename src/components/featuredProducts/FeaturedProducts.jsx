import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createProductUrl } from "../../utils/slugUtils";
import { 
  FaFire, 
  FaClock, 
  FaShieldAlt,
  FaPlay,
  FaHeadphones,
  FaTv,
  FaMobile,
  FaLaptop,
  FaCheckCircle
} from "react-icons/fa";
import { BsLightningCharge, BsCurrencyExchange } from "react-icons/bs";

const FeaturedProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      name: "Netflix Premium",
      category: "Streaming",
      price: "₹899",
      originalPrice: "₹1,199",
      discount: "25% OFF",
      image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
      rating: 4.9,
      reviews: 1247,
      features: ["4K Quality", "4 Screens", "Ad-Free"],
      badge: "BEST SELLER",
      badgeColor: "from-red-500 to-pink-500"
    },
    {
      id: 2,
      name: "Spotify Premium",
      category: "Music",
      price: "₹299",
      originalPrice: "₹399",
      discount: "25% OFF",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      rating: 4.8,
      reviews: 892,
      features: ["Ad-Free", "Offline Mode", "High Quality"],
      badge: "POPULAR",
      badgeColor: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      name: "Disney+ Hotstar",
      category: "Streaming",
      price: "₹599",
      originalPrice: "₹799",
      discount: "25% OFF",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      rating: 4.7,
      reviews: 567,
      features: ["4K HDR", "Multiple Profiles", "Kids Content"],
      badge: "NEW",
      badgeColor: "from-blue-500 to-cyan-500"
    },
    {
      id: 4,
      name: "Canva Pro",
      category: "Software",
      price: "₹1,499",
      originalPrice: "₹1,999",
      discount: "25% OFF",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      rating: 4.9,
      reviews: 234,
      features: ["Premium Templates", "Brand Kit", "Team Access"],
      badge: "LIMITED",
      badgeColor: "from-purple-500 to-violet-500"
    }
  ];

  // Auto-rotate featured products
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-medium text-white mb-6">
            <FaFire className="mr-2" />
            Featured Products
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Most Popular Subscriptions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get the best digital subscriptions at unbeatable prices. 
            Instant delivery, no VPN required, and local support.
          </p>
        </motion.div>

        {/* Featured Product Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Main Featured Product */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={featuredProducts[currentIndex].image}
                alt={featuredProducts[currentIndex].name}
                className="w-full h-96 object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              
              {/* Badge */}
              <div className={`absolute top-4 left-4 bg-gradient-to-r ${featuredProducts[currentIndex].badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                {featuredProducts[currentIndex].badge}
              </div>
              
              {/* Price */}
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold">{featuredProducts[currentIndex].price}</span>
                  <span className="text-lg line-through text-gray-300">{featuredProducts[currentIndex].originalPrice}</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    {featuredProducts[currentIndex].discount}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white space-y-6"
          >
            <div>
              <span className="text-blue-400 font-medium">{featuredProducts[currentIndex].category}</span>
              <h3 className="text-3xl font-bold mb-4">{featuredProducts[currentIndex].name}</h3>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">What's included:</h4>
              <div className="grid grid-cols-1 gap-2">
                {featuredProducts[currentIndex].features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <FaCheckCircle className="text-green-400 mr-3" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                to={createProductUrl(featuredProducts[currentIndex])}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaPlay className="mr-2" />
                Get Started
              </Link>
              
              <Link
                to="/allproduct"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                View All Products
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-6">
              <div className="flex items-center text-sm text-gray-400">
                <FaShieldAlt className="mr-2 text-green-400" />
                Secure Payment
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <BsLightningCharge className="mr-2 text-yellow-400" />
                Instant Delivery
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <BsCurrencyExchange className="mr-2 text-blue-400" />
                NPR Pricing
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Indicators */}
        <div className="flex justify-center space-x-3">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'bg-white scale-125' 
                  : 'bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
