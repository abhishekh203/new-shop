import React, { useContext, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import myContext from '../../context/myContext';
import { createSlug } from '../../utils/slugUtils';
import { productGallery as productGalleryConfig } from '../../config/homepageConfig';
import { serifTheme } from '../../design-system/themes';

const HorizontalProductGallery = ({ title = productGalleryConfig.featuredTitle, category = null }) => {
  const context = useContext(myContext);
  const { getAllProduct } = context;
  const navigate = useNavigate();

  // Filter products based on category if provided
  const filteredProducts = category 
    ? getAllProduct.filter(product => product.category.toLowerCase() === category.toLowerCase())
    : getAllProduct;

  // Filter out products without images
  const productsWithImages = filteredProducts.filter(product => 
    product.productImageUrl && product.productImageUrl.trim() !== ''
  );

  // Duplicate products for infinite scroll effect
  const displayProducts = [...productsWithImages, ...productsWithImages];

  // Handle product click
  const handleProductClick = (product) => {
    const slug = createSlug(product.title);
    navigate(`/productinfo/${slug}`);
  };

  if (!productsWithImages.length) {
    return null;
  }

  return (
    <section className={`py-12 ${serifTheme.gradients.background} overflow-hidden`} style={{ fontFamily: serifTheme.fontFamily.serif }}>
      <div className="max-w-full">
        {/* Header */}
          {/* Title section removed */}

        {/* Auto-scrolling Products Container */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-8"
            animate={{
              x: [0, -50 * productsWithImages.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: productsWithImages.length * 1,
                ease: "linear",
              },
            }}
          >
            {displayProducts.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                className="flex-shrink-0 w-48 cursor-pointer group"
                onClick={() => handleProductClick(product)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`${serifTheme.gradients.card} backdrop-blur-xl ${serifTheme.radius.card} overflow-hidden shadow-lg hover:shadow-xl border ${serifTheme.colors.border.primary} hover:border-amber-300/80 ${serifTheme.transitions.default}`}>
                  {/* Product Image */}
                  <div className={`aspect-square overflow-hidden ${serifTheme.colors.background.tertiary} p-4`}>
                    <img
                      src={product.productImageUrl}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Title */}
                  <div className="p-4 text-center">
                    <h3 className={`text-sm font-bold ${serifTheme.colors.text.primary} line-clamp-2 hover:text-amber-800 ${serifTheme.transitions.default}`}>
                      {product.title}
                    </h3>
                    <p className={`text-lg font-black ${serifTheme.gradients.accent} mt-2`}>
                      NPR {product.price}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default HorizontalProductGallery;
